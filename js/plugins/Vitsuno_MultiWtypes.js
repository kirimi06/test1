//=============================================================================
// Vitsuno_MultiWtypes.js
//-----------------------------------------------------------------------------
// Copyright (c) 2015 Tsuno Ozumi
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

var Vitsuno = Vitsuno || {};
Vitsuno.MultiWtypes = {};
Vitsuno.MultiWtypes.version = 1.00;

/*:
 * @plugindesc 武器に武器タイプを複数設定するスクリプトです。
 * @author 尾角 つの
 *
 * @help
 *
 * 以下のメモを武器に入力することで、武器タイプを増やすことができます。
 *
 * 武器のメモ:
 *   <wtypes:1>             # 加える武器タイプ
 *   <wtypes:1,2,3>         # 加える武器タイプ (複数設定時は , で区切る)
 *
 * 装備可能判定では元々の武器タイプからのみ判定します。
 * 攻撃モーションも元々の武器タイプから決定します。
 *
 * このプラグインには、プラグインコマンドはありません。
 */

//-----------------------------------------------------------------------------
// DataManager
//-----------------------------------------------------------------------------

// ● メタデータを抽出する
Vitsuno.MultiWtypes.DataMgr_extractMetadata = DataManager.extractMetadata;
DataManager.extractMetadata = function(data) {
    Vitsuno.MultiWtypes.DataMgr_extractMetadata.call(this, data);
    // マルチ武器タイプを設定
    if (data.wtypeId) {
        data.wtypes = [data.wtypeId];
        if (typeof data.meta.wtypes === 'string') {
            var wtypes = data.meta.wtypes.split(",").map(Number);
            data.wtypes = data.wtypes.concat(wtypes).filter(function(e, i, a) {
                return a.indexOf(e) === i;
            });
        }
    }
};

//-----------------------------------------------------------------------------
// Game_Actor
//-----------------------------------------------------------------------------

// ● 指定されたタイプの武器が装備中か判定 (再定義)
Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(function(weapon) {
        return weapon.wtypes.contains(wtypeId);
    });
};
