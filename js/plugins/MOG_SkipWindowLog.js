//=============================================================================
// MOG_SkipWindowLog.js
//=============================================================================

/*:
 * @plugindesc (v1.0) Desativa a janela de Log.
 * @author Moghunter
 *
 * @param Lag Time
 * @desc Definição do tempo de espera após a ação.
 * @default 10 
 *
 * @help  
 * =============================================================================
 * +++ MOG - Skip Window Log (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Desativa a janela de Log.
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_SkipWindowLog = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_SkipWindowLog');
    Moghunter.winLogSpeed = Number(Moghunter.parameters['Lag Time'] || 10);
	
//=============================================================================
// ** Scene Base
//=============================================================================

//==============================
// * Refresh 
//==============================
Window_BattleLog.prototype.refresh = function(text) { 
   this.visible = false;
};

//==============================
// * Message Speed
//==============================
Window_BattleLog.prototype.messageSpeed = function() {
    return Moghunter.winLogSpeed;
};
