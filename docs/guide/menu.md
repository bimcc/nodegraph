# 菜单

画布可通过 viewer.addCustomContextMenuFunc() 添加自定义右键菜单

| 参数   | 描述            | 类型       | 可选值 | 默认值 |
|------|---------------|----------|-----|-----|
| func | 返回一个menu对象的方法 | function |     |     |

menu对象

| 参数       | 描述     | 类型       | 可选值 | 默认值 |
|----------|--------|----------|-----|-----|
| label    | 菜单名    | string   |     |     |
| callback | 菜单触发方法 | function |     |     |
| subMenu  | 子菜单    | menu对象   |     |     |

```javascript
const menu = [
    {
        label: '自定义菜单1',
        subMenu: [
            {
                label: '自定义菜单1-1',
                callback: () => {
                }
            }
        ]
    },
    {
        label: '自定义菜单2',
        callback: () => {
        }
    }
]

viewer.addCustomContextMenuFunc(() => {
    return menu
});
```

下面示例鼠标右键显示自定菜单

<iframe src='/demo/addMenu.html' height=350 width=100% frameborder=0 allowfullscreen="true"></iframe>