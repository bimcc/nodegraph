# 节点插槽

## 输入插槽

| 选项              | 类型        | 默认值     | 描述                                                                                                                                                                                                  | 
|-----------------|-----------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type            | `number`  | 1       | 插槽类型                                                                                                                                                                                                |
| link            | `object`  |         | 连接线[说明](link-api.html#属性)                                                                                                                                                                           |
| label           | `string`  |         | 标签                                                                                                                                                                                                  |
| node            | `object`  |         | 所属节点[说明](node-api.html#属性)                                                                                                                                                                          |
| valueType       | `Array`   | `[]`    | 传入值类型                                                                                                                                                                                               |
| options         | `object`  | `{}`    | 插槽的设置 <br/>`{`<br/>`// 是否可以删除`<br/>`remove?: boolean`,<br/>`// 删除时触发方法`<br/>`removeFunc?: IFunction`,<br/>`// 是否可以重命名`<br/>`rename?: boolean`,<br/>`//是否是垂直状态显示`<br/>`isVertical?: boolean`<br/>`}` |
| defaultValue    | `any`     | `null`  | 默认值                                                                                                                                                                                                 |
| allow_input     | `boolean` | `false` | 允许直接输入                                                                                                                                                                                              |
| inputWidgetType | `string`  | `input` | 直接输入框类型,默认input                                                                                                                                                                                     |
| value           | `any`     | `''`    | 具体值                                                                                                                                                                                                 |
| subGraphNode    | `Array`   | `[]`    | 子图的输入的节点不是同一个graph, 一个输入可以创建多个子图输出                                                                                                                                                                  |
| index           | `number`  |         | 插槽在节点中的索引值                                                                                                                                                                                          |

## 输出插槽

| 选项           | 类型       | 默认值    | 描述                                                                                                                                                                                                  | 
|--------------|----------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type         | `number` | 2      | 插槽类型                                                                                                                                                                                                |
| link         | `object` |        | 连接线[说明](link-api.html#属性)                                                                                                                                                                           |
| label        | `string` |        | 标签                                                                                                                                                                                                  |
| node         | `object` |        | 所属节点[说明](node-api.html#属性)                                                                                                                                                                          |
| valueType    | `string` |        | 传入值类型                                                                                                                                                                                               |
| options      | `object` | `{}`   | 插槽的设置 <br/>`{`<br/>`// 是否可以删除`<br/>`remove?: boolean`,<br/>`// 删除时触发方法`<br/>`removeFunc?: IFunction`,<br/>`// 是否可以重命名`<br/>`rename?: boolean`,<br/>`//是否是垂直状态显示`<br/>`isVertical?: boolean`<br/>`}` |
| defaultValue | `any`    | `null` | 默认值                                                                                                                                                                                                 |
| value        | `any`    | `''`   | 具体值                                                                                                                                                                                                 |
| subGraphNode | `Array`  | `[]`   | 子图的输入的节点不是同一个graph, 一个输入可以创建多个子图输出                                                                                                                                                                  |
| index        | `number` |        | 插槽在节点中的索引值                                                                                                                                                                                          |