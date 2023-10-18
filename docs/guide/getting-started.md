# 快速上手

## 安装

### 先决条件
- 已安装 16.0 或更高版本的 Node.js, yarn
- 熟悉命令行

```shell
# npm
$ npm install bimcc/nodegraph --save

# yarn
$ yarn add bimcc/nodegraph
```



## 开始使用

### 1.初始化画布
在页面中创建一个画布容器，然后初始化画布对象。

```html
<div id="container"></div>
```

```javascript
import {GraphViewer} from 'nodegraph';

const viewer =  new GraphViewer(document.getElementById('container'));
```

<iframe src='/demo/initialization.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>


### 2. 渲染节点和边
支持 JSON 格式数据，该对象中 nodes 代表节点数据，links 代表边数据。

```javascript
const data = {
    "viewPosition": {
        "x": 94,
        "y": -64
    },
    "version": "1.00",
    "nodes": [
        {
            "id": "node_2341138007",
            "type": "ConstantNumber",
            "index": 12,
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
            "id": "node_3028927060",
            "type": "sum",
            "index": 13,
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
        },
        {
            "id": "node_8845838852",
            "type": "ConstantNumber",
            "index": 14,
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
        }
    ],
    "links": [
        [
            "link-oZ3w",
            "node_2341138007",
            0,
            "node_3028927060",
            0,
            "number"
        ],
        [
            "link-sT_t",
            "node_8845838852",
            0,
            "node_3028927060",
            1,
            "number"
        ]
    ]
}

viewer.deserialize(data)
```

<iframe src='/demo/deserialize.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>


### 3. 数据导出
```javascript
viewer.serialize()
```