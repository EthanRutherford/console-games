let nextLineId = 0;

function parseColored(parent, rawString, index) {
	const part = {...parent, text: ""};
	for (let i = 0; i < 2 && rawString[index] !== "]"; i++) {
		let colorKey;
		if (rawString[index + 1] === "f") {
			colorKey = "color";
		} else if (rawString[index + 1] === "b") {
			colorKey = "backgroundColor";
		} else {
			return null;
		}

		if (rawString[index + 2] !== ":") {
			return null;
		}

		index += 3;
		const validChar = /[#a-z0-9]/i;
		const breakChars = new Set(["]", ","]);

		let color = "";

		while (!breakChars.has(rawString[index]) && color.length < 25) {
			const char = rawString[index] ?? "";
			if (!validChar.test(char)) {
				return null;
			}

			color += char;
			index++;
		}

		part[colorKey] = color;
	}

	if (rawString[index] !== "]" || rawString[index + 1] !== "(") {
		return null;
	}

	return parseText(part, rawString, index + 2, true);
}

function parseText(part, rawString, index = 0, inner = false) {
	const parts = [];
	const commitPart = () => {
		if (part.text.length > 0) {
			parts.push(part);
		}

		part = {...part, text: ""};
	};

	while (index < rawString.length) {
		const char = rawString[index];
		if (char === ")" && inner) {
			commitPart();
			return {index: index + 1, parts};
		}

		if (char === "[") {
			const result = parseColored(part, rawString, index);
			if (result != null && result.parts.length !== 0) {
				commitPart();
				parts.push(...result.parts);
				index = result.index;
				continue;
			}
		}

		part.text += char;
		index++;
	}

	commitPart();
	return {index, parts};
}

export function makeLine(rawString) {
	const line = {id: nextLineId++, content: []};
	if (rawString.length === 0) {
		return line;
	}

	const result = parseText({text: ""}, rawString);
	line.content = result.parts;
	return line;
}
