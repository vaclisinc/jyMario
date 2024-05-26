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
    @property(cc.Prefab) flowerPrefab = null;
    @property(cc.Prefab) goombaPrefab = null;
    @property(cc.Node) gameStart = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameStart.active = true;
        // this.coinInit();
    }

    start () {
        setTimeout( () => {
            this.gameStart.active = false;
            cc.audioEngine.playMusic(this.bgm, true);
            this.coinInit();
            this.flowerInit();
            this.goombaInit();
        }, 1000);
    }

    update (dt) {
        
    }

    flowerInit(){
        this.setNewFlowerPos(-400, -112.622, false);
        this.setNewFlowerPos(-223.329, -101.1, true);
        this.setNewFlowerPos(-94.616, -83.766, false);
    }

    goombaInit(){
        this.setNewGoombaPos(-251, -119.277);
    }

    coinInit(){
        this.setNewCoinPos(-502.731, 15.415);
        this.setNewCoinPos(-336.757, -80);
        this.setNewCoinPos(-280.269, -80);
        this.setNewCoinPos(-93.373, 31.454);
        this.setNewCoinPos(91.431, -108);
        this.setNewCoinPos(91.431, -69.5);
        this.setNewCoinPos(91.431, -31);
        this.setNewCoinPos(252, 25.5);
        this.setNewCoinPos(280, 25.5);
        this.setNewCoinPos(634.042, -118.298);
    }

    setNewCoinPos(x : number, y : number){
        var coin = cc.instantiate(this.coinPrefab);
        coin.setPosition(x, y);
        cc.find("coins").addChild(coin);
    }

    setNewFlowerPos(x : number, y : number, isDelay : boolean){
        var flower = cc.instantiate(this.flowerPrefab);
        flower.setPosition(x, y);
        cc.find("flowers").addChild(flower);
        isDelay? this.flowerMove(flower) : this.flowerMove2(flower);
    }

    setNewGoombaPos(x : number, y : number){
        var goomba = cc.instantiate(this.goombaPrefab);
        goomba.setPosition(x, y);
        cc.find("goombas").addChild(goomba);
        this.goombaMove(goomba);
    }

    flowerMove( flowerNode : cc.Node ){
        let action: cc.Action;
        let easeRate: number = 2;
        let moveUp = cc.moveBy(2, cc.v2(0, 31.786) ).easing(cc.easeInOut(easeRate));
        let moveDown = cc.moveBy(2, cc.v2(0, -31.786)).easing(cc.easeInOut(easeRate));
        let delay = cc.delayTime(1);
        var sequence = cc.sequence(moveUp, delay, moveDown, delay);
        action = cc.repeatForever(sequence);
        this.scheduleOnce( () => {
            flowerNode.runAction(action);
        }, 1);
    }

    flowerMove2( flowerNode : cc.Node ){
        let action: cc.Action;
        let easeRate: number = 2;
        let moveUp = cc.moveBy(2, cc.v2(0, 31.786) ).easing(cc.easeInOut(easeRate));
        let moveDown = cc.moveBy(2, cc.v2(0, -31.786)).easing(cc.easeInOut(easeRate));
        let delay = cc.delayTime(1);
        var sequence = cc.sequence(delay, moveUp, delay, moveDown, delay);
        action = cc.repeatForever(sequence);
        this.scheduleOnce( () => {
            flowerNode.runAction(action);
        }, 1);
    }

    goombaMove( goombaNode : cc.Node ){
        let action: cc.Action;
        let easeRate: number = 2;
        let moveLeft = cc.moveBy(2, cc.v2(-116, 0) ).easing(cc.easeInOut(easeRate));
        let moveRight = cc.moveBy(2, cc.v2(+116, 0)).easing(cc.easeInOut(easeRate));
        // let delay = cc.delayTime(1);
        var sequence = cc.sequence(moveLeft, moveRight);
        action = cc.repeatForever(sequence);
        this.scheduleOnce( () => {
            goombaNode.runAction(action);
        }, 1);
    }

    goombaDie( goombaNode : cc.Node ){
        goombaNode.getComponent(cc.Collider).enabled = false;
        let anim = goombaNode.getComponent(cc.Animation);
        cc.audioEngine.playEffect(this.hit, false);
        anim.play('goombaDie');
        this.scheduleOnce(() => {
            goombaNode.destroy();
        }, 0.5);
    }

    clearAllPrefabs(){ //flower no need to destroy
        let goombasNode = cc.find("goombas");
        let coinsNode = cc.find("coins");
        if (goombasNode) {
            goombasNode.children.forEach( (goomba) => {
                goomba.destroy();
            });
        } else {
            console.log("already no goombas");
        }
        if (coinsNode) {
            coinsNode.children.forEach( (coin) => {
                coin.destroy();
            });
        } else {
            console.log("already no coins");
        }
    }

    stopPlay(){
        cc.audioEngine.stopMusic();
    }

    playBGM(){
        cc.audioEngine.playMusic(this.bgm, true);
    }

    playJump() {
        cc.audioEngine.playEffect(this.jump, false);
    }

    // playHit() {
    //     cc.audioEngine.playEffect(this.hit, false);
    // }

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
