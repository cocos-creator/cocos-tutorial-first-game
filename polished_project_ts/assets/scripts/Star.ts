const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
    // 星星和主角之间的距离小于这个数值时，就会完成收集
    @property
    pickRadius = 0;
    
    // 暂存 Game 对象的引用
    game = null;

    onLoad () {
        this.enabled = false;
    }

    // use this for initialization
    init (game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    }

    reuse (game) {
        this.init(game);
    }

    getPlayerDistance () {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getCenterPos();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    onPicked () {
        var pos = this.node.getPosition();
        // 调用 Game 脚本的得分方法
        this.game.gainScore(pos);
        // 当星星被收集时，调用 Game 脚本中的接口，销毁当前星星节点，生成一个新的星星
        this.game.despawnStar(this.node);
    }

    // called every frame
    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
}
