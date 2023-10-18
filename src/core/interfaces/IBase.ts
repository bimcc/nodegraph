
import { IFunction } from "../../interfaces";

/**
 * @description 定义可以进行序列化的对象
 */
export interface ISerializeObject {
    serialize : IFunction, // 序列化这个对象
    deserialize ?: IFunction, // 反序列化这个对象
}
