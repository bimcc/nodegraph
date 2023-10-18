/*
 * @Date: 2023-06-14 10:32:37
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-09-27 16:13:43
 * @FilePath: /graph/src/event/Signals.ts
 */
import { Signal as BaseSignal } from '../event';
import {CustomEvetns, GraphEventTypes} from "../types";

/**
 * @description 信号集合
 */
export interface ISignalMap {
    [ id : string | number ] : BaseSignal,
}

/**
 * @description 多信号管理
 */
export class Signals {
    private signalMap : ISignalMap = {};

    private readOnly:boolean = false;

    create( id : string | number ) : BaseSignal{
        const bs = new BaseSignal( id );
        this.signalMap[id] = bs;
        return bs;
    }

    delete( id : string){
        delete this.signalMap[id];
    }

    get( id : string | number ) : BaseSignal | null {
        return this.signalMap[id];
    }

    add( id : string | number, handler : Function){
        if( !this.signalMap[id] ) return;

        this.signalMap[id].add( handler );
    }

    dispatch( id : string | number, ...param : Array<any> ){
        if( !this.signalMap[id] ) return;

        // 禁用模式下 事件白名单
        const whitelist = [
          GraphEventTypes.DragViewMove,GraphEventTypes.ViewScale,
            CustomEvetns.Widget,CustomEvetns.Node
        ]

        // @ts-ignore
        if (!this.readOnly || whitelist.indexOf(id) >-1){
            this.signalMap[id].dispatch( ...param );
        }
    }

    remove( id : string | number, handler : Function){
        if( !this.signalMap[id] ) return;

        this.signalMap[id].remove( handler );
    }

    setReadOnly( value : boolean){
        this.readOnly = value;
    }
}