//=============================================================================
// InCoffin.js
// ----------------------------------------------------------------------------
// <利用規約>
//  利用はRPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
//  商用、非商用、ゲームの内容を問わず利用可能です。
//  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
//  二次配布や転載は禁止します。
//  ソースコードURL、ダウンロードURLへの直接リンクも禁止します。
//  不具合対応以外のサポートやリクエストは受け付けておりません。
//  スクリプト利用により生じたいかなる問題においても、一切責任を負いかねます。
// ----------------------------------------------------------------------------
//  Ver1.00  2016/02/19  初版
//=============================================================================

/*:
 * @plugindesc 戦闘不能になったアクターを棺桶の画像にして隊列の後方に移動します。
 * @author こま
 *
 * @param Coffin Image
 * @desc 棺桶画像のファイル名を指定してください。
 * @default $Coffin
 *
 * @help
 * **このプラグインは、できるだけ他のプラグインよりも上位に配置してください。**
 *
 * 棺桶画像は、ファイル名が「$」から始まる「1キャラクター＝1ファイル」形式である必
 * 要があります（詳しくはMVヘルプの「素材規格」→「歩行キャラクター」を参照）。
 * 画像は「img/characters」フォルダに格納してください。
 *
 * *このプラグインには、プラグインコマンドはありません。
 */

(function(){
    var pluginName = 'InCoffin';
    
    var parameters = PluginManager.parameters(pluginName);
    var CoffinImage = parameters['Coffin Image'];

    var alives = null;
    
    Game_Party.prototype.aliveBattleMembers = function() {
        return this.battleMembers().filter(function(member) {
            return member.isAlive();
        });
    };

    Game_Player.prototype.refresh = function() {
        var characterName = '';
        var characterIndex = 0;
        if ($gameParty.leader()) {
            var actor = $gameParty.aliveBattleMembers()[0];
            var characterName = actor ? actor.characterName() : CoffinImage;
            var characterIndex = actor ? actor.characterIndex() : 0;
        }
        this.setImage(characterName, characterIndex);
        this._followers.refresh();
    };

    Game_Follower.prototype.refresh = function() {
        var characterName = '';
        var characterIndex = 0;
        if (this.isVisible()) {
            var actor = $gameParty.aliveBattleMembers()[this._memberIndex];
            var characterName = actor ? actor.characterName() : CoffinImage;
            var characterIndex = actor ? actor.characterIndex() : 0;
        }
        this.setImage(characterName, characterIndex);
    };
    
    var _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function() {
        if ($gamePlayer) {
            if (alives !== $gameParty.aliveMembers().length) {
                $gamePlayer.refresh();
                alives = $gameParty.aliveMembers().length;
            }
        }
        _SceneManager_updateMain.call(this);
    };
}());
