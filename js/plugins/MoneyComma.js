//=============================================================================
// MoneyComma.js
// Version: 0.03
//=============================================================================
/*:
 * @plugindesc Put a comma in the amount of money
 * @author karakasr_dool
 *
 * @param MENU_OP
 * @desc Share the price
 * @default false
 */
/*:ja
 * @plugindesc 金額にカンマをつける
 * @author 唐傘ドール
 *
 * @param MENU_OP
 * @desc 値段を共有する
 * @default false
 * @help ?
 */

(function() {
    var parameters = PluginManager.parameters('MoneyComma');
    var flag = parameters['MENU_OP'] === "true";
    Window_Gold.prototype.refresh = function() {
	    var x = this.textPadding();
	    var width = this.contents.width - this.textPadding() * 2;
	    this.contents.clear();
	    this.drawCurrencyValue(String(this.value()).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ), this.currencyUnit(), x, 0, width);
	};

	Window_ShopNumber.prototype.drawTotalPrice = function() {
	    var total = this._price * this._number;
	    var width = this.contentsWidth() - this.textPadding();
	    this.drawCurrencyValue(String(total).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ), this._currencyUnit, 0, this.priceY(), width);
	};
	
	if(flag){
		Window_ShopBuy.prototype.drawItem = function(index) {
		    var item = this._data[index];
		    var rect = this.itemRect(index);
		    var priceWidth = 96;
		    rect.width -= this.textPadding();
		    this.changePaintOpacity(this.isEnabled(item));
		    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
		    this.drawText(String(this.price(item)).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ), rect.x + rect.width - priceWidth,
		                  rect.y, priceWidth, 'right');
		    this.changePaintOpacity(true);
		};
	}else{
		Window_ShopBuy.prototype.drawItem = function(index) {
		    var item = this._data[index];
		    var rect = this.itemRect(index);
		    var priceWidth = 96;
		    rect.width -= this.textPadding();
		    this.changePaintOpacity(this.isEnabled(index));
		    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
		    this.drawText(String(this.price2(index)).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' ), rect.x + rect.width - priceWidth,
		                  rect.y, priceWidth, 'right');
		    this.changePaintOpacity(true);
		};
		
		Window_ShopBuy.prototype.isCurrentItemEnabled = function() {
		    return this.isEnabled(this.index());
		};

		Window_ShopBuy.prototype.isEnabled = function(index) {
			var item = this._data[index];
		    return (item && this.price2(index) <= this._money &&
		            !$gameParty.hasMaxItems(item));
		};
		
		Window_ShopBuy.prototype.price_index = function() {
		    return this._price[this.index()] || 0;
		};
		Window_ShopBuy.prototype.price2 = function(index) {
		    return this._price[index] || 0;
		};
		Scene_Shop.prototype.buyingPrice = function() {
		    return this._buyWindow.price_index();
		};
	}
	
})();
