//=============================================================================
// SO風メニュー　SOM.js
//=============================================================================
/*:ja
 * @plugindesc SO風メニュー画面（但しメニュー画面のトップしかないです）
 * @author sairi
 * 
 * @param bgBitmapMenu
 * @desc メニュー背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param maxRowsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  
 *　各キャラのステータス毎に別途絵を利用するのでアクターのメモに 
 *　<stand_picture:ファイル名>と記載して下さい。
 *  ファイルは img/pictures に置いてください。 
 *　4人パーティを限度として一応作ってありますのでもし
 *　他のプラグインと併用して上限人数を増やす場合はコードを直して下さい。　
 *
 * アクター絵のサイズは画面のサイズに併せて調整して下さい。
 * デフォルトはスクリーンサイズ1024*624用、幅：600px / 高さ：100pxです。
 *
 */
 
 
 (function() {
	 
	// パラメータセット
    var parameters = PluginManager.parameters('SOM');
    var bgBitmapMenu = parameters['bgBitmapMenu'] || '';
	//rowsが何行分縦にスペースを取るか、colsが何列分横にスペースを取るか
    var maxRowsMenuWnd = Number(parameters['maxRowsMenu'] || 4);
    var rowsCommandWnd = Number(parameters['commandRows'] || 1);
    var isDisplayStatus = !!Number(parameters['isDisplayStatus']);
	
	//コマンドメニューの説明文です、'　'の中のメッセージをお好きに変更して下さい。
	var Information_Msg = {
		'item': String(parameters['Information_item'] || 'INFORMATION;入手したアイテムを使用します。'),
		'skill': String(parameters['Information_skill'] || 'INFORMATION;習得したスキルを使用します。'),
		'equip': String(parameters['Information_equip'] || 'INFORMATION;装備を変更します。'),
		'status': String(parameters['Information_status'] || 'INFORMATION;ステータスを確認します。'),
		'formation': String(parameters['Information_formation'] || 'INFORMATION;パーティの並び順を変更します。'),
		'options': String(parameters['Information_options'] || 'INFORMATION;オプション画面を開きます。'),
		'save': String(parameters['Information_save'] || 'INFORMATION;これまでのデータをセーブします。'),
		'gameEnd': String(parameters['Information_gameEnd'] || 'INFORMATION;ゲームを終了します。')		
	}	

	var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
		//所持金ウインドウの表示表示-------------------------------------		
        this._goldWindow.x = Graphics.boxWidth - 240;
        this._goldWindow.y = this._statusWindow.height+100;
		//コマンドウインドウの表示位置-----------------------------------
		this._commandWindow.y =0;
		this._commandWindow.x =50;
		//ステータスウインドウの表示位置----------------------------------
        this._statusWindow.x = Graphics.boxWidth / 3 ;
		this._statusWindow.y = 30 ;
		// メニュー画面全てのウインドウを透明にする
        this._statusWindow.opacity = 0;
        this._goldWindow.opacity = 0;
        this._commandWindow.opacity = 0;
// インフォメーションウィンドウの追加---------------------------------------------------------------------
        this.createInformationWindow();
		// コマンドウィンドウとステータスウィンドウを下にずらす
        this._informationWindow.y = this._statusWindow.height+100;
    };    
    Scene_Menu.prototype.createInformationWindow = function() {
	    this._informationWindow = new Window_Information();
	    this.addWindow(this._informationWindow);
	};
    var _Scene_Menu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
        _Scene_Menu_update.call(this);
        // インフォメーションウィンドウの更新
        this._informationWindow.setText(Information_Msg[this._commandWindow.currentSymbol()]);
    };
	function Window_Information() {
	    this.initialize.apply(this, arguments);
		//透明化処置
		this.opacity = 0;
	}
	Window_Information.prototype = Object.create(Window_Base.prototype);
	Window_Information.prototype.constructor = Window_Information;
	Window_Information.prototype.initialize = function() {
		//インフォメーションウインドウのサイズ
	    var width = Graphics.boxWidth-240;
	    var height = 72;
	    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
	    this._text = '';
	};
	Window_Information.prototype.setText = function(text) {
	        this._text = text;
	        this.refresh();
	};
	Window_Information.prototype.clear = function() {
	    this.setText('');
	};
	Window_Information.prototype.refresh = function() {				    
	    this.contents.clear();
            var x = Graphics.boxWidth/2
		    this.drawTextEx(this._text, 0,this.textPadding(), 0);
			
	};
	
//メニュー画面の背景画像読み込み---------------------------------------------------------------
    var _Scene_Menu_createBackground = Scene_Menu.prototype.createBackground;
    Scene_Menu.prototype.createBackground = function(){
        if(bgBitmapMenu){
			Scene_MenuBase.prototype.createBackground.call(this);
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapMenu);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_Menu_createBackground.call(this);
    };

//------------------------------------------------------------------------------
	//コマンドウインドウの幅
	    Window_MenuCommand.prototype.windowWidth = function() {
        return  Graphics.boxWidth / 5;
    }
	//コマンドウインドウのフォントサイズ変更
	Window_MenuCommand.prototype.standardFontSize = function() {
    return 20;
    };
	//コマンドウインドウの行幅変更
	Window_MenuCommand.prototype.lineHeight = function() {
	return 40;
　　};	
　　//ステータスウインドウ高さ
    Window_MenuStatus.prototype.windowHeight = function() {
        return Graphics.boxHeight　-　172;
    };
	//ステータスウインドウの幅（画面幅からコマンドウインドウの幅だけ引いた数値です）
	    Window_MenuStatus.prototype.windowWidth = function() {
        return  Graphics.boxWidth -Graphics.boxWidth / 3;
    }
	//ステータスメニューの列数（パラメーター設定部分
    Window_MenuStatus.prototype.maxRows = function() {
        return maxRowsMenuWnd;
    };
	//何人分に切り分けるか
    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 5;
    };
	//インフォメーションウインドウのフォントサイズ変更
    Window_Information.prototype.standardFontSize = function() {
    return 20;
    };



//-------------------------------------------------------------------------------------
//ステータス画面へ差し込む画像の配置
    Window_MenuStatus.prototype.drawItemImage = function(index) {
//フォントサイズ変更		
    this.contents.fontSize = 20;		
//パーティーメンバー分処理を繰り返す為の処置
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        // load stand_picture
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 600));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 100));
        var lineHeight = this.lineHeight();
        this.changePaintOpacity(actor.isBattleMember());
        if(bitmap){
            var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
            var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
            var dx = (bitmap.width > rect.width) ? rect.x :
                rect.x + (rect.width - bitmap.width) / 2;
            var dy = (bitmap.height > rect.height) ? rect.y :
                rect.y + (rect.height - bitmap.height) / 2;
            this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
        } else { // when bitmap is not set, do the original process.
            this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
        }
        this.changePaintOpacity(true);

//ステータスの文字列やバナー配置--------------------------------------------------		
		Window_MenuStatus.prototype.drawItemStatus = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x + 200 ;
        var y = rect.y;
        var width = rect.width;
        var bottom = 10 + rect.height;
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorLevel(actor, x + 100, y + lineHeight * 0, width);
        this.drawActorClass(actor, x , y + lineHeight * 0.8, width);
        this.drawActorHp(actor, x + 160, y, width-400);
        this.drawActorMp(actor, x + 160, y + lineHeight * 0.8, width-400);
		this.drawActorTp(actor, x + 160, y+ lineHeight * 1.6, width-400);
        this.drawActorIcons(actor, x , y + lineHeight * 1.6, width);
        };
        };

 

})();



	