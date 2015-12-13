cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
    },

    onLoad: function () {
        this.enabled = false;
    },

    // use this for initialization
    init: function (game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },

    getPlayerDistance: function () {
        // from star to player position
        var playerPos = this.game.player.getCenterPos();
        var toPlayer = this.node.position.subSelf(playerPos); // cc.Vec2.subSelf
        var dist = toPlayer.mag(); // cc.Vec2.mag
        return dist;
    },

    onPicked: function() {
        this.game.player.gainScore();
        this.game.spawnNewStar();
        this.node.destroy();
    },

    // called every frame
    update: function (dt) {
        // if player is near enough to pick
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }

        // star fade out as timer goes
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});
