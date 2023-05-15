import { _decorator, AnimationClip, Component, Node, Animation, game } from 'cc';
import { GAME_DIRECTION_ENUM, MAIN_ANIM_TYPE_ENUM } from '../enums';
import { PlayerIdleAnimStateMachine, PlayerTurnLeftAnimStateMachine, PlayerTurnRightAnimStateMachine } from './PlayerSubStateMachine';
import { BaseFSM } from '../base/BaseFSM';
const { ccclass, property } = _decorator;

/**
 * 动画状态机
 */
export class PlayerAnimFSM extends BaseFSM {
    current_main_state: MAIN_ANIM_TYPE_ENUM;
    game_direcation: GAME_DIRECTION_ENUM;
    conn_comp: Component;
    constructor(conn_comp: Component) {
        super("");
        this.conn_comp = conn_comp;
    }

    // 状态切换
    change_state(main_anim_state: MAIN_ANIM_TYPE_ENUM, game_direction: GAME_DIRECTION_ENUM) {
        this.current_main_state = main_anim_state;
        this.game_direcation = game_direction;
        this.run_state_func();
    }

    // 更新状态切换的动画
    run_state_func() {
        this.state_dict.get(this.current_main_state).change_state(this.game_direcation);
    }

    // 添加状态
    add_state() {
        let anim_comp = this.conn_comp.node.getComponent(Animation);
        this.state_dict.set(MAIN_ANIM_TYPE_ENUM.IDLE, new PlayerIdleAnimStateMachine(anim_comp, MAIN_ANIM_TYPE_ENUM.IDLE));
        this.state_dict.set(MAIN_ANIM_TYPE_ENUM.TURN_LEFT, new PlayerTurnLeftAnimStateMachine(anim_comp, MAIN_ANIM_TYPE_ENUM.TURN_LEFT));
        this.state_dict.set(MAIN_ANIM_TYPE_ENUM.TURN_RIGHT, new PlayerTurnRightAnimStateMachine(anim_comp, MAIN_ANIM_TYPE_ENUM.TURN_RIGHT));
    }

    // 初始化方法
    run_init() {
        this.add_state();
    }
}
