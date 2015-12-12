const Player = require('Player');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        ground: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: Player
        },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        btnNode: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        maxStarDuration: 0,
        minStarDuration: 0,
        controlHintLabel: {
            default: null,
            type: cc.ELabel
        },
        keyboardHint: {
            default: '',
            multiline: true
        },
        touchHint: {
            default: '',
            multiline: true
        }
    },

    // use this for initialization
    onLoad: function () {
        // initialize player position
        this.groundY = this.ground.y + this.ground.height/2;

        // store last star's x position
        this.currentStar = null;
        this.currentStarX = 0;
        this.timer = 0;
        this.starDuration = 0;
        this.isRunning = false;

        // initialize control hint 
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;
    },

    onStartGame: function () {
        // initialize star timer
        this.isRunning = true;
        this.btnNode.setPositionX(3000);
        this.gameOverNode.active = false;
        this.player.reset(cc.p(0, this.groundY));
        this.spawnNewStar();
    },

    spawnNewStar: function() {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').init(this);
        this.startTimer();
        this.currentStar = newStar;
    },

    startTimer: function () {
        // get a life duration for next star
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        if (!this.currentStar) {
            this.currentStarX = cc.randomMinus1To1() * this.node.width/2;
        }
        var randX = 0;
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        var maxX = this.node.width/2;
        if (this.currentStarX >= 0) {
            randX = -cc.random0To1() * maxX;
        } else {
            randX = cc.random0To1() * maxX;
        }
        this.currentStarX = randX;
        return cc.p(randX, randY);
    },

    // called every frame
    update: function (dt) {
        if (!this.isRunning) return;
        // life cycle
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gameOver: function () {
       this.gameOverNode.active = true;
       this.player.enabled = false;
       this.currentStar.destroy();
       this.isRunning = false;
       this.btnNode.setPositionX(0);
    }
});
