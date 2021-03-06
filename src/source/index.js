import {LinkFile, TextFile} from "../system/fs";
import readme from "./README.md";
import consoleBufferCpp from "./ConsoleBuffer.cpp";
import consoleBufferH from "./ConsoleBuffer.h";
import cyoa from "./cyoa.cpp";
import query from "./query.txt";
import racegame from "./racegame.cpp";
import racegame2 from "./racegame2.cpp";
import racegame21 from "./racegame2.1.cpp";
import racegame3 from "./racegame3.cpp";
import racegame31 from "./racegame3.1.cpp";
import story from "./story.txt";

export const sourceFiles = {
	readme,
	["ConsoleBuffer.cpp"]: new TextFile(consoleBufferCpp),
	["ConsoleBuffer.h"]: new TextFile(consoleBufferH),
	["cyoa.cpp"]: new TextFile(cyoa),
	["query.txt"]: new TextFile(query),
	["racegame.cpp"]: new TextFile(racegame),
	["racegame2.cpp"]: new TextFile(racegame2),
	["racegame2.1.cpp"]: new TextFile(racegame21),
	["racegame3.cpp"]: new TextFile(racegame3),
	["racegame3.1.cpp"]: new TextFile(racegame31),
	["story.txt"]: new TextFile(story),
	["textadventure.link"]: new LinkFile("https://github.com/RogerGee/AdventureGame"),
};
