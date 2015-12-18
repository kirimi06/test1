//=============================================================================
// Plugin_Name : ev_gather
// File_Name   : rx_ev_gather.js
// Version     : 1.01
// Copylight   : 2015 TYPE74RX-T
//=============================================================================


//=============================================================================
/*:
 * @plugindesc 指定のイベントをプレイヤーがいる位置に集合させます。
 * @author TYPE74RX-T
 * @help イベントの集合・ヘルプ
 * ============================================================================
 * * イベントの集合（Japanese Document）
 * ============================================================================
 * 指定のイベントをプレイヤーがいる位置に集合させます。
 * ============================================================================
 * * 使い方
 * ============================================================================
 * イベントコマンド「スクリプト」で呼び出します。
 * 以下はイベントID1、イベントID3、イベントID5を集合させるための書式例です。
 *
 * this.ev_gather([1, 3, 5]);
 *
 * もし、座標を指定してイベントを集合させたい場合は
 *
 * this.ev_gather([event_id1, event_id2], x, y);
 *
 * ============================================================================
 * * ドキュメント終了 (Japanese Document)
 * ============================================================================
 * ============================================================================
 * * Event Gather (English Document)
 * ============================================================================
 * It then sets the specified event to the position there are players position.
 * ============================================================================
 * * How to Use
 * ============================================================================
 * This plugin tries to gathering specified event to the position of the player.
 * It will be called in "script" event command. 
 * The following is the example what gather ID1, ID3, ID5 events.
 *
 * this.ev_gather([1, 3, 5]);
 *
 * If you want to gathering the event by specifying the coordinates:
 *
 * this.ev_gather([event_id1, event_id2], x, y); //for example
 *
 * ============================================================================
 * * End of Document (English Document)
 * ============================================================================
*/
(function() {

	//Game_Interpreter
	Game_Interpreter.prototype.ev_gather = function(ev, x, y) {
		this.x = x === undefined ? $gamePlayer.x : x;
		this.y = y === undefined ? $gamePlayer.y : y;
	    var character = this.character(0);
	    var siz = Object.keys(ev).length;
	    if(siz <= 0){ return true; }
	    for (var i = 0; i < siz ; i++){
	         character = this.character(ev[i]);
	         character.locate(this.x, this.y);
	    }
	    return true;
	}

})();