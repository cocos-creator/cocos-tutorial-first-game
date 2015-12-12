cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        minDragDist: 0,
        scoreDisplay: {
            default: null,
            type: cc.ELabel
        }
    },

    // use this for initialization
    onLoad: function () {
        // variables to store player status
        this.xSpeed = 0;
        this.speedDelta = 0;
        this.minPosX = -this.node.parent.width/2;
        this.maxPosX = this.node.parent.width/2;
        this.isJumping = false;
        this.score = 0;

        // set jump action
        this.jumpAction = this.setJumpAction();

        // touch input helper
        this.lastTouchLoc = cc.p(0, 0);

        // input management
        this.setInputControl();
    },

    setInputControl: function () {
        var self = this;
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.turnLeft();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.turnRight();
                        break;
                    // case cc.KEY.space:
                    //     self.jump();
                    //     break;
                }
            }
        }, self);

        function handleTouch(touchLoc) {
            var dist = cc.pDistance(touchLoc, self.lastTouchLoc);
            if (dist < self.minDragDist) {
                self.jump();
            } else {
                if (touchLoc.x > self.lastTouchLoc.x) {
                    self.turnRight();
                } else {
                    self.turnLeft();
                }
                self.lastTouchLoc = touchLoc;
            }
        };

        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                self.lastTouchLoc = touch.getLocation();
                // don't capture the event
                return true;
            },
            // onTouchMoved: function(touch, event) {
            //     var touchLoc = touch.getLocation();
            //     handleTouch(touchLoc, false);
            // },
            onTouchEnded: function(touch, event) {
                var touchLoc = touch.getLocation();
                handleTouch(touchLoc);
            }
        }, self);
    },

    setJumpAction: function () {
        // jump action
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.onJumpEnd, this);
        return cc.sequence(jumpUp, jumpDown, callback);
    },

    getCenterPos: function () {
        var centerPos = cc.p(this.node._sgNode.x, this.node._sgNode.y + this.node.height/2);
        return centerPos;
    },

    turnLeft: function() {
        this.speedDelta = -this.accel;
    },

    turnRight: function() {
        this.speedDelta = this.accel;
    },

    jump: function() {
        if (this.isJumping) return;
        this.node._sgNode.runAction(this.jumpAction);
        this.isJumping = true;
    },

    onJumpEnd: function () {
        this.isJumping = false;
    },

    gainScore: function () {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    resetScore: function () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    reset: function (pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.jump();
        this.node.setPosition(pos);
        this.resetScore();
    },

    // called every frame
    update: function (dt) {
        // get current speed
        this.xSpeed += this.speedDelta * dt;
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        this.node.x += this.xSpeed * dt;

        if ( this.node.x > this.maxPosX) {
            this.node.x = this.maxPosX;
            this.xSpeed = 0;
        } else if (this.node.x < this.minPosX) {
            this.node.x = this.minPosX;
            this.xSpeed = 0;
        }
    },
});
