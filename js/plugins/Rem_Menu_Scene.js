//============================
// FF1改造メニューシーン
//============================

//①Scene_Map.callMenu処理をオーバーライド
//マップ画面からメニューボタンを押すと「Scene_Map.callMenu」というメソッドが呼び出されます。
//なので、そのメソッドをオーバーライド(上書き)してしまいましょう。
Scene_Map.prototype.callMenu = function() {

    //②データベース側で設定されているOK処理の時のサウンドを鳴らす
    SoundManager.playOk();

    //③pushメソッドの引数に指定したシーンを呼び出す
	//シーンを呼び出すメソッドは2種類あります。
	//「SceneManager」モジュールに登録されている「push」と「goto」があります。
	//違いは、「push」はシーンの上にシーンを乗せるイメージです。
	//「push」で呼び出した後は、「pop」メソッドを使うと前のシーンに戻ることが可能です。
	//つまり、マップ画面からメニューを呼び出す等、閉じた時に前の画面に戻りたいときは
	//「push」を使います。「goto」はその名の通りシーンを変更します。
	//「pop」メソッドを呼び出しても前のシーンに戻る事は出来ません。
	//イメージ的にはニューゲームを押して次のシーンに移る等、キャンセルを押しても
	//前のシーンに戻さない時に使います。厳密に言うと違うかもしれませんが、
	//こういう感じで覚えておいてください。
    SceneManager.push(Rem_Menu_Scene);

    //④コンソール画面への出力(これはこの命令が呼ばれた際の確認用なのであってもなくても)
    console.log("改造メニューシーンを呼び出します。");
};

//=============================================================================
// Scene_Boot 初回ロード追加の為の「Scene_Boot.create」メソッドの再定義
//=============================================================================

//Scene_Bootが稼動した時に実行しているメソッド
Scene_Boot.prototype.create = function() {
    //ベースクラスに定義されているcreateメソッドの呼び出し ※
    Scene_Base.prototype.create.call(this);
    //データマネージャーモジュールのloadDatabaseメソッドの呼び出し ※
    DataManager.loadDatabase();
    //コンフィグマネージャーモジュールのloadメソッドの呼び出し　※
    ConfigManager.load();
    //システム用画像(ウィンドウスキンやらsystemフォルダに入っている画像の読み込み) ※
    this.loadSystemImages();
    
    //③ ①で作ったメソッドの呼び出し
    this.loadOriginalImages();
};

//① ③で読み込むオリジナル画像読み込みメソッド
Scene_Boot.prototype.loadOriginalImages = function() {

    //② 画像の読み込み
    ImageManager.loadSvActor('Actor1_1');
    ImageManager.loadSvActor('Actor1_8');
    ImageManager.loadSvActor('Actor3_8');
    ImageManager.loadSvActor('Actor2_7');
};



//=============================================================================
// Window_Base メソッド追加
//=============================================================================


//① ピクチャを読み込んで表示する関数
Window_Base.prototype.drawPicture = function(dir, filename,sx, sy, x, y, w, h, hue) {
   
    //② 画像の読み込み
    var bitmap = ImageManager.loadBitmap('img/'+ dir +'/', filename, hue, true);

    //③ 画像の転送
    this.contents.blt(bitmap, sx, sy, w, h, x,y);
};

//-----------------------------------------------------------------------------
// ⑤  Rem_Menu_Sceneクラスの定義
//ここで初めて新しいクラスを作成します。「function Rem_Menu_Scene()」と
//定義しているのがクラスだと思っていてください。
//(厳密にはJavaScriptにクラスの概念はないのですがわかりやすいように。)
//以下4項目については、こういう決まりなんだと思っていてください。
//最初に表示したいものなどは⑨に表記していく感じになります。
//-----------------------------------------------------------------------------

function Rem_Menu_Scene() {
    console.log("メニュー画面ガ呼び出されました。");
    this.initialize.apply(this, arguments);
}

//⑥オブジェクトの作成
Rem_Menu_Scene.prototype = Object.create(Scene_MenuBase.prototype);

//⑦オブジェクトが生成された時のコンストラクタ
Rem_Menu_Scene.prototype.constructor = Rem_Menu_Scene;

//⑧初期化
Rem_Menu_Scene.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

//⑨生成メソッド
Rem_Menu_Scene.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    
    //⑤　①で作ったウィンドウ生成関数を呼び出す
    this.createGoldWindow();
	this.createMenuWindow();
	this.createStatesWindow();
};

//所持金ウィンドウ作成関数
Rem_Menu_Scene.prototype.createGoldWindow = function() {

    //① Window_Goldクラスのオブジェクトを生成する
    this._goldWindow = new Window_Gold(546,15);
	
    //② ウィンドウをシーンに追加する
    this.addWindow(this._goldWindow);
};


//メニューウィンドウ生成
Rem_Menu_Scene.prototype.createMenuWindow = function() {

    //① メニューコマンド用のWindowクラスを作成
    this._menuWindow = new Window_MenuCommand(486,80,300,150);
    //② アイテムを選んだときの処理を指定
    this._menuWindow.setHandler('item',      this.commandItem.bind(this));
    //③ スキルを選んだときの処理を指定
    this._menuWindow.setHandler('skill',      this.commandSkill.bind(this));
    //④ 装備を選んだときの処理を指定
    this._menuWindow.setHandler('equip',      this.commandItem.bind(this));
    //⑤ ステータスを選んだときの処理を指定
    this._menuWindow.setHandler('status',     this.commandItem.bind(this));
    //⑥ 隊列を選んだときの処理を指定
    this._menuWindow.setHandler('formation',  this.commandItem.bind(this));
    //⑦ オプションを選んだときの処理を指定
    this._menuWindow.setHandler('options',    this.commandItem.bind(this));
    //⑧ セーブを選んだときの処理を指定
    this._menuWindow.setHandler('save',       this.commandItem.bind(this));
    //⑨ キャンセルを選んだときの処理を指定
    this._menuWindow.setHandler('cancel',    this.popScene.bind(this));

    this.addWindow(this._menuWindow);
}
//アイテムが選ばれた時の処理の内容
Rem_Menu_Scene.prototype.commandItem = function() {
    //アイテムウィンドウシーンを呼び出す
    SceneManager.push(Scene_Item);
};

//アイテムが選ばれた時の処理の内容
Rem_Menu_Scene.prototype.commandSkill = function() {
    //アイテムウィンドウシーンを呼び出す
    SceneManager.push(Scene_Skill);
};




//-----------------------------------------------------------------------------
// Window_Command　再定義

//① newされたときに呼び出されるwindowの横幅を書き換え
Window_MenuCommand.prototype.windowWidth = function() {
    return 200;
};

//② メニューコマンドに追加するコマンド群
Window_MenuCommand.prototype.makeCommandList = function() {
    //③ メインコマンドを追加
    this.addMainCommands();
    //④ 隊列コマンドを追加
    this.addFormationCommand();
    //⑤ ツクールデフォに入っていないオリジナルコマンドの追加
    this.addOriginalCommands();
    //⑥ オプションコマンドの追加
    this.addOptionsCommand();
    //⑦ セーブコマンドの追加
    this.addSaveCommand();
    //⑧ ゲームエンドコマンドを追加
    //this.addGameEndCommand();
};

//ステータスウィンドウ生成
Rem_Menu_Scene.prototype.createStatesWindow = function() {

    //①ウィンドウの幅と高さを決める
    state_width = 280;
    state_height = 62;

    //① 1つの配列に4人分のウィンドウ情報を保持しておく

	    var ac = [
        new Window_Base(506,240,state_width,state_height),
        new Window_Base(506,302,state_width,state_height),
        new Window_Base(506,364,state_width,state_height),
        new Window_Base(506,426,state_width,state_height)
    ];
	

    //② シーンにWindowクラスをループで追加
    for (var i=0; i<ac.length; i++) { this.addWindow(ac[i]); }

    //③ オリジナルメソッドでループで現在のキャラクター分のステータスを描写
    Window_Base.prototype.drawActorsStatus_t(ac);
};

//=============================================================================
// Window_Base メソッド追加
//=============================================================================

//現在の仲間数分のキャラクター情報描写
Window_Base.prototype.drawActorsStatus_t = function(ac) {

    //人数分の描写
    for (var i=0; i<$gameParty.size(); i++)
    {
        //名前,表示位置X,Y,フォント幅
        ac[i].drawText($gameParty.battleMembers()[i]._name,0,-8,50);
        //Lv

        ac[i].drawText("Lv "+$gameParty.battleMembers()[i]._level,0,12,20);
		

        //HPテキスト描写
        ac[i].drawText("HP", 65,-8);
        //HP数値を描写
        ac[i].drawText($gameParty.battleMembers()[i].hp, 90,-8);
        //最大HPを描写
        ac[i].drawText("/"+$gameParty.battleMembers()[i].mhp, 120,-8);

        //MPテキスト描写
        ac[i].drawText("MP", 65,15);
        //MP数値を描写
        ac[i].drawText($gameParty.battleMembers()[i].mp, 90,15);
        //最大MPを描写
        ac[i].drawText("/"+$gameParty.battleMembers()[i].mmp, 120,15);
        //キャラクター描写
        ac[i].drawPicture("sv_actors",$gameParty.battleMembers()[i]._battlerName, 64,0,200,-1,64,64);
    }

};
//ピクチャ表示
Window_Base.prototype.drawPicture = function(dir, filename,sx, sy, x, y, w, h, hue) {
    var bitmap = ImageManager.loadBitmap('img/'+ dir +'/', filename, hue, true);
    this.contents.blt(bitmap, sx, sy, w, h, x,y); 

};



