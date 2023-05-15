import { AnimationClip, Component, Sprite, SpriteFrame, animation, Animation } from "cc";
import { ResourceManager } from "../runtime/ResourceManager";
import BaseState from "./BaseState";

export interface IAnimStateOptions {
    anim_clip_nanme: string,
    anim_comp: Animation,
    frame_res_path: string,
    warp_mode: AnimationClip.WrapMode,
}
export default class BaseAnimState extends BaseState {

    readonly ANIMATION_SPEED: number = 1 / 8;
    anim_comp: Animation;
    frame_res_path: string;
    anim_clip_nanme: string;
    create_anim_clip_promise: Promise<void>;
    warp_mode: AnimationClip.WrapMode;

    constructor(options: IAnimStateOptions) {
        super();
        this.anim_comp = options.anim_comp;
        this.frame_res_path = options.frame_res_path;
        this.anim_clip_nanme = options.anim_clip_nanme;
        this.create_anim_clip_promise = this.create_anim_clip();
        this.warp_mode = options.warp_mode;
        this.init_event();
    }

    // 创建 动画剪辑
    async create_anim_clip(): Promise<void> {
        // 加载动画所需要的 spriteFrame
        let res_path = this.frame_res_path;
        const sprite_frames: SpriteFrame[] = await ResourceManager.instance.load_dir(res_path, SpriteFrame);

        // sprinte_frames 获取到的资源数据可能是错误的，需要进行排序
        sprite_frames.sort((a, b) => {
            const reg = /\((\d+)\)/;
            const match_a = a.name.match(reg);
            const match_b = b.name.match(reg);

            if (match_a && match_a) {
                const num_a = Number(match_a[1]);
                const num_b = Number(match_b[1]);
                return num_a - num_b
            } else {
                return 0
            }
        })
        

        // 创建一个新的动画clip
        const animation_clip = new AnimationClip();

        // 整个动画剪辑的周期 = 总帧数图片 * 单个图片播放时间
        animation_clip.duration = sprite_frames.length * this.ANIMATION_SPEED;
        animation_clip.wrapMode = this.warp_mode;

        // 设置动画剪辑的名称
        animation_clip.name = this.anim_clip_nanme;

        // 创建一个对象轨道
        const track = new animation.ObjectTrack();
        // 指定轨道路径，即指定目标对象为 "Sprite" 组件上的 "spriteFrame" 属性
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');

        // 生成一个关键帧列表 [[持续时间,属性变化]]
        const frame_list: Array<[number, SpriteFrame]> = sprite_frames.map((item, index: number) => {
            return [index * this.ANIMATION_SPEED, item]
        })
        track.channel.curve.assignSorted(frame_list);

        // 最后将轨道添加到动画剪辑以应用
        animation_clip.addTrack(track);

        // 将创建好的 animationClip 添加至 Animation 组件中的Clips列表中
        this.anim_comp.addClip(animation_clip)
    }

    // 当状态切换时播放当前的动画
    async on_enter() {
        await this.create_anim_clip_promise;
        this.anim_comp.play(this.anim_clip_nanme)
        console.log(`当前播放动画 ${this.anim_clip_nanme}`)
    }

    // 初始化事件
    init_event() {

    }
}