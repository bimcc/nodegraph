# 节点

Node 是所有节点的基类，并定义了节点的通用属性和方法。

## 属性

| 选项         | 描述       | 类型                               | 默认值               |
|------------|----------|----------------------------------|-------------------|
| id         | 节点的id    | string                           |                   |
| type       | 节点的类型    | string                           |                   |
| label      | 节点的显示名称  | string                           |                   |
| index      | 创建节点的顺序值 | number                           |                   |
| position   | 节点位置     | `{x:number, y:number, z:number}` | `{x:0, y:0, z:0}` |
| inputs     | 输入插槽     | Array                            |                   |
| outputs    | 输出插槽     | Array                            |                   |
| isEvent    | 是否事件节点   | boolean                          | false             |
| properties | 节点属性     | `{[key: string]: any;}`          |                   |

### id

id 是节点唯一标识，推荐使用具备业务意义的 ID，默认生成10位随机数字。

### type

type 是节点类型

### label

### index

### position

节点位置，是一个包含 x,y,z 属性的对象，可以通过 position(...) 方法来获取和设置节点位置。

### inputs

输入集合

### outputs

输出集合

### isEvent

节点是否为事件节点

### properties

节点自定义属性集合

## 方法

### getSlotIndex()

获取[槽插对象](./slot-api.md)在节点中位置,返回插槽对应类型位置索引,如果不是属于这个node就返回-1

```
getSlotIndex(slot: INodeSlot): number
```

| 名称   | 类型     | 必选 | 默认值 | 描述   |
|------|--------|----|-----|------|
| slot | `object` | ✓  |     | 插槽对象 |

```
const soltIndex = node.getSlotIndex(slot);
```

### getInputs()

返回所有输入插槽

```
getInputs(): Array<NodeInput>
```

### getInput(index:number)

根据输入插槽索引,返回输入插槽对象,如果未找到返回null

```
getInput(index: number): NodeInput | null
```

| 名称    | 类型     | 必选 | 默认值 | 描述     |
|-------|--------|----|-----|--------|
| index | `number` | ✓  |     | 插槽位置索引 |

### addInput()

新增一个输入插槽,添加到节点中

```
addInput(options: InputInitOption): NodeInput
```

InputInitOption输入插槽的初始化参数

| 名称                      | 类型              | 必选 | 默认值     | 描述              |
|-------------------------|-----------------|----|---------|-----------------|
| options.label           | `string`          |    | `''`    | 插槽位置索引          |
| options.valueType       | `Array<string>` |    | `[]`    | 允许接收值类型         |
| options.options         | `object`          |    | `{}`    | 插槽的设置           |
| options.defaultValue    | `any`             |    | `null`  | 默认值             |
| options.allow_input     | `boolean`         |    | `false` | 允许直接输入          |
| options.inputWidgetType | `string`          |    | `input` | 直接输入框类型,默认input |
| options.value           | `any`             |    | `''`    | 直接输入时绑定的值       |

### getOutputs()

```
getOutputs(): Array<NodeOutput>
```

返回所有输出插槽

### getOutput(index:number)

```
getOutput(index: number): NodeOutput | null
```

根据输出插槽索引,返回指定输出插槽

### addOutput()

```
addOutput(options: OutputInitOption): NodeOutput
```

新增一个输出插槽,添加到节点中

### setPosition()

```
setPosition(pos: IVector3)
```

### clone()

克隆一个节点

```
clone()
``