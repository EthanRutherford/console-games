## RaceGame
I made this car racing game pretty early on, though it went through a few iterations
before it reached this point.

Originally, the car was at the bottom of the screen, because I was only printing one additional
line each frame, and didn't know any way to "edit" lines which had already been printed.
The game also didn't have any color, and the walls were rendered as "O"s.

I transitioned to a method where I cleared the screen, and then re-printed all the lines,
so I could place the car halfway up the screen. That way, you could see what was ahead.
However, since I was printing a character at a time (and even when I updated it to one line
at a time), the screen was really flickery.

Later, my friend Roger showed me how to change the color and background of individual
characters in the console window, as well as how to use "screen buffers" to remove the flicker,
and the game finally reached the form you see here.
