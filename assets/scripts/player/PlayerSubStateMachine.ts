import { Animation, AnimationClip } from "cc";
import { PlayerBaseSubStateAnimFSM } from "./PlayerBaseSubStateAnimFSM";
import { GAME_DIRECTION_ENUM } from "../enums";

/**
 * 定义子状态机
 */
export class PlayerIdleAnimStateMachine extends PlayerBaseSubStateAnimFSM {
    constructor(anim_comp: Animation, parent_fsm_name: string) {
        super(parent_fsm_name);
        this.add_state(GAME_DIRECTION_ENUM.TOP, anim_comp, "texture/player/idle/top", AnimationClip.WrapMode.Loop);
        this.add_state(GAME_DIRECTION_ENUM.BOTTOM, anim_comp, "texture/player/idle/bottom", AnimationClip.WrapMode.Loop);
        this.add_state(GAME_DIRECTION_ENUM.LEFT, anim_comp, "texture/player/idle/left", AnimationClip.WrapMode.Loop);
        this.add_state(GAME_DIRECTION_ENUM.RIGHT, anim_comp, "texture/player/idle/right", AnimationClip.WrapMode.Loop);
    }

}

export class PlayerTurnLeftAnimStateMachine extends PlayerBaseSubStateAnimFSM {
    constructor(anim_comp: Animation, parent_fsm_name: string) {
        super(parent_fsm_name);
        this.add_state(GAME_DIRECTION_ENUM.TOP, anim_comp, "texture/player/turnleft/top", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.BOTTOM, anim_comp, "texture/player/turnleft/bottom", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.LEFT, anim_comp, "texture/player/turnleft/left", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.RIGHT, anim_comp, "texture/player/turnleft/right", AnimationClip.WrapMode.Normal);
    }
}

export class PlayerTurnRightAnimStateMachine extends PlayerBaseSubStateAnimFSM {
    constructor(anim_comp: Animation, parent_fsm_name: string) {
        super(parent_fsm_name);
        this.add_state(GAME_DIRECTION_ENUM.TOP, anim_comp, "texture/player/turnright/top", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.BOTTOM, anim_comp, "texture/player/turnright/bottom", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.LEFT, anim_comp, "texture/player/turnright/left", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.RIGHT, anim_comp, "texture/player/turnright/right", AnimationClip.WrapMode.Normal);
    }
}