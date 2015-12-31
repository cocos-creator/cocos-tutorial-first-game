cc.Class({
    extends: cc.Component,

    hideFX: function () {
        this.node.parent.removeFromParent();
        cc.pool.putInPool(this.node.parent.getComponent('ScoreFX'));
    },
});