import { Component, Node, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import { TILE_TYPE_ENUM } from "../enums";
const { ccclass, property } = _decorator;

/**
 * 单独的瓦片元素的控制
 */

// 定义常量用来存储瓦片的宽高，方便修改
export const TILE_WIDTH = 55;
export const TILE_HEIGTH = 55;

@ccclass('TileMannger')
export class TileManager extends Component {
    move_able: boolean = true;
    turn_able: boolean = true;
    tile_type: TILE_TYPE_ENUM;
    run_init(tile_type: TILE_TYPE_ENUM, sprite_frames: SpriteFrame, i: number, j: number) {

        this.tile_type = tile_type;
        if (this.tile_type === null) {
            // 如果是null的值
            this.move_able = false;
            this.turn_able = false;
        }

        if (this.tile_type.includes("WALL")) {
            // 如果是墙体类型的tile 则不允许旋转和移动
            this.move_able = false;
            this.turn_able = false;
        }

        if (this.tile_type.includes("CLIFF")) {
            // 如果是悬崖类型的则允许旋转不允许移动
            this.move_able = false;
            this.turn_able = true;
        }

        if (this.tile_type.includes("FLOOR")) {
            // 普通类型的则允许移动和旋转
            this.move_able = true;
            this.turn_able = true;
        }

        // 生成sprite 节点并设置 spriteFrame
        const sprite_comp = this.node.addComponent(Sprite);
        sprite_comp.spriteFrame = sprite_frames;

        // 为节点添加UITransform 组件用来控制节点的大小尺寸
        const transform_commp = this.node.getComponent(UITransform);
        transform_commp.setContentSize(TILE_WIDTH, TILE_HEIGTH);

        // 设置节点的位置
        this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGTH);

    }
}


