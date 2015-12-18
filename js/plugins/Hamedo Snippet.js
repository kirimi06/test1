//=============================================================================
// Hamedo.js
//=============================================================================

/*:
 * @plugindesc Hamedo  v.1.00
 * @author 1224Deko 
 * @param Multi States
 * @desc WIP - true = Can be state combined, flase = only one state will be activated
 * @default true 
 * 
 * @param Counter Attack
 * @desc Counter attack after taking damage
 * @default 101
 * 
 * @param First Strike
 * @desc First-Strike 
 * @default 102
 *
 * @param Forestall
 * @desc Evade and Counter state id
 * @default 103
 *
 * @param Double Strike
 * @desc Evade and Counter state id
 * @default 104
 *
 * @param Evade and Counter
 * @desc Evade and Counter state id
 * @default 105
 *
 * @param CounterSameSkill
 * @desc [WIP] Counter that same skill
 * @default 106
 *
 * @param CounterEvenDeath
 * @desc Deal counter dmg even if battler takes lethal damage
 * @default 107
 *
 * @help
 * This script/snippet overrides BattleManager.invokeAction
 * Free for comercial, and non comercial uses... Credits only needed for comercial uses...
 *
 *
 * Multi-counter states	: Work in Progress....
 *
 * Counter Mechanism:
 *	
 *   Counter-Attack     : default mechanism actor countering after taking damage, added for priority, example you can create state that nullifies all counter states and make default counter mechanism
 *   First Strike     	: Countering before taking damage
 *   Forestall        	: Countering before taking damage if countering is succesfull, cancel action from countering skill
 *   Double-Strike		: counter twice times
 *   EAC- Evade and Counter : battler evades attack then countering 
 *  [WIP] CounterSameSkill   : Countering same skill
 *   CounterEvenDeath   : Battler will counter even if it take lethal damages
 */


(function () {

	 var parameters = PluginManager.parameters('Hamedo');
     var dekomulti = String(parameters['Multi States'] || 'true');
    var dekoeac = Number(parameters['Evade and Counter'] || '105');
    var dekodstrike = Number(parameters['Double Strike'] || '104');
    var dekoforestall = Number(parameters['Forestall'] || '103');
    var dekohamedo = Number(parameters['First Strike'] || '102');
    var dekodcounter = Number(parameters['Counter Attack'] || '101');
    var dekosameskill = Number(parameters['CounterSameSkill'] || '106');
    var dekoevendeath = Number(parameters['CounterEvenDeath'] || '107');




BattleManager.invokeAction = function(subject, target) {
    this._logWindow.push('pushBaseLine');



    if (Math.random() < this._action.itemCnt(target)) {
        //if multipel states is true
        if (dekomulti === 'true'){

            // if target has counter attack
             if (target._states.contains(dekodcounter)){
                this.invokeNormalAction(subject, target);
                if(target.hp > 0){
                this.invokeCounterAttack(subject, target);}
            // if target has state Evade and Counter
            } else if (target._states.contains(dekoeac)){
                this.invokeCounterAttack(subject, target);
            // if target has state Double Strike
            } else if (target._states.contains(dekodstrike)){
                this.invokeCounterAttack(subject, target);
                if(subject.hp > 0){
            this.invokeNormalAction(subject, target); }                
                if(target.hp > 0){
            this.invokeCounterAttack(subject, target);}
            // if target has state Forestall
            } else if (target._states.contains(dekoforestall)){
            	dekocshpsub = subject.hp
                this.invokeCounterAttack(subject, target);
                 if(subject.hp >= dekocshpsub){
                this.invokeNormalAction(subject, target);}
            // if target has state First Strike
            } else if (target._states.contains(dekohamedo)){
                this.invokeCounterAttack(subject, target);
                if(subject.hp > 0){
                this.invokeNormalAction(subject, target);}
            // if target has state same skill counter
            } else if (target._states.contains(dekosameskill)){
                this.invokeNormalAction(subject, target);
                if(target.hp > 0){
                this.invokeCounterAttack(subject, target);}
            // if target has state even death
            } else if (target._states.contains(dekoevendeath)){
                this.invokeNormalAction(subject, target);
                this.invokeCounterAttack(subject, target);
            } else {
                this.invokeNormalAction(subject, target);
                if(target.hp > 0){
                this.invokeCounterAttack(subject, target);}

            }


        // else if multiple states is off(false, or isn't "true")
        } else {
            // if target has counter attack
             if (target._states.contains(dekodcounter)){
                this.invokeNormalAction(subject, target);
                if(target.hp > 0){
                this.invokeCounterAttack(subject, target);}
            // if target has state Evade and Counter
            } else if (target._states.contains(dekoeac)){
                this.invokeCounterAttack(subject, target);
            // if target has state Double Strike
            } else if (target._states.contains(dekodstrike)){
                this.invokeCounterAttack(subject, target);
                if(subject.hp > 0){
            this.invokeNormalAction(subject, target); }                
                if(target.hp > 0){
            this.invokeCounterAttack(subject, target);}
            // if target has state Forestall
            } else if (target._states.contains(dekoforestall)){
            	dekocshpsub = subject.hp
                this.invokeCounterAttack(subject, target);
                 if(subject.hp >= dekocshpsub){
                this.invokeNormalAction(subject, target);}
            // if target has state First Strike
            } else if (target._states.contains(dekohamedo)){
                this.invokeCounterAttack(subject, target);
                if(subject.hp > 0){
                this.invokeNormalAction(subject, target);}
            // if target has state same skill counter
            } else if (target._states.contains(dekosameskill)){
                this.invokeNormalAction(subject, target);
                if(target.hp > 0){
                this.invokeCounterAttack(subject, target);}
            // if target has state even death
            } else if (target._states.contains(dekoevendeath)){
                this.invokeNormalAction(subject, target);
                this.invokeCounterAttack(subject, target);
            } else {
                this.invokeNormalAction(subject, target);
                if(target.hp > 0){
                this.invokeCounterAttack(subject, target);}

            }

        }


    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    this._logWindow.push('popBaseLine');
    this.refreshStatus();
};
// End of BattleManager.invokeAction
  })();  // dont touch this.