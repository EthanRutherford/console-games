#include "ConsoleBuffer.h"

ConsoleBuffer::ConsoleBuffer()
{
	_failState = false;
	// get console handle
	_hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	if (!_hConsole)
		_failState = true;
	// set the buffer coordinate
	_bufCoord.X = 0;
	_bufCoord.Y = 0;
	// initialize buffer data to space
	for (int row = 0;row<SCREEN_HEIGHT;row++)
		for (int col = 0;col<SCREEN_WIDTH;col++)
		{
			_buf[row][col].Attributes = 0x00;
			_buf[row][col].Char.AsciiChar = ' '; // note: 'Char' is a union
		}
	// this buffer always writes to a certain rectangle, make sure the cursor is in the viewable area
	if (!SetConsoleCursorPosition(_hConsole,_bufCoord))
		_failState = true;
}
ConsoleBuffer::~ConsoleBuffer()
{
	if (_failState)
		return;
	//reset cursor position (since we always write to the beginning of the console)
	COORD c;
	c.X = 0;
	c.Y = SCREEN_HEIGHT;
	SetConsoleCursorPosition(_hConsole,c);
}
ConsoleBuffer::operator void*() const
{
	return (void*) (!_failState);
}
void ConsoleBuffer::print() const
{
	if (_failState)
		return; // it's not going to work correctly anyway
	static SMALL_RECT bufferRect = {0,0,SCREEN_WIDTH-1,SCREEN_HEIGHT-1}; // this rectangle is inclusive
	static COORD BUFFER_SIZE = {SCREEN_WIDTH,SCREEN_HEIGHT};
	WriteConsoleOutput(_hConsole,
		(CHAR_INFO*)_buf,
		BUFFER_SIZE,
		_bufCoord,
		&bufferRect);
}
void ConsoleBuffer::write_at(int col,int row,char data)
{
	_buf[row][col].Char.AsciiChar = data;
}
void ConsoleBuffer::chng_color_at(int col,int row,ConsoleBuffer::ConsoleColorAttrib color)
{
	_buf[row][col].Attributes = (unsigned short) color;
}
void ConsoleBuffer::trickle_down()
{
	for (int row = 0;row<SCREEN_HEIGHT-1;row++)
	{
		CHAR_INFO* next = _buf[row+1];
		for (int col = 0;col<SCREEN_WIDTH;col++)
			_buf[row][col] = next[col];
	}
}
void ConsoleBuffer::trickle_up()
{
	for (int row = SCREEN_HEIGHT-2; row >= 0;row--)
	{
		CHAR_INFO* next = _buf[row-1];
		for (int col = 0;col<SCREEN_WIDTH;col++)
			_buf[row][col] = next[col];
	}
}
CHAR_INFO* ConsoleBuffer::operator[] (int i)
{
	return _buf[i];
}
const CHAR_INFO* ConsoleBuffer::operator[] (int i) const
{
	return _buf[i];
}