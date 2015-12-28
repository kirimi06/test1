//=============================================================================
// TMVplugin - リンククレジット
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.01
// 最終更新日: 2015/12/01
//=============================================================================

/*:
 * @plugindesc タイトルコマンドにリンク機能付きクレジットを追加します。
 * 利用素材の配布元へユーザーを誘導することが容易になります。
 * 
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param urlFontSize
 * @desc アドレス表示のフォントサイズ
 * 初期値: 16
 * @default 16
 *
 * @param credit1
 * @desc クレジット１
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default <name:RPGツクールMV><help:使用ツール><url:https://tkool.jp/mv/>
 *
 * @param credit2
 * @desc クレジット２
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit3
 * @desc クレジット３
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit4
 * @desc クレジット４
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit5
 * @desc クレジット５
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit6
 * @desc クレジット６
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit7
 * @desc クレジット７
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit8
 * @desc クレジット８
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit9
 * @desc クレジット９
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit10
 * @desc クレジット１０
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit11
 * @desc クレジット１１
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit12
 * @desc クレジット１２
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit13
 * @desc クレジット１３
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit14
 * @desc クレジット１４
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit15
 * @desc クレジット１５
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit16
 * @desc クレジット１６
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit17
 * @desc クレジット１７
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit18
 * @desc クレジット１８
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit19
 * @desc クレジット１９
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param credit20
 * @desc クレジット２０
 * 書式: <name:名前><help:説明><url:アドレス>
 * @default 
 *
 * @param titleCommandAlign
 * @desc タイトルコマンドのアライメント
 * 初期値: 0（0: 左寄せ / 1: 中央 / 2: 右寄せ）
 * @default 0
 *
 * @help <name:名前><help:説明><url:アドレス> のように
 * ３つのタグで１つの要素を設定します。
 *
 * helpタグの内容は \n があるところで改行されます。
 *
 * ブラウザ側でポップアップを制限している場合、
 * この機能は正しく動作しません。
 *
 * プラグインコマンドはありません。
 */

var Imported = Imported || {};
Imported.TMLinkCredit = true;

(function() {

  var parameters = PluginManager.parameters('TMLinkCredit');
  var urlFontSize = parameters['urlFontSize'];
  var credits = [];
  credits[0] = parameters['credit1'];
  credits[1] = parameters['credit2'];
  credits[2] = parameters['credit3'];
  credits[3] = parameters['credit4'];
  credits[4] = parameters['credit5'];
  credits[5] = parameters['credit6'];
  credits[6] = parameters['credit7'];
  credits[7] = parameters['credit8'];
  credits[8] = parameters['credit9'];
  credits[9] = parameters['credit10'];
  credits[10] = parameters['credit11'];
  credits[11] = parameters['credit12'];
  credits[12] = parameters['credit13'];
  credits[13] = parameters['credit14'];
  credits[14] = parameters['credit15'];
  credits[15] = parameters['credit16'];
  credits[16] = parameters['credit17'];
  credits[17] = parameters['credit18'];
  credits[18] = parameters['credit19'];
  credits[19] = parameters['credit20'];
  credits[20] = parameters['credit21'];
  var titleCommandAlign = parameters['titleCommandAlign'];

  //-----------------------------------------------------------------------------
  // Window_TitleCommand
  //

  var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
  Window_TitleCommand.prototype.makeCommandList = function() {
    _Window_TitleCommand_makeCommandList.call(this);
    this.addCommand('クレジット',   'credits');
  };

  var _Window_TitleCommand_itemTextAlign = Window_TitleCommand.prototype.itemTextAlign;
  Window_TitleCommand.prototype.itemTextAlign = function() {
    if (titleCommandAlign == 1) {
      return 'center';
    } else if (titleCommandAlign == 2) {
      return 'right';
    } else {
      _Window_TitleCommand_itemTextAlign.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Window_Credits
  //

  function Window_Credits() {
    this.initialize.apply(this, arguments);
  }

  Window_Credits.prototype = Object.create(Window_Selectable.prototype);
  Window_Credits.prototype.constructor = Window_Credits;

  Window_Credits.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._data = [];
    this._dataHelp = [];
    this._dataUrl = [];
    var re = /<name:(.+?)><help:(.+?)><url:(.+?)>/;
    for (var i = 0; i < credits.length; i++) {
      var match = re.exec(credits[i]);
      if (match) {
        this._data.push(match[1]);
        match[2] = match[2].replace(/\\n/g, '\n');
        this._dataHelp.push(match[2]);
        this._dataUrl.push(match[3]);
      }
    }
    this.refresh();
    this.select(0);
    this.activate();
  };

  Window_Credits.prototype.maxCols = function() {
    return 1;
  };

  Window_Credits.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
  };

  Window_Credits.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
  };

  Window_Credits.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
  };

  Window_Credits.prototype.isEnabled = function(item) {
    return true;
  };

  Window_Credits.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
      var rect = this.itemRect(index);
      rect.width -= this.textPadding();
      this.contents.fontSize = this.standardFontSize();
      this.drawText(item, rect.x, rect.y, rect.width);
      this.contents.fontSize = urlFontSize;
      this.drawText(this._dataUrl[index], rect.x, rect.y, rect.width, 'right');
    }
  };

  Window_Credits.prototype.updateHelp = function() {
    this._helpWindow.setText(this._dataHelp[this.index()]);
  };

  Window_Credits.prototype.refresh = function() {
    this.createContents();
    this.drawAllItems();
  };

  Window_Credits.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
      this.playOkSound();
      this.updateInputData();
//      this.deactivate();
//      this.callOkHandler();
      window.open(this._dataUrl[this.index()], '_blank');
    } else {
      this.playBuzzerSound();
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Title
  //

  var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
  Scene_Title.prototype.createCommandWindow = function() {
    _Scene_Title_createCommandWindow.call(this);
    this._commandWindow.setHandler('credits', this.commandCredits.bind(this));
  };

  Scene_Title.prototype.commandCredits = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Credits);
  };

  //-----------------------------------------------------------------------------
  // Scene_Credits
  //

  function Scene_Credits() {
    this.initialize.apply(this, arguments);
  }

  Scene_Credits.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_Credits.prototype.constructor = Scene_Credits;

  Scene_Credits.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_Credits.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCreditsWindow();
  };

  Scene_Credits.prototype.createCreditsWindow = function() {
    this._creditsWindow = new Window_Credits(0, this._helpWindow.height, Graphics.boxWidth,
                                             Graphics.boxHeight - this._helpWindow.height);
    this._creditsWindow.setHandler('ok',     this.onCreditsOk.bind(this));
    this._creditsWindow.setHandler('cancel', this.popScene.bind(this));
    this._creditsWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._creditsWindow);
  };

  Scene_Credits.prototype.onCreditsOk = function() {
    this._creditsWindow.activate();
  };

})();
