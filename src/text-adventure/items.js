import {makeLine} from "../console/make-line";

export class Item {
	constructor(itemDef) {
		this.name = itemDef.name;
		this.desc = itemDef.desc;
		this.power = itemDef.power ?? 0;
		this.consumable = itemDef.edible ?? itemDef.consume ?? false;
		this.edible = itemDef.edible ?? false;
	}
	look() {
		return [makeLine(`[f:green](${this.name}): ${this.desc}`)];
	}
}

export function itemListToString(items) {
	let string = "";
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (items.length === 1) {
			string += `a [f:green](${item.name}).`;
		} else if (i < items.length - 1) {
			string += `a [f:green](${item.name}), `;
		} else {
			string += `and a [f:green](${item.name}).`;
		}
	}

	return string;
}
