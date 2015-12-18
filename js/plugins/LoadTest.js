//=============================================================================
// LoadTest.js
//=============================================================================

/*:
 * @plugindesc ロード不能テストスクリプト
 * セーブファイルのロード後にメソッドが読み込まれない状況を再現
 * @author サンシロ https://twitter.com/rev2nym
 * 
 * @help
 * このスクリプトを有効にしてセーブ・ロードしてみてください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 */

(function() {
	
	function LoadTest() {
	};
	
	LoadTest.prototype.x = function() {
		console.log("function x called.");
	};
	
	// プレイヤークラスのプロパティ初期化
	var _rn_LoadTest_Game_Player_initMembers = Game_Player.prototype.initMembers;
	Game_Player.prototype.initMembers = function() {
		_rn_LoadTest_Game_Player_initMembers.call(this);
		this._loadTest = new LoadTest();
	};
	
	// プレイヤークラスのフレーム更新
	var _rn_LoadTest_Game_Player_update = Game_Player.prototype.update;
	Game_Player.prototype.update = function() {
		_rn_LoadTest_Game_Player_update.call(this);
		this._loadTest.x();
	};
	
})();