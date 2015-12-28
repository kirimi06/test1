//=============================================================================
// Picture_window_riru.js
//=============================================================================
/*:
 * @plugindesc メッセージウィンドウ表示時、消去時にコモンイベントを起動させて自動ピクチャウィンドウを可能にします
 * @author riru
 *
 * @param OpenCommon
 * @desc メッセージウィンドウ表示時の起動コモンID
 * @default 0
 *
 * @param CloseCommon
 * @desc メッセージウィンドウ消去時の起動コモンID
 * @default 0
 *
 *
 * @help 
 *＜使い方＞
 *各パラメータに表示用と消去用のイベントを組んだコモンイベントIDを記入する
 *
 *
 * ＜規約＞
 * 有償無償問わず使用できます。改変もご自由にどうぞ。仕様報告もいりません。２次配布はだめです
 *著作権は放棄していません。使用する場合は以下の作者とURLをreadmeなどどこかに記載してください
 *
 * ＜作者情報＞
 *作者：riru 
 *HP：ガラス細工の夢幻
 *URL：http://garasuzaikunomugen.web.fc2.com/index.html
 */

(function() {
    var parameters = PluginManager.parameters('Picture_window_riru');
    var open_common = Number(parameters['OpenCommon'] || 0);
    var close_common = Number(parameters['CloseCommon'] || 0);
    
Riru_picturewindow_command101 =
		Game_Interpreter.prototype.command101;
Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
    //riruメッセコモン挿入
        var commonEvent = $dataCommonEvents[open_common];
   　if (commonEvent) {
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
   　 }
    }
	Riru_picturewindow_command101.call(this);
};
    
Riru_picturewindow_Window_Message_terminateMessage =
		Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
//riruウィンドウ閉じコモン挿入
        var commonEvent = $dataCommonEvents[close_common];
    if (commonEvent) {
        var eventId = $gameMap._interpreter.isOnCurrentMap() ? $gameMap._interpreter._eventId : 0;
        $gameMap._interpreter.setupChild(commonEvent.list, eventId);
    }
		Riru_picturewindow_Window_Message_terminateMessage.call(this);
};

})();

