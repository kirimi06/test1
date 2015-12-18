//=============================================================================
// AKUNOU_MoveCharacterWaiting.js
// Version: 0.80
// ----------------------------------------------------------------------------
// 河原 つつみ
// 連絡先 ：『アクマの脳髄』http://www.akunou.com/
//=============================================================================

/*:
 * @plugindesc RPGツクールXPにあった 移動完了までウェイト のコマンドを疑似的に再現するコマンドを追加します。
 * @author Tsutumi Kawahara
 * @help
 * プラグインコマンド(一例):
 *   WaitCharacter -1 r  # プレイヤー移動完了までウェイト
 *   WaitCharacter 0 a   # このイベントのアニメが表示終了するまでウェイト
 *   WaitCharacter 6 b   # マップイベント6番のフキダシが表示終了するまでウェイト
 * 
 * ブラグインコマンドの書式は
 * WaitCharacter (キャラクターID) (キャラクター行動)
 * として下さい。
 * 
 * キャラクターIDとは
 * -1 プレイヤー
 * 0 このイベント
 * それ以外はマップイベントの番号そのままとなります。
 * 
 * キャラクター行動とは
 * r 移動ルートの設定
 * a アニメーションの表示
 * b フキダシアイコンの表示
 * であらわされる、 r a b のいずれかになります。
 */

(function() {

    //-------------------------------------------------------------------------
    // Game_Interpreter
    //-------------------------------------------------------------------------

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'WaitCharacter') {
            this._waitCharacter['id'] = Number(args[0]);
            this._waitCharacter['mode'] = args[1];
        }
    };

    var akunou2_clear = Game_Interpreter.prototype.clear;

    Game_Interpreter.prototype.clear = function() {
        akunou2_clear.call(this);
        this._waitCharacter = {};
    };

    Game_Interpreter.prototype.updateWait = function() {
        return this.updateWaitCount() || this.updateWaitMode() || this.updateWaitCharacter();
    };

    Game_Interpreter.prototype.updateWaitCharacter = function() {
        var waiting = false;
        var character = this.character(this._waitCharacter['id']);
        if (this._waitCharacter['id'] == null || !character) {
           return waiting;
        }
        switch (this._waitCharacter['mode']) {
        case 'r':  // Route
            waiting = character.isMoveRouteForcing();
            break;
        case 'a':  // Animation
            waiting = character.isAnimationPlaying();
            break;
        case 'b':  // Balloon
            waiting = character.isBalloonPlaying();
            break;
        }
        return waiting;
    };

})();

