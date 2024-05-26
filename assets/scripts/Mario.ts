import delayTime = cc.delayTime;

const { ccclass, property } = cc._decorator;
import { GameMgr } from "./GameMgr";
import RigidBody = cc.RigidBody;

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
    @property(cc.Node) timeNode2 = null;
    @property(cc.Node) mulNode = null;

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
        if (otherCollider.node.name === 'backBox') {
            if (contactNormal.y > 0) {
                contact.disabled = true;
            }
        }
        if (otherCollider.node.name === "coin"){
            this.GameMgr.playCoin();
            this.updateCoins();
            this.updateScore(100);
        }

        if (otherCollider.node.name === 'deadBound' || otherCollider.node.name === 'flower'){
            // contact.disabled = true;
            this.loseLife();
            // contact.disabled = false;
        }

        if(otherCollider.node.name === 'goomba'){
            if(contactNormal.y < 0 ){
                this.GameMgr.goombaDie(otherCollider.node);
                this.updateScore(150);
            } else {
                this.loseLife();
            }
        }

        if(otherCollider.node.name === 'Flag'){
            this.stageCleared();
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        const contactNormal = contact.getWorldManifold().normal;

        if (otherCollider.node.group === 'ground') {
            this.isOnGround = false;
        }
        if (otherCollider.node.group === 'items'){
            this.isOnItems = false;
        }if (otherCollider.node.name === 'backBox') {
            if (contactNormal.y >= 0) {
                contact.disabled = false;
            }
        }
    }

    loseLife() {
        this.lives--;
        this.lifeNode.getComponent(cc.Label).string = this.lives.toString();
        this.unschedule(this.reduceTime);
        if (this.lives <= 0) {
            this.GameMgr.gameOver();
        } else {
            this.dieOnce(() => {
                this.scheduleOnce(() => { //這一坨是接在dieOnce後面，是等上面的動畫播完再執行
                    this.getComponent(cc.PhysicsCollider).enabled = true;
                    this.node.setPosition(this.initialPosition);
                    this.GameMgr.playBGM();
                    let action = cc.spawn(
                        cc.blink(1, 8),
                        cc.flipX(true)
                    );
                    this.node.runAction(action);
                }, 1);
            });

            this.recentTime = 300;
            this.schedule(this.reduceTime, 1);
            this.scores = 0;
            this.scoreNode.getComponent(cc.Label).string = this.scores.toString().padStart(7, '0');
            this.coins = 0;
            this.coinNode.getComponent(cc.Label).string = this.coins.toString();

            this.scheduleOnce( () => {
                this.GameMgr.clearAllPrefabs();
                this.GameMgr.goombaInit();
                this.GameMgr.coinInit();
            }, 1.5);
        }
    }

    dieOnce(animeFinishedCallback?: () => void){
        this.getComponent(RigidBody).linearVelocity = cc.v2(0, 1000);
        this.anim.play("die");
        this.getComponent(cc.PhysicsCollider).enabled = false;
        this.GameMgr.stopPlay();
        this.GameMgr.playDie();
        if (animeFinishedCallback) {
            this.anim.once('finished', animeFinishedCallback);
            // this.GameMgr.clearAllPrefabs();
            // this.GameMgr.goombaInit();
            // this.GameMgr.coinInit();
        }
    }

    stageCleared(){
        this.GameMgr.stopPlay();
        this.GameMgr.playPass();
        this.winPage(true);
        this.timeNode2.getComponent(cc.Label).string = this.recentTime.toString();
        this.mulNode.getComponent(cc.Label).string = (this.recentTime * 50).toString();
        this.scores += this.recentTime * 50;
        this.updateScore(this.scores);
        this.scheduleOnce(() => {
            cc.director.loadScene("menu");
        }, 5);
    }

    winPage(isWin: boolean){
        const clearNode = cc.find('Main Camera/CLEAR');
        clearNode.active = isWin;
        clearNode.children.forEach(child => {
            child.active = isWin;
        });
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

    reduceTime() {
        if (this.recentTime > 0) {
            this.recentTime--;
            this.timeNode.getComponent(cc.Label).string = this.recentTime;
        } else {
            this.unschedule(this.reduceTime);
            this.GameMgr.gameOver();
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
        this.winPage(false);
    }

    declareElement() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        this.anim = this.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
    }

    // resetPosition() {
    //     let rigidBody = this.node.getComponent(cc.RigidBody);
    //     rigidBody.enabled = false;
    //     this.node.setPosition(this.initialPosition);
    //     // rigidBody.enabled = true;
    //     this.scheduleOnce(() => {
    //         rigidBody.enabled = true;
    //     }, 1);
    // }

    updateCoins(){
        this.coins += 1;
        this.coinNode.getComponent(cc.Label).string = this.coins.toString();
    }

    updateScore( score : number ){
        this.scores += 100;
        this.scoreNode.getComponent(cc.Label).string = this.scores.toString().padStart(7, '0');
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
