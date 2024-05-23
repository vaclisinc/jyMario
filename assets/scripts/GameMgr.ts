// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class GameMgr extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.AudioClip)
    jump: cc.AudioClip = null;

    @property(cc.AudioClip)
    hit: cc.AudioClip = null;

    @property(cc.AudioClip)
    coin: cc.AudioClip = null;

    @property(cc.AudioClip)
    die: cc.AudioClip = null;

    @property(cc.AudioClip)
    pass: cc.AudioClip = null;

    @property(cc.AudioClip)
    mushroom: cc.AudioClip = null;

    @property(cc.AudioClip)
    bigger: cc.AudioClip = null;

    @property(cc.AudioClip)
    smaller: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameover: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    update (dt) {}

    playJump() {
        cc.audioEngine.playEffect(this.jump, false);
    }

    playHit() {
        cc.audioEngine.playEffect(this.hit, false);
    }

    playCoin() {
        cc.audioEngine.playEffect(this.coin, false);
    }

    playDie() {
        cc.audioEngine.playEffect(this.die, false);
    }

    playPass() {
        cc.audioEngine.playEffect(this.pass, false);
    }

    playMushroom() {
        cc.audioEngine.playEffect(this.mushroom, false);
    }

    playBigger() {
        cc.audioEngine.playEffect(this.bigger, false);
    }

    playSmaller() {
        cc.audioEngine.playEffect(this.smaller, false);
    }

    playGameover() {
        cc.audioEngine.playEffect(this.gameover, false);
    }


}
