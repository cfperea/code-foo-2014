/**
* Creates the UI elements
* @author 	Carlos Perea
* @date 	May 1st, 2014
*/
;Quintus.PacmanUI = function(Q) {

	// Title logo
	Q.Sprite.extend("Title", {
		init: function(p) {
			this._super({
				y: 150,
				x: Q.width/2,
				asset: "logo.png"
			});

		}
	});
	
	// Center
	Q.Sprite.extend("Center", {
		init: function(p) {
			this._super({
				y: 640,
				x: Q.width/2,
				asset: "center.png"
			});

		}
	});
	
	// Right Arrow
	Q.Sprite.extend("RightArrow", {
		init: function(p) {
			this._super({
				y: 640,
				x: Q.width/2 + 80,
				asset: "right_arrow.png",
				type: Q.SPRITE_UI
			});
		}
	});
	
	// Left Arrow
	Q.Sprite.extend("LeftArrow", {
		init: function(p) {
			this._super({
				y: 640,
				x: Q.width/2 - 80,
				asset: "left_arrow.png",
				type: Q.SPRITE_UI
			});

		}
	});
	
	// Up Arrow
	Q.Sprite.extend("UpArrow", {
		init: function(p) {
			this._super({
				y: 640 - 80,
				x: Q.width/2,
				asset: "up_arrow.png",
				type: Q.SPRITE_UI
			});

		}
	});
	
	// Down Arrow
	Q.Sprite.extend("DownArrow", {
		init: function(p) {
			this._super({
				y: 640 + 80,
				x: Q.width/2,
				asset: "down_arrow.png",
				type: Q.SPRITE_UI
			});

		}
	});
	
	// Game over image
	Q.Sprite.extend("GameOver", {
		init: function(p) {
			this._super({
				y: 150,
				x: Q.width/2,
				asset: "gameover.png"
			});

		}
	});
  
	// Background image
	Q.Sprite.extend("Background",{
		init: function(p) {
			this._super(p,{
				x: Q.width/2,
				y: Q.height/2,
				asset: 'bg_title.png',
				type: 0
			});
		}
	});
  
	// Score UI
	Q.UI.Text.extend("Score",{
		init: function() {
			this._super({
				label: "score: 0",
				align: "left",
				color: "#FFFFFF",
				x: 52,
				y: 16,
				weight: "normal",
				size: 18
			});

			Q.state.on("change.score",this,"score");
		},

		score: function(score) {
			this.p.label = "Score: " + score;
		}
	});
};