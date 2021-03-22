import {useMemo, useState} from "react";
import {Console} from "../console/console";
import {ReadMe} from "../readme/readme";
import {Game} from "./game";
import readme from "./README.md";
import defaultDef from "./ethangame.json";

export function TextAdventure({exit}) {
	const [lines, setLines] = useState();
	const game = useMemo(() => new Game(defaultDef, setLines), []);

	return (
		<>
			<Console
				title="Text Adventure"
				lines={lines}
				prompt=">&nbsp;"
				exit={exit}
				onInput={game.onInput}
			/>
			<ReadMe markdown={readme} />
		</>
	);
}
