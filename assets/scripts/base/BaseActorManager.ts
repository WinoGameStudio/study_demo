import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec2, Vec3 } from 'cc';
import { TILE_HEIGTH as TILE_HEIGHT, TILE_WIDTH, TileManager } from '../tile/TileManager';
import { MAIN_ANIM_TYPE_ENUM, EVENT_ENUM, GAME_DIRECTION_ENUM, INPUT_DIRECTION_ENUM } from '../enums';
import EventMannager from '../runtime/EventManager';
import { DataManager } from '../runtime/DataManager';
import { PlayerAnimFSM } from '../player/PlayerAnimFSM';
import { BaseFSM } from './BaseFSM';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8;

@ccclass('BaseActorManager')
export class BaseActorManager extends Component {
    target_pos: Vec3;
    move_speed: number = 1;
    move_flag: Boolean = false;
    anim_fsm: BaseFSM;

    // 配置虚拟坐标
    unreal_x: number = 0;
    unreal_y: number = 0;
    unreal_target_x: number = 0;
    unreal_target_y: number = 0;

    main_anim_state: MAIN_ANIM_TYPE_ENUM;

    protected _game_direction: GAME_DIRECTION_ENUM = GAME_DIRECTION_ENUM.TOP;

    get game_direction(): GAME_DIRECTION_ENUM {
        return this._game_direction
    }

    set game_direction(new_direction: GAME_DIRECTION_ENUM) {
        this._game_direction = new_direction;
        this.anim_fsm.change_state(this.main_anim_state, this._game_direction);
    }

    // 执行初始化
    run_init() {
       
    }

    // 事件初始化
    init_event() {
       
    }

    update(dt: number): void {
       
    }

    // update_pos(dt: number) {
    //     if (!this.move_flag) { return }

    //     // 计算移动方向
    //     const move_direction: Vec3 = this.target_pos.clone().subtract(this.node.position).normalize();
    //     // 每次移动的距离
    //     let move_distance: number = this.move_speed * dt;
    //     // 距离目标位置的距离
    //     const distance: number = this.target_pos.clone().subtract(this.node.position).length();

    //     if (move_distance > distance) {
    //         move_distance = distance;
    //     }
    //     if (distance <= 0.01) {
    //         this.move_flag = false
    //         this.node.setPosition(this.target_pos)
    //     } else {
    //         const add_v3 = move_direction.multiplyScalar(move_distance);

    //         // 计算两个向量的和
    //         const new_pos: Vec3 = this.node.position.clone().add(add_v3);
    //         this.node.setPosition(new_pos)
    //     }

    // }
    //


    update_pos(dt: number) {
    
    }

    // 角色移动
    // move(input_direction: INPUT_DIRECTION_ENUM) {
    //     let target_x: number = 0;
    //     let target_y: number = 0;
    //     switch (input_direction) {
    //         case INPUT_DIRECTION_ENUM.TOP:
    //             target_x = this.node.position.x;
    //             target_y = this.node.position.y + TILE_HEIGHT;
    //             this.target_pos = new Vec3(target_x, target_y)
    //             break
    //         case INPUT_DIRECTION_ENUM.BOTTOM:
    //             target_x = this.node.position.x;
    //             target_y = this.node.position.y - TILE_HEIGHT;
    //             this.target_pos = new Vec3(target_x, target_y)
    //             break
    //         case INPUT_DIRECTION_ENUM.LEFT:
    //             target_x = this.node.position.x - TILE_WIDTH;
    //             target_y = this.node.position.y;
    //             this.target_pos = new Vec3(target_x, target_y)
    //             break
    //         case INPUT_DIRECTION_ENUM.RIGHT:
    //             target_x = this.node.position.x + TILE_WIDTH;
    //             target_y = this.node.position.y;
    //             this.target_pos = new Vec3(target_x, target_y)
    //             break
    //         case INPUT_DIRECTION_ENUM.TURN_LEFT:
    //             this.main_anim_state = MAIN_ANIM_TYPE_ENUM.TURN_LEFT;
    //             switch (this.game_direction) {
    //                 case GAME_DIRECTION_ENUM.TOP:
    //                     this.game_direction = GAME_DIRECTION_ENUM.LEFT;
    //                     break
    //                 case GAME_DIRECTION_ENUM.BOTTOM:
    //                     this.game_direction = GAME_DIRECTION_ENUM.RIGHT;
    //                     break;
    //                 case GAME_DIRECTION_ENUM.LEFT:
    //                     this.game_direction = GAME_DIRECTION_ENUM.BOTTOM;
    //                     break;
    //                 case GAME_DIRECTION_ENUM.RIGHT:
    //                     this.game_direction = GAME_DIRECTION_ENUM.TOP;
    //                     break;
    //             }
    //             this.target_pos = this.node.position;
    //             break
    //         case INPUT_DIRECTION_ENUM.TURN_RIGHT:
    //             switch (this.game_direction) {
    //                 case GAME_DIRECTION_ENUM.TOP:
    //                     this.game_direction = GAME_DIRECTION_ENUM.RIGHT;
    //                     break;
    //                 case GAME_DIRECTION_ENUM.BOTTOM:
    //                     this.game_direction = GAME_DIRECTION_ENUM.LEFT;
    //                     break;
    //                 case GAME_DIRECTION_ENUM.LEFT:
    //                     this.game_direction = GAME_DIRECTION_ENUM.TOP;
    //                     break;
    //                 case GAME_DIRECTION_ENUM.RIGHT:
    //                     this.game_direction = GAME_DIRECTION_ENUM.BOTTOM;
    //                     break;
    //             }
    //             this.target_pos = this.node.position;
    //             break

    //     }
    //     this.move_flag = true;
    // }

    // 创建
    init_render() {
        // 添加一个 Sprite 组件
        const sprite_comp = this.addComponent(Sprite);
        sprite_comp.sizeMode = Sprite.SizeMode.CUSTOM;

        // 设置 节点的 width height
        const transform_comp = this.getComponent(UITransform);
        transform_comp.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

        // 添加一个动画组件
        const animation_comp = this.addComponent(Animation);
    }
}

