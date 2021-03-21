#include <iostream>
#include <cstdlib>
#include <string>
#include <fstream>
using namespace std;

//these are global because they are used in both functions.
int win = 0;
int query;
int story = 1;
int end = 1;

void read()
{
	string line;
	int i = 1;
	ifstream stor("story.txt"); //this opens the file and refers to it as "stor"
	while(i<story && getline(stor, line))
		i++;           //this read the file line by line until it gets to te line desired
	while(i<end+1)
	{
		getline (stor, line);
		cout << line << endl; //gets the line desired and prints it.
		i++;                  //continues until the last line in the chunk
	}
	getline (stor, line);
	query = atoi(line.c_str()); //converts the string to an int
	if(query == 1000000)
		win = 1;       //this determines that the game is over (not necessarily won)
}
void Query()
{
	string line;
	int i = 1;
	int r, n;
	r = 0;
	ifstream quer("query.txt"); //same as other file
	while(i<query && getline(quer, line))
		i++;      //also same
	getline (quer, line);
	cout << line << endl;
	getline (quer, line);  //printing the question and both responses
	cout << line << endl;
	getline (quer, line);
	cout << line << endl;
	while(r<1 or r>2)    // gets input, making sure it can only be 1 or 2
		cin >> r;
	n = query + 2*r - 2;  //directs the next functions to the proper pair of lines
	while(i<n && getline(quer, line))
		i++;
	getline(quer, line);            //stores the line number for the next story bit
	story = atoi(line.c_str());
	getline(quer, line);           //store the last line of the next bit of story
	end = atoi(line.c_str());      // so it knows when to stop
	system("cls");                 //clears the screen to look nice
}
int main()
{
	while(win == 0) //repeats these two functions until the game returnsa win/loss
	{
		read();
		if(win == 0)
			Query();
	}
	system("pause");
}