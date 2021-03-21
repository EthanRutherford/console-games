#include <iostream>
#include <Windows.h>
#include <time.h>

const int SCREEN_WIDTH = 80;
const int SCREEN_HEIGHT = 24;
COORD BUFFER_SIZE = {SCREEN_WIDTH,SCREEN_HEIGHT};

// the sum of these two should be SCREEN_WIDTH
const int MAXIMUM_SPACE = 60;
const int MINIMUM_SPACE = 20;
//
const char WALL_CHAR = '|';
const char PLAYER_CHAR = 'V';

struct ConsoleBuffer
{
	ConsoleBuffer();
	void print() const;
	void write_at(int col,int row,char data);
	void trickle_down();
	CHAR_INFO* operator [](int);
	const CHAR_INFO* operator [](int) const;
private:
	CHAR_INFO _buf[SCREEN_HEIGHT][SCREEN_WIDTH];
};

ConsoleBuffer::ConsoleBuffer()
{
	// initialize buffer data to space
	for (int row = 0;row<SCREEN_HEIGHT;row++)
		for (int col = 0;col<SCREEN_WIDTH;col++)
		{
			_buf[row][col].Attributes = 0x01;
			_buf[row][col].Char.AsciiChar = ' '; // note: 'Char' is a union
		}
}
void ConsoleBuffer::print() const
{
	static HANDLE hOutput = GetStdHandle(STD_OUTPUT_HANDLE);
	static SMALL_RECT bufferRect = {0,0,SCREEN_WIDTH-1,SCREEN_HEIGHT-1};
	static COORD bufferCoord = {0,0};
	WriteConsoleOutput(hOutput,
		(CHAR_INFO*)_buf,
		BUFFER_SIZE,
		bufferCoord,
		&bufferRect);
}
void ConsoleBuffer::write_at(int col,int row,char data)
{
	_buf[row][col].Char.AsciiChar = data;
}
void ConsoleBuffer::trickle_down()
{
	for (int row = 0;row<SCREEN_HEIGHT-1;row++)
	{
		CHAR_INFO* next = _buf[row+1];
		for (int col = 0;col<SCREEN_WIDTH;col++)
			_buf[row][col].Char = next[col].Char;
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

int main()
{
	ConsoleBuffer myBuffer;

	bool dead = false;
	int playerPos = 40;
	int leftEdgeWidth = 35, rightEdgeWidth = 35;

	unsigned int speed = 65;
	int randomChng = 0;
	int iter = 0;

	//seed puesdo-random number generator with current time
	srand((DWORD)time(NULL));

	while (true) // game loop
	{
		//every 7 iterations, calculate a new random change value
		if (iter%7==0)
			randomChng = rand()%3-1;
		//every 2 iterations, change the edge widths
		if (iter%2==0)
		{
			leftEdgeWidth += randomChng;
			rightEdgeWidth -= randomChng;
			//check bounds
			if (leftEdgeWidth<MINIMUM_SPACE)
			{
				leftEdgeWidth = MINIMUM_SPACE;
				rightEdgeWidth += randomChng;
			}
			if (rightEdgeWidth<MINIMUM_SPACE)
			{
				rightEdgeWidth = MINIMUM_SPACE;
				leftEdgeWidth -= randomChng;
			}
			if (leftEdgeWidth>MAXIMUM_SPACE)
			{
				leftEdgeWidth = MAXIMUM_SPACE;
				rightEdgeWidth += randomChng;
			}
			if (rightEdgeWidth>MAXIMUM_SPACE)
			{
				rightEdgeWidth = MAXIMUM_SPACE;
				leftEdgeWidth -= randomChng;
			}
		}
		//check key state and change player position
		if (GetAsyncKeyState(VK_LEFT))
			--playerPos;
		else if (GetAsyncKeyState(VK_RIGHT))
			++playerPos;
		//write current line to buffer
		for (int i = 0, rightBeg = SCREEN_WIDTH-rightEdgeWidth-1
			;i<SCREEN_WIDTH;i++)
		{
			char c;
			c = ((i<leftEdgeWidth || i>=rightBeg) ? WALL_CHAR : ' ');
			myBuffer.write_at(i,SCREEN_HEIGHT-1,c);
		}
		//write player char to buffer
		if (myBuffer[9][playerPos].Char.AsciiChar==' ')
			myBuffer[9][playerPos].Char.AsciiChar = PLAYER_CHAR;
		else
			dead = true;
		//present buffer
		myBuffer.print();
		//tickle down the lines of text in the buffer
		myBuffer.trickle_down();
		//check dead state
		if (dead)
			break;
		//change speed every 50 iterations
		if (iter%50==0)
			speed--;
		//sleep the thread
		Sleep(speed);
		iter++; // don't forget to change this :) (I always seem to...)
	}
	// this is going to clear game output
	std::cout << "You survived " << iter << " frames.\n";
}