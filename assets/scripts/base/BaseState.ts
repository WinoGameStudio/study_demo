/**
 * 成员状态的基类
 */
export default abstract class BaseState {
    // 当状态切换时播放当前的动画
    abstract on_enter();
    // 初始化事件
    abstract init_event();
}