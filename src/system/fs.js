function pathify(folder, path) {
	folder.path = path;
	for (const [name, child] of Object.entries(folder.children)) {
		if (child instanceof Folder) {
			pathify(child, `${path}/${name}`);
		}
	}
}

export class Folder {
	constructor(children, isRoot) {
		this.children = children;
		for (const child of Object.values(children)) {
			child.parent = this;
		}

		if (isRoot) {
			pathify(this, "");
			this.path = "/";
		}
	}
}

export class TextFile {
	constructor(text) {
		this.text = text.replace(/\r/g, "");
	}
}

export class ExeFile {
	constructor(component) {
		this.Component = component;
	}
}

export class LinkFile {
	constructor(link) {
		this.link = link;
	}
}

export function parsePath(dir, path) {
	if (path == null) {
		return dir;
	}

	const parts = path.split("/");
	if (parts[0] === "") {
		parts.splice(0, 1);
		while (dir.parent != null) {
			dir = dir.parent;
		}
	}

	for (const part of parts) {
		if (part === "..") {
			if (dir.parent) {
				dir = dir.parent;
			}
		} else if (part === "." || part === "") {
			// dir = dir
		} else if (dir.children?.[part] == null) {
			return null;
		} else {
			dir = dir.children[part];
		}
	}

	return dir;
}

export function tabCompletePath(dir, path) {
	const parts = path.split("/");
	if (parts.length === 0) {
		return null;
	} else if (parts.length > 1) {
		dir = parsePath(dir, parts.slice(0, -1).join("/"));
	}

	const prefix = parts[parts.length - 1].toLowerCase();
	if (prefix.length === 0) {
		return null;
	}

	const fileName = Object.keys(dir.children).find((k) => k.toLowerCase().startsWith(prefix));
	if (fileName != null) {
		return parts.slice(0, -1).concat(fileName).join("/");
	}

	return null;
}
