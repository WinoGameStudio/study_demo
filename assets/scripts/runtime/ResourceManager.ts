import { Asset, SpriteFrame, resources } from "cc";
import BaseSingleton from "../base/BaseSingleton";

/**
 * 资源管理的单例
 */
export class ResourceManager extends BaseSingleton {

    static get instance() {
        return super.get_instance<ResourceManager>();
    }
    
    // 动态加载资源 "texture/tile/tile"
    load_dir<T>(res_path:string,res_type:typeof Asset = SpriteFrame) {
        // 使用 Promise 来处理异步操作 使用泛型类，来约束返回值的类型为 SpriteFrame[] 数组
        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(res_path, res_type, (err, res) => {
                // 如果发生错误就使用reject 返回错误
                if (err) {
                    reject(err);
                    return
                }

                // 没有错误就把结果返回
                resolve(res as T[]);

            })

        })

    }
}