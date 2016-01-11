//=============================================================================
// drowsepost Plugins - Zoom Controller
// DP_ZoomController.js
// Version: 0.21 beta
// canotun
//=============================================================================

var Imported = Imported || {};
Imported.DP_ZoomController = true;

var drowsepost = drowsepost || {};

//=============================================================================
 /*:
 * @plugindesc マップの拡大率を制御します。v0.2 beta20160111
 * @author drowsepost
 *
 * @param Base Scale
 * @desc 基本の拡大率を設定します。(0以上)
 * Default: 1
 * @default 1
 *
 * @param Encount Effect
 * @desc エンカウントエフェクトに拡大率を反映(ON: true / OFF: false)
 * Default: true
 * @default true
 *
 * @help
 * 各種座標処理に拡大率の計算を反映し
 * マップシーンの拡大率を制御します。
 * 
 * Base Scaleにはゲーム開始時の拡大倍率を指定します。
 * スクリプトコマンドにて
 * drowsepost.setZoom({倍率}, {変更速度}, {対象イベントIDまたはthis})を呼ぶと、
 * ゲーム中で画面の拡大率を変更できます。
 * 倍率には0以上を指定してください。
 * 
 * Encount Effectにはエンカウントエフェクトを置き換えるかどうかを指定します。
 * オリジナルのエフェクトで置き換えている場合はこちらをfalseにしてください。
 * しかしその場合、画面の拡大率をそれぞれ反映できるように調整する必要があります。
 * 現在の画面の拡大率は$gameScreen.zoomScale()で取得できます。
 * これはプラグインの利用に関わらず元から存在する関数です。
 * 指定された拡大率設定は$gameMap._userScaleが保持しています。
 * 
 * ===
 * このプラグインは試作品です。
 * いくつかのプライベートプロパティーを参照しているため、
 * 今後の本体アップデートで動作しなくなる可能性があります。
 * ご利用によって生じたいかなる問題の責任も負いかねます。
 * ===
 * 
 * ライセンス: 一部製品コードを含みます。
 * カドカワさま ツクールシリーズでのみ利用可能です。
 * 
 */
(function() {
    "use strict";
    var parameters = PluginManager.parameters('DP_ZoomController');
    var user_scale = Number(parameters['Base Scale'] || 1);
    var user_fix_encount = Boolean(parameters['Encount Effect'] === 'true' || false);
    
    /*
    Bug fix
    */
    var _Tilemap_createLayers = Tilemap.prototype._createLayers;
    Tilemap.prototype._createLayers = function() {
        /*
        TilemapのwidthやtileWidthを変更するたびにセッターにより_createLayersが呼ばれるが
        addChildした_lowerLayerおよび_upperLayerがremoveされないため
        参照できないゴミオブジェクトがcanvasに増えてゆくのでお掃除
        */
        if('_lowerLayer' in this) this.removeChild(this._lowerLayer);
        if('_upperLayer' in this) this.removeChild(this._upperLayer);
        _Tilemap_createLayers.call(this);
    };
    
    /*
    Game Map
    =============================================================================
    @use $gameScreen.zoomScale();
    拡大率の反映
    */
    (function(){
        var _Game_Map_initialize = Game_Map.prototype.initialize;
        Game_Map.prototype.initialize = function() {
            _Game_Map_initialize.call(this);
            this._userScale = user_scale;//Game_Mapに拡大率メンバー登録。
        };
        
        Game_Map.prototype.screenTileX = function() {
            return Graphics.width / (this.tileWidth() * $gameScreen.zoomScale());
        };
        
        Game_Map.prototype.screenTileY = function() {
            return Graphics.height / (this.tileHeight() * $gameScreen.zoomScale());
        };
        
        Game_Map.prototype.canvasToMapX = function(x) {
            var tileWidth = this.tileWidth() * $gameScreen.zoomScale();
            var originX = this._displayX * tileWidth;
            var mapX = Math.floor((originX + x) / tileWidth);
            return this.roundX(mapX);
        };

        Game_Map.prototype.canvasToMapY = function(y) {
            var tileHeight = this.tileHeight() * $gameScreen.zoomScale();
            var originY = this._displayY * tileHeight;
            var mapY = Math.floor((originY + y) / tileHeight);
            return this.roundY(mapY);
        };
    }());
    
    /*
    Game Player
    =============================================================================
    @use $gameScreen.zoomScale();
    @use $gameMap.setDisplayPos();
    拡大率の反映
    */
    (function(){
        
        Game_Player.prototype.centerX = function() {
            return (Graphics.width / ($gameMap.tileWidth() * $gameScreen.zoomScale()) - 1) / 2.0;
        };
        
        Game_Player.prototype.centerY = function() {
            return (Graphics.height / ($gameMap.tileHeight() * $gameScreen.zoomScale()) - 1) / 2.0;
        };
        
        Game_Player.prototype.center = function(x, y) {
            if(typeof x !== 'number') x = this._realX;
            if(typeof y !== 'number') y = this._realY;
            return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
        };
    }());
    
    /*
    Spriteset
    =============================================================================
    描画反映変更機能の追加
    */
    (function(){
        var tilemap_scale = 1;
        var _Spriteset_Map_createWeather = Spriteset_Map.prototype.createWeather;
        Spriteset_Map.prototype.createWeather = function() {
            _Spriteset_Map_createWeather.call(this);
            this._weather._rebornSprite = function(sprite) {
                sprite.ax = Math.randomInt(Math.ceil(Graphics.width / tilemap_scale) + 100) - 50 + this.origin.x;
                sprite.ay = Math.randomInt(Math.ceil(Graphics.height / tilemap_scale) + 200) - 100 + this.origin.y;
                sprite.opacity = 160 + Math.randomInt(60);
            };
        };
        
        var _Spriteset_Map_updateScreenSprites = Spriteset_Map.prototype.updateScreenSprites;
        Spriteset_Map.prototype.updateScreenSprites = function() {
            _Spriteset_Map_updateScreenSprites.call(this);
            
            //ScreenSpriteのリサイズ
            this._flashSprite.scale.x = 
            this._fadeSprite.scale.x = 
            this._weather._dimmerSprite.scale.x = Math.ceil(Graphics.width / tilemap_scale);
            
            this._flashSprite.scale.y = 
            this._fadeSprite.scale.y = 
            this._weather._dimmerSprite.scale.y = Math.ceil(Graphics.height / tilemap_scale);
            
        };
        
        Spriteset_Map.prototype._dp_Resize = function(zoom) {
            tilemap_scale = zoom;
            
            /*
            拡大率からレンダリングするべきマップのサイズを設定します。
            */
            this._tilemap.width = Math.ceil((Graphics.width + this._tilemap._margin) * 2 / zoom);
            this._tilemap.height = Math.ceil((Graphics.height + this._tilemap._margin) * 2 / zoom);
            
            //スプライトのプロパティーをいじったらrefresh(); *.･(^ω^)＊ 。サッパリ！
            this._tilemap.refresh();
            
            //パララックスサイズ変更
            this._parallax.move(0, 0, Math.round(Graphics.width / zoom), Math.round(Graphics.height / zoom));
        };
    }());
    
    /*
    Scene_Map
    =============================================================================
    @use $gameMap._userScale;
    @use _setZoom();
    拡大率の引継ぎ
    */
    (function(){
        var _Scene_Map_start = Scene_Map.prototype.start;
        Scene_Map.prototype.start = function() {
            _Scene_Map_start.call(this);
            _setZoom();//マップシーン開始時に拡大率変更をフック。
        };
        
        if(!user_fix_encount) return;
        Scene_Map.prototype.updateEncounterEffect = function() {
            if (this._encounterEffectDuration <= 0) return;
            
            this._encounterEffectDuration--;
            var speed = this.encounterEffectSpeed();
            var n = speed - this._encounterEffectDuration;
            var p = n / speed;
            
            var q = (((p - 1) * 20 * p + 5) * p + 1) * $gameMap._userScale;//変更部分。エンカウントエフェクトにオリジナル拡大率反映
            var zoomX = $gamePlayer.screenX();
            var zoomY = ($gamePlayer.screenY() - Math.floor($gameMap.tileHeight() / 2));//変更部分。タイルサイズ指定反映
            
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, $gameMap._userScale);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
            
        };
    }());
    
    /*
    Main Functions
    =============================================================================
    実際の拡大処理
    */
    var _target;
    var _isanimation = false;
    var _Game_Screen_updateZoom = Game_Screen.prototype.updateZoom;
    Game_Screen.prototype.updateZoom = function() {
        if ((this._zoomDuration > 0) && (_isanimation)) {
            $gamePlayer.center(_target._realX, _target._realY);
        }
        _Game_Screen_updateZoom.call(this);
        if ((this._zoomDuration == 0) && (_isanimation)) {
            _isanimation = false;
            _setZoom();
        }
    };
    
    var _changeRenderSize = function(scale) {
        if('_spriteset' in SceneManager._scene){
            SceneManager._scene._spriteset._dp_Resize(scale);
        }
        
    }
    
    var _setZoom = function() {
        if(typeof _target !== 'object') {
            console.log('drowsepost.setZoom: need Target', _target);
            _target = $gamePlayer;
        }
        _changeRenderSize($gameMap._userScale);
        $gameScreen.setZoom(0, 0, $gameMap._userScale);
        $gamePlayer.center(_target._realX, _target._realY);
        
        _target = $gamePlayer;
    };
    
    drowsepost.setZoom = function(ratio, duration, event) {
        _target = undefined;
        if(typeof event === 'number') {
            _target = $gameMap.event(event);
        } else if(typeof event === 'object') {
            if('_eventId' in event) {
                _target = $gameMap.event(event._eventId);
            }
        }
        
        if(typeof _target !== 'object'){
            _target = $gamePlayer;
        }
        
        if(typeof ratio === 'number') {
            if($gameMap._userScale > ratio){
                _changeRenderSize(ratio);
            }
            $gameMap._userScale = ratio;
        }
        
        if(duration > 0){
            $gamePlayer.center(_target._realX, _target._realY);
            $gameScreen.startZoom(0, 0, $gameMap._userScale, duration);
            _isanimation = true;
        } else {
            _setZoom();
        }
    };
}());
