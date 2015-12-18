//=============================================================================
// Plugin_Name : RX_T_AbsorbDmg_within_a_prescribed
// File_Name   : RX_T_AbsorbDmg_within_a_prescribed.js
// Version     : 1.00
// Copylight   : 2015 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:
 * @plugindesc 規定以内のダメージを吸収する敵キャラやアクターを作れるようになります。
 * @author TYPE74RX-T
 * @help 規定以内ダメージの吸収
 * ============================================================================
 * * 規定以内ダメージの吸収・ヘルプ
 * ============================================================================
 * 規定以内のダメージを吸収する敵キャラやアクターを
 * 作れるようになります。
 * ============================================================================
 * * 使い方
 * ============================================================================
 * プラグインを導入後、アクター、または敵キャラのメモ欄に記入します。
 *
 * 例：50ポイント以内のダメージを吸収する場合の書式
 * <規定以内ダメージ吸収:50>
 *
 * 【仕様】
 * 回復、または別のプラグインの使用により元々ダメージを吸収するものには
 * 効果が現れません。
 * また、この効果によって吸収したダメージは
 * メッセージ上では「回復した！」となります。
 * ============================================================================
 * * ドキュメント終了 
 * ============================================================================
*/
(function() {
	
	//RX-T original function

	function rx_getNumericFromSystemWord_inNote(obj, string){
		reg = new RegExp('<(?:' + string + '):(\\d+)>', 'i');
		return obj.note.match(reg) ? parseInt(RegExp.$1) : 0;
	};

	//Game_Action

	Game_Action.prototype.rx_minusDamagePlus = function(target) {
		//－プラグイン作者備忘録－
		//将来、新しいプラグインの追加があった時のためのダミー（要再定義）。
		//エイリアスする場合は、将来出るかもしれない別のプラグインから行うこと。
		//その場合、このプラグインを先に導入していることが前提となる。
		return 0;
	};

	var rx_t_gape151101_executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function(target, value) {
		var rx_target = target.isActor() ? target.actor() : target.enemy();
		var rx_minusDamage = rx_getNumericFromSystemWord_inNote(rx_target, "規定以内ダメージ吸収");
		if (rx_minusDamage === 0) {
			rx_minusDamage = this.rx_minusDamagePlus(rx_target);
		}
		if (value > 0 && value <= rx_minusDamage) {
			value *= -1;
		}
		rx_t_gape151101_executeDamage.call(this, target, value);
	};

})();