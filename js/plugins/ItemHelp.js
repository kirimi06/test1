//=============================================================================
// ItemHelp.js
// Version: 0.01
//=============================================================================
/*:
 * @plugindesc ItemHelp
 * @author karakasr_dool
 *

 */
/*:ja
 * @plugindesc ItemHelp
 * @author 唐傘ドール
 */

(function() {
	var _old_createSubWindows = Window_Message.prototype.createSubWindows;
	Window_Message.prototype.createSubWindows = function() {
	    _old_createSubWindows.call(this);
	    this._helpWindow = new Window_Help();
	    this._itemWindow.setHelpWindow(this._helpWindow);
	    this._helpWindow.visible = false;
	};

	Window_Message.prototype.subWindows = function() {
	    return [this._goldWindow, this._choiceWindow,
	            this._numberWindow, this._itemWindow, this._helpWindow];
	};
	
	var _old_start = Window_EventItem.prototype.start;
	Window_EventItem.prototype.start = function() {
	    _old_start.call(this);
	    this._helpWindow.visible = true;
	    this._helpWindow.open();
	};

	Window_EventItem.prototype.updatePlacement = function() {
	    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
	        this.y = 0;
	        this._helpWindow.y = this.height;
	    } else {
	        this.y = Graphics.boxHeight - this.height;
	        this._helpWindow.y = this.y - this._helpWindow.height;
	    }
	};

	var _old_close = Window_EventItem.prototype.close;
	Window_EventItem.prototype.close = function() {
	    _old_close.call(this);
	    this._helpWindow.close();
	    this._helpWindow.visible = false;
	};


})();

