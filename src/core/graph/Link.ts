/*
 * @Date: 2023-06-14 14:35:24
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-25 09:42:27
 * @FilePath: \litegraph\src\core\graph\Link.ts
 */
import { ILink, SerLink, DataTypeStr } from "../interfaces";
import { LinkId } from "../types";
import { NodeInput, NodeOutput, Node } from '../graph';
import { nanoid } from 'nanoid';
import { ILinkInfo } from "../../interfaces";

export class Link implements ILink{
    id : LinkId; // link的id
    origin : NodeOutput;
    target : NodeInput;
    valueType: DataTypeStr;
    index : number = 0;

    info : ILinkInfo | null = null;

    /**
     * @description 获取起点node
     */
    get originNode() : Node {
        return this.origin.node;
    }

    /**
     * @description 获取终点node
     */
    get targetNode() : Node {
        return this.target.node;
    }

    /**
     * @description 创建link的id
     * @returns
     */
    static createId() : LinkId {
        return `link-${ nanoid(4) }`;
    }

    /**
     * @description 创建一个link
     * @param origin
     * @param target
     * @returns
     */
    static create( output : NodeOutput,  input : NodeInput ){
        return new Link( output, input);
    }

    constructor(origin : NodeOutput, target : NodeInput){
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
    update(){
    }

    /**
     * @description 序列化连接
     */
    serialize() : SerLink {
        return [
            this.id, // link id
            this.origin.node.id, // 起始节点id
            this.origin.index, // slot 位置
            this.target.node.id, // 终点节点id
            this.target.index, // slot 位置
            this.valueType, // 数据类型
        ];
    }
}
