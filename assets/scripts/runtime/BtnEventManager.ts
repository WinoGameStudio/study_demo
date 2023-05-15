import BaseSingleton from "../base/BaseSingleton";

export class BtnEventManager extends BaseSingleton {

    // 将该方法修饰位一个类的属性
    static get instance() {
        return super.get_instance<BtnEventManager>();
    }

    
}