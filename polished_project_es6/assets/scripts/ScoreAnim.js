const {ccclass} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
    init (scoreFX) {
        this.scoreFX = scoreFX;
    }

    hideFX () {
        this.scoreFX.despawn();
    }
}