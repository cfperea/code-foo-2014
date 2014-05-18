/**
* Loads Quintus and the game's assets
* @author 	Carlos Perea
* @date 	May 1st, 2014
*/
window.addEventListener("load",function() {

	// Set-up Quintus
	var Q = window.Q = Quintus({ development: false, maximize: true }).include("Sprites, Scenes, Input, Touch, UI, 2D, Anim, Audio")
													.include("PacmanUI, PacmanSprites, PacmanScenes")
													.enableSound()
													.setup({ width: 640, height: 800 })
													.touch(Quintus.SPRITE_ALL);
	
	// Set-up the controls
	Q.input.keyboardControls();
	Q.input.joypadControls();
	
	// Remove gravity
	Q.gravityY = 0;
	Q.gravityX = 0;
	
	// Load the assets
	Q.load("bg_title.png, gameover.png, logo.png, spritesheet.png, center.png, left_arrow.png, right_arrow.png, up_arrow.png, down_arrow.png, chomp.ogg, beginning.ogg, eattower.ogg, death.ogg, intermission.ogg, sprites.json, level.json, tiles.png", function() {
		Q.sheet("tiles", "tiles.png", { tileW: 32, tileH: 32 });
		Q.compileSheets("spritesheet.png","sprites.json");
		Q.stageScene("title");
	});

});