//=============================================================================
// EquipSlots.js
// Version: 0.02
//=============================================================================
/*:
 * @plugindesc Change of equipment slot
 * @author karakasr_dool
 *
 * @param SLOTS_OP
 * @desc Array of equipment type
 * @default false
 * @help And the array size , and that you have the same number of equipment types.
 * It is not reflected in the editor .
 * The case of changing the location to be set in the editor side equipment is lost.
 * 
 * To set the equipment is carried out in the memo field of the actor
 * Format , "<new_equips: Array >"
 * To specify a null To use the value of the editor .
 * 
 * 
 * SLOTS_OP = [1,5,5,5,5]
 * <new_equips:[null,4,4,4,4]>
 *
 * If you want to change individually
 * Enabled by actors and class
 * class > actors > SLOTS_OP
 * Format , "<slots_op: Array >"
 * 
 * <slots_op:[1,2,5,5]>
 */
/*:ja
 * @plugindesc 装備スロットの変更
 * @author 唐傘ドール
 * @param SLOTS_OP
 * @desc 装備タイプの配列
 * @default false
 * @help 配列サイズと、装備タイプ数を同じにしておくこと。
 * エディタには反映されません。
 * 場所を変えた場合は、エディタ側で設定しても、装備は失われます
 * 
 * 装備を設定するには、アクターのメモ欄で行う。
 * 書式は、"<new_equips:配列>"
 * エディタの値を使うにはnullを指定する。
 * 
 * 
 * SLOTS_OP = [1,5,5,5,5,5]
 * <new_equips:[null,4,4,4,4]>
 * アクターとクラスで有効
 * 個別に変更する場合
 * 
 * 書式は、 "<slots_op:配列>"
 * 
 * <slots_op:[1,2,5,5]>
 */

(function() {
    var parameters = PluginManager.parameters('EquipSlots');
    var data = eval(parameters['SLOTS_OP'] || 'false');

	Game_Actor.prototype.equipSlots = function() {
	    var slots = [];
	    var slots_op = this.currentClass().meta.slots_op || this.actor().meta.slots_op;
	    if(slots_op){
	    	slots_op = eval(slots_op);
		    for (var i = 0; i < slots_op.length; i++) {
		        slots.push(slots_op[i]);
		    }
	    	return slots;
		}
	    if(data){
		    for (var i = 0; i < $dataSystem.equipTypes.length - 1; i++) {
		        slots.push(data[i]);
		    }
	    }else{
		    for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
		        slots.push(i);
		    }
	    }
	    if (slots.length >= 2 && this.isDualWield()) {
	        slots[1] = 1;
	    }
	    return slots;
	};
	
	Game_Actor.prototype.initEquips = function(equips) {
	    var slots = this.equipSlots();
	    var maxSlots = slots.length;
	    this._equips = [];
	    for (var i = 0; i < maxSlots; i++) {
	        this._equips[i] = new Game_Item();
	    }
	    var new_equips = this.actor().meta.new_equips;
	    if(new_equips){
	    	new_equips = eval(new_equips);
		    for (var j = 0; j < equips.length; j++) {
		        if (j < maxSlots) {
		        	if(new_equips[j]){
		        		this._equips[j].setEquip(slots[j] === 1, new_equips[j]);
		        	}else{
		            	this._equips[j].setEquip(slots[j] === 1, equips[j]);
		            }
		        }
		    }
	    }else{
		    for (var j = 0; j < equips.length; j++) {
		        if (j < maxSlots) {
		            this._equips[j].setEquip(slots[j] === 1, equips[j]);
		        }
		    }
	    }
	    this.releaseUnequippableItems(true);
	    this.refresh();
	};

	Game_Actor.prototype.changeClass = function(classId, keepExp) {
		var actor_slots_op = (this.actor().meta.slots_op && eval(this.actor().meta.slots_op)) || data;
		actor_slots_op = !actor_slots_op ? $dataSystem.equipTypes.length - 1 : actor_slots_op.length;
		
		var class_slots_op = eval(this.currentClass().meta.slots_op || "[]").length;
		var new_class_slots_op = eval($dataClasses[classId].meta.slots_op || "[]").length;
		
		var old_slots = class_slots_op === 0 ? actor_slots_op :  class_slots_op;
		var new_slots = new_class_slots_op === 0 ? actor_slots_op :  new_class_slots_op;
		if(old_slots > new_slots){
		    for (var i = new_slots; i < old_slots; i++) {
		        if (this.isEquipChangeOk(i)) {
		            this.changeEquip(i, null);
		        }
		    }
		}else if(old_slots < new_slots){
		    for (var i = old_slots; i < new_slots; i++) {
		        this._equips[i] = new Game_Item();
		    }
		}
	    if (keepExp) {
	        this._exp[classId] = this._exp();
	    }
	    this._classId = classId;
	    this.changeExp(this._exp[this._classId] || 0, false);
	    this.refresh();
	};
})();

