# 画布

## 实例化

```
const viewer = new GraphViewer(rootDom , graph, option)
```

实例化传参

| 名称      | 类型            | 必选 | 默认值    | 描述             |
|---------|---------------|----|--------|----------------|
| rootDom | `HTMLElement` | ✓  |        | dom元素          |
| graph   | `Graph\|null` | ✓  | `null` | 蓝图基类实例,默认传null |
| option  | `object`      |    |        | 画布参数配置         |

option参数

| 参数            | 类型        | 必选 | 默认值     | 描述       |  
|---------------|-----------|----|---------|----------|
| controlShow   | `boolean` |    | `true`  | 控制面板是否显示 | 
| searchBoxShow | `boolean` |    | `true`  | 搜索框是否显示  | 
| miniMapShow   | `boolean` |    | `true`  | 小地图是否显示  |
| readonly      | `boolean` |    | `false` | 只读模型     |

[//]: # (## 属性)

[//]: # ()
[//]: # (| 名称          | 类型            | 默认值 | 描述     |)

[//]: # (|-------------|---------------|-----|--------|)

[//]: # (| rootDom     | `object`      |     | dom元素  |)

[//]: # (| graph       | `Graph`       |     | 蓝图基类实例 |)

[//]: # (| events      | `GraphEvents` |     | 事件总线   |)

[//]: # (| ActiveNodes | `array`       |     | 所有选中节点 |)

## 方法

## getRenderByTarget()

根据渲染目标获取渲染器

``` 
viewer.getRenderByTarget(value) 
```

| 名称    | 类型       | 默认值 | 描述                                                                      |
|-------|----------|-----|-------------------------------------------------------------------------|
| value | `string` |     | 渲染目标类型:<br /> `RenderNode`/节点<br /> `RenderLink`/连接<br /> `RenderUI`/UI |

## getNodeManager()

获取节点管理器

```
viewer.getNodeManager() 
```

## addNode()

添加节点类型到蓝图中,返回一个node对象

```
viewer.addNode(type, position = {x: 0, y: 0, z: 0}, properties = {}, options= {}): Node | null
```

| 名称         | 类型       | 必选 | 默认值                  | 描述                                            |
|------------|----------|----|----------------------|-----------------------------------------------|
| type       | `string` | ✓  |                      | 节点类型                                          |
| position   | `object` |    | `{x: 0, y: 0, z: 0}` | 节点位置,参照[节点位置](node-api.html#position)         |
| properties | `object` |    | `{}`                 | 节点自定义属性,参照[节点自定义属性](node-api.html#properties) |
| options    | `object` |    | `{}`                 | 节点参数,参照[节点参数配置](node-api.html#options)        |

## addLink()

连接两个节点

```
viewer.addLink(originId, originIndex, targetId, targetIndex)
```

| 名称          | 类型       | 必选 | 默认值 | 描述            |
|-------------|----------|----|-----|---------------|
| originId    | `string` | ✓  |     | 起始节点id        |
| originIndex | `number` | ✓  |     | 起始节点输出插槽index |
| targetId    | `string` | ✓  |     | 结束节点id        |
| targetIndex | `number` | ✓  |     | 结束节点输入插槽index |

## cloneNode()

克隆节点

```
viewer.cloneNode(id)
```

| 名称 | 类型       | 必选 | 默认值 | 描述      |
|----|----------|----|-----|---------|
| id | `string` | ✓  |     | 被克隆节点id |

## removeNode()

删除节点

```
viewer.removeNode(id)
```

| 名称 | 类型       | 必选 | 默认值 | 描述      |
|----|----------|----|-----|---------|
| id | `string` | ✓  |     | 被删除节点id |

## removeLink()

删除节点

```
viewer.removeLink(id)
```

| 名称 | 类型       | 必选 | 默认值 | 描述      |
|----|----------|----|-----|---------|
| id | `string` | ✓  |     | 被删除连线id |

## setScale()

手动设置缩放

```
viewer.setScale(scale)
```

| 名称    | 类型       | 必选 | 默认值 | 描述   |
|-------|----------|----|-----|------|
| scale | `number` | ✓  |     | 缩放数值 |

## refresh()

根据当前viewer的graph刷新显示

```
viewer.refresh(needFocus)
```

| 名称        | 类型        | 必选 | 默认值   | 描述           |
|-----------|-----------|----|-------|--------------|
| needFocus | `boolean` | ✓  | false | 是否自动聚焦到第一个节点 |

## serialize()

导出节点数据

```
viewer.serialize()
```

## deserialize()

导入节点数据

```
viewer.deserialize(data)
```

| 名称                | 类型       | 必选  | 默认值            | 描述      |
|-------------------|----------|-----|----------------|---------|
| data.nodes        | `object` | `✓` |                | 蓝图节点数据  |
| data.links        | `object` | `✓` |                | 蓝图链接线数据 |
| data.viewPosition | `object` |     | `{x: 0,y: 0,}` | 蓝图坐标    |

## clearAll()

清空并重置画布

```
viewer.clearAll(data)
```

## addCustomContextMenuFunc()

添加获取自定义菜单的方法,func方法需要返回一个[IContextMenuItem对象](node-api.html#getcontextmenu)

```
viewer.addCustomContextMenuFunc(func)
```

| 名称            | 类型       | 必选  | 默认值 | 描述                                                    |
|---------------|----------|-----|-----|-------------------------------------------------------|
| func.position | `object` | `✓` |     | 二维向量位置`{x:number,y:number}`                           |
| func.type     | `number` | `✓` |     | 鼠标右键目标类型:<br/>0/画布 <br/> 1/节点 <br/>2/插槽 <br/>3/widget |
| func.target   | `any`    | `✓` |     |                                                       |

## focusOnNode()

定位到节点

```
viewer.focusOnNode(id, needShake, onFinish)
```

| 名称        | 类型                                 | 必选  | 默认值  | 描述       |
|-----------|------------------------------------|-----|------|----------|
| id        | `string`                           | `✓` |      | 查找节点id   |
| needShake | `boolean`                          | `✓` | true | 是否需要抖动动画 |
| onFinish  | ` ( ... arg : Array<any> ) => any` |     |      | 完成时执行方法  |

## getActiveNode()

获取当前高亮(选中)的节点数据

```
viewer.getActiveNode()
```

## removeSlot()

删除节点插槽

```
viewer.removeSlot(slot)
```

| 名称   | 类型                        | 必选  | 默认值 | 描述        |
|------|---------------------------|-----|-----|-----------|
| slot | `NodeInput \| NodeOutput` | `✓` |     | 输入/输出插槽对象 |

## setViewerMode()

设置只读

```
viewer.setViewerMode()
```

## disbleViewerMode()

取消只读

```
viewer.disbleViewerMode()
```

## mergeToSubgraph()

合并到子图

```
viewer.mergeToSubgraph(renders)
```

| 名称      | 类型      | 必选  | 默认值 | 描述        |
|---------|---------|-----|-----|-----------|
| renders | `Array` | `✓` |     | 有所选中的节点数据 |

