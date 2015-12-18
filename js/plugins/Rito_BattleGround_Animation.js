//=============================================================================
// Rito_BattleGround_Animation.js
//=============================================================================

/*:
 * @plugindesc (v1.0) Animation Scrolling Battle Background
 * @author Rito
 *
 * 
 * @help  
 * =============================================================================
 * / Animation Scrolling Battle Background \
 * By Rito 
 * =============================================================================
 * Plugin command :
 * BATTLEGROUND Background1_x Background1_y Background2_x Background2_y
 * Ex : BATTLEGROUND 1 0 1 0
 *
 * To clear :
 * BATTLEGROUND 0 0 0 0
 *
 * The background is selected in the parameters of the map.
 * Doesn't work if any background is selected in the map parameters.
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
var Imported = Imported || {};
Imported.Rito_BattleGround = true;
var Rito = Rito || {}; 

Rito.parameters = PluginManager.parameters('Rito_BattleGround_Animation');
	
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
 
    if (command.toUpperCase() === 'BATTLEGROUND') {
      Spriteset_Battle.prototype.BattleGround(args);
    };
};
  
var _alias_rito_background_effects_update = Spriteset_Battle.prototype.updateBattleback;
Spriteset_Battle.prototype.updateBattleback = function() {
	_alias_rito_background_effects_update.call(this);
	this.update_background_effects();
};


Spriteset_Battle.prototype.update_background_effects = function() {
	this._back1Sprite.origin.x += Rito.battle_bg1_x;
	this._back1Sprite.origin.y += Rito.battle_bg1_y;
	this._back2Sprite.origin.x += Rito.battle_bg2_x;
	this._back2Sprite.origin.y += Rito.battle_bg2_y;
	this._back1Sprite.update;
	this._back2Sprite.update;
};

Spriteset_Battle.prototype.BattleGround = function(args) {
    Rito.battle_bg1_x = eval(args[0]);
    Rito.battle_bg1_y = eval(args[1]);
    Rito.battle_bg2_x = eval(args[2]);
    Rito.battle_bg2_y = eval(args[3]);
};