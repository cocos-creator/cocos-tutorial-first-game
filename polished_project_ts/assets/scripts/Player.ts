const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {

    // 主角跳跃高度
    @property
    jumpHeight = 0;
    // 主角跳跃持续时间
    @property
    jumpDuration = 0;
    // 辅助形变动作时间
    @property
    squashDuration = 0;
    // 最大移动速度
    @property
    maxMoveSpeed = 0;
    // 加速度
    @property
    accel = 0;
    // 跳跃音效资源
    @property({
        type: cc.AudioClip
    })
    jumpAudio = null;

    // 加速度方向开关
    accLeft = false;
    accRight = false;

    // 主角当前水平方向速度
    xSpeed = 0;
    // screen boundaries
    minPosX = 0;
    maxPosX = 0;

    // 初始化跳跃动作
    jumpAction = null;

    // use this for initialization
    onLoad () {
        this.enabled = false;

        // compute screen boundaries
        this.minPosX = -this.node.parent.width/2;
        this.maxPosX = this.node.parent.width/2;

        // 初始化跳跃动作
        this.jumpAction = this.runJumpAction();

        // 初始化键盘输入监听
        this.setInputControl();
    }

    setInputControl () {
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // touch input
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
    }

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accLeft = false;
                this.accRight = true;
                break;
        }
    }

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
        }
    }

    onTouchBegan (event) {
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width/2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
        // don't capture the event
        return true;
    }

    onTouchEnded (event) {
        this.accLeft = false;
        this.accRight = false;
    }

    runJumpAction () {
        // 跳跃上升
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
        // 下落
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });
        // 形变
        var squash = cc.tween().to(this.squashDuration, { scaleX: 1, scaleY: 0.6 });
        var stretch = cc.tween().to(this.squashDuration, { scaleX: 1, scaleY: 1.2 });
        var scaleBack = cc.tween().to(this.squashDuration, { scaleX: 1, scaleY: 1 });

        // 创建一个缓动
        var tween = cc.tween()
                        // 按顺序执行动作
                        .sequence(squash, stretch, jumpUp, scaleBack, jumpDown)
                        // 添加一个回调函数，在前面的动作都结束时调用我们定义的 playJumpSound() 方法
                        .call(this.playJumpSound, this);

        // 不断重复
        return cc.tween().repeatForever(tween);
    }

    playJumpSound () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    getCenterPos () {
        var centerPos = cc.v2(this.node.x, this.node.y + this.node.height/2);
        return centerPos;
    }

    startMoveAt (pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        
        var jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start()
    }

    stopMove () {
        this.node.stopAllActions();
    }

    // called every frame
    update (dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        // limit player position inside screen
        if ( this.node.x > this.node.parent.width/2) {
            this.node.x = this.node.parent.width/2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width/2) {
            this.node.x = -this.node.parent.width/2;
            this.xSpeed = 0;
        }
    }
}
