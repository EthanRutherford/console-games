import {useEffect, useState} from "react";
import {Console, makeLine} from "../console/console";

const WIDTH = 10;
const PADDING = 20;
const MIN_X = PADDING;
const MAX_X = 80 - PADDING - WIDTH;

function makeGameLine(left) {
	const right = 80 - (left + WIDTH);
	return makeLine([
		{text: arrayOf(left, () => " ").join(""), backgroundColor: "green"},
		{text: arrayOf(WIDTH, () => " ").join("")},
		{text: arrayOf(right, () => " ").join(""), backgroundColor: "green"},
	]);
}

const arrayOf = (length, getItem) => new Array(length).fill(0).map(getItem);
class Game {
	constructor(setLines) {
		this.setLines = setLines;
		this.animFrame = null;
		this.leftKey = false;
		this.rightKey = false;

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}
	handleKeyDown(event) {
		if (event.key === "ArrowLeft") {
			this.leftKey = true;
		} else if (event.key === "ArrowRight") {
			this.rightKey = true;
		}
	}
	handleKeyUp(event) {
		if (event.key === "ArrowLeft") {
			this.leftKey = false;
		} else if (event.key === "ArrowRight") {
			this.rightKey = false;
		}
	}
	start() {
		this.setLines(arrayOf(25, () => makeGameLine(35)));

		let speed = 66;
		let pos = 40;
		let left = 35;
		let pathDir = 0;

		let frameNumber = 0;
		let prevStamp = performance.now();
		let acc = 0;
		const step = () => {
			this.animFrame = requestAnimationFrame(step);

			const stamp = performance.now();
			acc += stamp - prevStamp;
			prevStamp = stamp;
			if (acc < speed) {
				return;
			}

			acc %= speed;
			frameNumber++;

			if (frameNumber % 50 === 0 && speed > 35) {
				speed--;
			}

			if (frameNumber > 10 && frameNumber % 8 === 0) {
				pathDir = Math.floor(Math.random() * 3) - 1;
			}

			if (frameNumber % 2 === 0) {
				const newLeft = left + pathDir;
				if (newLeft >= MIN_X && newLeft <= MAX_X) {
					left = newLeft;
				}
			}

			if (this.leftKey) {
				pos--;
			} else if (this.rightKey) {
				pos++;
			}

			this.setLines((curLines) => {
				const newLines = curLines.slice(1);
				newLines.push(makeGameLine(left));

				const leftWall = newLines[10].content[0].text.length;
				const rightWall = leftWall + WIDTH;
				if (pos < leftWall || pos >= rightWall) {
					this.end();
					newLines[10] = makeLine(`Game Over, you lasted ${frameNumber} meters`);
				} else {
					const leftCount = pos - leftWall;
					newLines[10].content.splice(1, 1,
						{text: arrayOf(leftCount, () => " ").join("")},
						{text: "V", color: "blue"},
						{text: arrayOf(9 - leftCount, () => " ").join("")},
					);
				}

				return newLines;
			});
		};

		step();
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
	}
	end() {
		cancelAnimationFrame(this.animFrame);
		document.removeEventListener("keydown", this.handleKeyDown);
		document.removeEventListener("keyup", this.handleKeyUp);
	}
}

export function RaceGame({exit}) {
	const [lines, setLines] = useState();
	useEffect(() => {
		const game = new Game(setLines);
		game.start();
		return () => game.end();
	}, []);

	return (
		<Console
			title="RaceGame"
			lines={lines}
			exit={exit}
		/>
	);
}
