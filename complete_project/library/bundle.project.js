require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Game":[function(require,module,exports){
cc._RFpush(module, '0486fOqHrJN+6c5PQg5FHh9', 'Game');
// scripts/Game.js

'use strict';

var Player = require('Player');

var Game = cc.Class({
    'extends': cc.Component,

    properties: {
        ground: {
            'default': null,
            type: cc.Node
        },
        player: {
            'default': null,
            type: Player
        },
        groundY: {
            'default': 0,
            visible: false
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        Game.instance = this;
        // calculate ground y position, to put player onto
        this.groundY = this.ground.y + this.ground.height / 2;
        this.player.node.setPosition(0, this.groundY);
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{"Player":"Player"}],"Player":[function(require,module,exports){
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
},{}],"Star":[function(require,module,exports){
cc._RFpush(module, '21890Xr4RBJlqTJhmXJ/f5s', 'Star');
// scripts/Star.js

'use strict';

var Player = require('Player');

cc.Class({
    'extends': cc.Component,

    properties: {
        pickRadius: 0,
        maxDuration: 0,
        minDuration: 0,
        player: {
            'default': null,
            type: Player
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.duration = 0;
        this.timer = 0;
        this.activate();
    },

    getPlayerDistance: function getPlayerDistance() {
        // from star to player position
        var playerPos = this.player.getCenterPos();
        var toPlayer = this.node.position.subSelf(playerPos);
        var dist = toPlayer.mag();
        return dist;
    },

    activate: function activate() {
        // get a life duration for this star
        this.duration = this.minDuration + cc.random0To1() * (this.maxDuration - this.minDuration);
        this.timer = 0;
    },

    onPicked: function onPicked() {
        console.log('picked!');
        this.player.getScore();
        this.node.destroy();
    },

    // called every frame
    update: function update(dt) {
        // if player is near enough to pick
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }

        // life cycle
        if (this.timer > this.duration) {
            this.node.destroy();
            return;
        }
        this.timer += dt;
    }
});

cc._RFpop();
},{"Player":"Player"}]},{},["Game","Star","Player"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2ZiL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvUGxheWVyLmpzIiwiYXNzZXRzL3NjcmlwdHMvU3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzA0ODZmT3FIckpOKzZjNVBRZzVGSGg5JywgJ0dhbWUnKTtcbi8vIHNjcmlwdHMvR2FtZS5qc1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBQbGF5ZXIgPSByZXF1aXJlKCdQbGF5ZXInKTtcblxudmFyIEdhbWUgPSBjYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGdyb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IFBsYXllclxuICAgICAgICB9LFxuICAgICAgICBncm91bmRZOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IDAsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBHYW1lLmluc3RhbmNlID0gdGhpcztcbiAgICAgICAgLy8gY2FsY3VsYXRlIGdyb3VuZCB5IHBvc2l0aW9uLCB0byBwdXQgcGxheWVyIG9udG9cbiAgICAgICAgdGhpcy5ncm91bmRZID0gdGhpcy5ncm91bmQueSArIHRoaXMuZ3JvdW5kLmhlaWdodCAvIDI7XG4gICAgICAgIHRoaXMucGxheWVyLm5vZGUuc2V0UG9zaXRpb24oMCwgdGhpcy5ncm91bmRZKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHt9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICdjMTBiYlBkR1loRFdhTG9LTFYzOGJIZicsICdQbGF5ZXInKTtcbi8vIHNjcmlwdHMvUGxheWVyLmpzXG5cbid1c2Ugc3RyaWN0JztcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBqdW1wSGVpZ2h0OiAwLFxuICAgICAgICBqdW1wRHVyYXRpb246IDAsXG4gICAgICAgIG1heE1vdmVTcGVlZDogMCxcbiAgICAgICAgYWNjZWw6IDAsXG4gICAgICAgIGRpc3BsYXk6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVMYWJlbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAvLyB2YXJpYWJsZXMgdG8gc3RvcmUgcGxheWVyIHN0YXR1c1xuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG4gICAgICAgIHRoaXMuc3BlZWREZWx0YSA9IDA7XG4gICAgICAgIHRoaXMubWluUG9zWCA9IC10aGlzLm5vZGUucGFyZW50LndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5tYXhQb3NYID0gdGhpcy5ub2RlLnBhcmVudC53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMuaXNKdW1waW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gc2V0IGp1bXAgYWN0aW9uXG4gICAgICAgIHRoaXMuanVtcEFjdGlvbiA9IHRoaXMuc2V0SnVtcEFjdGlvbigpO1xuXG4gICAgICAgIC8vIGlucHV0IG1hbmFnZW1lbnRcbiAgICAgICAgdGhpcy5zZXRJbnB1dENvbnRyb2woKTtcbiAgICB9LFxuXG4gICAgZ2V0Q2VudGVyUG9zOiBmdW5jdGlvbiBnZXRDZW50ZXJQb3MoKSB7XG4gICAgICAgIHZhciBjZW50ZXJQb3MgPSBjYy5wKHRoaXMubm9kZS5fc2dOb2RlLngsIHRoaXMubm9kZS5fc2dOb2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0IC8gMik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdHJpbmcgPSAncGxheWVyIGNlbnRlcjogJyArIE1hdGguZmxvb3IoY2VudGVyUG9zLngpICsgJywgJyArIE1hdGguZmxvb3IoY2VudGVyUG9zLnkpO1xuICAgICAgICByZXR1cm4gY2VudGVyUG9zO1xuICAgIH0sXG5cbiAgICBzZXRKdW1wQWN0aW9uOiBmdW5jdGlvbiBzZXRKdW1wQWN0aW9uKCkge1xuICAgICAgICAvLyBqdW1wIGFjdGlvblxuICAgICAgICB2YXIganVtcFVwID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy5wKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIHZhciBqdW1wRG93biA9IGNjLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MucCgwLCAtdGhpcy5qdW1wSGVpZ2h0KSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLm9uSnVtcEVuZCwgdGhpcyk7XG4gICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIHNldElucHV0Q29udHJvbDogZnVuY3Rpb24gc2V0SW5wdXRDb250cm9sKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vYWRkIGtleWJvYXJkIGlucHV0IGxpc3RlbmVyIHRvIGp1bXAsIHR1cm5MZWZ0IGFuZCB0dXJuUmlnaHRcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudHVybkxlZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5yaWdodDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudHVyblJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuc3BhY2U6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmp1bXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc2VsZik7XG4gICAgfSxcblxuICAgIHR1cm5MZWZ0OiBmdW5jdGlvbiB0dXJuTGVmdCgpIHtcbiAgICAgICAgdGhpcy5zcGVlZERlbHRhID0gLXRoaXMuYWNjZWw7XG4gICAgfSxcblxuICAgIHR1cm5SaWdodDogZnVuY3Rpb24gdHVyblJpZ2h0KCkge1xuICAgICAgICB0aGlzLnNwZWVkRGVsdGEgPSB0aGlzLmFjY2VsO1xuICAgIH0sXG5cbiAgICBqdW1wOiBmdW5jdGlvbiBqdW1wKCkge1xuICAgICAgICBpZiAodGhpcy5pc0p1bXBpbmcpIHJldHVybjtcbiAgICAgICAgdGhpcy5ub2RlLl9zZ05vZGUucnVuQWN0aW9uKHRoaXMuanVtcEFjdGlvbik7XG4gICAgICAgIHRoaXMuaXNKdW1waW5nID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgb25KdW1wRW5kOiBmdW5jdGlvbiBvbkp1bXBFbmQoKSB7XG4gICAgICAgIHRoaXMuaXNKdW1waW5nID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGdldFNjb3JlOiBmdW5jdGlvbiBnZXRTY29yZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJysxJyk7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICBjb25zb2xlLmxvZygncGxheWVyIGRlc3Ryb3llZCcpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvLyBnZXQgY3VycmVudCBzcGVlZFxuICAgICAgICB0aGlzLnhTcGVlZCArPSB0aGlzLnNwZWVkRGVsdGEgKiBkdDtcbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMueFNwZWVkKSA+IHRoaXMubWF4TW92ZVNwZWVkKSB7XG4gICAgICAgICAgICAvLyBpZiBzcGVlZCByZWFjaCBsaW1pdCwgdXNlIG1heCBzcGVlZCB3aXRoIGN1cnJlbnQgZGlyZWN0aW9uXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IHRoaXMubWF4TW92ZVNwZWVkICogdGhpcy54U3BlZWQgLyBNYXRoLmFicyh0aGlzLnhTcGVlZCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLnhTcGVlZCAqIGR0O1xuXG4gICAgICAgIGlmICh0aGlzLm5vZGUueCA+IHRoaXMubWF4UG9zWCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLm1heFBvc1g7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ub2RlLnggPCB0aGlzLm1pblBvc1gpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5taW5Qb3NYO1xuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnMjE4OTBYcjRSQkpscVRKaG1YSi9mNXMnLCAnU3RhcicpO1xuLy8gc2NyaXB0cy9TdGFyLmpzXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFBsYXllciA9IHJlcXVpcmUoJ1BsYXllcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBpY2tSYWRpdXM6IDAsXG4gICAgICAgIG1heER1cmF0aW9uOiAwLFxuICAgICAgICBtaW5EdXJhdGlvbjogMCxcbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBQbGF5ZXJcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IDA7XG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgfSxcblxuICAgIGdldFBsYXllckRpc3RhbmNlOiBmdW5jdGlvbiBnZXRQbGF5ZXJEaXN0YW5jZSgpIHtcbiAgICAgICAgLy8gZnJvbSBzdGFyIHRvIHBsYXllciBwb3NpdGlvblxuICAgICAgICB2YXIgcGxheWVyUG9zID0gdGhpcy5wbGF5ZXIuZ2V0Q2VudGVyUG9zKCk7XG4gICAgICAgIHZhciB0b1BsYXllciA9IHRoaXMubm9kZS5wb3NpdGlvbi5zdWJTZWxmKHBsYXllclBvcyk7XG4gICAgICAgIHZhciBkaXN0ID0gdG9QbGF5ZXIubWFnKCk7XG4gICAgICAgIHJldHVybiBkaXN0O1xuICAgIH0sXG5cbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIC8vIGdldCBhIGxpZmUgZHVyYXRpb24gZm9yIHRoaXMgc3RhclxuICAgICAgICB0aGlzLmR1cmF0aW9uID0gdGhpcy5taW5EdXJhdGlvbiArIGNjLnJhbmRvbTBUbzEoKSAqICh0aGlzLm1heER1cmF0aW9uIC0gdGhpcy5taW5EdXJhdGlvbik7XG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgIH0sXG5cbiAgICBvblBpY2tlZDogZnVuY3Rpb24gb25QaWNrZWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwaWNrZWQhJyk7XG4gICAgICAgIHRoaXMucGxheWVyLmdldFNjb3JlKCk7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vIGlmIHBsYXllciBpcyBuZWFyIGVub3VnaCB0byBwaWNrXG4gICAgICAgIGlmICh0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMub25QaWNrZWQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxpZmUgY3ljbGVcbiAgICAgICAgaWYgKHRoaXMudGltZXIgPiB0aGlzLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGltZXIgKz0gZHQ7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
