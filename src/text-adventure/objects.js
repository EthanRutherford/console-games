import {makeLine} from "../console/make-line";
import {Item, itemListToString} from "./items";

export class Aesthetic {
	constructor(def) {
		this.name = def.name;
		this.desc = def.desc;
	}
	look() {
		return [makeLine(this.desc)];
	}
}

export class Container {
	constructor(def) {
		this.name = def.name;
		this.lockedBy = def.lock;
		this.items = [];
		for (const itemDef of def.items) {
			this.items.push(new Item(itemDef));
		}

		this.locked = this.lockedBy != null;
	}
	look() {
		if (this.locked) {
			return [makeLine(`It won't open. You need to find the [f:green](${this.lockedBy}).`)];
		}

		return [makeLine(`Inside the [f:yellow](${this.name}) you find ${itemListToString(this.items)}`)];
	}
}

export class Interactive {
	constructor(def) {
		this.name = def.name;
		this.desc = def.desc;
		this.activator = def.activator;
		this.linkedRoomName = def.linkedRoom;
		this.linkedRoom = null;
		this.successMsg = def.successMsg;
		this.failMsg = def.failMsg;

		this.activated = false;
	}
	look() {
		return [makeLine(this.desc)];
	}
}

export function makeObject(def) {
	if (def.kind === "aesthetic") {
		return new Aesthetic(def);
	}

	if (def.kind === "container") {
		return new Container(def);
	}

	if (def.kind === "interactive") {
		return new Interactive(def);
	}

	throw new Error(`invalid object kind: "${def.kind}"`);
}
