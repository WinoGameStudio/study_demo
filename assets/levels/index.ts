import { TILE_TYPE_ENUM } from "../scripts/enums";
import Level1 from "./Level1";
import Level2 from "./Level2";

// 为瓦片块的信息封装一个接口，方便以后的瓦片信息有代码提示
export interface ITile{
    src: number | null,
    type: TILE_TYPE_ENUM | null,
}

// 为level 封装接口，方便类型提示
export interface ILevel{
    mapInfo:Array<Array<ITile>>
}

// 将所有的 关卡信息封装到一起导出，方便管理
const Levels:Record<string,ILevel> = {
    Level1,
    Level2,
}

export default Levels