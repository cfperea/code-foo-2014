/**
* Creates the sprites and game objects
* @author 	Carlos Perea
* @date 	May 1st, 2014
*/
;Quintus.PacmanSprites = function(Q) {
	
	var SPRITE_PLAYER = 1;
	var SPRITE_TILES = 2;
	var SPRITE_ENEMY = 4;
	var SPRITE_DOT = 8;
	
	// Points given for collecting the dots and towers
	var DOT_SCORE = 100;
	var TOWER_SCORE = 500;
	
	// Player animation
	Q.animations('player', {
		run_right: { frames: [0,1,2,1], rate: 1/8},
		run_left: { frames: [3,4,5,3], rate: 1/8},
		run_up: { frames: [6,7,8,7], rate: 1/8},
		run_down: { frames: [9,10,11,9], rate: 1/8},
		stand: { frames: [0], rate: 1/8}
	});
	
	// Enemy animation
	Q.animations('red_enemy', {
		run_right: { frames: [1], rate: 1/4 },
		run_left: { frames: [2], rate: 1/4 },
		run_up: { frames: [3], rate: 1/4 },
		run_down: { frames: [0], rate: 1/4 }
	});

	// Return a x and y location from a row and column
	// in our tile map
	Q.tilePos = function(col,row) {
		return { x: col*32 + 16, y: row*32 + 16 };
	}

	// Player sprite
	Q.Sprite.extend("Player", {
		init: function(p) {

		  this._super(p,{
			sprite: "player",
			sheet:"player",
			// Add in a type and collisionMask
			type: SPRITE_PLAYER, 
			collisionMask: SPRITE_TILES | SPRITE_ENEMY | SPRITE_DOT
		  });
		  
		  this.add("animation");

		  // Add in the towerManControls component in addition
		  // to the 2d component
		  this.add("2d, towerManControls");
		}
	});
	  
	// Dot sprite
	Q.Sprite.extend("Dot", {
		init: function(p) {
		
			this._super(p,{
				sheet: 'dot',
				type: SPRITE_DOT,
				// Set sensor to true so that it gets notified when it's
				// hit, but doesn't trigger collisions itself that cause
				// the player to stop or change direction
				sensor: true
			});

			this.on("sensor");
			this.on("inserted");
		},

		// Called when a dot is hit
		sensor: function() {
			// Destroy the dot
			this.destroy();
			this.stage.dotCount--;
			// Plays the chomp sound
			Q.audio.play("chomp.ogg");
			this.increment_score(DOT_SCORE);
		},
		
		// Increments the score
		increment_score: function(score) {
			// Increment the score
			Q.state.inc("score", score);
			// If there are no more dots left, just restart the game
			if(this.stage.dotCount == 0) {
				// player finished the game
				Q.stageScene("winner");
			}
		},

		// When a dot is inserted, use it's parent (the stage)
		// to keep track of the total number of dots on the stage
		inserted: function() {
			this.stage.dotCount = this.stage.dotCount || 0
			this.stage.dotCount++;
		}
	});

	// IGN sprite
	Q.Dot.extend("Tower", {
		init: function(p) {
			this._super(Q._defaults(p,{
				sheet: 'tower'
			}));
		},
		
		// Called when a tower is hit
		sensor: function() {
			// destroy the tower
			this.destroy();
			this.stage.dotCount--;
			// Plays the eattower sound
			Q.audio.play("eattower.ogg");
			this.increment_score(TOWER_SCORE);
		},
	});

	// Tiled map
	Q.TileLayer.extend("TowerManMap",{
		init: function() {
			this._super({
				type: SPRITE_TILES,
				dataAsset: 'level.json',
				sheet:     'tiles'
			});
		},

		// Set-up the level from the "level.json" file
		setup: function() {
			// Clone the top level arriw
			var tiles = this.p.tiles = this.p.tiles.concat();
			var size = this.p.tileW;
			for(var y=0;y<tiles.length;y++) {
				var row = tiles[y] = tiles[y].concat();
				for(var x =0;x<row.length;x++) {
					var tile = row[x];
					// Replace 0's with dots and 2's with Towers
					if(tile == 0 || tile == 2) {
						var className = tile == 0 ? 'Dot' : 'Tower'
						this.stage.insert(new Q[className](Q.tilePos(x,y)));
						row[x] = 0;
					}
				}
			}
		}
	});

	// Enemy sprite
	Q.Sprite.extend("Enemy", {
		init: function(p) {

			this._super(p,{
				sprite:"red_enemy",
				sheet:"red_enemy",
				type: SPRITE_ENEMY,
				collisionMask: SPRITE_PLAYER | SPRITE_TILES
			});
		
			this.add("2d,enemyControls,animation");
			this.on("hit.sprite",this,"hit");
		},

		hit: function(col) {
			if(col.obj.isA("Player")) {
				// Player got hit by the enemy
				Q.stageScene("gameOver");
			}
		}
	});
	
	// Player controls
	Q.component("towerManControls", {
		// Default properties
		defaults: { speed: 100, direction: 'up' },

		// Called when the component is added to the stage
		added: function() {
			var p = this.entity.p;

			Q._defaults(p,this.defaults);

			this.entity.on("step",this,"step");
		},

		step: function(dt) {
			
			var p = this.entity.p;
			
			// Animate the player based on the velocity
			if(p.vx > 0) {
				this.entity.play("run_right");
			} else if(p.vx < 0) {
				this.entity.play("run_left");
			} else if(p.vy > 0) {
				this.entity.play("run_down");
			} else if(p.vy < 0) {
				this.entity.play("run_up");
			}
			else {
				this.entity.play("stand");
			}

			// Get the direction from the input manager
			p.direction = Q.inputs['left']  ? 'left' :
						Q.inputs['right'] ? 'right' :
						Q.inputs['up']    ? 'up' :
						Q.inputs['down']  ? 'down' : p.direction;

			// Try to move to that direction
			switch(p.direction) {
				case "left": p.vx = -p.speed; break;
				case "right":p.vx = p.speed; break;
				case "up":   p.vy = -p.speed; break;
				case "down": p.vy = p.speed; break;
			}
		}
	});

	// Enemy controls
	Q.component("enemyControls", {
		defaults: { speed: 100, direction: 'left', switchPercent: 2 },

		added: function() {
			var p = this.entity.p;

			Q._defaults(p,this.defaults);

			this.entity.on("step",this,"step");
			this.entity.on('hit',this,"changeDirection");
		},

		step: function(dt) {
			var p = this.entity.p;

			// Randomly try to change directions
			if(Math.random() < p.switchPercent / 100) {
				this.tryDirection();
			}
		 
			// Play the animation based on the velocity
			if(p.vx > 0) {
				this.entity.play("run_right"); 
			} else if(p.vx < 0) {
				this.entity.play("run_left"); 
			} else if(p.vy > 0) {
				this.entity.play("run_down"); 
			} else if(p.vy < 0) {
				this.entity.play("run_up"); 
			}
			else {
				this.entity.play("stand");
			}

			// Add velocity
			switch(p.direction) {
				case "left": p.vx = -p.speed; break;
				case "right":p.vx = p.speed; break;
				case "up":   p.vy = -p.speed; break;
				case "down": p.vy = p.speed; break;
			}
		},

		// Try a random direction
		tryDirection: function() {
			var p = this.entity.p; 
			var from = p.direction;
			if(p.vy != 0 && p.vx == 0) {
				p.direction = Math.random() < 0.5 ? 'left' : 'right';
			} else if(p.vx != 0 && p.vy == 0) {
				p.direction = Math.random() < 0.5 ? 'up' : 'down';
			}
		},

		// Called every collision
		changeDirection: function(collision) {
			var p = this.entity.p;
			if(p.vx == 0 && p.vy == 0) {
				if(collision.normalY) {
				  p.direction = Math.random() < 0.5 ? 'left' : 'right';
				} else if(collision.normalX) {
				  p.direction = Math.random() < 0.5 ? 'up' : 'down';
				}
			}
		}
	});	
}