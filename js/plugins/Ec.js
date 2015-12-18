//=============================================================================
// Ec.js
//=============================================================================

/*:
 * @plugindesc The number of destroyed enemy
 * @author karakasr_dool
 *
 * 
 * @help 
 * Data acquisition
 * $gameSystem.get_enemy_die_list(id);
 * Data of reset
 * $gameSystem.enemy_die_list_reset(id);
 * Reset all data
 * $gameSystem.enemy_die_list_all_reset;
 */

/*:ja
 * @plugindesc 撃破エネミーの数
 * @author karakasr_dool
 *
 * @help 
 * データ獲得
 * $gameSystem.get_enemy_die_list(id);
 * データのリセット
 * $gameSystem.enemy_die_list_reset(id);
 * すべてデータのリセット
 * $gameSystem.enemy_die_list_all_reset;
 */

(function() {
    var _old_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
    	_old_initialize.call(this);
    	this.enemy_die_list = [];
    }
    
    Game_System.prototype.get_enemy_die_list = function(id) {
    	return this.enemy_die_list[id];
    }
    
    Game_System.prototype.enemy_die_count = function(id) {
    	this.enemy_die_list[id] = this.enemy_die_list[id] || 0;
    	this.enemy_die_list[id]++;
    }
    
    Game_System.prototype.enemy_die_list_reset = function(id) {
    	this.enemy_die_list[id] = 0;
    }
    
    Game_System.prototype.enemy_die_list_all_reset = function() {
    	this.enemy_die_list = [];
    }
    
	Game_Enemy.prototype.die = function() {
	   Game_BattlerBase.prototype.die.call(this);
	   $gameSystem.enemy_die_count(this._enemyId);
	};
})();

