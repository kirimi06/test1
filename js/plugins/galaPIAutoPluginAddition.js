/*:
-------------------------------------------------------------------------
@title pluginsフォルダ内のプラグインをゲームに自動追加するプラグイン
@author galanti
@date 2015/11/13
-------------------------------------------------------------------------
@plugindesc pluginsフォルダにあるすべてのプラグインをゲーム開始時に自動で追加します。

@param Always Exclude
@desc 常に未使用にしたいプラグインのリスト。(xxx,yyyのようにコンマで区切ってください)。
@default

@help 
-------------------------------------------------------------------------
○　概要
プラグインの数が膨大になるといちいち登録するのが面倒くさくなる事があります。
このプラグインは、ゲームを開始した時に、pluginsフォルダの中にあるすべての
jsファイルをプラグインとして自動的に登録し、使用します。
この時、追加したくないプラグインを指定する事ができます。

○　使用条件
・　非商用に限りフリーでお使いいただけます。要クレジット表記。
・　商用の場合はgalantiまでご連絡ください。

○　免責事項
このプラグイン使用によりいかなる損害が生じても作者は一切責任を負いません。
自己責任でお使いください。

○　更新情報
2015/11/14 10 ver.1.0
 
○　使用法
このプラグインを登録後、ゲームを実行すればpluginsフォルダにあるすべてのjsファイルを
プラグインとしてゲームに追加します。
もしAlways Excludeでプラグイン名が指定されていれば、そのプラグインは追加しません。
自動追加されたプラグイン名のリストがコンソールに表示されます。
なお、このプラグインは「プラグイン管理」の情報は変更しません。
各プラグインのパラメータは、「プラグイン管理」で設定した値が常に優先されます。
「プラグイン管理」未登録のプラグインの場合は、パラメータはデフォルト値が使われます。
Always Excludeで指定したプラグインが「プラグイン管理」に登録されている場合、
そのプラグインは読み込まれます。

-------------------------------------------------------------------------
 */ 
var Imported = Imported || {};
var galaPI = galaPI || {};
Imported.autoPluginAddition = true;
galaPI.autoPluginAddition = galaPI.autoPluginAddition || {};


(function($){
	$.parameters = PluginManager.parameters("galaPIAutoPluginAddition");
	if($.parameters['Always Exclude'] != ""){
		$.excludeList = $.parameters['Always Exclude'].split(",");
	}else{
		$.excludeList = [];
	}
	$.fs = require('fs');
	$.piPath = "";
	$.piList = [];
	$.piUsedList = [];


	//adding all plugins
	$.addPlugin = function(){
		var content;
		$.excludeList = $.arrayTrimExtention($.excludeList);
		$.getPluginList();
		var unusedPis = $.piList.filter(function(i){
			return $.piUsedList.indexOf(i) < 0;
		});
		unusedPis = $.excludePlugins(unusedPis);
		unusedPis.forEach(function(file){
			content = $.loadPluginAsTextArray(file+".js");
			piInfo = $.getPluginInfo(file,content);
           	PluginManager.setParameters(piInfo.name, piInfo.parameters);
            PluginManager.loadScript(piInfo.name + '.js');
            PluginManager.galaPIaddPluginToList(piInfo.name);
		});
		return unusedPis;
	};
	
	
	//trim extention if necessary
	$.arrayTrimExtention = function(ary){
		var dotpos;
		var trimmed = [];
		for(var i=0; i < ary.length; i++){
			ary[i] = ary[i].replace(/ +/,"");
			dotpos = ary[i].lastIndexOf(".");
			if(dotpos >= ary[i].length-5){
				trimmed[i] = ary[i].slice(0,dotpos);
			}else{
				trimmed[i] = ary[i];
			}
		}
		return trimmed;
	};
	
	
	//plugin list.
	$.getPluginList = function(){
		$.piPath = decodeURI(window.location.pathname.replace(/index\.html/,"").slice(1)+"/js/plugins/");
		$.piList = $.fs.readdirSync($.piPath);
		for(var i = 0; i < $.piList.length; i++){
			$.piList[i] = $.piList[i].slice(0,-3);
		}
		for(i = 0; i < $plugins.length; i++){
			$.piUsedList[i] = $plugins[i].name;
		}
	};
	
	
	//get plugin information to be added.
	$.getPluginInfo = function(name,content){
		var info = {name: name, status: true, description: "", parameters:{}}
		var numl = 0;
		var prop = "";
		while(numl < content.length){
			if(content[numl].indexOf("@plugindesc") != -1){
				info.description = content[numl].replace(/.+@plugindesc */,"");
			}else if(content[numl].indexOf("@param") != -1){
				prop = content[numl].replace(/.+@param */,"")
				info.parameters[prop] = "";
				numl++;
				while(numl < content.length){
					if(content[numl].indexOf("@default") != -1){
						info.description[prop] = content[numl].replace(/.+@default */,"");
						break;
					}else{
						numl++;
					}
				}
			}
			numl++;
		}
		return info;
	};
	
	
	//get text strings and store each line in an array.
	$.loadPluginAsTextArray = function(src) {
    	var file = $.piPath + src;
        return $.fs.readFileSync(file, 'utf8').split("\n");
	};
	
	
	//exclude
	$.excludePlugins = function(list){
		$.excludeList.forEach(function(plugin){
			list.splice(list.indexOf(plugin),1);
		});
		return list;
	}
	
	
	PluginManager.galaPIaddPluginToList = function(name){
		this._scripts.push(name);
	};
	
	
	var galaPI_SceneManagerRun = SceneManager.run;
	SceneManager.run = function(sceneClass) {
		var added = $.addPlugin();
		console.log("以下のプラグインが自動的に追加されました。");
		added.forEach(function(plugin){
			console.log(plugin)
		});
		galaPI_SceneManagerRun.call(this,sceneClass);
	};
	
	
})(galaPI.autoPluginAddition);