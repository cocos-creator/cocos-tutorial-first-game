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