//=============================================================================
// FaceChatBase.js
//=============================================================================

/*:
 * @plugindesc Add to Face chat system like a "Tales of" series.
 * @author Shio_inu
 *
 *
 * @param Face size
 * @desc 顔グラフィックのサイズです。
 * @default 128
 *
 * @param Margin
 * @desc 顔グラフィック同士の間隔の広さです。
 * @default 32
 *
 * @param Eye Anim Num
 * @desc まばたきの枚数です。
 * @default 3
 *
 * @param Mouse Anim Num
 * @desc 口パクの枚数です。
 * @default 4
 *
 * @param File Name
 * @desc フェイスチャットに使用するファイル名です。
 * @default face01,face02,face03

 * @help
 *
 * プラグインコマンド:
 *   FaceChat start 1,2,3,4         # キャラクター1,2,3,4によるフェイスチャット（タイトルなし）を開始する
 *   FaceChat start 5,6,7,8 雑談    # キャラクター5,6,7,8によるフェイスチャット（タイトル「雑談」）を開始する
 *   FaceChat talk 1,2              # キャラクター1,2がしゃべる（口パクアニメーションの再生）
 *   FaceChat emotion 2 4           # キャラクター2の表情を4番に変更
 *   FaceChat balloon 3 8           # キャラクター3に8番の吹き出しを表示
 *   FaceChat animation 4 5         # キャラクター4に5番のモーションを再生
 *   FaceChat emotionAll 1,1,2,3    # キャラクターの表情を一括設定
 *   FaceChat add 5                 # キャラクター5が会話に途中参加（未実装）
 *   FaceChat remove 6              # キャラクター6が会話から退場（未実装）
 *   FaceChat end                   # 会話を終了する
 * last update : 24th dec 2015 v0.75
 */

/*:ja
 * @plugindesc 某テイルズオブシリーズ風のフェイスチャットによる会話機能を追加します。
 * @author しおいぬ
 *
 * @param Face size
 * @desc 顔グラフィックのサイズです。
 * @default 128
 *
 * @param Margin
 * @desc 顔グラフィック同士の間隔の広さです。
 * @default 32
 *
 * @param Eye Anim Num
 * @desc まばたきの枚数です。
 * @default 3
 *
 * @param Mouse Anim Num
 * @desc 口パクの枚数です。
 * @default 4
 *
 * @param File Name
 * @desc フェイスチャットに使用するファイル名です。
 * @default face01,face02,face03

 * @help
 *
 * プラグインコマンド:
 *   FaceChat start 1,2,3,4         # キャラクター1,2,3,4によるフェイスチャット（タイトルなし）を開始する
 *   FaceChat start 5,6,7,8 雑談    # キャラクター5,6,7,8によるフェイスチャット（タイトル「雑談」）を開始する
 *   FaceChat talk 1,2              # キャラクター1,2がしゃべる（口パクアニメーションの再生）
 *   FaceChat emotion 2 4           # キャラクター2の表情を4番に変更
 *   FaceChat balloon 3 8           # キャラクター3に8番の吹き出しを表示
 *   FaceChat animation 4 5         # キャラクター4に5番のモーションを再生
 *   FaceChat emotionAll 1,1,2,3    # キャラクターの表情を一括設定
 *   FaceChat add 5                 # キャラクター5が会話に途中参加（未実装）
 *   FaceChat remove 6              # キャラクター6が会話から退場（未実装）
 *   FaceChat end                   # 会話を終了する
 * last update : 2015/12/24 v0.75
 */
(function(){


    var parameters = PluginManager.parameters('PD_FaceChat');
    var faceSize = Number(parameters['Face size'] || 128);
    var margin = Number(parameters['Margin'] || 32);
    var eyeAnimNum =  Number(parameters['Eye Anim Num'] || 3);
    var mouseAnimNum =  Number(parameters['Mouse Anim Num'] || 3);
    var fileName = String(parameters['File Name'] || "face01,face02,face03").split(',');

    /* 以下は詳細設定
     * より細かく作りこみたい時のみ変更してください。
     */
    //表情パターンごとに表示される吹き出し
    var balloonNum = [0, 3, 5, 0, 6, 1, 11, 4, 0];
    //表情パターンごとに表示されるTweenアニメーション
    var animNum    = [0, 1, 6, 0, 3, 4, 2, 5, 0];
    //画面サイズ
    var screenSize = [816, 444];
    //瞬きの間隔（最小フレーム、最大フレーム）
    var eyeFrameMin = 90;
    var eyeFrameMax = 180;
    //口パクアニメーションの１コマの表示時間
    var mouseAnimFrame = Math.floor(12 / (mouseAnimNum - 1));
    //瞬きアニメーションの１コマの表示時間
    var eyeAnimFrame = Math.floor(8 / (eyeAnimNum - 1));

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'FaceChat') {
            switch (args[0]) {
            case 'start':
                SceneManager._scene.startChat(String(args[1]).split(','), String(args[2]));
                break;
            case 'talk':
                SceneManager._scene.talk(String(args[1]).split(','));
                break;
            case 'emotion':
                SceneManager._scene.emotion(Number(args[1]), Number(args[2]), false);
                break;
            case 'balloon':
                SceneManager._scene.balloon(Number(args[1]), Number(args[2]));
                break;
            case 'animation':
                SceneManager._scene.startAnim(Number(args[1]), Number(args[2]));
                break;
            case 'emotionAll':
                SceneManager._scene.emotionAll(String(args[1]).split(','));
                break;
            case 'end':
                SceneManager._scene.endChat();
                break;
            }
        }
    };
//-----------------------------------------------------------------------------
// Sprite_ChatFace
//
// フェイスチャット用スプライトの定義です。

    function Sprite_ChatFace() {
        this.initialize.apply(this, arguments);
    }

    Sprite_ChatFace.prototype = Object.create(Sprite_Base.prototype);
    Sprite_ChatFace.prototype.constructor = Sprite_ChatFace;

    Sprite_ChatFace.prototype.initialize = function(pos, charId) {
        Sprite_Base.prototype.initialize.call(this);
        this._position = pos;
        this._char_id = charId;
        this._face = 1;
        this._mouse_frame = 0;
        this._eye_frame = 0;
        this._talk = false;
        this._mouse_frame_last = mouseAnimFrame;
        this._eye_frame_last = Math.floor(Math.random() * (eyeFrameMax - eyeFrameMin) + eyeFrameMin);
        this.bitmap = new Bitmap(faceSize, faceSize);
        this._bitmap2 = ImageManager.loadPicture(fileName[this._char_id - 1]);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this._fadeOut = false;
    };

    Sprite_ChatFace.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if(this.visible){
            this.updateFrame();
            this.updateBalloon();
            //顔ベースの描画
            this.bitmap.blt(this._bitmap2, 0, 0, faceSize, faceSize, faceSize * (this._face - 1), 0);
            //目の描画
            this.bitmap.blt(this._bitmap2, faceSize * (this._eye_frame + 1), faceSize * (this._face - 1), faceSize, faceSize, 0, 0);
            //口の描画
            this.bitmap.blt(this._bitmap2, faceSize * (eyeAnimNum + this._mouse_frame + 1), faceSize * (this._face - 1), faceSize, faceSize, 0, 0) ;
        }
    };

    Sprite_ChatFace.prototype.updateFrame = function() {
        //フェードイン
        if(this.opacity < 255 && !this._fadeOut){
            console.log("opacity : " + this.opacity);
            this.opacity += 25;
            if(this.opacity > 255){
            this.opacity = 255;
            }
        }
        //フェードアウト
        if(this._fadeOut){
            this.opacity -= 25;
            console.log("opacity : " + this.opacity);
            if(this.opacity <= 0){
                this.opacity = 0;
                this.visible = false;
                this._fadeOut = false;
            }
        }

        // 口パクの更新
        if(this._talk){
            this._mouse_frame_last -= 1;
            if(this._mouse_frame_last == 0){
                this._mouse_frame_last = mouseAnimFrame;
                this._mouse_frame += 1;
                if(this._mouse_frame == mouseAnimNum){
                      this._mouse_frame = 0;
                }
            }
        }
        else{
          this._mouse_frame = 0;
          this._mouse_frame_last = mouseAnimFrame;
        }
    
        //まばたきの更新
        //console.log("eye_frame_last : " + this._eye_frame_last);
        this._eye_frame_last -= 1;
        if(this._eye_frame_last == 0){
            this._eye_frame += 1;
            if(this._eye_frame == eyeAnimNum){
                this._eye_frame = 0;
            }
            if(this._eye_frame == 0){
                this._eye_frame_last = Math.floor(Math.random() * (eyeFrameMax - eyeFrameMin) + eyeFrameMin);
            }
            else{
                this._eye_frame_last = eyeAnimFrame;
            }
        }
    
    };

    Sprite_ChatFace.prototype.changeEmotion = function(num, motion) {
        //顔グラフィックを取得
        this._face = num;
        if(motion && balloonNum[this._face - 1] != 0){
            this.startBalloon(balloonNum[this._face - 1]);
            this.startAnim(animNum[this._face - 1]);
        }
    }

    Sprite_ChatFace.prototype.setTalk = function(talk) {
        this._talk = talk;
    }

    Sprite_ChatFace.prototype.setFace = function(num) {
        //顔グラフィックを取得
        this._face = 1;
        this._char_id = num;
        this._bitmap2 = ImageManager.loadPicture(fileName[this._char_id - 1]);
    }

    //吹き出しの表示
    Sprite_ChatFace.prototype.startBalloon = function(balloonNum) {
        if (!this._balloonSprite) {
            this._balloonSprite = new Sprite_Balloon();
        }
        this._balloonSprite.setup(balloonNum);
        this.parent.addChild(this._balloonSprite);
    };

    //吹き出しの更新
    Sprite_ChatFace.prototype.updateBalloon = function() {
        if (this._balloonSprite) {
            this._balloonSprite.x = this.x;
            this._balloonSprite.y = this.y - (faceSize / 2);
            if (!this._balloonSprite.isPlaying()) {
                this.endBalloon();
            }
        }
    };
    //吹き出しの終了
    Sprite_ChatFace.prototype.endBalloon = function() {
        if (this._balloonSprite) {
            this.parent.removeChild(this._balloonSprite);
            this._balloonSprite = null;
        }
    };

    //吹き出しの表示
    Sprite_ChatFace.prototype.startAnim = function(anim) {
        switch(anim){
        case 1:
            //左右に揺れる
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.0, 1.0), 0.1, 10, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.0, 1.0), -0.1, 10, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.0, 1.0), 0, 10, 0, 1));
            break;
        case 2:
            //ぴょんぴょん
            this.addAnimation(new QueueTweenAnimation(new Point(0, -10), new Point(1.0, 1.0), 0, 5, 2, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0,  10), new Point(1.0, 1.0), 0, 5, 1, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, -10), new Point(1.0, 1.0), 0, 5, 2, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0,  10), new Point(1.0, 1.0), 0, 5, 1, 1));
            break;
        case 3:
            //ガクッ
            this.addAnimation(new QueueTweenAnimation(new Point( 10,  10), new Point(1.0, 1.0), 0.1, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(  0,   0), new Point(1.0, 1.0), 0.1, 60, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(-10, -10), new Point(1.0, 1.0), 0, 20, 0, 1));
            break;
        case 4:
            //びっくり
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.2, 1.2), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.0, 1.0), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.2, 1.2), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.0, 1.0), 0, 5, 0, 1));
            break;
        case 5:
            //左右にゆらゆら
            this.addAnimation(new QueueTweenAnimation(new Point( 10, 0), new Point(1.0, 1.0), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(-10, 0), new Point(1.0, 1.0), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point( 10, 0), new Point(1.0, 1.0), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(-10, 0), new Point(1.0, 1.0), 0, 5, 0, 1));
            break;
        case 6:
            //ドンッとアップ
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.2, 1.2), 0, 5, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.2, 1.2), 0, 30, 0, 1));
            this.addAnimation(new QueueTweenAnimation(new Point(0, 0), new Point(1.0, 1.0), 0, 30, 0, 1));
            break;
        }
    };

    //-----------------------------------------------------------------------------
    // Scene_Map
    //
    // マップシーンの定義です。
    Scene_Map.prototype.startChat = function(faceIdArray, title) {
        this._spriteset.startChat(faceIdArray);
        if(!this._chatTitleWindow){
            this._chatTitleWindow = new Window_Base(0, 0, screenSize[0], 80);
            this._chatTitleWindow.setBackgroundType(1);
            this.addWindow(this._chatTitleWindow);
            this._chatTitleWindow.close();
        }
        if(title != "undefined"){
            this._chatTitleWindow.contents.clear();
            this._chatTitleWindow.drawText(title, 0, 4, screenSize[0], "center");
            this._chatTitleWindow.open();
        }
    };

    Scene_Map.prototype.talk = function(talkers) {
        this._spriteset.talk(talkers);
    };

    Scene_Map.prototype.emotion = function(id, emotion, motion) {
        this._spriteset.emotion(id, emotion, motion);
    };

    Scene_Map.prototype.balloon = function(id, balloon) {
        this._spriteset.balloon(id, balloon);
    };

    Scene_Map.prototype.startAnim = function(id, anim) {
        this._spriteset.startAnim(id, anim);
    };

    Scene_Map.prototype.emotionAll = function(emotions) {
        this._spriteset.emotionAll(emotions);
    };

    Scene_Map.prototype.endChat = function() {
        this._spriteset.endChat();
        this._chatTitleWindow.close();
    };

    //-----------------------------------------------------------------------------
    // Spriteset_Map
    //

    var createUpper = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        createUpper.call(this);
        
        this._faces = [];
        for(i=0; i < 8; i++){
            var sprite = new Sprite_ChatFace(1, 1);
            sprite.x = 0;
            sprite.y = 0;
            sprite.opacity = 0;
            sprite.visible = false;
            this.addChild(sprite);
            this._faces.push(sprite);
        }
    }

    Spriteset_Map.prototype.startChat = function(faceIdArray) {
        for(i=0; i < faceIdArray.length; i++){
            var sprite = this._faces[i];
            sprite.visible = true;
            sprite.setFace(Number(faceIdArray[i]));
            this.setPos(sprite, faceIdArray.length, i);
        }
    };

    Spriteset_Map.prototype.setPos = function(sprite, max, id) {
        width = faceSize +  margin;
        height = faceSize +  margin;

        if(max == 1){
            //1人の場合は真ん中に表示
            sprite.move(screenSize[0] / 2, screenSize[1] / 2 + 48);
        }
        else if(max == 2){
            //2人の場合は横に並べて表示
            sprite.move((screenSize[0] - width) / 2 + (width * id), screenSize[1] / 2 + 48);
        }
        else{
            column1 = Math.floor(max / 2);
            column2 = Math.floor(max / 2);
            if(max % 2 == 1){
                //偶数の場合は上段+1
                column1 += 1;
            }
            if(id < column1){
                //上段
                sprite.move((screenSize[0] - width * (column1 - 1)) / 2 + (width * id), (screenSize[1] - height) / 2 + 48);
            }
            else{
                 //下段
                sprite.move((screenSize[0] - width * (column2 - 1)) / 2 + (width * (id - column1)), (screenSize[1] + height) / 2 + 48);
            }
        }
    };

    Spriteset_Map.prototype.endChat = function() {
        for(i=0; i < 8; i++){
            var sprite = this._faces[i];
            if(sprite.visible){
                sprite._fadeOut = true;
                sprite.endBalloon();
            }
        }
    };

    Spriteset_Map.prototype.talk = function(talkers) {
        for(i=0; i < 8; i++){
            this._faces[i].setTalk(false);
        }
        for(i=0; i < talkers.length; i++){
            this._faces[Number(talkers[i]) - 1].setTalk(true);
        }
    };

    Spriteset_Map.prototype.emotion = function(id, emotion, motion) {
        this._faces[id - 1].changeEmotion(emotion, motion);
    };
    Spriteset_Map.prototype.balloon = function(id, balloon) {
        this._faces[id - 1].startBalloon(balloon);
    };
    Spriteset_Map.prototype.startAnim = function(id, animId) {
        this._faces[id - 1].startAnim(animId);
    };

    Spriteset_Map.prototype.emotionAll = function(emotions) {
        for(i=0; i < emotions.length; i++){
            if(emotions[i] != 0){
                this._faces[i].changeEmotion(emotions[i], false);
            }
        }
    };

// Show Text
    var showText = Game_Interpreter.prototype.command101
    Game_Interpreter.prototype.command101 = function() {
        if(this._params[0].indexOf( "faceChat_" ) === 0){
            var arr = [Number(this._params[1]) + 1];
            SceneManager._scene.talk(arr);
            SceneManager._scene.emotion(Number(this._params[1]) + 1, Number(String(this._params[0]).slice(9)), true);
        }
        showText.call(this);
    }

    Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
        if(faceName){
            if(!(faceName.indexOf( "faceChat_" ) === 0)){
                this._faceName = faceName;
                this._faceIndex = faceIndex;
            }
        } else {
            this._faceName = faceName;
            this._faceIndex = faceIndex;
        }
    };

})();