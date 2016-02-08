//=============================================================================
// DropDoubleCustom.js
//=============================================================================

/*:
 * @plugindesc パーティー能力の「獲得金額2倍」「アイテム入手率2倍」の数値を変更するプラグイン
 * @author kotonoha
 *
 * @help アクターや職業、装備の特徴:その他:パーティー能力において設定可能な
 * 「獲得金額2倍」「アイテム入手率2倍」の倍加数値を変更します。
 * 注：登録されているすべての項目が、ここで設定された倍率に変動します。
 * 注：値を変更後は、ゲームプロジェクトを一度保存してください。
 * 
 * @param GoldhasValue
 * @desc 「獲得金額2倍」に設定されている項目の獲得倍率を変更します。
 * @default 2
 * 
 * @param ItemhasValue
 * @desc 「アイテム入手率2倍」に設定されている項目の入手倍率を指定します。
 * @default 2
 *
 */

(function() {

    var parameters = PluginManager.parameters('DropDoubleCustom');
	var GoldhasValue = Number(parameters['GoldhasValue']);
	var ItemhasValue = Number(parameters['ItemhasValue']);

	var _Game_Troop_goldRate = Game_Troop.prototype.goldRate;
	
	Game_Troop.prototype.goldRate = function() {
		_Game_Troop_goldRate.call(this);
    	return $gameParty.hasGoldDouble() ? GoldhasValue : 1;
	};

	var _Game_Enemy_dropItemRate = Game_Enemy.prototype.dropItemRate;

	Game_Enemy.prototype.dropItemRate = function() {
		 _Game_Enemy_dropItemRate.call(this);
    	return $gameParty.hasDropItemDouble() ? ItemhasValue : 1;
	};

})();