const {ccclass} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
    scoreFX = null;
    
    init (scoreFX) {
        this.scoreFX = scoreFX;
    }

    hideFX () {
        this.scoreFX.despawn();
    }
}