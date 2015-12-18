/*:
 * @plugindesc JumpAttack.
 * @author Lib
 *
 * @param Unknown Data
 * @desc 
 * @default ??????
 *
 * @help
 *
 * Plugin Command:
 *
 * Enemy Note:
 */

//物理攻撃の時だけジャンプします。
//作:Lib

(function() {

Game_Battler.prototype._isMagicSkill = function() {
    return action.isMagicSkill();
};

var _Sprite_Battler_prototype_initMembers = Sprite_Battler.prototype.initMembers
Sprite_Battler.prototype.initMembers = function() {
	_Sprite_Battler_prototype_initMembers.call(this);
	this._jumpFlag = true;
	this._jumping = false;
	this._jumpDuration = 0;
	this._power = 0;
};

Sprite_Battler.prototype.updateMain = function() {
	if (this._battler.isSpriteVisible()) {
		this.updateBitmap();
		this.updateFrame();
	}
	
	this.dojump();
	this.updateMove();
	this.updateJump();
	this.updateShadow();
	this.updatePosition();
};

Sprite_Battler.prototype.startJump = function(x, power, duration) {
	if (this._offsetY === 0 && this._jumpDuration ===0){
	   this._targetOffsetX = x;
		this._power = power;
		this._jumping = true;
		this._jumpDuration = duration;
	}
};

Sprite_Battler.prototype.dojump = function() {
	if (this._motion && this._offsetX === 0 && this._offsetY === 0){
		if (this._motion.index===2){
			this._jumpFlag = false;
		}
	}
}

Sprite_Battler.prototype.updateJump = function() {
	if ( this._jumping ){
	   var d = this._jumpDuration;
		this._power += 2;
      this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
		this._offsetY = this._offsetY + this._power;
		if ( this._offsetY === 0 ){
			this.onJumpConcel();
		}
	}
};

Sprite_Battler.prototype.onJumpConcel = function() {
	this._jumping = false;	//ジャンプ中か？
	this._offsetY = 0;
	this._power = 0;			//ジャンプパワー
	this.updatePosition();
}

Sprite_Battler.prototype.onJumpEnd = function() {
	this.onJumpConcel();
	this._jumpFlag = true;	//ジャンプ可能にする。
	this._jumpDuration = 0;
};

Sprite_Battler.prototype.isJumping = function() {
	return this._offsetY !== 0;
};

Sprite_Battler.prototype.updateShadow = function() {
};

Sprite_Actor.prototype.stepForward = function() {
   if (this._actor.isInputting() || this._jumpFlag) {
		this.startJump(-48, -16, 12);
	}else{
		this.startMove(-48, 0, 12);		//魔法の時は普通に
	}
};

Sprite_Actor.prototype.stepBack = function() {
   this.onJumpEnd();
   this.startMove(0, 0, 12);
};

Sprite_Actor.prototype.updateShadow = function() {
	this._shadowSprite.y = -2 - this._offsetY;
};


})();
