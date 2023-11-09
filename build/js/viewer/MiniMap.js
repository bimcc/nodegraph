/*
 * @LastEditors: lisushuang
 * @Description: 小地图
 * @FilePath: /graph/src/viewer/MiniMap.ts
 * @Date: 2023-08-16 15:21:06
 * @LastEditTime: 2023-09-05 18:20:56
 * @Author: lisushuang
 */
import { config } from "../config";
import { NativeCanvas } from "../shared/UI/NativeCanvas";
import { RenderTargetTypes } from "../types";
class MiniMap extends NativeCanvas {
    constructor(viewer) {
        super();
        Object.defineProperty(this, "viewer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "viewStart", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "viewEnd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.viewer = viewer;
        this.setStyle({
            position: "absolute",
            right: "10px",
            bottom: "10px",
            width: "304px",
            height: "204px",
            background: "black",
            opacity: "0.8",
            borderRadius: "10px",
            cursor: "pointer"
        });
        const dpr = window.devicePixelRatio;
        this.setAttribute("width", `${304 * dpr}`);
        this.setAttribute("height", `${204 * dpr}`);
        this.ctx.scale(dpr, dpr);
        let ani = () => {
            this.render();
            requestAnimationFrame(ani);
        };
        ani();
        this.initEvents();
    }
    initEvents() {
        this.onDblClick((e) => {
            e.stopPropagation();
        });
        // 鼠标开始位置
        let MouseStart = null;
        // 鼠标放下时，记录状态    
        this.onMousedown((e) => {
            e.stopPropagation();
            MouseStart = { x: e.offsetX, y: e.offsetY };
            this.setViewPosition({ x: e.offsetX, y: e.offsetY });
        });
        this.onMousemove((e) => {
            if (MouseStart !== null) {
                e.stopPropagation();
                this.setViewPosition({ x: e.offsetX, y: e.offsetY });
            }
        });
        document.addEventListener("mouseup", (e) => {
            MouseStart = null;
        });
    }
    /**
     * @description: 根据鼠标相对位置设置viewPosition
     */
    setViewPosition(point) {
        //         // 顶点对齐
        let newView = { x: -minX, y: -minY };
        // 点击的地方一定是可视框的正中间
        let newLeftTop = {
            x: (point.x - Math.abs(viewEnd.x - viewStart.x) / 2) / Xscale,
            y: (point.y - Math.abs(viewEnd.y - viewStart.y) / 2) / Yscale
        };
        // 缩放处理
        const scale = this.viewer.events.getScale();
        newView = {
            x: (newView.x - newLeftTop.x) * scale,
            y: (newView.y - newLeftTop.y) * scale
        };
        this.viewer.events.viewPosition = newView;
        const nodeManager = this.viewer.getRenderByTarget(RenderTargetTypes.Node);
        nodeManager.setPosition();
    }
    /**
     * @description: 获取可视区域及画布的信息
     */
    getViewInfo() {
        const nodes = this.viewer.graph.getNodes();
        const rect = this.viewer.rootDom.DOM.getBoundingClientRect();
        // nodes 按照 X轴从小到大排序
        nodes.sort((a, b) => a.position.x - b.position.x);
        let maxX = nodes[nodes.length - 1].position.x;
        const minX = nodes[0].position.x;
        // nodes 按照Y轴从小到大排序
        nodes.sort((a, b) => a.position.y - b.position.y);
        let maxY = nodes[nodes.length - 1].position.y;
        const minY = nodes[0].position.y;
        if (maxY - minY < rect.height)
            maxY = minY + rect.height;
        if (maxX - minX < rect.width)
            maxX = minX + rect.width;
        const Xscale = 300 / (maxX - minX);
        const Yscale = 200 / (maxY - minY);
        let getMiniPosition = (node) => {
            let startX = (node.position.x - minX) * Xscale;
            let startY = (node.position.y - minY) * Yscale;
            return { x: startX, y: startY };
        };
        // 画可视区域的框
        // 起点
        const scale = this.viewer.events.getScale();
        const viewPosition = this.viewer.events.viewPosition;
        // 原始宽高要先除以缩放、、、
        const viewStart = { x: (-viewPosition.x / scale - minX) * Xscale, y: (-viewPosition.y / scale - minY) * Yscale };
        this.viewStart = viewStart;
        // 终点
        const viewEnd = { x: viewStart.x + rect.width * Xscale / scale, y: viewStart.y + rect.height * Yscale / scale };
        return {
            Xscale,
            Yscale,
            viewStart,
            viewEnd,
            minX,
            minY,
            getMiniPosition
        };
    }
    render() {
        this.ctx.clearRect(0, 0, 304, 204);
        const nodes = this.viewer.graph.getNodes();
        if (!nodes.length)
            return;
        const { viewStart, viewEnd, getMiniPosition } = this.getViewInfo();
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(viewStart.x, viewStart.y);
        this.ctx.lineTo(viewStart.x, viewEnd.y);
        this.ctx.lineTo(viewEnd.x, viewEnd.y);
        this.ctx.lineTo(viewEnd.x, viewStart.y);
        this.ctx.lineTo(viewStart.x, viewStart.y);
        this.ctx.stroke();
        this.ctx.closePath();
        // 开始画节点
        nodes.forEach(node => {
            let start = getMiniPosition(node);
            if (!this.viewer.graph.checkNodeRuned(node)) {
                this.ctx.fillStyle = config.style.NodeHighLightColor;
                this.ctx.strokeStyle = "white";
            }
            else {
                this.ctx.fillStyle = config.style.NodeRunningColor;
                this.ctx.strokeStyle = config.style.LineRunningColor;
            }
            this.ctx.fillRect(start.x, start.y, 4, 4);
            // 画每一个node的连线，如果有的话
            this.ctx.lineWidth = 1;
            node.outputs.forEach(output => {
                if (output.link) {
                    output.link.forEach(link => {
                        this.ctx.beginPath();
                        this.ctx.moveTo(start.x + 2, start.y + 2);
                        let end = getMiniPosition(link.target.node);
                        this.ctx.lineTo(end.x + 2, end.y + 2);
                        this.ctx.stroke();
                        this.ctx.closePath();
                    });
                }
            });
        });
    }
}
export default MiniMap;
