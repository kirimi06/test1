//=============================================================================
// 【常駐所持金ウィンドウ】　Version: 1.00
//
// ここからリスポーン: http://respawnfromhere.blog.fc2.com/
// Twitter: https://twitter.com/ibakip
//
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc マップに常駐する所持金ウィンドウを生成します。
 * ※画像を使用しない場合はWindow_Pictueを空欄にして下さい。
 * @author ResidentGoldWindow
 *
 * @param Gold_Window_x
 * @desc 所持金ウィンドウを表示するx座標です。
 * 0 を指定すると自動的に位置を決定します。
 * @default 0
 *
 * @param Gold_Window_y
 * @desc 所持金ウィンドウを表示するy座標です。
 * 0 を指定すると自動的に位置を決定します。
 * @default 550
 *
 * @param Gold_Window_width
 * @desc 所持金ウィンドウの横幅です。
 * 0 を指定すると自動的に幅を決定します。
 * @default 0
 *
 * @param Gold_Window_height
 * @desc 所持金ウィンドウの縦幅です。
 * 0 を指定すると自動的に幅を決定します。
 * @default 60
 *
 * @param Gold_Window_type
 * @desc 所持金ウィンドウのタイプを選択します。
 * 0：通常ウィンドウ 1：黒背景ウィンドウ 2:ウィンドウ無し
 * @default 0
 *
　* @param Window_Pictue
 * @desc 所持金ウィンドウの背景に画像を使用します。
 * 画像をimg/picturesに入れて、ファイル名を指定して下さい。
 * @default RGW
 *
 * @param Icon_Number
 * @desc 所持金ウィンドウに描画するアイコンを選択します。
 * 0 を指定するとアイコンは使わず単位を描画します。
 * @default 314
 *
 * @param Padding_Width
 * @desc 所持金ウィンドウの横方向の余白を調整します。
 * @default 10
 *
 *
 * @help　※ このプラグインには、プラグインコマンドはありません。
 *
 * //=============================================================================
 * // 【常駐所持金ウィンドウ】　Version: 1.00
 * //
 * // ここからリスポーン: http://respawnfromhere.blog.fc2.com/
 * // Twitter: https://twitter.com/ibakip
 * //
 * //=============================================================================
 *
 * マップ画面に常駐する所持金ウィンドウを生成します。
 *
 * ウィンドウ表示位置の変更
 *  ・ Gold_Window_x
 *  ・ Gold_Window_y
 *  ※それぞれ 0 を指定すると自動的に位置が決定されます。
 *
 * ウィンドウ幅の変更
 *  ・ Gold_Window_width
 *  ・ Gold_Window_height
 *  ※それぞれ 0 を指定すると自動的に幅が決定されます。
 *
 * ウィンドウタイプの変更
 *  ・ Gold_Window_type
 *   0： 通常ウィンドウ   1： 黒背景ウィンドウ   2: ウィンドウ無し
 *  ※画像を使用する場合（Window_Pictueが空欄でない場合）は無視されます。
 *
 * ウィンドウに用いる画像の変更
 *  ・ Window_Picture
 *  画像を使用する場合はimg/picturesに画像を入れて、ファイル名を指定して下さい。
 *  ※画像を使用しない場合は必ず空欄にして下さい。
 *
 * 描画するアイコン画像の変更
 *  ・ Icon_Number
 *  所持金ウィンドウに描画するアイコンの番号を指定して下さい。
 *   0 を指定するとアイコンは使わずお金の単位を描画します。
 *
 * ウィンドウの横方向の余白の調整
 *  ・ Padding_Width
 *  画像を使用したりウィンドウサイズを変更した際の調整用です。
 *
 *
 */
 //=============================================================================


 var Parameters = PluginManager.parameters('ResidentGoldWindow');
 var RGW_x      = Number(Parameters['Gold_Window_x'] || 0);
 var RGW_y      = Number(Parameters['Gold_Window_y'] || 0);
 var RGW_width  = Number(Parameters['Gold_Window_width'] || 0);
 var RGW_height = Number(Parameters['Gold_Window_height'] || 0);
 var RGW_type   = Number(Parameters['Gold_Window_type'] || 0);
 var RGW_pic    = Parameters['Window_Pictue'] || "";
 var RGW_icon   = Number(Parameters['Icon_Number'] || 0);
 var RGW_paddingWidth    = Number(Parameters['Padding_Width'] || 0);


//-----------------------------------------------------------------------------
// Window_ResidentGold
//-----------------------------------------------------------------------------
/* マップ画面に常駐する所持金ウィンドウを扱うクラスです */

function Window_ResidentGold() {
    this.initialize.apply(this, arguments);
}

Window_ResidentGold.prototype = Object.create(Window_Gold.prototype);
Window_ResidentGold.prototype.constructor = Window_ResidentGold;

Window_ResidentGold.prototype.initialize = function(x, y) {
    Window_Gold.prototype.initialize.call(this, x, y);
    this.refresh();
};

Window_ResidentGold.prototype.refresh = function(){
    this.last_gold = $gameParty.gold();
    var x = this.textPadding() + RGW_paddingWidth;
    var y = (this.contentsHeight() - Window_Base.prototype.lineHeight() ) / 2;
    var icon_y = (this.contentsHeight() - Window_Base._iconWidth) / 2;
    var width = this.contentsWidth();
    this.contents.clear();
    if(RGW_pic){
        this.drawBackground.call(this);
    }
    if(RGW_icon == 0){
        this.drawCurrencyValue(this.value(), TextManager.currencyUnit, -x, y, width);
    }else{
        this.drawText(this.value(), x, y, this.contentsWidth()-x*2, 'right');
        this.drawIcon(RGW_icon, x, icon_y);
    }
};

Window_ResidentGold.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if(this.last_gold != $gameParty.gold()) {
        this.refresh();
    }
};

Window_ResidentGold.prototype.open = function() {
    this.refresh();
    Window_Gold.prototype.open.call(this);
};

Window_ResidentGold.prototype.contentsWidth = function() {
    if(RGW_width == 0){
        return this.width;
    }else{
        return RGW_width;
    }
};

Window_ResidentGold.prototype.contentsHeight = function() {
    if(RGW_height == 0){
        return this.height;
    }else{
        return RGW_height;
    }
};

Window_ResidentGold.prototype.drawBackground = function() {
    var bitmap = ImageManager.loadPicture(RGW_pic, 0);
    var pw = this.contentsWidth();
    var ph = this.contentsHeight();
    this.contents.blt(bitmap, 0, 0, pw, ph, 0, 0);
};


//-----------------------------------------------------------------------------
// Scene_Map
//-----------------------------------------------------------------------------

var scene_map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    scene_map_start.call(this);
    this.gold_window.open();
};

Scene_Map.prototype.createResidentGoldWindow = function(){
    this.gold_window = new Window_ResidentGold(this);
    if(RGW_width != 0){
        this.gold_window.width = RGW_width;
    }else{
        this.gold_window.width = 240;
    }
    if(RGW_height != 0){
        this.gold_window.height = RGW_height;
    }else{
        this.gold_window.height = 36 + Window_Base.prototype.standardPadding.call(this.gold_window) * 2;
    }
    if(RGW_x != 0){
        this.gold_window.x = RGW_x;
    }else{
        this.gold_window.x = Graphics.boxWidth - this.gold_window.width;
    }
    if(RGW_y != 0){
        this.gold_window.y = RGW_y;
    }else{
        this.gold_window.y = Graphics.boxHeight - this.gold_window.height;
    }
    this.gold_window.padding = 0;
    this.gold_window.openness = 0;
    if(RGW_pic != ""){
        this.gold_window.setBackgroundType(2);
    }else{
        this.gold_window.setBackgroundType(RGW_type);
    }
    this.addWindow(this.gold_window);
};

var scene_map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    scene_map_createAllWindows.call(this);
    this.createResidentGoldWindow(this);
};

var scene_map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
    scene_map_stop.call(this);
    this.gold_window.openness = 0;
};

