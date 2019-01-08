import Player from "./Player";
import ScoreFX from "./ScoreFX";
import Star from "./Star";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
    // 这个属性引用了星星预制资源
    @property(cc.Prefab)
    starPrefab = null;
        
    /**
     * @type {cc.Prefab}
     */
    @property(cc.Prefab)
    scoreFXPrefab = null;
            
    // 星星产生后消失时间的随机范围
    @property
    maxStarDuration = 0;
    @property
    minStarDuration = 0;

    // 地面节点，用于确定星星生成的高度
    @property(cc.Node)
    ground = null;
    
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    /**
     * @type {Player}
     */
    @property(Player)
    player = null;

    // score label 的引用
    @property(cc.Label)
    scoreDisplay = null;
    
    // 得分音效资源
    @property({
        type: cc.AudioClip
    })
    scoreAudio = null;
        
    @property(cc.Node)
    btnNode = null;
    
    @property(cc.Node)
    gameOverNode = null;

    @property(cc.Label)
    controlHintLabel = null;

    @property({
        multiline: true
    })
    keyboardHint = '';
    
    @property({
        multiline: true
    })
    touchHint = '';

    // use this for initialization
    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;

        // store last star's x position
        this.currentStar = null;
        this.currentStarX = 0;

        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        // is showing menu or running game
        this.isRunning = false;

        // initialize control hint
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;

        // initialize star and score pool
        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX');
    }

    onStartGame () {
        // 初始化计分
        this.resetScore();
        // set game state to running
        this.isRunning = true;
        // set button and gameover text out of screen
        this.btnNode.setPositionX(3000);
        this.gameOverNode.active = false;
        // reset player position and move speed
        this.player.startMoveAt(cc.p(0, this.groundY));
        // spawn star
        this.spawnNewStar();
    }

    spawnNewStar () {
        /**
         * @type {cc.Node}
         */
        var newStar = null;
        // 使用给定的模板在场景中生成一个新节点
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this); // this will be passed to Star's reuse method
        } else {
            newStar = cc.instantiate(this.starPrefab);
        }
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // pass Game instance to star
        newStar.getComponent(Star).init(this);
        // start star timer and store star reference
        this.startTimer();
        this.currentStar = newStar;
    }

    despawnStar (star) {
        this.starPool.put(star);
        this.spawnNewStar();
    }

    startTimer () {
        // get a life duration for next star
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition () {
        // if there's no star, set a random x pos
        if (!this.currentStar) {
            this.currentStarX = cc.randomMinus1To1() * this.node.width/2;
        }
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        // 根据屏幕宽度和上一个星星的 x 坐标，随机得到一个新生成星星 x 坐标
        var maxX = this.node.width/2;
        if (this.currentStarX >= 0) {
            randX = -cc.random0To1() * maxX;
        } else {
            randX = cc.random0To1() * maxX;
        }
        this.currentStarX = randX;
        // 返回星星坐标
        return cc.p(randX, randY);
    }

    gainScore (pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放特效
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    resetScore () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    }

    spawnScoreFX () {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent(ScoreFX);
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent(ScoreFX);
            fx.init(this);
            return fx;
        }
    }

    despawnScoreFX (scoreFX) {
        this.scorePool.put(scoreFX);
    }

    // called every frame
    update (dt) {
        if (!this.isRunning) return;
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    gameOver () {
       this.gameOverNode.active = true;
       this.player.enabled = false;
       this.player.stopMove();
       this.currentStar.destroy();
       this.isRunning = false;
       this.btnNode.setPositionX(0);
    }
}
