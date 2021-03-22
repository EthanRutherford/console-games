import {forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState} from "react";
import styles from "./console.css";

function Line({content}) {
	return (
		<div className={styles.bufferLine}>
			{content.map((item, index) => (
				<span
					style={{color: item.color, backgroundColor: item.backgroundColor}}
					key={index}
				>
					{item.text}
				</span>
			))}
		</div>
	);
}

const forwardedConsole = forwardRef(Console);
export {forwardedConsole as Console};

function Console({title, prompt, lines, onInput, onTab, exit, initHistory = () => []}, ref) {
	const history = useMemo(() => {
		const commands = initHistory();
		return {commands, index: commands.length};
	}, []);

	const [size, setSize] = useState(null);
	const buffer = useRef();
	const measurer = useRef();
	const input = useRef();

	useLayoutEffect(() => {
		const parent = measurer.current.parentElement;
		const diff = parent.offsetWidth - parent.clientWidth;
		setSize({
			width: `${measurer.current.offsetWidth * 80 + diff}px`,
			height: `${measurer.current.parentElement.offsetHeight * 25}px`,
		});

		input.current?.focus();

		const setInput = (text) => {
			input.current.innerText = text;
			input.current.focus();
			document.execCommand("selectAll", false, null);
			document.getSelection().collapseToEnd();
		};

		const keyPress = (event) => {
			const modified = event.ctrlKey || event.shiftKey;
			const canUp = history.index > 0;
			const canDown = history.index < history.commands.length;
			if (!modified && event.key === "ArrowUp" && canUp) {
				event.preventDefault();
				history.index--;
				setInput(history.commands[history.index]);
			} else if (!modified && event.key === "ArrowDown" && canDown) {
				event.preventDefault();
				history.index++;
				setInput(history.commands[history.index] ?? "");
			} else if (event.ctrlKey && event.key === "c" && exit != null) {
				exit();
			}
		};

		document.addEventListener("keydown", keyPress);
		return () => document.removeEventListener("keydown", keyPress);
	}, []);

	useLayoutEffect(() => {
		buffer.current.scrollTop = buffer.current.scrollHeight;
	}, [lines]);

	useImperativeHandle(ref, () => ({
		focus: () => input.current?.focus,
		getHistory: () => history.commands,
	}));

	return (
		<div className={styles.consoleSkin} onClick={() => input.current?.focus()}>
			<div className={styles.title}>
				{title}
			</div>
			<div className={styles.consoleBuffer} style={size} ref={buffer}>
				{size == null ? (
					<div className={styles.bufferLine}>
						<span ref={measurer}>a</span>
					</div>
				) : lines.map((line) => (
					<Line content={line.content} key={line.id} />
				))}
				{onInput != null && (
					<>
						{prompt}
						<div
							className={styles.input}
							spellCheck={false}
							contentEditable
							onKeyDown={(event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									const text = input.current.innerText;
									history.commands = history.commands.filter((c) => c !== text);
									history.commands.push(text);
									if (history.length > 1000) {
										history.splice(0, 1);
									}

									history.index = history.commands.length;
									onInput(input.current.innerText);
									input.current.innerText = "";
								}
								if (event.key === "Tab" && onTab != null) {
									event.preventDefault();
									const result = onTab(input.current.innerText);
									if (result != null) {
										input.current.innerText = result;
										input.current.focus();
										document.execCommand("selectAll", false, null);
										document.getSelection().collapseToEnd();
									}
								}
							}}
							onPaste={(event) => {
								event.preventDefault();
								const text = event.clipboardData.getData("text/plain");
								document.execCommand("insertText", false, text);
							}}
							ref={input}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export {makeLine} from "./make-line";
