(function(){
    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createActorPortrait();
    };
    
    Scene_Menu.prototype.createActorPortrait = function() {
        this._actorPortrait new Sprite();
        this._actorPortrait.bitmap = ImageManager.loadpicture($gameParty.members()[0]._name);
        this.addChild(this.)
    }
        
    Scene_Menu.prototype.start = function(){
    Scene_MenuBase.prototype.start.call(this);
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
