//=============================================================================
// GetText.js
// Version: 0.01
//=============================================================================
/*:
 * @plugindesc Items available message.
 * @author karakasr_dool
 * @param GET_TEXT
 * @desc Get the message
 * @default  you got
 * @param LOST_TEXT
 * @desc The lost messages
 * @default  I lost
 * @param OUNTER_TEXT
 * @desc Unit of item
 * @default 
 * @help
 *
  * To the script, $kkd_box = []; the notation.
  * It does to increase or decrease processing of items. ,
  * To the script, this.command_item_box(); it referred to the.
  *
  * If you want to specify a unit, to write in the memo field of the item
 * <counter:units>
 */
 // ↓:jpで日本語
/*:ja
 * @plugindesc アイテムの入手メッセージ.
 * @author 唐傘ドール
 * @param GET_TEXT
 * @desc 入手メッセージ
 * @default  を、手に入れた
 * @param LOST_TEXT
 * @desc 失ったメッセージ
 * @default  を、失った
 * @param OUNTER_TEXT
 * @desc アイテムの単位
 * @default 個
 * @help
 *
 * スクリプトに、$kkd_box = [];を表記。
 * アイテムの増減処理を行う。、
 * スクリプトに、this.command_item_box();を表記する。
 *
 * 単位を指定したい場合は、アイテムのメモ欄に書く
 * <counter:単位>
 */


var $kkd_box = null;
(function() {
    var parameters = PluginManager.parameters('GetText');
    var getText = parameters['GET_TEXT'] || "";
    var lostText = parameters['LOST_TEXT'] || "";
    var ounterText = parameters['OUNTER_TEXT'] || "";
	    
	Game_Message.prototype.add_plus = function(text) {
	    this._texts[this._texts.length - 1] += text;
	};

	Game_Interpreter.prototype.command_item_box = function() {
	    if (!$gameMessage.isBusy()) {
	        $gameMessage.setFaceImage('', 0);
	        $gameMessage.setBackground(1);
	        $gameMessage.setPositionType(1);

			var list = $kkd_box.filter(function(data) {
				return data[1] > 0;
			});
	        this.command_item_mess( list, getText);
	        
			list = $kkd_box.filter(function(data) {
				return data[1] < 0;
			});
	        this.command_item_mess( list, lostText);
	        
	        $kkd_box = null;
	        this.setWaitMode('message');
	    }

	};


	Game_Interpreter.prototype.command_item_log = function(item, value) {
	    if($kkd_box){
	    	for(var i = 0; i < $kkd_box.length; i++){
	    		var data = $kkd_box[i];
	    		if(data[0] === item){
	    			data[1] += value;
	    			return;
	    		}
	    	}
	    	$kkd_box.push([item, value]);
	    }
	};

	//counter
	Game_Interpreter.prototype.command_item_mess = function(list, op) {
		list.forEach(function(item) {
			var text = "";
			var n = Math.abs(item[1]);
			if(n > 1){
				if(item[0] === true){
					$gameMessage.add("\x1bC[4]" + n + "\x1bC[0]" + TextManager.currencyUnit);
					return;
				}else{
					var counter = item[0].meta.counter ? item[0].meta.counter : ounterText;
					text = n + counter;
				}
			}
			$gameMessage.add("\x1bC[4]" + item[0].name + "\x1bC[0]" + text);
		});
		if(list.length > 0){
			$gameMessage.add_plus(op);
		}
	};

	// Change Gold
	Game_Interpreter.prototype.command125 = function() {
	    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
	    $gameParty.gainGold(value);
	    this.command_item_log(true, value);
	    return true;
	};

	// Change Items
	Game_Interpreter.prototype.command126 = function() {
	    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
	    var item = $dataItems[this._params[0]];
	    $gameParty.gainItem(item, value);
	    this.command_item_log(item, value);
	    return true;
	};

	// Change Weapons
	Game_Interpreter.prototype.command127 = function() {
	    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
	    var item = $dataWeapons[this._params[0]];
	    $gameParty.gainItem(item, value, this._params[4]);
	    this.command_item_log(item, value);
	    return true;
	};

	// Change Armors
	Game_Interpreter.prototype.command128 = function() {
	    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
	    var item = $dataArmors[this._params[0]];
	    $gameParty.gainItem(item, value, this._params[4]);
	    this.command_item_log(item, value);
	    return true;
	};
})();

