const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    }

    start() { }
    
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'Mario') {
            this.node.destroy();
        }
    }
}