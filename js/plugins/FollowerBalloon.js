//=============================================================================
// FollowerBalloon.js
// Version: 0.02
//=============================================================================
/*:
 * @plugindesc FollowerBalloon
 * @author karakasr_dool
 *
 * @help 
 * Plugin Command:
 * Balloon n id flag #n is a 0 to 2 numerical value , is the number of ranks .
 * 					 #id Is the id of the balloon .
 * 					 #flag Is whether to wait . true if you want to wait , it is flase If you can not wait .
 * 
 * balloon 0 1 true
 */
/*:ja
 * @plugindesc FollowerBalloon
 * @author 唐傘ドール
 * 
 * @help 
 *
 * プラグインコマンド:
 * balloon n id flag #nは、0～2の数値で、隊列の番号です。
 * #idは、バルーンのidです。
 * #flagは、待機するかです。待機する場合はtrue、待たない場合はflaseです。
 * 
 * balloon 0 1 true
 */

(function() {
	Game_Player.prototype.setBalloon = function(id, balloon) {
	    var unit = this._followers._data[id];
	    if(unit){
	    	unit.requestBalloon(balloon);
	    }
	};
	Game_Player.prototype.getFollower = function(id) {
	    return this._followers._data[id];
	};
	// Show Balloon Icon
	Game_Interpreter.prototype.commandFBalloon = function(id, balloon, flag) {
	    this._character = $gamePlayer.getFollower(id);
	    if (this._character) {
	        this._character.requestBalloon(balloon);
	        if (flag) {
	            this.setWaitMode('balloon');
	        }
	    }
	    return true;
	};
	var _old_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
	    _old_pluginCommand.call(this, command, args);
	    if(command === "balloon"){
	    	this.commandFBalloon(parseInt(args[0]), parseInt(args[1]), eval(args[2]));
	    }
	    
	};
})();

