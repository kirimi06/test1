/*:ja
 * @plugindesc 敵グループ（トループ）を自動生成するプラグインです。
 * @author econa (ecoddr) http://ecoddr.blog.jp
 *
 *
 * @help
 * 使用する前に必要な設定
 * - エディタで、敵グループ番号[101]に敵が「１体」の敵グループを作ります。（敵の種類は何でもいいです）
 *   同様に番号[102]には敵が「２体」の敵グループ、番号[103]には敵が「３体」と設定し、番号[108]まで作ります。
 *
 * - 敵グループの番号と敵キャラの番号が同じになるように設定します。
 *   具体的には、敵キャラ番号[1]がこうもりなら、敵グループ番号[1]に、こうもりが１体いるように設定をします。 
 *   名前の自動生成をしておくと管理が楽になります。
 *
 * 敵の配置の仕方
 * - マップのエンカウント一覧に登場させたい敵キャラを設定します。
 *   「重み」は敵のキャパシティを表します。
 *   キャパシティの上限は30です。
 *
 *   具体的には……
 *   こうもり（重み:10）
 *   オーク（重み:15）
 *   ミノタウロス（重み:30）
 *   と設定した場合、以下の敵グループのいずれかとエンカウントします。
 *
 *   「こうもり2体」「こうもり3体」「こうもり1体とオーク1体」
 *   「オーク1体」「オーク2体」「ミノタウロス1体」
 *
 * 補足（敵の出現座標）
 * - 座標は敵グループ番号[101]～[108]の設定を参照します。
 *   フロントビューなら整列した状態で、サイドビューなら左側に適宜、調節して下さい。
 *
 * 特に利用制限はないので、抜き出ししたり、改造なりして下さい。
 *
 */
Game_Player.prototype.makeEncounterTroopId = function() {
    var enemyList = [];
    var weightList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function(encounter) {
		enemyList.push(encounter.troopId);
		weightList.push(encounter.weight);
    }, this);
	
	var encounterList = [];
	var enemyId = 0;
	
	for (var i = 0; i < 3; i++) {
		enemyId = Math.floor(( Math.random() * enemyList.length));
		weightSum += weightList[enemyId];
		if (weightSum > 30) {
			break;
		}
		encounterList[i] = enemyList[enemyId];
	}
	
	troop = $dataTroops[100+encounterList.length] 
	for (var i = 0; i < encounterList.length; i++) {
		troop.members[i].enemyId = encounterList[i];
	}
	return 100+encounterList.length;
};
