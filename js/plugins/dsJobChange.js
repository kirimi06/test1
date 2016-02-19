//=============================================================================
// dsJobChange.js
// Copyright (c) 2016 Douraku
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc ジョブチェンジシステム ver1.00
 * @author 道楽
 *
 * @param Command Name
 * @desc ジョブチェンジコマンドの名称
 * @default ジョブチェンジ
 *
 * @param Effect Animation Id
 * @desc 演出用アニメーション番号
 * @default 52
 *
 * @param Optimize Equip Enable
 * @desc ジョブチェンジ後に最強装備にするか
 * @default true
 *
 * @param Optimize Equip Text
 * @desc ジョブチェンジ後の最強装備にした際に表示されるメッセージ
 * @default 最強装備します
 *
 * @help
 * このプラグインは以下のメモタグの設定ができます。
 *
 * ----------------------------------------------------------------------------
 * アクターに設定するメモタグ
 *
 * <ignoreChangeImage>
 *   ジョブを変更しても見た目が変更されないようになります。
 *
 * ----------------------------------------------------------------------------
 * 職業に設定するメモタグ
 *
 * <faceName:Actor1,7>
 *   顔画像のファイル名と番号を設定します。
 *   番号: 0 1 2 3
 *         4 5 6 7
 *
 * <characterName:Actor1,7>
 *   歩行キャラのファイル名と番号を設定します。
 *   番号は顔画像と同じです
 *
 * <battlerName:Actor1_8>
 *   戦闘キャラのファイル名を設定します。
 *   このタグは必ず必要になります。
 *
 * <jobInfo:近接攻撃に特化したクラス
 *  あらゆる武器を使いこなし眼前の敵を葬り去る>
 *   画面上部のヘルプウィンドウに表示される説明文を設定します。
 */

(function() {

	var parameters = PluginManager.parameters('dsJobChange');
	var gCommandName = String(parameters['Command Name']);
	var gEffectAnimationId = Number(parameters['Effect Animation Id']);
	var gOptimizeEquipEnable = Boolean(parameters['Optimize Equip Enable'] === 'true' || false);
	var gOptimizeEquipText = String(parameters['Optimize Equip Text']);

	//-------------------------------------------------------------------------
	/** Utility */
	var Utility = {};

	Utility.normRad = function(rad)
	{
		var PI2 = Math.PI * 2;
		var div = Math.floor(rad / PI2);
		rad -= div * PI2;
		if ( rad < 0.0 )
		{
			rad += PI2;
		}
		if ( rad > Math.PI )
		{
			rad -= PI2;
		}
		return rad;
	};

	//-------------------------------------------------------------------------
	/** Game_Actor */
	Game_Actor.prototype.currentClassExp = function(classId)
	{
		return this._exp[classId];
	};

	Game_Actor.prototype.calcClassLevel = function(classId)
	{
		var exp = this.currentClassExp(classId);
		var level = 1;
		while ( level < this.maxLevel() && this.currentClassExp(classId) >= this.expForLevel(level + 1) )
		{
			level++;
		}
		return level;
	};

	Game_Actor.prototype.changeClassEx = function(classId, keepExp)
	{
		if ( !this.isIgnoreChangeImage() )
		{
			var data = $dataClasses[classId];
			if ( data.meta.characterName )
			{
				var metaData = data.meta.characterName.split(',');
				var characterName = String(metaData[0]);
				var characterIndex = Number(metaData[1]);
				this.setCharacterImage(characterName, characterIndex);
				$gamePlayer.refresh();
			}
			if ( data.meta.faceName )
			{
				var metaData = data.meta.faceName.split(',');
				var faceName = String(metaData[0]);
				var faceIndex = Number(metaData[1]);
				this.setFaceImage(faceName, faceIndex);
			}
			if ( data.meta.battlerName )
			{
				this.setBattlerImage(data.meta.battlerName);
			}
		}
		this.changeClass(classId, keepExp);
	};

	Game_Actor.prototype.isIgnoreChangeImage = function(classId)
	{
		var actor = $dataActors[this._actorId];
		if ( actor.meta.ignoreChangeImage )
		{
			return true;
		}
		return false;
	};

	Game_Actor.prototype.isClassChangeEnable = function(classId)
	{
		if ( this.isClass($dataClasses[classId]) )
		{
			return false;
		}
		return true;
	};

	//-------------------------------------------------------------------------
	/** Sprite_ActorJob */
	function Sprite_ActorJob()
	{
		this.initialize.apply(this, arguments);
	}

	Sprite_ActorJob.prototype = Object.create(Sprite_Actor.prototype);
	Sprite_ActorJob.prototype.constructor = Sprite_ActorJob;

	Sprite_ActorJob.prototype.setBattler = function(battler)
	{
		Sprite_Battler.prototype.setBattler.call(this, battler);
		var changed = (battler !== this._actor);
		if ( changed )
		{
			this._actor = battler;
			this._stateSprite.setup(battler);
			this.startIdleMotion();
		}
	};

	Sprite_ActorJob.prototype.startMove = function(x, y, duration)
	{
	};

	Sprite_ActorJob.prototype.moveToStartPosition = function()
	{
	};

	Sprite_ActorJob.prototype.startIdleMotion = function()
	{
		this.startMotion('walk');
	};

	//-------------------------------------------------------------------------
	/** Sprite_Job */
	function Sprite_Job()
	{
		this.initialize.apply(this, arguments);
	}

	Sprite_Job.prototype = Object.create(Sprite_Base.prototype);
	Sprite_Job.prototype.constructor = Sprite_Job;

	Sprite_Job.prototype.initialize = function(classId)
	{
		Sprite_Base.prototype.initialize.call(this);
		this.initMembers();
		this.setJob(classId);
	};

	Sprite_Job.prototype.initMembers = function()
	{
		this.anchor.x = 0.5;
		this.anchor.y = 1;
		this._classId = 0;
		this._battlerName = '';
		this._motion = { index: 0, loop: true };
		this._motionCount = 0;
		this._pattern = 0;
		this._rootX = 0;
		this._rootY = 0;
		this._offsetX = 0;
		this._offsetY = 0;
		this._selection = false;
		this._selectionEffectCount = 0;
		this._changeEnable = true;
		this._scissorRect = null;
	};

	Sprite_Job.prototype.setJob = function(classId)
	{
		this._classId = classId;
	};

	Sprite_Job.prototype.setRoot = function(x, y)
	{
		this._rootX = x;
		this._rootY = y;
	};

	Sprite_Job.prototype.setOffset = function(x, y)
	{
		this._offsetX = x;
		this._offsetY = y;
	};

	Sprite_Job.prototype.setSelection = function(selection)
	{
		this._selection = selection;
	};

	Sprite_Job.prototype.setChangeEnable = function(enable)
	{
		this._changeEnable = enable;
	};

	Sprite_Job.prototype.setScissoring = function(x, y, width, height)
	{
		this._scissorRect = new Rectangle();
		this._scissorRect.x = x;
		this._scissorRect.y = y;
		this._scissorRect.width = width;
		this._scissorRect.height = height;
	};

	Sprite_Job.prototype.update = function()
	{
		Sprite_Base.prototype.update.call(this);
		if ( this._classId !== 0 )
		{
			this.updatePosition();
			this.updateBitmap();
			this.updateFrame();
			this.updateMotion();
			this.updateSelectionEffect();
		}
		else
		{
			this.bitmap = null;
		}
	};

	Sprite_Job.prototype.updatePosition = function()
	{
		this.x = this._rootX + this._offsetX;
		this.y = this._rootY + this._offsetY;
	};

	Sprite_Job.prototype.updateBitmap = function()
	{
		if ( this._classId !== 0 )
		{
			if ( $dataClasses[this._classId].meta.battlerName )
			{
				var name = $dataClasses[this._classId].meta.battlerName;
				if ( this._battlerName !== name )
				{
					this._battlerName = name;
					this.bitmap = ImageManager.loadSvActor(name);
				}
			}
		}
	};

	Sprite_Job.prototype.updateFrame = function()
	{
		var bitmap = this.bitmap;
		if ( bitmap )
		{
			var motionIndex = this._motion ? this._motion.index : 0;
			var pattern = this._pattern < 3 ? this._pattern : 1;
			var cw = bitmap.width / 9;
			var ch = bitmap.height / 6;
			var cx = Math.floor(motionIndex / 6) * 3 + pattern;
			var cy = motionIndex % 6;
			var rect = this.applyScissoring(cx * cw, cy * ch, cw, ch);
			this.setFrame(rect.x, rect.y, rect.width, rect.height);
		}
	};

	Sprite_Job.prototype.updateMotion = function()
	{
		if ( this._motion && ++this._motionCount >= this.motionSpeed() )
		{
			if ( this._motion.loop )
			{
				this._pattern = (this._pattern + 1) % 4;
			}
			else if ( this._pattern < 2 )
			{
				this._pattern++;
			}
			this._motionCount = 0;
		}
	};

	Sprite_Job.prototype.updateSelectionEffect = function()
	{
		if ( this._selection )
		{
			this._selectionEffectCount++;
			if ( this._selectionEffectCount % 30 < 15 )
			{
				var color = this._changeEnable ? [255, 255, 255, 64] : [96, 96, 96, 160];
				this.setBlendColor(color);
			}
			else
			{
				var color = this._changeEnable ? [0, 0, 0, 0] : [64, 64, 64, 160];
				this.setBlendColor(color);
			}
		}
		else
		{
			this._selectionEffectCount = 0;
			var color = this._changeEnable ? [0, 0, 0, 0] : [64, 64, 64, 160];
			this.setBlendColor(color);
		}
	};

	Sprite_Job.prototype.applyScissoring = function(x, y, w, h)
	{
		var rect = new Rectangle;
		rect.x = x;
		rect.y = y;
		rect.width = w;
		rect.height = h;
		if ( this._scissorRect )
		{
			var x1 = this.x - rect.width * this.anchor.x - this._rootX;
			var x2 = this.x + rect.width * (1.0 - this.anchor.x) - this._rootX;
			var y1 = this.y - rect.height * this.anchor.y - this._rootY;
			var y2 = this.y + rect.height * (1.0 - this.anchor.y) - this._rootY;
			var sx1 = this._scissorRect.x;
			var sx2 = this._scissorRect.x + this._scissorRect.width;
			var sy1 = this._scissorRect.y;
			var sy2 = this._scissorRect.y + this._scissorRect.height;
			if ( x2 < sx1 || sx2 < x1 )
			{
				rect.width = 0.0;
			}
			else if ( y2 < sy1 || y1 > sy2 )
			{
				rect.height = 0.0;
			}
			else
			{
				if ( x1 < sx1 )
				{
					var xx = Math.max(Math.min(Math.floor(sx1 - x1), w), 0);
					rect.x += xx;
					rect.width -= xx;
					this.x += xx * (1.0 - this.anchor.x);
				}
				else if ( x2 > sx2 )
				{
					var xx = Math.max(Math.min(Math.floor(x2 - sx2), w), 0);
					rect.width -= xx;
					this.x -= xx * this.anchor.x;
				}
				if ( y1 < sy1 )
				{
					var yy = Math.max(Math.min(Math.floor(sy1 - y1), h), 0);
					rect.y += yy;
					rect.height -= yy;
					this.y += yy * (1.0 - this.anchor.y);
				}
				else if ( y2 > sy2 )
				{
					var yy = Math.max(Math.min(Math.floor(y2 - sy2), h), 0);
					rect.height -= yy;
					this.y -= yy * this.anchor.y;
				}
			}
		}
		return rect;
	};

	Sprite_Job.prototype.motionSpeed = function()
	{
		return 12;
	};

	Sprite_Job.prototype.startIdleMotion = function()
	{
		this.startMotion(gActorMotionIdle);
	};

	//-------------------------------------------------------------------------
	/** Window_JobStatus */
	function Window_JobStatus()
	{
		this.initialize.apply(this, arguments);
	}

	Window_JobStatus.prototype = Object.create(Window_Base.prototype);
	Window_JobStatus.prototype.constructor = Window_JobStatus;

	Window_JobStatus.prototype.initialize = function(x, y)
	{
		var width = this.windowWidth();
		var height = this.windowHeight();
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this._actor = null;
	};

	Window_JobStatus.prototype.windowWidth = function()
	{
		return Graphics.boxWidth;
	};

	Window_JobStatus.prototype.windowHeight = function()
	{
		return this.fittingHeight(3);
	};

	Window_JobStatus.prototype.setActor = function(actor)
	{
		if ( this._actor !== actor )
		{
			this._actor = actor;
			this.refresh();
		}
	};

	Window_JobStatus.prototype.refresh = function()
	{
		this.contents.clear();
		if ( this._actor )
		{
			var w = this.width - this.padding * 2;
			var h = this.height - this.padding * 2;
			var y = h / 2 - this.lineHeight() * 1.5;
			var width = w - 162 - this.textPadding();
			this.drawActorFace(this._actor, 120, 0, 144, h);
			this.drawActorSimpleStatus(this._actor, 120+162, y, width);
		}
	};

	//-------------------------------------------------------------------------
	/** Window_JobChange */
	function Window_JobChange()
	{
		this.initialize.apply(this, arguments);
	}

	Window_JobChange.prototype = Object.create(Window_Selectable.prototype);
	Window_JobChange.prototype.constructor = Window_JobChange;

	Window_JobChange.prototype.initialize = function(x, y, width, height)
	{
		this.initMember();
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this.createActorSprite();
		this.createJobSprite();
	};

	Window_JobChange.prototype.setActor = function(actor)
	{
		if ( this._actor !== actor )
		{
			this._actor = actor;
			this._actorSprite.setBattler(this._actor);
			this.selectActorClass(actor);
			this.refresh();
		}
	};

	Window_JobChange.prototype.startClassChange = function()
	{
		if ( gEffectAnimationId !== 0 )
		{
			var animation = $dataAnimations[gEffectAnimationId];
			this._actorSprite.startAnimation(animation, false, 0);
		}
	};

	Window_JobChange.prototype.initMember = function()
	{
		this._actor = null;
		this._actorSprite = null;
		this._jobSprite = [];
		this._rotation = this.currentRotation();
		this._introRotation = 0.0;
		this._introDistance = 0.0;
		this._classIdTable = [];
		var classesNum = $dataClasses.length;
		for ( var ii = 1; ii < classesNum; ii++ )
		{
			this._classIdTable.push(ii);
		}
	};

	Window_JobChange.prototype.createActorSprite = function()
	{
		var rootX = this.rootX();
		var rootY = this.rootY();
		this._actorSprite = new Sprite_ActorJob;
		this._actorSprite.setHome(rootX, rootY);
		this.addChild(this._actorSprite);
	};

	Window_JobChange.prototype.createJobSprite = function()
	{
		var mergin = 5;
		var rootX = this.rootX();
		var rootY = this.rootY();
		var scissorX = 0.0 - rootX + mergin;
		var scissorY = 0.0 - rootY + mergin;
		var scissorW = this.width - mergin * 2;
		var scissorH = this.height - mergin * 2;
		var num = this._classIdTable.length;
		for ( var ii = 0; ii < num; ii++ )
		{
			var classId = this._classIdTable[ii];
			var sprite = new Sprite_Job(classId);
			sprite.setRoot(rootX, rootY);
			sprite.setScissoring(scissorX, scissorY, scissorW, scissorH);
			this._jobSprite[classId] = sprite;
			this.addChild(this._jobSprite[classId]);
		}
		this.updateJobPosition();
	};

	Window_JobChange.prototype.maxCols = function()
	{
		return this._jobSprite.length - 1;
	};

	Window_JobChange.prototype.maxItems = function()
	{
		return this._jobSprite.length - 1;
	};

	Window_JobChange.prototype.maxPageRows = function()
	{
		return 1;
	};

	Window_JobChange._introRotationMax = Math.PI * 0.8;
	Window_JobChange._introDistanceMax = 250.0;

	Window_JobChange.prototype.rootX = function()
	{
		return this.width * 0.5;
	};

	Window_JobChange.prototype.rootY = function()
	{
		return 128;
	};

	Window_JobChange.prototype.radiusX = function()
	{
		return 208 + this._introDistance;
	};

	Window_JobChange.prototype.radiusY = function()
	{
		return 112 + this._introDistance;
	};

	Window_JobChange.prototype.currentRotation = function()
	{
		var rot = Math.PI / 4 - this._introRotation;
		if ( this.index() >= 0 )
		{
			var unitRot = (Math.PI * 2) / this._classIdTable.length;
			rot += unitRot * this.index();
		}
		return Utility.normRad(rot);
	};

	Window_JobChange.prototype.isCurrentItemEnabled = function()
	{
		if ( this._actor )
		{
			if ( this.index() >= 0 )
			{
				var classId = this._classIdTable[this.index()];
				return this._actor.isClassChangeEnable(classId);
			}
		}
		return false;
	};

	Window_JobChange.prototype.isClassChangeEnd = function()
	{
		if ( this._actorSprite.isAnimationPlaying() )
		{
			return false;
		}
		return true;
	};

	Window_JobChange.prototype.update = function()
	{
		Window_Selectable.prototype.update.call(this);
		this.updateIntro();
		this.updateJobRotation();
		this.updateJobPosition();
		this.updateJobSelection();
	};

	Window_JobChange.prototype.updateIntro = function()
	{
		var rot = Window_JobChange._introRotationMax / 15.0;
		var dist = Window_JobChange._introDistanceMax / 15.0;
		this._introRotation = Math.max( this._introRotation - rot, 0.0 );
		this._introDistance = Math.max( this._introDistance - dist, 0.0 );
	};

	Window_JobChange.prototype.updateJobRotation = function()
	{
		var rotSpeed = (Math.PI / 180.0) * 10;
		var currentRotation = this.currentRotation();
		var diff = Utility.normRad(currentRotation - this._rotation);
		if ( diff < 0.0 )
		{
			this._rotation += Math.max(-rotSpeed, diff);
		}
		else if ( diff > 0.0 )
		{
			this._rotation += Math.min(rotSpeed, diff);
		}
		this._rotation = Utility.normRad(this._rotation);
	};

	Window_JobChange.prototype.updateJobPosition = function()
	{
		var radiusX = this.radiusX();
		var radiusY = this.radiusY();
		var rotation = this._rotation;
		var num = this._classIdTable.length;
		for ( var ii = 0; ii < num; ii++ )
		{
			var classId = this._classIdTable[ii];
			var sprite = this._jobSprite[classId];
			var offsetX = Math.cos(rotation) * radiusX - Math.sin(rotation) * radiusX;
			var offsetY = Math.sin(rotation) * radiusY + Math.cos(rotation) * radiusY;
			sprite.setOffset(offsetX, offsetY);
			rotation -= (Math.PI * 2) / num;
		}
	};

	Window_JobChange.prototype.updateJobSelection = function()
	{
		var num = this._classIdTable.length;
		for ( var ii = 0; ii < num; ii++ )
		{
			var classId = this._classIdTable[ii];
			var selection = (ii == this.index()) ? true : false;
			var enable = this._actor.isClassChangeEnable(classId);
			this._jobSprite[classId].setSelection(selection);
			this._jobSprite[classId].setChangeEnable(enable);
		}
	};

	Window_JobChange.prototype.updateHelp = function()
	{
		if ( this.index() >= 0 )
		{
			var classId = this._classIdTable[this.index()];
			var data = $dataClasses[classId];
			if ( data.meta.jobInfo )
			{
				this._helpWindow.setText(data.meta.jobInfo);
			}
			else
			{
				this._helpWindow.clear();
			}
		}
		else
		{
			this._helpWindow.clear();
		}
	};

	Window_JobChange.prototype.selectActorClass = function(actor)
	{
		var num = this._classIdTable.length;
		for ( var ii = 0; ii < num; ii++ )
		{
			var classId = this._classIdTable[ii];
			if ( actor.isClass($dataClasses[classId]) )
			{
				this._introRotation = Window_JobChange._introRotationMax;
				this._introDistance = Window_JobChange._introDistanceMax;
				this.select(ii);
				this._rotation = this.currentRotation();
			}
		}
		this.updateJobPosition();
		this.updateJobSelection();
	};

	Window_JobChange.prototype.selectedClassId = function()
	{
		if ( this.index() >= 0 )
		{
			return this._classIdTable[this.index()];
		}
		return 0;
	};

	Window_JobChange.prototype.selectedJobName = function()
	{
		if ( this.index() >= 0 )
		{
			var classId = this._classIdTable[this.index()];
			return $dataClasses[classId].name;
		}
		return '';
	};

	Window_JobChange.prototype.refresh = function()
	{
		this.contents.clear();
		var width = 224;
		var x = (this.contentsWidth() - width) * 0.5;
		var y = 292;
		this.drawText(this.selectedJobName(), x, y, width, 'center');
		if ( this._actor )
		{
			var classId = this._classIdTable[this.index()];
			var level = TextManager.levelA + ' ' + this._actor.calcClassLevel(classId);
			var backupFontSize = this.contents.fontSize;
			this.contents.fontSize = 18;
			this.drawText(level, x, y-24, width, 'center');
			this.contents.fontSize = backupFontSize;
		}
	};

	var _Window_JobChange_cursorRight = Window_JobChange.prototype.cursorRight;
	Window_JobChange.prototype.cursorRight = function(wrap)
	{
		_Window_JobChange_cursorRight.call(this, true);
	};

	var _Window_JobChange_cursorLeft = Window_JobChange.prototype.cursorLeft;
	Window_JobChange.prototype.cursorLeft = function(wrap)
	{
		_Window_JobChange_cursorLeft.call(this, true);
	};

	Window_JobChange.prototype.itemRect = function(index)
	{
		var rect = new Rectangle();
		if ( this._jobSprite.length > 0 )
		{
			var classId = this._classIdTable[index];
			var sprite = this._jobSprite[classId];
			rect.x = sprite.x - (sprite.width * sprite.anchor.x);
			rect.y = sprite.y - (sprite.height * sprite.anchor.y);
			rect.width = sprite.width;
			rect.height = sprite.height;
		}
		return rect;
	};

	Window_JobChange.prototype.setCursorRect = function(x, y, width, height)
	{
	};

	var _Window_JobChange_select = Window_JobChange.prototype.select;
	Window_JobChange.prototype.select = function(index)
	{
		_Window_JobChange_select.call(this, index);
		this.refresh();
	};

	//-------------------------------------------------------------------------
	/** Window_JobDialog */
	function Window_JobDialog()
	{
		this.initialize.apply(this, arguments);
	}

	Window_JobDialog.prototype = Object.create(Window_Base.prototype);
	Window_JobDialog.prototype.constructor = Window_JobDialog;

	Window_JobDialog.prototype.initialize = function(x, y)
	{
		var width = this.windowWidth();
		var height = this.windowHeight();
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.openness = 0;
		this._showTimer = 0;
		this.refresh();
	};

	Window_JobDialog.prototype.windowWidth = function()
	{
		return 360;
	};

	Window_JobDialog.prototype.windowHeight = function()
	{
		return this.fittingHeight(1);
	};

	Window_JobDialog.prototype.backColor = function()
	{
		return '#000000';
	};

	var _Window_JobDialog_open = Window_JobDialog.prototype.open;
	Window_JobDialog.prototype.open = function()
	{
		_Window_JobDialog_open.call(this);
		this._showTimer = 60;
	};

	Window_JobDialog.prototype.update = function()
	{
		Window_Base.prototype.update.call(this);
		if ( this.isOpen() )
		{
			this._showTimer--;
			if ( this._showTimer <= 0 )
			{
				this.close();
			}
		}
	};

	Window_JobDialog.prototype.refresh = function()
	{
		this.contents.clear();
		var width = 224;
		var x = (this.contentsWidth() - width) * 0.5;
		var y = 0;
		this.drawText(gOptimizeEquipText, x, y, width, 'center');
	};

	Window_JobDialog.prototype._refreshBack = function()
	{
		var w = this._width;
		var h = this._height;
		var bitmap = new Bitmap(w, h);

		this._windowBackSprite.bitmap = bitmap;
		this._windowBackSprite.setFrame(0, 0, w, h);

		if ( w > 0 && h > 0 && this._windowskin )
		{
			bitmap.fillRect(0, 0, w, h, this.backColor());
			var tone = this._colorTone;
			bitmap.adjustTone(tone[0], tone[1], tone[2]);
		}
	};

	Window_JobDialog.prototype._refreshFrame = function()
	{
	};

	//-------------------------------------------------------------------------
	/** Window_MenuCommand */
	var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
	Window_MenuCommand.prototype.addOriginalCommands = function()
	{
		_Window_MenuCommand_addOriginalCommands.call(this);
		this.addCommand(gCommandName, 'jobChange', true);
	};

	//-------------------------------------------------------------------------
	/** Scene_JobChange */
	function Scene_JobChange()
	{
		this.initialize.apply(this, arguments);
	}

	Scene_JobChange.prototype = Object.create(Scene_MenuBase.prototype);
	Scene_JobChange.prototype.constructor = Scene_JobChange;

	Scene_JobChange.prototype.initialize = function()
	{
		Scene_MenuBase.prototype.initialize.call(this);
	};

	Scene_JobChange.prototype.create = function()
	{
		Scene_MenuBase.prototype.create.call(this);
		this.createHelpWindow();
		this.createStatusWindow();
		this.createJobChangeWindow();
		this.createDialogWindow();
		this.refreshActor();
	};

	Scene_JobChange.prototype.createStatusWindow = function()
	{
		var wx = 0;
		var wy = this._helpWindow.height;
		this._statusWindow = new Window_JobStatus(wx, wy);
		this.addWindow(this._statusWindow);
	};

	Scene_JobChange.prototype.createJobChangeWindow = function()
	{
		var wx = 0;
		var wy = this._statusWindow.y + this._statusWindow.height;
		var ww = Graphics.boxWidth;
		var wh = Graphics.boxHeight - wy;
		this._jobWindow = new Window_JobChange(wx, wy, ww, wh);
		this._jobWindow.setHelpWindow(this._helpWindow);
		this._jobWindow.setHandler('ok',       this.onJobChange.bind(this));
		this._jobWindow.setHandler('cancel',   this.popScene.bind(this));
		this._jobWindow.setHandler('pagedown', this.nextActor.bind(this));
		this._jobWindow.setHandler('pageup',   this.previousActor.bind(this));
		this._jobWindow.activate();
		this.addWindow(this._jobWindow);
	};

	Scene_JobChange.prototype.createDialogWindow = function()
	{
		var wx = (Graphics.boxWidth - 360) * 0.5;
		var wy = Graphics.boxHeight * 0.5 - 40;
		this._dialogWindow = new Window_JobDialog(wx, wy);
		this.addWindow(this._dialogWindow);
	};

	Scene_JobChange.prototype.update = function()
	{
		Scene_MenuBase.prototype.update.call(this);
		if ( !this._jobWindow.active )
		{
			if ( this._jobWindow.isClassChangeEnd() )
			{
				this._jobWindow.activate();
				if ( gOptimizeEquipEnable )
				{
					this._dialogWindow.open();
				}
			}
		}
	};

	Scene_JobChange.prototype.onJobChange = function()
	{
		var actor = this.actor();
		if ( actor )
		{
			var classId = this._jobWindow.selectedClassId();
			actor.changeClassEx(classId, false);
			if ( gOptimizeEquipEnable )
			{
				actor.optimizeEquipments();
			}
			this._jobWindow.startClassChange();
		}
		this._statusWindow.refresh();
	};

	Scene_JobChange.prototype.onActorChange = function()
	{
		this.refreshActor();
		this._jobWindow.activate();
	};

	Scene_JobChange.prototype.refreshActor = function()
	{
		var actor = this.actor();
		this._statusWindow.setActor(actor);
		this._jobWindow.setActor(actor);
	};

	//-------------------------------------------------------------------------
	/** Scene_Menu */
	var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function()
	{
		_Scene_Menu_createCommandWindow.call(this);
		this._commandWindow.setHandler('jobChange', this.commandPersonal.bind(this));
	};

	var _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
	Scene_Menu.prototype.onPersonalOk = function()
	{
		switch ( this._commandWindow.currentSymbol() )
		{
		case 'jobChange':
			SceneManager.push(Scene_JobChange);
			break;
		default:
			_Scene_Menu_onPersonalOk.call(this);
			break;
		}
	};

})();
