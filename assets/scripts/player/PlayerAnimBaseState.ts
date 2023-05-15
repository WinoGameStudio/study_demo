import { AnimationClip, Animation } from "cc";
import BaseAnimState from "../base/BaseAnimState";
import EventMannager from "../runtime/EventManager";
import { EVENT_ENUM } from "../enums";

export class PlayerAnimBaseState extends BaseAnimState {
    // 此处发射事件
    init_event() {
        this.anim_comp.on(Animation.EventType.FINISHED, (type, anim_state) => {
            // 只有非循环动画才会发射动画播放结束事件
            if (anim_state.name !== this.anim_clip_nanme) return;
            if(this.warp_mode !== AnimationClip.WrapMode.Normal){return};
            EventMannager.instance.emit(EVENT_ENUM.TURN_ANIM_FINISHED);
        }, this)
    }
}