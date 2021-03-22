import {makeLine} from "../console/make-line";
import {Creature, Player} from "./beings";
import {GameMap} from "./map";
import {Container, Interactive} from "./objects";

export class Game {
	constructor(mapDef, setLines) {
		this.player = new Player();
		this.map = new GameMap(mapDef);
		this.setLines = setLines;
		this.setLines([makeLine(this.map.story)]);
		this.gameOver = false;

		this.onInput = this.onInput.bind(this);
	}
	addLines(lines) {
		this.setLines((l) => l.concat(lines));
	}
	genericHostileMessage() {
		this.addLines(makeLine("You can't do that now, you're being attacked!"));
		return false;
	}
	genericDarkMessage() {
		this.addLines(makeLine("It's too dark to do that."));
		return false;
	}
	genericFloodedMessage() {
		this.addLines(makeLine("There's too much water, you have to turn back."));
		return false;
	}
	parseInput(text) {
		this.addLines(makeLine("> " + text));
		const curRoom = this.map.currentRoom;
		const parts = text.trim().toLowerCase().split(/\s+/);
		const isHostile = curRoom.creature?.hostile ?? false;
		const isDark = curRoom.state === "dark";
		const isFlooded = curRoom.state === "flooded";

		if (parts[0] === "look" || parts[0] === "check") {
			// look for target
			if (parts[0] === "check" || parts.length > 1) {
				const hasAtWord = new Set(["in", "at"]).has(parts[1]);
				const target = hasAtWord ? parts[2] : parts[1];

				// no target specified
				if (target == null) {
					this.addLines(makeLine("Look at what?"));
					return false;
				}

				if (target === "health") {
					this.addLines(this.player.lookHealth());
					return false;
				}

				// can't look at things when it's too dark
				if (isDark) {
					this.addLines(makeLine("It's too dark to see anything."));
					return false;
				}

				if (target === "inventory" || target === "pack") {
					this.addLines(this.player.look());
					return false;
				}

				// check own inventory
				const heldItem = this.player.find(target);
				if (heldItem != null) {
					this.addLines(heldItem.look());
					return false;
				}

				// can't look at things in a flooded room
				if (isFlooded) {
					this.addLines(makeLine("You can't get close enough."));
					return false;
				}

				// check room
				const entity = curRoom.find(target);
				if (entity != null) {
					// no time to look at things while in combat
					if (!(entity instanceof Creature) && curRoom.creature?.hostile) {
						this.addLines(makeLine("You have to focus!"));
						return false;
					}

					this.addLines(entity.look());
					return false;
				}

				// didn't find target
				this.addLines(makeLine("There isn't one of those here."));
				return false;
			}

			// can't look at room when there's an enemy
			if (isHostile && curRoom.state === "normal") {
				this.addLines(makeLine("You don't have time for that, you have to fight!"));
				return false;
			}

			this.addLines(curRoom.look());
			return false;
		}

		if (parts[0] === "take" || parts[0] === "grab") {
			if (isDark) return this.genericHostileMessage();
			if (isFlooded) return this.genericFloodedMessage();
			if (isHostile) return this.genericHostileMessage();

			const item = curRoom.takeItem(parts[1]);
			if (item != null) {
				this.player.items.push(item);
				this.addLines(makeLine("Added to inventory."));
				return false;
			}

			this.addLines(makeLine("No such item."));
			return false;
		}

		if (parts[0] === "open") {
			if (isDark) return this.genericHostileMessage();
			if (isFlooded) return this.genericFloodedMessage();
			if (isHostile) return this.genericHostileMessage();

			const object = curRoom.find(parts[1]);
			if (!(object instanceof Container || object instanceof Interactive)) {
				this.addLines(makeLine("No such object."));
				return false;
			}

			if (parts[2] !== "with" && parts[2] !== "using") {
				this.addLines(makeLine("Open with what?"));
				return false;
			}

			const item = this.player.find(parts[3]);
			if (item == null) {
				this.addLines(makeLine("You don't have one of those."));
				return false;
			}

			if (!this.player.use(item, object)) {
				this.addLines(makeLine(object.failMsg ?? "This item doesn't work"));
				return false;
			}

			this.addLines(makeLine("It is opened."));
			return false;
		}

		if (parts[0] === "use") {
			if (isDark) return this.genericHostileMessage();
			if (isFlooded) return this.genericFloodedMessage();
			if (isHostile) return this.genericHostileMessage();

			if (parts[1] == null) {
				this.addLines(makeLine("Use what?"));
				return false;
			}

			const item = this.player.find(parts[1]);
			if (item == null) {
				this.addLines(makeLine("You don't have one of those."));
				return false;
			}

			if (parts[2] == null) {
				this.addLines(makeLine("This cannot be used on it's own."));
				if (item.edible) {
					this.addLines(makeLine("Did you mean [f:blue](eat)?"));
				}

				return false;
			}

			if (parts[2] !== "on" || parts[3] === null) {
				this.addLines(makeLine("Use on what?"));
				return false;
			}

			const object = curRoom.find(parts[3]);
			if (!(object instanceof Container || object instanceof Interactive)) {
				this.addLines(makeLine("No such object."));
				return false;
			}

			if (!this.player.use(item, object)) {
				this.addLines(makeLine(object.failMsg ?? "This item doesn't work."));
				return false;
			}

			this.addLines(makeLine(object.successMsg ?? "It is opened."));
			return false;
		}

		if (parts[0] === "eat") {
			if (isDark) return this.genericHostileMessage();
			if (isFlooded) return this.genericFloodedMessage();

			if (parts[1] == null) {
				this.addLines(makeLine("Eat what?"));
				return false;
			}

			const item = this.player.find(parts[1]);
			if (item == null) {
				this.addLines(makeLine("You don't have one of those."));
				return false;
			}

			if (!item.edible) {
				this.addLines(makeLine("You can't eat that!"));
				return false;
			}

			const amount = this.player.eat(item);
			this.addLines(makeLine(`You heal [f:green](${amount}) HP.`));
			this.addLines(this.player.lookHealth());
			return true;
		}

		if (parts[0] === "inventory" || parts[0] === "pack") {
			this.addLines(this.player.look());
			return false;
		}

		const isReturn = parts[0] === "return";
		if (parts[0] === "go" || parts[0] === "travel" || isReturn) {
			const target = parts[1] === "to" ? parts[2] : parts[1];
			if (!isReturn && target == null) {
				this.addLines(makeLine("Go where?"));
				return false;
			}

			let result = null;
			if (target === "back" || isReturn) {
				result = curRoom.findRoom(this.map.previousRoom?.name.toLowerCase());
				if (result == null) {
					this.addLines(makeLine("Can't go back!"));
					return false;
				}
			} else {
				if (isDark) return this.genericHostileMessage();
				if (isFlooded) return this.genericFloodedMessage();
				if (isHostile) return this.genericHostileMessage();

				result = curRoom.findRoom(target);
				if (result == null) {
					this.addLines(makeLine("Can't go there!"));
					return false;
				}
			}

			const door = curRoom.doors[result[0]];
			if (door != null && !door.activated) {
				this.addLines(makeLine(`The [f:cyan](${door.name}) blocks the way.`));
				return false;
			}

			this.map.previousRoom = curRoom;

			if (result[1].state === "transition") {
				const finalRoom = result[1].links.north;
				this.map.currentRoom = finalRoom;
				this.setLines([makeLine(result[1].desc)]);
				this.addLines(finalRoom.look());
			} else {
				this.map.currentRoom = result[1];
				this.setLines(result[1].look());
			}

			return false;
		}

		if (parts[0] === "talk") {
			if (isDark) return this.genericHostileMessage();
			if (isFlooded) return this.genericFloodedMessage();
			if (isHostile) return this.genericHostileMessage();

			const target = parts[1] === "to" ? parts[2] : parts[1];
			if (target == null) {
				this.addLines(makeLine("Talk to whom?"));
				return false;
			}

			const npc = curRoom.npcs.find((n) => n.name.toLowerCase() === target);
			if (npc == null) {
				this.addLines(makeLine("There is no one by that name."));
				return false;
			}

			this.addLines(npc.talk());
			return false;
		}

		if (parts[0] === "attack" || parts[0] === "fight") {
			if (isDark) return this.genericHostileMessage();
			if (isFlooded) return this.genericFloodedMessage();
			if (curRoom.creature == null) {
				this.addLines(makeLine("Nothing to attack here"));
				return false;
			}

			let item = null;
			if (parts[1] === "with" || parts[1] === "using") {
				if (parts[2] == null) {
					this.addLines(makeLine(`Attack ${parts[1]} what?`));
					return false;
				}

				item = this.player.items.find((i) => i.name.toLowerCase() === parts[2] && !i.edible);
			}

			const amount = this.player.attack(item);
			curRoom.creature.health -= amount;
			curRoom.creature.hostile = true;
			this.addLines(makeLine(`You inflict ${amount} points of damage.`));
			if (curRoom.creature.health <= 0) {
				this.addLines(makeLine(`[f:#f0cccc](${curRoom.creature.name}) is defeated!`));
				curRoom.creature = null;
			}

			return true;
		}

		if (parts[0] === "die") {
			this.player.health = 0;
			this.addLines(makeLine("This text adventure was just too hard for you. You give up on life."));
			return false;
		}

		if (parts[0] === "poop") {
			this.addLines(makeLine("ewgross"));
			return true;
		}

		if (parts[0] === "clear") {
			this.setLines([]);
			return false;
		}

		this.addLines([
			makeLine("I don't know what that means."),
			makeLine("What would you like to do?"),
		]);

		return false;
	}
	onInput(text) {
		if (this.gameOver) {
			return;
		}

		const advanceCombat = this.parseInput(text);
		const creature = this.map.currentRoom.creature;
		if (advanceCombat && creature?.hostile && this.map.currentRoom.state === "normal") {
			const amount = creature.attack();
			this.player.health -= amount;
			this.addLines(makeLine(`[f:#f0cccc](${creature.name}) inflicts ${amount} points of damage to you.`));
			this.addLines(this.player.lookHealth());
		}

		if (this.player.health <= 0) {
			this.gameOver = true;
			this.addLines([makeLine("[f:red](You have died...)"), makeLine("[f:red](GAME OVER)")]);
		}
	}
}
