//ConsoleBuffer.h
#ifndef CONSOLEBUFFER_H
#define CONSOLEBUFFER_H
#include "Windows.h"

const int SCREEN_WIDTH = 80; // this is the typical width for CMD.exe
const int SCREEN_HEIGHT = 30; // works for "restored" cmd window

class ConsoleBuffer
{// represents a console buffer that operates within the given constant limits SCREEN_WIDTH and SCREEN_HEIGHT
public:
	enum ConsoleColorAttrib
	{
		Black = 0x00,
		ForeBlue = 0x01,
		ForeGreen = 0x02,
		ForeCyan = 0x03,
		ForeRed = 0x04,
		BoldFore = 0x08,
		ForeLBlue = 0x09,
		BackBlue = 0x10,
		BackGreen = 0x20,
		BackRed = 0x40,
		BoldBack = 0x80
	};
	ConsoleBuffer();
	~ConsoleBuffer();
	void print() const;
	void write_at(int col,int row,char data);
	void chng_color_at(int col,int row,ConsoleColorAttrib color);
	void trickle_down();
	void trickle_up();
	CHAR_INFO* operator [](int);
	const CHAR_INFO* operator [](int) const;
	operator void*() const;
protected:
	bool _failState;
private:
	HANDLE _hConsole;
	CHAR_INFO _buf[SCREEN_HEIGHT][SCREEN_WIDTH];
	COORD _bufCoord;
};

#endif