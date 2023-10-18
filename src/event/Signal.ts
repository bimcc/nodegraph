/*
 * @Date: 2023-06-14 10:32:11
 * @LastEditors: asahi
 * @LastEditTime: 2023-08-04 15:57:40
 * @FilePath: \litegraph\src\event\Signal.ts
 */


export class Signal{
    private handlerList : Array<Function> = [];

    id : string | number;

    constructor( id : string | number){
        this.id = id;
    }

    add( handler : Function ){
        this.handlerList.push(handler);
    }

    dispatch(...param : Array<any>) {
        for(let handler of this.handlerList){
            handler(...param);
        }
    }

    remove( handler : Function ){
        const index = this.handlerList.indexOf(handler);
        if(index === -1) return;
        this.handlerList.splice(index , 1);
    }
}