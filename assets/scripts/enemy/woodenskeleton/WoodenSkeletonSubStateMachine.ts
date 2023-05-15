import { Animation, AnimationClip } from "cc";
import { GAME_DIRECTION_ENUM } from "../../enums";
import { EnemyBaseSubStateAnimFSM } from "./WoodenSkeletonBaseSubStateAnimFSM";


/**
 * 定义子状态机
 */
export class WoodenSkeletonIdleAnimStateMachine extends EnemyBaseSubStateAnimFSM {
    constructor(anim_comp: Animation, parent_fsm_name: string) {
        super(parent_fsm_name);
        this.add_state(GAME_DIRECTION_ENUM.TOP, anim_comp, "texture/woodenskeleton/idle/top", AnimationClip.WrapMode.Loop);
        this.add_state(GAME_DIRECTION_ENUM.BOTTOM, anim_comp, "texture/woodenskeleton/idle/bottom", AnimationClip.WrapMode.Loop);
        this.add_state(GAME_DIRECTION_ENUM.LEFT, anim_comp, "texture/woodenskeleton/idle/left", AnimationClip.WrapMode.Loop);
        this.add_state(GAME_DIRECTION_ENUM.RIGHT, anim_comp, "texture/woodenskeleton/idle/right", AnimationClip.WrapMode.Loop);
    }

}

export class WoodenSkeletonAttackAnimStateMachine extends EnemyBaseSubStateAnimFSM {
    constructor(anim_comp: Animation, parent_fsm_name: string) {
        super(parent_fsm_name);
        this.add_state(GAME_DIRECTION_ENUM.TOP, anim_comp, "texture/woodenskeleton/attack/top", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.BOTTOM, anim_comp, "texture/woodenskeleton/attack/bottom", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.LEFT, anim_comp, "texture/woodenskeleton/attack/left", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.RIGHT, anim_comp, "texture/woodenskeleton/attack/right", AnimationClip.WrapMode.Normal);
    }
}

export class WoodenSkeletonDeathAnimStateMachine extends EnemyBaseSubStateAnimFSM {
    constructor(anim_comp: Animation, parent_fsm_name: string) {
        super(parent_fsm_name);
        this.add_state(GAME_DIRECTION_ENUM.TOP, anim_comp, "texture/woodenskeleton/death/top", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.BOTTOM, anim_comp, "texture/woodenskeleton/death/bottom", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.LEFT, anim_comp, "texture/woodenskeleton/death/left", AnimationClip.WrapMode.Normal);
        this.add_state(GAME_DIRECTION_ENUM.RIGHT, anim_comp, "texture/woodenskeleton/death/right", AnimationClip.WrapMode.Normal);
    }
}