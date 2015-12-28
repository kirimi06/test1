//
//  フェイズスキル特徴 ver1.02
//
// author yana
//

var Imported = Imported || {};
Imported['PhaseSkillTrait'] = 1.02;

/*:
 * @plugindesc ver1.02/条件を満たすと戦闘開始時やターン開始時、ターン終了時等にスキルを発動する特徴を設定できるようになります。
 * @author Yana
 * 
 * @param Invoke Count
 * @desc それぞれのフェイズでスキル(アイテム)が発動する最大数です。
 * @default 1
 * 
 * @param Invoke Count Subject
 * @desc それぞれのフェイズで一人がスキル(アイテム)が発動できる最大数です。
 * @default 1
 * 
 * @param Sort Type
 * @desc 発動順の並び替えの種類です。
 * 0:味方→敵の順、1:0の逆順、2:行動速度順、3:ランダム
 * @default 2
 * 
 * @param Battle Start Skill Text
 * @desc 戦闘開始時に発動した時のテキスト。_nameが発動者名に
 * _mes1,_mes2がスキルのメッセージ1、2行目に置き換わります。
 * @default \C[10]_nameの先制スキルが発動した！
 * 
 * @param Turn Start Skill Text
 * @desc ターン開始時に発動した時のテキスト。_nameが発動者名に
 * _mes1,_mes2がスキルのメッセージ1、2行目に置き換わります。
 * @default _nameのスタートフェイズスキルが発動した！
 * 
 * @param Turn End Skill Text
 * @desc ターン終了時に発動した時のテキスト。_nameが発動者名に
 * _mes1,_mes2がスキルのメッセージ1、2行目に置き換わります。
 * @default _nameのエンドフェイズスキルが発動した！
 * 
 * @param Is Display Use Log
 * @desc フェイズスキル発動時に使用ログを表示するかの設定です。
 * true/falseで設定してください。
 * @default false
 * 
 * @help ------------------------------------------------------
 * 注意
 * ------------------------------------------------------
 * 
 * ・このプラグインの動作には、ConditionallyCoreのプラグインが必要です。
 * ・ConditionallyCoreよりも下に配置してください。
 * ・自身やパーティ、トループ単位以外の対象が必要な条件は、正常に動作しない可能性があります。
 * 
 * ------------------------------------------------------
 * このプラグインにプラグインコマンドはありません。
 * ------------------------------------------------------
 * ------------------------------------------------------
 * 設定方法
 * ------------------------------------------------------
 * アクターやクラス、装備やステートといった特徴を持つオブジェクトのメモ欄に、
 * 発動タイミングに合わせて以下のように記述します。
 * 
 * ※戦闘開始時に発動する場合
 * <バトルスタートフェイズ:xy,z%>
 * この間に条件を記述
 * </バトルスタートフェイズ>
 * 
 * ※ターン開始時に発動する場合
 * <ターンスタートフェイズ:xy,z%>
 * この間に条件を記述
 * </ターンスタートフェイズ>
 * 
 * ※ターン終了時に発動する場合
 * <ターンエンドフェイズ:xy,z%>
 * この間に条件を記述
 * </ターンエンドフェイズ>
 * 
 * 使用可能な条件はConditionallyCoreに準拠します。
 * 
 * xにはIまたはSが入ります。Iを入れた場合はアイテムが、Sを入れた場合はスキルが発動します。
 * yにはアイテムまたはスキルのIDを指定します。
 * zには発動率を設定します。
 * ------------------------------------------------------
 * 仕様と解説
 * ------------------------------------------------------
 * ・注意にも記載しましたが、発動のタイミングの関係上、対象が必要な条件は対象が不明のため、
 * 正常に動作しない可能性が高いです。(一応、対象を作成し、一番先頭の対象で条件判定を行います)
 * ・この機能で発動したアイテムやスキルにはコストが発生しません。
 * ・解説には記載されていませんが、発動時のテキストには_item(発動したスキル・アイテム名に変換)を使用することができます。
 * ・発動時のテキストはnullと記述することで非表示にすることができます。
 * ------------------------------------------------------
 * 利用規約：特になし。素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.02:
 * 使用ログを表示しない設定を追加。
 * ver1.01:
 * 条件追加効果と併用時、特定の状況下でエラーが発生するバグを修正。
 * ver1.00:
 * 公開
 */

(function(){
	
	var parameters = PluginManager.parameters('PhaseSkillTrait');
	var invokeCount = Number(parameters['Invoke Count']) || 1;
	var invokeCountSubject = Number(parameters['Invoke Count Subject']) || 1;
	var sortType = Number(parameters['Sort Type']) || 2;
	var battleStartSkillText = String(parameters['Battle Start Skill Text'] || '_nameの先制スキルが発動した！');
	var turnStartSkillText = String(parameters['Turn Start Skill Text'] || '_nameのスタートフェイズスキルが発動した！');
	var turnEndSkillText = String(parameters['Turn End Skill Text'] || '_nameのエンドフェイズスキルが発動した！');
	var isDisplayUseLog = String(parameters['Is Display Use Log']) === 'true';
	
	function SESkillManager() {
    	throw new Error('This is a static class');
	}
	
	SESkillManager.initCond = function(note){
		var texts = note.split('\n');
		var flag = false;
		var result = [];
		for(var i=0;i<texts.length;i++){
			if (flag){
				if (texts[i].match(/^<\/(?:バトル|ターン)(?:スタート|エンド)フェイズ>/)){
					result.push(effect);
					flag = false;
				}else{
					effect['conditions'].push(ConditionallyManager.makeCondition(texts[i]));
				}
			}else if (texts[i].match(/^<((?:バトル|ターン))((?:スタート|エンド))フェイズ:([IS])(\d+),(\d+)[%％]>/)){
				var effect = {
					'var':RegExp.$1+RegExp.$2,
					'type':RegExp.$3,
					'id':parseInt(RegExp.$4),
					'rate':parseInt(RegExp.$5),
					'conditions':[]
					};
				flag = true;
			}
		}
		return result;
	};
	
	var _SaEPS_BManager_startBattle = BattleManager.startBattle;
	BattleManager.startBattle = function() {
		this._startTurn = true;
		_SaEPS_BManager_startBattle.call(this);
    };
    
    var _SaEPS_BManager_update = BattleManager.update;
    BattleManager.update = function() {
    	if (this._startTurn && this._phase === 'start'){
    		if (!this.isBusy() && !this.updateEvent()) {
    			this._saepPhase = 'battleStart';
    			this.executeSaepAction();
    		}
    	}else{
    		_SaEPS_BManager_update.call(this);
    	}
    };
    
    var _SaEPS_BManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
    	_SaEPS_BManager_startTurn.call(this);
    	this._saepPhase = 'turnStart';
    	this.executeSaepAction();
    };
    
    var _SaEPS_BManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function() {
    	if (!this._saepTurnEnd){
    		this._saepTurnEnd = true;
    		this._saepPhase = 'turnEnd';
    		this.executeSaepAction();
    	}
    	if (this._phase !== 'action'){
    		this._saepTurnEnd = false;
    		_SaEPS_BManager_endTurn.call(this);
    	}
	};
    
    var _SaEPS_BManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
    	if (this._saepActions && this._saepActions.length > 0){
    		this.executeSaepAction();
    	}else{
    		if (this._startTurn){
    			this._logWindow.endAction(this._subject);
    			this._phase = 'start';
    			this._startTurn = false;
    		}else{
    			_SaEPS_BManager_endAction.call(this);
    		}
    		if (this._endSaep){ 
    			this._endSaep = false;
    			this._subject = null;
    			this._saepPhase = null;
    		}
    	}
	};
    
    BattleManager.executeSaepAction = function() {
    	var phase = this._saepPhase;
    	if ((this.saepActions && this.saepActions.length > 0) || this.checkSaepAction(phase)){
    		console.log(2)
    		for(;;){
    			if ($gameParty.isAllDead() || $gameTroop.isAllDead()){
    				this._saepActions = [];
    				return;
    			}
    			if (this._saepActions.length === 0){
    				return
    			}
    			var params = this._saepActions.shift();
    			var subject = params[0];
    			var action = params[1];
    			
    			if (this._saepActions.length === 0){ this._endSaep = true }
    			if (subject.isAlive()){
    				this.startSaepAction(subject,action,phase);
    				return;
       			}
    		}
    		if (this._startTurn){ this._startTurn = false }
    	}else{
    		this._saepPhase = null;
    		if (this._startTurn){ this._startTurn = false }
    	}
    };
    
    BattleManager.checkSaepAction = function(phase) {
    	if (this._saepActions && this._saepActions.length > 0){ return true }
    	this._saepActions = [];
    	var members = this.allBattleMembers();
    	members.sort(function(a,b){
    		if (sortType === 2){
    			if (!a.speed()){a.makeSpeed()}
    			if (!b.speed()){b.makeSpeed()}
    			var as = a.speed();
    			var bs = b.speed();
    			if (as === Infinity){ as = a.agi }
    			if (bs === Infinity){ bs = b.agi }
    			
    			if (as < bs) return 1;
    			if (as > bs) return -1;
    		} else if (sortType === 3){
    			return (Math.randomInt(3) - 1);
    		}
    		return 0;
    	});
    	if (sortType === 1){ members = members.reverse() }
    	for (var i=0;i<members.length;i++){
    		var acnCount = 0;
    		var user = members[i];
    		var traits = user.traitObjects();
    		for (var j=0;j<traits.length;j++){
    			var trait = traits[j];
    			trait._condSaep = trait._condSaep || SESkillManager.initCond(trait.note);
    			for (var k=0;k<trait._condSaep.length;k++){
    				var cond = trait._condSaep[k];
   					if (this.checkPhase(phase,cond) && Math.random() < (cond['rate'] / 100)){
   						var action = this.makeSaepAction(user,cond);
   						var target = action.makeTargets()[0];
   						if (ConditionallyManager.checkConditions(user,target,cond['conditions'])){
    						this._saepActions.push([user,action]);
    						acnCount++;
    						if (this._saepActions.length >= invokeCount){ return true }
    						if (acnCount >= invokeCountSubject){ break }
    					}
    				}
    			}
    			if (acnCount >= invokeCountSubject){ break }
    		}
    	}
    	return this._saepActions.length === 0 ? false : true;
    };
    
    BattleManager.checkPhase = function(phase,cond) {
    	var condPhase = '';
    	switch(cond['var']){
    	case 'バトルスタート':
    		condPhase = 'battleStart';
    		break;
    	case 'ターンスタート':
    		condPhase = 'turnStart';
    		break;
    	case 'ターンエンド':
    		condPhase = 'turnEnd';
    		break;
    	}
    	return phase === condPhase;
    };
    
    BattleManager.makeSaepAction = function(subject,cond){
    	var action = new Game_Action(subject);
    	switch(cond['type']){
    	case 'I':
    		action.setItem(cond['id']);
    		break;
    	case 'S':
    		action.setSkill(cond['id']);
    		break;
    	};
    	return action;
    };
    
    BattleManager.startSaepAction = function(subject,action,phase){
    	this._subject = subject;
    	if (!this._subject._actions){
    		this._subject.makeActions();
    	}
    	this._subject._actions.unshift(action);
    	this._logWindow.displayPhaseSkill(subject,action.item(),phase);
    	this._callSaep = true;
    	this.startAction();
    	this._subject.removeCurrentAction();
    	this._callSaep = false;
    };
    
    Window_BattleLog.prototype.displayPhaseSkill = function(subject,item,phase){
    	var text = battleStartSkillText;
    	if (phase === 'turnStart'){ text = turnStartSkillText }
    	if (phase === 'turnEnd'){ text = turnEndSkillText }
    	if (text && text != 'null') {
    		if (DataManager.isSkill(item)){
    			text = text.replace('_mes1',item.message1);
    			text = text.replace('_mes2',item.message2);
    		}
    		text = text.replace('_name',subject.name());
    		text = text.replace('_item',item.name);
        	this.push('addText', text);
        	this.push('wait');
        	this.push('clear');
    	}
	};
	
	var _SaEPS_WBattleLog_displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item){
    	if (!isDisplayUseLog && BattleManager._callSaep){
			this.push('wait');
    		return;
    	}
    	_SaEPS_WBattleLog_displayAction.call(this,subject,item);
	};
	// フェイズスキルには消費が発生しない
	var _SaEPS_GBattler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		if (BattleManager._callSaep){ return }
		_SaEPS_GBattler_useItem.call(this,item);
	};
}());
