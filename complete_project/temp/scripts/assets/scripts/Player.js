cc._RFpush(module, 'c10bbPdGYhDWaLoKLV38bHf', 'Player');
// scripts/Player.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        display: {
            'default': null,
            type: cc.ELabel
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // variables to store player status
        this.xSpeed = 0;
        this.speedDelta = 0;
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;
        this.isJumping = false;

        // set jump action
        this.jumpAction = this.setJumpAction();

        // input management
        this.setInputControl();
    },

    getCenterPos: function getCenterPos() {
        var centerPos = cc.p(this.node._sgNode.x, this.node._sgNode.y + this.node.height / 2);
        this.display.string = 'player center: ' + Math.floor(centerPos.x) + ', ' + Math.floor(centerPos.y);
        return centerPos;
    },

    setJumpAction: function setJumpAction() {
        // jump action
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.onJumpEnd, this);
        return cc.sequence(jumpUp, jumpDown, callback);
    },

    setInputControl: function setInputControl() {
        var self = this;
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.turnLeft();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.turnRight();
                        break;
                    case cc.KEY.space:
                        self.jump();
                        break;
                }
            }
        }, self);
    },

    turnLeft: function turnLeft() {
        this.speedDelta = -this.accel;
    },

    turnRight: function turnRight() {
        this.speedDelta = this.accel;
    },

    jump: function jump() {
        if (this.isJumping) return;
        this.node._sgNode.runAction(this.jumpAction);
        this.isJumping = true;
    },

    onJumpEnd: function onJumpEnd() {
        this.isJumping = false;
    },

    getScore: function getScore() {
        console.log('+1');
    },

    onDestroy: function onDestroy() {
        console.log('player destroyed');
    },

    // called every frame
    update: function update(dt) {
        // get current speed
        this.xSpeed += this.speedDelta * dt;
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        this.node.x += this.xSpeed * dt;

        if (this.node.x > this.maxPosX) {
            this.node.x = this.maxPosX;
            this.xSpeed = 0;
        } else if (this.node.x < this.minPosX) {
            this.node.x = this.minPosX;
            this.xSpeed = 0;
        }
    }
});

cc._RFpop();