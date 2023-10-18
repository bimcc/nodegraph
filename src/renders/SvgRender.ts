import { IVector2, Link } from "../core";
import { IInputRender, ILinkRender, IOutputRender } from "../interfaces";
import { NativeSvg, NativeSvgPath } from "../shared";
import { getVerticalVector2 } from "../Utils";


export class SvgLinkRender implements ILinkRender{
    link : Link;

    rOut : IOutputRender;
    rIn : IInputRender;

    private get start(){
        return this.rOut.getPosition();
    } 
    private get end(){
        return this.rIn.getPosition();
    }
    private parent : NativeSvg;
    private root : NativeSvgPath;
    private viewPosition : IVector2;

    constructor(parent : NativeSvg, link : Link, viewPosition : IVector2, rOut : IOutputRender, rIn : IInputRender){
        this.link = link;
        this.parent = parent;
        this.root = new NativeSvgPath();
        this.rOut = rOut;
        this.rIn = rIn;
        this.viewPosition = viewPosition;
        this._init();
    }

    private _init(){
        this.refresh();
        this.parent.add(this.root);
    }

    /**
     * @description 刷新连接显示
     * @returns 
     */
    refresh(){
        const { root, parent , start , end } = this;
        const width = 2;
        const linkColor = '#a6a6a6';
        const linkStrokeColor = '#000000'
        if( isNaN(start.x) || isNaN(start.y) || isNaN(end.x) || isNaN(end.y) ) return;


        root.drawFillBezierLine({
            x : start.x + this.viewPosition.x,
            y : start.y + this.viewPosition.y,
        }, {
            x : end.x + this.viewPosition.x,
            y : end.y + this.viewPosition.y,
        }, width, linkColor, linkStrokeColor, 1, 25);
    }

    /**
     * @description 销毁
     */
    remove(){
        this.root.remove();
    }
}