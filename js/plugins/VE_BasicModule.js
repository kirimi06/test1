/*
 * ==============================================================================
 * ** Victor Engine MV - Basic Module
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.26 > First release.
 *  v 1.01 - 2015.11.29 > Added function to get database objects.
 *  v 1.02 - 2015.12.07 > Added function to get multiples elements.
 *                      > Added check for plugin correct order.
 *  v 1.03 - 2015.12.13 > Added function to get page comments.
 *  v 1.04 - 2015.12.21 > Added function to check only relevant objects.
 *  v 1.05 - 2015.12.25 > Added check to wait bitmap loading.
 *  v 1.06 - 2015.12.31 > Added rgb to hex and hex to rgb functions.
 *                      > Added function to get plugins parameters.     
 *  v 1.07 - 2016.01.07 > Fixed issue with plugin order checks.
 *  v 1.08 - 2016.01.17 > Added function to get BattleLog method index.
 *                      > Added function to insert methods on BattleLog.
 *  v 1.09 - 2016.01.24 > Added function to set wait for animations.
 *  v 1.10 - 2016.02.05 > Added function to get values from regex.
 *  v 1.11 - 2016.02.10 > Added function to capitalize texts.
 *                      > Added Plugin Parameter to set trait display names.
 *  v 1.12 - 2016.02.18 > Added function to get parameter names.
 *  v 1.13 - 2016.02.26 > Added functions to setup battler direction.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Basic Module'] = '1.13';

var VictorEngine = VictorEngine || {};
VictorEngine.BasicModule = VictorEngine.BasicModule || {};

(function() {
	
	VictorEngine.BasicModule.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.BasicModule.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Basic Module');
	};
	
	PluginManager.requiredPlugin = function(name, required, version) {
		VictorEngine.BasicModule.checkPlugins(name, required, version);
	};

})();

/*:
 * ------------------------------------------------------------------------------
 * @plugindesc v1.13 - Plugin with base code required for all Victor Engine plugins.
 * @author Victor Sant
 *
 * @param == Trait Names ==
 *
 * @param Hit Rate Name
 * @desc 'Hit Rate' Ex-Parameter name shown on windows.
 * @default Hit
 *
 * @param Evasion Rate Name
 * @desc 'Evasion Rate' Ex-Parameter name shown on windows.
 * @default Evasion 
 *
 * @param Critical Rate Name
 * @desc 'Critical Rate' Ex-Parameter name shown on windows.
 * @default Critical
 *
 * @param Critical Evasion Name
 * @desc 'Critical Evasion' Ex-Parameter name shown on windows.
 * @default C. Evasion
 *
 * @param Magic Evasion Name
 * @desc 'Magic Evasion' Ex-Parameter name shown on windows.
 * @default M. Evasion
 *
 * @param Magic Reflection Name
 * @desc 'Magic Reflection' Ex-Parameter name shown on windows.
 * @default M. Reflection
 *
 * @param Counter Attack Name
 * @desc 'Counter Attack' Ex-Parameter name shown on windows.
 * @default Counter
 *
 * @param HP Regeneration Name
 * @desc 'HP Regeneration' Ex-Parameter name shown on windows.
 * @default HP Regen
 *
 * @param MP Regeneration Name
 * @desc 'MP Regeneration' Ex-Parameter name shown on windows.
 * @default MP Regen
 *
 * @param TP Regeneration Name
 * @desc 'TP Regeneration' Ex-Parameter name shown on windows.
 * @default TP Regen
 *
 * @param Target Rate Name
 * @desc 'Target Rate' Sp-Parameter name shown on windows.
 * @default Target Rate
 *
 * @param Guard Rate Name
 * @desc 'Guard Rate' Sp-Parameter name shown on windows.
 * @default Guard Rate
 &
 * @param Recovery Effect Name
 * @desc 'Recovery Effect' Sp-Parameter name shown on windows.
 * @default Recovery
 *
 * @param Pharmacology Name
 * @desc 'Pharmacology' Sp-Parameter name shown on windows.
 * @default Pharmacology
 *
 * @param MP Cost Rate Name
 * @desc 'MP Cost Rate' Sp-Parameter name shown on windows.
 * @default MP Cost
 *
 * @param TP Charge Rate Name
 * @desc 'TP Charge Rate' Sp-Parameter name shown on windows.
 * @default TP Charge
 *
 * @param Physical Damage Name
 * @desc 'Physical Damage' Sp-Parameter name shown on windows.
 * @default Physical Damage
 *
 * @param Magical Damage Name
 * @desc 'Magical Damage' Sp-Parameter name shown on windows.
 * @default Magical Damage
 *
 * @param Floor Damage Name
 * @desc 'Floor Damage' Sp-Parameter name shown on windows.
 * @default Floor Damage
 *
 * @param Experience Rate Name
 * @desc 'Experience Rate' Sp-Parameter name shown on windows.
 * @default Exp. Rate
 *
 * ------------------------------------------------------------------------------
 * @help 
 * ------------------------------------------------------------------------------
 * Install this plugin above any other Victor Engine plugin.
 * ------------------------------------------------------------------------------
 */
 
(function() {
			
	//=============================================================================
	// Parameters
	//=============================================================================
	
	VictorEngine.getPluginParameters = function() {
		var script = document.currentScript || (function() {
			var scripts = document.getElementsByTagName('script');
			return scripts[scripts.length - 1];
		})();
		var start = script.src.lastIndexOf('/') + 1;
		var end   = script.src.indexOf('.js');
		return PluginManager.parameters(script.src.substring(start, end));
	}

	var parameters = VictorEngine.getPluginParameters();
	VictorEngine.Parameters = VictorEngine.Parameters || {};
	VictorEngine.Parameters.hit = String(parameters["Hit Rate Name"]).trim();
	VictorEngine.Parameters.eva = String(parameters["Evasion Rate Name"]).trim();
	VictorEngine.Parameters.cri = String(parameters["Critical Rate Name"]).trim();
	VictorEngine.Parameters.cev = String(parameters["Critical Evasion Name"]).trim();
	VictorEngine.Parameters.hev = String(parameters["Magic Evasion Name"]).trim();
	VictorEngine.Parameters.mrf = String(parameters["Magic Reflection Name"]).trim();
	VictorEngine.Parameters.cnt = String(parameters["Counter Attack Name"]).trim();
	VictorEngine.Parameters.hrg = String(parameters["HP Regeneration Name"]).trim();
	VictorEngine.Parameters.mrg = String(parameters["MP Regeneration Name"]).trim();
	VictorEngine.Parameters.trg = String(parameters["TP Regeneration Name"]).trim();
	VictorEngine.Parameters.tgr = String(parameters["Target Rate Name"]).trim();
	VictorEngine.Parameters.grd = String(parameters["Guard Rate Name"]).trim();
	VictorEngine.Parameters.rec = String(parameters["Recovery Effect Name"]).trim();
	VictorEngine.Parameters.pha = String(parameters["Pharmacology Name"]).trim();
	VictorEngine.Parameters.mcr = String(parameters["MP Cost Rate Name"]).trim();
	VictorEngine.Parameters.tcr = String(parameters["TP Charge Rate Name"]).trim();
	VictorEngine.Parameters.pdr = String(parameters["Physical Damage Name"]).trim();
	VictorEngine.Parameters.mdr = String(parameters["Magical Damage Name"]).trim();
	VictorEngine.Parameters.fdr = String(parameters["Floor Damage"]).trim();
	VictorEngine.Parameters.ext = String(parameters["Experience"]).trim();
	
	//=============================================================================
	// DataManager
	//=============================================================================

	VictorEngine.BasicModule.isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		if (!VictorEngine.BasicModule.isDatabaseLoaded.call(this)) return false;
		VictorEngine.loadParameters();
		VictorEngine.loadNotetags();
		return ImageManager.isReady();
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================
	
	VictorEngine.BasicModule.checkPlugins = function(name, req, ver) {
		var msg = '';
		this.loadedPlugins = this.loadedPlugins || {};
		if (ver && req && (!Imported[req] || Number(Imported[req]) < Number(ver))) {
			msg += 'The plugin ' + name + ' requires the plugin ' + req;
			msg += ' v' + ver + ' or higher installed to work properly'
			if (Number(Imported[req]) < Number(ver)) {
				msg += '. Your current version is v' + Imported[req];
			}
			msg += '. Go to http://victorenginescripts.wordpress.com/'
			msg += 'to download the updated plugin.';
			throw msg;
		} else if (!ver && req && this.loadedPlugins[req] === true) {
			msg += 'The plugin ' + name + ' requires the plugin ' + req;
			msg += ' to be placed bellow it. Open the Plugin Manager and place';
			msg += ' the plugins in the correct order.';
			throw msg;
		} else if (req && Imported['VE - Basic Module'] && !this.loadedPlugins['VE - Basic Module']) {
			msg += 'The plugin ' + name + ' must be placed bellow the plugin ' + req;
			msg += '. Open the Plugin Manager and place';
			msg += ' the plugins in the correct order.';
			throw msg;
		} else {
			this.loadedPlugins[name] = true
		}
	};

	VictorEngine.loadNotetags = function() {
		if (VictorEngine.BasicModule.loaded) return;
		VictorEngine.BasicModule.loaded = true;
		var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons, 
					$dataArmors, $dataEnemies, $dataStates];
		list.forEach(function(objects, index) { this.processNotetags(objects, index) }, this);
	};
	
	VictorEngine.processNotetags = function(objects, index) {
		objects.forEach(function(data) {
			if (data) this.loadNotetagsValues(data, index);
		}, this);
	};
	
	VictorEngine.objectSelection = function(index, list) {
		var objects = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
		return list.contains(objects[index]);
	};
	
	VictorEngine.loadNotetagsValues = function(data, index) {
	};
	
	VictorEngine.loadParameters = function() {
	};
	
	VictorEngine.getNotesValues = function(value1, value2) {
		if (!value2) value2 = value1;
		return new RegExp('<' + value1 + '>([\\s\\S]*?)<\\/' + value2 + '>', 'gi');
	};

	VictorEngine.getPageNotes = function(event) {
		var result = (event instanceof Game_CommonEvent) || event.page();
		if (!result || !event.list()) return "";
		return event.list().reduce(function(r, cmd) {
			var valid   = (cmd.code === 108 || cmd.code === 408);
			var comment = valid ? cmd.parameters[0] + "\r\n" : "";
			return r + comment;
		}, "");
	};
	
	VictorEngine.getAllElements = function(subject, item) {
		if (item.damage.elementId < 0) {
			return subject.attackElements();
		} else {
			return [item.damage.elementId];
		}
	};
	
	VictorEngine.getAllStates = function(subject, item) {
		var result;
		return item.effects.reduce(function(r, effect) {
			if (effect.code === 21) {
				if (effect.dataId === 0) {
					result = subject.attackStates();
				} else {
					result = [effect.dataId];
				};
			} else {
				result = [];
			};
            return r.concat(result);
        }, []);
	};
	
	VictorEngine.getNumberValue = function(match, type, base) {
		var regex = new RegExp(type + '[ ]*:[ ]*([+-.\\d]+)', 'gi');
		var value = regex.exec(match);
		return value ? Number(value[1]) : base;
	};

	VictorEngine.getStringValue = function(match, type, base) {
		var regex = new RegExp(type + "[ ]*:[ ]*([\\w ]+)", 'gi');
		var value = regex.exec(match);
		return value ? value[1].trim() : base;
	};
		
	VictorEngine.getAnyValue = function(match, type, base) {
		var regex = new RegExp(type + "[ ]*:[ ]*('[^\']+'|\"[^\"]+\")", 'gi');
		var value = regex.exec(match);
		return value ? value[1].slice(1, -1) : base;
	};
	
	VictorEngine.getNumberValues = function(match, type) {
		var regex  = new RegExp(type + ':[ ]*((?:[+-.\\d]+[ ]*,?[ ]*)+)', 'gi');
		var value  = regex.exec(match)
		var result = value ? value[1].match(/\d+/gi) : []
		return result.map(function(id) { return Number(id) });
	};
		
	VictorEngine.getStringValues = function(match, type) {
		var regex  = new RegExp(type + ':[ ]*((?:[\\w ]+[ ]*,?[ ]*)+)', 'gi');
		var value  = regex.exec(match)
		var result = value ? value[1].match(/\d+/gi) : []
		return result.map(function(id) { return value[1].trim() });
	};
	
	VictorEngine.captalizeText = function(text) {
		return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	};
	
	VictorEngine.rgbToHex = function(r, g, b) {
		r = Math.floor(r).toString(16).padZero(2);
		g = Math.floor(g).toString(16).padZero(2);
		b = Math.floor(b).toString(16).padZero(2);
		return '#' + r + g + b;
	}
	
	VictorEngine.hexToRgb = function(hex) {
		var r = parseInt(hex[1] + hex[2], 16)
		var g = parseInt(hex[3] + hex[4], 16)
		var b = parseInt(hex[5] + hex[6], 16)
		return [r, g, b];
	}
		
	VictorEngine.methodIndex = function(methods, name) {
		for (var i = 0; i < methods.length; i++) {
			if (methods[i] && methods[i].name === name) return i;
		}
		return null;
	}
	
	VictorEngine.insertMethod = function(methods, index, name, params) {
		if (index !== null) methods.splice(index, 0, { name: name, params: params });
	}
	
	VictorEngine.waitAnimation = function(animationId) {
		var animation = $dataAnimations[animationId];
		return (animation) ? animation.frames.length * 4 + 1 : 0;
	};
	
	VictorEngine.params = function() {
		return ['hp', 'mp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
	};
	
	VictorEngine.xparams = function() {
		return ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
	};
	
	VictorEngine.sparams = function() {
		return ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'prd', 'mrd', 'frd', 'exr'];
	};
	
	VictorEngine.allParams = function() {
		return this.params().concat(this.xparams(), this.sparams())
	};
	
	VictorEngine.xparams = function() {
		return ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
	};
	
	VictorEngine.sparams = function() {
		return ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'prd', 'mrd', 'frd', 'exr'];
	};
	
	VictorEngine.paramName = function(paramId) {
		return this.params()[paramId];
	};
	
	VictorEngine.xparamName = function(xparamId) {
		return this.params()[xparamId];
	};
	
	VictorEngine.sparamName = function(sparamId) {
		return this.params()[sparamId];
	};
	
	VictorEngine.paramText = function(name) {
		switch (name.toLowerCase()) {
		case 'hit': case 'eva': case 'cri': case 'cev': case 'mev':
		case 'mrf':	case 'cnt': case 'hrg': case 'mrg': case 'trg':
		case 'tgr': case 'grd':	case 'rec': case 'pha': case 'mcr':
		case 'tcr': case 'pdr': case 'mdr':	case 'fdr': case 'ext':
			return this.Parameters[name.toLowerCase()];
		case 'hp': case 'atk': case 'def': case 'agi': 
		case 'mp': case 'mat': case 'mdf': case 'luk': 
			var paramId = this.params().indexOf(name.toLowerCase());
			return TextManager.param(paramId)
		default:
			return this.captalizeText(name.toLowerCase());
		}
	};
	
	//=============================================================================
	// Game_Party
	//=============================================================================
	
	Game_Party.prototype.averageX = function() {
		return this.aliveMembers().reduce(function(r, member) {
			return r + member.screenX();
		}, 0) / this.aliveMembers().length;
	};
	
	//=============================================================================
	// Game_BattlerBase
	//=============================================================================
	
	Game_BattlerBase.prototype.isFacingDown = function() {
		return this._battlerDirection === 'down';
	};
	
	Game_BattlerBase.prototype.isFacingLeft = function() {
		return this._battlerDirection === 'left';
	};
	
	Game_BattlerBase.prototype.isFacingRight = function() {
		return this._battlerDirection === 'right';
	};
	
	Game_BattlerBase.prototype.isFacingUp = function() {
		return this._battlerDirection === 'up';
	};
	
	Game_BattlerBase.prototype.faceDown = function() {
		this._battlerDirection = 'down';
	};
	
	Game_BattlerBase.prototype.faceLeft = function() {
		this._battlerDirection = 'left';
	};
	
	Game_BattlerBase.prototype.faceRight = function() {
		this._battlerDirection = 'right';
	};
	
	Game_BattlerBase.prototype.faceUp = function() {
		this._battlerDirection = 'up';
	};
	
	Game_BattlerBase.prototype.lookForward = function() {
		if (this.screenX() > Graphics.width / 2) {
			this.faceLeft();
		} else {
			this.faceRight();
		}
	};
	
	Game_BattlerBase.prototype.lookBehind = function() {
		if (this.screenX() < Graphics.width / 2) {
			this.faceLeft();
		} else {
			this.faceRight();
		}
	};
	
	Game_BattlerBase.prototype.facePosition = function(position) {
		if (this.screenX() < position) this.faceRight();
		if (this.screenX() > position) this.faceLeft();
	};
	
	Game_BattlerBase.prototype.isBehind = function(target) {
		return (target.isFacingRight() && this.screenX() < target.screenX()) ||
			   (target.isFacingLeft()  && this.screenX() > target.screenX());
	};
	
	Game_BattlerBase.prototype.faceOpponents = function() {
		var opponents = this.isEnemy() ? $gameParty : $gameTroop;
		if (opponents.averageX() < this.screenX()) this.faceLeft();
		if (opponents.averageX() > this.screenX()) this.faceRight();
	};
	
	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	Game_Actor.prototype.screenX = function() {
		return this._screenX || 0;
	};
	
	Game_Actor.prototype.screenY = function() {
		return this._screenY || 0;
	};
	
	Game_Actor.prototype.battleSprite = function() {
		sprites = SceneManager._scene._spriteset._actorSprites;
		return sprites.filter(function(sprite) {
			return sprite && sprite._actor === this;
		}, this)[0];
	};
	
	//=============================================================================
	// Game_Enemy
	//=============================================================================
	
	Game_Enemy.prototype.battleSprite = function() {
		sprites = SceneManager._scene._spriteset._enemySprites;
		return sprites.filter(function(sprite) {
			return sprite && sprite._enemy === this;
		}, this)[0];
	};
	
	//=============================================================================
	// Sprite_Battler
	//=============================================================================
	
	Sprite_Battler.prototype.isEnemy = function() {
		return this._battler && this._battler.isEnemy();
	};
	
	Sprite_Battler.prototype.battlerPositionX = function(index) {
		return this.isEnemy() ? this._battler.screenX() : 600 + index * 32;
	};
	
	Sprite_Battler.prototype.battlerPositionY = function(index) {
		return this.isEnemy() ? this._battler.screenY() : 280 + index * 48;
	};
	
	Sprite_Battler.prototype.isDisabledMotion = function() {
		var motion = Sprite_Actor.MOTIONS;
		return this._motion === motion['dead'] || this._motion === motion['sleep'];
	};
	
	//=============================================================================
	// Sprite_Actor
	//=============================================================================
	
	Sprite_Actor.prototype.updateBattlerDirection = function() {
		if (this._battler && !this.isDisabledMotion()) {
			if ((this._battler.isFacingLeft()  && this.scale.x < 0) ||
				(this._battler.isFacingRight() && this.scale.x > 0)) {
				this.scale.x *= -1;
			}
		}
	};
	
	Sprite_Actor.prototype.updateScreenPosition = function() {
		if (this._battler) {
			this._battler._screenX = this.x;
			this._battler._screenY = this.y;
		}
	};
	
	//=============================================================================
	// Sprite_Enemy
	//=============================================================================
		
	Sprite_Enemy.prototype.updateBattlerDirection = function() {
		if (this._battler && !this.isDisabledMotion()) {
			if ((this._battler.isFacingLeft()  && this.scale.x > 0) ||
				(this._battler.isFacingRight() && this.scale.x < 0)) {
				this.scale.x *= -1;
			}
		}
	};
	
	//=============================================================================
	// Window_BattleLog
	//=============================================================================
	
	Window_BattleLog.prototype.waitForBattleAnimation = function(animationId, speed) {
		var speed = Math.max(speed, 1) || 1;
		this.waitForTime(VictorEngine.waitAnimation(animationId) / speed);
	};
	
	Window_BattleLog.prototype.waitForTime = function(time) {
		this._waitCount = time;
	};
	
})();