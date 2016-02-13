//=============================================================================
// AltMenuScreen3の改造メニュー画面
//=============================================================================

/*:ja
 * @plugindesc レイアウトの異なるメニュー画面
 * @author 神無月サスケ, Yoji Ojima
 * 
 * @param bgBitmapItem
 * @desc アイテム画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapSkill
 * @desc スキル画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapEquip
 * @desc 装備画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapStatus
 * @desc ステータス画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapOptions
 * @desc オプション画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapFile
 * @desc セーブ／ロード画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param bgBitmapGameEnd
 * @desc ゲーム終了画面背景にするビットマップファイルです。
 * img/pictures に置いてください。
 * @default 
 * 
 * @param maxRowsMenu
 * @desc アクターを表示するウィンドウの1画面の登録最大数です。
 * @default 4
 * 
 * @param commandCols
 * @desc コマンドウィンドウの縦列グループです。
 * @default 2
 *
 * @param isDisplayStatus
 * @desc ステータスを表示するかしないかを選びます。(1 = yes, 0 = no)
 * @default 1
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *  AltMenuscreen との違いは以下です:
 *  - メニュー画面すべてのウィンドウが透明です
 *  - メニューそれぞれのシーンに背景ビットマップを付けることが出来ます。
 *  - アクターに立ち絵を利用します。
 *
 * アクターのメモに以下のように書いてください:
 * <stand_picture:ファイル名> ファイル名が、そのアクターの立ち絵になります。
 *   ファイルは img/pictures に置いてください。
 *
 */

(function() {

    // set parameters
    var parameters = PluginManager.parameters('Untitled-2');
    var bgBitmapItem = parameters['bgBitmapItem'] || '';
    var bgBitmapSkill = parameters['bgBitmapSkill'] || '';
    var bgBitmapEquip = parameters['bgBitmapEquip'] || '';
    var bgBitmapStatus = parameters['bgBitmapStatus'] || '';
    var bgBitmapOptions = parameters['bgBitmapOptions'] || '';
    var bgBitmapFile = parameters['bgBitmapFile'] || '';
    var bgBitmapGameEnd = parameters['bgBitmapGameEnd'] || '';
    var maxRowsMenuWnd = Number(parameters['maxRowsMenu'] || 4);
    var colsCommandWnd = Number(parameters['commandCols'] || 2);
    var isDisplayStatus = !!Number(parameters['isDisplayStatus']);


   //
   // メニューの各シーンに透明な窓を作る
   //
    var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
    //ステータスウインドウの表示位置----------------------------------
        this._statusWindow.x = 546;
        this._statusWindow.y = 230;
	//コマンドウインドウの表示位置-----------------------------------
        this._commandWindow.x = 546;
		this._commandWindow.y =75;
    //所持金ウインドウの表示表示-------------------------------------		
        this._goldWindow.x = 556;
        this._goldWindow.y = 550;
        // メニュー画面全てのウインドウを透明にする（opacity）
        this._statusWindow.opacity = 0;
        this._goldWindow.opacity = 0;
        this._commandWindow.opacity = 0;	
//==============================
// * Draw Time Contents
//==============================
Window_Time_Status.prototype.draw_time_contents = function() {
   var x = this.width - 130;
   var y = 23;
   this.contents.drawText(Moghunter.time_word, 0, 0, 90,32);
   if (this.pm_mode) {var apm = " am";if ($gameSystem.hour() >= 12) {var apm = " pm"};
	   this.contents.drawText($gameSystem.hour_pm() + ":" +  $gameSystem.minute().padZero(2) + apm, x, 0, 90,32,"right");  
   }
   else {
      this.contents.drawText($gameSystem.hour().padZero(2) + ":" +  $gameSystem.minute().padZero(2), x, 0, 90,32,"right");
   };   
   if (this._mode === 1) {
       this.contents.drawText(Moghunter.day_word, 0, y, 90,32);
	   var text = $gameSystem.day_week_name() + " " + $gameSystem.month().padZero(2) + "/" + $gameSystem.day().padZero(2);
	   this.contents.drawText(text, x - 30, y, 120,32,"right");
	   this.contents.drawText(Moghunter.year_word, 0, y * 2, 90,32);
	   var text = $gameSystem.year() + " " + $gameSystem.season_name();
	   this.contents.drawText(text, x - 30, y * 2, 120,32,"right");
   }
   else {
	   this.contents.drawText($gameSystem.day(), x, y, 90,32,"right");
	   this.contents.drawText(Moghunter.day_word, 0, y, 90,32);
	   this.contents.drawText($gameSystem.day(), x, y, 90,32,"right");     
	   this.contents.drawText(Moghunter.day_week_word, 0, y * 2, 90,32);
	   this.contents.drawText($gameSystem.day_week_name(), x, y * 2, 90,32,"right");  
	   this.contents.drawText(Moghunter.month_word, 0, y * 3, 90,32);
	   this.contents.drawText($gameSystem.month_name(), x, y * 3, 90,32,"right");      
	   this.contents.drawText(Moghunter.year_word, 0, y * 4, 90,32);
	   this.contents.drawText($gameSystem.year(), x, y * 4, 90,32,"right");    
	   this.contents.drawText(Moghunter.season_word, 0, y * 5, 90,32);
	   this.contents.drawText($gameSystem.season_name(), x, y * 5, 90,32,"right");
	   this.contents.drawText(Moghunter.play_time_word, 0, y * 6, 90,32);
	   this.contents.drawText($gameSystem.playtimeText(), x, y * 6, 90,32,"right");
           this.contents.drawText($gameMap.displayName(), x, y * 7, 90,32,"right");
   };
//-----------------------------------------------------------------------		
    };
    // アイテム画面全てのウインドウを透明にする
    var _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this._helpWindow.opacity = 0;
        this._categoryWindow.opacity = 0;
        this._itemWindow.opacity = 0;
        this._actorWindow.opacity = 0;
    };
    // スキル画面全てのウインドウを透明にする
    var _Scene_Skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        _Scene_Skill_create.call(this);
        this._helpWindow.opacity = 0;
        this._skillTypeWindow.opacity = 0;
        this._statusWindow.opacity = 0;
        this._itemWindow.opacity = 0;
        this._actorWindow.opacity = 0;
    };
    // 装備画面全てのウインドウを透明にする
    var _Scene_Equip_create = Scene_Equip.prototype.create;
    Scene_Equip.prototype.create = function() {
        _Scene_Equip_create.call(this);
        this._helpWindow.opacity = 0;
        this._statusWindow.opacity = 0;
        this._commandWindow.opacity = 0;
        this._slotWindow.opacity = 0;
        this._itemWindow.opacity = 0;
    };
    // ステータス画面全てのウインドウを透明にする
    var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function() {
        _Scene_Status_create.call(this);
        this._statusWindow.opacity = 0;
    };
    // オプション画面全てのウインドウを透明にする
    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.opacity = 0;
    };
    // セーブ画面全てのウインドウを透明にする
    var _Scene_File_create = Scene_File.prototype.create;
    Scene_File.prototype.create = function() {
        _Scene_File_create.call(this);
        this._helpWindow.opacity = 0;
        this._listWindow.opacity = 0;
    };
    //ゲーム終了画面のウインドウを透明にする
    var _Scene_GameEnd_create = Scene_GameEnd.prototype.create;
    Scene_GameEnd.prototype.create = function() {
        _Scene_GameEnd_create.call(this);
        this._commandWindow.opacity = 0;
    };
//ここまで透明化処理--------------------------------------------------
// パラメータで設定した背景画像の読み込み


    // アイテム画面の背景画像読み込み
    var _Scene_Item_createBackground = Scene_Item.prototype.createBackground;
    Scene_Item.prototype.createBackground = function(){
        if(bgBitmapItem){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapItem);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_Item_createBackground.call(this);
    };
    //スキル画面の背景画像読み込み
    var _Scene_Skill_createBackground = Scene_Skill.prototype.createBackground;
    Scene_Skill.prototype.createBackground = function(){
        if(bgBitmapSkill){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapSkill);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無効の場合
        _Scene_Skill_createBackground.call(this);
    };
    //装備画面の背景画像読み込み
    var _Scene_Equip_createBackground = Scene_Equip.prototype.createBackground;
    Scene_Equip.prototype.createBackground = function(){
        if(bgBitmapEquip){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapEquip);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_Equip_createBackground.call(this);
    };
    //ステータス画面の背景画像読み込み
    var _Scene_Status_createBackground =
     Scene_Status.prototype.createBackground;
    Scene_Status.prototype.createBackground = function(){
        if(bgBitmapStatus){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapStatus);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_Status_createBackground.call(this);
    };
    //オプション画面の背景読み込み
    var _Scene_Options_createBackground =
     Scene_Options.prototype.createBackground;
    Scene_Options.prototype.createBackground = function(){
        if(bgBitmapOptions){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapOptions);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_Options_createBackground.call(this);
    };
    //セーブ画面の背景読み込み
    var _Scene_File_createBackground = Scene_File.prototype.createBackground;
    Scene_File.prototype.createBackground = function(){
        if(bgBitmapFile){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapFile);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_File_createBackground.call(this);
    };
    //終了画面の背景読み込み
    var _Scene_GameEnd_createBackground =
     Scene_GameEnd.prototype.createBackground;
    Scene_GameEnd.prototype.createBackground = function(){
        if(bgBitmapGameEnd){
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap =
             ImageManager.loadPicture(bgBitmapGameEnd);
            this.addChild(this._backgroundSprite);
            return;
        }
        // 背景ファイルが無い場合
        _Scene_GameEnd_createBackground.call(this);
    };

//ここまで背景の設置処理---------------------------------------------------

// メニュー画面に戻る処理----------------------------------------------
　　//コマンドメニューのウインドウ幅
    Window_MenuCommand.prototype.windowWidth = function() {
        return 250;
    };
	//コマンドメニューのウインドウ高さ
    Window_MenuCommand.prototype.windowHeight = function() {
        return 140;
    };	
　　//コマンドメニューの縦列数
    Window_MenuCommand.prototype.maxCols = function() {
        return 2;
    };
    //ステータスメニューのウインドウ幅
    Window_MenuStatus.prototype.windowWidth = function() {
        return 270;
    };
　　//ステータスメニューのウインドウ高さ
    Window_MenuStatus.prototype.windowHeight = function() {
        return 280;

    };

    Window_MenuStatus.prototype.maxRows = function() {
        return maxRowsMenuWnd;
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 4;
    };


//-------------------------------------------------------------------------------------
//ステータス画面へ差し込む画像の配置
    Window_MenuStatus.prototype.drawItemImage = function(index) {
		
//パーティーメンバー分処理を繰り返す為の処置
        var actor = $gameParty.members()[index];
		
//「rect」は四角形を作成する時に使うメソッドでこの場合
//テキストと同じ高さ、幅だけの四角を生成するって事かな？
//(index)は引数なのでメニュー項目のインデックス番号を参照して処理の中で使える様にするんだと思う。
        var rect = this.itemRectForText(index);
		
// 立ち絵を読み込ませる処置、ビットマップ名を変更してプロパティ値を変更する。
        var bitmapName = $dataActors[actor.actorId()].meta.stand_picture;
		  
//条件（三項）演算子。条件に基づいて 2 つの値のうち 1 つを選択します。
//イメージが用意されているか否かの判断。無い場合にnullで「空」の値を入れる。
        var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
		
//Math.minは引数として与えた複数の数の中で最小の数を返すので、()の中の条件演算子から
//最小の値をwとhに入れるって事だと思う。赤文字の部分で絵のサイズを指定。
        var w = Math.min(rect.width, (bitmapName ? bitmap.width : 230));
        var h = Math.min(rect.height, (bitmapName ? bitmap.height : 68));
//行の高さを設定（恐らく形式的なもの）
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
    };


//---------------------------------------------------------------------------

    Window_MenuStatus.prototype.drawItemStatus = function(index) {
		//[isDisplay～]は上で呼んだ、ステータスを表示するかしないかの設定項目
        if(!isDisplayStatus){
            return;
               }
		//PTメンバーの設定
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
		//lineheightは行の高さ（間隔）
        var lineHeight = this.lineHeight();
		//名前
        this.drawActorName(actor, x, y + lineHeight * 0, width-150);
        //レベル
		this.drawActorLevel(actor, x+90, y + lineHeight * 0, width);
        //HP
		this.drawActorHp(actor, x+130, y + lineHeight * 0, 90);
        //MP
		this.drawActorMp(actor, x+130, bottom - lineHeight * 1.1, 90);
		//バステ時に表示されるアイコンの位置
		this.drawActorIcons(actor, x, bottom - lineHeight * 1.3, width);
        
    };

    var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function() {
        _Window_MenuActor_initialize.call(this);
        this.y = this.fittingHeight(2);
    };

})();

//HPとMPゲージの表示を消す処理--------------------------------------------------
//他のスキルやアイテムウインドウにも適応するならWindow_Baseに変える事。

Window_MenuStatus.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};
Window_MenuStatus.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};
//----------------------------------------------------------------------------------


