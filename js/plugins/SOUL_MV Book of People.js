//=============================================================================
// SOUL_MV Book of People.js
//=============================================================================

/*:
 * @plugindesc Displays a detailed status of the people you've met in your adventure.
 * @author Soulpour777 - soulxregalia.wordpress.com
 *
 * @param Show on Menu
 * @desc Would you like to have the Book of People command appear on the Menu? (true / false)
 * @default true
 *
 * @param List Window Opacity
 * @desc Opacity of the book list window.
 * @default 255
 *
 * @param Status Window Opacity
 * @desc Opacity of the book status window.
 * @default 255
 *
 * @param List Window Width
 * @desc Width of the book list window.
 * @default 300
 *
 * @param List Window Height
 * @desc Height of the book list window.
 * @default 624
 *
 * @param Unknown Data Name
 * @desc The temporary name if the npc / person is yet to be identified / unknown.
 * @default ?????? ???????
 *
 * @param Person Name
 * @desc The text affiliated with what the name of the person is on the book.
 * @default Name
 *
 * @param Age Name
 * @desc The text affiliated with what is the age of the person is on the book.
 * @default Age
 *
 * @param Age Y Axis
 * @desc Y axis location of the age in the window.
 * @default 0
 *
 * @param Job Name
 * @desc The text affiliated with what the job of the person is on the book.
 * @default Job
 *
 * @param Job Y Axis
 * @desc Y axis location of the age in the window.
 * @default 50
 *
 * @param Place Name
 * @desc The text affiliated with the person's living place.
 * @default Place
 *
 * @param Place Y Axis
 * @desc Y Place location of the place in the window.
 * @default 100
 *
 * @param Skill Name
 * @desc The text affiliated with the person's skill.
 * @default Skills
 *
 * @param Status Name
 * @desc The text affiliated with the person's status.
 * @default Status
 *
 * @param Status Y Axis
 * @desc Y axis location of the status in the window.
 * @default 150
 *
 * @param Skill Y Axis
 * @desc Y axis location of the skill in the window.
 * @default 200
 *
 * @param Biography Name
 * @desc The text affiliated with the person's biography.
 * @default Background Detail
 *
 * @param Biography Y Axis
 * @desc Y axis location of the biography name in the window.
 * @default 250
 *
 * @param Biography Desc Y Axis
 * @desc Y axis location of the biography description in the window.
 * @default 290
 *
 * @param Motto Name
 * @desc The text affiliated with what the person's motto.
 * @default Attestation
 *
 * @param Motto Y Axis
 * @desc Y axis location of the motto name in the window.
 * @default 420
 *
 * @param Motto Desc Y Axis
 * @desc Y axis location of the motto description in the window.
 * @default 460
 *
 * @param Background Name
 * @desc The name of your background iamge used when inside the Book.
 * @default bookBG
 *
 * @param Background Scroll X
 * @desc Horizontal speed of the background scrolling.
 * @default 1
 *
 * @param Background Scroll Y
 * @desc Vertical speed of the background scrolling.
 * @default 0
 *
 * @param Portrait X
 * @desc X axis of the portrait.
 * @default 160
 *
 * @param Portrait Y
 * @desc Y axis of the portrait.
 * @default 180
 *
 * @help
//=============================================================================
// SOUL_MV Book of People.js
// Author: Soulpour777
//=============================================================================

Place all the images on the img/bookofpeople folder.

Reminder:

When you add the record on the book, it is necessary that you add the item
in your inventory first. Once added through the plugin command, you can
just remove it afterwards.

 * Plugin Command:
 *   BookOfPeople open            
 	# Opens the Book of People screen.

 *   BookOfPeople add 3 
 	# Adds npc item #3 to the book.

 *   BookOfPeople remove 3        
 	# Removes npc item #3 from the book.

 *   BookOfPeople complete        
 	# Completes the npc book.

 *   BookOfPeople clear           
 	# Clears the npc book.

 * Note:
 *   <npc_item>                   
 	# Place this on the item note tag to identify 
 	it as an NPC rather than an item.

 Note Tags:

<npc_status:x>
# where x is the status of the person when you've met him / her.
# e.g. <npc_status: Single>

<npc_skills:x>
# where x is the skills of the person you've recorded in the book.
# e.g. <npc_skills: Chrono Trigger>

<npc_job:x>
# where x is the job of the person you've recorded in the book.
# e.g. <npc_job:Goddess Unlimited License>	

<npc_description:x>
# where x is the small description or bio of the person you
are recording in the book. Descriptions is usually 3 lines.
You can always adjust how many lines depending on how
the text is drawn in the window.
# e.g. <npc_description:Daughter of the Goddess Verthandi. 
She is asked by  her mother to 
acquire the Nibelungen Ring.>

<npc_place:x>
# where x is the place where you've seen and met the person.
# e.g. <npc_place:Wyrd Tree>

<npc_motto:x>
# where x is the motto of the person.
# e.g. <npc_motto: No one escapes this blades!>
	
<npc_age:x>
# where x is the age of the person you met. 
# e.g. <npc_age: 19>
# e.g. <npc_age: XIX>
# e.g. <npc_age: Nineteen>	
 */


(function() {
	var SOUL_MV = SOUL_MV || {};
	SOUL_MV.BookOfPeople = {};
    SOUL_MV.BookOfPeople.unknownData = PluginManager.parameters('SOUL_MV Book of People')['Unknown Data'] || '?????? ???????';

    SOUL_MV.BookOfPeople.showOnMenu = PluginManager.parameters('SOUL_MV Book of People')['Show on Menu'] === "true" ? true : false;

    SOUL_MV.BookOfPeople.ageY = Number(PluginManager.parameters('SOUL_MV Book of People')['Age Y Axis'] || 0);
    SOUL_MV.BookOfPeople.jobY = Number(PluginManager.parameters('SOUL_MV Book of People')['Job Y Axis'] || 50);  
    SOUL_MV.BookOfPeople.placeY = Number(PluginManager.parameters('SOUL_MV Book of People')['Place Y Axis'] || 100);
    SOUL_MV.BookOfPeople.statusY = Number(PluginManager.parameters('SOUL_MV Book of People')['Status Y Axis'] || 150);  
    SOUL_MV.BookOfPeople.skillY = Number(PluginManager.parameters('SOUL_MV Book of People')['Skill Y Axis'] || 200);
    SOUL_MV.BookOfPeople.bioY = Number(PluginManager.parameters('SOUL_MV Book of People')['Biography Y Axis'] || 250);  
    SOUL_MV.BookOfPeople.biodescY = Number(PluginManager.parameters('SOUL_MV Book of People')['Biography Desc Y'] || 290);
    SOUL_MV.BookOfPeople.mottoY = Number(PluginManager.parameters('SOUL_MV Book of People')['Motto Y Axis'] || 420);  
    SOUL_MV.BookOfPeople.mottodescY = Number(PluginManager.parameters('SOUL_MV Book of People')['Motto Desc Y Axis'] || 460); 

    SOUL_MV.BookOfPeople.personName = PluginManager.parameters('SOUL_MV Book of People')['Person Name'] || 'Name';
    SOUL_MV.BookOfPeople.jobName = PluginManager.parameters('SOUL_MV Book of People')['Job Name'] || 'Job';
    SOUL_MV.BookOfPeople.placeName = PluginManager.parameters('SOUL_MV Book of People')['Place Name'] || 'Place';
    SOUL_MV.BookOfPeople.statusName = PluginManager.parameters('SOUL_MV Book of People')['Status Name'] || 'Status';
    SOUL_MV.BookOfPeople.skillName = PluginManager.parameters('SOUL_MV Book of People')['Skill Name'] || 'Skills';
    SOUL_MV.BookOfPeople.ageName = PluginManager.parameters('SOUL_MV Book of People')['Age Name'] || 'Age';
    SOUL_MV.BookOfPeople.biographyName = PluginManager.parameters('SOUL_MV Book of People')['Biography Name'] || 'Background Detail';
    SOUL_MV.BookOfPeople.bookBG = PluginManager.parameters('SOUL_MV Book of People')['Background Name'] || 'bookBG';
    SOUL_MV.BookOfPeople.mottoName = PluginManager.parameters('SOUL_MV Book of People')['Motto Name'] || 'Attestation';

    SOUL_MV.BookOfPeople.bgScrollX = Number(PluginManager.parameters('SOUL_MV Book of People')['Background Scroll X'] || 1);
    SOUL_MV.BookOfPeople.bgScrollY = Number(PluginManager.parameters('SOUL_MV Book of People')['Background Scroll Y'] || 0);

    SOUL_MV.BookOfPeople.listOpacity = Number(PluginManager.parameters('SOUL_MV Book of People')['List Window Opacity'] || 255);
    SOUL_MV.BookOfPeople.statusOpacity = Number(PluginManager.parameters('SOUL_MV Book of People')['Status Window Opacity'] || 255);

	SOUL_MV.BookOfPeople.winWidth = Number(PluginManager.parameters('SOUL_MV Book of People')['List Window Width'] || 300);
	SOUL_MV.BookOfPeople.winHeight = Number(PluginManager.parameters('SOUL_MV Book of People')['List Window Height'] || 624);

    SOUL_MV.BookOfPeople.portraitX = Number(PluginManager.parameters('SOUL_MV Book of People')['Portrait X'] || 160);
    SOUL_MV.BookOfPeople.portraitY = Number(PluginManager.parameters('SOUL_MV Book of People')['Portrait Y'] || 180);    

    SOUL_MV.BookOfPeople_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        SOUL_MV.BookOfPeople_Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'BookOfPeople') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(SOUL_MV_Scene_PeopleBook);
                break;
            case 'add':
                $gameSystem.addToPeopleBook(1, Number(args[1]));
                break;
            case 'remove':
                $gameSystem.removeFromItemBook(1, Number(args[1]));
                break;
            case 'complete':
                $gameSystem.completeItemBook();
                break;
            case 'clear':
                $gameSystem.clearPeopleBook();
                break;
            }
        }
    };

    SOUL_MV.BookOfPeople.addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function() {
		SOUL_MV.BookOfPeople.addOriginalCommands.call(this);
		if(SOUL_MV.BookOfPeople.showOnMenu)this.addCommand('Book of People', 'bookofpeopleX', true);
	};

	SOUL_MV.BookOfPeople.createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		SOUL_MV.BookOfPeople.createCommandWindow.call(this);
	    if(SOUL_MV.BookOfPeople.showOnMenu)this._commandWindow.setHandler('bookofpeopleX',    this.callBookScene.bind(this));
	    this.addWindow(this._commandWindow);
	};

	Scene_Menu.prototype.callBookScene = function() {
		SceneManager.push(SOUL_MV_Scene_PeopleBook);
	}

    Game_System.prototype.addToPeopleBook = function(type, dataId) {
        if (!this._peopleBookFlagging) {
            this.clearPeopleBook();
        }
        var typeIndex = this.itemBookTypeToIndex(type);
        if (typeIndex >= 0) {
            this._peopleBookFlagging[typeIndex][dataId] = true;
        }
    };

    Game_System.prototype.removeFromItemBook = function(type, dataId) {
        if (this._peopleBookFlagging) {
            var typeIndex = this.itemBookTypeToIndex(type);
            if (typeIndex >= 0) {
                this._peopleBookFlagging[typeIndex][dataId] = false;
            }
        }
    };

    Game_System.prototype.itemBookTypeToIndex = function(type) {
        switch (type) {
        case 1:
            return 0;
        default:
            return -1;
        }
    };

    Game_System.prototype.completeItemBook = function() {
        var i;
        this.clearPeopleBook();
        for (i = 1; i < $dataItems.length; i++) {
            this._peopleBookFlagging[0][i] = true;
        }
    };

    Game_System.prototype.clearPeopleBook = function() {
        this._peopleBookFlagging = [[], [], []];
    };

    Game_System.prototype.isInPeopleBook = function(item) {
        if (this._peopleBookFlagging && item) {
            var typeIndex = -1;
            if (DataManager.isItem(item)) {
                typeIndex = 0;
            }
            if (typeIndex >= 0) {
                return !!this._peopleBookFlagging[typeIndex][item.id];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    SOUL_MV.BookOfPeople_Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        SOUL_MV.BookOfPeople_Game_Party_gainItem.call(this, item, amount, includeEquip);
        if (item && amount > 0) {
            var type;
            if (DataManager.isItem(item)) {
                type = 'item';
            }
            $gameSystem.addToPeopleBook(type, item.id);
        }
    };

    function SOUL_MV_Scene_PeopleBook() {
        this.initialize.apply(this, arguments);
    }

    SOUL_MV_Scene_PeopleBook.prototype = Object.create(Scene_MenuBase.prototype);
    SOUL_MV_Scene_PeopleBook.prototype.constructor = SOUL_MV_Scene_PeopleBook;

    SOUL_MV_Scene_PeopleBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    SOUL_MV_Scene_PeopleBook.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new SOUL_MV_ItemBookIndex(0, 0);
        this._indexWindow.opacity = SOUL_MV.BookOfPeople.listOpacity;
        this._indexWindow.width = SOUL_MV.BookOfPeople.winWidth;
        this._indexWindow.height = SOUL_MV.BookOfPeople.winHeight;
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
        this._statusWindow = new SOUL_MV_PeopleBookStatus(this._indexWindow.width, 0, Graphics.width - this._indexWindow.width , Graphics.height);
        this._statusWindow.opacity = SOUL_MV.BookOfPeople.statusOpacity;
        this.addWindow(this._indexWindow);
        this.addChild(this._statusWindow);
        this._indexWindow.setStatusWindow(this._statusWindow);
    };

	ImageManager.loadBookSprite = function(filename, hue) {
	    return this.loadBitmap('img/bookofpeople/', filename, hue, true);
	};

    SOUL_MV_Scene_PeopleBook.prototype.createBackground = function() {
    	this._backSprite = new TilingSprite();
    	this._backSprite.move(0,0, Graphics.width, Graphics.height);
    	this._backSprite.bitmap = ImageManager.loadBookSprite(SOUL_MV.BookOfPeople.bookBG);
    	this.addChild(this._backSprite);
    }

    SOUL_MV_Scene_PeopleBook.prototype.update = function() {
    	Scene_MenuBase.prototype.update.call(this);
    	this._backSprite.origin.x += SOUL_MV.BookOfPeople.bgScrollX;
    	this._backSprite.origin.y += SOUL_MV.BookOfPeople.bgScrollY;
    }

    function SOUL_MV_ItemBookIndex() {
        this.initialize.apply(this, arguments);
    }

    SOUL_MV_ItemBookIndex.prototype = Object.create(Window_Selectable.prototype);
    SOUL_MV_ItemBookIndex.prototype.constructor = SOUL_MV_ItemBookIndex;

    SOUL_MV_ItemBookIndex.lastTopRow = 0;
    SOUL_MV_ItemBookIndex.lastIndex  = 0;

    SOUL_MV_ItemBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth;
        var height = this.fittingHeight(6);
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(SOUL_MV_ItemBookIndex.lastTopRow);
        this.select(SOUL_MV_ItemBookIndex.lastIndex);
        this.activate();
    };

    SOUL_MV_ItemBookIndex.prototype.maxCols = function() {
        return 1;
    };

    SOUL_MV_ItemBookIndex.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };

    SOUL_MV_ItemBookIndex.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };

    SOUL_MV_ItemBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };

    SOUL_MV_ItemBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var item = this._list[this.index()];
            this._statusWindow.setItem(item);
        }
    };

    SOUL_MV_ItemBookIndex.prototype.refresh = function() {
        var i, item;
        this._list = [];
        for (i = 1; i < $dataItems.length; i++) {
            item = $dataItems[i];
            if (item.name && item.itypeId === 1 && item.note.match(/<npc_item>/im)) {
                this._list.push(item);
            }
        }
        this.createContents();
        this.drawAllItems();
    };

    SOUL_MV_ItemBookIndex.prototype.drawItem = function(index) {
        var item = this._list[index];
        var rect = this.itemRect(index);
        var width = rect.width - this.textPadding();
        if ($gameSystem.isInPeopleBook(item)) {
            this.drawItemName(item, rect.x, rect.y, width);
        } else {
            var iw = Window_Base._iconWidth + 4;
            this.drawText(SOUL_MV.BookOfPeople.unknownData, rect.x + iw, rect.y, width - iw);
        }
    };

    SOUL_MV_ItemBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        SOUL_MV_ItemBookIndex.lastTopRow = this.topRow();
        SOUL_MV_ItemBookIndex.lastIndex = this.index();
    };

    function SOUL_MV_PeopleBookStatus() {
        this.initialize.apply(this, arguments);
    }

    SOUL_MV_PeopleBookStatus.prototype = Object.create(Window_Base.prototype);
    SOUL_MV_PeopleBookStatus.prototype.constructor = SOUL_MV_PeopleBookStatus;

    SOUL_MV_PeopleBookStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.drawNPCPortrait();
    };

    SOUL_MV_PeopleBookStatus.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };
    SOUL_MV_PeopleBookStatus.prototype.drawNPCPortrait = function() {
    	this.portrait = new Sprite();
    	this.portrait.x = SOUL_MV.BookOfPeople.portraitX;
    	this.portrait.y = SOUL_MV.BookOfPeople.portraitY;
    	this.addChildAt(this.portrait, 0);
    }
    SOUL_MV_PeopleBookStatus.prototype.refresh = function() {
        var item = this._item;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();

        this.contents.clear();

        if (!item || !$gameSystem.isInPeopleBook(item)) {
            return;
        }

        this.portrait.bitmap = ImageManager.loadBookSprite(item.name);

        this.drawText(SOUL_MV.BookOfPeople.personName + ": " + item.name, x, y, 500);

        y = lineHeight + this.textPadding();

        this.drawText(SOUL_MV.BookOfPeople.ageName + ": " + item.meta.npc_age, x, y + SOUL_MV.BookOfPeople.ageY, 500);
        
        this.drawText(SOUL_MV.BookOfPeople.jobName + ": " + item.meta.npc_job, x, y + SOUL_MV.BookOfPeople.jobY, 500);
        this.drawText(SOUL_MV.BookOfPeople.placeName + ": " + item.meta.npc_place, x, y + SOUL_MV.BookOfPeople.placeY, 500);
        this.drawText(SOUL_MV.BookOfPeople.statusName + ": " + item.meta.npc_status, x, y + SOUL_MV.BookOfPeople.statusY, 500);
        this.drawText(SOUL_MV.BookOfPeople.skillName + ": " + item.meta.npc_skills, x, y + SOUL_MV.BookOfPeople.skillY, 500);
        this.drawText(SOUL_MV.BookOfPeople.biographyName + ": ", x, y + SOUL_MV.BookOfPeople.bioY);
        this.drawTextEx(item.meta.npc_description, x, y + SOUL_MV.BookOfPeople.biodescY, SOUL_MV.BookOfPeople.mottoY);
        this.drawTextEx(SOUL_MV.BookOfPeople.mottoName+":", x, y + SOUL_MV.BookOfPeople.mottoY);
        this.drawTextEx(item.meta.npc_motto, x, y + SOUL_MV.BookOfPeople.mottodescY, 500);
        this.resetTextColor();
        y += lineHeight;

        x = 0;
        y = this.textPadding() * 2 + lineHeight * 7;
        

    };

})();
