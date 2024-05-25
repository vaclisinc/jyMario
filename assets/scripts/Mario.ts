import delayTime = cc.delayTime;

const { ccclass, property } = cc._decorator;
import { GameMgr } from "./GameMgr";

@ccclass
export class Mario extends cc.Component {
    private _hAxis: number = 0;
    private _vAxis: number = 0;
    private collisionEnabled: boolean = true;
    private isOnGround: boolean = false;
    private isOnItems: boolean = false;
    private isJumping: boolean = false;
    private initialPosition: cc.Vec2;
    private lives: number;
    private scores: number;
    private coins: number;
    private recentTime: number;
    private idleFrame: cc.SpriteFrame = null;
    private anim: cc.Animation = null;
    private rigidBody: cc.RigidBody;

    @property moveSpeed: number;
    @property jumpSpeed: number;
    @property jumpDuration: number = 500;
    @property(GameMgr) GameMgr: GameMgr = null;
    @property(cc.Node) ground = null;
    @property(cc.Node) lifeNode = null;
    @property(cc.Node) timeNode = null;
    @property(cc.Node) coinNode = null;
    @property(cc.Node) scoreNode = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.director.getPhysicsManager().enabled = true;
        this.initValue();
    }

    start() {
        this.declareElement();
        this.schedule(this.reduceTime, 1);
    }


    update(dt: number) {
        this.updatePosition();
        this.decideAnim();
        // if (this.node.y < this.ground.y) {
        //     this.loseLife();
        // }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        const contactNormal = contact.getWorldManifold().normal;

        if (otherCollider.node.group === 'ground') {
            if (contactNormal.y < 0) {
                this.isOnGround = true;
                this.rigidBody.linearVelocity.y = 0;
            }
        }
        if (otherCollider.node.group === 'items'){
            if (contactNormal.y < 0) {
                this.isOnItems = true;
                this.rigidBody.linearVelocity.y = 0;
            }
        }
        if (otherCollider.node.name === "coin"){
            this.GameMgr.playCoin();
            this.updateCoins();
            this.updateScore(100);
        }

        if (otherCollider.node.name === 'deadBound'){
            contact.disabled = true;
            this.loseLife();
            contact.disabled = false;
        }

        if (otherCollider.node.name === "flower"){
            otherCollider.disabled = true;
            this.loseLife();
            otherCollider.disabled = false;
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'ground') {
            this.isOnGround = false;
        }
        if (otherCollider.node.group === 'items'){
            this.isOnItems = false;
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this._hAxis--;
                break;
            case cc.macro.KEY.right:
                this._hAxis++;
                break;
            case cc.macro.KEY.up: //jump
                if (this.isOnGround || this.isOnItems) {
                    this.isJumping = true;
                    this.GameMgr.playJump();
                    setTimeout( () => {
                        this.isJumping = false;
                    }, this.jumpDuration * 1000);
                }
                break;
        }
        this._hAxis = clamp(this._hAxis);
        this._vAxis = clamp(this._vAxis);
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this._hAxis++;
                break;
            case cc.macro.KEY.right:
                this._hAxis--;
                break;
        }
        this._hAxis = clamp(this._hAxis);
        this._vAxis = clamp(this._vAxis);
    }

    reduceTime() {
        if (this.recentTime > 0) {
            this.recentTime--;
            this.timeNode.getComponent(cc.Label).string = this.recentTime;
        } else {
            this.unschedule(this.reduceTime);
            this.GameMgr.gameOver();
        }
    }

    loseLife() {
        this.collisionEnabled = false;
        this.anim.play("die");
        this.lives--;
        this.lifeNode.getComponent(cc.Label).string = this.lives.toString();
        this.unschedule(this.reduceTime);
        if (this.lives <= 0) {
            this.GameMgr.gameOver();
        } else {
            // let jumpAction1 = cc.callFunc(() => {
            //     this.rigidBody.linearVelocity = cc.v2(0, 300);
            // });
            // let delay = cc.delayTime(0.5);
            // let jumpAction2 = cc.callFunc(() => {
            //     this.rigidBody.linearVelocity = cc.v2(0, 0);
            // });
            // let moveToAction = cc.moveTo(0.001, this.initialPosition);
            // let enablePhysics = cc.callFunc(() => {
            //     this.collisionEnabled = true;
            //     this.recentTime = 300;
            //     this.schedule(this.reduceTime, 1);
            // });
            //
            // var sequence = cc.sequence(jumpAction1, delay, jumpAction2, moveToAction, enablePhysics);
            // this.node.runAction(sequence);
            this.resetPosition();
            this.collisionEnabled = true;
            this.recentTime = 300;
            this.schedule(this.reduceTime, 1);
        }
    }

    updatePosition(){
        let velocity = this.rigidBody.linearVelocity;
        if (this._hAxis !== 0) {
            velocity.x = this._hAxis * this.moveSpeed;
        } else if (this._hAxis === 0){
            velocity.x = 0;
        }
        if (this.isJumping){
            if(velocity.x < 0)
                this.node.scaleX = -Math.abs(this.node.scaleX);
            else if (velocity.x > 0)
                this.node.scaleX = Math.abs(this.node.scaleX);
            this.anim.play("jump");
            velocity.y = this.jumpSpeed;
        }
        this.rigidBody.linearVelocity = velocity;
    }

    decideAnim() {
        // this.anim.stop();
        let velocity = this.rigidBody.linearVelocity;
        if (velocity.x === 0 && velocity.y === 0) {
            this.anim.play("idle");
        }
        else if (velocity.x > 0 && velocity.y === 0) { //right
            this.node.scaleX = Math.abs(this.node.scaleX);
            if (!this.anim.getAnimationState("run").isPlaying)
                this.anim.play("run");
        }
        else if (velocity.x < 0 && velocity.y === 0) { //left this._hAxis
            this.node.scaleX = -Math.abs(this.node.scaleX);
            if (!this.anim.getAnimationState("run").isPlaying)
                this.anim.play("run");
        }
    }

    initValue() {
        this.node.setPosition(223.711, 87.699, 0);
        this.initialPosition = cc.v2(223.711, 87.699);
        this.moveSpeed = 320;
        this.jumpSpeed = 680;
        this.lives = 3;
        this.scores = 0;
        this.coins = 0;
        this.recentTime = 300;
        this.collisionEnabled = true;
    }

    declareElement() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
    }

    resetPosition() {
        let rigidBody = this.node.getComponent(cc.RigidBody);
        rigidBody.enabled = false;
        this.node.setPosition(this.initialPosition);
        // rigidBody.enabled = true;
        this.scheduleOnce(() => {
            rigidBody.enabled = true;
        }, 1);
    }

    updateCoins(){
        this.coins += 1;
        this.coinNode.getComponent(cc.Label).string = this.coins;
    }

    updateScore( score : number ){
        this.scores += 100;
        this.scoreNode.getComponent(cc.Label).string = this.scores.toString().padStart(7, '0');
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.unschedule(this.reduceTime);
    }
}


function clamp(value: number, a: number = -1, b: number = 1) {
    if (value < a) return a;
    if (value > b) return b;
    return value;
}
