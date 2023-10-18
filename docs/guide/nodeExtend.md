# 节点扩展

viewer可以通过注册 viewer.registerNode() 添加自定义节点类型

下面通过一个最小化示例自定义一个节点类型

::: code-group

```js [diyNode.js]
import {Node} from 'bimcc-graph';

export default class diyNode extends Node {
    static  NodeType = "diy_node_type"; //节点类型
    static  NodeLabel = "自定义节点名称"; //节点显示名
    static  NodePath = "node_path"; // 节点路径

    constructor() {
        super();
        
        // 节点输入插槽
        this.addInput({
            label: "输入",
            valueType: ['any'],
        });

        // 节点输出插槽
        this.addOutput({
            label: "输出",
            valueType: 'any',
        });
    }
}
```

```ts [diyNode.ts]
import {Node} from 'bimcc-graph';

export class diyNode extends Node {
  static override NodeType: NodeType = "diy_node_1"; //节点类型
  static override NodeLabel: string = "自定义节点1"; //节点显示名
  static override NodePath: string = "自定义节点"; // 节点路径

  constructor() {
    super();
    // 节点输入插槽
    this.addInput({
      label: "输入",
      valueType: ['any'],
    });

    // 节点输出插槽
    this.addOutput({
      label: "输出",
      valueType: 'any',
    });
  }
}
```

:::


引入后注册自定义节点类型

```javascript
import {GraphViewer} from 'bimcc-graph';
import diyNode from 'diyNode'

const viewer = new GraphViewer(document.getElementById('container'));
viewer.registerNode(diyNode);
```

在下面示例中 右键->添加节点 就会看到自定义节点

<iframe src='/demo/nodeExtend.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>