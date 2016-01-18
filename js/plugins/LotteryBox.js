//=============================================================================
// LotteryBox.js
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
//  Ver1.00  2016/01/15  初版
//=============================================================================

/*:
 * @plugindesc ランダムでアイテムや装備、お金が手に入る抽選箱を提供します。
 * @author こま
 *
 * @param Result Variable Number
 * @desc 抽選の結果を保存する変数を、番号で指定してください。
 * （0：保存しない）
 * @default 0
 *
 * @param Name Variable Number
 * @desc 入手品の名前（お金の場合、金額）を保存する変数を、番号で指定してください。（0：保存しない）
 * @default 0
 *
 * @param Auto Empty Mode
 * @desc 抽選後、抽選箱を自動的に空にするかどうかを指定してください。
 * （ON：空にする / OFF：空にしない）
 * @default ON
 *
 * @help
 * 重要：「追加したチケットの有効範囲について」は必ずご一読ください。
 *
 * プラグインコマンド
 *  LotteryBox add item 1       # アイテムが当たるチケットを1枚追加します。
 *  LotteryBox add weapon 5     # 武器が当たるチケットを5枚追加します。
 *  LotteryBox add armor 10     # 防具が当たるチケットを10枚追加します。
 *  LotteryBox add gold:100 15  # 100Gが当たるチケットを15枚追加します。
 *  LotteryBox add lose 20      # ハズレチケットを20枚追加します。
 *
 *  LotteryBox add item:1 1     # ID=1のアイテムが当たるチケットを1枚追加します。
 *  LotteryBox add weapon:5 1   # ID=5の武器が当たるチケットを1枚追加します。
 *                                  *IDについては後述
 *
 *  LotteryBox add gold:100;200 1    # 100～200Gが当たるチケットを1枚追加します。
 *  LotteryBox add gold:100;200;10 1 # 100～200Gが当たるチケットを1枚追加します。
 *                                      *前者は1G単位、後者は10G単位
 *
 *  LotteryBox draw             # 抽選を実施します。
 *  LotteryBox empty            # 抽選箱を空にします。
 *
 * ------------
 *  IDについて
 * ------------
 *  アイテムや武器、防具にIDを割り振ることで、抽選対象を限定することができます。
 *  IDを割り振りたい対象のメモ欄に、
 *  <lotterybox_id:1>
 *  のように記述してください。
 *  例えば上記をポーションとマジックウォーターのメモ欄に記述し、
 *  「Lottery Box add item:1 1」とすると、ポーションかマジックウォーターが当たる
 *  チケットを1枚追加したことになります。
 *
 * ------------------
 *  抽選結果について
 * ------------------
 *  抽選結果は以下のようになります。
 *  ・ID未指定のチケット当選時
 *      入手品の所持数が+1されます。
 *      Result Veriable Numberで指定した変数には「1」が設定されます。
 *      Name Variable Numberで指定した変数には、入手品の名前が設定されます。
 *  ・ID指定のチケット当選時
 *      入手品の所持数が+1されます。
 *      Result Veriable Numberで指定した変数にはIDが設定されます。
 *      Name Variable Numberで指定した変数には、入手品の名前が設定されます。
 *  ・お金のチケット当選時
 *      当選金額が所持金にプラスされます。
 *      Result Veriable Numberで指定した変数には金額（数値）が設定されます。
 *      Name Variable Numberで指定した変数には「金額＋単位」が設定されます。
 *  ・ハズレチケットの場合
 *      Result Variable Numberで指定した変数には「0」が設定されます。
 *
 * ------------------------------------
 *  追加したチケットの有効範囲について
 * ------------------------------------
 *  「LotteryBox add」で追加したチケットは、「LotteryBox empty」で明示的に抽選箱
 *  を空にするか、Auto Empty Modeで「LotteryBox draw」とともに空にされない場合、
 *  ゲームを起動している間中、残り続ける可能性があります。
 *  これは、ゲーム中断からのニューゲームやコンティニュー（セーブデータロード）
 *  などを挟んだ場合でも同様です。
 *  ですので、抽選箱利用時は「add～draw～empty」の一連の流れをセットにすることを
 *  オススメします。
 */

(function () {
    var Params = PluginManager.parameters('LotteryBox');

    var ResultVariableNumber = Number(Params['Result Variable Number']) || 0;
    var NameVariableNumber = Number(Params['Name Variable Number']) || 0;
    var AutoEmptyMode = String(Params['Auto Empty Mode']).toUpperCase() === 'ON' ? 1 : 0;

    var lotteryBox = new LotteryBox();

    function Random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function SetResult(result, name) {
        if (ResultVariableNumber) {
            $gameVariables.setValue(ResultVariableNumber, result);
        }
        if (NameVariableNumber) {
            $gameVariables.setValue(NameVariableNumber, name);
        }
    }

    function LotteryBox() {
        this.box = [];

        LotteryBox.prototype.exec = function (args) {
            switch ((args[0] || '').toLowerCase()) {
                case 'add':
                    /([a-zA-Z]+):?(.*)/.test(args[1]);
                    var n = Number(args[2]) || 0;
                    for (var i = 0; i < n; i++) {
                        this.box.push({category:RegExp.$1, id:RegExp.$2})
                    }
                    break;
                case 'draw':
                    if (this.box.length > 0) {
                        this.draw(this.box[Random(0, this.box.length - 1)]);
                    } else {
                        SetResult(0, '');
                    }
                    if (AutoEmptyMode) {
                        this.box = [];
                    }
                    break;
                case 'empty':
                    this.box = [];
                    break;
            }
        };

        LotteryBox.prototype.draw = function (ticket) {
            var data = [];

            switch (ticket.category.toLowerCase()) {
                case 'item':
                    data = $dataItems;
                    break;
                case 'weapon':
                    data = $dataWeapons;
                    break;
                case 'armor':
                    data = $dataArmors;
                    break;
                case 'gold':
                    break;
                default:
                    SetResult(0, '');
                    return;
            }

            this.get(data.slice(1), ticket.id);
        };

        LotteryBox.prototype.get = function (data, id) {
            // item, weapon, armor
            if (data.length > 0) {
                id = Number(id) || 0;
                if (id) {
                    data = data.filter(function (element) { return element.note.toLowerCase().indexOf('<lotterybox_id:' + id + '>') != -1; });
                    if (data.length < 1) {
                        SetResult(0, '');
                        return;
                    }
                }
                var get = data[Random(0, data.length - 1)];
                $gameParty.gainItem(get, 1);
                SetResult(id || 1, get.name);
            // gold
            } else {
                var amount = id.split(';');
                amount[0] = Number(amount[0]) || 0;
                amount[1] = Number(amount[1]) || 0;
                amount[2] = Number(amount[2]) || 0;

                var gold = 0;
                if (amount[2] == 0) {
                    if (amount[1] == 0) {
                        gold = amount[0];
                    } else {
                        gold = Random(amount[0], amount[1]);
                    }
                } else {
                    var n = (amount[1] - amount[0]) / amount[2];
                    gold = amount[0] + Random(0, n) * amount[2];
                }

                $gameParty.gainGold(gold);
                SetResult(gold, gold + $dataSystem.currencyUnit);
            }
        }
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'LotteryBox') {
            lotteryBox.exec(args);
        }
    };
}());
