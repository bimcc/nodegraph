import { nanoid } from 'nanoid';
export class Link {
    /**
     * @description 获取起点node
     */
    get originNode() {
        return this.origin.node;
    }
    /**
     * @description 获取终点node
     */
    get targetNode() {
        return this.target.node;
    }
    /**
     * @description 创建link的id
     * @returns
     */
    static createId() {
        return `link-${nanoid(4)}`;
    }
    /**
     * @description 创建一个link
     * @param origin
     * @param target
     * @returns
     */
    static create(output, input) {
        return new Link(output, input);
    }
    constructor(origin, target) {
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // link的id
        Object.defineProperty(this, "origin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "target", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "valueType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "info", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.id = Link.createId();
        this.origin = origin;
        this.target = target;
        this.valueType = origin.valueType;
        origin.link.push(this);
        target.link = this;
    }
    /**
     * @description 更新连接
     */
    update() {
    }
    /**
     * @description 序列化连接
     */
    serialize() {
        return [
            this.id,
            this.origin.node.id,
            this.origin.index,
            this.target.node.id,
            this.target.index,
            this.valueType, // 数据类型
        ];
    }
}
