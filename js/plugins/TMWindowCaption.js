//=============================================================================
// TMVplugin - ウィンドウキャプション
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.1b
// 最終更新日: 2015/12/20
//=============================================================================

/*:
 * @plugindesc ウィンドウの左上にキャプションを追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param captionShiftX
 * @desc キャプションの X 座標補正値
 * 初期値: 18
 * @default 18
 *
 * @param captionWidth
 * @desc キャプションの最大幅
 * 初期値: 320
 * @default 320
 *
 * @param captionFontSize
 * @desc キャプションの文字サイズ
 * 初期値: 18
 * @default 18
 *
 * @param messageCaptionFontSize
 * @desc メッセージウィンドウのキャプションの文字サイズ
 * 初期値: 28
 * @default 28
 *
 * @param captionFontColor
 * @desc キャプションの文字色
 * 初期値: 15
 * @default 15
 *
 * @param captionOutlineWidth
 * @desc キャプションの縁取りの幅
 * 初期値: 4
 * @default 4
 *
 * @param captionOutlineColor
 * @desc キャプションの縁取りの色
 * 初期値: 8
 * @default 8
 *
 * @param captionHelp
 * @desc キャプション Window_Help
 * 初期値: ヘルプ
 * @default ヘルプ
 *
 * @param captionGold
 * @desc キャプション Window_Gold
 * 初期値: 所持金
 * @default 所持金
 *
 * @param captionMenuCommand
 * @desc キャプション Window_MenuCommand
 * 初期値: コマンド
 * @default コマンド
 *
 * @param captionMenuStatus
 * @desc キャプション Window_MenuStatus
 * 初期値: ステータス
 * @default ステータス
 *
 * @param captionMenuActor
 * @desc キャプション Window_MenuActor
 * 初期値: キャラクター選択
 * @default キャラクター選択
 *
 * @param captionItemCategory
 * @desc キャプション Window_ItemCategory
 * 初期値: カテゴリー
 * @default カテゴリー
 *
 * @param captionItemList_item
 * @desc キャプション Window_ItemList(アイテムカテゴリ)
 * 初期値: アイテム
 * @default アイテム
 *
 * @param captionItemList_weapon
 * @desc キャプション Window_ItemList(武器カテゴリ)
 * 初期値: 武器
 * @default 武器
 *
 * @param captionItemList_armor
 * @desc キャプション Window_ItemList(防具カテゴリ)
 * 初期値: 防具
 * @default 防具
 *
 * @param captionItemList_keyItem
 * @desc キャプション Window_ItemList(大事なものカテゴリ)
 * 初期値: 大事なもの
 * @default 大事なもの
 *
 * @param captionSkillType
 * @desc キャプション Window_SkillType
 * 初期値: スキルタイプ
 * @default スキルタイプ
 *
 * @param captionSkillStatus
 * @desc キャプション Window_SkillStatus
 * 初期値: ステータス
 * @default ステータス
 *
 * @param captionEquipStatus
 * @desc キャプション Window_EquipStatus
 * 初期値: ステータス
 * @default ステータス
 *
 * @param captionEquipCommand
 * @desc キャプション Window_EquipCommand
 * 初期値: コマンド
 * @default コマンド
 *
 * @param captionEquipSlot
 * @desc キャプション Window_EquipSlot
 * 初期値: 装備
 * @default 装備
 *
 * @param captionStatus
 * @desc キャプション Window_Status
 * 初期値: ステータス
 * @default ステータス
 *
 * @param captionOptions
 * @desc キャプション Window_Options
 * 初期値: オプション
 * @default オプション
 *
 * @param captionSavefileList
 * @desc キャプション Window_SavefileList
 * 初期値: セーブファイル
 * @default セーブファイル
 *
 * @param captionShopCommand
 * @desc キャプション Window_ShopCommand
 * 初期値: コマンド
 * @default コマンド
 *
 * @param captionShopBuy
 * @desc キャプション Window_ShopBuy
 * 初期値: 商品
 * @default 商品
 *
 * @param captionShopNumber
 * @desc キャプション Window_ShopNumber
 * 初期値: 個数選択
 * @default 個数選択
 *
 * @param captionShopStatus
 * @desc キャプション Window_ShopStatus
 * 初期値: ステータス
 * @default ステータス
 *
 * @param captionNameEdit
 * @desc キャプション Window_NameEdit
 * 初期値: 名前
 * @default 名前
 *
 * @param captionNameInput
 * @desc キャプション Window_NameInput
 * 初期値: 文字入力
 * @default 文字入力
 *
 * @param captionChoiceList
 * @desc キャプション Window_ChoiceList
 * 初期値: 選択肢
 * @default 選択肢
 *
 * @param captionNumberInput
 * @desc キャプション Window_NumberInput
 * 初期値: 数値入力
 * @default 数値入力
 *
 * @param captionEventItem
 * @desc キャプション Window_EventItem(通常アイテム)
 * 初期値: アイテム
 * @default アイテム
 *
 * @param captionEventItem_key
 * @desc キャプション Window_EventItem(大事なもの)
 * 初期値: 大事なもの
 * @default 大事なもの
 *
 * @param captionEventItem_A
 * @desc キャプション Window_EventItem(隠しアイテムＡ)
 * 初期値: 隠しアイテムＡ
 * @default 隠しアイテムＡ
 *
 * @param captionEventItem_B
 * @desc キャプション Window_EventItem(隠しアイテムＢ)
 * 初期値: 隠しアイテムＢ
 * @default 隠しアイテムＢ
 *
 * @param captionPartyCommand
 * @desc キャプション Window_PartyCommand
 * 初期値: コマンド
 * @default コマンド
 *
 * @param captionActorCommand
 * @desc キャプション Window_ActorCommand
 * 初期値: コマンド
 * @default コマンド
 *
 * @param captionBattleStatus
 * @desc キャプション Window_BattleStatus
 * 初期値: ステータス
 * @default ステータス
 *
 * @param captionBattleActor
 * @desc キャプション Window_BattleActor
 * 初期値: キャラクター選択
 * @default キャラクター選択
 *
 * @param captionBattleEnemy
 * @desc キャプション Window_BattleEnemy
 * 初期値: エネミー選択
 * @default エネミー選択
 *
 * @param captionBattleSkill
 * @desc キャプション Window_BattleSkill
 * 初期値: スキル
 * @default スキル
 *
 * @param captionBattleItem
 * @desc キャプション Window_BattleItem
 * 初期値: アイテム
 * @default アイテム
 *
 * @param captionTitleCommand
 * @desc キャプション Window_TitleCommand
 * 初期値: コマンド
 * @default コマンド
 *
 * @param captionGameEnd
 * @desc キャプション Window_GameEnd
 * 初期値: コマンド
 * @default コマンド
 *
 * @help
 * TMWindowCaption.png という画像を img/system フォルダに置いてください、
 * この画像を元にキャプションのフレームを作成します。
 * 画像サイズは 48*32、左右の 16 ドットがキャプションの両端となり、
 * 中央 16 ドットを必要なだけ拡大したものがキャプションの中央部分になります。
 *
 * captionFontColor と captionOutlineColor は制御文字 \C[n] と
 * 同じ色番号で指定してください。
 *
 * キャプションを表示したくないウィンドウはパラメータを空にしてください。
 *
 * 制御文字:
 *   \WC[文字列]        # 文章の表示コマンドにこの制御文字を書き込むと
 *                        メッセージウィンドウのキャプションを
 *                        指定した文字列に変更することができます。
 *
 * プラグインコマンドはありません。
 * 
 */

var Imported = Imported || {};
Imported.TMWindowCaption = true;

(function() {

  var parameters = PluginManager.parameters('TMWindowCaption');
  var captionShiftX    = Number(parameters['captionShiftX']);
  var captionWidth     = Number(parameters['captionWidth']);
  var captionFontSize  = Number(parameters['captionFontSize']);
  var messageCaptionFontSize = Number(parameters['messageCaptionFontSize']);
  var captionFontColor = parameters['captionFontColor'];
  var captionOutlineWidth = Number(parameters['captionOutlineWidth']);
  var captionOutlineColor = parameters['captionOutlineColor'];
  var captionHelp             = parameters['captionHelp'];
  var captionGold             = parameters['captionGold'];
  var captionMenuCommand      = parameters['captionMenuCommand'];
  var captionMenuStatus       = parameters['captionMenuStatus'];
  var captionMenuActor        = parameters['captionMenuActor'];
  var captionItemCategory     = parameters['captionItemCategory'];
  var captionItemList_item    = parameters['captionItemList_item'];
  var captionItemList_weapon  = parameters['captionItemList_weapon'];
  var captionItemList_armor   = parameters['captionItemList_armor'];
  var captionItemList_keyItem = parameters['captionItemList_keyItem'];
  var captionSkillType        = parameters['captionSkillType'];
  var captionSkillStatus      = parameters['captionSkillStatus'];
  var captionEquipStatus      = parameters['captionEquipStatus'];
  var captionEquipCommand     = parameters['captionEquipCommand'];
  var captionEquipSlot        = parameters['captionEquipSlot'];
  var captionStatus           = parameters['captionStatus'];
  var captionOptions          = parameters['captionOptions'];
  var captionSavefileList     = parameters['captionSavefileList'];
  var captionShopCommand      = parameters['captionShopCommand'];
  var captionShopBuy          = parameters['captionShopBuy'];
  var captionShopNumber       = parameters['captionShopNumber'];
  var captionShopStatus       = parameters['captionShopStatus'];
  var captionNameEdit         = parameters['captionNameEdit'];
  var captionNameInput        = parameters['captionNameInput'];
  var captionChoiceList       = parameters['captionChoiceList'];
  var captionNumberInput      = parameters['captionNumberInput'];
  var captionEventItem        = parameters['captionEventItem'];
  var captionEventItem_key    = parameters['captionEventItem_key'];
  var captionEventItem_A      = parameters['captionEventItem_A'];
  var captionEventItem_B      = parameters['captionEventItem_B'];
  var captionPartyCommand     = parameters['captionPartyCommand'];
  var captionActorCommand     = parameters['captionActorCommand'];
  var captionBattleStatus     = parameters['captionBattleStatus'];
  var captionBattleActor      = parameters['captionBattleActor'];
  var captionBattleEnemy      = parameters['captionBattleEnemy'];
  var captionBattleSkill      = parameters['captionBattleSkill'];
  var captionBattleItem       = parameters['captionBattleItem'];
  var captionTitleCommand     = parameters['captionTitleCommand'];
  var captionGameEnd          = parameters['captionGameEnd'];
  
  //-----------------------------------------------------------------------------
  // Sprite_WindowCaption
  //

  function Sprite_WindowCaption() {
    this.initialize.apply(this, arguments);
  }

  Sprite_WindowCaption.prototype = Object.create(Sprite.prototype);
  Sprite_WindowCaption.prototype.constructor = Sprite_WindowCaption;

  Sprite_WindowCaption.prototype.initialize = function(subjectWindow) {
    Sprite.prototype.initialize.call(this);
    this._subjectWindow = subjectWindow;
    this.bitmap = new Bitmap(captionWidth, this._subjectWindow.captionFontSize() +
                                           captionOutlineWidth * 2);
    this.anchor.y = 1.0;
    this._captionText = '';
  };
  
  Sprite_WindowCaption.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._subjectWindow) {
      var captionText = this._subjectWindow.captionText();
      if (this._captionText !== captionText) {
        this._captionText = captionText;
        this.refresh();
      }
      if (this._captionText) {
        this.x = this._subjectWindow.parent.x + this._subjectWindow.x +
                 captionShiftX;
        this.y = this._subjectWindow.parent.y + this._subjectWindow.y +
                 this._subjectWindow._windowSpriteContainer.y + 2;
      }
      this.visible = this._subjectWindow.visible && !this._subjectWindow.isClosed();
    }
  };

  Sprite_WindowCaption.prototype.refresh = function() {
    this.bitmap.clear();
    if (this._captionText) {
      this.bitmap.fontSize = this._subjectWindow.captionFontSize();
      this.bitmap.textColor = this._subjectWindow.textColor(captionFontColor);
      this.bitmap.outlineWidth = captionOutlineWidth;
      this.bitmap.outlineColor = this._subjectWindow.textColor(captionOutlineColor);
      var w = this.bitmap.measureTextWidth(this._captionText);
      if (w > captionWidth - 32) {
        w = captionWidth - 32;
      }
      var h = this.height;
      var bitmap = ImageManager.loadSystem('TMWindowCaption');
      this.bitmap.blt(bitmap, 0, 0, 16, 32, 0, 0, 16, h);
      this.bitmap.blt(bitmap, 16, 0, 16, 32, 16, 0, w, h);
      this.bitmap.blt(bitmap, 32, 0, 16, 32, 16 + w, 0, 16, h);
      this.bitmap.drawText(this._captionText, 16, 1, w, h, 'left');
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_XXXX
  //

  Window_Base.prototype.captionText = function() {
    return '';
  };

  Window_Base.prototype.captionFontSize = function() {
    return captionFontSize;
  };

  Window_Help.prototype.captionText = function() {
    return captionHelp;
  };

  Window_Gold.prototype.captionText = function() {
    return captionGold;
  };

  Window_MenuCommand.prototype.captionText = function() {
    return captionMenuCommand;
  };

  Window_MenuStatus.prototype.captionText = function() {
    return captionMenuStatus;
  };

  Window_MenuActor.prototype.captionText = function() {
    return captionMenuActor;
  };

  Window_ItemCategory.prototype.captionText = function() {
    return captionItemCategory;
  };

  Window_ItemList.prototype.captionText = function() {
    switch (this._category) {
    case 'item':
        return captionItemList_item;
    case 'weapon':
        return captionItemList_weapon;
    case 'armor':
        return captionItemList_armor;
    case 'keyItem':
        return captionItemList_keyItem;
    default:
        return '';
    }
  };

  Window_SkillType.prototype.captionText = function() {
    return captionSkillType;
  };

  Window_SkillStatus.prototype.captionText = function() {
    return captionSkillStatus;
  };

  Window_SkillList.prototype.captionText = function() {
    return $dataSystem.skillTypes[this._stypeId];
  };

  Window_EquipStatus.prototype.captionText = function() {
    return captionEquipStatus;
  };

  Window_EquipCommand.prototype.captionText = function() {
    return captionEquipCommand;
  };

  Window_EquipSlot.prototype.captionText = function() {
    return captionEquipSlot;
  };
  
  Window_EquipItem.prototype.captionText = function() {
    if (this._actor) {
      var slots = this._actor.equipSlots();
      return $dataSystem.equipTypes[slots[this._slotId]];
    }
    return '';
  };

  Window_Status.prototype.captionText = function() {
    return captionStatus;
  };
  
  Window_Options.prototype.captionText = function() {
    return captionOptions;
  };
  
  Window_SavefileList.prototype.captionText = function() {
    return captionSavefileList;
  };
  
  Window_ShopCommand.prototype.captionText = function() {
    return captionShopCommand;
  };
  
  Window_ShopBuy.prototype.captionText = function() {
    return captionShopBuy;
  };
  
  Window_ShopNumber.prototype.captionText = function() {
    return captionShopNumber;
  };
  
  Window_ShopStatus.prototype.captionText = function() {
    return captionShopStatus;
  };
  
  Window_NameEdit.prototype.captionText = function() {
    return captionNameEdit;
  };
  
  Window_NameInput.prototype.captionText = function() {
    return captionNameInput;
  };
  
  Window_ChoiceList.prototype.captionText = function() {
    return captionChoiceList;
  };
  
  Window_NumberInput.prototype.captionText = function() {
    return captionNumberInput;
  };
  
  Window_EventItem.prototype.captionText = function() {
    switch ($gameMessage.itemChoiceItypeId()) {
    case 1:
      return captionEventItem;
    case 2:
      return captionEventItem_key;
    case 3:
      return captionEventItem_A;
    case 4:
      return captionEventItem_B;
    default:
      return '';
    }
  };
  
  Window_Message.prototype.captionText = function() {
    if (this._captionText === undefined) {
      this._captionText = '';
    }
    return this._captionText;
  };
  
  Window_Message.prototype.captionFontSize = function() {
    return messageCaptionFontSize;
  };
  
  var _Window_Message_startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() {
    _Window_Message_startMessage.call(this);
    this._captionText = '';
    this._textState.text = this._textState.text.replace(/\x1bWC\[(.+?)\]/gi, function() {
      this._captionText = arguments[1];
      return '';
    }.bind(this));
  };

  Window_PartyCommand.prototype.captionText = function() {
    return captionPartyCommand;
  };
  
  Window_ActorCommand.prototype.captionText = function() {
    return captionActorCommand;
  };
  
  Window_BattleStatus.prototype.captionText = function() {
    return captionBattleStatus;
  };
  
  Window_BattleActor.prototype.captionText = function() {
    return captionBattleActor;
  };
  
  Window_BattleEnemy.prototype.captionText = function() {
    return captionBattleEnemy;
  };
  
  Window_BattleSkill.prototype.captionText = function() {
    return captionBattleSkill;
  };
  
  Window_BattleItem.prototype.captionText = function() {
    return captionBattleItem;
  };
  
  Window_TitleCommand.prototype.captionText = function() {
    return captionTitleCommand;
  };
  
  Window_GameEnd.prototype.captionText = function() {
    return captionGameEnd;
  };
  
  //-----------------------------------------------------------------------------
  // Scene_Base
  //

  var _Scene_Base_addWindow = Scene_Base.prototype.addWindow;
  Scene_Base.prototype.addWindow = function(window) {
    _Scene_Base_addWindow.call(this, window);
    var sprite = new Sprite_WindowCaption(window);
    this.addChild(sprite);
  };

  //-----------------------------------------------------------------------------
  // Scene_Boot
  //

  var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
  Scene_Boot.prototype.loadSystemImages = function() {
    _Scene_Boot_loadSystemImages.call(this);
    ImageManager.loadSystem('TMWindowCaption');
  };

})();
