//=============================================================================
// ActorCommandPlus.js
// Version: 0.02
//=============================================================================
/*:
 * @plugindesc Attacks on fellow
 * @author karakasr_dool
 *
 * @help 
 * At the time of selecting the target , it can be switched to friend and foe by pressing the shift key
 */
/*:ja
 * @plugindesc 仲間への攻撃
 * @author 唐傘ドール
 * @help 
 * 対象を選択の時に、シフトキーを押すと敵味方を切り替えられる
 */

(function() {

Window_BattleActor.prototype.change = function() {
    this.updateInputData();
    this.deactivate();	
    this.callHandler('change');
};


Window_BattleActor.prototype.initialize = function(x, y) {
    Window_BattleStatus.prototype.initialize.call(this);
    this.x = x;
    this.y = y;
    this.openness = 255;
    this.hide();
    var bitmap = ImageManager.loadSystem('IconSet');
    this._buttons = new Sprite_Button();
    this._buttons.bitmap = bitmap;
    var x = 32 * 11;
    var y = 32 * 4;
    this._buttons.setColdFrame(x, y, 32, 32);
    this._buttons.setHotFrame(x, y, 32, 32);
    this._buttons.visible = true;
    this._buttons.x = 0;
    this._buttons.y = 0;
    this._buttons.setClickHandler(this.change.bind(this));
    this.addChild(this._buttons);
};

Window_BattleActor.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.updateButtonsVisiblity();
    if (this.isOpenAndActive()){
        if (Input.isTriggered('shift')) {
        	this.change();
        }
    }
};

Window_BattleActor.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this._buttons.visible = true;
    } else {
        this._buttons.visible = false;
    }
};

Window_BattleActor.prototype.standardPadding = function() {
    return 32;
};

Window_BattleEnemy.prototype.standardPadding = function() {
    return 32;
};

Window_BattleEnemy.prototype.initialize = function(x, y) {
    this._enemies = [];
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.hide();
    var bitmap = ImageManager.loadSystem('IconSet');
    this._buttons = new Sprite_Button();
    this._buttons.bitmap = bitmap;
    var x = 32 * 11;
    var y = 32 * 4;
    this._buttons.setColdFrame(x, y, 32, 32);
    this._buttons.setHotFrame(x, y, 32, 32);
    this._buttons.visible = true;
    this._buttons.x = 0;
    this._buttons.y = 0;
    this._buttons.setClickHandler(this.change.bind(this));
    this.addChild(this._buttons);
};

Window_BattleEnemy.prototype.change = function() {
    this.updateInputData();
    this.deactivate();	
    this.callHandler('change');
};

Window_BattleEnemy.prototype.update = function() {
	this.updateButtonsVisiblity();
    Window_Selectable.prototype.update.call(this);
    if (this.isOpenAndActive()){
        if (Input.isTriggered('shift')) {
        	this.change();
        }
    }
};

Window_BattleEnemy.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this._buttons.visible = true;
    } else {
        this._buttons.visible = false;
    }
};

Scene_Battle.prototype.createActorWindow = function() {
    this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this._actorWindow.setHandler('change', this.onActorChange.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.onActorChange = function() {
    this._actorWindow.hide();
    var action = BattleManager.actor();
    action.currentAction().reverse();
    this.selectEnemySelection();
};


Scene_Battle.prototype.createEnemyWindow = function() {
    this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
    this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
    this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
    this._enemyWindow.setHandler('change', this.onEnemyChange.bind(this));
    this.addWindow(this._enemyWindow);
};

Scene_Battle.prototype.onEnemyChange = function() {
    this._enemyWindow.hide();
    var action = BattleManager.actor();
    action.currentAction().reverse();
    this.selectActorSelection();
};

Game_Action.prototype.makeTargets = function() {
    var targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets = [this.confusionTarget()];
    } else if (this.isForOpponent() === !this._reverse) {
        targets = this.targetsForOpponents();
    } else if (this.isForFriend() === !this._reverse) {
        targets = this.targetsForFriends();
    }
    this._reverse = false;
    return this.repeatTargets(targets);
};

Game_Action.prototype.reverse = function() {
    this._reverse = !this._reverse;
};

})();

