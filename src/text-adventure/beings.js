import {makeLine} from "../console/make-line";
import {itemListToString} from "./items";
import {Container, Interactive} from "./objects";

export class Player {
	constructor() {
		this.health = 100;
		this.maxHealth = 100;
		this.power = 10;
		this.items = [];
	}
	look() {
		return [
			makeLine("Inventory:"),
			makeLine(itemListToString(this.items)),
		];
	}
	lookHealth() {
		const ratio = this.health / this.maxHealth;
		const string = `Current health: ${this.health}/${this.maxHealth}`;
		return [makeLine(ratio < .15 ? `[f:red](${string})` : string)];
	}
	find(target) {
		return this.items.find((i) => i.name.toLowerCase() === target);
	}
	eat(item) {
		const maxHeal = this.maxHealth - this.health;
		const amount = Math.min(maxHeal, item.power + (Math.floor(Math.random() * 5) - 2));
		this.health += amount;
		this.removeItem(item);
		return amount;
	}
	use(item, target) {
		if (target instanceof Interactive && target.activator === item.name) {
			target.activated = true;
			if (target.linkedRoom != null) {
				target.linkedRoom.state = "normal";
			}

			if (item.consumable) {
				this.removeItem(item);
			}

			return true;
		}

		if (target instanceof Container && target.lockedBy === item.name) {
			target.locked = false;
			if (item.consumable) {
				this.removeItem(item);
			}

			return true;
		}

		return false;
	}
	removeItem(item) {
		const index = this.items.indexOf(item);
		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
	attack(item) {
		const power = this.power + (item?.power ?? 0);
		return power + (Math.floor(Math.random() * 5) - 2);
	}
}

export class NPC {
	constructor(def) {
		this.name = def.name;
		this.desc = def.desc;
		this.messages = def.messages;

		this.messageIndex = 0;
	}
	look() {
		return [makeLine(this.desc)];
	}
	talk() {
		const message = this.messages[this.messageIndex];
		if (this.messageIndex < this.messages.length - 1) {
			this.messageIndex++;
		}

		return makeLine(message);
	}
}

export class Creature {
	constructor(creatureDef) {
		this.name = creatureDef.name;
		this.desc = creatureDef.desc;
		this.health = creatureDef.health;
		this.power = creatureDef.power;
		this.hostile = creatureDef.hostile ?? false;
	}
	look() {
		return [makeLine(this.desc)];
	}
	attack() {
		return this.power + (Math.floor(Math.random() * 5) - 2);
	}
}
