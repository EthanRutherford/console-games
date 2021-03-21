#include <iostream>
#include <time.h>
#include "ConsoleBuffer.h" // this includes Windows.h

// the sum of these two should be SCREEN_WIDTH
const int MAXIMUM_SPACE = 60;
const int MINIMUM_SPACE = 20;
//
const char WALL_CHAR = '|';
const char PLAYER_CHAR = 'V';

int main()
{
	ConsoleBuffer myBuffer;
	
	//test to make sure the buffer initialized properly
	if (!myBuffer)
	{
		std::cout << "Error - couldn't intialize console buffer.\n";
		return 1;
	}

	// clear the screen for the buffer
	system("cls");

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
		if (iter%4==0 and iter > 10)
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
			ConsoleBuffer::ConsoleColorAttrib clr;
			char c;
			if (i<leftEdgeWidth || i>=rightBeg)
			{
				c = WALL_CHAR;
				clr = (ConsoleBuffer::ConsoleColorAttrib) (ConsoleBuffer::ForeGreen | ConsoleBuffer::BackGreen);
			}
			else
			{
				c = ' ';
				clr = (ConsoleBuffer::ConsoleColorAttrib) (ConsoleBuffer::ForeLBlue | ConsoleBuffer::Black);
			}
			c = ((i<leftEdgeWidth || i>=rightBeg) ? WALL_CHAR : ' ');
			myBuffer.write_at(i,SCREEN_HEIGHT-1,c);
			myBuffer.chng_color_at(i,SCREEN_HEIGHT-1,clr);
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
	std::cout << "You survived " << iter << " frames.\n";
	Sleep(500);
	system("pause");
}