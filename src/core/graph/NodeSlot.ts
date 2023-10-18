
import { IKeyValue, } from "../../interfaces";
import { INodeOutput, INodeInput, DataTypeStr, ILink, SerNodeInput, SerNodeOutput, INodeSlotOptions, } from "../interfaces";
import { SlotTypes, } from "../types";
import { Link, Node } from '../graph';
import { IsNull, IsUndefined } from "../../Utils";
import { NSubGraphInput, NSubGraphOutput } from "./nodes/base";

/**
 * @description 输入插槽的初始化参数
 */
export interface InputInitOption{ 
    label ?: string,
    valueType ?: Array<DataTypeStr> ,
    options ?: INodeSlotOptions,
    defaultValue ?: any, //默认值
    allow_input?:boolean, // 允许直接输入  兼容原值
    inputWidgetType?: string,
    value?:any // 直接输入时绑定的值
}

/**
 * @description 输入插槽
 * @implements INodeInput
 */
export class NodeInput implements INodeInput{

    type: SlotTypes.INPUT = SlotTypes.INPUT; // slot 类型
    link: Link | null = null; // 连接线id
    label: string = "未命名输入"; // 显示值
    node : Node; // 所属节点
    valueType: Array<DataTypeStr> = []; // 传入值类型
    options : INodeSlotOptions = {};
    defaultValue : any = null; // 默认值
    allow_input:boolean = false;
    inputWidgetType: string = 'input';
    value:any = "";
    subGraphNode : Array<NSubGraphInput> = []; //子图的输入的节点不是同一个graph, 一个输入可以创建多个子图输出 

    get index () : number{
        return this.node.getSlotIndex(this);
    }

    /**
     * @description 反序列化一个输入插槽，并不会生成连接！
     * @param node 
     * @param { SerNodeOutput } param 序列化的数据 
     * @param { boolean } addInNode 是否直接添加到节点中
     * @returns 
     */
    static deserialize( node : Node, {label, valueType, options, defaultValue, allow_input, value, inputWidgetType} : SerNodeInput , addInNode : boolean = true) : NodeInput{
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
    static create( node : Node, option : InputInitOption = {}, addInNode : boolean = true ) : NodeInput {
        return new NodeInput(node , option, addInNode);
    }

    constructor( node : Node, { label , valueType, options, defaultValue,allow_input,value,inputWidgetType } : InputInitOption,  addInNode : boolean = true ){
        this.node = node;
        label && ( this.label = label );
        valueType && ( this.valueType = valueType );
        options && ( this.options = options);
        allow_input && (this.allow_input = allow_input)
        inputWidgetType && (this.inputWidgetType = inputWidgetType)
        value && (this.value = value)

        if( !IsUndefined(defaultValue) && !IsNull(defaultValue)){
            this.defaultValue = defaultValue;
        }

        if( addInNode ) node.addSlot(this);
    }

    /**
     * @description 克隆一个输入插槽
     * @param 添加插槽的node
     * @returns NodeInput
     */
    clone( targetNode : Node ) : NodeInput {
        const input = NodeInput.create( targetNode , {
            label : this.label,
            valueType : this.valueType.concat(),
            allow_input:this.allow_input,
            value :this.value,
            options : Object.assign( this.options),
        });        

        targetNode.addSlot( input );

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
    destroy(){
    }

    /**
     * @description 序列化
     */
    serialize() : SerNodeInput {
        const link = this.link ? this.link.id : null;

        return {
            type : this.type,
            label : this.label,
            link,
            valueType : this.valueType.concat(),
            options : Object.assign({}, this.options),
            defaultValue : this.defaultValue,
            allow_input:this.allow_input,
            inputWidgetType:this.inputWidgetType,
            value:this.value
        }
    }

    /**
     * @description 删除连接
     */
    deleteLink(){
        this.link = null;
    }

    /**
     * @description 显示label的方法
     * @returns 
     */
    getLabel(){
        return this.label;
    }
}

/**
 * @description 输入插槽的初始化参数
 */
export interface OutputInitOption{ 
    label ?: string,
    valueType : DataTypeStr,
    options ?: INodeSlotOptions,
    defaultValue ?: any,
}

/**
 * @description 输出插槽
 */
export class NodeOutput implements INodeOutput{
    
    get index () : number{
        return this.node.getSlotIndex(this);
    }

    value : any = null;// 具体值
    type : SlotTypes.OUTPUT = SlotTypes.OUTPUT; // slot 类型
    link : Array<Link> = []; // 连接线id
    label: string = "未命名输出"; // 显示值
    node : Node; // 所属节点
    valueType : DataTypeStr; // 传出值类型
    options : INodeSlotOptions = {}; // 插槽参数

    defaultValue : any = null; // 默认值

    subGraphNode : NSubGraphOutput | null = null; //子图的输出的节点不是同一个graph, 一个输出可以创建一个子图输入 

    /**
     * @description 反序列化一个输出插槽
     * @param node 
     * @param { SerNodeOutput } param 序列化的数据 
     * @param { boolean } addInNode 是否直接添加到节点中
     * @returns 
     */
    static deserialize( node : Node, { label, valueType, defaultValue, options} : SerNodeOutput , addInNode : boolean = true) : NodeOutput{
        return NodeOutput.create(node, {
            label,
            valueType,
            defaultValue,
            options,
        }, addInNode)
    }

    static create( node : Node, option : OutputInitOption , addInNode : boolean = true) : NodeOutput {
        return new NodeOutput(node , option, addInNode);
    }

    constructor( node : Node, { label , valueType, options, defaultValue} : OutputInitOption, addInNode : boolean = true ){
        this.node = node;
        label && ( this.label = label );
        options && ( this.options = options);

        if( !IsUndefined(defaultValue) && !IsNull(defaultValue)){
            this.defaultValue = defaultValue;
            this.value = defaultValue;
        }

        this.valueType = valueType;

        if(addInNode) node.addSlot(this);
    }

    /**
     * @description 克隆一个输入插槽
     * @returns NodeInput
     */
    clone( targetNode : Node ) : NodeOutput {
        const output = NodeOutput.create( targetNode , {
            valueType : this.valueType,
            label : this.label,
            options : Object.assign( this.options),
        });

        targetNode.addSlot( output );
        
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
    destroy(){
    }

    /**
     * @description 序列化
     */
    serialize() : SerNodeOutput {
        const linkIds = [];

        for(let link of this.link){
            linkIds.push( link.id );
        }

        return {
            type : this.type,
            label : this.label,
            link : linkIds,
            valueType : this.valueType,
            options : Object.assign({}, this.options),
            defaultValue : this.defaultValue,
        }
    }

    /**
     * @description 删除连接
     */
    deleteLink( link : Link ){
        const index = this.link.indexOf(link);
        if(index === -1) return;
        
        this.link.splice(index,1);
    }

    /**
     * @description 是否有这个连接
     * @param link 
     * @returns 
     */
    hasLink( link : Link ){
        return this.link.indexOf(link) !== -1;
    }

    /**
     * @description 显示label的方法,可重载此方法
     * @returns 
     */
    getLabel(){
        return this.label;
    }
}