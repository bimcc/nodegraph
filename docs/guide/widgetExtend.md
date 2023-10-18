# widget扩展

viewer可以通过注册 viewer.registerWidget() 添加自定义widget

下面通过一个最小化示例自定义一个widget

::: code-group

```js [TextWidget.js]
import {BaseWidget} from 'nodegraph';

export default class TextWidget extends BaseWidget {

    static widgetType = 'text'

    DOM;

    constructor(option) {
        super()

        this.DOM = document.createElement("span")

        this.setStyle({
            width: '100%',
            textAlign: 'center',
            display: 'block',
            fontSize: '20px'
        })
        if (option.text) {
            this.DOM.innerText = option.text
        }

        this.onMousedown((e) => {
            e.stopPropagation();
        })
    }

		// 必须实现
    onChange(closure) {}

		// 必须实现
    getValue() {
        return this.DOM.innerText;
    }

		// 必须实现
    setValue(value) {
        this.DOM.innerText = value;
    }

    getLabel() {
        //return this.DOM.innerText
    }
}

```

:::


引入后注册自定义widget

```javascript
import {WidgetsManager} from 'nodegraph';
import TextWidget from 'TextWidget'

const viewer = new GraphViewer(document.getElementById('container'));
WidgetsManager.registerWidget(TextWidget)
```

注册widget后,就可以在节点中使用 this.addWidget()

```javascript
import {Node} from 'nodegraph';

class TextNode extends Node {
    static  NodeType = "文本节点"; //节点类型
    static  NodeLabel = "文本节点"; //节点显示名
    static  NodePath = "文本节点"; // 节点路径

    constructor(graph, position, properties, inputs, outputs) {
        super(graph, position, properties, inputs, outputs);
        
        // 添加widget
        const textW = this.addWidget('text', {
            text: '文本内容'
        });
    }
}
```

在下面示例中 右键->添加节点 就会看到文本节点

<iframe src='/demo/widgetExtend.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>