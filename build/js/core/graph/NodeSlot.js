import { SlotTypes, } from "../types";
import { IsNull, IsUndefined } from "../../Utils";
/**
 * @description 输入插槽
 * @implements INodeInput
 */
export class NodeInput {
    get index() {
        return this.node.getSlotIndex(this);
    }
    /**
     * @description 反序列化一个输入插槽，并不会生成连接！
     * @param node
     * @param { SerNodeOutput } param 序列化的数据
     * @param { boolean } addInNode 是否直接添加到节点中
     * @returns
     */
    static deserialize(node, { label, valueType, options, defaultValue, allow_input, value, inputWidgetType }, addInNode = true) {
        return NodeInput.create(node, {
            label,
            valueType,
            options,
            defaultValue,
            allow_input,
            value,
            inputWidgetType
        }, addInNode);
    }
    /**
     * @description 创建一个插槽
     * @param node
     * @param option
     * @returns
     */
    static create(node, option = {}, addInNode = true) {
        return new NodeInput(node, option, addInNode);
    }
    constructor(node, { label, valueType, options, defaultValue, allow_input, value, inputWidgetType }, addInNode = true) {
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: SlotTypes.INPUT
        }); // slot 类型
        Object.defineProperty(this, "link", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); // 连接线id
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "未命名输入"
        }); // 显示值
        Object.defineProperty(this, "node", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 所属节点
        Object.defineProperty(this, "valueType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); // 传入值类型
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "defaultValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); // 默认值
        Object.defineProperty(this, "allow_input", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inputWidgetType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'input'
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "subGraphNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); //子图的输入的节点不是同一个graph, 一个输入可以创建多个子图输出 
        this.node = node;
        label && (this.label = label);
        valueType && (this.valueType = valueType);
        options && (this.options = options);
        allow_input && (this.allow_input = allow_input);
        inputWidgetType && (this.inputWidgetType = inputWidgetType);
        value && (this.value = value);
        if (!IsUndefined(defaultValue) && !IsNull(defaultValue)) {
            this.defaultValue = defaultValue;
        }
        if (addInNode)
            node.addSlot(this);
    }
    /**
     * @description 克隆一个输入插槽
     * @param 添加插槽的node
     * @returns NodeInput
     */
    clone(targetNode) {
        const input = NodeInput.create(targetNode, {
            label: this.label,
            valueType: this.valueType.concat(),
            allow_input: this.allow_input,
            value: this.value,
            options: Object.assign(this.options),
        });
        targetNode.addSlot(input);
        return input;
    }
    /**
     * @description 更新插槽
     */
    update() {
    }
    /**
     * @description 销毁插槽
     */
    destroy() {
    }
    /**
     * @description 序列化
     */
    serialize() {
        const link = this.link ? this.link.id : null;
        return {
            type: this.type,
            label: this.label,
            link,
            valueType: this.valueType.concat(),
            options: Object.assign({}, this.options),
            defaultValue: this.defaultValue,
            allow_input: this.allow_input,
            inputWidgetType: this.inputWidgetType,
            value: this.value
        };
    }
    /**
     * @description 删除连接
     */
    deleteLink() {
        this.link = null;
    }
    /**
     * @description 显示label的方法
     * @returns
     */
    getLabel() {
        return this.label;
    }
}
/**
 * @description 输出插槽
 */
export class NodeOutput {
    get index() {
        return this.node.getSlotIndex(this);
    }
    /**
     * @description 反序列化一个输出插槽
     * @param node
     * @param { SerNodeOutput } param 序列化的数据
     * @param { boolean } addInNode 是否直接添加到节点中
     * @returns
     */
    static deserialize(node, { label, valueType, defaultValue, options }, addInNode = true) {
        return NodeOutput.create(node, {
            label,
            valueType,
            defaultValue,
            options,
        }, addInNode);
    }
    static create(node, option, addInNode = true) {
        return new NodeOutput(node, option, addInNode);
    }
    constructor(node, { label, valueType, options, defaultValue }, addInNode = true) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); // 具体值
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: SlotTypes.OUTPUT
        }); // slot 类型
        Object.defineProperty(this, "link", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); // 连接线id
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "未命名输出"
        }); // 显示值
        Object.defineProperty(this, "node", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 所属节点
        Object.defineProperty(this, "valueType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 传出值类型
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        }); // 插槽参数
        Object.defineProperty(this, "defaultValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); // 默认值
        Object.defineProperty(this, "subGraphNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        }); //子图的输出的节点不是同一个graph, 一个输出可以创建一个子图输入 
        this.node = node;
        label && (this.label = label);
        options && (this.options = options);
        if (!IsUndefined(defaultValue) && !IsNull(defaultValue)) {
            this.defaultValue = defaultValue;
            this.value = defaultValue;
        }
        this.valueType = valueType;
        if (addInNode)
            node.addSlot(this);
    }
    /**
     * @description 克隆一个输入插槽
     * @returns NodeInput
     */
    clone(targetNode) {
        const output = NodeOutput.create(targetNode, {
            valueType: this.valueType,
            label: this.label,
            options: Object.assign(this.options),
        });
        targetNode.addSlot(output);
        return output;
    }
    /**
     * @description 更新插槽
     */
    update() {
    }
    /**
     * @description 销毁插槽
     */
    destroy() {
    }
    /**
     * @description 序列化
     */
    serialize() {
        const linkIds = [];
        for (let link of this.link) {
            linkIds.push(link.id);
        }
        return {
            type: this.type,
            label: this.label,
            link: linkIds,
            valueType: this.valueType,
            options: Object.assign({}, this.options),
            defaultValue: this.defaultValue,
        };
    }
    /**
     * @description 删除连接
     */
    deleteLink(link) {
        const index = this.link.indexOf(link);
        if (index === -1)
            return;
        this.link.splice(index, 1);
    }
    /**
     * @description 是否有这个连接
     * @param link
     * @returns
     */
    hasLink(link) {
        return this.link.indexOf(link) !== -1;
    }
    /**
     * @description 显示label的方法,可重载此方法
     * @returns
     */
    getLabel() {
        return this.label;
    }
}
