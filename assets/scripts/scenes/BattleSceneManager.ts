import { _decorator, Component, Layers, Node, UITransform } from 'cc';
import { TileMapManager } from '../tile/TileMapManager';
import { createUI_node } from '../utils';
import Levels, { ILevel } from '../../levels';
import { DataManager } from '../runtime/DataManager';
import { TILE_HEIGTH, TILE_WIDTH } from '../tile/TileManager';
import EventMannager from '../runtime/EventManager';
import { EVENT_ENUM } from '../enums';
import { PlayerManager } from '../player/PlayerMannager';
import { WoodenSkeletonManager } from '../enemy/woodenskeleton/WoodenSkeletonManager';
const { ccclass, property } = _decorator;

/**
 * 当前脚本的作用为Battle Scene 的主场景控制脚本
 */

@ccclass('BattleSceneManager')
export class BattleSceneManager extends Component {
    level: ILevel;
    stage: Node;
    player_node :Node;
    wooden_skeleton:Node;

    // 脚本初始化时执行操作
    protected onLoad(): void {
        EventMannager.instance.on(EVENT_ENUM.NEXT_LEVEL,this.next_level,this)
    }

    protected onDestroy(): void {
        EventMannager.instance.off(EVENT_ENUM.NEXT_LEVEL,this.next_level,this)
    }

    start() {
        this.generate_stage();
        this.init_level();
        this.generate_player();
        this.generate_wooden_skeleton();

    }

    // 初始化关卡
    init_level() {
        // 获取关卡信息
        this.level = Levels[`Level${DataManager.instance.current_level_index}`];
        if (this.level) {

            // 将地图的map信息存放到 数据中心
            DataManager.instance.mapInfo = this.level.mapInfo
            DataManager.instance.map_row_count = this.level.mapInfo.length;
            DataManager.instance.map_col_count = this.level.mapInfo[0].length;

            // 生成瓦片地图
            this.generate_tile_map();

            // 配置瓦片地图的位置
            this.time_map_adpat_pos();

        }
    }



    // 创建玩家
    generate_player(){
        this.player_node = createUI_node();
        this.player_node.setParent(this.stage);
        const conn_comp =  this.player_node.addComponent(PlayerManager);
        conn_comp.run_init();
    }

    // 创建小怪
    generate_wooden_skeleton(){
        this.wooden_skeleton = createUI_node();
        this.wooden_skeleton.setParent(this.stage);
        const conn_comp =  this.wooden_skeleton.addComponent(WoodenSkeletonManager);
        conn_comp.run_init();
    }

    // 清理舞台
    clear_stage(){
        this.stage.destroyAllChildren();
    }

    // 切换至下一关
    next_level() {
        this.clear_stage();
        DataManager.instance.current_level_index++;
        this.init_level();
    }

    update(deltaTime: number) {

    }

    generate_stage() {
        // 创建一个总的节点，下方挂载 玩家和 地图等相关内容
        this.stage = createUI_node();
        // this.stage.getComponent(UITransform).setAnchorPoint(0,1);
        this.stage.setParent(this.node);

    }

    // 生成瓦片地图
    generate_tile_map() {
        // 将 要生成的tile_map 添加到该节点上
        const tile_map_group = createUI_node();
        tile_map_group.setParent(this.stage);

        const tile_mannger_comp = tile_map_group.addComponent(TileMapManager);
        tile_mannger_comp.run_init();
    }

    // 配置瓦片地图的位置
    time_map_adpat_pos() {
        const { map_row_count, map_col_count } = DataManager.instance;
        // 因为 节点的默认achor 是在 0.5 0.5 上的，添加的瓦片图，会偏移
        const dis_x = TILE_WIDTH * map_col_count / 2 - TILE_WIDTH / 2;
        const dis_y = TILE_HEIGTH * map_row_count / 2 + 80;
        this.stage.setPosition(-dis_x, dis_y);
        console.log(DataManager.instance.tile_manager_list)
    }

}

