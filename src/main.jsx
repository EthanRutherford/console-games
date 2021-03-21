import {render} from "react-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {Console, makeLine} from "./console/console";
import {ReadMe} from "./readme/readme";
import {ExeFile, Folder, LinkFile, parsePath, tabCompletePath} from "./system/fs";
import {commands, tabCompleteCommand} from "./system/command";
import {sourceFiles} from "./source";
import {ChooseYourOwnAdventure} from "./cyoa/cyoa";
import {RaceGame} from "./racegame/racegame";
import styles from "./styles/root";

const HISTORY_KEY = "commandHistory";
function getHistory() {
	const stored = localStorage.getItem(HISTORY_KEY);
	const commands = stored != null ? JSON.parse(stored) : [];
	return {
		commands,
		index: commands.length,
	};
}
function saveHistory(commands) {
	localStorage.setItem(HISTORY_KEY, JSON.stringify(commands));
}

const fileSystem = new Folder({
	ethan: new Folder({
		stuff: new Folder({
			["cyoa.exe"]: new ExeFile(ChooseYourOwnAdventure),
			["racegame.exe"]: new ExeFile(RaceGame),
		}),
		source: new Folder(sourceFiles),
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
	const history = useMemo(getHistory, []);
	const [lines, setLines] = useState([prompt(dir)]);
	const consoleRef = useRef();
	useEffect(() => {
		if (!(dir instanceof ExeFile)) {
			setTimeout(() => consoleRef.current?.scrollToBottom(), 1);
			const keyPress = (event) => {
				const modified = event.ctrlKey || event.shiftKey;
				const canUp = history.index > 0;
				const canDown = history.index < history.commands.length;
				if (!modified && event.key === "ArrowUp" && canUp) {
					event.preventDefault();
					history.index--;
					consoleRef.current.setContent(history.commands[history.index]);
				} else if (!modified && event.key === "ArrowDown" && canDown) {
					event.preventDefault();
					history.index++;
					consoleRef.current.setContent(history.commands[history.index] ?? "");
				}
			};
			document.addEventListener("keydown", keyPress);
			return () => document.removeEventListener("keydown", keyPress);
		}

		return null;
	}, [dir instanceof ExeFile]);

	return (
		<div className={styles.container}>
			{dir instanceof ExeFile ? (
				<dir.Component exit={() => setDir(dir.parent)} />
			) : (
				<Console
					title="Ethan Rutherford's stuff"
					lines={lines}
					prompt=">&nbsp;"
					onInput={(text) => {
						if (text !== history[history.length - 1]) {
							history.commands = history.commands.filter((c) => c !== text);
							history.commands.push(text);
							if (history.length > 1000) {
								history.splice(0, 1);
							}

							history.index = history.commands.length;
							saveHistory(history.commands);
						}

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
						setTimeout(() => consoleRef.current?.scrollToBottom(), 1);
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
					ref={consoleRef}
				/>
			)}
			{dir.readme != null && (
				<ReadMe markdown={dir.readme} />
			)}
		</div>
	);
}

render(<App />, document.getElementById("react-root"));
