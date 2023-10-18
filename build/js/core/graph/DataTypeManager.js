/**
 * @description 数据管理器单例
 */
let manager = null;
/**
 * @description 数据类型管理
 */
export class DataTypeMananger {
    static get() {
        if (!manager)
            manager = new DataTypeMananger();
        return manager;
    }
    constructor() {
        Object.defineProperty(this, "defaultType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // 默认类型
        Object.defineProperty(this, "typeMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        const defaultList = [{
                id: 'any',
                label: '通用类型',
            }, {
                id: 'string',
                label: '字符串',
            }, {
                id: 'number',
                label: '数字'
            }, {
                id: 'array',
                label: '数组'
            },];
        for (let options of defaultList) {
            this.register(options);
        }
        this.defaultType = defaultList[0].id;
    }
    /**
     * @description 注册
     * @param options
     */
    register(options) {
        this.typeMap[options.id] = options;
    }
    /**
     * @description 获取类型信息
     * @param id
     */
    get(id) {
        return this.typeMap[id];
    }
}
