//=============================================================================
// Plugin_Name : RX_T_ChangeEncounterCount
// File_Name   : RX_T_ChangeEncounterCount.js
// Version     : 1.00
// Copylight   : 2015 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:
 * @plugindesc エンカウント歩数（敵の出現率）をイベントによって自在に変えることができるようになります。
 * @author TYPE74RX-T
 * @help エンカウント歩数の変更
 * ============================================================================
 * * エンカウント歩数の変更・ヘルプ
 * ============================================================================
 * エンカウント歩数（敵の出現率）を
 * イベントによって自在に変えることができるようになります。
 * ============================================================================
 * * 使い方
 * ============================================================================
 * イベントコマンド「スクリプト」で呼び出します。
 * 例１：エンカウント歩数を20に固定する場合 
 *
 * this.rx_chengeSteps(3, true);
 *
 * 例２：エンカウント歩数を5、これにランダム要素を入れる場合
 *
 * this.rx_chengeSteps(5);
 *
 * 【仕様】
 * イベントコマンド「場所移動」を使用すると設定が初期化されます。
 * 継続させたい場合は場所移動後、再度設定し直してください。
 * ============================================================================
 * * ドキュメント終了 
 * ============================================================================
*/
(function() {
	
	//Game Player
	
	var rx_t_gppi151102_initMembers = Game_Player.prototype.initMembers;
	Game_Player.prototype.initMembers = function() {
	    rx_t_gppi151102_initMembers.call(this);
	    this._rx_maxEncounterCount = 0;
	    this._rx_EncounterNoRandom = false;
	};

	var rx_t_gppm151102_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
	Game_Player.prototype.makeEncounterCount = function() {
    	var n = $gameMap.encounterStep();
    	rx_t_gppm151102_makeEncounterCount.call(this);
	    if (this._rx_EncounterNoRandom) {
	    	this._encounterCount = n;
	    }
	};

	var rx_t_gppr151102_reserveTransfer = Game_Player.prototype.reserveTransfer;
	Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
	    rx_t_gppr151102_reserveTransfer.call(this, mapId, x, y, d, fadeType);
	    this._rx_maxEncounterCount = 0;
	    this._rx_EncounterNoRandom = false;
	};

	//Game Map

	var rx_t_gmpe151102_reserveTransfer = Game_Map.prototype.encounterStep;
	Game_Map.prototype.encounterStep = function() {
	    if ($gamePlayer._rx_maxEncounterCount > 0) {
	    	return $gamePlayer._rx_maxEncounterCount;
	    }
	    return rx_t_gmpe151102_reserveTransfer.call(this);
	};

	//Game_Interpreter

	// Chenge Encounter Steps
	Game_Interpreter.prototype.rx_chengeSteps = function(steps, rx_random) {
		var rx_random2 = rx_random === undefined ? false : true
	    $gamePlayer._rx_maxEncounterCount = steps;
	    $gamePlayer._rx_EncounterNoRandom = rx_random2;
	    $gamePlayer._encounterCount = steps;
	    $gamePlayer.makeEncounterCount();
	};

})();