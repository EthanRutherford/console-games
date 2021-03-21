import styles from "./readme.css";

export function ReadMe({markdown, children}) {
	return	(
		<div className={styles.readmeWrapper}>
			<h1 className={styles.readmeHeader}>
				README.md
			</h1>
			<div
				className={styles.markdown}
				dangerouslySetInnerHTML={{__html: markdown}}
			/>
			{children != null && (
				<div className={styles.footer}>
					{children}
				</div>
			)}
		</div>
	);
}
