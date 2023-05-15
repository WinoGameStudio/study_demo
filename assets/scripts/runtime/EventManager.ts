import BaseSingleton from "../base/BaseSingleton";

// 
interface IItem {
    func: Function,
    conn_this: unknown,
}

export default class EventMannager extends BaseSingleton {
    static get instance() {
        return super.get_instance<EventMannager>();
    }

    // 一个事件字典用来存放事件
    private event_dict: Map<string, Array<IItem>> = new Map();

    // 事件绑定,
    on(event_name: string, func: Function, conn_this?: unknown) {
        // 判断是否有该事件
        if (this.event_dict.has(event_name)) {
            // 已经有对应的事件类型,就将该方法放入对应的数组中
            this.event_dict.get(event_name).push({ func, conn_this });

            // 如果传入了相同的方法会怎样还未处理！
            // do somthing

        } else {
            this.event_dict.set(event_name, [{ func, conn_this }]);
        }
    }

    // 事件解绑
    off(event_name: string, func: Function, conn_this?: unknown) {
        if (this.event_dict.has(event_name)) {
            const index = this.event_dict.get(event_name).findIndex(item => item.func === func);
            index > -1 ? this.event_dict.get(event_name).splice(index, 1) : null;
        }
    }


    // 发送事件
    emit(event_name: string, ...params: unknown[]) {
        if (this.event_dict.has(event_name)) {
            /**
             * 判断 字典中是否有存在的事件，有的话就执行
             * 判断是否有传进来的this指向，如果有的话就将函数绑定到指定的this上去
             */
            this.event_dict.get(event_name).forEach(({ func, conn_this }) => {
                conn_this ? func.apply(conn_this, [...params]) : func(...params);
            })
        }
    }

    // 清空事件中心
    clear() {
        this.event_dict.clear()
    }
}