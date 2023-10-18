# 边

## 添加边 addLink()

| 参数          | 描述            | 类型     | 可选值 | 默认值 |
|-------------|---------------|--------|-----|-----|
| originId    | 起始节点id        | string |     |     |
| originIndex | 起始节点输出插槽index | number |     |     |
| targetId    | 目标节点id        | string |     |     |
| targetIndex | 目标节点输入插槽index      | number |     |     |

```javascript
// 添加node
let node1 = viewer.addNode('ConstantNumber', {x: 20, y: 20, z: 0})
let node2 = viewer.addNode('ConstantNumber', {x: 20, y: 150, z: 0})
let node3 = viewer.addNode('sum', {x: 350, y:80, z: 0})
// 添加添加边
viewer.addLink(node1.id, 0, node3.id, 0)
viewer.addLink(node2.id, 0, node3.id, 1)
```

<iframe src='/demo/addLink.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>