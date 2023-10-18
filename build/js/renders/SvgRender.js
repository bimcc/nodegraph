import { NativeSvgPath } from "../shared";
export class SvgLinkRender {
    get start() {
        return this.rOut.getPosition();
    }
    get end() {
        return this.rIn.getPosition();
    }
    constructor(parent, link, viewPosition, rOut, rIn) {
        Object.defineProperty(this, "link", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rOut", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rIn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viewPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.link = link;
        this.parent = parent;
        this.root = new NativeSvgPath();
        this.rOut = rOut;
        this.rIn = rIn;
        this.viewPosition = viewPosition;
        this._init();
    }
    _init() {
        this.refresh();
        this.parent.add(this.root);
    }
    /**
     * @description 刷新连接显示
     * @returns
     */
    refresh() {
        const { root, parent, start, end } = this;
        const width = 2;
        const linkColor = '#a6a6a6';
        const linkStrokeColor = '#000000';
        if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y))
            return;
        root.drawFillBezierLine({
            x: start.x + this.viewPosition.x,
            y: start.y + this.viewPosition.y,
        }, {
            x: end.x + this.viewPosition.x,
            y: end.y + this.viewPosition.y,
        }, width, linkColor, linkStrokeColor, 1, 25);
    }
    /**
     * @description 销毁
     */
    remove() {
        this.root.remove();
    }
}
