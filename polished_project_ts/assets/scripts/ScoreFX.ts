const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
    @property({
        type: cc.Animation
    })
    anim = null;
    game = null;

    init (game) {
        this.game = game;
        this.anim.getComponent('ScoreAnim').init(this);
    }

    despawn () {
        this.game.despawnScoreFX(this.node);
    }

    play () {
        this.anim.play('score_pop');
    }
}
