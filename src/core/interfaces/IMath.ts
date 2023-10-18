


/**
 * @description 二维向量
 */
export interface IVector2 {
    x : number,
    y : number,
}

/**
 * @description 三维向量
 */
export interface IVector3 {
    x : number,
    y : number,
    z : number,
}

/**
 * @description aabb盒子
 */
export interface AABB {
    min : IVector3,
    max : IVector3,
}
