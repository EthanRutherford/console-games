import {render} from "react-dom";
import {useRef, useState} from "react";
import {Console, makeLine} from "./console/console";
import {ExeFile, Folder, LinkFile, parsePath, tabCompletePath} from "./system/fs";
import {commands, tabCompleteCommand} from "./system/command";
import {ChooseYourOwnAdventure} from "./cyoa/cyoa";
import {RaceGame} from "./racegame/racegame";
import "./styles/reset";

const fileSystem = new Folder({
	ethan: new Folder({
		stuff: new Folder({
			["cyoa.exe"]: new ExeFile(ChooseYourOwnAdventure),
			["racegame.exe"]: new ExeFile(RaceGame),
		}),
		source: new Folder({}),
	}),
	links: new Folder({
		["github.link"]: new LinkFile("https://github.com/ethanrutherford"),
		["jigsaw.link"]: new LinkFile("https://jigsaw.rutherford.site"),
		["sudoku.link"]: new LinkFile("https://sudoku.rutherford.site"),
	}),
}, true);

function prompt(dir) {
	return makeLine([
		{text: "guest@fakepooter ", color: "green"},
		{text: dir.path, color: "yellow"},
	]);
}

function App() {
	const [dir, setDir] = useState(fileSystem.children.ethan.children.stuff);
	const [lines, setLines] = useState([prompt(dir)]);
	const console = useRef();

	if (dir instanceof ExeFile) {
		return <dir.Component exit={() => setDir(dir.parent)} />;
	}

	return (
		<Console
			title="Ethan Rutherford's stuff"
			lines={lines}
			prompt=">&nbsp;"
			onInput={(text) => {
				const newLines = [makeLine(`> ${text}`)];
				let outDir = null;

				const parts = text.trim().split(/\s+/);
				if (parts.length > 0) {
					const file = parsePath(dir, parts[0]);
					const command = commands[parts[0]];

					if (file instanceof ExeFile) {
						setDir(file);
					} else if (file instanceof LinkFile) {
						window.open(file.link);
					} else if (command != null) {
						const result = command.exec(dir, ...parts.slice(1));
						outDir = result.outDir;
						if (result.clear) {
							newLines.splice(0, newLines.length);
							setLines([]);
						}
						if (result.lines != null) {
							newLines.push(...result.lines);
						}
					} else {
						newLines.push(makeLine(`unknown command "${text}"`));
					}
				}

				if (outDir != null) {
					setDir(outDir);
				}

				newLines.push(prompt(outDir ?? dir));
				setLines((cur) => cur.concat(newLines).slice(-1000));
				setTimeout(() => console.current?.scrollToBottom(), 1);
			}}
			onTab={(text) => {
				const parts = text.trim().split(/\s+/);
				if (parts.length === 0) {
					return null;
				}

				if (parts.length === 1) {
					return tabCompleteCommand(parts[0]) ?? tabCompletePath(dir, parts[0]);
				}

				const command = commands[parts[0]];
				if (command == null) {
					return null;
				}

				const completion = command.tabComplete(dir, parts.slice(1));
				if (completion == null) {
					return null;
				}

				return parts.slice(0, -1).concat(completion).join(" ");
			}}
			ref={console}
		/>
	);
}

render(<App />, document.getElementById("react-root"));
