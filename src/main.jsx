import {render} from "react-dom";
import {useRef, useState} from "react";
import {Console, makeLine} from "./console/console";
import {ChooseYourOwnAdventure} from "./cyoa/cyoa";
import "./styles/reset";

const files = [
	{name: "cyoa.exe", Component: ChooseYourOwnAdventure},
];

function prompt(path) {
	return makeLine([
		{text: "guest@fakepooter ", color: "green"},
		{text: path, color: "yellow"},
	]);
}

function App() {
	const [lines, setLines] = useState([prompt("/ethan/stuff")]);
	const [app, setApp] = useState(null);
	const exit = () => setApp(null);
	const console = useRef();

	if (app != null) {
		return <app.Component exit={exit} />;
	}

	return (
		<Console
			title="Ethan Rutherford's stuff"
			lines={lines}
			prompt=">&nbsp;"
			onInput={(text) => {
				const newLines = [makeLine(`> ${text}`)];
				const file = files.find((f) => f.name === text);

				if (file != null) {
					setApp(file);
				} else if (text.trim() === "ls") {
					newLines.push(...files.map((f) => makeLine(f.name)));
				} else {
					newLines.push(makeLine(`unknown command "${text}"`));
				}

				newLines.push(prompt("/ethan/stuff"));
				setLines((cur) => cur.concat(newLines).slice(-1000));
				setTimeout(() => console.current?.scrollToBottom(), 1);
			}}
			onTab={(text) => {
				const prefix = text.trim();
				if (prefix.length === 0) {
					return null;
				}

				const file = files.find((f) => f.name.startsWith(prefix));
				if (file != null) {
					return file.name;
				}

				return null;
			}}
			ref={console}
		/>
	);
}

render(<App />, document.getElementById("react-root"));
