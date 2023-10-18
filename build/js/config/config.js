/*
 * @Date: 2023-08-07 11:40:54
 * @LastEditors: lisushuang
 * @LastEditTime: 2023-09-22 17:42:25
 * @FilePath: /graph/src/config/config.ts
 */
class BaseConfig {
    constructor() {
        Object.defineProperty(this, "zIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        }); // 初始层级
        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                NodeHighLightColor: "#FFD700",
                NodeRunningColor: "#00FF00",
                LineRunningColor: "#00FF00",
                NodeEventColor: "#00BFFF",
                NodeTitleColor: "#363636",
                NodeFontColor: "#ffffff",
                NodeBackgroundColor: "#4b4b4b", // 节点背景色
            }
        });
        /**
         * @description: 新增节点时是否随机一个颜色，已设置固定颜色的除外
         */
        Object.defineProperty(this, "createRandomStyleNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        // 节点可用风格
        Object.defineProperty(this, "nodeStyles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                { name: '默认', nodeColor: 'rgb(75, 75, 75)', nodeTitleColor: 'rgb(54, 54, 54)', nodeFontColor: 'rgb(255, 255, 255)' },
                // { name: '红色', nodeColor: '#f22233', nodeTitleColor: '#332222', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '棕色', nodeColor: '#593930', nodeTitleColor: '#332922', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '绿色', nodeColor: '#335533', nodeTitleColor: '#223322', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '蓝色', nodeColor: '#333355', nodeTitleColor: '#222233', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '浅蓝色', nodeColor: '#3F5159', nodeTitleColor: '#2A3638', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '蓝绿色', nodeColor: '#335555', nodeTitleColor: '#223333', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '紫色', nodeColor: '#553355', nodeTitleColor: '#332233', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '黄色', nodeColor: '#665533', nodeTitleColor: '#443322', nodeFontColor: 'rgb(255, 255, 255)' },
                { name: '黑色', nodeColor: '#000000', nodeTitleColor: '#222222', nodeFontColor: 'rgb(255, 255, 255)' },
                { "name": "深蓝色", "nodeColor": "#001f3f", "nodeTitleColor": "#0074D9", "nodeFontColor": "#FFFFFF" },
                { "name": "橙色", "nodeColor": "#FF851B", "nodeTitleColor": "#FF4136", "nodeFontColor": "#FFFFFF" },
                { "name": "紫红色", "nodeColor": "#D5008F", "nodeTitleColor": "#FF0066", "nodeFontColor": "#FFFFFF" },
                { "name": "柔和粉红", "nodeColor": "#FFC0CB", "nodeTitleColor": "#FF69B4", "nodeFontColor": "#000000" },
                { "name": "海洋蓝", "nodeColor": "#0077B6", "nodeTitleColor": "#00A8CC", "nodeFontColor": "#FFFFFF" },
                { "name": "阳光黄", "nodeColor": "#FFD700", "nodeTitleColor": "#FFA500", "nodeFontColor": "#000000" },
                { "name": "青草绿", "nodeColor": "#7CB518", "nodeTitleColor": "#4B830D", "nodeFontColor": "#FFFFFF" },
                { "name": "玫瑰金", "nodeColor": "#E91E63", "nodeTitleColor": "#FF5722", "nodeFontColor": "#FFFFFF" },
                { "name": "宁静紫", "nodeColor": "#8E44AD", "nodeTitleColor": "#9B59B6", "nodeFontColor": "#FFFFFF" },
            ]
        });
        Object.defineProperty(this, "showGraphInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    getRandomColor() {
        const index = parseInt((Math.random() * this.nodeStyles.length).toString());
        return this.nodeStyles[index];
    }
}
export const config = new BaseConfig();
