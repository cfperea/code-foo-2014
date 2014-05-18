#############################################################################################
# Name: Crossword Puzzle Generator
# Description: Crossword puzzle generator for IGN's "Code Foo 2014" internship (Ruby version)
# Author: Carlos Perea
# E-mail: cfperea@gmail.com
# Date: April 17th, 2014
#############################################################################################

# Represents a word within the crossword puzzle
class Word

	# =======================================
	# 				MEMBERS
	# =======================================

	# word 			=> The word in string form
	# row 			=> The initial row
	# col 			=> The initial column
	# length 		=> The length of the word
	# horizontal 	=> Whether the word is horizontal or vertical
	attr_accessor :word, :row, :col, :length, :horizontal

	# Contructor
	# @param 	row 		The initial row
	# @param 	col 		The initial column
	# @param 	horizontal	True if the word is horizontal, False if it's vertical
	def initialize(word, row = 0, col = 0, horizontal = 0)
		@word = word
		@row = row
		@col = col
		@length = word.length
		@horizontal = horizontal
	end

end

# Crossword puzzle generator
class Generator

	# =======================================
	# 				MEMBERS
	# =======================================

	# words 		=> List of words
	# grid 			=> 2D grid
	# open_list 	=> The words that haven't been placed in the grid
	# closed_list 	=> The words that have been placed in the grid
	# rows 			=> The number of rows in the grid
	# cols 			=> The number of columns in the grid
	attr_accessor :words, :grid, :open_list, :closed_list, :rows, :cols

	# =======================================
	# 				CONSTANTS
	# =======================================

	EMPTY = " "		# Represents an empty cell

	# Constructor
	# @param 	rows 	The number of rows in the grid
	# @param 	cols 	The number of columns in the grid
	def initialize(rows, cols)
		@words = []
		@grid = []
		@closed_list = []
		@open_list = []
		@rows = rows
		@cols = cols

		for i in 0..@rows - 1
			row = []
			for j in 0..@cols - 1
   				row.push(EMPTY)
   			end
   			@grid.push(row)
		end
	end

	# Loads the words from a file
	# @param 	filepath	The file that contains the words
	# @return 	void
	def read_words(filepath)
		f = File.open(filepath, "r")
		body = f.read
		@words = body.split("\n")
		for i in 0..@words.length - 1 # convert all words to lower case for easy comparison
			@words[i] = @words[i].downcase
		end
		@words = @words.sort_by { |word| word.length }
		for j in 0..@words.length - 1
			@open_list.push(Word.new(@words[j]))
		end
	end

	# Adds the word to the grid
	# @param 	word 		The word to add
	# @param 	row 		The initial row
	# @param 	col 		The initial column
	# @param 	horizontal 	Whether the word is horizontal or vertical
	# @return 	Boolean		True if the word was added, False otherwise
	def add_word(word, row, col, horizontal)
		begin
			for i in 0..word.word.length - 1
				l = word.word[i]
				if horizontal
					set_cell(row, col + i, l)
				else
					set_cell(row + i, col, l)
				end
			end
			word.row = row
			word.col = col
			word.horizontal = horizontal
			return true
		rescue
			return false
		end
	end

	# Checks if a cell within the grid is empty or not
	# @param 	row 	The row
	# @param 	col 	The column
	# @return 	Boolean True if the cell is empty, False otherwise
	def check_empty(row, col)
		begin
			if @grid[row][col] == EMPTY
				return true
			end
		rescue
			pass()
		end
		return false
	end

	# Sets the value of a cell
	# @param 	row 	The row
	# @param 	col 	The column
	# @param 	value 	The value of the cell
	# @return 	void
	def set_cell(row, col, value)
		@grid[row][col] = value
	end

	# Gets the value of a cell
	# @param 	row 	The row
	# @param 	col 	The column
	# @return 	The value of the cell
	def get_cell(row, col)
		return @grid[row][col]
	end

	# Checks the score of a given initial coordinate
	# @param 	word 		The word
	# @param 	row 		The initial row
	# @param 	col 		The initial column
	# @param 	horizontal 	Whether the word is horizontal or vertical
	# @return 	The score for the particular suggestion
	def check_score(word, row, col, horizontal)
		score = 1
		for i in 0..word.word.length - 1
			letter = word.word[i]

			# make sure the cell is within the grid
			begin
				current_cell = get_cell(row, col)
			rescue
				return 0
			end

			# check the current cell if it's empty or the same letter
			if current_cell == EMPTY or current_cell == letter
				pass()
			else
				return 0
			end

			# the current cell has the same letter as the word
			if current_cell == letter
				score += 1
			end

			# check the adjacent cells
			if horizontal
				if current_cell == EMPTY
					# check top and bottom cells
					if not check_empty(row - 1, col)
						return 0
					end
					if not check_empty(row + 1, col)
						return 0
					end
				end
				if i == 0	# check the left cell if it's the first letter
					if not check_empty(row, col - 1)
						return 0
					end
				end
				# check the right cell if it's the last letter
				if i == word.word.length - 1
					if not check_empty(row, col + 1)
						return 0
					end
				end
			else
				if current_cell == EMPTY
					# check left and right cells
					if not check_empty(row, col - 1)
						return 0
					end
					if not check_empty(row, col + 1)
						return 0
					end
				end
				# check the top cell if it's the first letter
				if i == 0
					if not check_empty(row - 1, col)
						return 0
					end
				end
				# check the bottom cell if it's the last letter
				if i == word.word.length - 1
					if not check_empty(row + 1, col)
						return 0
					end
				end
			end
			# move to the next cell
			if horizontal
				col += 1
			else
				row += 1
			end
		end
		return score
	end

	# Suggests a list of initial coordinates where the word could potentially be placed
	# These suggestions should be validated with the check_score method
	# @param 	word 	The word
	# @return 	List of suggestions 	[0] = the row, [1] = the col, [2] = horizontal
	def suggest_coord(word)
		coords = []
		for i in 0..word.word.length - 1
			letter = word.word[i]
			for row in 0..@rows - 1
				for col in 0..@cols - 1
					cell = get_cell(row, col)
					if letter == cell
						begin
							# suggest vertical
							if row - i >= 0 # make sure the word can be placed within the grid
								if row - i + word.length < @rows
									coords.push([row - i, col, false])
								end
							end
						rescue
							pass()
						end
						begin
							# suggest horizontal
							if col - i >= 0 # make sure the word can be placed within the grid
								if col - i + word.length < @cols
									coords.push([row, col - i, true])
								end
							end
						rescue
							pass()
						end
					end
				end
			end
		end
		return coords
	end

	# Generates the crossword puzzle
	# @return 	void
	def generate()
		word = @open_list[@open_list.length - 1]
		add_word(word, 0, 0, true)
		@closed_list.push(word)
		@open_list.pop
		while @open_list.length > 0 # try to position the words as long as the open list is not empty
			i = @open_list.length - 1
			while i >= 0
				word = @open_list[i]
				suggestions = suggest_coord(word)	# obtains the placement suggestions for this word
				max_score = 0
				final_row = 0
				final_col = 0
				final_orient = 0
				for coord in suggestions # checks the score for each placement suggestion
					row = coord[0]
					col = coord[1]
					horizontal = coord[2]
					score = check_score(word, row, col, horizontal)
					if score > max_score
						max_score = score
						final_row = row
						final_col = col
						final_orient = horizontal
					end
				end
				if max_score > 0	# place the word if the score was greater than 0
					if (add_word(word, final_row, final_col, final_orient))
						@closed_list.push(word)
						@open_list.delete_at(i)
					end
				end
				i -= 1
			end
		end
		adjust() 	# adjust the size of the grid
	end

	# Adjusts the size of the grid to the smallest possible size
	# @return 	void
	def adjust()
		max_col = 0
		max_row = 0
		for i in 0..@rows - 1
			for j in 0..@cols - 1
				cell = get_cell(i, j)
				if cell != EMPTY
					if i > max_row
						max_row = i
					end
					if j > max_col
						max_col = j
					end
				end
			end
		end
		fitted_grid = []
		for i in 0..max_row
			new_row = []
			for j in 0..max_col
				new_row.push(@grid[i][j])
			end
			fitted_grid.push(new_row)
		end
		@grid = fitted_grid
		@rows = max_row + 1
		@cols = max_col + 1
	end

	# Prints the grid into the console
	# @param 	title 		The crossword's title
	# @param 	filepath 	The output's filepath
	# @return 	void
	def print_grid(title, filepath)
		f = File.open(filepath, "w+")
		result = title + "\n\n"
		print(result)
		for i in 0..@rows - 1
			line = ""
			for j in 0..@cols - 1
				cell = @grid[i][j]
				if cell == EMPTY
					line += " "
				else
					line += cell
				end
			end
			result += line + "\n"
			print(line + "\n")
		end
		result += "\n"
		print("\n")
		f.write(result)
		f.close()
		print("Result written in \"" + filepath + "\"\n\n")
	end

	# Pass keyword. Equivalent to the pass keyword in Python
	# @return 	void
	def pass
    	;
	end
end

#======================================
# 			POINT OF ENTRY
#======================================

# Creates the crossword puzzle from IGN's list
ign = Generator.new(50, 50)		# A 50x50 grid seems to work
ign.read_words("crossword.txt")
ign.generate()
ign.print_grid("===== IGN Crossword Puzzle =====", "results/ign_crossword_ruby.txt")

# Creates the customized crossword puzzle
my = Generator.new(50, 50)		# A 50x50 grid seems to work
my.read_words("mylist.txt")
my.generate()
my.print_grid("===== My Crossword Puzzle =====", "results/my_crossword_ruby.txt")