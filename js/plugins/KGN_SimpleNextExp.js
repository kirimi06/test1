//=============================================================================
// KGN_SimpleNextExp.js
// Ver 1.01		YEPでメニューTPをfalseにしてる時はTP表示OFF
//=============================================================================

/*:
 * @plugindesc メニュー画面に次のレベルまでのEXPを表示する。それに伴いステートアイコン位置の変更も。
 * @author きぎぬ
 * 
 * @help 
 * いろいろと再定義してるため、競合しまくることでしょう。頑張れ。
 * YEP_CoreEngineに対応させたはずです。このスクリプトはその下に。
 * バグとか自分じゃ太刀打ちできないので、自力で、どうぞ。
 * 
 * HP： http://r3jou.web.fc2.com/
 */

var Imported = Imported || {}; //なんかこれ入れるとうまくいく。何故か。
Imported.KGN_SimpleNextExp = true;




if(Imported.YEP_CoreEngine && eval(Yanfly.Param.MenuTpGauge)){//YEPを使用する場合
	//Yanfly.Param.TextPadding = 0;//0のほうがいいんじゃないかなあ。
	var tekitou_x = 48;

	Window_Base.prototype.drawActorLevel = function(actor, x, y) {
		this.changeTextColor(this.systemColor());
		var dw1 = this.textWidth(TextManager.levelA);
		this.drawText(TextManager.levelA, x, y, dw1);
		this.resetTextColor();
		var level = Yanfly.Util.toGroup(actor.level);
		var dw2 = this.textWidth(Yanfly.Util.toGroup(actor.maxLevel()));
		this.drawText(level, x + dw1, y, dw2, 'right');
	};

	Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
		var lineHeight = this.lineHeight();
		var xpad = Window_Base._faceWidth + (2 * Yanfly.Param.TextPadding);
		var x2 = x + xpad - this.textPadding() + tekitou_x;
		var width2 = Math.max(200, width - xpad) - tekitou_x;

		var expTotal = TextManager.expTotal.format(TextManager.exp);
		var expNext = TextManager.expNext.format(TextManager.level);


		var value1 = actor.currentExp();
		var value2 = actor.nextRequiredExp();
		if (actor.isMaxLevel()) {
	    	value1 = '-------';
	    	value2 = '-------';
	    } else {
			value1 = Yanfly.Util.toGroup(value1);
			value2 = Yanfly.Util.toGroup(value2);
		}

		this.drawActorName(actor, x, y);
		this.drawActorLevel(actor, x, y + lineHeight * 1);
		this.drawActorIcons(actor, x + 64, y + lineHeight * 1);

		this.changeTextColor(this.systemColor());
		this.drawText('Next ', x, y + lineHeight * 2, 166);//
		this.resetTextColor();
		this.drawText(value2, x, y + lineHeight * 2, 166, 'right');//

		this.drawActorClass(actor, x2, y, width2);
		this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
		this.drawActorMp(actor, x2, y + lineHeight * 2, width2);

		if (eval(Yanfly.Param.MenuTpGauge)) {
			this.drawActorTp(actor, x2, y + lineHeight * 3, width2);
		}
	};
}








else{//YEPを使用しない場合

	Window_Base.prototype.drawActorLevel = function(actor, x, y) {
	    this.changeTextColor(this.systemColor());
	    this.drawText(TextManager.levelA, x, y, 48);
	    this.resetTextColor();
	    this.drawText(actor.level, x + 28, y, 36, 'right');
	};

	Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
	    var lineHeight = this.lineHeight();
	    var x2 = x + 180;
	    var width2 = Math.min(200, width - 180 - this.textPadding());

	    var expTotal = TextManager.expTotal.format(TextManager.exp);
	    var expNext = TextManager.expNext.format(TextManager.level);

	    var value1 = actor.currentExp();
	    var value2 = actor.nextRequiredExp();
	    if (actor.isMaxLevel()) {
	        value1 = '-------';
	        value2 = '-------';
	    }

	    this.drawActorName(actor, x, y);
	    this.drawActorLevel(actor, x, y + lineHeight * 1);
	    this.drawActorIcons(actor, x + 64, y + lineHeight * 1);
	    this.changeTextColor(this.systemColor());
	    this.drawText('Next ', x, y + lineHeight * 2, 166);//
	    this.resetTextColor();
	    this.drawText(value2, x, y + lineHeight * 2, 166, 'right');//
	    this.drawActorClass(actor, x2, y);
	    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
	    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
	};
}