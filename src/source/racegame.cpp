#include <iostream>
#include <iomanip>
#include <windows.h>
#include <time.h>
using namespace std;

int main()
{
	int p = 0, ra, i = 0, speed = 75;
	bool dead = true;
	srand (time(NULL));
	int spot = 6;
	while (true)
	{
		dead = true;
		if (i % 4 == 0)
			ra = rand() % 3 - 1;
		if (i % 2 == 0)
			p += ra;
		if (p < 1)
			p++;
		if (p > 30)
			p--;
		cout << setw(p) << "O";
		if (GetAsyncKeyState(VK_LEFT))
			spot--;
		if (GetAsyncKeyState(VK_RIGHT))
			spot++;
		for (int r = p+1; r < p+13; r++)
		{
			if (r == spot)
			{
				cout << "V";
				dead = false;
			}
			else
				cout << " ";
		}
		cout << "O" << endl;
		if (dead)
			break;
		Sleep(speed);
		if (i % 50 == 0)
			speed--;
		i++;
	}
	cout << "You survived " << i << " frames." << endl;
	Sleep(100);
	system("pause");
}