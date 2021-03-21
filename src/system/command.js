import {makeLine} from "../console/console";
import {Folder, parsePath, tabCompletePath, TextFile} from "./fs";

export const commands = {
	ls: {
		exec(dir, path) {
			const dirToUse = parsePath(dir, path);
			if (dirToUse == null) {
				return {lines: [makeLine("Error: path not found")]};
			}

			return {lines: Object.keys(dirToUse.children).map(makeLine)};
		},
		tabComplete(dir, args) {
			if (args.length > 1) {
				return null;
			}

			return tabCompletePath(dir, args[0]);
		},
	},
	cd: {
		exec(dir, path) {
			const outDir = parsePath(dir, path);
			if (!(outDir instanceof Folder)) {
				return {lines: [makeLine("Error: path not found")]};
			}

			return {outDir};
		},
		tabComplete(dir, args) {
			if (args.length > 1) {
				return null;
			}

			return tabCompletePath(dir, args[0]);
		},
	},
	clear: {
		exec() {
			return {clear: true};
		},
		tabComplete() {
			return null;
		},
	},
	cat: {
		exec(dir, path) {
			const dirToUse = parsePath(dir, path);
			if (dirToUse == null) {
				return {lines: [makeLine("Error: path not found")]};
			}

			if (!(dirToUse instanceof TextFile)) {
				return {lines: [makeLine("Error: file cannot be read")]};
			}

			return {lines: dirToUse.text.split("\n").map(makeLine)};
		},
		tabComplete(dir, args) {
			if (args.length > 1) {
				return null;
			}

			return tabCompletePath(dir, args[0]);
		},
	},
};

export function tabCompleteCommand(prefix) {
	return Object.keys(commands).find((k) => k.startsWith(prefix));
}

