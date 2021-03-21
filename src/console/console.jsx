import {forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState} from "react";
import styles from "./console.css";

const arrayWrap = (arr) => arr instanceof Array ? arr : [arr];
function Line({content}) {
	return (
		<div className={styles.bufferLine}>
			{typeof content === "string" ? content : arrayWrap(content).map((item, index) => (
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

let nextLineId = 0;
export const makeLine = (content) => ({id: nextLineId++, content});

const forwardedConsole = forwardRef(Console);
export {forwardedConsole as Console};

function Console({title, prompt, lines, onInput, onTab, exit}, ref) {
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
		if (exit == null) {
			return () => {};
		}

		const exitHandler = (event) => {
			if (event.ctrlKey && event.key === "c") {
				exit();
			}
		};
		document.addEventListener("keydown", exitHandler);
		return () => document.removeEventListener("keydown", exitHandler);
	}, []);

	useImperativeHandle(ref, () => ({
		focus: () => input.current?.focus,
		scrollToBottom: () => buffer.current.scrollTop = buffer.current.scrollHeight,
		setContent: (content) => {
			input.current.innerText = content;
			input.current.focus();
			document.execCommand("selectAll", false, null);
			document.getSelection().collapseToEnd();
		},
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

