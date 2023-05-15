import { _decorator, animation, Animation, AnimationClip, Component, Node, Sprite, SpriteFrame, UITransform, Vec2, Vec3 } from 'cc';
import { TILE_HEIGTH as TILE_HEIGHT, TILE_WIDTH, TileManager } from '../tile/TileManager';
import { MAIN_ANIM_TYPE_ENUM, EVENT_ENUM, GAME_DIRECTION_ENUM, INPUT_DIRECTION_ENUM } from '../enums';
import EventMannager from '../runtime/EventManager';
import { PlayerAnimFSM } from './PlayerAnimFSM';
import { DataManager } from '../runtime/DataManager';
import { BaseActorManager } from '../base/BaseActorManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends BaseActorManager {
    target_pos: Vec3;
    move_speed: number = 1;
    move_flag: Boolean = false;
    anim_fsm: PlayerAnimFSM;

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
        this.anim_fsm = new PlayerAnimFSM(this);
        this.main_anim_state = MAIN_ANIM_TYPE_ENUM.IDLE;
        // this.game_direction = GAME_DIRECTION_ENUM.RIGHT;
        this.init_player_pos();
        this.init_render();
        this.anim_fsm.run_init();
        this.anim_fsm.change_state(this.main_anim_state, this.game_direction);
    }

    // 事件初始化
    init_event() {
        EventMannager.instance.on(EVENT_ENUM.PLAYER_MOVE, this.move, this);
        EventMannager.instance.on(EVENT_ENUM.TURN_ANIM_FINISHED, () => {
            this.main_anim_state = MAIN_ANIM_TYPE_ENUM.IDLE;
            this.game_direction = this.game_direction;
        }, this)
    }

    update(dt: number): void {
        this.update_pos(dt);
    }

    //  初始化玩家角色的初始位置
    init_player_pos() {
        this.unreal_target_x = 2;
        this.unreal_target_y = 8;
        this.unreal_x = this.unreal_target_x;
        this.unreal_y = this.unreal_target_y;
        // 虚拟坐标转换为实际坐标
        this.node.setPosition(this.unreal_x * TILE_WIDTH, -this.unreal_y * TILE_HEIGHT);
    }

    update_pos(dt: number) {
        if (!this.move_flag) { return }
        const distance = this.move_speed * dt;
        if (this.unreal_target_x > this.unreal_x) {
            // 目标在右侧
            this.unreal_x += distance;
        } else {
            // 目标移动位置在左侧
            this.unreal_x -= distance;
        }


        if (this.unreal_target_y > this.unreal_y) {
            // 目标在下方
            this.unreal_y += distance;
        } else {
            // 目标在上方
            this.unreal_y -= distance;
        }


        if (this.unreal_target_x - this.unreal_x <= 0.01 || this.unreal_target_y - this.unreal_y <= 0.01) {
            // 距离已经很近了判定相等
            this.unreal_x = this.unreal_target_x;
            this.unreal_y = this.unreal_target_y;
            this.move_flag = false;
            DataManager.instance.player_coordinate = [this.unreal_x, this.unreal_y];
            EventMannager.instance.emit(EVENT_ENUM.PLAYER_MOVE_FINISHED, this)
        }

        // 虚拟坐标转换为实际坐标
        this.node.setPosition(this.unreal_x * TILE_WIDTH, -this.unreal_y * TILE_HEIGHT);
    }

    move_block_judge(input_direction: INPUT_DIRECTION_ENUM) {
        let tile_manager_comp: TileManager = null;
        switch (input_direction) {
            case INPUT_DIRECTION_ENUM.TOP:
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        // 判断上方1块是否是悬崖 如果是悬崖则不允许移动
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 1];
                        if (tile_manager_comp.tile_type.includes("CLIFF")) { return };

                        // 获取上方2格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 2];
                        // 如果这个格子是悬崖 则允许移动到边缘
                        if (tile_manager_comp.tile_type.includes("CLIFF")) {
                            return true
                        }
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:

                        // 获取上1格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        // 获取左上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        // 获取右上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                }
                break
            case INPUT_DIRECTION_ENUM.BOTTOM:
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        // 获取下方1格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        // 判断下方1块是否是悬崖 如果是悬崖则不允许移动
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 1];
                        if (tile_manager_comp.tile_type.includes("CLIFF")) { return };

                        // 获取下方2格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 2];
                        // 如果这个格子是悬崖 则允许移动到边缘
                        if (tile_manager_comp.tile_type.includes("CLIFF")) {
                            return true
                        }
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        // 获取左下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        // 获取右下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                }
                break
            case INPUT_DIRECTION_ENUM.LEFT:
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        // 获取左上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取左方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        // 获取左下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取左方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        // 判断左方前1块是否是悬崖 如果是悬崖则不允许移动
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y];
                        if (tile_manager_comp.tile_type.includes("CLIFF")) { return };
                        // 获取左方2格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 2][this.unreal_y];
                        // 如果这个格子是悬崖 则允许移动到边缘
                        if (tile_manager_comp.tile_type.includes("CLIFF")) {
                            return true
                        }
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        // 获取左方1格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                }
                break
            case INPUT_DIRECTION_ENUM.RIGHT:
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        // 获取右上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取右方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        // 获取右下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取右方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        // 获取右方1格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        // 判断右1块是否是悬崖 如果是悬崖则不允许移动
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y];
                        if (tile_manager_comp.tile_type.includes("CLIFF")) { return };
                        // 获取右方2格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 2][this.unreal_y];
                        // 如果这个格子是悬崖 则允许移动到边缘
                        if (tile_manager_comp.tile_type.includes("CLIFF")) {
                            return true
                        }
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                }
                break
            case INPUT_DIRECTION_ENUM.TURN_LEFT:
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        // 获取左上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 判断左方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        // 获取右下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 判断右方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        // 获取左下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        // 获取右上格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 判断上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                }
                break
            case INPUT_DIRECTION_ENUM.TURN_RIGHT:
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        // 获取右上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 判断右方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        // 获取左下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 判断右方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        // 获取左上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x - 1][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 获取上方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y - 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        // 获取右下格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x + 1][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        // 判断下方格子是否阻挡
                        tile_manager_comp = DataManager.instance.tile_manager_list[this.unreal_x][this.unreal_y + 1];
                        if (!tile_manager_comp.move_able) {
                            return
                        }
                        break;
                }
                break

        }
        return true
    }

    move(input_direction: INPUT_DIRECTION_ENUM) {
        if (!this.move_block_judge(input_direction)) return;
        switch (input_direction) {
            case INPUT_DIRECTION_ENUM.TOP:
                this.unreal_target_y -= 1;
                break
            case INPUT_DIRECTION_ENUM.BOTTOM:
                this.unreal_target_y += 1;
                break
            case INPUT_DIRECTION_ENUM.LEFT:
                this.unreal_target_x -= 1;
                break
            case INPUT_DIRECTION_ENUM.RIGHT:
                this.unreal_target_x += 1;
                break
            case INPUT_DIRECTION_ENUM.TURN_LEFT:
                this.main_anim_state = MAIN_ANIM_TYPE_ENUM.TURN_LEFT;
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        this.game_direction = GAME_DIRECTION_ENUM.LEFT;
                        break
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        this.game_direction = GAME_DIRECTION_ENUM.RIGHT;
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        this.game_direction = GAME_DIRECTION_ENUM.BOTTOM;
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        this.game_direction = GAME_DIRECTION_ENUM.TOP;
                        break;
                }
                break
            case INPUT_DIRECTION_ENUM.TURN_RIGHT:
                this.main_anim_state = MAIN_ANIM_TYPE_ENUM.TURN_RIGHT;
                switch (this.game_direction) {
                    case GAME_DIRECTION_ENUM.TOP:
                        this.game_direction = GAME_DIRECTION_ENUM.RIGHT;
                        break;
                    case GAME_DIRECTION_ENUM.BOTTOM:
                        this.game_direction = GAME_DIRECTION_ENUM.LEFT;
                        break;
                    case GAME_DIRECTION_ENUM.LEFT:
                        this.game_direction = GAME_DIRECTION_ENUM.TOP;
                        break;
                    case GAME_DIRECTION_ENUM.RIGHT:
                        this.game_direction = GAME_DIRECTION_ENUM.BOTTOM;
                        break;
                }
                break
        }
        this.move_flag = true;
    }


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

