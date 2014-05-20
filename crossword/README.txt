Author: Carlos Perea
E-mail: cfperea@gmail.com
Date: April 17th, 2014
Description: Crossword puzzle generator for IGN's "Code Foo 2014" internship. To generate the crossword puzzles please visit http://cperea.com/codefoo/crossword.html 

Contents:
    1) PHP and JavaScript implementation (php folder)
    1) Ruby implementation (generator.rb)
    2) Python implementation (generator.py)
    3) Results folder (the outputs are written in files within this folder)
    4) IGN dictionary (crossword.txt)
    5) Custom dictionary (mylist.txt)

The following steps only apply if you want to execute the Ruby and/or Python implementations.

Before you start:
    1) You need to have Ruby 1.9.3+ installed. You can get it here: https://www.ruby-lang.org/en/downloads/

Steps to run:
    1) Start the "command prompt" (Windows) or "terminal" in (Linux or Mac)
    2) Change the current directory to the "crossword" folder
    3) Type "ruby generator.rb" (without the quotation marks!) and hit the "enter" key
    4) The results are written in text files located in the "results" folder. Enjoy your generated crossword puzzles!

Notes:
	1) If you like Python (like I do), I have included a Python version just for you. Run it using "python generator.py" (you need to have Python 2.7+ installed)
	2) The words are taken from the included files "crossword.txt" and "mylist.txt", try to add more words! (if the program seems to be stuck, increase the grid size)

Algorithm:

The crossword puzzle generation problem is known to be NP-Complete (I know what you did there IGN), however when the list of words is relatively short, a solution can be achieved in a short time.
My implementation of the algorithm is as follows:

1) Create a NxN grid and fill it with a character representing the "empty" cell
2) Read the list of words from a file, put them in a list, and sort the list from shortest to longest
3) Create two lists: open and closed. Put all the words in the open list.
4) While the open list is not empty do the following:
	4a) Get the word at the end of the open list
	4b) Obtain a list of possible positions where the word can be placed (this is obtained using the suggest_coord method)
	4c) Check each suggested position's score (score is calculated with the check_score method; 0 means not a valid position, 1 means valid but no crossing with other words, 2+ means crossings with other words) and select the position with the highest's score
	4d) Add the word in the position with the highest score, add the word to the closed list, and remove the word from the open list
	4e) Go to step 4
5) Since the grid may be bigger than necessary, adjust the grid to be as small as possible
