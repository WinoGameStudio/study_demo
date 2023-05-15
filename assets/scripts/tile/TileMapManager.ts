import { _decorator, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
import { createUI_node } from '../utils';
import { TileManager } from './TileManager';
import { DataManager } from '../runtime/DataManager';
import { ResourceManager } from '../runtime/ResourceManager';
const { ccclass, property } = _decorator;

/**
 * 用来管理如何生成瓦片图的逻辑
 */

@ccclass('TileMapManager')
export class TileMapManager extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    // 执行初始化
    async run_init() {
        // 获取指定的关卡数据
        const { mapInfo } = DataManager.instance;

        // 使用动态加载资源获取 spriteFrame
        // 由于resource是一个异步操作，所以在这里等待执行完毕 使用 await 关键字等待
        let res_path = "texture/tile/tile";
        const sprite_frames = await ResourceManager.instance.load_dir<SpriteFrame>(res_path, SpriteFrame);
        const { tile_manager_list } = DataManager.instance;
        // 双层遍历获取关卡数据
        for (let i = 0; i < mapInfo.length; i++) {
            // 获取每一列的数据
            const column = mapInfo[i];
            tile_manager_list[i] = [];
            for (let j = 0; j < column.length; j++) {
                // 获取当前的列数据
                const item = column[j];

                // 跳过空的地图块
                if (item.src === null || item.type === null) {
                    continue
                }

                // 生成sprite 节点并设置 spriteFrame
                const node = createUI_node();
                // 添加TileMannger 脚本组件
                const TileMannger_comp = node.addComponent(TileManager);

                // 获取地图块上配置的图片id
                const img_src = `tile (${item.src})`

                // 动态加载图片资源并设置,
                // 使用数组的find 方法查找符合要求的元素，为了防止找不到就 随便设置一张图片
                const sprite_frame = sprite_frames.find(item => item.name === img_src) || sprite_frames[0];

                // 调用初始化方法完成初始化
                TileMannger_comp.run_init(item.type, sprite_frame, i, j);

                // 将生成好的瓦片节点挂载到 当前脚本所在的节点，就是 tile_map_group
                node.setParent(this.node);

                // 将 TileManager 脚本组件存放到数据中心去
                tile_manager_list[i][j] = TileMannger_comp;
            }
        }

    }

}

