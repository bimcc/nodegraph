# 文件结构

```
src 源码
    |-core 数据核心层
        |- graph 蓝图数据结构（数据层）
            |- nodes 默认节点文件夹继承自Node
            |- DataTypeManager.ts 数据类型管理器，管理输入输出注册的类型
            |- Graph.ts 蓝图数据实例类
            |- Link.ts 连接线实例类
            |- Node.ts 节点实例类
            |- NodeManager.ts 节点管理类，用于处理所有和节点有关的操作
            |- NodeSlot.ts 插槽类文件
        |- interfaces 数据接口类文件夹
        |- types 数据枚举类文件夹
    |- events 封装的事件类文件夹
    |- interfaces 全局接口类文件夹
    |- types 全局枚举类文件夹
    |- manangers 管理器类文件夹用于管理整体渲染
        |- DomManager.ts 使用DOM来渲染的管理器，分配渲染到render实现接口 INodeManager
        |- SvgManager.ts 使用SVG来渲染的管理器，分配渲染到render实现接口 ILinkeManager
    |- renders 渲染器文件夹渲染单个目标例如单个node
        |- DomRender.ts 使用DOM来负责渲染单个node节点 实现接口INodeRender
        |- SvgRender.ts 使用SVG来负责渲染单个link     实现接口ILinkRender
    |- shared 共享文件夹
        |- UI UI基类文件夹
    |- viewer 蓝图实例文件夹
        |- GraphViewer.ts 蓝图实例类 事件在此类中分配给不同manager
        |- GraphEvents.ts 蓝图事件类 只负责触发事件不负责处理事件

```

