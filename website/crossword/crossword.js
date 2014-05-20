/***************************************************************************************
* Description: Handles the AJAX requests and the painting of the crossword puzzle
* Author: Carlos Perea
* E-mail: cfperea@gmail.com
* Date: May 19th, 2014
****************************************************************************************/

/**
* Paints the puzzle in the corresponding div
* @param 	puzzle 	The result from the server
* @param 	div 	The div where the crossword puzzle should be painted
*/
function paintCrossword(puzzle, div) {
	var title = puzzle["title"];
	var grid = puzzle["grid"];
	var rows = grid.length;
	var cols = grid[0].length;
	var string = "<table align=\"center\" bordercolor=\"#000000\" cellpadding=\"#000000\" cellspacing=\"0\">";
	for (var i = 0; i < rows; i++) {
		var line = "<tr>";
		for (var j = 0; j < cols; j++) {
			var cell = grid[i][j];
			if (cell != "-")
				line += "<td align=\"center\">" + grid[i][j] + "</td>";
			else
				line += "<td bgcolor=\"#000000\">&nbsp;</td>"
		}
		string += line + "</tr>";
	}
	string += "</table>";
	$(div).html(string);
}

/**
* Called when the document is ready
*/
$(document).ready(function(){
	
	/**
	* AJAX submission for the IGN word list
	*/
	$("#ign-crossword").submit(function() {
	    var url = "crossword/generator.php"; // the script where you handle the form input.
	    var formData = {
	    	"title" : $("input[name=ign-title]").val(),
	    	"words" : $("textarea[name=ign-words]").val()
	    };
	    $.ajax({
				type: "POST",
	           	url: url,
	           	data: formData, // serializes the form's elements.
	           	success: function(data)
	           	{
	           		var data = jQuery.parseJSON(data);
	           		if (data.status == "success") {
	    				var result = data["result"];
	        			paintCrossword(result, "#ign-grid");
    				} else if (data.status == "error") {
    					alert("Error:" + data.result)
    				}
	           	}
			});

	    event.preventDefault();
	});

	/**
	* AJAX submission for my own word list
	*/
	$("#own-crossword").submit(function() {
	    var url = "crossword/generator.php"; // the script where you handle the form input.
	    var formData = {
	    	"title" : $("input[name=own-title]").val(),
	    	"words" : $("textarea[name=own-words]").val()
	    };
	    $.ajax({
				type: "POST",
	           	url: url,
	           	data: formData, // serializes the form's elements.
	           	success: function(data)
	           	{
	           		var data = jQuery.parseJSON(data);
	           		if (data.status == "success") {
	    				var result = data["result"];
	        			paintCrossword(result, "#own-grid");
    				} else if (data.status == "error") {
    					alert("Error:" + data.result)
    				}
	           	}
			});

	    event.preventDefault();
	});


});
