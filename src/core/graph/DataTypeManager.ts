import { IKeyType } from '../../interfaces';
import { DataTypeOptions, DataTypeStr, } from '../interfaces';

/**
 * @description 数据管理器单例
 */
let manager : DataTypeMananger | null = null;

/**
 * @description 数据类型管理
 */
export class DataTypeMananger {

    defaultType : DataTypeStr; // 默认类型
    typeMap : IKeyType<DataTypeOptions> = {};

    static get() : DataTypeMananger{
        if( !manager ) manager = new DataTypeMananger();
        return manager;
    }

    constructor(){
        const defaultList : Array<DataTypeOptions> = [{
            id : 'any',
            label : '通用类型',
        },{
            id : 'string',
            label : '字符串',
        },{
            id : 'number',
            label : '数字'
        },{
            id : 'array',
            label : '数组'
        },];

        for(let options of defaultList){
            this.register(options);
        }

        this.defaultType = defaultList[0].id;
    }

    /**
     * @description 注册
     * @param options
     */
    register( options : DataTypeOptions ){
        this.typeMap[options.id] = options;
    }

    /**
     * @description 获取类型信息
     * @param id
     */
    get( id : DataTypeStr ) : DataTypeOptions{
        return this.typeMap[id];
    }
}

