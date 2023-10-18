/*
 * @Date: 2023-07-13 14:49:09
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-09-21 16:54:00
 * @FilePath: /graph/src/managers/SvgManager.ts
 */
import { NativeSvg, NativeSvgCircle, NativeSvgPath, } from "../shared";
import { NativeCanvas } from "../shared/UI/NativeCanvas";
import { GraphEventTypes, RenderTypes } from "../types";
import { GraphViewer, } from "../viewer";
import { config } from '../config';
export class SvgManager {
    constructor(rootDom, events) {
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: RenderTypes.Svg
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
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "linkMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "tempLine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tempPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // @mark 单path渲染普通连线
        Object.defineProperty(this, "commonLinks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runedNodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "tempPointHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        this.rootDom = rootDom;
        this.events = events;
        // canvas画线节点  @mark 
        // ToDo：canvas节点在底部时在Safari浏览器中，节点拖动事件时鼠标会变成输入态
        let canvas = new NativeCanvas();
        canvas.setHeight(this.rootDom.getClientHeight())
            .setWidth(this.rootDom.getClientWidth());
        const dpr = window.devicePixelRatio;
        canvas.setAttribute('width', `${this.rootDom.getClientWidth() * dpr}`);
        canvas.setAttribute('height', `${this.rootDom.getClientHeight() * dpr}`);
        canvas.ctx.scale(dpr, dpr);
        canvas.setStyle({
            webkitUserSelect: "none",
            userSelect: "none",
            position: "absolute",
            top: "0px",
            left: "0px",
            zIndex: "0",
            pointerEvents: 'none',
        });
        this.canvas = canvas;
        this.ctx = canvas.ctx;
        this.rootDom.DOM.insertBefore(canvas.DOM, this.rootDom.DOM.firstChild);
        // canvas 节点结束
        let linkFresh = () => {
            this.refresh();
            requestAnimationFrame(linkFresh);
        };
        linkFresh();
        const root = this.root = new NativeSvg();
        root.setAttribute('width', `${this.rootDom.getClientWidth()}`);
        root.setAttribute('height', `${this.rootDom.getClientHeight()}`);
        root.setStyle({
            position: "absolute",
            top: "0px",
            left: "0px",
        });
        this.tempLine = new NativeSvgPath();
        this.tempLine.hide();
        this.tempPoints = [new NativeSvgCircle(), new NativeSvgCircle()];
        this.tempPoints[0].setAttribute('r', this.tempPointHeight.toString());
        this.tempPoints[0].setAttribute('fill', `#00ff00`);
        this.tempPoints[1].setAttribute('r', this.tempPointHeight.toString());
        this.tempPoints[1].setAttribute('fill', `#00ff00`);
        this.tempPoints[0].hide();
        this.tempPoints[1].hide();
        this.root.add(this.tempLine);
        this.root.add(this.tempPoints[0]);
        this.root.add(this.tempPoints[1]);
        this.rootDom.add(root.DOM);
        this.events.add(GraphEventTypes.LinksFresh, (runedNodes) => {
            if (runedNodes !== null) {
                this.runedNodes = runedNodes !== null && runedNodes !== void 0 ? runedNodes : [];
            }
            this.refresh();
        });
        this.events.add(GraphEventTypes.ViewResize, (w, h) => {
            this.root.setAttribute("width", w);
            this.root.setAttribute("height", h);
            this.canvas.DOM.setAttribute("height", h);
            this.canvas.DOM.setAttribute("width", w);
            this.root.setStyle({
                width: w + "px",
                height: h + "px"
            });
            this.canvas.setStyle({
                width: w + "px",
                height: h + "px"
            });
            // fixed ToDo：这里会造成canvas连线层抖动，考虑脏绘或者防抖节流
            this.refresh();
        });
    }
    clear() {
        this.commonLinks = {};
        this.refresh();
    }
    /**
     * @description 绘制连接到节点
     * @param link
     */
    addLink(link, rOut, rIn) {
        const start = rOut.getPosition();
        const end = rIn.getPosition();
        if (isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y))
            return;
        // const rLink = new SvgLinkRender(this.root, link, this.events.viewPosition, rOut , rIn);
        // this.linkMap[link.id] = rLink;
        const linkInfo = { start: rOut, end: rIn, link };
        this.commonLinks[link.id] = linkInfo;
        rOut.linkInfo = linkInfo;
        rIn.linkInfo = linkInfo;
        link.info = linkInfo;
        this.refresh();
    }
    /**
     * @description 删除连线
     * @param id
     */
    removeLink(id) {
        // const rLink = this.linkMap[id];
        // if( !rLink ) return;
        // rLink.remove();
        // delete this.linkMap[id];
        const link = this.commonLinks[id];
        if (!link)
            return;
        link.start.linkInfo = null;
        link.end.linkInfo = null;
        link.link.info = null;
        delete this.commonLinks[id];
        this.refresh();
    }
    /**
     * @description 获取连接渲染器
     * @param id
     * @returns
     */
    getLinkRender(id) {
        return this.linkMap[id];
    }
    /**
     * @description 显示隐藏临时线段
     * @param value
     */
    displayTempLine(value) {
        const offsetScale = this.events.getParentScale();
        this.tempPoints.forEach(item => {
            item.setAttribute('r', `${this.tempPointHeight * offsetScale}`);
        });
        if (value) {
            this.tempLine.show();
            this.tempPoints[0].show();
            this.tempPoints[1].show();
        }
        else {
            this.tempLine.hide();
            this.tempPoints[0].hide();
            this.tempPoints[1].hide();
        }
    }
    /**
     * @description 设置临时线段的位置
     * @param start
     * @param end
     */
    setTempLine(start, end, isDragEnd) {
        const scale = this.events.getScale(true);
        const offsetScale = this.events.getParentScale();
        const width = 2 * scale;
        const color = '#00ff00';
        const strokeColor = '#000000';
        if (!isDragEnd) {
            // 结束位置由于是鼠标的相对位置，所以乘以上级的回归缩放即可
            start = {
                x: start.x * offsetScale,
                y: start.y * offsetScale
            };
            // 内置偏移量要乘以上级graph的回归缩放值      
            end = {
                x: end.x * scale + this.events.viewPosition.x * offsetScale,
                y: end.y * scale + this.events.viewPosition.y * offsetScale
            };
        }
        else {
            // 内置偏移量要乘以上级graph的回归缩放值
            start = {
                x: start.x * scale + this.events.viewPosition.x * offsetScale,
                y: start.y * scale + this.events.viewPosition.y * offsetScale,
            };
            // 结束位置由于是鼠标的相对位置，所以乘以上级的回归缩放即可
            end = {
                x: end.x * offsetScale,
                y: end.y * offsetScale
            };
        }
        this.tempLine.drawFillBezierLine(start, end, width, color, strokeColor, 1, 10);
        this.tempPoints[1].setAttribute('cx', `${end.x}`);
        this.tempPoints[1].setAttribute('cy', `${end.y}`);
        this.tempPoints[0].setAttribute('cx', `${start.x}`);
        this.tempPoints[0].setAttribute('cy', `${start.y}`);
    }
    refresh() {
        this.ctx.clearRect(0, 0, this.rootDom.getOffsetWidth(), this.rootDom.getOffsetHeight());
        const offsetScale = this.events.getParentScale();
        const dpr = window.devicePixelRatio;
        // this.ctx.scale(offsetScale*window.devicePixelRatio,offsetScale*window.devicePixelRatio)
        this.canvas.setAttribute('width', `${this.rootDom.getClientWidth() * dpr / offsetScale}`);
        this.canvas.setAttribute('height', `${this.rootDom.getClientHeight() * dpr / offsetScale}`);
        this.canvas.ctx.scale(dpr / offsetScale, dpr / offsetScale);
        // this.ctx.fillText(`回归缩放率：${parseInt((this.events.getParentScale() * 100).toString())}%`,10 * offsetScale,this.rootDom.getOffsetHeight() - 55 * offsetScale)
        if (config.showGraphInfo) {
            this.ctx.fillStyle = "white";
            this.ctx.font = `${10 * offsetScale}px Aria`;
            this.ctx.fillText(`缩放率：${parseInt((this.events.getScale() * 100).toString())}%`, 10 * offsetScale, this.rootDom.getOffsetHeight() - 40 * offsetScale);
            this.ctx.fillText(`连线数：${this.events.viewer.graph.getLinks().length}`, 10 * offsetScale, this.rootDom.getOffsetHeight() - 25 * offsetScale);
            this.ctx.fillText(`节点数：${this.events.viewer.graph.getNodes().length}`, 10 * offsetScale, this.rootDom.getOffsetHeight() - 10 * offsetScale);
        }
        for (let id in this.commonLinks) {
            const link = this.commonLinks[id];
            const start = link.start.getPosition();
            const end = link.end.getPosition();
            const color = this.getLinkColor(link);
            this.canvasDrawLink(start, end, color, link.start.isVerticalMode, link.end.isVerticalMode);
        }
    }
    getLinkColor(link) {
        const id = link.start.slot.node.id;
        let color = "black";
        let nodes = [];
        this.events.viewer.ActiveNodes.forEach(item => {
            nodes.push(item.node.id);
        });
        if (GraphViewer.ActiveNode) {
            nodes.push(GraphViewer.ActiveNode.node.id);
        }
        // @mark 原始颜色为start节点的nodeColor
        if (link.start.slot.node.options.nodeColor) {
            color = link.start.slot.node.options.nodeColor;
        }
        nodes.forEach(item => {
            if (item == id || item == link.end.slot.node.id) {
                color = config.style.NodeHighLightColor;
            }
        });
        for (let i = 0; i < this.runedNodes.length; i++) {
            const node = this.runedNodes[i];
            if (node.id == id) {
                color = config.style.LineRunningColor;
            }
        }
        return color;
    }
    /**
     * @description: Canvas画一条三阶贝塞尔曲线
     * @param {IVector2} start 起始点
     * @param {IVector2} end 结束点
     */
    canvasDrawLink(start, end, color = "black", startVertical = false, endVertical = false) {
        const scale = this.events.getScale(true);
        const offsetScale = this.events.getParentScale();
        // 原始位置乘以当前的真实缩放，画布偏移位置乘以上级视图的回归缩放
        const startX = start.x * scale + this.events.viewPosition.x * offsetScale;
        const startY = start.y * scale + this.events.viewPosition.y * offsetScale;
        const endX = end.x * scale + this.events.viewPosition.x * offsetScale;
        const endY = end.y * scale + this.events.viewPosition.y * offsetScale;
        let cp1x = startX + 50 * scale;
        let cp1y = startY;
        // 计算控制点的坐标
        if (startVertical) {
            cp1x = startX;
            cp1y = startY + 50 * scale;
        }
        let cp2x = endX - 50 * scale;
        let cp2y = endY;
        if (endVertical) {
            cp2x = endX;
            cp2y = endY - 50 * scale;
        }
        this.ctx.beginPath();
        this.ctx.lineWidth = 3 * scale;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(startX, startY);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        this.ctx.stroke();
    }
}
