(function(){
    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    };
    
        Scene_Menu.prototype.createCommandImages = function() {
        this._itemButton = new Sprite();
        this._skillButton = new Sprite();
        this._equipButton = new Sprite();
        this._statusButton = new Sprite();
        this._formationButton = new Sprite();
        this._optionsButton = new Sprite();
        this._saveButton = new Sprite();
        this._gameEndButton = new Sprite();
        
        this.addChild(this._itemButton);
        this.addChild(this._skillButton);
        this.addChild(this._equipButton);
        this.addChild(this._statusButton);
        this.addChild(this._formationButton);
        this.addChild(this._optionsButton);
        this.addChild(this._saveButton);
        this.addChild(this._gameEndButton);
    }
    
    Scene_Menu.prototype.update = function() {
        switch(this._commandWindow._index) {
                case 0:
                    this._itemButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._skillButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._equipButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._statusButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._formationButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._optionsButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._saveitemButton.bitmap = ImageManager.loadPicture(ic_1);
                    this._gameEnditemButton.bitmap = ImageManager.loadPicture(ic_1);
        }
    }

        Scene_Menu.prototype.start = function(){
    Scene_MenuBase.prototype.start.call(this);
};
    Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.visible = false;
    this._commandWindow.x = Graphics.boxWidth;
    this._commandWindow.y = Graphics.boxHeight;
        
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
    };
    Window_MenuCommand.prototype.addMainCommands = function() {
        var enabled = this.areMainCommandsEnabled();
        if (this.needsCommand('item')) {
            this.addCommand(TextManager.item, 'item', enabled);
}
        if (this.needsCommand('skill')) {
            this.addCommand(TextManager.skill, 'skill', enabled);  }
        if (this.needsCommand('equip')) {
            this.addCommand(TextManager.equip, 'equip', enabled);
        }
        if (this.needsCommand('status')) {
            this.addCommand(textManager.status, 'status', enabled);
        }
    };  
    Window_MenuCommand.prototype?makeCommandList = function() {
        this.addMainCommand();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
})();