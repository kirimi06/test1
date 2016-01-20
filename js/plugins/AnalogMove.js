//=============================================================================
// AnalogMove.js
//=============================================================================

/*:
 * @plugindesc アナログ移動 
 * 1ピクセル単位の移動 アナログスティック対応
 * @author サンシロ https://twitter.com/rev2nym
 * @version 0.10 2015/11/06
 * 
 * @help
 * プレイヤーキャラクターの移動をタイルによらないられない1ピクセル単位の移動に変更します。
 * アナログスティック入力に対応しています。
 * 
 * プレイヤーを対象とする「ルート移動の指定」コマンドには対応していません。
 * フォロワー表示には対応していません。
 * タッチパッド入力には対応していません。
 * 
 * 「ルート移動の指定」コマンドや機能の on/off に未対応のため実用には堪えないかもしれません。
 * まだまだ改善点や追加したい機能がたくさんあるのでスクリプトは頻繁に変更されます。
 * お試しにどうぞ。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

(function(){

	//-----------------------------------------------------------------------------
	// Game_AnalogMove
	//
	// アナログムーブクラス
	function Game_AnalogMove() {
		this.initialize.apply(this, arguments);
	};
	
	// 公開プロパティ
	Object.defineProperties(Game_AnalogMove.prototype, {
	    nextRealX: { get: function() { return this._nextRealX; } },	// 次回マップ実 X 座標
	    nextRealY: { get: function() { return this._nextRealY; } },	// 次回マップ実 Y 座標
	});

	// アナログムーブクラス初期化
	Game_AnalogMove.prototype.initialize = function(character) {
		this._character	= character;				// キャラクター
		this._crntRealX	= this._character.realX;	// 現在マップ実 X 座標
		this._nextRealX	= this._character.realX;	// 次回マップ実 X 座標
		this._crntRealY	= this._character.realY;	// 現在マップ実 Y 座標
		this._nextRealY	= this._character.realY;	// 次回マップ実 Y 座標
		this._distancePerFrame	= 0.0;				// フレーム間移動距離（ピクセル）
		this._directionRadian	= 0.0;				// 現在進行方位
		this._targetRadian		= 0.0;				// 目標進行方位
		this._directionRadianVariate = Math.PI*2.0;	// 進行方位変化量
		this._isMoving			= false;			// 移動中判定
		this._collideEvents		= new Array();		// 接触イベント
	};
	
	// フレーム更新
	Game_AnalogMove.prototype.update = function() {
		this.updateTargetRadianByInput();
		this.updateSelfDirectionRadian();
		this.updateSelfNextRealXY();
	};
	
	// キー入力による目標方位角度の更新
	Game_AnalogMove.prototype.updateTargetRadianByInput = function() {
		var stick = Input.leftStick();
		if (!this._character.canMove()) {
			this._distancePerFrame = 0.0;
		} else if (stick != undefined && stick.tilt != 0) {
			this._targetRadian = this.normalizeRadian(stick.direction);
			this._distancePerFrame = this._character.distancePerFrame() * stick.tilt;
		} else if (this.dir8ToRadian(Input.dir8) != undefined){
			this._targetRadian = this.dir8ToRadian(Input.dir8);
			this._distancePerFrame = this._character.distancePerFrame();
		} else {
			this._distancePerFrame = 0.0;
		}
	}
	
	// 方位からキャラクターの4方向を取得
	Game_AnalogMove.prototype.dir4 = function() {
		return this.dir8ToDir4(this.radianToDir8(this._directionRadian));
	};

	// 目標方向に向けて進行方位を更新
	Game_AnalogMove.prototype.updateSelfDirectionRadian = function() {
		if (this._directionRadian === this._targetRadian) return;
		var differentialRadian = this.normalizeRadian(this._targetRadian - this._directionRadian);
		if (differentialRadian >= Math.PI) differentialRadian -= Math.PI * 2.0;
		differentialRadian < 0 ?
			this._directionRadian += Math.max(differentialRadian, -this._directionRadianVariate) :
			this._directionRadian += Math.min(differentialRadian,  this._directionRadianVariate);
		this._directionRadian = this.normalizeRadian(this._directionRadian);
	};
	
	// ラジアン角度を整形
	Game_AnalogMove.prototype.normalizeRadian = function(radian) {
		while (radian < 0) radian += (Math.PI * 2.0);
		return radian % (Math.PI * 2.0);
	};
	
	// クラス内部の実座標の更新
	Game_AnalogMove.prototype.updateSelfNextRealXY = function(){
		this._collideEvents = new Array();
		this._isMoving = false;
		this._crntRealX = this._nextRealX = this._character.realX;
		this._crntRealY = this._nextRealY = this._character.realY;
		var evadeDirectionRadian = this._directionRadian;
		var splitDistances = this.splitDistances();
		splitDistances.forEach(function(splitDistance) {
			this.calculateNextRealXY(splitDistance, this._directionRadian);
			var collideCharacters = this.collideCharacters(splitDistance);
			var collideWallX = this.collideWallX(splitDistance);
			var collideWallY = this.collideWallY(splitDistance);
			var collideCornerXY = this.collideCornerXY(splitDistance);
			if (collideCharacters.length === 0) {
				if (collideCornerXY != undefined) {
					evadeDirectionRadian = this.evadeDirectionRadian(collideCornerXY.x, collideCornerXY.y, this._directionRadian);
					splitDistance *= Math.abs(Math.cos(evadeDirectionRadian - this._directionRadian));
					this.calculateNextRealXY(splitDistance, evadeDirectionRadian);
				}
				if (collideWallX != undefined) this._nextRealX = Math.round(this._nextRealX);
				if (collideWallY != undefined) this._nextRealY = Math.round(this._nextRealY);
			} else if (collideWallX === undefined && collideWallY === undefined && collideCornerXY === undefined){
				evadeDirectionRadian = this.evadeDirectionRadian(collideCharacters[0].realX + 0.5, collideCharacters[0].realY + 0.5, this._directionRadian);
				splitDistance *= Math.abs(Math.cos(evadeDirectionRadian - this._directionRadian));
				this.calculateNextRealXY(splitDistance, evadeDirectionRadian);
			} else {
				this._nextRealX = this._crntRealX;
				this._nextRealY = this._crntRealY;
			}
			this._collideEvents = this._collideEvents.concat(collideCharacters);
			this._crntRealX = this._nextRealX = ((this._nextRealX + $gameMap.width())  % $gameMap.width());
			this._crntRealY = this._nextRealY = ((this._nextRealY + $gameMap.height()) % $gameMap.height());
		}, this);
		this._isMoving = (this._character.realX != this._nextRealX || this._character.realY != this._nextRealY);
		// 衝突するイベントの更新
		this._collideEvents = this._collideEvents.filter(function(character, i, characters) {
			return (characters.indexOf(character) === i && $gameMap.events().indexOf(character) !== -1);
		});
	};
	
	// 分割フレーム間移動距離
	Game_AnalogMove.prototype.splitDistances = function() {
		var unitDistanceVelocity = 1.0 / 4.0;
		var distancePerFrame = this._distancePerFrame;
		var distances = new Array();
		while (distancePerFrame > 0.0) {
			distances.push(Math.min(distancePerFrame, unitDistanceVelocity));
			distancePerFrame -= unitDistanceVelocity;
		}
		return distances;
	};
	
	// クラス内部の次移動座標の計算
	Game_AnalogMove.prototype.calculateNextRealXY = function(distancePerFrame, directionRadian) {
		var distanceX = - distancePerFrame * Math.sin(directionRadian);
		var distanceY = - distancePerFrame * Math.cos(directionRadian);
		this._nextRealX = this._crntRealX + distanceX;
		this._nextRealY = this._crntRealY + distanceY;
	};
	
	// 指定座標を避ける方位角度
	Game_AnalogMove.prototype.evadeDirectionRadian = function(x, y, directionRadian) {
		var towardDirectionRadian = this.towardDirectionRadian(x, y);
		var differentialRadian = this.normalizeRadian(towardDirectionRadian - directionRadian);
		if (differentialRadian > Math.PI) differentialRadian -= (Math.PI * 2.0);
		towardDirectionRadian += (differentialRadian < 0 ? Math.PI / 2.0 : - Math.PI / 2.0);
		return this.normalizeRadian(towardDirectionRadian);
	};
		
	// 指定座標への方位
	Game_AnalogMove.prototype.towardDirectionRadian = function(x, y){
		var deltaX = this.deltaXFrom(x);
		var deltaY = this.deltaYFrom(y);
		if (deltaX == 0.0) {
			return (deltaY < 0 ? Math.PI * 0.0 : Math.PI * 2.0);
		} else if (deltaY == 0.0) {
			return (deltaX < 0 ? Math.PI * 1.0 : Math.PI * 3.0);
		} else {
			return Math.atan2(deltaX, deltaY);
		}
	};
	
	// 衝突する全てのキャラクター
	Game_AnalogMove.prototype.collideCharacters = function(distancePerFrame) {
		if (!distancePerFrame) distancePerFrame = 0.0;
		var priorityFilter = function(character, index, array) {
			return (character != this._character &&
					character.priorityType == this._character.priorityType &&
					!character.isThrough());
		};
		var distanceFilter = function(character, index, array) {
			var crntDistance = this.deltaXYFrom(character.realX + 0.5, character.realY + 0.5);
			var nextDistance = this.deltaXY(this._nextRealX, this._nextRealY, character.realX, character.realY);
			return (nextDistance < crntDistance && nextDistance < 1.0 );
		};
		var distanceCompare = function(character1, character2) {
			var distance1 = this.deltaXYFrom(character1.realX + 0.5, character1.realY + 0.5);
			var distance2 = this.deltaXYFrom(character2.realX + 0.5, character2.realY + 0.5);
			return (distance2 - distance1);
		};
		var collideCharacters = this.allCharacters();
		collideCharacters = collideCharacters.filter(priorityFilter, this);
		collideCharacters = collideCharacters.filter(distanceFilter, this);
		collideCharacters.sort(distanceCompare, this);
		return collideCharacters;
	};
	
	// マップ上の全てのキャラクター
	Game_AnalogMove.prototype.allCharacters = function() {
		var player = [$gamePlayer];
		var events = $gameMap.events();
		var followers = $gamePlayer.followers().visibleFollowers();
		return ([$gamePlayer].concat($gameMap.events(), $gamePlayer.followers().visibleFollowers()));
	};
	
	// 衝突するイベント
	Game_AnalogMove.prototype.collideEvents = function() {
		return this._collideEvents;
	}
	
	// 水平方向の衝突壁の座標
	Game_AnalogMove.prototype.collideWallX = function(distancePerFrame) {
		if (!distancePerFrame) distancePerFrame = 0.0
		var nextCenterX = this._nextRealX + 0.5
		var nextCenterY = this._nextRealY + 0.5
		if (this._crntRealX >= this._nextRealX) {
			// 左の壁
			var x = (Math.floor(nextCenterX - 0.5) + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY)       + $gameMap.height()) % $gameMap.height();
			var tile4 = $gameMap.collideMap.tiles[x][y];
			if (tile4.e6 && Math.abs(this.deltaX(nextCenterX, tile4.x6)) < 0.5 + distancePerFrame) return tile4.x6;
		} else {
			// 右の壁
			var x = (Math.floor(nextCenterX + 0.5) + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY)       + $gameMap.height()) % $gameMap.height();
			var tile6 = $gameMap.collideMap.tiles[x][y];
			if (tile6.e4 && Math.abs(this.deltaX(nextCenterX, tile6.x4)) < 0.5 + distancePerFrame) return tile6.x4;
		}
		return undefined;
	};
	
	// 垂直方向の衝突壁の座標
	Game_AnalogMove.prototype.collideWallY = function(distancePerFrame) {
		if (!distancePerFrame) distancePerFrame = 0.0
		var nextCenterX = this._nextRealX + 0.5
		var nextCenterY = this._nextRealY + 0.5
		if (this._crntRealY >= this._nextRealY) {
			// 上の壁
			var x = (Math.floor(nextCenterX)       + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY - 0.5) + $gameMap.height()) % $gameMap.height();
			var tile8 = $gameMap.collideMap.tiles[x][y];
			if (tile8.e2 && Math.abs(this.deltaY(nextCenterY, tile8.y2)) < 0.5 + distancePerFrame) return tile8.y2;
		} else {
			// 下の壁
			var x = (Math.floor(nextCenterX)       + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY + 0.5) + $gameMap.height()) % $gameMap.height();
			var tile2 = $gameMap.collideMap.tiles[x][y];
			if (tile2.e8 && Math.abs(this.deltaY(nextCenterY, tile2.y8)) < 0.5 + distancePerFrame) return tile2.y8;
		}
		return undefined;
	};
	
	// 衝突角の座標
	Game_AnalogMove.prototype.collideCornerXY = function(distancePerFrame) {
		if (!distancePerFrame) distancePerFrame = 0.0
		var nextCenterX = this._nextRealX + 0.5
		var nextCenterY = this._nextRealY + 0.5
		if (this._nextRealX < this._crntRealX || this._nextRealY < this._crntRealY) {
			// 左上の角
			var x = (Math.floor(nextCenterX - 0.5) + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY - 0.5) + $gameMap.height()) % $gameMap.height();
			var tile7 = $gameMap.collideMap.tiles[x][y];
			if (tile7.a3 && this.deltaXY(nextCenterX, nextCenterY, tile7.x3, tile7.y3) < 0.5 - distancePerFrame) {
				return { x: tile7.x3, y: tile7.y3 };
			}
		}
		if (this._nextRealX < this._crntRealX || this._nextRealY > this._crntRealY) {
			// 左下の角
			var x = (Math.floor(nextCenterX - 0.5) + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY + 0.5) + $gameMap.height()) % $gameMap.height();
			var tile1 = $gameMap.collideMap.tiles[x][y];
			if (tile1.a9 && this.deltaXY(nextCenterX, nextCenterY, tile1.x9, tile1.y9) < 0.5 - distancePerFrame) {
				return { x: tile1.x9, y: tile1.y9 };
			}
		}
		if (this._nextRealX > this._crntRealX || this._nextRealY < this._crntRealY) {
			// 右上の角
			var x = (Math.floor(nextCenterX + 0.5) + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY - 0.5) + $gameMap.height()) % $gameMap.height();
			var tile9 = $gameMap.collideMap.tiles[x][y];
			if (tile9.a1 && this.deltaXY(nextCenterX, nextCenterY, tile9.x1, tile9.y1) < 0.5 - distancePerFrame) {
				return { x: tile9.x1, y: tile9.y1 };
			}
		}
		if (this._nextRealX > this._crntRealX || this._nextRealY > this._crntRealY) {
			// 右下の角
			var x = (Math.floor(nextCenterX + 0.5) + $gameMap.width())  % $gameMap.width();
			var y = (Math.floor(nextCenterY + 0.5) + $gameMap.height()) % $gameMap.height();
			var tile3 = $gameMap.collideMap.tiles[x][y];
			if (tile3.a7 && this.deltaXY(nextCenterX, nextCenterY, tile3.x7, tile3.y7) < 0.5 - distancePerFrame) {
				return { x: tile3.x7, y: tile3.y7 };
			}
		} 
		return undefined;
	};
	
	// 移動中判定
	Game_AnalogMove.prototype.isMoving = function() {
		return this._isMoving;
	};
	
	// 水平方向の距離
	Game_AnalogMove.prototype.deltaX = function(x1, x2) {
		return $gameMap.deltaX(x1, x2)
	};
	
	// 垂直方向の距離
	Game_AnalogMove.prototype.deltaY = function(y1, y2) {
		return $gameMap.deltaY(y1, y2)
	};
	
	// 座標間の距離
	Game_AnalogMove.prototype.deltaXY = function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(this.deltaX(x1, x2), 2) + Math.pow(this.deltaY(y1, y2), 2));
	};

	// 現在座標との水平方向の距離
	Game_AnalogMove.prototype.deltaXFrom = function(x) {
		return this.deltaX(this._crntRealX + 0.5, x);
	};

	// 現在座標との垂直方向の距離
	Game_AnalogMove.prototype.deltaYFrom = function(y) {
		return this.deltaY(this._crntRealY + 0.5, y);
	};

	// 現在座標との距離
	Game_AnalogMove.prototype.deltaXYFrom = function(x, y) {
		return this.deltaXY(this._crntRealX + 0.5, this._crntRealY + 0.5, x, y);
	};

	// 8方向を4方向に変換
	Game_AnalogMove.prototype.dir8ToDir4 = function(dir8) {
		if (dir8 % 2 == 0) return dir8;
		switch (this._character.direction()) {
		case 8:
			switch (dir8) {
			case 3:  return 6;
			case 1:  return 4;
			default: return 8;
			}
		case 6:
			switch (dir8) {
			case 1:  return 2;
			case 7:  return 8;
			default: return 6;
			}
		case 2:
			switch (dir8) {
			case 7:  return 4;
			case 9:  return 6;
			default: return 2;
			}
		case 4:
			switch (dir8) {
			case 9:  return 8;
			case 3:  return 2;
			default: return 4;
			}
		}
		return 0;
	};
		
	// 方向角度を8方向に変換
	Game_AnalogMove.prototype.radianToDir8 = function(radian) {
		radian = this.normalizeRadian(radian);
		return (
			radian < Math.PI / 8.0 *  1.0 ? 8 :
			radian < Math.PI / 8.0 *  3.0 ? 7 :
			radian < Math.PI / 8.0 *  5.0 ? 4 :
			radian < Math.PI / 8.0 *  7.0 ? 1 :
			radian < Math.PI / 8.0 *  9.0 ? 2 :
			radian < Math.PI / 8.0 * 11.0 ? 3 :
			radian < Math.PI / 8.0 * 13.0 ? 6 :
			radian < Math.PI / 8.0 * 15.0 ? 9 : 8
		)
	};
	
	// 8方向を方向角度に変換
	Game_AnalogMove.prototype.dir8ToRadian = function(dir8) {
		return (
			dir8 === 8 ? Math.PI / 4.0  * 0.0 :
			dir8 === 7 ? Math.PI / 4.0  * 1.0 :
			dir8 === 4 ? Math.PI / 4.0  * 2.0 :
			dir8 === 1 ? Math.PI / 4.0  * 3.0 :
			dir8 === 2 ? Math.PI / 4.0  * 4.0 :
			dir8 === 3 ? Math.PI / 4.0  * 5.0 :
			dir8 === 6 ? Math.PI / 4.0  * 6.0 :
			dir8 === 9 ? Math.PI / 4.0  * 7.0 : undefined
		)
	};
	
	//-----------------------------------------------------------------------------
	// Game_CollideTile
	//
	// 衝突マップクラス
	function Game_CollideMap () {
		this.initialize.apply(this, arguments);
	};
	
	// 衝突マップクラスの公開プロパティ
	Object.defineProperties(Game_CollideMap.prototype, {
	    mapId: { get: function() { return this._mapId; } }, // マップ ID
	    tiles: { get: function() { return this._tiles; } }  // 衝突タイル配列
	});

	// 衝突マップの初期化
	Game_CollideMap.prototype.initialize = function() {
		this._mapId = 0;
		this._tiles = new Array();
	};
	
	// 衝突マップのセットアップ
	Game_CollideMap.prototype.setup = function() {
		this._mapId = $gameMap.mapId()
		this._tiles = new Array();
		for (var x = 0; x < $gameMap.width(); x++) {
			this._tiles.push([]);
			for (var y = 0; y < $gameMap.height(); y++){
				this._tiles[x].push(new Game_CollideTile(x, y));
			} 
		}
	};
	
	//-----------------------------------------------------------------------------
	// Game_CollideTile
	//
	// 衝突タイルクラス
	function Game_CollideTile () {
		this.initialize.apply(this, arguments);
	};
	
	// 衝突タイルクラスの公開プロパティ
	Object.defineProperties(Game_CollideTile.prototype, {
		x:  { get: function() { return this._x;  } },	// タイル X 座標
		y:  { get: function() { return this._y;  } },	// タイル Y 座標
		x5: { get: function() { return this._x5; } },	// タイル中心 X 座標
		y5: { get: function() { return this._y5; } },	// タイル中心 Y 座標
		x9: { get: function() { return this._x9; } },	// タイル右上 X 座標
		y9: { get: function() { return this._y9; } },	// タイル右上 Y 座標
		x3: { get: function() { return this._x3; } },	// タイル右下 X 座標
		y3: { get: function() { return this._y3; } },	// タイル右下 Y 座標
		x1: { get: function() { return this._x1; } },	// タイル左下 X 座標
		y1: { get: function() { return this._y1; } },	// タイル左下 Y 座標
		x7: { get: function() { return this._x7; } },	// タイル左上 X 座標
		y7: { get: function() { return this._y7; } },	// タイル左上 Y 座標
		y8: { get: function() { return this._y8; } },	// タイル真上 Y 座標
		x6: { get: function() { return this._x6; } },	// タイル真右 X 座標
		y2: { get: function() { return this._y2; } },	// タイル真下 Y 座標
		x4: { get: function() { return this._x4; } },	// タイル真左 X 座標
		e8: { get: function() { return this._e8; } },	// タイル真上 通行不能判定 辺
		e6: { get: function() { return this._e6; } },	// タイル真右 通行不能判定 辺
		e2: { get: function() { return this._e2; } },	// タイル真下 通行不能判定 辺
		e4: { get: function() { return this._e4; } },	// タイル真左 通行不能判定 辺
		a9: { get: function() { return this._a9; } },	// タイル右上 通行不能判定 角
		a3: { get: function() { return this._a3; } },	// タイル右下 通行不能判定 角
		a1: { get: function() { return this._a1; } },	// タイル左下 通行不能判定 角
		a7: { get: function() { return this._a7; } }	// タイル左上 通行不能判定 角
	});
	
	// 衝突タイルクラスの初期化
	Game_CollideTile.prototype.initialize = function(x, y){
		this._x = Math.floor(x);
		this._y = Math.floor(y);
		this._x5 = this._x + 0.5;
		this._y5 = this._y + 0.5;
		this._x4 = this._x1 = this._x7 = this._x;
		this._x6 = this._x3 = this._x9 = x + 1.0;
		this._y8 = this._y7 = this._y9 = this._y;
		this._y2 = this._y1 = this._y3 = y + 1;
		this._e8 = !this.isPassable(this._x, this._y, 8);
		this._e6 = !this.isPassable(this._x, this._y, 6);
		this._e2 = !this.isPassable(this._x, this._y, 2);
		this._e4 = !this.isPassable(this._x, this._y, 4);
		this._a9 = (this._e8 || this._e6) && this.isCorner(9);
		this._a3 = (this._e6 || this._e2) && this.isCorner(3);
		this._a1 = (this._e2 || this._e4) && this.isCorner(1);
		this._a7 = (this._e4 || this._e8) && this.isCorner(7);
	};

	// 衝突タイルクラス通行可能判定 辺
	Game_CollideTile.prototype.isPassable = function(x, y, d){
		x2 = $gameMap.roundXWithDirection(x, d);
		y2 = $gameMap.roundYWithDirection(y, d);
		if (!$gameMap.isValid(x2, y2))            return false;
		if (!$gameMap.isPassable(x, y, d))        return false;
		if (!$gameMap.isPassable(x2, y2, 10 - d)) return false;
		return true;
	};

	// 衝突タイルクラス通行可能判定 角
	Game_CollideTile.prototype.isCorner = function(d){
		switch (d) {
		case 9:  return this.isPassable(this._x, this._y - 1, 6) && this.isPassable(this._x + 1, this._y, 8);
		case 3:  return this.isPassable(this._x, this._y + 1, 6) && this.isPassable(this._x + 1, this._y, 2);
		case 1:  return this.isPassable(this._x, this._y + 1, 4) && this.isPassable(this._x - 1, this._y, 2);
		case 7:  return this.isPassable(this._x, this._y - 1, 4) && this.isPassable(this._x - 1, this._y, 8);
		default: return false;
		}
	};
	
	// マップクラスの公開プロパティ
	Object.defineProperties(Game_Map.prototype, {
		collideMap:  { get: function() { return this._collideMap;  } } // 衝突マップ
	});
	
	// マップクラスの初期化
	var _rn_AnalogMove_Game_Map_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function() {
		_rn_AnalogMove_Game_Map_initialize.call(this);
		this._collideMap = new Game_CollideMap();
	};
	
	// マップクラスのセットアップ
	var _rn_AnalogMove_Game_Map_setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function(mapId) {
		_rn_AnalogMove_Game_Map_setup.call(this, mapId);
		this._collideMap.setup();
	};
	
	// 衝突マップ
	Game_Map.prototype.collideMap = function() {
		return this._collideMap;
	};

	//-----------------------------------------------------------------------------
	// Input
	//
	// インプットクラス

	// ゲームパッドステータスの更新
	var _rn_AnalogMove_Input_updateGamepadState = Input._updateGamepadState;
	Input._updateGamepadState = function(gamepad) {
		_rn_AnalogMove_Input_updateGamepadState.call(this, gamepad);
		this._updateGamepadAxes(gamepad);
	};
	
	// アナログスティック値の更新
	Input._updateGamepadAxes = function(gamepad) {
		this._axes = gamepad.axes;
	};
	
	// 左アナログスティック
	Input.leftStick = function() {
		if (this._axes === undefined) return undefined;
		var threshold = 0.1;
		var x = this._axes[0];
		var y = this._axes[1];
		var tilt = (Math.pow(x, 2) + Math.pow(y, 2));
		if (tilt < threshold) tilt = 0.0;
		if (tilt > 1.0) tilt = 1.0;
		var direction = Math.atan2(-x, -y)
		return {tilt: tilt, direction: direction};
	};
	
	// 左アナログスティック
	Input.rightStick = function() {
		if (this._axes === undefined) return undefined;
		var threshold = 0.1;
		var x = this._axes[2];
		var y = this._axes[3];
		var tilt = (Math.pow(x, 2) + Math.pow(y, 2));
		if (tilt < threshold) tilt = 0.0;
		if (tilt > 1.0) tilt = 1.0;
		var direction = Math.atan2(-x, -y)
		return {tilt: tilt, direction: direction};
	};
	
	//-----------------------------------------------------------------------------
	// Scene_Map
	//
	// マップシーン

	// マップシーンのメニューシーン呼び出し更新
	var _rn_AnalogMove_Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
	Scene_Map.prototype.updateCallMenu = function() {
	    var isMoving = $gamePlayer.isMoving;
	    $gamePlayer.isMoving = function() { return false };
	    _rn_AnalogMove_Scene_Map_updateCallMenu.call(this);
	    $gamePlayer.isMoving = isMoving;
	};

	//-----------------------------------------------------------------------------
	// Game_CharacterBase
	//
	// キャラクターベースクラス
	
	// キャラクターベースクラスの公開プロパティ
	Object.defineProperties(Game_CharacterBase.prototype, {
	    x:     { get: function() { return this._x; },     set: function(x)     {this._x = x} },         // マップ論理 X 座標
	    y:     { get: function() { return this._y; },     set: function(y)     {this._y = y} },         // マップ論理 Y 座標
	    realX: { get: function() { return this._realX; }, set: function(realX) {this._realX = realX} }, // マップ実 X 座標
	    realY: { get: function() { return this._realY; }, set: function(realY) {this._realY = realY} }, // マップ実 Y 座標
		priorityType: { get: function() { return this._priorityType; } }		// プライオリティ
	});
	
	// キャラクターベースクラスの移動中判定
	var _rn_AnalogMove_Game_CharacterBase_isMoving = Game_CharacterBase.prototype.isMoving;
	Game_CharacterBase.prototype.isMoving = function() {
		if (!!this._analogMove) return this._analogMove.isMoving();
		return _rn_AnalogMove_Game_CharacterBase_isMoving.call(this);
	};
	
	// キャラクターベースクラスのフレーム更新
	var _rn_AnalogMove_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
	Game_CharacterBase.prototype.update = function() {
		if (!!this._analogMove) this._analogMove.update();
		return _rn_AnalogMove_Game_CharacterBase_update.call(this);
	};
	
	// キャラクターベースクラスの移動更新
	var _rn_AnalogMove_Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
	Game_CharacterBase.prototype.updateMove = function() {
		if (!!this._analogMove) {
			if (this._realX != this._analogMove.nextRealX || this.realY != this._analogMove.nextRealY){
				this.realX = this._analogMove._nextRealX;
				this.realY = this._analogMove._nextRealY;
				this.x = Math.round(this.realX);
				this.y = Math.round(this.realY);
			}
			if (!this.isMoving()) {
		        this.refreshBushDepth();
		    }
			return;
		}
		return _rn_AnalogMove_Game_CharacterBase_updateMove.call(this)
	};
	
	//-----------------------------------------------------------------------------
	// Game_Character
	//
	// キャラクタークラス
	
	// キャラクタークラスのルート指定移動
	var _rn_AnalogMove_Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
	Game_Character.prototype.updateRoutineMove = function() {
		if (!!this._analogMove) return;
		return _rn_AnalogMove_Game_Character_updateRoutineMove.call(this);
	};
	
	//-----------------------------------------------------------------------------
	// Game_Player
	//
	// プレイヤークラス

	// プレイヤークラスのプロパティ初期化
	var _rn_AnalogMove_Game_Player_initMembers = Game_Player.prototype.initMembers;
	Game_Player.prototype.initMembers = function() {
		_rn_AnalogMove_Game_Player_initMembers.call(this);
		this._analogMove = new Game_AnalogMove(this);
	};
	
	// プレイヤークラスのキー入力による移動
	var _rn_AnalogMove_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
	Game_Player.prototype.moveByInput = function() {
		if (!!this._analogMove) {
			this._analogMove.updateTargetRadianByInput();
			this.setDirection(this._analogMove.dir4());
			this.checkEventTriggerTouchAnalog();
			return;
		}
		return _rn_AnalogMove_Game_Player_moveByInput.call(this);
	};
	
	// プレイヤークラスのダッシュ状態の更新
	var _rn_AnalogMove_Game_Player_updateDashing = Game_Player.prototype.updateDashing;
	Game_Player.prototype.updateDashing = function() {
	    var isMoving = this.isMoving;
	    this.isMoving = function() { return false };
	    _rn_AnalogMove_Game_Player_updateDashing.call(this);
	    this.isMoving = isMoving;
	};
	
	// プレイヤークラスのアナログムーブ時の接触イベント起動処理
	Game_Player.prototype.checkEventTriggerTouchAnalog = function() {
		if (!$gameMap.isEventRunning()) {
			this._analogMove.collideEvents().forEach(function(event) {
				if (event.isTriggerIn([1, 2]) && event.isNormalPriority() === true) {
					event.start();
				}
			});
		}
	};
})();