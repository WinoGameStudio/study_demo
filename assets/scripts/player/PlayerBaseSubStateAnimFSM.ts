import { Component, Animation, AnimationClip, Constraint } from "cc";
import BaseAnimState, { IAnimStateOptions } from "../base/BaseAnimState";
import { PlayerAnimBaseState } from "./PlayerAnimBaseState";
import { BaseFSM } from "../base/BaseFSM";

export class PlayerBaseSubStateAnimFSM extends BaseFSM {
    frame_res_path: string;
    constructor(parent_fsm_name: string) {
        super(parent_fsm_name)
        if (parent_fsm_name) {
            this.parent_fsm_name = parent_fsm_name;
        }
    }

    // 状态切换
    change_state(state: string) {
        this.current_state = state;
        this.run_state_func();
    }

    // 更新状态切换的方法
    run_state_func() {
        const miexed_state_name = this.get_mixed_state_name(this.current_state);
        console.log(miexed_state_name,"准备播放动画");
        this.state_dict.get(miexed_state_name).on_enter();
    }

    // 添加状态
    add_state(anim_clip_nanme: string, anim_comp: Animation, frame_res_path: string, warp_mode: AnimationClip.WrapMode) {
        const miexed_state_name = this.get_mixed_state_name(anim_clip_nanme);
        let options: IAnimStateOptions = {
            anim_clip_nanme: miexed_state_name,
            anim_comp: anim_comp,
            frame_res_path: frame_res_path,
            warp_mode: warp_mode,
        }
        const anim_state = new PlayerAnimBaseState(options)
        this.state_dict.set(miexed_state_name, anim_state)
    }

    // 初始化方法
    run_init() {

    }
}