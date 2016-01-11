//=============================================================================
// TMVplugin - スキルコスト拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.1b
// 最終更新日: 2015/12/31
//=============================================================================

/*:
 * @plugindesc ＭＰやＴＰの代わりにＨＰやアイテムを消費するスキルを
 * 設定できるようになります。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help
 * スキルのメモ欄にタグを書き込むことでコストを追加できます。
 *
 * データベースで 消耗しない に設定したアイテムをコストとした場合、
 * スキル使用時に必要だが消費はしないという扱いになります。
 *
 * ＨＰをコストとして設定した場合、残りＨＰがコストと同値では
 * 使用できません。ただし、スキルに hpCostNoSafety タグがある場合は
 * 残りＨＰがコスト以下でもスキルが使用できます。
 * 当然使用したアクターは戦闘不能になります。
 *
 * 経験値をコストとして設定し、一緒に expCostNoLevelDown タグを
 * 設定している場合、コストの支払いによってレベルが下がる状況では
 * スキルの使用ができなくなります。
 *
 * メモ欄タグ（スキル）:
 *   <hpCost:10>          # スキルのコストとしてＨＰ１０を設定
 *   <hpRateCost:50>      # スキルのコストとして最大ＨＰの５０％を設定
 *   <hpCostNoSafety>     # ＨＰコスト支払いによる戦闘不能を許可する
 *   <mpRateCost:100>     # スキルのコストとして最大ＭＰの１００％を設定
 *   <mpCostNoMcr>        # ＭＰコストから特徴『ＭＰ消費率』の効果を除外
 *   <itemCost:I1*2>      # スキルのコストとしてアイテム１番２個を設定
 *   <itemCost:W2*1>      # スキルのコストとして武器２番１個を設定
 *   <itemCost:A5*1>      # スキルのコストとして防具５番１個を設定
 *   <expCost:50>         # スキルのコストとして経験値５０を設定
 *   <expCostNoLevelDown> # 経験値コストによるレベルダウンを禁止
 *   <goldCost:100>       # スキルのコストとしてお金１００Ｇを設定
 *   <vnCost:3*1>         # スキルのコストとしてゲーム変数３番の値１を設定
 *
 * プラグインコマンドはありません。
 * 
 */

var Imported = Imported || {};
Imported.TMSkillCostEx = true;

(function() {

  var parameters = PluginManager.parameters('TMSkillCostEx');
  
  //-----------------------------------------------------------------------------
  // Game_BattleBase
  //

  Game_BattlerBase.prototype.skillHpCost = function(skill) {
    var result = 0;
    if (skill.meta.hpCost) {
      result += Number(skill.meta.hpCost);
    }
    if (skill.meta.hpRateCost) {
      result += Math.floor(Number(skill.meta.hpRateCost) * this.mhp / 100);
    }
    return result;
  };
  
  Game_BattlerBase.prototype.skillMpCost = function(skill) {
    var result = skill.mpCost;
    if (skill.meta.mpRateCost) {
      result += Number(skill.meta.mpRateCost) * this.mmp / 100;
    }
    if (!skill.meta.mpCostNoMcr) {
      result *= this.mcr;
    }
    return Math.floor(result);
  };

  Game_BattlerBase.prototype.skillItemCost = function(skill) {
    if (skill.meta.itemCost) {
      var re = /(i|w|a)(\d+)\*(\d+)/i;
      var match = re.exec(skill.meta.itemCost);
      if (match) {
        var itemCost = {};
        switch(match[1].toUpperCase()) {
        case 'I':
          itemCost.item = $dataItems[Number(match[2])];
          break;
        case 'W':
          itemCost.item = $dataWeapons[Number(match[2])];
          break;
        case 'A':
          itemCost.item = $dataArmors[Number(match[2])];
          break;
        }
        itemCost.num = Number(match[3]);
        return itemCost;
      }
    }
    return null;
  };

  Game_BattlerBase.prototype.skillExpCost = function(skill) {
    if (!this.isEnemy() && skill.meta.expCost) {
      return Number(skill.meta.expCost);
    }
    return 0;
  };
  
  Game_BattlerBase.prototype.skillGoldCost = function(skill) {
    if (!this.isEnemy() && skill.meta.goldCost) {
      return Number(skill.meta.goldCost);
    }
    return 0;
  };
  
  Game_BattlerBase.prototype.skillVNumberCost = function(skill) {
    if (skill.meta.vnCost) {
      var re = /(\d+)\*(\d+)/i;
      var match = re.exec(skill.meta.vnCost);
      if (match) {
        var vnCost = {};
        vnCost.index = Number(match[1]);
        vnCost.num = Number(match[2]);
        return vnCost;
      }
    }
    return null;
  };

  var _Game_BattleBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
  Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    if (!this.canPaySkillHpCost(skill) ||
        !this.canPaySkillItemCost(skill) ||
        !this.canPaySkillExpCost(skill) ||
        !this.canPaySkillGoldCost(skill) ||
        !this.canPaySkillVNumberCost(skill)) {
      return false;
    }
    return _Game_BattleBase_canPaySkillCost.call(this, skill);
  };

  Game_BattlerBase.prototype.canPaySkillHpCost = function(skill) {
    if (!skill.meta.hpCostNoSafety && this._hp <= this.skillHpCost(skill)) {
      return false;
    }
    return true;
  };
  
  Game_BattlerBase.prototype.canPaySkillItemCost = function(skill) {
    var itemCost = this.skillItemCost(skill);
    if (itemCost && itemCost.num > $gameParty.numItems(itemCost.item)) {
      return false;
    }
    return true;
  };
  
  Game_BattlerBase.prototype.canPaySkillExpCost = function(skill) {
    var expCost = this.skillExpCost(skill);
    if (expCost) {
      if (this.currentExp() < expCost) {
        return false;
      }
      if (skill.meta.expCostNoLevelDown &&
          this.currentExp() - expCost < this.currentLevelExp()) {
        return false;
      }
    }
    return true;
  };
  
  Game_BattlerBase.prototype.canPaySkillGoldCost = function(skill) {
    return $gameParty.gold() >= this.skillGoldCost(skill);
  };
  
  Game_BattlerBase.prototype.canPaySkillVNumberCost = function(skill) {
    var vnCost = this.skillVNumberCost(skill);
    if (vnCost && vnCost.num > $gameVariables.value(vnCost.index)) {
      return false;
    }
    return true;
  };
  
  var _Game_BattleBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
  Game_BattlerBase.prototype.paySkillCost = function(skill) {
    this._hp -= Math.min(this.skillHpCost(skill), this._hp);
    var itemCost = this.skillItemCost(skill);
    if (itemCost && this.isItemCostValid(itemCost.item)) {
      $gameParty.loseItem(itemCost.item, itemCost.num, false)
    }
    var expCost = this.skillExpCost(skill);
    if (expCost) {
      var newExp = this.currentExp() - expCost;
      this.changeExp(newExp, this.shouldDisplayLevelUp());
    }
    $gameParty.loseGold(this.skillGoldCost(skill));
    var vnCost = this.skillVNumberCost(skill);
    if (vnCost) {
      var n = $gameVariables.value(vnCost.index) - vnCost.num;
      $gameVariables.setValue(vnCost.index, n);
    }
    _Game_BattleBase_paySkillCost.call(this, skill);
  };
  
  Game_BattlerBase.prototype.isItemCostValid = function(item) {
    if (DataManager.isItem(item) && !item.consumable) {
      return false;
    }
    return true;
  };

})();
