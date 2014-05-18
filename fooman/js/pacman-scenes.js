/**
* Creates the scenes
* @author 	Carlos Perea
* @date 	May 1st, 2014
*/
;Quintus.PacmanScenes = function(Q) {

	// Title scene
	Q.scene("title",function(stage) {
		Q.state.set("level",0);

		// Clear the HUD
		Q.clearStage(1); 

		var bg = stage.insert(new Q.Background({ type: Q.SPRITE_UI }));
		bg.on("touch",function() { Q.stageScene("level1");  });

		stage.insert(new Q.Title());
		
		var verb = Q.touchDevice ? 'Tap': 'Click';
		
		stage.insert(new Q.UI.Text({
			label: verb + " to start",
			align: 'center',
			color: '#FFFFFF',
			font: 'Calibri',
			x: Q.width/2,
			y: 280,
			weight: "normal",
			size: 20
		}));
		
		stage.insert(new Q.UI.Text({
			label: "Move 'FooMan' with the arrow keys",
			align: 'center',
			color: '#FFFFFF',
			x: Q.width/2,
			y: 370,
			weight: "normal",
			size: 20
		}));
		
		// Plays the beginning sound
		Q.audio.play("beginning.ogg");
	});

	// Game over scene
	Q.scene("gameOver",function(stage) {

		var bg = stage.insert(new Q.Background({ type: Q.SPRITE_UI }));
		bg.on("touch",function() {  Q.stageScene("title");  });

		stage.insert(new Q.GameOver());

		stage.insert(new Q.UI.Text({
			label: "Game Over!",
			color: "#FFFFFF",
			align: 'center',
			x: Q.width/2,
			y: 350,
			weight: "normal",
			size: 20
		}));
		
		// Plays the death sound
		Q.audio.play("death.ogg");

	});

	// Winner scene
	Q.scene("winner",function(stage) {
		var bg = stage.insert(new Q.Background({ type: Q.SPRITE_UI }));
		bg.on("touch",function() {  Q.stageScene("title");  });

		stage.insert(new Q.Title());

		stage.insert(new Q.UI.Text({
			label: "You won!",
			color: "#FFFFFF",
			align: 'center',
			x: Q.width/2,
			y: 350,
			weight: "normal",
			size: 20
		}));
		
		// Plays the intermission sound
		Q.audio.play("intermission.ogg");
		
	});

	// HUD
	Q.scene("hud",function(stage) {
			stage.insert(new Q.Score());
		}, 
		{ stage: 1 }
	);

	// Level 1 scene
	Q.scene("level1",function(stage) {
		Q.state.reset({ score: 0, level: 1 });
	
		var map = stage.collisionLayer(new Q.TowerManMap());
		map.setup();
	
		// Add the player
		var player = stage.insert(new Q.Player(Q.tilePos(10,7)));

		// Add enemies
		stage.insert(new Q.Enemy(Q.tilePos(10,4)));
		stage.insert(new Q.Enemy(Q.tilePos(15,10)));
		stage.insert(new Q.Enemy(Q.tilePos(5,10)));
		
		// Add the HUD
		Q.stageScene("hud"); 
		
		// Adds the control arrows
		stage.insert(new Q.Center());
		var rightArrow = stage.insert(new Q.RightArrow({type: Q.SPRITE_UI}));
		var leftArrow = stage.insert(new Q.LeftArrow({type: Q.SPRITE_UI}));
		var upArrow = stage.insert(new Q.UpArrow({type: Q.SPRITE_UI}));
		var downArrow = stage.insert(new Q.DownArrow({type: Q.SPRITE_UI}));
		
		rightArrow.on("touchEnd", function() {
			Q.inputs['right'] = true;
			Q.inputs['left'] = Q.inputs['up'] = Q.inputs['down'] = false;
		});
		leftArrow.on("touch", function() {
			Q.inputs['left'] = true;
			Q.inputs['right'] = Q.inputs['up'] = Q.inputs['down'] = false;
		});
		upArrow.on("touch", function() {
			Q.inputs['up'] = true;
			Q.inputs['left'] = Q.inputs['right'] = Q.inputs['down'] = false;
		});
		downArrow.on("touch", function() {
			Q.inputs['down'] = true;
			Q.inputs['left'] = Q.inputs['up'] = Q.inputs['right'] = false;
		});
	});
};
