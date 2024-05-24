// const { ccclass, property } = cc._decorator;

// @ccclass
// export default class TiledMapCollider extends cc.Component {

//     @property(cc.Node)
//     mapNode: cc.Node = null;

//     onLoad() {
//         this.createColliders();
//     }

//     createColliders() {
//         if (!this.mapNode) {
//             cc.error('Map node is not assigned.');
//             return;
//         }

//         const tiledMap = this.mapNode.getComponent(cc.TiledMap);
//         if (!tiledMap) {
//             cc.error('No TiledMap component found on the assigned map node.');
//             return;
//         }

//         const layers = tiledMap.getLayers();
//         layers.forEach(layer => {
//             const layerSize = layer.getLayerSize();
//             for (let x = 0; x < layerSize.width; ++x) {
//                 for (let y = 0; y < layerSize.height; ++y) {
//                     const tiled = layer.getTiledTileAt(x, y);
//                     if (tiled && tiled.gid !== 0) {
//                         this.createTileCollider(tiled, layer.getMapTileSize(), x, y);
//                     }
//                 }
//             }
//         });
//     }

//     createTileCollider(tiledTile: cc.TiledTile, tileSize: cc.Size, x: number, y: number) {
//         const tileNode = new cc.Node();
//         tileNode.parent = this.node;
//         tileNode.setPosition(x * tileSize.width, y * tileSize.height);

//         const rigidBody = tileNode.addComponent(cc.RigidBody);
//         rigidBody.type = cc.RigidBodyType.Static;

//         const boxCollider = tileNode.addComponent(cc.PhysicsBoxCollider);
//         boxCollider.offset = cc.v2(tileSize.width / 2, tileSize.height / 2);
//         boxCollider.size = tileSize;
//         boxCollider.apply();
//     }
// }
