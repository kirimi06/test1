//=============================================================================
// EnemyBook.js
//=============================================================================

/*:
 * @plugindesc v1.4a by SkottyTV // モンスター図鑑です。敵キャラの詳細なステータスを表示します。
 * @author Yoji Ojima (Compatibility with YEP) / + SkottyTV (thx to DragonPC)
 *
 * @param ----- Functions -----
 * 
 * @param Unknown Data
 * @desc The index name for an unknown enemy.
 * @default ??????
 *
 * @param AutoFill
 * @desc Decide if enemys will automaticly show up in the book when defeated
 * @default false
 *
 * @param Gold Icon
 * @desc Decide if you want to use the Gold Icon from
 * Yanfly Core Engine. (true or false)
 * @default true
 * 
 * @param ID before Name
 * @desc Decide if enemys will have the ID number in front of their name
 * @default true
 *
 * @param Enemys in Row
 * @desc Decide how many enemys you want to show in one row.
 * (default 1, maximum is 4 !)
 * @default 1
 *
 * @param Half Index Height
 * @desc Decide if you want to half the Index Window height.
 * (default - true) (false will get overwritten by the damage window!)
 * @default true
 *
 * @param Max Skill Count
 * @desc Decide how many skills will be shown.
 * (default - 6) (6 is recommended for small resolutions!)
 * @default 6
 * 
 * @param ----- Text -----
 *
 * @param No Item Text
 * @desc Choose the text for "No Item".
 * (0 - 31 default = - none -)
 * @default - none -
 *
 * @param No Skill Text
 * @desc Choose the text for "No Item".
 * (default = - none -)
 * @default - none -
 *
 * @param Damage Mod Text
 * @desc Choose the text for "Damage Mod.".
 * (default - Damage Mod.)
 * @default Damage Mod.
 * 
 * @param ----- Colors -----
 *
 * @param Positive Damage Color
 * @desc Choose the color for positive damge mod.
 * (0 - 31 default - 3)
 * @default 3
 *
 * @param Negative Damage Color
 * @desc Choose the color for negative damge mod.
 * (0 - 31 default - 18)
 * @default 18
 *
 * @param Skills Text Color
 * @desc Choose the text color for the skills.
 * (0 - 31 default - 0)
 * @default 0
 *
 * @param Line Opacity
 * @desc Choose the opacity of the lines.
 * (0 - 255 default = 120)
 * @default 120
 *
 * @param ----- Switches -----
 *
 * @param Show Items Switch
 * @desc Choose the switch ID that shows the Items.
 * (default 0)
 * @default 0
 *
 * @param Show Ability Switch
 * @desc Choose the switch ID that shows the Abilities.
 * (default 0)
 * @default 0
 *
 * @param Show EXP Switch
 * @desc Choose the switch ID that shows the EXP.
 * (default 0)
 * @default 0
 *
 * @param Show Gold Switch
 * @desc Choose the switch ID that shows the Gold.
 * (default 0)
 * @default 0
 *
 * @param Show Status Switch
 * @desc Choose the switch ID that shows the status.
 * (default 0)
 * @default 0
 *
 * @param Show Damage Switch
 * @desc Choose the switch ID that shows the Damage window.
 * (default 0)
 * @default 0
 *
 * @param ----- Animation -----
 *
 * @param Pulsing Enemy
 * @desc Decide if you want to display an animated enemy.
 * (default true)
 * @default true
 *
 * @param Pulsing Intensity
 * @desc Decide how strong the animation should be.
 * Higher number = Less Intensity (default 4)
 * @default 4
 * 
 * @help
 *
 * ============================================================================
 * SkottyTV v1.1 ->
 *	
 * - Decide if enemys will get an entry automaticly when they appear/transform!
 * - Now you can add an Enemy by a variable value!
 * - Able to add a third info line (desc3)!
 * - Advanced Visual upgrades!
 *
 * SkottyTV v1.2 ->
 * 
 * - Decide how many columns appear in one row!
 * - Decide if you want to use the Gold Icon from Yanfly Core Engine!
 *
 * SkottyTV v1.3 ->
 * 
 * - Decide if you want to halve the Index height.
 * - Advanced Visual upgrades!
 * - Pulsing animation upgrade!
 * - Use switches to enable different information!
 *   (EXP, Gold, Items and Parameters)
 *
 * SkottyTV v1.4 ->
 * 
 * - Removed half Index Height.(to make room for the Damage Window.)
 * - Added an optional "additional damage" window!
 * - Added an optional "skills" section!
 * - Added more switches.
 * - Customizable Visual upgrades.
 * - Bug fixes!
 *
* SkottyTV v1.4a ->
/*:
 * @plugindesc モンスター図鑑です。敵キャラの詳細なステータスを表示します。
 * @author Yoji Ojima
 *
 * @param Unknown Data
 * @desc The index name for an unknown enemy.
 * @default ??????
 *
 * @help
 *
 * プラグインコマンド:
 *   EnemyBook open         # 図鑑画面を開く
 *   EnemyBook add 3        # 敵キャラ３番を図鑑に追加
 *   EnemyBook remove 4     # 敵キャラ４番を図鑑から削除
 *   EnemyBook complete     # 図鑑を完成させる
 *   EnemyBook clear        # 図鑑をクリアする
 *
 * 敵キャラのメモ:
 *   <desc1:なんとか>       # 説明１行目
 *   <desc2:かんとか>       # 説明２行目
 *   <book:no>              # 図鑑に載せない場合
 *
 * - Added max skill count function.
 
 *
 * Investigate Skill Tutorial:
 * (You will need YanFly´s Battle Engine Core and ActSeqPack1 to get it work)
 *
 * - First set the "AutoFill" option of this plugin to false
 * - Now create a skill which calls a common event X and have the following
 *   in its notebox:
 *   <Target Action>
 *    Change Variable Y = target._enemyId
 *   </Target Action>
 * - Now in the common event X call a Plugin-Line and write:
 *   EnemyBook addvar Y
 * - Done!
 *
 * (X and Y is a number you choose)
 */

(function() {
//--------------------------------------------------- Variables --------------------------------------------------------
    var parameters = PluginManager.parameters('EnemyBook');
    
    var unknownData = String(parameters['Unknown Data'] || '??????')
    var AutoFill = String(parameters['AutoFill'] || 'false');
    var IDatName = String(parameters['ID before Name'] || 'true');
    var goldIcon = String(parameters['Gold Icon'] || 'true');
    var AnimEnemy = String(parameters['Pulsing Enemy'] || 'true');
    var damageText = String(parameters['Damage Mod Text'] || 'Damage Mod.');
    var noitemText = String(parameters['No Item Text'] || '- none -');
    var noskillText = String(parameters['No Skill Text'] || '- none -');
    var HalfIndexHeight = String(parameters['Half Index Height'] || 'true');
    
    var listEnemysRow = Number(parameters['Enemys in Row']);
    var ShowItems = Number(parameters['Show Items Switch']);
    var ShowAbilities = Number(parameters['Show Ability Switch']);
    var ShowEXP = Number(parameters['Show EXP Switch']);
    var ShowGold = Number(parameters['Show Gold Switch']);
    var ShowStatus = Number(parameters['Show Status Switch']);
    var ShowDamage = Number(parameters['Show Damage Switch']);
    var posColor = Number(parameters['Positive Damage Color'] || 3);
    var negColor = Number(parameters['Negative Damage Color'] || 18);
    var skillColor = Number(parameters['Skills Text Color'] || 0);
    var lineOpacity = Number(parameters['Line Opacity'] || 120);
    var maxSkills = Number(parameters['Max Skill Count'] || 6);
    var AnimIntens = Number(parameters['Pulsing Intensity']);
//--------------------------------------------------- Plugin Commands -----------------------------------------------------------
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'EnemyBook') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_EnemyBook);
                break;
            case 'add':
                $gameSystem.addToEnemyBook(Number(args[1]));
                break;
            case 'addvar':
                $gameSystem.addToEnemyBook(Number($gameVariables.value(args[1])));
                break;
            case 'remove':
                $gameSystem.removeFromEnemyBook(Number(args[1]));
                break;
            case 'complete':
                $gameSystem.completeEnemyBook();
                break;
            case 'clear':
                $gameSystem.clearEnemyBook();
                break;
            }
        }
    };
//--------------------------------------------------- Function Add Enemy -------------------------------------------------------
    Game_System.prototype.addToEnemyBook = function(enemyId) {
        if (!this._enemyBookFlags) {
            this.clearEnemyBook();
        }
        this._enemyBookFlags[enemyId] = true;
    };
//--------------------------------------------------- Function Remove Enemy -----------------------------------------------------
    Game_System.prototype.removeFromEnemyBook = function(enemyId) {
        if (this._enemyBookFlags) {
            this._enemyBookFlags[enemyId] = false;
        }
    };
//--------------------------------------------------- Function Complete Enemy Book ----------------------------------------------
    Game_System.prototype.completeEnemyBook = function() {
        this.clearEnemyBook();
        for (var i = 1; i < $dataEnemies.length; i++) {
            this._enemyBookFlags[i] = true;
        }
    };
//--------------------------------------------------- Function Clear Enemy Book -------------------------------------------------
    Game_System.prototype.clearEnemyBook = function() {
        this._enemyBookFlags = [];
    };
//--------------------------------------------------- Function Is the Enemy In The Book -----------------------------------------
    Game_System.prototype.isInEnemyBook = function(enemy) {
        if (this._enemyBookFlags && enemy) {
            return !!this._enemyBookFlags[enemy.id];
        } else {
            return false;
        }
    };
//--------------------------------------------------- Variable/Function Is enemy in the troop, if so add enemy to book-----------
    var _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        this.members().forEach(function(enemy) {
            if (enemy.isAppeared()) {

        if (AutoFill === 'true') {
        	$gameSystem.addToEnemyBook(enemy.enemyId());
				}
            }
        }, this);
    };

    var _Game_Enemy_appear = Game_Enemy.prototype.appear;
    Game_Enemy.prototype.appear = function() {
        _Game_Enemy_appear.call(this);
        	$gameSystem.addToEnemyBook(this._enemyId);
    };

    var _Game_Enemy_transform = Game_Enemy.prototype.transform;
    Game_Enemy.prototype.transform = function(enemyId) {
        _Game_Enemy_transform.call(this, enemyId);
        	$gameSystem.addToEnemyBook(enemyId);
    };

    function Scene_EnemyBook() {
        this.initialize.apply(this, arguments);
    }
//-------------------------------------------------------------------------------------------------------------------------------
    Scene_EnemyBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_EnemyBook.prototype.constructor = Scene_EnemyBook;

    Scene_EnemyBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_EnemyBook.prototype.create = function() {

        var w3 = Graphics.boxWidth / 3;
        var ww = (Graphics.boxWidth / 3)*2 + 2;
        var wh = Graphics.boxHeight / 10;   

        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_EnemyBookIndex(0, 0);
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        
        this._statusWindow = new Window_EnemyBookStatus(w3, 0, ww, wh*2);
        if ($gameSwitches.value(ShowStatus) === true || ShowStatus === 0) {
            this._statusWindow2 = new Window_EnemyBookStatus2(w3, wh*2, ww, wh*5);
        } else{
            this._statusWindow2 = new Window_EnemyBookStatus2(w3, wh*2, ww, wh*8);
        }
        this._statusWindow3 = new Window_EnemyBookStatus3(w3, wh*7, ww, wh*3);
        this._statusWindow4 = new Window_EnemyBookStatus4(0, Graphics.boxHeight/2, w3, Graphics.boxHeight/2);
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        if ($gameSwitches.value(ShowDamage) === true || ShowDamage === 0) {
            this.addWindow(this._statusWindow4);}
        this.addWindow(this._statusWindow2);
        if ($gameSwitches.value(ShowStatus) === true || ShowStatus === 0) {
            this.addWindow(this._statusWindow3);}
        this._indexWindow.setStatusWindow(this._statusWindow);
        this._indexWindow.setStatusWindow2(this._statusWindow2);
        this._indexWindow.setStatusWindow3(this._statusWindow3);
        this._indexWindow.setStatusWindow4(this._statusWindow4);
    };

    function Window_EnemyBookIndex() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_EnemyBookIndex.prototype.constructor = Window_EnemyBookIndex;

    Window_EnemyBookIndex.lastTopRow = 0;
    Window_EnemyBookIndex.lastIndex  = 0;

    Window_EnemyBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth / 3;
        
    if ($gameSwitches.value(ShowDamage) === true || ShowDamage === 0 || HalfIndexHeight === "true") {
        var height = Graphics.boxHeight / 2;
    }
    else{
        var height = Graphics.boxHeight;
    }
        
        
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(Window_EnemyBookIndex.lastTopRow);
        this.select(Window_EnemyBookIndex.lastIndex);
        this.activate();
    };

    Window_EnemyBookIndex.prototype.maxCols = function() {
        if (listEnemysRow > 4) {
            return 4;
        }
        else{
            return listEnemysRow;
        }
    };

    Window_EnemyBookIndex.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };

    Window_EnemyBookIndex.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };
    Window_EnemyBookIndex.prototype.setStatusWindow2 = function(statusWindow2) {
        this._statusWindow2 = statusWindow2;
        this.updateStatus();
    };
    Window_EnemyBookIndex.prototype.setStatusWindow3 = function(statusWindow3) {
        this._statusWindow3 = statusWindow3;
        this.updateStatus();
    };
    Window_EnemyBookIndex.prototype.setStatusWindow4 = function(statusWindow4) {
        this._statusWindow4 = statusWindow4;
        this.updateStatus();
    };

    Window_EnemyBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };

    Window_EnemyBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var enemy = this._list[this.index()];
            this._statusWindow.setEnemy(enemy);
        }
                if (this._statusWindow2) {
            var enemy = this._list[this.index()];
            this._statusWindow2.setEnemy(enemy);
        }
                if (this._statusWindow3) {
            var enemy = this._list[this.index()];
            this._statusWindow3.setEnemy(enemy);
        }
                if (this._statusWindow4) {
            var enemy = this._list[this.index()];
            this._statusWindow4.setEnemy(enemy);
        }
    };

    Window_EnemyBookIndex.prototype.refresh = function() {
        this._list = [];
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy.name && enemy.meta.book !== 'no') {
                this._list.push(enemy);
            }
        }
        this.createContents();
        this.drawAllItems();
    };

    Window_EnemyBookIndex.prototype.drawItem = function(index) {
        var enemy = this._list[index];
        var rect = this.itemRectForText(index);
        var name;
        if ($gameSystem.isInEnemyBook(enemy)) {
		if (IDatName === 'true') {	
            		name = enemy.id + " - " + enemy.name;
		} else {
	    		name = enemy.name;
		     }
        } else {
            name = unknownData;
        }
        this.drawText(name, rect.x, rect.y, rect.width);
    };

    Window_EnemyBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_EnemyBookIndex.lastTopRow = this.topRow();
        Window_EnemyBookIndex.lastIndex = this.index();
    };

    function Window_EnemyBookStatus() {
        this.initialize.apply(this, arguments);
    }
    function Window_EnemyBookStatus2() {
       this.initialize.apply(this, arguments);
    }
    function Window_EnemyBookStatus3() {
        this.initialize.apply(this, arguments);
    }
    function Window_EnemyBookStatus4() {
        this.initialize.apply(this, arguments);
    }

    Window_EnemyBookStatus.prototype = Object.create(Window_Base.prototype);
    Window_EnemyBookStatus.prototype.constructor = Window_EnemyBookStatus;
    
    Window_EnemyBookStatus2.prototype = Object.create(Window_Base.prototype);
    Window_EnemyBookStatus2.prototype.constructor = Window_EnemyBookStatus2;
    
    Window_EnemyBookStatus3.prototype = Object.create(Window_Base.prototype);
    Window_EnemyBookStatus3.prototype.constructor = Window_EnemyBookStatus3;
    
    Window_EnemyBookStatus4.prototype = Object.create(Window_Base.prototype);
    Window_EnemyBookStatus4.prototype.constructor = Window_EnemyBookStatus4;
    
    
    Window_EnemyBookStatus2.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._enemy = null;
        this._enemySprite = new Sprite();
        this._enemySprite.anchor.x = 0.5;
        this._enemySprite.anchor.y = 0.5;
        this._enemySprite.x = this.contents.width/2;
        this._enemySprite.y = (this.contents.height/2)+20;
        this.addChildToBack(this._enemySprite);
        this.refresh();
    };

    Window_EnemyBookStatus.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };
    Window_EnemyBookStatus2.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };
    Window_EnemyBookStatus3.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };
    Window_EnemyBookStatus4.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };
    //--------------------------------------------------- Function Animate Enemy ------------------------------------------------
    if (AnimEnemy === 'true') {	
    Window_EnemyBookStatus2.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._enemySprite.bitmap) {
            var bitmapHeight = this._enemySprite.bitmap.height;
            var contentsHeight = this.contents.height;
            
                var scalex = (Math.cos(Graphics.frameCount*0.01))/AnimIntens;
                var scaley = ((Math.cos(Graphics.frameCount*0.01))/AnimIntens);
            
            this._enemySprite.scale.x = (scalex*scalex)+0.9;
            this._enemySprite.scale.y = (scaley*scaley)+0.9;
            
            if (bitmapHeight > contentsHeight) {
                this._enemySprite.scale.x = ((scaley*scaley)+0.9)-0.3;
                this._enemySprite.scale.y = ((scaley*scaley)+0.9)-0.3;
            }
        }

    };
    }
    else {
    Window_EnemyBookStatus2.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._enemySprite.bitmap) {
            var bitmapHeight = this._enemySprite.bitmap.height;
            var contentsHeight = this.contents.height;
            
                var scale = 1;
            
            this._enemySprite.scale.x = scale;
            this._enemySprite.scale.y = scale;
            
            if (bitmapHeight > contentsHeight) {
                this._enemySprite.scale.x = contentsHeight/bitmapHeight;
                this._enemySprite.scale.y = contentsHeight/bitmapHeight;
            }
        }

    };
    }
//-------------------------------------------------------------------------------------------------------------------------------
    Window_EnemyBookStatus.prototype.refresh = function() {
        
        this.contents.clear();
        
        var enemy = this._enemy;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();
        
        if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
            return;
        }
//--------------------------------------------------- Draw Enemy Discription ----------------------------------------------------

        var descWidth = 1;
        x = 1;
        y = 0;
        this.drawTextEx(enemy.meta.desc1, x, (y + lineHeight * 0)-2, descWidth);
        this.drawTextEx(enemy.meta.desc2, x, (y + lineHeight * 1)-10, descWidth);
        this.drawTextEx(enemy.meta.desc3, x, (y + lineHeight * 2)-18, descWidth);
    };
//-------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------- Draw Enemy Bitmap ---------------------------------------------------------

    Window_EnemyBookStatus2.prototype.refresh = function(actionList) {
        
        this.contents.clear();
        
        var enemy = this._enemy;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();

        if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
            this._enemySprite.bitmap = null;
            return;
        }

        var name = enemy.battlerName;
        var hue = enemy.battlerHue;
        var bitmap;
        if ($gameSystem.isSideView()) {
            bitmap = ImageManager.loadSvEnemy(name, hue);
        } else {
            bitmap = ImageManager.loadEnemy(name, hue);
        }
        
        this._enemySprite.bitmap = bitmap;
        
        this.resetTextColor();
//-------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------- Draw Abilities ------------------------------------------------------------
        
        if ($gameSwitches.value(ShowAbilities) === true || ShowAbilities === 0) {
        
            x = 1;
            y = lineHeight*1;
        
            var text = TextManager.skill + ":";

            this.contents.paintOpacity = lineOpacity;
            this.contents.fillRect(this.contents.width-this.textWidth(text), 30, this.textWidth(text), 2, this.normalColor());
            this.contents.paintOpacity = 255;
        
            this.drawText(text, this.contents.width-this.textWidth(text), -5);  
         
            for (var j = 0; j < enemy.actions.length && j < maxSkills; j++) {
                var ai = enemy.actions[j];
                    if (ai.skillId > 0) {
                        var skillName = $dataSkills[ai.skillId].name;
                        var skillIcon = $dataSkills[ai.skillId].iconIndex;
                        this.changeTextColor(this.textColor(skillColor));
                        this.drawText(skillName, this.contents.width-this.textWidth(skillName)-36, y+3);
                        this.drawIcon(skillIcon, this.contents.width-32, y+3);
                        this.changeTextColor(this.normalColor());
                        y += lineHeight
                    }
            }
            if (enemy.actions.length <= 0) {
                    this.contents.paintOpacity = lineOpacity;
                    this.drawText(noskillText, this.contents.width-this.textWidth(noskillText), y+3);
                    this.contents.paintOpacity = 255;
                }
        }
//-------------------------------------------------------------------------------------------------------------------------------
        
        
//--------------------------------------------------- Draw Items ----------------------------------------------------------------

        if ($gameSwitches.value(ShowItems) === true || ShowItems === 0) {
            
            x = 1;
            y = lineHeight*1;    
        
            this.contents.paintOpacity = lineOpacity;
            this.contents.fillRect(x, 30, this.textWidth(TextManager.item + ':'), 2, this.normalColor());
            this.contents.paintOpacity = 255;
        
            this.drawText(TextManager.item + ':', x, -5);
                for (var j = 0; j < enemy.dropItems.length; j++) {
                    var di = enemy.dropItems[j];
                        if (di.kind > 0) {
                            var item = Game_Enemy.prototype.itemObject(di.kind, di.dataId);
                            this.drawItemName(item, x, y+3);
                            y += lineHeight;
                        }
                }
                if (enemy.dropItems[0].kind <= 0) {
                    this.contents.paintOpacity = lineOpacity;
                    this.drawText(noitemText, x, y+3);
                    this.contents.paintOpacity = 255;
                }
        }    
//-------------------------------------------------------------------------------------------------------------------------------
        x = 1
        y = this.contents.height - 60
        
        var arr = [TextManager.expA, TextManager.currencyUnit];

        var lgth = 0;
        var longest;

        for(var i=0; i < arr.length; i++){
            if(arr[i].length > lgth){
                var lgth = arr[i].length;
                longest = arr[i];
            }      
        }
//--------------------------------------------------- Draw Experience -----------------------------------------------------------
        if ($gameSwitches.value(ShowEXP) === true || ShowEXP === 0) {

            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.expA, x, y - 5);
            this.resetTextColor();
            
            if (goldIcon === 'true') {
                this.drawText(enemy.exp, x + this.textWidth(TextManager.expA) + 15, y - 5);
            } else{
                this.drawText(enemy.exp, x + this.textWidth(longest) + 15, y - 5);
            }
        }
//-------------------------------------------------------------------------------------------------------------------------------
	   
//--------------------------------------------------- Draw Gold -----------------------------------------------------------------
        if ($gameSwitches.value(ShowGold) === true || ShowGold === 0) {
            this.changeTextColor(this.systemColor());
        
            if (goldIcon === 'true') {	
                this.drawIcon(Yanfly.Icon.Gold, x, y - 8 + lineHeight)
                this.resetTextColor();
                this.drawText(enemy.gold, x + this.textWidth(TextManager.expA) + 15, y - 8 + lineHeight);
            } else {
                this.drawText(TextManager.currencyUnit, x, y - 8 + lineHeight);
                this.resetTextColor();
                this.drawText(enemy.gold, x + this.textWidth(longest) + 15, y - 8 + lineHeight);
            }
        }
//-------------------------------------------------------------------------------------------------------------------------------
    }
        
    Window_EnemyBookStatus3.prototype.refresh = function() {
        
        this.contents.clear();
        
        var enemy = this._enemy;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();
        
        if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
            return;
        }
            
            this.drawText(TextManager.status, (Graphics.boxWidth/3) - (this.textWidth(TextManager.status)/2), -7, 160);
            this.resetTextColor();  

        this.contents.paintOpacity = lineOpacity;
		this.contents.fillRect(x, 27, this.contents.width, 2, this.normalColor());
		this.contents.paintOpacity = 255;

        x = (Graphics.boxWidth/3) - 235
        y = 30;

        var arr = [TextManager.param(0), TextManager.param(1), TextManager.param(2), TextManager.param(3)];

        var lgth = 0;
        var longest;

        for(var i=0; i < arr.length; i++){
            if(arr[i].length > lgth){
                var lgth = arr[i].length;
                longest = arr[i];
            }      
        }
        
        for (var i = 0; i < 4; i++) {
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(i), x, y, 160);
            this.resetTextColor();        
            this.drawText(enemy.params[i], x + this.textWidth(longest + '  '), y, 60, 'left');
            y += lineHeight-5;
        }
        
        y = 30;
        
        var arr = [TextManager.param(4), TextManager.param(5), TextManager.param(6), TextManager.param(7)];

        var lgth = 0;
        var longest2;

        for(var i=0; i < arr.length; i++){
            if(arr[i].length > lgth){
                var lgth = arr[i].length;
                longest2 = arr[i];
            }      
        }
        
        x = x + 10 + this.textWidth(longest + '  ') + 90
        
        for (var i = 4; i < 8; i++) {
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(i), x, y, 160);
            this.resetTextColor();
            this.drawText(enemy.params[i], x + this.textWidth(longest2 + '  '), y, 60, 'left');
            y += lineHeight-5;
        }
    }
    
    Window_EnemyBookStatus4.prototype.refresh = function() {
        
        this.contents.clear();
        
        var enemy = this._enemy;
        var x = 1;
        var y = 0;
        var lineHeight = this.lineHeight()-6;
        var ii = 1
                
        if (!enemy || !$gameSystem.isInEnemyBook(enemy)) {
            return;
        }
        
	   this.drawText(damageText, ((Graphics.boxWidth/3)/2)-(this.textWidth(damageText)/2)-18, y-5);
        this.contents.paintOpacity = lineOpacity;
		this.contents.fillRect(x, 29, this.contents.width, 2, this.normalColor());
		this.contents.paintOpacity = 255;
        
		for (var i = 0; i < 20; i++) {
        
			if (i < enemy.traits.length) {
				if (enemy.traits[i].code === 11) {
					this.changeTextColor(this.systemColor());
					this.drawText($dataSystem.elements[enemy.traits[i].dataId], x, y+lineHeight*ii);
						if (enemy.traits[i].value*100 > 101) {
							this.changeTextColor(this.textColor(posColor));
						}
						else{
							this.changeTextColor(this.textColor(negColor));
						}
					this.drawText((Math.round(enemy.traits[i].value*100)) + "%", (Graphics.boxWidth/3) - 110, y+lineHeight*ii, 70, 'right');
					ii += 1
					this.changeTextColor(this.normalColor());
				}
			}
		}
	};
    
})();