const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {
        let StartButton = new cc.Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component = "Menu";
        StartButton.handler = "onStartButton";

        cc.find("Canvas/STAGE1").getComponent(cc.Button).clickEvents.push(StartButton);
    }

    onStartButton(){
        cc.director.loadScene("stage1");
    }
}
