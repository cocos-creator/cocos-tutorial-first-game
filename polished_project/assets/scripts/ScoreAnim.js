cc.Class({
    extends: cc.Component,

    init (scoreFX) {
        this.scoreFX = scoreFX;
    },

    hideFX: function () {
        this.scoreFX.despawn();
    },
});