/**
 * 工具函数 用来封装一些工具
 */

import { Layers, Node, UITransform } from "cc"

// 创建UI节点
export const createUI_node = (name: string="") => {
    const node = new Node(name);
    const transform_comp = node.addComponent(UITransform);
    node.layer = 1<<Layers.nameToLayer("UI_2D");
    return node
}