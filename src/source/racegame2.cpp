#include <iostream>
#include <iomanip>
#include <windows.h>
#include <time.h>
#include <cstring>
using namespace std;

void draw (char a[43])
{
	for (int i = 0; i < 43; i++)
		cout << a[i];
	cout << endl;
}

int main()
{
	int p = 0, ra, i = 0, speed = 25;
	char L1[43] = {0}, L2[43] = {0}, L3[43] = {0}, L4[43] = {0}, L5[43] = {0},
	L6[43] = {0}, L7[43] = {0}, L8[43] = {0}, L9[43] = {0}, L10[43] = {0},
	L11[43] = {0}, L12[43] = {0}, L13[43] = {0}, L14[43] = {0}, L15[43] = {0},
	L16[43] = {0};
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
		if (p < 0)
			p++;
		if (p > 30)
			p--;
		//cout << setw(p) << "O";
		if (GetAsyncKeyState(VK_LEFT))
			spot--;
		if (GetAsyncKeyState(VK_RIGHT))
			spot++;
		
		// new line
		for (int n = 0; n < 43; n++)
		{
			if (n <= p or n >= p+13)
				L16[n] = 'O';
			else
				L16[n] = ' ';
		}
		
		// new draw function
		system("cls");
		draw(L1);
		draw(L2);
		draw(L3);
		draw(L4);
		draw(L5);
		draw(L6);
		draw(L7);
		
		// line 10
		for (int r = 0; r < 43; r++)
		{
			if (r == spot and (L8[r] == ' ' or L8[r] == 0))
			{
				L8[r] = 'V';
				dead = false;
			}
				cout << L8[r];
		}	
		cout << endl;
		
		// rest of lines
		draw(L9);
		draw(L10);
		draw(L11);
		draw(L12);
		draw(L13);
		draw(L14);
		draw(L15);
		draw(L16);

		{//line replacement 
		memcpy(L1, L2, sizeof (L2));
		memcpy(L2, L3, sizeof (L2));
		memcpy(L3, L4, sizeof (L2));
		memcpy(L4, L5, sizeof (L2));
		memcpy(L5, L6, sizeof (L2));
		memcpy(L6, L7, sizeof (L2));
		memcpy(L7, L8, sizeof (L2));
		memcpy(L8, L9, sizeof (L2));
		memcpy(L9, L10, sizeof (L2));
		memcpy(L10, L11, sizeof (L2));
		memcpy(L11, L12, sizeof (L2));
		memcpy(L12, L13, sizeof (L2));
		memcpy(L13, L14, sizeof (L2));
		memcpy(L14, L15, sizeof (L2));
		memcpy(L15, L16, sizeof (L2));
		}
		
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