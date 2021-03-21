import {useMemo, useState} from "react";
import {Console, makeLine} from "../console/console";
import {ReadMe} from "../readme/readme";
import readme from "./README.md";

const defaultAdventure = {
	start: {
		lines: [
			"Adventure: The Text Adventure!",
			`King- "Sir Edward, I have summoned thee to engage in a quest. The dragon has awakened, and thou must vanquish it."`,
			"Will you accept this quest?",
			"1 - Yes",
			"2 - No!",
		],
		options: ["accept", "decline1"],
	},
	decline1: {
		lines: [
			`"Sir Edward, surely thou shalt accept my request."`,
			`Change your mind?`,
			"1 - I suppose so...",
			"2 - Never!",
		],
		options: ["accept", "decline2"],
	},
	decline2: {
		lines: [
			`"INSOLENT FOOL, THOU SHALT PAY FOR THY DISOBEDIENCE!"`,
			"The king impales you with his spear.",
			"Despite your best efforts, you were unable to dodge the mighty blow.",
			"You have died. GAME OVER",
		],
	},
	accept: {
		lines: [
			`"Good, then be off on your grand adventure."`,
			"You leave the castle, heading out with your trusty steed.",
			"The road ahead branches in two directions.",
			"Which way shall you choose?",
			"1 - Toward Garenhelm",
			"2 - Toward Elfgard",
		],
		options: ["garenhelm", "fakeElfgard"],
	},
	fakeElfgard: {
		lines: [
			"You continue along the path, but trip and fall in a river.",
			"You die the shameful death of drowning. GAME OVER",
		],
	},
	garenhelm: {
		lines: [
			"You head out toward Garenhelm.",
			"On the way, you meet a page named Erick.",
			`"Hello good sir, art thou headed to Garenhelm?"`,
			"1 - Yes",
			"2 - No",
		],
		options: ["erickYes", "erickNo"],
	},
	erickNo: {
		lines: [
			`"NO!" you shout in a mighty rage, and you kill him on the spot.`,
			"He looked too suspicious.",
			"However, his family saw you from their carriage nearby.",
			"Erick's family begins to pursue you.",
			"What do you do?",
			"1 - Stand and fight",
			"2 - Turn and flee",
		],
		options: ["familyFight", "familyFlee"],
	},
	familyFight: {
		lines: [
			"As soon as they draw near, you realize that Erick's father is Sir Valdar, the Great.",
			"He overtakes you before you can flee and slays you with a mighty stroke of his halberd.",
			"You have died. GAME OVER",
		],
	},
	familyFlee: {
		lines: [
			"You flee back to the crossroads.",
			"Which way shall you choose?",
			"1 - Toward Garenhelm",
			"2 - Toward Elfgard",
		],
		options: ["familyReturn", "fleeElfgard"],
	},
	fleeElfgard: {
		lines: [
			"You have escaped Erick's Family.",
			"You continue along the path, but trip and fall in a river.",
			"You die the shameful death of drowning. GAME OVER",
		],
	},
	familyReturn: {
		lines: [
			"Erick's family begins to pursue you.",
			"What do you do?",
			"1 - Stand and fight",
			"2 - Turn and flee",
		],
		options: ["familyFight", "familyFlee"],
	},
	erickYes: {
		lines: [
			`"Oh, then I shalt join Thee."`,
			"You and Erick continue to Garenhelm.",
			"You stop at a store to buy supplies.",
			"What do you buy?",
			"1 - Tuff Gum",
			"2 - Swords and Armor",
		],
		options: ["gum", "swords"],
	},
	swords: {
		lines: [
			`Shopkeeper-"That costs 5000000000 rupees."`,
			`You-"Sir.. One could not possibly even carry that many."`,
			`Shopkeeper-"Then thou shant be buying."`,
			"1 - Tuff Gum",
		],
		options: ["gum"],
	},
	gum: {
		lines: [
			`You-"Well, I suppose I shall purchase the Tuff Gum."`,
			`Shopkeeper-"An excellent purchase."`,
			"The party continues to the Lord's Manor.",
			"Go inside?",
			"1 - Well, duh.",
			"2 - Nerp.",
		],
		options: ["manorYes", "manorNo"],
	},
	manorNo: {
		lines: [
			"At that moment, an assassin mistakes you for the Lord, and fires an arrow into your skull.",
			"You die instantly.	Erick shrugs and continues on his way alone.",
			"Your only friend abandonned you. GAME OVER",
		],
	},
	manorYes: {
		lines: [
			"You enter the Lord's Manor.",
			`Lord-"I am very sorry, but the bridge is out.`,
			`Thou must take the path through Elfgard."`,
			`You leave and return to the crossroad.`,
			"Which way shall you choose?",
			"1 - Toward Elfgard",
			"2 - Toward the King's Castle",
		],
		options: ["elfgard", "castle"],
	},
	castle: {
		lines: [
			"You Proceed to chew the Tuff Gum you purchased earlier.",
			`King-"What art thou doing here?"`,
			`You-"I have come to defeat thee!"`,
			"With Erick's help and the mighty power of Tuff Gum, you kill the King and claim his throne.",
			"The dragon comes, but you were prepared.",
			`"Fire the missiles!" you shout, and the dragon is vanquished.`,
			"The nuclear fallout horribly mutates the people of your Kingdom.",
			"You are a horrible king. THE END.",
		],
	},
	elfgard: {
		lines: [
			"You continue along the path, but trip and fall in a river.",
			"However, Erick catches you by the hand and drags you back on shore.",
			"You proceed to: ",
			"1 - kick the pebble.",
			"2 - thank Erick.",
		],
		options: ["spite", "thanks"],
	},
	spite: {
		lines: [
			`Take that, you spiteful pebble!" you boast triumphantly as you kick the stone you tripped on into the river.`,
			"Erick is not amused.",
			`He pushes you back into the river, mumbling as we walks off, "Ungrateful son of a..."`,
			"You drowned. GAME OVER",
		],
	},
	thanks: {
		lines: [
			"You continue on to the town of Elfgard.",
			`Elf Woman-"Care to help a poor woman?"`,
			"What shall you do?",
			"1 - Help her.",
			"2 - Ignore her.",
		],
		options: ["helpHer", "ignoreHer"],
	},
	helpHer: {
		lines: [
			"Your reach for your wallet, but the woman transforms into a beautiful maiden as you do.",
			`Elf Maiden-"My name is Arour, and thou hast broken my curse.`,
			`I shall join you on your quest."`,
			"You continue on with the aid of Arour to Dragon City.",
			"Which house shall you enter?",
			"1 - Left house",
			"2 - Right house",
		],
		options: ["wrongHouse", "goodHouse"],
	},
	ignoreHer: {
		lines: [
			`"We have not time for thee, we must continue to Dragon City!"`,
			"You continue to Dragon City.",
			"Which house shall you enter?",
			"1 - Left house",
			"2 - Right house",
		],
		options: ["wrongHouse", "badHouse"],
	},
	wrongHouse: {
		lines: [
			`FOOLS, THOU DID NOT CHOOSE THE RIGHT DOOR!"`,
			"You hear a chuckle before you are all struck dead instantly.",
			"You were the victim of a bad pun. GAME OVER",
		],
	},
	goodHouse: {
		lines: [
			"You enter the correct house and meet the Dragon.",
			`"ROOOOOAAAAAAAWWWWWRRRRRRRRR!" the Dragon shouts, as the battle commences!`,
			"What do you do?",
			"1 - Attack!",
			"2 - Dodge!",
		],
		options: ["attack", "dodgeSucceed"],
	},
	badHouse: {
		lines: [
			"You enter the correct house and meet the Dragon.",
			`"ROOOOOAAAAAAAWWWWWRRRRRRRRR!" the Dragon shouts, as the battle commences!`,
			"What do you do?",
			"1 - Attack!",
			"2 - Dodge!",
		],
		options: ["attack", "dodgeFail"],
	},
	attack: {
		lines: ["You go in for the attack, but the Dragon tears your head off. GAME OVER"],
	},
	dodgeFail: {
		lines: [
			"You chew your Tuff gum, hoping it will help you dodge, but it does not.",
			"The Dragon Tears you in half.",
			"As your vision fades, you see Erick fighting the Dragon, alongside another man you've never seen and a beautiful maiden.",
			"You try to call out for help, but you cannot make a sound.",
			"Your life fades... GAME OVER",
		],
	},
	dodgeSucceed: {
		lines: [
			"You chew your Tuff gum, hoping it will help you dodge.",
			"Arour attacks it from the rear, and Erick from the right, keeping the Dragon occupied.",
			"You go in for a blow at the neck, and by some miracle you land a deadly blow on the dragon.",
			"Erick mumbles something about Tuff Gum and lucky shot.",
			"However, you ignore it.",
			"You proceed to: ",
			"1 - kiss Arour.",
			"2 - boast your victory.",
		],
		options: ["kiss", "boast"],
	},
	kiss: {
		lines: [
			"Despite both of you being covered in filthy dragon giblets, you make out with Arour.",
			`Erick grumbles "Come on, let's go already.`,
			"You head back to the castle, and the King rewards you each handsomely.",
			"You say your goodbyes to Erick and he continues his own journey.",
			"Then you and Arour get married and live above-averagely ever after.",
			"THE END",
		],
	},
	boast: {
		lines: [
			`"HA! No dragon can best me!" you boast.`,
			"Arour is disgusted at your boastfulness, and leaves in a huff.",
			"You shrug it off and continue on your boastful way back home.",
			"Erick grumbles the whole way back, but you ignore him.",
			"The King rewards you each handsomely, and Erick storms out.",
			"Later, Erick becomes Overlord of the Undead and Commander of Demons.",
			"You become the first man on the moon, due to the Kingdom's impressive Aerospace program.",
			"THE END?",
		],
	},
};

export function ChooseYourOwnAdventure({exit}) {
	const endings = useMemo(
		() => Object.values(defaultAdventure).filter((e) => e.options == null).length,
		[],
	);
	const found = useMemo(() => new Set(), []);
	const [entry, setEntry] = useState(defaultAdventure.start);

	return (
		<>
			<Console
				title="Choose your own adventure"
				lines={entry.lines.map(makeLine)}
				exit={exit}
				onInput={(text) => {
					if (entry.options == null) {
						setEntry(defaultAdventure.start);
					} else {
						const number = Number.parseInt(text, 10);
						if (!Number.isNaN(number)) {
							const next = defaultAdventure[entry.options[number - 1]];
							setEntry(next);
							if (next.options == null) {
								found.add(next);
							}
						}
					}
				}}
			/>
			<ReadMe markdown={readme}>
				{found.size} of {endings} endings found
			</ReadMe>
		</>
	);
}
