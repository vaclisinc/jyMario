
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    private anim: cc.Animation = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start() {
        this.anim.play("questionBrick");
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.name === 'Mario') {
            const contactNormal = contact.getWorldManifold().normal;
            console.log("COLLIDE!");
            if (contactNormal.y < 0) {
                this.anim.play("staticBrick");
            }
        }
    }
}
