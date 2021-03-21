#include <iostream>
#include <iomanip>
#include <windows.h>
#include <time.h>
#include <cstring>
using namespace std;

void stringify (char a[43], string& lol)
{
	lol = "";
	for (int i = 0; i < 43; i++)
		lol += a[i];
}

int main()
{
	int p = 0, ra, i = 0, speed = 35;
	char L1[43] = {0}, L2[43] = {0}, L3[43] = {0}, L4[43] = {0}, L5[43] = {0},
	L6[43] = {0}, L7[43] = {0}, L8[43] = {0}, L9[43] = {0}, L10[43] = {0},
	L11[43] = {0}, L12[43] = {0}, L13[43] = {0}, L14[43] = {0}, L15[43] = {0},
	L16[43] = {0};
	string S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16;
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
		
		// new stringify function
		stringify(L1, S1);
		stringify(L2, S2);
		stringify(L3, S3);
		stringify(L4, S4);
		stringify(L5, S5);
		stringify(L6, S6);
		stringify(L7, S7);
		
		// line 8
		for (int r = 0; r < 43; r++)
		{
			if (r == spot and (L8[r] == ' ' or L8[r] == 0))
			{
				L8[r] = 'V';
				dead = false;
			}
		}	
		
		// rest of lines
		stringify(L8, S8);
		stringify(L9, S9);
		stringify(L10, S10);
		stringify(L11, S11);
		stringify(L12, S12);
		stringify(L13, S13);
		stringify(L14, S14);
		stringify(L15, S15);
		stringify(L16, S16);
		
		{//draw
		system("cls");
		cout << S1 << endl;
		cout << S2 << endl;
		cout << S3 << endl;
		cout << S4 << endl;
		cout << S5 << endl;
		cout << S6 << endl;
		cout << S7 << endl;
		cout << S8 << endl;
		cout << S9 << endl;
		cout << S10 << endl;
		cout << S11 << endl;
		cout << S12 << endl;
		cout << S13 << endl;
		cout << S14 << endl;
		cout << S15 << endl;
		cout << S16 << endl;
		}

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