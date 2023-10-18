# 节点

## 添加节点 addNode()

添加节点前，要保证该节点类型已被注册。节点类型注册可查看[节点扩展](./nodeExtend.html)

| 参数         | 描述       | 类型     | 可选值 | 默认值 |
|------------|----------|--------|-----|-----|
| type       | 节点类型     | string |     |     |
| position   | 节点画布坐标   | object |     |     |
| position.x | 节点画布x轴坐标 | number |     | 0   |
| position.y | 节点画布y轴坐标 | number |     | 0   |
| position.z | 节点画布z轴坐标 | number |     | 0   |
| properties | 自定义配置    | object |     | {}  |
| options    | 节点参数配置   | object |     | {}  |

```javascript
viewer.addNode('ConstantNumber', {x: 100, y: 100, z: 0})
```

<iframe src='/demo/addNode.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>

## 定位节点(focusOnNode)

根据节点id查找节点

| 参数        | 描述      | 类型       | 可选值        | 默认值  |
|-----------|---------|----------|------------|------|
| id        | 节点id    | string   |            |      |
| needShake | 是否需要抖动  | boolean  | true/false | true |
| onFinish  | 完成时执行函数 | function |            |      |

```javascript
viewer.focusOnNode('node_0')
```

## 克隆节点

## 删除节点

