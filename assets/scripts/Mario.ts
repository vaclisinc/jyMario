import { GameMgr } from "./GameMgr"; 

const { ccclass, property } = cc._decorator;

@ccclass
export class Mario extends cc.Component {
    @property
    speed: number = 200;

    @property
    jumpSpeed: number = 500;

    @property(GameMgr)
    GameMgr: GameMgr = null;

    private _hAxis: number = 0;
    public get horizontalAxis(): number { return this._hAxis }

    private _vAxis: number = 0;
    public get verticalAxis(): number { return this._vAxis }

    private isJumping: boolean = false;
    private isOnGround: boolean = false;


    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().gravity = cc.v2(0, -320); // 设置重力

    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number) {
        if (this._hAxis !== 0) { //mario move
            this.node.x += this._hAxis * this.speed * dt;
        }
        if (!this.isOnGround) {
            let velocity = this.node.getComponent(cc.RigidBody).linearVelocity;
            velocity.y += cc.director.getPhysicsManager().gravity.y * dt;
            this.node.getComponent(cc.RigidBody).linearVelocity = velocity;
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'ground') {
            this.isOnGround = true;
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.group === 'ground') {
            this.isOnGround = false;
        }
    }
    
    onKeyDown(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._hAxis--;
                break;
            case cc.macro.KEY.right:
                this._hAxis++;
                break;
            case cc.macro.KEY.up:
                this.jump();
                break;
        }
        this._hAxis = clamp(this._hAxis);
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this._hAxis++;
                break;
            case cc.macro.KEY.right:
                this._hAxis--;
                break;
        }
        this._hAxis = clamp(this._hAxis);
    }

    jump() {
        // if (this.isJumping) return;
        // this.isJumping = true;

        // let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // let sequence = cc.sequence( jumpUp, jumpDown, cc.callFunc(() => {
        //     this.isJumping = false;
        // }) );

        // this.GameMgr.playJump();
        // this.node.runAction(sequence);
        if (this.isOnGround) {
            this.isOnGround = false;
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpSpeed);
        }
    }
}

function clamp(value: number, a: number = -1, b: number = 1) {
    if (value < a) return a;
    if (value > b) return b;
    return value;
}
