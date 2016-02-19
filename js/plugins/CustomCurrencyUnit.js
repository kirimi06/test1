//=============================================================================
// CustomCurrencyUnit.js
// ----------------------------------------------------------------------------
// <利用規約>
//  利用はRPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
//  商用、非商用、ゲームの内容を問わず利用可能です。
//  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
//  二次配布や転載は禁止します。
//  ソースコードURL、ダウンロードURLへの直接リンクも禁止します。
//  不具合対応以外のサポートやリクエストは受け付けておりません。
//  スクリプト利用により生じたいかなる問題においても、一切責任を負いかねます。
// ----------------------------------------------------------------------------
//  Ver1.00  2016/01/24  初版
//=============================================================================

/*:
 * @plugindesc 通過単位を、任意の文字列に変更します。
 * @author こま
 *
 * @param Unit Variable Number
 * @desc 通貨単位を設定する変数を、番号で指定してください。
 * @default 0
 *
 * @help
 * Unit Variable Numberで指定した変数に設定された文字列を通貨単位として使用します。
 * 変数へ通貨単位設定は、イベントコマンドの「変数の操作」で行ってください。
 *
 * [通貨単位を「円」に設定する例]
 * イベントコマンド：変数の操作
 *  <変数>       単独　     0001
 *  <操作>       代入
 *  <オペランド> スクリプト '円'
 *
 * *このプラグインには、プラグインコマンドはありません。
 */

(function(){
    var Params = PluginManager.parameters('CustomCurrencyUnit');
    var UnitVariableNumber = Number(Params['Unit Variable Number']) || 0;

    Object.defineProperty(TextManager, 'currencyUnit', {
        get: function() {
            if (UnitVariableNumber > 0) {
                return $gameVariables.value(UnitVariableNumber);
            }
            return $dataSystem.currencyUnit;
        },
        configurable: true
    });
}());
