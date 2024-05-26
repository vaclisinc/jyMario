const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start () {
        let StartButton = new cc.Component.EventHandler();
        StartButton.target = this.node;
        StartButton.component = "StartPage";
        StartButton.handler = "onStartButton";

        cc.find("Canvas/START").getComponent(cc.Button).clickEvents.push(StartButton);
    }

    onStartButton(){
        cc.director.loadScene("menu");
    }
}
