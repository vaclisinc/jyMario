const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null; 

    @property
    followSpeed: number = 200;

    @property(cc.Rect)
    mapBounds: cc.Rect = new cc.Rect(0, 0, 3200, 640); 

    update(dt: number) {
        if (this.target) {
            let targetPos = this.target.convertToWorldSpaceAR(cc.Vec3.ZERO);
            let currentPos = this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            let newPos = currentPos.lerp(new cc.Vec3(targetPos.x, currentPos.y, currentPos.z), this.followSpeed);

            let halfScreenWidth = cc.winSize.width / 2;
            let leftBoundary = this.mapBounds.xMin + halfScreenWidth;
            newPos.x = Math.max(newPos.x, leftBoundary);

            this.node.position = this.node.parent.convertToNodeSpaceAR(newPos);

            // let targetPos = cc.Vec3.ZERO;
            // let currentPos = cc.Vec3.ZERO;
            // let newPos = currentPos.lerp(new cc.Vec3(targetPos.x, currentPos.y, currentPos.z), this.followSpeed);

            // let halfScreenWidth = cc.winSize.width / 2;
            // let leftBoundary = this.mapBounds.xMin + halfScreenWidth;
            // newPos.x = Math.max(newPos.x, leftBoundary);

            // this.node.position = newPos;

        }
    }
}
