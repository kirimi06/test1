//=============================================================================
// CustomMenuCommand.js
//=============================================================================
 
/*:
 * @plugindesc メニューコマンドを画像化＋ロールオーバー
 * @author 翠
 * @help img/systemフォルダに各種使用する画像を入れてください。
 *  command_e
 *  command_h
 *  command_d
 *  初期設定ではこの３つを使用します。個別に変更する場合は各自追加してください。
 * @param ■画像設定■
 * @desc 
 * @default
 * 
 * @param 詳細化:基礎
 * @desc true / false で画像名の取得を変更します。
 * true:"command_e_" + index, false:"command_e"
 * @default false
 * 
 * @param 詳細化:選択時
 * @desc true / false で画像名の取得を変更します。
 * true:"command_h_" + index, false:"command_h"
 * @default false
 * 
 * @param 詳細化:選択不可時
 * @desc true / false で画像名の取得を変更します。
 * true:"command_d_" + index, false:"command_d"
 * @default false
 * 
 * @param ■使用スプライト設定■
 * @desc 
 * @default
 * 
 * @param コマンド画像:選択時
 * @desc 
 * @default true
 * 
 * @param コマンド画像:選択不可時
 * @desc 
 * @default true
 * 
 * @param メインテキスト:基礎
 * @desc 
 * @default true
 * 
 * @param メインテキスト:選択時
 * @desc 
 * @default true
 * 
 * @param サブテキスト:基礎
 * @desc サブテキストを使用する場合、下部にあるサブテキストを設定してください
 * @default true
 * 
 * @param サブテキスト:選択時
 * @desc 
 * @default true
 * 
 * @param ■基本座標設定■
 * @desc 
 * @default
 * 
 * @param 座標設定X
 * @desc コマンドが描画されるX座標
 * @default 0
 * 
 * @param 座標設定Y
 * @desc コマンドが描画されるY座標
 * @default 10
 * 
 * @param メインテキストX
 * @desc X座標調整
 * @default 0
 *
 * @param メインテキストY
 * @desc Y座標調整
 * @default -5
 *
 * @param サブテキストX
 * @desc X座標調整
 * @default 0
 *
 * @param サブテキストY
 * @desc Y座標調整
 * @default 10
 * 
 * @param ■メニュー表示形式による座標■
 * @desc 
 * @default
 * 
 * @param 表示形式
 * @desc 0:縦,1:横,2:カスタム
 * カスタムの場合、表示位置を設定してください 
 * @default 0
 * 
 * @param 項目毎のスペース:縦
 * @desc 画像の縦幅+任意の値を記述してください
 * @default 50
 * 
 * @param 項目毎のスペース:横
 * @desc 画像の横幅+任意の値を記述してください
 * @default 0
 * 
 * @param ▼メニューの表示形式が縦の場合のみ
 * @desc
 * @default
 *  
 * @param 横表示の折り返し地点
 * @desc 幾つ目のコマンドで2行目にするか
 * 指定数 +1の所で2段目に表示されます 
 * @default 3
 * 
 * @param 2段目のY座標
 * @desc 
 * @default 50
 * 
 * @param 2段目のX座標
 * @desc 例:0の場合一つ目のコマンドと同じ位置となる。1なら二つ目の位置
 * @default 0
 * 
 * @param 2段目のX座標補正
 * @desc 2段目のX座標に指定した数値分変動する
 * @default 40
 * 
 * @param ▲メニューの表示形式が縦の場合のみ
 * @desc
 * @default
 * 
 * @param ■メインテキスト設定■
 * @desc 
 * @default
 *  
 * @param テキストカラー:基礎
 * @desc  
 * @default #FFFFFF
 *
 * @param テキストカラー:選択時
 * @desc  
 * @default #40E0D0
 *
 * @param テキストカラー:選択不可時
 * @desc  
 * @default #A9A9A9
 *
 * @param フォントサイズ:メイン
 * @desc
 * @default 23
 *
 * @param 文字寄席:メイン
 * @desc left / center / right
 * @default center
 *
 * @param ■サブテキスト設定■
 * @desc 
 * @default
 *  
 * @param サブテキストカラー:基礎
 * @desc  
 * @default #FFFFFF
 *
 * @param サブテキストカラー:選択時
 * @desc  
 * @default #40E0D0
 *
 * @param サブテキストカラー:選択不可時
 * @desc  
 * @default #A9A9A9
 *
 * @param フォントサイズ:サブ
 * @desc
 * @default 18
 *
 * @param 文字寄席:サブ
 * @desc left / center / right
 * @default center
 * 
 * @param サブ名称1
 * @desc 
 * @default -Item-
 * 
 * @param サブ名称2
 * @desc 
 * @default -Skill-
 *   
 * @param サブ名称3
 * @desc 
 * @default -Equip-
 *   
 * @param サブ名称4
 * @desc 
 * @default -Status-
 *   
 * @param サブ名称5
 * @desc 
 * @default -Formation-
 *   
 * @param サブ名称6
 * @desc 
 * @default -Option-
 *   
 * @param サブ名称7
 * @desc 
 * @default -Save-
 *   
 * @param サブ名称8
 * @desc 
 * @default -Game End-
 *   
 * @param サブ名称9
 * @desc 予備
 * @default 
 *   
 * @param サブ名称10
 * @desc 予備
 * @default 
 * 
 * @param ▼メニューの表示形式がカスタムの場合のみ
 * @desc 項目が10個以上の場合はスクリプトを改造してください。
 * @default
 *  
 * @param コマンド1X
 * @desc 
 * @default 50
 * 
 * @param  コマンド1Y
 * @desc 
 * @default 100
 *  
 * @param コマンド2X
 * @desc 
 * @default 150
 * 
 * @param  コマンド2Y
 * @desc 
 * @default 20
 *  
 * @param コマンド3X
 * @desc 
 * @default 20
 * 
 * @param  コマンド3Y
 * @desc 
 * @default 300
 *  
 * @param コマンド4X
 * @desc 
 * @default 200
 * 
 * @param  コマンド4Y
 * @desc 
 * @default 50
 *  
 * @param コマンド5X
 * @desc 
 * @default 600
 * 
 * @param  コマンド5Y
 * @desc 
 * @default 250
 *  
 * @param コマンド6X
 * @desc 
 * @default 60
 * 
 * @param  コマンド6Y
 * @desc 
 * @default 300
 *  
 * @param コマンド7X
 * @desc 
 * @default 80
 * 
 * @param  コマンド7Y
 * @desc 
 * @default 400
 *  
 * @param コマンド8X
 * @desc 
 * @default 800
 * 
 * @param  コマンド8Y
 * @desc 
 * @default 600
 *  
 * @param コマンド9X
 * @desc 
 * @default 0
 * 
 * @param  コマンド9Y
 * @desc 
 * @default 0
 *  
 * @param コマンド10X
 * @desc 
 * @default 0
 * 
 * @param  コマンド10Y
 * @desc 
 * @default 0
 * 

*/
var MousePos = TouchInput._setupEventHandlers
TouchInput._setupEventHandlers = function() {
	MousePos.call(this);
    document.addEventListener('mousemove', this._menuMousePosMove.bind(this));
};
TouchInput._menuMousePosMove = function(event) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
};
(function(){
	var parameters  = PluginManager.parameters('CustomMenuCommand');
	var img_e_detailed = String(parameters['詳細化:基礎']);
	var img_h_detailed = String(parameters['詳細化:選択時']);
	var img_d_detailed = String(parameters['詳細化:選択不可時']);
    var h_img_flg    = String(parameters['コマンド画像:選択時']);
    var d_img_flg    = String(parameters['コマンド画像:選択不可時']);
	var mt_text_flg    = String(parameters['メインテキスト:基礎']);
	var mh_text_flg    = String(parameters['メインテキスト:選択時']);
	var st_text_flg    = String(parameters['サブテキスト:基礎']);
	var sh_text_flg    = String(parameters['サブテキスト:選択時']);
	var base_x     = Number(parameters['座標設定X']);
	var base_y     = Number(parameters['座標設定Y']);
	var tm_base_x     = Number(parameters['メインテキストX']);
	var tm_base_y     = Number(parameters['メインテキストY']);
	var sm_base_x     = Number(parameters['サブテキストX']);
	var sm_base_y     = Number(parameters['サブテキストY']);
	var menu_style   = Number(parameters['表示形式']);
	var space_x     = Number(parameters['項目毎のスペース:横']);
	var space_y     = Number(parameters['項目毎のスペース:縦']);
	var return_sec  = Number(parameters['横表示の折り返し地点']);
	var line_y      = Number(parameters['2段目のY座標']);
	var line_pos    = Number(parameters['2段目のX座標']);
	var line_x      = Number(parameters['2段目のX座標補正']);
	var me_str_color = String(parameters['テキストカラー:基礎']);
	var mh_str_color = String(parameters['テキストカラー:選択時']);
	var md_str_color = String(parameters['テキストカラー:選択不可時']);
	var m_fontsize   = Number(parameters['フォントサイズ:メイン']);
	var m_alignment  = String(parameters['文字寄席:メイン']);
	var se_str_color = String(parameters['サブテキストカラー:基礎']);
	var sh_str_color = String(parameters['サブテキストカラー:選択時']);
	var sd_str_color = String(parameters['サブテキストカラー:選択不可時']);
	var s_fontsize   = Number(parameters['フォントサイズ:サブ']);
	var s_alignment  = String(parameters['文字寄席:サブ']);
	var c_command_posx1   = Number(parameters['コマンド1X']);
	var c_command_posx2   = Number(parameters['コマンド2X']);
	var c_command_posx3   = Number(parameters['コマンド3X']);
	var c_command_posx4   = Number(parameters['コマンド4X']);
	var c_command_posx5   = Number(parameters['コマンド5X']);
	var c_command_posx6   = Number(parameters['コマンド6X']);
	var c_command_posx7   = Number(parameters['コマンド7X']);
	var c_command_posx8   = Number(parameters['コマンド8X']);
	var c_command_posx9   = Number(parameters['コマンド9X']);
	var c_command_posx10  = Number(parameters['コマンド10X']);
	var c_command_posy1   = Number(parameters['コマンド1Y']);
	var c_command_posy2   = Number(parameters['コマンド2Y']);
	var c_command_posy3   = Number(parameters['コマンド3Y']);
	var c_command_posy4   = Number(parameters['コマンド4Y']);
	var c_command_posy5   = Number(parameters['コマンド5Y']);
	var c_command_posy6   = Number(parameters['コマンド6Y']);
	var c_command_posy7   = Number(parameters['コマンド7Y']);
	var c_command_posy8   = Number(parameters['コマンド8Y']);
	var c_command_posy9   = Number(parameters['コマンド9Y']);
	var c_command_posy10  = Number(parameters['コマンド10Y']);	
    var s_name1    = String(parameters['サブ名称1']);
    var s_name2    = String(parameters['サブ名称2']);
    var s_name3    = String(parameters['サブ名称3']);
    var s_name4    = String(parameters['サブ名称4']);
    var s_name5    = String(parameters['サブ名称5']);
    var s_name6    = String(parameters['サブ名称6']);
    var s_name7    = String(parameters['サブ名称7']);
    var s_name8    = String(parameters['サブ名称8']);
    var s_name9    = String(parameters['サブ名称9']);
    var s_name10   = String(parameters['サブ名称10']);
	var m_command_base = [
		[c_command_posx1,c_command_posy1],
		[c_command_posx2,c_command_posy2],
		[c_command_posx3,c_command_posy3],
		[c_command_posx4,c_command_posy4],
		[c_command_posx5,c_command_posy5],
		[c_command_posx6,c_command_posy6],
		[c_command_posx7,c_command_posy7],
		[c_command_posx8,c_command_posy8],
		[c_command_posx9,c_command_posy9],
		[c_command_posx10,c_command_posy10]
	];
    var s_names = [
	s_name1,
	s_name2,
	s_name3,
	s_name4,
	s_name5,
	s_name6,
	s_name7,
	s_name8,
	s_name9,
	s_name10
	];
var createMWindow = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function() {
    createMWindow.call(this);
	this.initParams();
    this.createSprites();
    this.windowhide();
};

Scene_Menu.prototype.initParams = function(size) {
    this._command_Esprite  = [];
    this._command_Hsprite  = [];
    this._command_Dsprite  = [];
    this._command_Tsprite  = [];
    this._command_Csprite  = [];
    this._command_Ssprite  = [];
    this._command_Bsprite  = [];
    this._command_Epointer = [];
    this._command_Hpointer = [];
    this._command_Index = [];
	this._command_Pos = [];
    this._zoomScale = 0;
    this.upDate = false;
	this._lastSelect = null;
	this._indexOut = false;
};
Scene_Menu.prototype.createSprites = function() {
	var posimg = 0;
	var sx = 0;
	var sy = 0;
	var list = this._commandWindow._list;
	var img_name = (img_e_detailed == 'true')? 'command_e_'+ sindex : 'command_e';
	for (i = 0; i < list.length; i++){
	    this._command_Esprite[i]  = new Sprite();
		this.addChild(this._command_Esprite[i]);
		if(menu_style == 0){
			sx = base_x + (space_x * i);
			sy = base_y + (space_y * i);
		}else if(menu_style == 1){
			sx = base_x + (space_x * i);
			sy = base_y;
			if (i > return_sec) {
				sy += line_y;
				sx = line_x + (this._command_Esprite[line_pos].x + (space_x * posimg));
				posimg += 1;
			}
		}else{
			sx = m_command_base[i][0];
			sy = m_command_base[i][1];
		}
		this._command_Esprite[i].x = sx;
		this._command_Esprite[i].y = sy;
		//Bitmap
		this._command_Esprite[i].bitmap  = ImageManager.loadSystem(img_name);

		this.createHsprite(i,sx,sy);
		this.createDsprite(i,sx,sy,list[i].enabled);
		
		this.createTsprite(i,sx,sy,list[i].name,list[i].enabled);
		this.createCsprite(i,sx,sy,list[i].name);
		this.createSsprite(i,sx,sy,list[i].enabled);
		this.createBsprite(i,sx,sy);
		//判別用
		this._command_Index[i] = i;
	};
};

Scene_Menu.prototype.createHsprite = function(sindex,sx,sy) {
	if (h_img_flg == 'false') return;
	var img_name = (img_h_detailed == 'true')? 'command_h_'+ sindex : 'command_h';
   	this._command_Hsprite[sindex]  = new Sprite();
	this.addChild(this._command_Hsprite[sindex]);
	this._command_Hsprite[sindex].x = sx;
	this._command_Hsprite[sindex].y = sy;
	this._command_Hsprite[sindex].bitmap  = ImageManager.loadSystem(img_name);
	this._command_Hsprite[sindex].opacity = 0;
};
Scene_Menu.prototype.createDsprite = function(sindex,sx,sy,enable) {
	if (d_img_flg == 'false') return;
	var img_name = (img_d_detailed == 'true')? 'command_d_'+ sindex : 'command_d';
   	this._command_Dsprite[sindex]  = new Sprite();
	this.addChild(this._command_Dsprite[sindex]);
	this._command_Dsprite[sindex].x = sx;
	this._command_Dsprite[sindex].y = sy;
	this._command_Dsprite[sindex].bitmap  = ImageManager.loadSystem(img_name);
	this._command_Dsprite[sindex].opacity = (enable == true)? 0 : 255;
};
Scene_Menu.prototype.createTsprite = function(sindex,sx,sy,lname,enable) {
	if (mt_text_flg == 'false') return;
	this._command_Tsprite[sindex]  = new Sprite(new Bitmap(200, 100));
	this.addChild(this._command_Tsprite[sindex]);
	this._command_Tsprite[sindex].x = sx + tm_base_x;
	this._command_Tsprite[sindex].y = sy + tm_base_y;
	this._command_Tsprite[sindex].bitmap.fontSize = m_fontsize;
	this._command_Tsprite[sindex].bitmap.textColor = (enable == true)? me_str_color : md_str_color;
	this._command_Tsprite[sindex].bitmap.drawText(lname, 0, 0, 200, 48, m_alignment);
};
Scene_Menu.prototype.createCsprite = function(sindex,sx,sy,lname) {
	if (mh_text_flg == 'false') return;
	this._command_Csprite[sindex]  = new Sprite(new Bitmap(200, 100));
	this.addChild(this._command_Csprite[sindex]);
	this._command_Csprite[sindex].x = sx + tm_base_x;
	this._command_Csprite[sindex].y = sy + tm_base_y;
	this._command_Csprite[sindex].bitmap.fontSize = m_fontsize;
	this._command_Csprite[sindex].bitmap.textColor = mh_str_color;
	this._command_Csprite[sindex].bitmap.drawText(lname, 0, 0, 200, 48, m_alignment);
	this._command_Csprite[sindex].opacity =  0
};
Scene_Menu.prototype.createSsprite = function(sindex,sx,sy,enable) {
	if (st_text_flg == 'false') return;
	this._command_Ssprite[sindex]  = new Sprite(new Bitmap(200, 100));
	this.addChild(this._command_Ssprite[sindex]);
	this._command_Ssprite[sindex].x = sx + sm_base_x;
	this._command_Ssprite[sindex].y = sy + sm_base_y;
	this._command_Ssprite[sindex].bitmap.fontSize = s_fontsize;
	this._command_Ssprite[sindex].bitmap.textColor = (enable == true)? se_str_color : sd_str_color;
	this._command_Ssprite[sindex].bitmap.drawText(s_names[sindex], 0, 0, 200, 48, s_alignment);
};
Scene_Menu.prototype.createBsprite = function(sindex,sx,sy) {
	if (sh_text_flg == 'false') return;
	this._command_Bsprite[sindex]  = new Sprite(new Bitmap(200, 100));
	this.addChild(this._command_Bsprite[sindex]);
	this._command_Bsprite[sindex].x = sx + sm_base_x;
	this._command_Bsprite[sindex].y = sy + sm_base_y;
	this._command_Bsprite[sindex].bitmap.fontSize = s_fontsize;
	this._command_Bsprite[sindex].bitmap.textColor = sh_str_color;
	this._command_Bsprite[sindex].bitmap.drawText(s_names[sindex], 0, 0, 200, 48, s_alignment);
	this._command_Bsprite[sindex].opacity =  0
};

Scene_Menu.prototype.reSizeScale = function() {
	if (this._zoomScale != Graphics._realScale){
		this._zoomScale = Graphics._realScale
		this.upDate = 'false';
	}
};
Scene_Menu.prototype.setPos = function() {
	if (this._command_Esprite[0].bitmap.width <= 0 || this._command_Esprite[0].bitmap <= 0) return;
	if (this.upDate == 'true') return;
	for (i = 0; i < this._commandWindow._list.length; i++){
		this._command_Pos[i] =  [
			this._command_Esprite[i].x * this._zoomScale,
			this._command_Esprite[i].y * this._zoomScale,
			this._command_Esprite[i].bitmap.width * this._zoomScale,
			this._command_Esprite[i].bitmap.height * this._zoomScale,
			this._command_Esprite[i].index = i,
			this._slideBace + this._command_Esprite[i].x * this._zoomScale
		];
	};
	this.upDate = 'true'
};
Scene_Menu.prototype.isTriggered = function () {
    if (TouchInput.isTriggered()){
	    this._commandWindow._lastCommandSymbol = this._commandWindow.currentSymbol();
	    this._commandWindow.processOk();
    };
};
Scene_Menu.prototype.checkPointer = function (i) {
	var xx = TouchInput.x * this._zoomScale;
	var yy = TouchInput.y * this._zoomScale;
	
	return xx >= this._command_Pos[i][0] && xx <= this._command_Pos[i][0] + this._command_Pos[i][2] &&
		   yy >= this._command_Pos[i][1] && yy <= this._command_Pos[i][1] + (this._command_Pos[i][3] - (10 * this._zoomScale ))
};


Scene_Menu.prototype.changeHMOpacity = function (data,arr,pm) {
    if (h_img_flg == 'false') return;
    if (this._commandWindow._list[arr].enabled == false) return;
    if (pm == 0){
  	  data[arr].opacity += 25;
    }else{
      data[arr].opacity -= 25;
    }
};
Scene_Menu.prototype.changeHTOpacity = function (data,arr,pm) {
    if (mh_text_flg == 'false') return;
    if (this._commandWindow._list[arr].enabled == false) return;
    if (pm == 0){
  	  data[arr].opacity += 25;
    }else{
      data[arr].opacity -= 25;
    }
};
Scene_Menu.prototype.changeSTOpacity = function (data,arr,pm) {
    if (sh_text_flg == 'false') return;
    if (this._commandWindow._list[arr].enabled == false) return;
    if (pm == 0){
  	  data[arr].opacity += 25;
    }else{
      data[arr].opacity -= 25;
    }
};

Scene_Menu.prototype.updatecommand = function() {
	var xx = TouchInput.x * this._zoomScale;
	var yy = TouchInput.y * this._zoomScale;
	for (i = 0; i < this._commandWindow._list.length; i++){
		if(this.checkPointer(i)) {
			if (this._lastSelect != this._command_Pos[i][4]) SoundManager.playCursor();
				this._lastSelect = this._command_Pos[i][4];
				this.isTriggered();
				this._commandWindow.select(this._lastSelect);
				this.changeHMOpacity(this._command_Hsprite,this._command_Pos[i][4],0)
				this.changeHTOpacity(this._command_Csprite,this._command_Pos[i][4],0)
				this.changeSTOpacity(this._command_Bsprite,this._command_Pos[i][4],0)
				this._indexOut = true;
		}else{
			if (this._commandWindow.index() == i) {
				this.changeHMOpacity(this._command_Hsprite,this._commandWindow.index(),0)
				this.changeHTOpacity(this._command_Csprite,this._commandWindow.index(),0)
				this.changeSTOpacity(this._command_Bsprite,this._commandWindow.index(),0)
			}else{
				this.changeHMOpacity(this._command_Hsprite,this._command_Pos[i][4],1)
				this.changeHTOpacity(this._command_Csprite,this._command_Pos[i][4],1)
				this.changeSTOpacity(this._command_Bsprite,this._command_Pos[i][4],1)
			}
		}
	}
};
Scene_Menu.prototype.update = function() {
    this.reSizeScale();
    this.setPos();
	if (this.upDate == 'true'){
		this.updatecommand();
	}
    Scene_Base.prototype.update.call(this);
};
Scene_Menu.prototype.windowhide = function() {
	this._commandWindow.x = 9999;
    this._commandWindow.hide();
};
})();