//=============================================================================
// Destination Sprite
// DestinationSprite.js
// Version: 1.00
//=============================================================================

//=============================================================================
 /*:
* @plugindesc v1.00 - With this plugin you can change the destination place sprite of the mouse\touch input 
* @author Krimer
* 
* @param Sprite Figure
* @desc Sprite type. It can be - Square, Circle, or Off = hide sprite. Default: Square
* @default Square
* 
* @param Sprite Size
* @desc Sprite Size in pixels.
* Default: 48
* @default 48
* 
* @param Sprite Color
* @desc Sprite Color. Link where you can choose color is in "Help". Default: #ffffff
* @default #ffffff
* 
* @help Color picker can be find here or you can use any graphic editor with hex color codes:
* http://www.w3schools.com/tags/ref_colorpicker.asp
* 
 */
//=============================================================================

(function() {
	var parameters = PluginManager.parameters('DestinationSprite');
	var DSpriteFigure = String(parameters['Sprite Figure'] || 'Square');
	var DSpriteColor = String(parameters['Sprite Color'] || '#ffffff');
	var DSpriteSize = Number(parameters['Sprite Size']);
	Sprite_Destination.prototype.createBitmap = function() {
		var tileWidth = DSpriteSize || $gameMap.tileWidth();
		var tileHeight = DSpriteSize || $gameMap.tileHeight();
		this.bitmap = new Bitmap(tileWidth, tileHeight);
		if (DSpriteFigure == 'Square') {
			this.bitmap.fillAll(DSpriteColor);
		} else if (DSpriteFigure == 'Circle') {
			this.bitmap.drawCircle(this.bitmap.width/2,this.bitmap.height/2,DSpriteSize/2, DSpriteColor);
		} else if (DSpriteFigure == 'Off') {
		}	
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this.blendMode = Graphics.BLEND_ADD;
	};
})();