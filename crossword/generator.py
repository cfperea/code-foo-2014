###############################################################################################
# Name: Crossword Puzzle Generator
# Description: Crossword puzzle generator for IGN's "Code Foo 2014" internship (Python version)
# Author: Carlos Perea
# E-mail: cfperea@gmail.com
# Date: April 17th, 2014
###############################################################################################

import os, sys, time, random

'''
Represents a word within the crossword puzzle
'''
class Word(object):

	word = None
	row = None
	col = None
	length = None
	horizontal = None

	def __init__(self, word, row = 0, col = 0, horizontal = 0):
		self.word = word
		self.row = row
		self.col = col
		self.length = len(word)
		self.horizontal = horizontal

'''
Crossword puzzle generator
'''
class Generator(object):

	words = None 		# List of words
	grid = None 		# The 2D list representing the crossword grid
	open_list = None 	# List of words to be placed
	closed_list = None 	# List of placed words
	rows = None 		# Number of rows in the grid
	cols = None  		# Number of columns in the grid
	empty = " " 		# The character that represents an empty cell

	# Constructor
	# @param 	rows 	The number of rows in the grid
	# @param 	cols 	The number of columns in the grid
	def __init__(self, rows, cols):
		self.words = []
		self.grid = []
		self.closed_list = []
		self.open_list = []
		self.rows = rows
		self.cols = cols
		for i in range(rows): # initialize the grid
			row = []
			for j in range(cols):
				row.append(self.empty)
			self.grid.append(row)

	# Loads the words from a file
	# @param 	filepath	The file that contains the words
	# @return 	void
	def read_words(self, filepath):
		f = open(filepath, "r")
		body = f.read()
		self.words = body.split("\n")
		for i in range(0, len(self.words)): # convert all words to lower case for easy comparison
			self.words[i] = self.words[i].lower()
		self.words.sort(key=len, reverse=False)
		for j in range(0, len(self.words)):
			self.open_list.append(Word(self.words[j]))

	# Adds the word to the grid
	# @param 	word 		The word to add
	# @param 	row 		The initial row
	# @param 	col 		The initial column
	# @param 	horizontal 	Whether the word is horizontal or vertical
	# @return 	Boolean		True if the word was added, False otherwise
	def add_word(self, word, row, col, horizontal):
		try:
			for i in range(0, len(word.word)):
				l = word.word[i]
				if horizontal:
					self.set_cell(row, col + i, l)
				else:
					self.set_cell(row + i, col, l)
			word.row = row
			word.col = col
			word.horizontal = horizontal
			return True
		except:
			return False

	# Checks if a cell within the grid is empty or not
	# @param 	row 	The row
	# @param 	col 	The column
	# @return 	Boolean True if the cell is empty, False otherwise
	def check_empty(self, row, col):
		try:
			if self.grid[row][col] == self.empty:
				return True
		except:

			pass
		return False

	# Sets the value of a cell
	# @param 	row 	The row
	# @param 	col 	The column
	# @param 	value 	The value of the cell
	# @return 	void
	def set_cell(self, row, col, value):
		self.grid[row][col] = value

	# Gets the value of a cell
	# @param 	row 	The row
	# @param 	col 	The column
	# @return 	The value of the cell
	def get_cell(self, row, col):
		return self.grid[row][col]

	# Checks the score of a given initial coordinate
	# @param 	word 		The word
	# @param 	row 		The initial row
	# @param 	col 		The initial column
	# @param 	horizontal 	Whether the word is horizontal or vertical
	# @return 	The score for the particular suggestion
	def check_score(self, word, row, col, horizontal):
		score = 1
		for i in range(0, len(word.word)):
			letter = word.word[i]

			# make sure the cell is within the grid
			try:
				current_cell = self.get_cell(row, col)
			except:
				return 0

			# check the current cell if it's empty or the same letter
			if current_cell == self.empty or current_cell == letter:
				pass
			else:
				return 0

			# the current cell has the same letter as the word
			if current_cell == letter:
				score += 1

			# check the adjacent cells
			if horizontal:
				if current_cell == self.empty:
					# check top and bottom cells
					if not self.check_empty(row - 1, col):
						return 0
					if not self.check_empty(row + 1, col):
						return 0
					# check the left cell if it's the first letter
				if i == 0:
					if not self.check_empty(row, col - 1):
						return 0
				# check the right cell if it's the last letter
				if i == len(word.word) - 1:
					if not self.check_empty(row, col + 1):
						return 0
			else:
				if current_cell == self.empty:
					
					# check left and right cells
					if not self.check_empty(row, col - 1):
						return 0
					if not self.check_empty(row, col + 1):
						return 0
				# check the top cell if it's the first letter
				if i == 0:
					if not self.check_empty(row - 1, col):
						return 0
				# check the bottom cell if it's the last letter
				if i == len(word.word) - 1:
					if not self.check_empty(row + 1, col):
						return 0
			# move to the next cell
			if horizontal:
				col += 1
			else:
				row += 1
		return score

	# Suggests a list of initial coordinates where the word could potentially be placed
	# These suggestions should be validated with the check_score method
	# @param 	word 	The word
	# @return 	List of suggestions 	[0] = the row, [1] = the col, [2] = horizontal
	def suggest_coord(self, word):
		coords = []
		for i in range(0, len(word.word)):
			letter = word.word[i]
			for row in range(0, self.rows):
				for col in range(0, self.cols):
					cell = self.get_cell(row, col)
					if letter == cell:
						try:
							# suggest vertical
							if row - i >= 0: # make sure the word can be placed within the grid
								if row - i + word.length < self.rows:
									coords.append([row - i, col, False])
						except:
							pass
						try:
							# suggest horizontal
							if col - i >= 0: # make sure the word can be placed within the grid
								if col - i + word.length < self.cols:
									coords.append([row, col - i, True])
						except:
							pass
		return coords

	# Generates the crossword puzzle
	def generate(self):
		word = self.open_list[len(self.open_list) - 1]
		self.add_word(word, 0, 0, True)
		self.closed_list.append(word)
		self.open_list.pop()
		while len(self.open_list) > 0: # try to position the words as long as the open list is not empty
			i = len(self.open_list) - 1
			while i >= 0:
				word = self.open_list[i]
				suggestions = self.suggest_coord(word)	# obtains the placement suggestions for this word
				max_score = 0
				final_row = 0
				final_col = 0
				final_orient = 0
				for coord in suggestions: # checks the score for each placement suggestion
					row = coord[0]
					col = coord[1]
					horizontal = coord[2]
					score = self.check_score(word, row, col, horizontal)
					if score > max_score:
						max_score = score
						final_row = row
						final_col = col
						final_orient = horizontal
				if max_score > 0:	# place the word if the score was greater than 0
					if (self.add_word(word, final_row, final_col, final_orient)):
						self.closed_list.append(word)
						element = self.open_list.pop(i)
				i -= 1
		self.adjust() 	# adjust the size of the grid

	# Adjusts the size of the grid to the smallest possible size
	def adjust(self):
		max_col = 0
		max_row = 0
		for i in range(0, self.rows):
			for j in range(0, self.cols):
				cell = self.get_cell(i, j)
				if cell != self.empty:
					if i > max_row:
						max_row = i
					if j > max_col:
						max_col = j
		fitted_grid = []
		for i in range(0, max_row + 1):
			new_row = []
			for j in range(0, max_col + 1):
				new_row.append(self.grid[i][j])
			fitted_grid.append(new_row)
		self.grid = fitted_grid

	# Prints the grid into the console
	# @param 	title 		The crossword's title
	# @param 	filepath 	The output's filepath
	# @return 	void
	def print_grid(self, title, filepath):
		f = open(filepath, "w")
		result = title + "\n\n"
		print(result)
		for row in self.grid:
			line = ""
			for cell in row:
				if cell == self.empty:
					line += " "
				else:
					line += cell
			result += line + "\n"
			print(line)
		result += "\n"
		print("")
		f.write(result)
		f.close()
		print("Result written in \"" + filepath + "\"\n")

# Creates the crossword puzzle from IGN's list
ign = Generator(50, 50)
ign.read_words("crossword.txt")
ign.generate()
ign.print_grid("===== IGN Crossword Puzzle =====", "results/ign_crossword_python.txt")

# Creates the customized crossword puzzle
my = Generator(50, 50)
my.read_words("mylist.txt")
my.generate()
my.print_grid("===== My Crossword Puzzle =====", "results/my_crossword_python.txt")