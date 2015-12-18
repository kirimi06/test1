/*:
 * @plugindesc Enemy slide in.
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

//�v���C���[�����łȂ��G���X���C�h�C������悤�ɂȂ�܂��B
//�L�����̓o��ړ����������������Ȃ�܂��B
//��:Lib

(function() {

Sprite_Actor.prototype.startEntryMotion = function() {
    if (this._actor && this._actor.canMove()) {
        this.startMotion('walk');
        this.startMove(0, 0, 16);
    } else if (!this.isMoving()) {
        this.refreshMotion();
        this.startMove(0, 0, 0);
    };
};

var _Sprite_Enemy_prototype_initVisibility = Sprite_Enemy.prototype.initVisibility
Sprite_Enemy.prototype.initVisibility = function() {
    if($gameSystem.isSideView()){
	this._appeared = false;
	this.opacity = 255;
    }else{
	_Sprite_Enemy_prototype_initVisibility.call(this);
    };
};

var _Sprite_Enemy_prototype_startAppear = Sprite_Enemy.prototype.startAppear
Sprite_Enemy.prototype.startAppear = function() {
   _Sprite_Enemy_prototype_startAppear.call(this);
   if($gameSystem.isSideView()){
      this._offsetX = -Graphics.boxWidth;		//�X�N���[���T�C�Y�ɂ���č����o��̂͂悭�Ȃ��H
      this.startMove(0, 0, this._effectDuration);	//��������
   };
};

var _Sprite_Enemy_prototype_updateAppear = Sprite_Enemy.prototype.updateAppear
Sprite_Enemy.prototype.updateAppear = function() {
   if(!$gameSystem.isSideView()){
      _Sprite_Enemy_prototype_updateAppear.call(this);
   };
};

})();
