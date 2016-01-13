//=============================================================================
// Storage.js
//=============================================================================
/*:
 * @plugindesc シンプルな預かり所を追加します。
 * @author 翠
 * @help プラグインコマンド ｢Storage｣をイベントに記述してください。
 *
 * @param 預かり数
 * @desc 預けられる最大の数
 * @default 999
 *
 * @param 倉庫リストの区切り位置
 * @desc 倉庫リストの：の位置
 * 預かり数2桁なら00
 * 預かり数3桁なら000 
 * @default 000
 *
 * @param 預けるコマンドの名称
 * @desc 
 * @default 預ける
 *
 * @param 引き出すコマンドの名称
 * @desc 
 * @default 引き出す
 *
 * @param 大事な物カテゴリ表示フラグ
 * @desc
 * @default false
 * 
 * @param 数値ウィンドウ横幅
 * @desc
 * @default 400
 * 
 * @param 数値ウィンドウ縦幅
 * @desc
 * @default 76
 * 
 * @param 数値ウィンドウ縦位置補正
 * @desc
 * @default 24
 * 
*/

var $gameStorage       = null;
var Mot = Mot || {};
Mot.Storage = Mot.Storage || {};
Mot.Storage.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    Mot.Storage.DataManager_createGameObjects.call(this);
    $gameStorage       = new Game_Storage();
};

Mot.Storage.DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = Mot.Storage.DataManager_makeSaveContents.call(this);
    contents.storage      = $gameStorage;
    return contents;
};
Mot.Storage.DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Mot.Storage.DataManager_extractSaveContents.call(this, contents);
    $gameStorage       = contents.storage;
};

function Game_Storage() {
    this.initialize.apply(this, arguments);
}
(function() {
    var parameters = PluginManager.parameters('Storage');
    var l_pos   = String(parameters['倉庫リストの区切り位置'] || '000');
    var s_val   = String(parameters['引き出すコマンドの名称'] || '預ける');
    var p_val   = String(parameters['預けるコマンドの名称'] || '引き出す');
    var c_vis   = String(parameters['大事な物カテゴリ表示フラグ'] || 'false');    
    var maxst   = Number(parameters['預かり数'] || 999);
    var num_w   = Number(parameters['数値ウィンドウ横幅'] || 400);
    var num_h   = Number(parameters['数値ウィンドウ縦幅'] || 76);
    var num_y   = Number(parameters['数値ウィンドウ縦位置補正'] || 24);
    
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Storage') {
            SceneManager.push(Scene_Storage);
        }
    };
    Game_Storage.prototype = Object.create(Game_Unit.prototype);
    Game_Storage.prototype.constructor = Game_Storage;

    Game_Storage.prototype.initialize = function() {
        Game_Unit.prototype.initialize.call(this);
        this._lastItem = new Game_Item();
        this.initAllItems();
    };

    Game_Storage.prototype.initAllItems = function() {
        this._items = {};
        this._weapons = {};
        this._armors = {};
    };

    Game_Storage.prototype.items = function() {
        var list = [];
        for (var id in this._items) {
            list.push($dataItems[id]);
        }
        return list;
    };

    Game_Storage.prototype.weapons = function() {
        var list = [];
        for (var id in this._weapons) {
            list.push($dataWeapons[id]);
        }
        return list;
    };

    Game_Storage.prototype.armors = function() {
        var list = [];
        for (var id in this._armors) {
            list.push($dataArmors[id]);
        }
        return list;
    };
    Game_Storage.prototype.equipItems = function() {
        return this.weapons().concat(this.armors());
    };

    Game_Storage.prototype.allItems = function() {
        return this.items().concat(this.equipItems());
    };

    Game_Storage.prototype.itemContainer = function(item) {
        if (!item) {
            return null;
        } else if (DataManager.isItem(item)) {
            return this._items;
        } else if (DataManager.isWeapon(item)) {
            return this._weapons;
        } else if (DataManager.isArmor(item)) {
            return this._armors;
        } else {
            return null;
        }
    };

    Game_Storage.prototype.numItems = function(item) {
        var container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    };

    Game_Storage.prototype.maxItems = function(item) {
        return maxst;
    };

    Game_Storage.prototype.hasMaxItems = function(item) {
        return this.numItems(item) >= this.maxItems(item);
    };

    Game_Storage.prototype.hasItem = function(item, includeEquip) {
        if (includeEquip === undefined) {
            includeEquip = false;
        }
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item)) {
            return true;
        } else {
            return false;
        }
    };

    Game_Party.prototype.lastItem = function() {
        return this._lastItem.object();
    };

    Game_Party.prototype.setLastItem = function(item) {
        this._lastItem.setObject(item);
    };

    Game_Storage.prototype.isAnyMemberEquipped = function(item) {
        return this.members().some(function(actor) {
            return actor.equips().contains(item);
        });
    };

    Game_Storage.prototype.gainItem = function(item, amount, includeEquip) {
        var container = this.itemContainer(item);
        if (container) {
            var lastNumber = this.numItems(item);
            var newNumber = lastNumber + amount;
            container[item.id] = newNumber.clamp(0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            $gameMap.requestRefresh();
        }
    };

    Game_Storage.prototype.loseItem = function(item, amount, includeEquip) {
        this.gainItem(item, -amount, includeEquip);
    };

    //-----------------------------------------------------------------------------
    // Scene_Storage
    //-----------------------------------------------------------------------------

    function Scene_Storage() {
        this.initialize.apply(this, arguments);
    }

    Scene_Storage.prototype = Object.create(Scene_ItemBase.prototype);
    Scene_Storage.prototype.constructor = Scene_Storage;

    Scene_Storage.prototype.initialize = function() {
        Scene_ItemBase.prototype.initialize.call(this);
        this.sMode = null;
    };

    Scene_Storage.prototype.create = function() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createCoiceWindow();
        this.createCategoryWindow();
        this.createSItemWindow();
        this.createPItemWindow();
        this.createNumberWindow();
    };

    Scene_Storage.prototype.createCategoryWindow = function() {
        this._categoryWindow = new Window_ItemCategory();
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.y = this._helpWindow.height;
        this._categoryWindow.setHandler('ok',     this.selectStorage.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    };

    Scene_Storage.prototype.createCoiceWindow = function() {
        this._coiceWindow = new Window_Coice();
        this._coiceWindow.setHelpWindow(this._helpWindow);
        this._coiceWindow.y = this._helpWindow.height;
        this._coiceWindow.setHandler('ok',     this.storageOk.bind(this));
        this._coiceWindow.setHandler('cancel', this.returnCategory.bind(this));
        this.addWindow(this._coiceWindow);
        this._coiceWindow.deactivate();
        
    };
    Scene_Storage.prototype.createSItemWindow = function() {
        var wy = this._categoryWindow.y + this._categoryWindow.height;
        var wh = Graphics.boxHeight - wy;
        this._sitemWindow = new Window_ItemList_Storage(0, wy, Graphics.boxWidth / 2, wh);
        this._sitemWindow.setHelpWindow(this._helpWindow);
        this._sitemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._sitemWindow.setHandler('cancel', this.returnCoice.bind(this));
        this.addWindow(this._sitemWindow);
        this._categoryWindow.setSItemWindow(this._sitemWindow);
    };
    Scene_Storage.prototype.createPItemWindow = function() {
        var wy = this._categoryWindow.y + this._categoryWindow.height;
        var wh = Graphics.boxHeight - wy;
        var wx = this._sitemWindow.width;
        this._pitemWindow = new Window_ItemList_Paty(wx, wy, Graphics.boxWidth / 2, wh);
        this._pitemWindow.setHelpWindow(this._helpWindow);
        this._pitemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._pitemWindow.setHandler('cancel', this.returnCoice.bind(this));
        this.addWindow(this._pitemWindow);
        this._categoryWindow.setPItemWindow(this._pitemWindow);
    };

    Scene_Storage.prototype.createNumberWindow = function() {
        var wy = (Graphics.boxHeight / 2) - (num_h + num_y);
        var wx = (Graphics.boxWidth - num_w ) / 2;
        this._numberWindow = new Window_StorageNumber(wx, wy, num_w);
        this._numberWindow.hide();
        this._numberWindow.setHandler('ok',     this.onNumberOk.bind(this));
        this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };

    Scene_Storage.prototype.selectStorage = function() {
        this._categoryWindow.deactivate();
        this._categoryWindow.hide();
        this._coiceWindow.activate();
        this._coiceWindow.show();

    };

    Scene_Storage.prototype.storageOk = function() {
        this.sMode = (this._coiceWindow._index == 0) ? this._pitemWindow:this._sitemWindow;
        this.sMode.activate();
        this.sMode.select(0);
    };

    Scene_Storage.prototype.returnCategory = function() {
        this._categoryWindow.activate();
        this._categoryWindow.show();
        this._coiceWindow.deactivate();
        this._coiceWindow.hide();
    };

    Scene_Storage.prototype.onItemOk = function() {
        this._numberWindow.setup(this.sMode.getitem(), this.sMode.getnum(),this._coiceWindow._index);
        this._numberWindow.setCurrencyUnit(true);
        this._numberWindow.show();
        this._numberWindow.activate();
    };

    Scene_Storage.prototype.returnCoice = function() {
            this.sMode.deselect();
            this.sMode.deactivate();
            this._coiceWindow.activate();
    };

    Scene_Storage.prototype.onCategoryOk = function() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };

    Scene_Storage.prototype.onNumberOk = function() {
        var item = this._numberWindow.tradeItem();
        if (this._coiceWindow._index == 0){
            $gameParty.loseItem(item[0],item[1]);
            $gameStorage.gainItem(item[0],item[1]);
        }else{
            $gameParty.gainItem(item[0],item[1]);
            $gameStorage.loseItem(item[0],item[1]);
        }
        SoundManager.playOk();
        this._sitemWindow.refresh();
        this._pitemWindow.refresh();
        
        this.sMode.activate();
        this._numberWindow.hide();
        this._numberWindow.deactivate();
    };

    Scene_Storage.prototype.onNumberCancel = function() {
        this.sMode.activate();
        this._numberWindow.hide();
        this._numberWindow.deactivate();
    };

    //-----------------------------------------------------------------------------
    // Window_Coice
    //-----------------------------------------------------------------------------

    function Window_Coice() {
        this.initialize.apply(this, arguments);
    }

    Window_Coice.prototype = Object.create(Window_HorzCommand.prototype);
    Window_Coice.prototype.constructor = Window_Coice;

    Window_Coice.prototype.initialize = function() {
        Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    };

    Window_Coice.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_Coice.prototype.maxCols = function() {
        return 2;
    };

    Window_Coice.prototype.makeCommandList = function() {
        this.addCommand(p_val,  'gain');
        this.addCommand(s_val,  'lose');
    };

    //-----------------------------------------------------------------------------
    // Window_ItemCategory
    //-----------------------------------------------------------------------------

    function Window_ItemCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemCategory.prototype = Object.create(Window_HorzCommand.prototype);
    Window_ItemCategory.prototype.constructor = Window_ItemList;

    Window_ItemCategory.prototype.initialize = function() {
        Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    };

    Window_ItemCategory.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_ItemCategory.prototype.maxCols = function() {
        if (c_vis == 'true'){
            return 4;
        }else{
            return 3;
        }
    };

    Window_ItemCategory.prototype.update = function() {
        Window_HorzCommand.prototype.update.call(this);
        if (this._sitemWindow) {
            this._sitemWindow.setCategory(this.currentSymbol());
        }
        if (this._pitemWindow) {
            this._pitemWindow.setCategory(this.currentSymbol());
        }
    };

    Window_ItemCategory.prototype.makeCommandList = function() {
        this.addCommand(TextManager.item,    'item');
        this.addCommand(TextManager.weapon,  'weapon');
        this.addCommand(TextManager.armor,   'armor');
        if (c_vis == 'true'){
            this.addCommand(TextManager.keyItem, 'keyItem');
        };
    };

    Window_ItemCategory.prototype.setItemWindow = function(itemWindow) {
        this._sitemWindow = itemWindow;
        this._pitemWindow = itemWindow;
        this.update();
    };
    Window_ItemCategory.prototype.setSItemWindow = function(itemWindow) {
        this._sitemWindow = itemWindow;
        this.update();
    };
    Window_ItemCategory.prototype.setPItemWindow = function(itemWindow) {
        this._pitemWindow = itemWindow;
        this.update();
    };

    //-----------------------------------------------------------------------------
    // Window_ItemList_Paty
    //-----------------------------------------------------------------------------

    function Window_ItemList_Paty() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemList_Paty.prototype = Object.create(Window_ItemList.prototype);
    Window_ItemList_Paty.prototype.constructor = Window_ItemList;

    Window_ItemList_Paty.prototype.maxCols = function() {
        return 1;
    };

	Window_ItemList_Paty.prototype.isCurrentItemEnabled = function() {
	    return this.item();
	};
    Window_ItemList_Paty.prototype.isEnabled = function(item) {
        return true;
    };

    Window_ItemList_Paty.prototype.makeItemList = function() {
        this._data = $gameParty.allItems().filter(function(item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    Window_ItemList_Paty.prototype.selectLast = function() {
        var index = this._data.indexOf($gameParty.lastItem());
        this.select(index >= 0 ? index : 0);
    };

    Window_ItemList_Paty.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.textWidth('00'), 'right');
            this.drawText($gameParty.numItems(item), x, y, width, 'right');
        }
    };
    Window_ItemList_Paty.prototype.getitem = function() {
        var index = this.index();
        var item = this._data[index];
        return this._data && index >= 0 ? this._data[index] : null;
    };
    Window_ItemList_Paty.prototype.getnum = function() {
        var index = this.index();
        var item = this._data[index];
        return $gameParty.numItems(item)
    };

    //-----------------------------------------------------------------------------
    // Window_ItemList_Storage
    //-----------------------------------------------------------------------------

    function Window_ItemList_Storage() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemList_Storage.prototype = Object.create(Window_ItemList.prototype);
    Window_ItemList_Storage.prototype.constructor = Window_ItemList_Storage;

    Window_ItemList_Storage.prototype.maxCols = function() {
        return 1;
    };

	Window_ItemList_Storage.prototype.isCurrentItemEnabled = function() {
	    return this.item();
	};
	
    Window_ItemList_Storage.prototype.isEnabled = function(item) {
        return true
    };

    Window_ItemList_Storage.prototype.makeItemList = function() {
        this._data = $gameStorage.allItems().filter(function(item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    Window_ItemList_Storage.prototype.selectLast = function() {
        var index = this._data.indexOf($gameStorage.lastItem());
        this.select(index >= 0 ? index : 0);
    };

    Window_ItemList_Storage.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.textWidth(l_pos), 'right');
            this.drawText($gameStorage.numItems(item), x, y, width, 'right');
        }
    };

    Window_ItemList_Storage.prototype.getitem = function() {
        var index = this.index();
        var item = this._data[index];
        return this._data && index >= 0 ? this._data[index] : null;
    };
    Window_ItemList_Storage.prototype.getnum = function() {
        var index = this.index();
        var item = this._data[index];
        return $gameStorage.numItems(item)
    };
    //-----------------------------------------------------------------------------
    // Window_StorageNumber
    //-----------------------------------------------------------------------------

    function Window_StorageNumber() {
        this.initialize.apply(this, arguments);
    }

    Window_StorageNumber.prototype = Object.create(Window_ShopNumber.prototype);
    Window_StorageNumber.prototype.constructor = Window_StorageNumber;

    Window_StorageNumber.prototype.initialize = function(x, y, height) {
        var width = this.windowWidth();
        Window_Selectable.prototype.initialize.call(this, x, y, width, num_h);
        this._item = null;
        this._max = 1;
        this._number = 1;
        this._currencyUnit = TextManager.currencyUnit;
    };

    Window_StorageNumber.prototype.windowWidth = function() {
        return num_w;
    };

    Window_StorageNumber.prototype.setup = function(item, max, mode) {
        this._item = item;
        this._max = Math.floor(max);
        this._mode = mode;
        this._gameob = (mode == 0 ? $gameStorage:$gameParty);
        this._number = (this._gameob.maxItems() == this._gameob.numItems(this._item)) ? 0 : 1;
        this.refresh();
    };

    Window_StorageNumber.prototype.refresh = function() {
        this.contents.clear();
        this.drawItemName(this._item, 0, 0);
        this.drawMultiplicationSign();
        this.drawNumber();
    };

    Window_StorageNumber.prototype.changeNumber = function(amount) {
        var lastNumber = this._number;
        var maxtemp = (this._mode == 0 ? this._gameob.maxItems():this._gameob.maxItems());
        var temp = (this._number + amount).clamp(1, this._max);
        if ((this._gameob.numItems(this._item) + temp) <= maxtemp){
            this._number = temp;
        }else{
            this._number = (maxtemp - this._gameob.numItems(this._item)); 
        }
        if (this._number !== lastNumber) {
            SoundManager.playCursor();
            this.refresh();
        }
    };

    Window_StorageNumber.prototype.tradeItem = function() {
        return [this._item,this._number];
    };

    Window_StorageNumber.prototype.itemY = function() {
        return 0
    };

    Window_StorageNumber.prototype.maxDigits = function() {
        return 2;
    };

})();