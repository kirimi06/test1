//=============================================================================
// MrLiu_EnemyPosition.js
//=============================================================================

/*:
 * Version: 2015-11-17-0001
 * @plugindesc 在 RMMV 游戏的横版战斗中让敌人自动排序
 * Auto Set Enemy Position in the Side-view Battle Scene
 * @author MrLiu-过眼云烟
 *
 * @param First Enemy Position X
 * @desc This formula determines the first enemy's home X position.
 * 设置首位敌人的 X 坐标，支持输入数字或变量
 * @default 200
 *
 * @param First Enemy Position Y
 * @desc This formula determines the first enemy's home Y position.
 * 设置首位敌人的 Y 坐标，支持输入数字或变量
 * @default 280
 *
 * @param First Actor Position X
 * @desc This formula determines the actor's home Y position.
 * 设置首位角色的 X 坐标，支持输入数字或变量
 * @default 32
 *
 * @param First Actor Position Y
 * @desc This formula determines the actor's home Y position.
 * 设置首位角色的 Y 坐标，支持输入数字或变量
 * @default 48
 * @help
 * 特性 - FEATURES
 * 支持透视 - Perspective supported
 *
 * 版本 - VERSION
 * 2015-11-17-0001
 * 初版发布 (PUBLISHED)
 * 由 Ryusa 进行英文转译 (Translated to English by Ryusa)
 */
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.MrLiu_EnemyPosition = true;

var Lmd = Lmd || {};
Lmd.Parameters = PluginManager.parameters('MrLiu_EnemyPosition');
Lmd.Param = Lmd.Param || {};
	Lmd.Param.x1 = Number(Lmd.Parameters['First Enemy Position X']);
  Lmd.Param.y1 = Number(Lmd.Parameters['First Enemy Position Y']);
	Lmd.Param.x2 = Number(Lmd.Parameters['First Actor Position X']);
	Lmd.Param.y2 = Number(Lmd.Parameters['First Actor Position Y']);

(function() {

	Game_Enemy.prototype.screenX = function() {
		return Lmd.Param.x1 - this.index() * Lmd.Param.x2;//this._screenX;
	};

	Game_Enemy.prototype.screenY = function() {
		return Lmd.Param.y1 + this.index() * Lmd.Param.y2;//this._screenY;
	};

})();
