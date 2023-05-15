import { ITile } from "../../levels";
import BaseSingleton from "../base/BaseSingleton";
import { TileManager } from "../tile/TileManager";

export class DataManager extends BaseSingleton {

    // 将该方法修饰位一个类的属性
    static get instance() {
        return super.get_instance<DataManager>();
    }

    // 当前关卡的地图数据
    mapInfo: Array<Array<ITile>>
    // 当前地图块的行数量
    map_row_count: number = 0;
    // 当前地图块的列数量
    map_col_count: number = 0;
    // 当前关卡编号
    current_level_index: number = 1;

    // 用于存放当前地图块上绑定的所有 TileManager 脚本组件
    tile_manager_list: Array<Array<TileManager>> = [];

    // 记录玩家当前的二维坐标
    player_coordinate: [number, number] = [0, 0];

    
    reset() {
        this.mapInfo = [];
        this.map_row_count = 0;
        this.map_col_count = 0;
        this.tile_manager_list = [];
    }
}
