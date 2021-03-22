import {makeLine} from "../console/console";
import {Creature, NPC} from "./beings";
import {Item, itemListToString} from "./items";
import {Aesthetic, Container, Interactive, makeObject} from "./objects";

class Room {
	constructor(roomDef) {
		this.name = roomDef.name;
		this.desc = roomDef.desc;
		this.state = roomDef.state ?? "normal";
		this.items = [];
		this.objects = [];
		this.npcs = [];
		this.creature = roomDef.creature != null ? new Creature(roomDef.creature) : null;
		this.doors = {};
		this.links = {};

		for (const itemDef of roomDef.items ?? []) {
			this.items.push(new Item(itemDef));
		}

		for (const objectDef of roomDef.objects ?? []) {
			this.objects.push(makeObject(objectDef));
		}

		for (const npcDef of roomDef.npcs ?? []) {
			this.npcs.push(new NPC(npcDef));
		}

		for (const [dir, doorDef] of Object.entries(roomDef.doors ?? {})) {
			this.doors[dir] = new Interactive(doorDef);
		}
	}
	look() {
		if (this.state === "dark") {
			return [makeLine("It's so dark you can't see anything... You must turn back.")];
		}

		const lines = [makeLine(this.desc)];

		if (this.creature?.hostile) {
			return lines.concat(makeLine(`There's a [f:#f0cccc](${this.creature.name}) here!`));
		}

		// partition objects into containers and non-containers
		const [objects, containers] = this.objects.reduce(([os, cs], cur) => {
			(cur instanceof Container ? cs : os).push(cur);
			return [os, cs];
		}, [[], []]);

		if (objects.length !== 0) {
			let string = "There is ";
			for (let i = 0; i < objects.length; i++) {
				const obj = objects[i];
				const name = obj instanceof Aesthetic ? obj.name : `[f:blue](${obj.name})`;

				if (objects.length === 1) {
					string += `a ${name}.`;
				} else if (i < objects.length - 1) {
					string += `a ${name}, `;
				} else {
					string += `and a ${name}.`;
				}
			}

			lines.push(makeLine(string));
		}

		if (containers.length !== 0) {
			let string = "You can see ";
			for (let i = 0; i < containers.length; i++) {
				const box = containers[i];
				const name = `[f:yellow](${box.name})`;

				if (containers.length === 1) {
					string += `a ${name}.`;
				} else if (i < objects.length - 1) {
					string += `a ${name}, `;
				} else {
					string += `and a ${name}.`;
				}
			}

			lines.push(makeLine(string));
		}

		if (this.state === "flooded") {
			return lines.concat(makeLine("It is flooded to the point you can't navigate. You must go back the way you came."));
		}

		const linkEntries = Object.entries(this.links).filter(([, r]) => r.state !== "hidden");
		if (linkEntries.length > 0 || this.items.length > 0) {
			let string = "Looking around, you see that ";
			for (let i = 0; i < linkEntries.length; i++) {
				const [dir, room] = linkEntries[i];
				const door = this.doors[dir];

				const dirName = `[f:magenta](${dir})`;
				if (door != null && !door.activated) {
					const doorName = `[f:cyan](${door.name})`;
					string += `the way ${dirName} is barred by the ${doorName}`;
				} else {
					const roomName = `[f:cyan](${room.name})`;
					string += `you can go ${dirName} to enter the ${roomName}`;
				}

				if (i === linkEntries.length - 1) {
					string += this.items.length === 0 ? "." : ", and ";
				} else {
					string += ", ";
				}
			}

			if (this.items.length !== 0) {
				string += "lying about is " + itemListToString(this.items);
			}

			lines.push(makeLine(string));
		}

		if (this.npcs.length > 0) {
			let string = "Nearby you see ";
			const beings = [...this.npcs, this.creature].filter((e) => e);
			for (let i = 0; i < beings.length; i++) {
				const being = beings[i];
				if (beings.length === 1) {
					string += `[f:#ccccf0](${being.name}).`;
				} else if (i < beings.length - 1) {
					string += `[f:##ccccf0](${being.name}), `;
				} else {
					string += `and [f:##ccccf0](${being.name}).`;
				}
			}

			lines.push(makeLine(string));
		}

		return lines;
	}
	find(target) {
		if (this.creature?.name.toLowerCase() === target) {
			return this.creature;
		}

		const item = this.items.find((i) => i.name.toLowerCase() === target);
		if (item) {
			return item;
		}

		const obj = this.objects.find((o) => o.name.toLowerCase() === target);
		if (obj) {
			return obj;
		}

		const door = Object.values(this.doors).find((d) => d.name.toLowerCase() === target);
		if (door) {
			return door;
		}

		const npc = this.npcs.find((n) => n.name.toLowerCase() === target);
		if (npc) {
			return npc;
		}

		const openBoxes = this.objects.filter((o) => o instanceof Container && !o.locked);
		for (const openBox of openBoxes) {
			const item = openBox.items.find((i) => i.name.toLowerCase() === target);
			if (item) {
				return item;
			}
		}

		return null;
	}
	takeItem(target) {
		const itemIndex = this.items.findIndex((i) => i.name.toLowerCase() === target);
		if (itemIndex !== -1) {
			return this.items.splice(itemIndex, 1)[0];
		}

		const openBoxes = this.objects.filter((o) => o instanceof Container && !o.locked);
		for (const openBox of openBoxes) {
			const itemIndex = openBox.items.findIndex((i) => i.name.toLowerCase() === target);
			if (itemIndex !== -1) {
				return openBox.items.splice(itemIndex, 1)[0];
			}
		}

		return null;
	}
	findRoom(target) {
		return Object.entries(this.links).find(([dir, room]) => {
			if (room.state === "hidden") {
				return false;
			}

			if (dir.toLowerCase() === target) {
				return true;
			}

			if (room.name.toLowerCase() === target && (this.doors[dir]?.activated ?? true)) {
				return true;
			}

			return false;
		});
	}
}

export class GameMap {
	constructor(mapDef) {
		this.story = mapDef.story;

		// initialize rooms, and make a map of room name -> room
		const rooms = [];
		const roomMap = {};
		for (const roomDef of mapDef.rooms) {
			const room = new Room(roomDef);
			rooms.push([roomDef, room]);
			roomMap[room.name] = room;
		}

		// use room map to now link rooms and interactives together
		for (const [roomDef, room] of rooms) {
			for (const [dir, linkedRoomName] of Object.entries(roomDef.links ?? {})) {
				room.links[dir] = roomMap[linkedRoomName];
				for (const interactive of room.objects.filter((o) => o instanceof Interactive)) {
					interactive.linkedRoom = roomMap[interactive.linkedRoomName];
				}
			}
		}

		// first room in room list is the starting room
		this.currentRoom = rooms[0][1];
	}
}
