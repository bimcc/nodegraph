 class TextNode extends BimccGraph.Node {
    static  NodeType = "文本节点"; //节点类型
    static  NodeLabel = "文本节点"; //节点显示名
    static  NodePath = "文本节点"; // 节点路径

    constructor(graph, position, properties, inputs, outputs) {
        super(graph, position, properties, inputs, outputs);

        const textW = this.addWidget('text', {
            text: '文本内容'
        });
    }
}