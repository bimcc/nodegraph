# 节点

Node 是所有节点的基类，并定义了节点的通用属性和方法。

## 属性

| 选项               | 描述          | 类型                               | 默认值               |
|------------------|-------------|----------------------------------|-------------------|
| id               | 节点的id       | `string`                         |                   |
| type             | 节点的类型       | `string`                         |                   |
| label            | 节点的显示名称     | `string`                         |                   |
| index            | 创建节点的顺序值    | `number`                         |                   |
| position         | 节点位置        | `{x:number, y:number, z:number}` | `{x:0, y:0, z:0}` |
| inputs           | 输入插槽        | `Array<NodeInput>`               |                   |
| outputs          | 输出插槽        | `Array<NodeOutput>`              |                   |
| isEvent          | 是否事件节点      | `boolean`                        | `false`           |
| properties       | 节点属性        | `object`                         |                   |
| options          | 节点参数配置      | `object`                         | `{}`              |
| addInputsConfig  | 节点能添加的输入配置项 | `Array<InputInitOption>`         | `[]`              |
| addOutputsConfig | 节点能添加的输出配置项 | `Array<OutputInitOption>`        | `[]`              |

## id

id 是节点唯一标识，默认生成10位随机数字。

## type

type是节点类型。添加节点时,该节点类型必须在蓝图中注册方可使用

## label

节点显示名称,可对获取方法[getLabel()](#getlabel)进行重写

## position

节点位置，是一个包含 x,y,z 属性的对象，可以通过 position(...) 方法来获取和设置节点位置。

| 名称 | 类型       | 默认值 | 描述                  |
|----|----------|-----|---------------------|
| x  | `number` | 0   | 节点x轴                |
| y  | `number` | 0   | 节点y轴                |
| z  | `number` | 0   | 节点z轴,除三维展示时,z轴值默认为0 |

## inputs

节点下所有输入项 `Array<NodeInput>`

## outputs

节点下所有输出项 `Array<NodeOutput>`

## isEvent

节点是否为事件节点

## properties

节点自定义属性对象集合 `{[key: string]: any;}`,可通过[setProperty()](#setproperty)和[getProperty()](#getproperty)设置获取

## options

节点参数配置

| 选项              | 描述          | 类型        | 默认值   |
|-----------------|-------------|-----------|-------|
| addInput        | 是否可以添加输入插槽  | `boolean` | false |
| addOutput       | 是否可以添加输出插槽  | `boolean` | false |
| notClone        | 是否不可以克隆     | `boolean` | false |
| notResize       | 是否不可以拖动改变大小 | `boolean` | false |
| `[key:string ]` | 用户追加自定义设置   | `any`     |       |

## addInputsConfig

当 `options.addInput` 为`true`时,addInputsConfig配置生效,节点右键菜单可新增输入项

InputInitOption配置

| 名称                      | 类型              | 必选 | 默认值     | 描述                                                                                                                                                                                                     |
|-------------------------|-----------------|----|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| options.label           | `string`        |    | `''`    | 插槽标签                                                                                                                                                                                                   |
| options.valueType       | `Array<string>` |    | `[]`    | 允许接收值类型                                                                                                                                                                                                |
| options.options         | `object`        |    | `{}`    | 插槽设置可选参数 <br/>`{`<br/>`// 是否可以删除`<br/>`remove?: boolean`,<br/>`// 删除时触发方法`<br/>`removeFunc?: IFunction`,<br/>`// 是否可以重命名`<br/>`rename?: boolean`,<br/>`//是否是垂直状态显示`<br/>`isVertical?: boolean`<br/>`}` |
| options.defaultValue    | `any`           |    | `null`  | 默认值                                                                                                                                                                                                    |
| options.allow_input     | `boolean`       |    | `false` | 允许直接输入                                                                                                                                                                                                 |
| options.inputWidgetType | `string`        |    | `input` | 直接输入框类型,默认input                                                                                                                                                                                        |
| options.value           | `any`           |    | `''`    | 直接输入时绑定的值                                                                                                                                                                                              |

## addOutputsConfig

当 `options.addOutput` 为`true`时,addOutputsConfig配置生效,节点右键菜单可新增输出项

OutputInitOption配置

| 名称                   | 类型       | 必选 | 默认值    | 描述                                                                                                                                                                                                     |
|----------------------|----------|----|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| options.label        | `string` |    | `''`   | 插槽标签                                                                                                                                                                                                   |
| options.valueType    | `string` | ✓  |        | 允许接收值类型                                                                                                                                                                                                |
| options.options      | `object` |    | `{}`   | 插槽设置可选参数 <br/>`{`<br/>`// 是否可以删除`<br/>`remove?: boolean`,<br/>`// 删除时触发方法`<br/>`removeFunc?: IFunction`,<br/>`// 是否可以重命名`<br/>`rename?: boolean`,<br/>`//是否是垂直状态显示`<br/>`isVertical?: boolean`<br/>`}` |
| options.defaultValue | `any`    |    | `null` | 默认值                                                                                                                                                                                                    |

## 通用方法

## getSlotIndex()

获取[槽插对象](./slot-api.md)在节点中位置,返回插槽对应类型位置索引,如果不是属于这个node就返回-1

```
getSlotIndex(slot: INodeSlot): number
```

| 名称   | 类型       | 必选 | 默认值 | 描述   |
|------|----------|----|-----|------|
| slot | `object` | ✓  |     | 插槽对象 |

## getInputs()

返回所有输入插槽

```
getInputs(): Array<NodeInput>
```

## getInput(index:number)

根据输入插槽索引,返回输入插槽对象,如果未找到返回null

```
getInput(index: number): NodeInput | null
```

| 名称    | 类型       | 必选 | 默认值 | 描述     |
|-------|----------|----|-----|--------|
| index | `number` | ✓  |     | 插槽位置索引 |

## addInput()

新增一个输入插槽,添加到节点中

```
addInput(options: InputInitOption): NodeInput
```

InputInitOption输入插槽的初始化参数

| 名称                      | 类型              | 必选 | 默认值     | 描述                                                                                                                                                                                                     |
|-------------------------|-----------------|----|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| options.label           | `string`        |    | `''`    | 插槽标签                                                                                                                                                                                                   |
| options.valueType       | `Array<string>` |    | `[]`    | 允许接收值类型                                                                                                                                                                                                |
| options.options         | `object`        |    | `{}`    | 插槽设置可选参数 <br/>`{`<br/>`// 是否可以删除`<br/>`remove?: boolean`,<br/>`// 删除时触发方法`<br/>`removeFunc?: IFunction`,<br/>`// 是否可以重命名`<br/>`rename?: boolean`,<br/>`//是否是垂直状态显示`<br/>`isVertical?: boolean`<br/>`}` |
| options.defaultValue    | `any`           |    | `null`  | 默认值                                                                                                                                                                                                    |
| options.allow_input     | `boolean`       |    | `false` | 允许直接输入                                                                                                                                                                                                 |
| options.inputWidgetType | `string`        |    | `input` | 直接输入框类型,默认input                                                                                                                                                                                        |
| options.value           | `any`           |    | `''`    | 直接输入时绑定的值                                                                                                                                                                                              |

## getOutputs()

返回所有输出插槽

```
getOutputs(): Array<NodeOutput>
```

## getOutput(index:number)

根据输出插槽索引,返回输出插槽对象,如果未找到返回null

```
getOutput(index: number): NodeOutput | null
```

## addOutput()

新增一个输出插槽,添加到节点中

```
addOutput(options: OutputInitOption): NodeOutput
```

OutputInitOption输出插槽的初始化参数

| 名称                   | 类型       | 必选 | 默认值    | 描述                                                                                                                                                                                                     |
|----------------------|----------|----|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| options.label        | `string` |    | `''`   | 插槽标签                                                                                                                                                                                                   |
| options.valueType    | `string` | ✓  |        | 允许接收值类型                                                                                                                                                                                                |
| options.options      | `object` |    | `{}`   | 插槽设置可选参数 <br/>`{`<br/>`// 是否可以删除`<br/>`remove?: boolean`,<br/>`// 删除时触发方法`<br/>`removeFunc?: IFunction`,<br/>`// 是否可以重命名`<br/>`rename?: boolean`,<br/>`//是否是垂直状态显示`<br/>`isVertical?: boolean`<br/>`}` |
| options.defaultValue | `any`    |    | `null` | 默认值                                                                                                                                                                                                    |

## setOutputData()

设置输出值

```
setOutputData(index: number, value: any, refresh: boolean = false): void
```

| 名称      | 类型        | 必选 | 默认值   | 描述       |
|---------|-----------|----|-------|----------|
| index   | `number`  | ✓  |       | 插槽位置索引   |
| value   | `any`     | ✓  |       | 值        |
| refresh | `boolean` |    | false | 设置值后是否刷新 |

## setPosition()

设置位置

```
setPosition(pos)
```

| 名称    | 类型       | 必选 | 默认值 | 描述                  |
|-------|----------|----|-----|---------------------|
| pos.x | `number` | ✓  | 0   | 节点x轴                |
| pos.y | `number` | ✓  | 0   | 节点y轴                |
| pos.z | `number` | ✓  | 0   | 节点z轴,除三维展示时,z轴值默认为0 |

## clone()

克隆当前节点

```
clone():node
```

## getAllLinks()

获取所有与这个node相连的link,返回`Array<Link>`

## getProperty()

获取自定义属性

```
getProperty(key: string)
```

| 名称  | 类型       | 必选 | 默认值 | 描述     |
|-----|----------|----|-----|--------|
| key | `string` | ✓  |     | 自定义属性键 |

## setProperty()

设置自定义属性

```
setProperty(key: string, value: any): void
```

| 名称    | 类型       | 必选 | 默认值 | 描述     |
|-------|----------|----|-----|--------|
| key   | `string` | ✓  |     | 自定义属性键 |
| value | `any`    | ✓  |     | 自定义属性值 |

## getWidget()

根据widget在节点中的索引值index,获取widget对象,如果未找到返回null

```
getWidget(index: number): BaseWidget | null
```

| 名称    | 类型       | 必选 | 默认值 | 描述        |
|-------|----------|----|-----|-----------|
| index | `number` | ✓  |     | wedget索引值 |

## getWidgetIndex()

根据widget对象,获取该widget在节点中的索引值,未找到返回-1

```
getWidgetIndex(widget: BaseWidget): number
```

| 名称     | 类型           | 必选 | 默认值 | 描述       |
|--------|--------------|----|-----|----------|
| widget | `BaseWidget` | ✓  |     | widget对象 |

## addWidget()

在节点中添加widget

```
addWidget(name: string, option?: any, label?: string,propertyName?:string): BaseWidget | null
```

| 名称           | 类型       | 必选 | 默认值 | 描述              |
|--------------|----------|----|-----|-----------------|
| name         | `string` | ✓  |     | widget类型名称      |
| option       | `any`    |    | {}  | 初始化属性           |
| label        | `string` |    |     | 标签              |
| propertyName | `string` |    |     | 节点自定义属性键名,双向绑定值 |

## removeWidget()

在节点中移除widget

```
removeWidget(index: number): void
```

| 名称    | 类型       | 必选 | 默认值 | 描述        |
|-------|----------|----|-----|-----------|
| index | `number` | ✓  |     | wedget索引值 |

## getOption()

获取设置项

```
getOption(key: string):any
```

| 名称  | 类型       | 必选 | 默认值 | 描述   |
|-----|----------|----|-----|------|
| key | `string` | ✓  |     | 设置项键 |

## setOption()

设置设置项

```
setOption(key: string, value: any):void
```

| 名称    | 类型       | 必选 | 默认值 | 描述   |
|-------|----------|----|-----|------|
| key   | `string` | ✓  |     | 设置项键 |
| value | `any`    | ✓  |     | 设置项值 |

## getLabel()

获取显示名称,可重写

```
getLabel():string
```

## setLabel()

设置显示名称

```
setLabel(value: string): void
```

## invoke()

事件节点的对外统一的调用方法，仅事件节点调用,普通节点不需要从这儿走

```
invoke():void
```

## 可选实现方法

## getContextMenu()

节点右键菜单,必须返回`Array<IContextMenuItem | null>`

IContextMenuItem对象格式

| 名称       | 类型                                | 必选 | 默认值 | 描述   |
|----------|-----------------------------------|----|-----|------|
| label    | `string`                          | ✓  |     | 菜单标签 |
| callback | `(...arg: Array<any> )=>any`      |    |     | 触发方法 |
| subMenu  | `Array<IContextMenuItem \| null>` |    |     | 下级菜单 |

## onTrigger()

所有依赖值都被准备好了触发，事件节点的前置方法，非事件节点可以与beforeExecute等效

## initEvents()

事件节点的初始化钩子，非事件节点无效

## initedRender()

渲染初始化完成

## renderInit()

## beforeExecute()

节点主方法执行之前

## afterExecute()

节点主方法执行之后

## onExecute()

执行函数

## onNodeHighLight()

当节点发生高亮的时候

## onRefresh()

当刷新时，此时一般节点dom已经重建完毕，可以操作dom进行修改

## onRemove()

被删除时