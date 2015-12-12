const Player = require('Player');

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
        maxDuration: 0,
        minDuration: 0,
        player: {
            default: null,
            type: Player
        }
    },

    // use this for initialization
    onLoad: function () {
        this.duration = 0;
        this.timer = 0;
        this.activate();
    },

    getPlayerDistance: function () {
        // from star to player position
        var playerPos = this.player.getCenterPos();
        var toPlayer = this.node.position.subSelf(playerPos);
        var dist = toPlayer.mag();
        return dist;
    },

    activate: function () {
        // get a life duration for this star
        this.duration = this.minDuration + cc.random0To1() * (this.maxDuration - this.minDuration);
        this.timer = 0;
    },

    onPicked: function() {
        console.log('picked!');
        this.player.getScore();
        this.node.destroy();
    },

    // called every frame
    update: function (dt) {
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
    },
});
