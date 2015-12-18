//=============================================================================
// MenuCommon.js
// Version: 0.01
//=============================================================================
/*:
 * @plugindesc Call the common event from the menu
 * @author karakasr_dool
 *
 * @param MENU_OP
 * @desc Array of menu and common id
 * @default [["test",1]]
 * @help ?

 */
/*:ja
 * @plugindesc メニュからコモンイベントを呼び出す
 * @author 唐傘ドール
 * @param MENU_OP
 * @desc メニュ名とコモンイベントIDの配列
 * @default [["test",1]]
 * @help ?
 */

(function() {
    var parameters = PluginManager.parameters('MenuCommon');
    var data = eval(parameters['MENU_OP'] || '[["test",1]]');
    
    var _old_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		_old_addOriginalCommands.call(this);
		data.forEach(function(item) {
			this.addCommand(item[0], 'common', true, item[1]);
		}, this);
	};

	Scene_Menu.prototype.createCommandWindow = function() {
	    this._commandWindow = new Window_MenuCommand(0, 0);
	    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
	    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
	    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
	    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
	    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
	    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
	    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
	    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
	    this._commandWindow.setHandler('common',   this.commandCommon.bind(this));
	    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
	    this.addWindow(this._commandWindow);
	};

	Scene_Menu.prototype.commandCommon = function() {
		SceneManager.pop();
	   	$gameTemp.reserveCommonEvent(this._commandWindow.currentExt());
	};

})();

