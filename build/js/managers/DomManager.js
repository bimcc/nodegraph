import { RenderTypes } from "../types";
import { DomNodeRender } from '../renders';
import { NativeDiv } from '../shared/UI/NativeDiv';
/**
 * @description 管理dom渲染的管理器
 */
export class DomManager {
    constructor(rootDom, events) {
        // 接口属性
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: RenderTypes.Dom
        });
        Object.defineProperty(this, "rootDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // 私有属性
        Object.defineProperty(this, "nodeMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        }); //渲染的节点
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.rootDom = rootDom;
        this.events = events;
        this.root = new NativeDiv();
        this.root.setStyle({
            transformOrigin: "top left",
        });
        this.root.setPosition('absolute', 0, 0);
        this.rootDom.add(this.root);
    }
    /**
     * @description 获取全部渲染节点
     */
    getAllNodes() {
        return Object.values(this.nodeMap);
    }
    /**
     * @description 渲染一个node
     * @param node
     * @returns
     */
    addNode(node) {
        // @mark 阻止在纯运行模式创建节点dom
        if (this.events.viewer.runMode) {
            return null;
        }
        if (this.nodeMap[node.id])
            return this.nodeMap[node.id]; //可能已经渲染过了
        const rNode = new DomNodeRender(this.root, node, this.events.viewPosition, this.events);
        this.nodeMap[node.id] = rNode;
        return rNode;
    }
    /**
     * @description 删除节点
     * @param id
     */
    removeNode(id) {
        if (!this.nodeMap[id])
            return;
        this.nodeMap[id].remove();
        delete this.nodeMap[id];
    }
    /**
     * @description 获取节点的渲染器
     * @param id
     */
    getNodeRender(id) {
        return this.nodeMap[id];
    }
    /**
     * @description 获取插槽渲染器
     * @param id
     * @param index
     * @param isOutput
     */
    getSlotRender(id, index, isOutput) {
        const rNode = this.getNodeRender(id);
        if (!rNode)
            return null;
        if (isOutput) {
            return rNode.getOutput(index);
        }
        else {
            return rNode.getInput(index);
        }
    }
    /**
     * @description 刷新所有node显示
     */
    refresh() {
        this.nodeMap;
        for (let id in this.nodeMap) {
            const rNode = this.nodeMap[id];
            rNode.refresh();
        }
    }
    setPosition() {
        const realScale = this.events.getScale(true);
        // 偏移量应该使用当前graph的相对缩放
        const originScale = this.events.getScale();
        this.root.setStyle({
            transform: `scale(${realScale}) translate(${this.events.viewPosition.x / originScale}px,${this.events.viewPosition.y / originScale}px)`
        });
        let all = this.events.viewer.graph.getAllSubGraph();
        if (all.length) {
            all.forEach(item => {
                item.getNodeManager().setPosition();
            });
        }
    }
}
