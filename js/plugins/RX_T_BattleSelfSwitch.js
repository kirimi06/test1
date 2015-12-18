//=============================================================================
// Plugin_Name : RX_T_BattleSelfSeitch
// File_Name   : RX_T_BattleSelfSeitch.js
// Version     : 1.00
// Copylight   : 2015 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:
 * @plugindesc イベントコマンド「セルフスイッチの操作」を使って戦闘用セルフスイッチの操作を行えるようになります。
 * @author TYPE74RX-T
 * @help バトルセルフスイッチ
 * ============================================================================
 * * バトルセルフスイッチ・ヘルプ
 * ============================================================================
 * イベントコマンド「セルフスイッチの操作」を使って
 * 戦闘用セルフスイッチの操作を行えるようになります。
 * ============================================================================
 * * 使い方
 * ============================================================================
 * プラグインを導入すれば、あとはバトルイベントで
 * イベントコマンド「セルフスイッチ」を選択して好みの操作をすればOKです。
 * ============================================================================
 * * ドキュメント終了 
 * ============================================================================
*/
(function() {
	
	//Game_Interpreter

	// Conditional Branch
	var rx_t_gipp151029_command111 = Game_Interpreter.prototype.command111;
	Game_Interpreter.prototype.command111 = function() {
		var rx_result;
		// Self Switch(in Battle)
        if ($gameTroop._troopId > 0 && $gameParty.inBattle()) {
            var rx_key = [$gameTroop._troopId, this._params[1]];
            rx_result = ($gameSelfSwitches.value(rx_key) === (this._params[2] === 0));
		    this._branch[this._indent] = rx_result;
		    if (this._branch[this._indent] === false) {
		        this.skipBranch();
		    }
		    return true;
		}
	    return rx_t_gipp151029_command111.call(this);
	};

	// Control Self Switch
	var rx_t_gipp151029_command123 = Game_Interpreter.prototype.command123;
	Game_Interpreter.prototype.command123 = function() {
		// in Battle
		if ($gameTroop._troopId > 0 && $gameParty.inBattle()) {
	        var rx_key = [$gameTroop._troopId, this._params[0]];
	        $gameSelfSwitches.setValue(rx_key, this._params[1] === 0);
	    }
	    return rx_t_gipp151029_command123.call(this);
	};

})();