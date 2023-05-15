import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec2, Vec3 } from 'cc';
import { BaseActorManager } from '../../base/BaseActorManager';
import { MAIN_ANIM_TYPE_ENUM, GAME_DIRECTION_ENUM, EVENT_ENUM, INPUT_DIRECTION_ENUM } from '../../enums';
import EventMannager from '../../runtime/EventManager';
import { TILE_HEIGTH, TILE_WIDTH, TileManager } from '../../tile/TileManager';
import { BaseFSM } from '../../base/BaseFSM';
import { WoodenSkeletonAnimFSM } from './WoodenSkeletonAnimFSM';
import { PlayerManager } from '../../player/PlayerMannager';
import { DataManager } from '../../runtime/DataManager';

const { ccclass, property } = _decorator;
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends BaseActorManager {
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
        this.init_event();
        this.anim_fsm = new WoodenSkeletonAnimFSM(this);
        this.main_anim_state = MAIN_ANIM_TYPE_ENUM.IDLE;
        // this.game_direction = GAME_DIRECTION_ENUM.RIGHT;
        this.init_pos();
        this.init_render();
        this.anim_fsm.run_init();
        this.anim_fsm.change_state(this.main_anim_state, this.game_direction);
    }

    // 事件初始化
    init_event() {
        EventMannager.instance.on(EVENT_ENUM.TURN_ANIM_FINISHED, () => {
            this.main_anim_state = MAIN_ANIM_TYPE_ENUM.IDLE;
            this.game_direction = this.game_direction;
        }, this)

        EventMannager.instance.on(EVENT_ENUM.PLAYER_MOVE_FINISHED,this.update_direction,this)
    }

    //  初始化玩家角色的初始位置
    init_pos() {
        this.unreal_target_x = 7;
        this.unreal_target_y = 7;
        this.unreal_x = this.unreal_target_x;
        this.unreal_y = this.unreal_target_y;
        // 虚拟坐标转换为实际坐标
        this.node.setPosition(this.unreal_x * TILE_WIDTH, -this.unreal_y * TILE_HEIGTH);
    }

    // 刷新朝向
    update_direction(conn_comp:PlayerManager){
        console.log(conn_comp)
        console.log(DataManager.instance.player_coordinate)
    }

    // 创建
    init_render() {
        // 添加一个 Sprite 组件
        const sprite_comp = this.addComponent(Sprite);
        sprite_comp.sizeMode = Sprite.SizeMode.CUSTOM;

        // 设置 节点的 width height
        const transform_comp = this.getComponent(UITransform);
        transform_comp.setContentSize(TILE_WIDTH * 4, TILE_HEIGTH * 4);

        // 添加一个动画组件
        const animation_comp = this.addComponent(Animation);

    }
}

