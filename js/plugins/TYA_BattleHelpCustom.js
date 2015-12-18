/*:
 * @plugindesc 戦闘中のターゲット選択中に
 スキル・アイテムのヘルプを表示したままにします。
 * @author 茶の助
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {

    Window_BattleSkill.prototype.hide_s = function() {
        Window_SkillList.prototype.hide.call(this);
    };

    Window_BattleItem.prototype.hide_s = function() {
        Window_ItemList.prototype.hide.call(this);
    };

    Scene_Battle.prototype.onSelectAction = function() {
        var action = BattleManager.inputtingAction();
        this._skillWindow.hide_s(); //
        this._itemWindow.hide_s(); //
        if (!action.needsSelection()) {
            this._skillWindow.hide(); //
            this._itemWindow.hide(); //
            this.selectNextCommand();
        } else if (action.isForOpponent()) {
            this.selectEnemySelection();
        } else {
            this.selectActorSelection();
        }
    };

})();
