/*
 * @Date: 2023-08-25 17:07:37
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-10-09 15:23:46
 * @FilePath: /graph/src/shared/UI/NodePanel.ts
 */
import { NodeRenderEvents } from "../../types";
import { wait } from "../../Utils";
import { NativeDiv, NativeButton } from "../";
import { NodePanelInput } from "./widgets/NodePanelInput";
import { config } from "../../config";
export class NodePanel {
    constructor(parent) {
        Object.defineProperty(this, "parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "render", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "body", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "footer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isShow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "onNodeRefresh", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.parent = parent;
        this.root = new NativeDiv();
        this.title = {
            root: new NativeDiv(),
            label: new NativeDiv(),
        };
        const bodyRoot = new NativeDiv();
        let divider = new PanelDivider();
        bodyRoot.add(divider);
        this.body = {
            root: bodyRoot,
            divider,
            title: new NodePanelInput(bodyRoot),
            idLabel: new NodePanelInput(bodyRoot),
            // indexLabel: new NodePanelInput(bodyRoot),
            props: [],
        };
        this.body.root.add(new PanelDivider("属性"));
        this.footer = {
            root: new NativeDiv(),
            deleteBtn: new NativeButton('删除'),
            cancelBtn: new NativeButton("取消")
        };
        this.init();
    }
    init() {
        const { root, body, title, footer } = this;
        this.parent.DOM.addEventListener("mousedown", () => {
            this.hide();
        });
        root.setStyle({
            width: '400px',
            // maxHeight: '400px',
            backgroundColor: 'rgb(75 75 75)',
            borderRadius: '13px',
            color: 'rgb(255 255 255)',
            transition: "all .5s ease-in-out",
            overflow: "hidden",
            border: "2px solid " + config.style.NodeHighLightColor
        }).setAbsolute(57, 420);
        root.onMousemove((e) => {
            e.stopPropagation();
        });
        root.onMouseup((e) => {
            e.stopPropagation();
        });
        root.onMousedown((e) => {
            e.stopPropagation();
        });
        root.onWheel((e) => {
            e.stopPropagation();
        });
        this.initTitle();
        this.initBody();
        this.initFooter();
        root.add(title.root);
        root.add(body.root);
        root.add(footer.root);
        root.hide();
        this.parent.add(this.root);
        // ESC 关闭 panel
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && this.isShow) {
                this.hide();
            }
        });
    }
    initBody() {
        const { root, idLabel, title } = this.body;
        root.setStyle({
            width: '100%',
            overflowY: "auto",
            height: "calc(100% - 74px)"
        });
        // indexLabel.setReadOnly(true);
        idLabel.setReadOnly(true);
        title.onChange((value) => {
            this.render.setLabel(value);
        });
    }
    initTitle() {
        const { root, label } = this.title;
        root.setStyle({
            width: '100%',
            backgroundColor: 'rgb(54 54 54)',
            height: '40px',
            borderRadius: '5px 5px 0px 0px',
            fontWeight: 'bold',
            lineHeight: '40px',
            textAlign: "center"
        });
        label.innerText('测试');
        root.add(label);
    }
    initFooter() {
        const { root, deleteBtn, cancelBtn } = this.footer;
        root.setStyle({
            width: '100%',
            height: '30px',
            textAlign: "center"
        });
        [deleteBtn, cancelBtn].forEach(btn => {
            btn.setStyle({
                height: "20px",
                marginTop: "5px"
            });
            btn.onMouseover(() => {
                btn.setStyle({
                    backgroundColor: '#ffffff'
                });
            });
            btn.onMouseout(() => {
                btn.setStyle({
                    backgroundColor: '#cacaca'
                });
            });
        });
        deleteBtn.onClick(() => {
            this.render.removeNode();
            this.hide();
        });
        cancelBtn.onClick(() => {
            this.hide();
        });
        cancelBtn.setMarginLeft("15px");
        root.add(deleteBtn);
        root.add(cancelBtn);
    }
    refresh(nodeRender) {
        const render = this.render = nodeRender;
        const node = render.node;
        this.title.label.innerText(`${node.label}`);
        this.body.title.setValue(node.label, '标题');
        this.body.idLabel.setValue(node.id, 'id');
        // this.body.divider.setMsg(`index: ${node.index.toString()} - id: ${node.id}`)
        this.body.divider.setMsg(`index: ${node.index.toString()}`);
        // this.body.indexLabel.setValue(node.index.toString(), 'index');
        const nodeFontColor = node.getOption('nodeFontColor');
        const nodeTitleColor = node.getOption('nodeTitleColor');
        const nodeColor = node.getOption('nodeColor');
        this.root.setStyle({
            backgroundColor: nodeColor !== null && nodeColor !== void 0 ? nodeColor : '#4b4b4b',
        });
        this.title.root.setStyle({
            backgroundColor: nodeTitleColor !== null && nodeTitleColor !== void 0 ? nodeTitleColor : 'rgb(54 54 54)',
        });
        this.body.idLabel.styles.fontColor = nodeFontColor !== null && nodeFontColor !== void 0 ? nodeFontColor : '#ffffff';
        this.body.idLabel.styles.backColor = nodeColor !== null && nodeColor !== void 0 ? nodeColor : '#4b4b4b';
        // this.body.indexLabel.styles.fontColor = nodeFontColor ?? '#ffffff';
        // this.body.indexLabel.styles.backColor = nodeColor ?? '#4b4b4b';
        this.body.title.styles.fontColor = nodeFontColor !== null && nodeFontColor !== void 0 ? nodeFontColor : '#ffffff';
        this.body.title.styles.backColor = nodeColor !== null && nodeColor !== void 0 ? nodeColor : '#4b4b4b';
        this.body.idLabel.refresh();
        // this.body.indexLabel.refresh();
        this.body.title.refresh();
        // 处理属性
        for (let prop of this.body.props) {
            prop.remove();
        }
        this.body.props = [];
        for (let key in node.properties) {
            const value = node.properties[key];
            switch (typeof value) {
                case 'string':
                    const pis = new NodePanelInput(this.body.root);
                    pis.setValue(value.toString(), key);
                    pis.styles.backColor = nodeColor !== null && nodeColor !== void 0 ? nodeColor : '#4b4b4b';
                    pis.styles.fontColor = nodeFontColor !== null && nodeFontColor !== void 0 ? nodeFontColor : '#ffffff';
                    pis.refresh();
                    pis.onChange((value) => {
                        node.setProperty(key, value);
                    });
                    this.body.props.push(pis);
                    break;
                case 'number':
                    const pi = new NodePanelInput(this.body.root);
                    pi.input.setAttribute('type', 'number');
                    pi.setValue(value.toString(), key);
                    pi.styles.backColor = nodeColor !== null && nodeColor !== void 0 ? nodeColor : '#4b4b4b';
                    pi.styles.fontColor = nodeFontColor !== null && nodeFontColor !== void 0 ? nodeFontColor : '#ffffff';
                    pi.refresh();
                    pi.onChange((value) => {
                        node.setProperty(key, value);
                    });
                    this.body.props.push(pi);
                    break;
                // case 'boolean':
                //   console.log(value)
                //   const pib = new NodePanelInput(this.body.root);
                //   pib.input.setAttribute('type', 'checkbox');
                //   pib.setValue(String(value), key);
                //   pib.styles.backColor = nodeColor ?? '#4b4b4b';
                //   pib.styles.fontColor = nodeFontColor ?? '#ffffff';
                //   pib.refresh();
                //   pib.onChange((value) => {
                //     console.log(key, value)
                //     node.setProperty(key, value);
                //   });
                //   this.body.props.push(pib);
                //   break;
            }
        }
        if (render.node.inputs.length) {
            let devide1 = new PanelDivider("输入参数");
            this.body.props.push(devide1);
            this.body.root.add(devide1);
            for (let index = 0; index < render.node.inputs.length; index++) {
                const input = render.node.inputs[index];
                const pi = new NodePanelInput(this.body.root);
                pi.setValue(input.label);
                pi.label.innerText("输入" + (index + 1));
                pi.onChange((value) => {
                    var _a, _b;
                    input.label = value;
                    (_b = (_a = input.node.render) === null || _a === void 0 ? void 0 : _a.getInput(index)) === null || _b === void 0 ? void 0 : _b.refresh();
                });
                this.body.props.push(pi);
            }
        }
        if (render.node.outputs.length) {
            let devide2 = new PanelDivider("输出参数");
            this.body.root.add(devide2);
            this.body.props.push(devide2);
            for (let index = 0; index < render.node.outputs.length; index++) {
                const input = render.node.outputs[index];
                const pi = new NodePanelInput(this.body.root);
                pi.setValue(input.label);
                pi.label.innerText("输入" + (index + 1));
                pi.onChange((value) => {
                    var _a, _b;
                    input.label = value;
                    (_b = (_a = input.node.render) === null || _a === void 0 ? void 0 : _a.getOutput(index)) === null || _b === void 0 ? void 0 : _b.refresh();
                });
                this.body.props.push(pi);
            }
        }
    }
    show(nodeRender) {
        if (this.render) {
            // 如果之前有就删除之前的事件监听
            this.render.renderEvents.remove(NodeRenderEvents.Refresh, this.onNodeRefresh);
        }
        const render = nodeRender;
        const scale = 1 / render.events.getScale(true);
        const offsetScale = render.events.getParentScale();
        const rect = render.root.DOM.getBoundingClientRect();
        const parentRect = this.parent.DOM.getBoundingClientRect();
        const originLeft = (rect.left - parentRect.left) * offsetScale;
        const originTop = (rect.top - parentRect.top) * offsetScale;
        // 原始位置
        this.root.setStyle({
            position: "absolute",
            width: rect.width + "px",
            height: rect.height + "px",
            top: originTop + "px",
            left: originLeft + "px",
            opacity: "0.7",
            zIndex: "99999",
            boxSizing: "border-box",
            transformOrigin: "left top",
        });
        // 动画位置
        setTimeout(() => {
            let width = rect.width * scale * offsetScale * 2;
            let height = rect.height * scale * offsetScale * 2;
            let top = originTop - (height - rect.height) / 2 * offsetScale;
            let left = originLeft - (width - rect.width) / 2 * offsetScale;
            // @mark 限制弹出框长宽上左不超出画布
            if (width >= parentRect.width) {
                width = parentRect.width;
                left = 0;
            }
            if (height >= parentRect.height) {
                height = parentRect.height;
                top = 0;
            }
            if (left <= 0) {
                left = 0;
            }
            if (top <= 0) {
                top = 0;
            }
            this.root.setStyle({
                width: width + "px",
                height: height + "px",
                left: left + "px",
                top: top + "px",
                opacity: "1",
                transform: `scale(${offsetScale})`,
            });
        }, 0);
        this.refresh(nodeRender);
        this.onNodeRefresh = () => {
            if (!this.render)
                return;
            this.refresh(this.render);
        };
        nodeRender.renderEvents.add(NodeRenderEvents.Refresh, this.onNodeRefresh);
        // @detail 每次打开时，恢复滚动条位置为0
        setTimeout(() => {
            this.body.root.DOM.scrollTop = 0;
        }, 0);
        this.root.show();
        this.isShow = true;
    }
    hide() {
        if (this.render) {
            // 如果之前有就删除之前的事件监听
            this.render.renderEvents.remove(NodeRenderEvents.Refresh, this.onNodeRefresh);
            const render = this.render;
            const offsetScale = render.events.getParentScale();
            const rect = render.root.DOM.getBoundingClientRect();
            const parentRect = this.parent.DOM.getBoundingClientRect();
            const originLeft = (rect.left - parentRect.left) * offsetScale;
            const originTop = (rect.top - parentRect.top) * offsetScale;
            this.root.setStyle({
                width: rect.width + "px",
                height: rect.height + "px",
                top: originTop + "px",
                left: originLeft + "px",
                // opacity:"0.8"
            });
        }
        wait(450).then(() => {
            this.root.hide();
        });
        this.render = null;
        this.isShow = false;
    }
}
class PanelDivider extends NativeDiv {
    constructor(msg = "") {
        super();
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "msg", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "标题"
        });
        if (msg)
            this.msg = msg;
        this.label = new NativeDiv();
        this.init();
    }
    init() {
        this.setStyle({
            backgroundColor: 'rgb(54 54 54)',
            width: 'calc( 100% - 10px )',
            height: '4px',
            marginLeft: '5px',
            marginRight: '5px',
            marginTop: "15px",
            marginBottom: "15px",
            textAlign: "center",
            position: "relative",
            userSelect: "auto",
            webkitUserSelect: "auto"
        });
        this.label.innerText(this.msg)
            .setBackgroundColor("rgb(54 54 54)")
            .setAbsolute()
            .setFontSize(16)
            .setPaddingLeft("10px")
            .setPaddingRight("10px")
            .setTop("-10px")
            .setLeft("10px")
            .setStyle({
            lineHeight: "24px"
        });
        // item.innerText("asdfasdfasdfasdf")
        this.add(this.label);
    }
    setMsg(msg = "") {
        this.label.innerText(msg);
    }
}
