const {ccclass, property} = cc._decorator;

@ccclass
export class GameMgr extends cc.Component {

    @property(cc.AudioClip) bgm: cc.AudioClip = null;
    @property(cc.AudioClip) jump: cc.AudioClip = null;
    @property(cc.AudioClip) hit: cc.AudioClip = null;
    @property(cc.AudioClip) die: cc.AudioClip = null;
    @property(cc.AudioClip) pass: cc.AudioClip = null;
    @property(cc.AudioClip) mushroom: cc.AudioClip = null;
    @property(cc.AudioClip) bigger: cc.AudioClip = null;
    @property(cc.AudioClip) smaller: cc.AudioClip = null;
    @property(cc.AudioClip) gameover: cc.AudioClip = null;
    @property(cc.AudioClip) coin: cc.AudioClip = null;
    @property(cc.Prefab) coinPrefab = null;
    @property(cc.Node) gameStart = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.coinInit();
    }

    start () {
        setTimeout( () => {
            this.gameStart.destroy();
            cc.audioEngine.playMusic(this.bgm, true);
            this.coinInit();
        }, 1000);
    }

    update (dt) {}

    coinInit(){
        this.setNewCoinPos(-502.731, 15.415);
        this.setNewCoinPos(-336.757, -115);
        this.setNewCoinPos(-280.269, -115);
        this.setNewCoinPos(-93.373, 31.454);
        this.setNewCoinPos(91.431, -108);
        this.setNewCoinPos(91.431, -69.5);
        this.setNewCoinPos(91.431, -31);
        this.setNewCoinPos(634.042, -118.298);
    }

    setNewCoinPos(x:number, y:number){
        var coin = cc.instantiate(this.coinPrefab);
        coin.setPosition(x, y);
        cc.find("coins").addChild(coin);
    }

    stopPlay(){
        cc.audioEngine.stopMusic();
    }

    playJump() {
        cc.audioEngine.playEffect(this.jump, false);
    }

    playHit() {
        cc.audioEngine.playEffect(this.hit, false);
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

    gameOver(){
        cc.audioEngine.stopMusic();
        cc.audioEngine.playEffect(this.gameover, false);
        cc.director.loadScene("gameOver");
    }

    playCoin(){
        cc.audioEngine.playEffect(this.coin, false);
    }

}
