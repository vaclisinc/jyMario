
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.scheduleOnce(() => {
            cc.director.loadScene("menu");
        }, 5);
    }

    // update (dt) {}
}
