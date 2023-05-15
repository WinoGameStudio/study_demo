export class BaseFSM {
    state_dict: Map<string, any> = new Map();
    current_state: string;
    parent_fsm_name: string;

    constructor(parent_fsm_name: string) {
        this.parent_fsm_name = parent_fsm_name;
    }

    // 获取混合后的状态名称： "父状态机名称-当前状态名"
    get_mixed_state_name(state_name: string): string {
        return `${this.parent_fsm_name}-${state_name}`;;
    }

    // 状态切换
    change_state(...params) {

    }

    // 更新状态切换的方法
    run_state_func(...params) {

    }

    // 添加状态
    add_state(...params) {

    }

    // 初始化方法
    run_init() {

    }
}