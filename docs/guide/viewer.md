# 画布

## 画布组件显示

| 参数                   | 描述       | 类型          | 可选值        | 默认值   |
|----------------------|----------|-------------|------------|-------|
| dom                  | DOM元素    | HTMLElement |            |       |
| graph                | 蓝图基类     |             |            | null  |
| option               | 画布选项     | object      |            |       |
| option.controlShow   | 控制面板是否显示 | boolean     | true/false | true  |
| option.searchBoxShow | 搜索框是否显示  | boolean     | true/false | true  |
| option.miniMapShow   | 小地图是否显示  | boolean     | true/false | true  |
| option.readonly      | 只读模型     | boolean     | true/false | false |

```html
<div id="container"></div>

<script>
    import {GraphViewer} from "bimcc-graph";

    const viewer = new GraphViewer(document.getElementById('container'), null, {
        controlShow: true,
        searchBoxShow: true,
        miniMapShow: true,
        readonly: false
    });
</script>
```

<iframe src='/demo/initialization2.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>

## 导入数据(deserialize)

支持节点/边元数据数组 viewer.deserialize(data)

```javascript
viewer.deserialize({
    version: "1.00",
    viewPosition: {
        x: 0,
        y: 0
    },
    "nodes": [
        {
            "id": "node_1",
            "type": "ConstantNumber",
            "index": 1,
            "_label": "数字",
            "position": [
                443,
                230,
                0
            ],
            "inputs": [],
            "outputs": [
                {
                    "type": 2,
                    "label": "value",
                    "link": [
                        "link-oZ3w"
                    ],
                    "valueType": "number",
                    "options": {
                        "isVertical": false
                    },
                    "defaultValue": null
                }
            ],
            "properties": {
                "__function__": "ConstantNumber",
                "value": 1
            },
            "options": {}
        },
        {
            "id": "node_2",
            "type": "ConstantNumber",
            "index": 2,
            "_label": "数字",
            "position": [
                444,
                392,
                0
            ],
            "inputs": [],
            "outputs": [
                {
                    "type": 2,
                    "label": "value",
                    "link": [
                        "link-sT_t"
                    ],
                    "valueType": "number",
                    "options": {
                        "isVertical": false
                    },
                    "defaultValue": null
                }
            ],
            "properties": {
                "__function__": "ConstantNumber",
                "value": 2
            },
            "options": {}
        },
        {
            "id": "node_3",
            "type": "sum",
            "index": 3,
            "_label": "加法",
            "position": [
                804,
                250,
                0
            ],
            "inputs": [
                {
                    "type": 1,
                    "label": "输入",
                    "link": "link-oZ3w",
                    "valueType": [
                        "number"
                    ],
                    "options": {
                        "isVertical": false
                    },
                    "defaultValue": 0,
                    "allow_input": true,
                    "value": ""
                },
                {
                    "type": 1,
                    "label": "输入",
                    "link": "link-sT_t",
                    "valueType": [
                        "number"
                    ],
                    "options": {
                        "isVertical": false
                    },
                    "defaultValue": 0,
                    "allow_input": true,
                    "value": ""
                }
            ],
            "outputs": [
                {
                    "type": 2,
                    "label": "输出1",
                    "link": [],
                    "valueType": "number",
                    "options": {
                        "isVertical": false
                    },
                    "defaultValue": 1
                }
            ],
            "properties": {},
            "options": {}
        }
    ],
    "links": [
        [
            "link-oZ3w",
            "node_1",
            0,
            "node_3",
            0,
            "number"
        ],
        [
            "link-sT_t",
            "node_2",
            0,
            "node_3",
            1,
            "number"
        ]
    ]
})
```

通常，我们通过 viewer.deserialize(...) 来渲染 viewer.serialize() 导出的数据

## 导出数据(serialize)

我们可以调用 viewer.serialize() 方法来导出图中的节点和边，返回一个具有

```
{
  version: "1.00",
  viewPosition: {
    x: 0,
    y: 0
  },
  nodes: [],
  links: []
}
```

结构的对象，其中 nodes和links 数组按渲染顺序保存节点和边。

其中，导出的节点结构如下：

```
{
    "id": "node_0",
    "type": "ConstantNumber",
    "index": 1,
    "_label": "数字",
    "position": [
        443,
        230,
        0
    ],
    "inputs": [],
    "outputs": [
        {
            "type": 2,
            "label": "value",
            "link": [
                "link-oZ3w"
            ],
            "valueType": "number",
            "options": {
                "isVertical": false
            },
            "defaultValue": null
        }
    ],
    "properties": {
        "__function__": "ConstantNumber",
        "value": 1
    },
    "options": {}
}
```

边的结构如下：

```
[
    "link-oZ3w",
    "node_0",
    0,
    "node_1",
    0,
    "number"
]
```

## 缩放(setScale)

画布的缩放也是常用操作，鼠标按下画布后滚动鼠标滚轮会缩放画布。同时也支持设置viewer.setScale 来实现缩放,
缩放范围0.4~3之间。

```javascript
viewer.setScale(1)
```

## 只读(readonly)

设置只读后,画布只能缩放与平移

```javascript
// 设置只读
viewer.setViewerMode()

// 取消只读
viewer.disbleViewerMode()
```

<iframe src='/demo/readonly.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>