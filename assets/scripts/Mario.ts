import { GameMgr } from "./GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export class Mario extends cc.Component {
    private _hAxis: number = 0;
    private _vAxis: number = 0;
    private isOnGround: boolean = false;
    private isJumping: boolean = false;
    private lives: number;
    private scores: number;
    private recentTime: number;
    private idleFrame: cc.SpriteFrame = null;
    private anim: cc.Animation = null;
    private rigidBody: cc.RigidBody;

    @property moveSpeed: number = 500;
    @property jumpSpeed: number = 900;
    @property initialPosition: cc.Vec3;
    @property(GameMgr) GameMgr: GameMgr = null;
    @property(cc.Node) ground = null;
    @property(cc.Node) livesPoints = null;
    @property(cc.Node) scorePoints = null;
    @property(cc.Node) timePoints = null;

    onLoad() {
        this.node.setPosition(cc.v3(223.711, 87.699, 0));
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0, -320); // 設置重力
    }

    start() {
        this.initValue();
        this.declareElement();
    }


    update(dt: number) {
        this.updatePosition();
        this.decideAnim();
        if (this.node.y < this.ground.y) {
            this.anim.play("die");
            this.loseLife();
        }
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

    updatePosition(){
        let velocity = this.rigidBody.linearVelocity;
        if (this._hAxis !== 0) {
            velocity.x = this._hAxis * this.moveSpeed;
        } else if (this._hAxis === 0){
            velocity.x = 0;
        }
        this.rigidBody.linearVelocity = velocity;
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'ground') {
            const worldManifold = contact.getWorldManifold();
            const normal = worldManifold.normal;
            // 確保接觸點的法線是指向上的
            if (normal.y < 0) {
                this.isOnGround = true;
                this.rigidBody.linearVelocity.y = 0;
            }
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'ground') {
            this.isOnGround = false;
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
                if (this.isOnGround) {
                    // this._vAxis++;
                    this.isJumping = true;
                    this.anim.play("jump");
                    this.GameMgr.playJump();
                    let velocity = this.rigidBody.linearVelocity;
                    velocity.y = this.jumpSpeed;
                    this.rigidBody.linearVelocity = velocity;
                    this.isOnGround = false;
                    this.isJumping = false;
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

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            console.log('Game Over');
        } else {
            this.resetPosition();
        }
    }


    initValue() {
        this.initialPosition = this.node.position;
        this.lives = 3;
        this.scores = 0;
        this.recentTime = 300;
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
        rigidBody.enabled = true;
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}


function clamp(value: number, a: number = -1, b: number = 1) {
    if (value < a) return a;
    if (value > b) return b;
    return value;
}
