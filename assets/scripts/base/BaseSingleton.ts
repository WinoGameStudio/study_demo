/**
 * 单例管理，单例继承该类
 */

export default class BaseSingleton{

    private static _instance: any = null;

    static get_instance<T>(): T {
        // 判断是否存在实例对象，没有的话就返回
        if (this._instance === null) {
            
            // 如果该类中没有存在的实例，就创建一个并保存
            this._instance = new this();
        }
        return this._instance
    }


}