//=============================================================================
// MOG_ActorPictureCM.js
//=============================================================================

/*:
 * @plugindesc (v1.0) Apresenta a imagem do personagem durante a seleção de comandos.
 * @author Moghunter
 *
 * @param X-Axis
 * @desc Definição da posição X-axis da imagem.
 * @default 600
 *
 * @param Y-Axis
 * @desc Definição da posição Y-axis da imagem.
 * @default 100 
 *
 * @help  
 * =============================================================================
 * +++ MOG - Actor Picture CM (v1.0) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Apresenta a imagem do personagem durante a seleção de comandos.
 * As imagens dos personagens devem ser gravadas na pasta. /img/pictures/
 * A nomeação dos arquivos devem ser feitas da seguinte forma.
 * 
 * Actor_ ID.png
 *
 * Exemplo
 *
 * Actor_1.png
 * Actor_2.png
 * Actor_3.png
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_ActorPictureCM = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_ActorPictureCM');
	Moghunter.actor_cm_x = Number(Moghunter.parameters['X-Axis'] || 600);
    Moghunter.actor_cm_y = Number(Moghunter.parameters['Y-Axis'] || 100);
	
//=============================================================================
// ** Scene Battle
//=============================================================================

//==============================
// * CreateSpriteset
//==============================
var _alias_mog_actorcm_createSpriteset = Scene_Battle.prototype.createSpriteset;
Scene_Battle.prototype.createSpriteset = function() {
    _alias_mog_actorcm_createSpriteset.call(this);
   this.create_actors_cm();
};

//==============================
// * Create Actors CM
//==============================	
Scene_Battle.prototype.create_actors_cm = function() {
	this._actor_cm_data = [null,Moghunter.actor_cm_x,Moghunter.actor_cm_y];
	this._actor_cm_data[3] = this._actor_cm_data[1] - 100;
	this._actor_cm_img = [];
    var members = $gameParty.battleMembers();
    for (var i = 0; i < members.length; i++) {
        this._actor_cm_img[members[i]._actorId] = ImageManager.loadPicture("Actor_" + members[i]._actorId)
    };	
	this._sprite_actor_cm = new Sprite();
	this._sprite_actor_cm.y = this._actor_cm_data[2];
	this.addChild(this._sprite_actor_cm);
};

//==============================
// * Update
//==============================
var _alias_mog_actorcm_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
	_alias_mog_actorcm_update.call(this);
	if (this._sprite_actor_cm) {this.update_actor_cm()};
};
		
//==============================
// * Update Actor CM
//==============================
Scene_Battle.prototype.update_actor_cm = function() {
	if (this.sprite_actor_cm_visible()) {
		if (this._actor_cm_data[0] != BattleManager.actor()) {this.actor_cm_refresh()};
	    this._sprite_actor_cm.opacity += 15;
		if (this._sprite_actor_cm.x < this._actor_cm_data[1])
		   {this._sprite_actor_cm.x += 5;
		    if (this._sprite_actor_cm.x > this._actor_cm_data[1]) {this._sprite_actor_cm.x = this._actor_cm_data[1]};
		};		
		}
	else {this._sprite_actor_cm.opacity -= 15;
	    if ( (this._sprite_actor_cm.x > this._actor_cm_data[3])) {
			this._sprite_actor_cm.x -= 5;
		    if (this._sprite_actor_cm.x < this._actor_cm_data[3]) {this._sprite_actor_cm.x = this._actor_cm_data[3]};
		};
	};
};

//==============================
// * Actor CM Refresh
//==============================
Scene_Battle.prototype.actor_cm_refresh = function() {
	this._actor_cm_data[0] = BattleManager.actor();
	var actor_id = this._actor_cm_data[0]._actorId
	if (!this._actor_cm_img[actor_id]) {
		this._actor_cm_img[actor_id] = ImageManager.loadPicture("Actor_" + String(actor_id))};
	this._sprite_actor_cm.bitmap = this._actor_cm_img[actor_id];
	this._sprite_actor_cm.opacity = 0;
	this._sprite_actor_cm.anchor.x = 0.5;
	this._sprite_actor_cm.x = this._actor_cm_data[3];
};

//==============================
// * Sprite Actor CM Visible
//==============================
Scene_Battle.prototype.sprite_actor_cm_visible = function() {
	if (!BattleManager.actor()) {return false};
	if(this._actorWindow.active) {return false};
	if(this._enemyWindow.active) {return false};
	if(this._partyCommandWindow.active) {return false};
	return true;
};