//=============================================================================
// ShipBgm.js
// Version: 0.01
//=============================================================================
/*:
 * @plugindesc It does not change the ship of BGM to be switched the map .
 * @author karakasr_dool
 *

 */
/*:ja
 * @plugindesc マップを切り替えても船のBGMを変えない.
 * @author 唐傘ドール
 */

(function() {
Game_System.prototype.saveWalkingBgm2 = function() {
    this._walkingBgm = $dataMap.bgm;
};

Game_Map.prototype.autoplay = function() {
	var flag = $gamePlayer.isInVehicle();
    if ($dataMap.autoplayBgm) {
		if(flag){
			$gameSystem.saveWalkingBgm2();
		}else{
			AudioManager.playBgm($dataMap.bgm);
		}
    }
    if ($dataMap.autoplayBgs) {
        AudioManager.playBgs($dataMap.bgs);
    }
};

})();

