<?php

/************************************************************************************************
* Name: Crossword Puzzle Generator
* Description: Crossword puzzle generator for IGN's "Code Foo 2014" internship (PHP version)
* Author: Carlos Perea
* E-mail: cfperea@gmail.com
* Date: May 19th, 2014
***********************************************************************************************/

// don't display warning messages
error_reporting(E_ERROR | E_PARSE);

/**
* Represents a word within the crossword puzzle
*/
class Word {

	public $word = NULL;
	public $row = NULL;
	public $col = NULL;
	public $length = NULL;
	public $horizontal = NULL;

	public function __construct($word, $row , $col, $horizontal) {
		$this->word = $word;
		$this->row = $row;
		$this->col = $col;
		$this->length = strlen($word);
		$this->horizontal = $horizontal;
	}

}

/**
* Crossword puzzle generator
*/
class CrosswordGenerator {

	private static $empty = "-";

	private $words = NULL;
	private $grid = NULL;
	private $open_list = NULL;
	private $closed_list = NULL;
	private $rows = NULL;
	private $cols = NULL;


	/*
	* Constructor
	* @param 	rows 	The number of rows in the grid
	* @param 	cols 	The number of columns in the grid
	*/
	public function __construct($rows, $cols) {

		$this->words = array();
		$this->grid = array();
		$this->closed_list = array();
		$this->open_list = array();
		$this->rows = $rows;
		$this->cols = $cols;

		for ($i = 0; $i < $rows; $i++) {
			$row = array();
			for ($j = 0; $j < $cols; $j++) {
				array_push($row, self::$empty);
			}
			array_push($this->grid, $row);
		}
	}

	/*
	* Loads the words from a file
	* @param 	words	Words separated by the line-escape character
	* @return 	void
	*/
	public function read_words($words) {
		$tmpWords = explode("\n", $words);

		for ($i = 0; $i < count($tmpWords); $i++) {
			$word = str_replace("\r", "", strtolower($tmpWords[$i]));
			// make sure the word is not empty
			// more cleaning should be done
			if ($word != "")
				array_push($this->words, $word);
		}
		// sort the words by length
		usort($this->words, function($a, $b) {
    		return strlen($b) - strlen($a);
		});

		$this->words = array_reverse($this->words);
		for ($j = 0; $j < count($this->words); $j++) {
			array_push($this->open_list, new Word($this->words[$j]));
		}
	}

	/*Adds the word to the grid
	* @param 	word 		The word to add
	* @param 	row 		The initial row
	* @param 	col 		The initial column
	* @param 	horizontal 	Whether the word is horizontal or vertical
	* @return 	Boolean		True if the word was added, False otherwise
	*/
	public function add_word($word, $row, $col, $horizontal) {
		try {
			for ($i = 0; $i < strlen($word->word); $i++) {
				$l = $word->word[$i];
				if ($horizontal) {
					$this->set_cell($row, $col + $i, $l);
				} else {
					$this->set_cell($row + $i, $col, $l);
				}
			}
			$word->row = $row;
			$word->col = $col;
			$word->horizontal = $horizontal;
			return True;
		}
		catch (Exception $e) {
			return False;
		}
	}

	/*
	* Checks if a cell within the grid is empty or not
	* @param 	row 	The row
	* @param 	col 	The column
	* @return 	Boolean True if the cell is empty, False otherwise
	*/
	public function check_empty($row, $col) {
		try {
			if ($this->grid[$row][$col] == self::$empty) {
				return True;
			}
		} catch (Exception $e) {
			// pass
		}
		return False;
	}

	/*
	* Sets the value of a cell
	* @param 	row 	The row
	* @param 	col 	The column
	* @param 	value 	The value of the cell
	* @return 	void
	*/
	public function set_cell($row, $col, $value) {
		$this->grid[$row][$col] = $value;
	}

	/*
	* Gets the value of a cell
	* @param 	row 	The row
	* @param 	col 	The column
	* @return 	The value of the cell
	*/
	public function get_cell($row, $col) {
		return $this->grid[$row][$col];
	}

	/*
	*Checks the score of a given initial coordinate
	* @param 	word 		The word
	* @param 	row 		The initial row
	* @param 	col 		The initial column
	* @param 	horizontal 	Whether the word is horizontal or vertical
	* @return 	The score for the particular suggestion
	*/
	public function check_score($word, $row, $col, $horizontal) {
		$score = 1;
		for ($i = 0; $i < strlen($word->word); $i++) {
			$letter = $word->word[$i];
			
			// make sure the cell is within the grid
			try {
				$current_cell = $this->get_cell($row, $col);
			} catch (Exception $e) {
				return 0;
			}

			// check the current cell if it's empty or the same letter
			if ($current_cell == self::$empty || $current_cell == $letter) {
				// pass
			} else {
				return 0;
			}
			
			// the current cell has the same letter as the word
			if ($current_cell == $letter) {
				$score += 1;
			}

			if ($horizontal) {
				if ($current_cell == self::$empty) {
					// check top and bottom cells
					if (!$this->check_empty($row - 1, $col)) {
						return 0;
					}
					if (!$this->check_empty($row + 1, $col)) {
						return 0;
					}
				}
				// check the left cell if it's the first letter
				if ($i == 0) {
					// make sure the current column is not the first one
					if (!$this->check_empty($row, $col - 1) && $col > 0) {
						return 0;
					}
				}
				// check the right cell if it's the last letter
				if ($i == strlen($word->word) - 1) {
					// make sure the current column is not the last one
					if (!$this->check_empty($row, $col + 1) && $col < $this->cols - 1) {
						return 0;
					}
				}
			} else {
				if ($current_cell == self::$empty) {
					// check left and right cells
					if (!$this->check_empty($row, $col - 1)) {
						return 0;
					}
					if (!$this->check_empty($row, $col + 1)) {
						return 0;
					}
				}
				// check the top cell if it's the first letter
				if ($i == 0) {
					// make sure the current row is not the first one
					if (!$this->check_empty($row - 1, $col) && $row > 0) {
						return 0;
					}
				}
				// check the bottom cell if it's the last letter
				if ($i == strlen($word->word) - 1) {
					// make sure the current row is not the last one
					if (!$this->check_empty($row + 1, $col) && $row < $this->rows - 1) {
						return 0;
					}
				}
			}

			// move to the next cell
			if ($horizontal) {
				$col += 1;
			} else {
				$row += 1;
			}
		}

		return $score;
	}

	/* 
	* Suggests a list of initial coordinates where the word could potentially be placed
	* These suggestions should be validated with the check_score method
	* @param 	word 	The word
	* @return 	List of suggestions 	[0] = the row, [1] = the col, [2] = horizontal
	*/
	public function suggest_coord($word) {
		$coords = array();
		
		for ($i = 0; $i < strlen($word->word); $i++) {
			$letter = $word->word[$i];
			for ($row = 0; $row < $this->rows; $row++) {
				for ($col = 0; $col < $this->cols; $col++) {
					$cell = $this->get_cell($row, $col);
					if ($letter == $cell) {
						try {
							// suggest vertical
							if ($row - $i >= 0) {
								 // make sure the word can be placed within the grid
								if ($row - $i + $word->length < $this->rows) {
									array_push($coords, array($row - $i, $col, False));
								}
							}
						} catch (Exception $e) {
							// pass
						}

						try {
							// suggest horizontal
							if ($col - $i >= 0) {
								// make sure the word can be placed within the grid
								if ($col - $i + $word->length < $this->cols) {
									array_push($coords, array($row , $col - $i, True));
								}
							}
						} catch (Exception $e) {
							// pass
						}
					}
				}
			}
		}

		return $coords;
	}

	/*
	* Generates the crossword puzzle
	*/
	public function generate() {
		$word = $this->open_list[count($this->open_list) - 1];
		$this->add_word($word, 0, 0, True);
		array_push($this->closed_list, $word);
		array_pop($this->open_list);
		while (count($this->open_list) > 0) {
			$i = count($this->open_list) - 1;
			while ($i >= 0) {
				$word = $this->open_list[$i];
				$suggestions = $this->suggest_coord($word);
				$max_score = 0;
				$final_row = 0;
				$final_col = 0;
				$final_orient = 0;
				for ($j = 0; $j < count($suggestions); $j++) {
					$coord = $suggestions[$j];
					$row = $coord[0];
					$col = $coord[1];
					$horizontal = $coord[2];
					$score = $this->check_score($word, $row, $col, $horizontal);
					
					if ($score > $max_score) {
						$max_score = $score;
						$final_row = $row;
						$final_col = $col;
						$final_orient = $horizontal;
					}
				}
				
				if ($max_score > 0) {
					if ($this->add_word($word, $final_row, $final_col, $final_orient)) {
						array_push($this->closed_list, $word);
						array_pop($this->open_list);
					}
				}
				$i -= 1;
			}
		}
		$this->adjust();
	}

	/*
	* Adjusts the size of the grid to the smallest possible size
	*/
	public function adjust() {
		$max_col = 0;
		$max_row = 0;
		for ($i = 0; $i < $this->rows; $i++) {
			for ($j = 0; $j < $this->cols; $j++) {
				$cell = $this->get_cell($i, $j);
				if ($cell != self::$empty) {
					if ($i > $max_row) {
						$max_row = $i;
					}
					if ($j > $max_col) {
						$max_col = $j;
					}
				}
			}
		}

		$fitted_grid = array();
		for ($i = 0; $i < $max_row + 1; $i++) {
			$new_row = array();
			for ($j = 0; $j < $max_col + 1; $j++) {
				array_push($new_row, $this->grid[$i][$j]);
			}
			array_push($fitted_grid, $new_row);
		}
		$this->grid = $fitted_grid;
		$this->rows = $max_row + 1;
		$this->cols = $max_col + 1;
	}

	/*
	* Prints the grid into the console
	* @param 	title 		The crossword's title
	* @param 	filepath 	The output's filepath
	* @return 	void
	*/
	public function print_grid($title) {
		$result = array("puzzle" => $title, "grid" => array());

		for ($row = 0; $row < $this->rows; $row++) {
			$line = array();
			for ($col = 0; $col < $this->cols; $col++) {
				$cell = $this->grid[$row][$col];
				array_push($line, $cell);
			}
			array_push($result["grid"], $line);
		}
		return $result;
	}

}

// =========================
//		POINT OF ENTRY
// =========================

$response = array();

if( isset($_POST["title"]) || isset($_POST["words"]) ) {
	// the POST variables were sent
	$title = $_POST["title"];
	$words = $_POST["words"];

	// create the crossword puzzle
    $generator = new CrosswordGenerator(50, 50);
	$generator->read_words($words);
	$generator->generate();
	$grid = $generator->print_grid($title);

	// create the response
	$response["result"] = $grid;
	$response["status"] = "success";
	echo json_encode($response);
}
else {
	// the POST variables were not sent
	// return error message
	$response["result"] = "Data was not sent";
	$response["status"] = "error";
	echo json_encode($response);
}


?>