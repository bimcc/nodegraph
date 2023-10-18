const sidebarGuide = () => {
    return [
        {text: '简介', link: 'introduce'},
        {text: '快速上手', link: 'getting-started'},
        {text: '文件结构', link: 'file-structure'},
        {text: '零代码平台', link: 'no-code'},
        {
            text: '基础教程',
            collapsed: false,
            items: [
                {text: '画布', link: 'viewer'},
                {text: '节点', link: 'node'},
                {text: '边', link: 'link'},
                {text: '菜单', link: 'menu'}
            ]
        },
        {
            text: '进阶教程',
            collapsed: false,
            items: [
                {text: '子图', link: 'subGraph'},
                {text: '节点扩展', link: 'nodeExtend'},
                {text: '事件节点', link: 'eventNode'},
                {text: 'widget扩展', link: 'widgetExtend'},
            ]
        },
        {text: '常见问题', link: 'faq'},
        {text: '联系我们', link: 'contact-us'}
    ]
}

const sidebarNetworkApi = () => {
    return [
        {
            text: '画布',
            items: [
                {text: '画布', link: 'viewer-api'},
                {text: '节点', link: 'node-api'},
                {text: '边', link: 'link-api'},
                {text: '插槽', link: 'slot-api'},
            ]
        }
    ]
}

const sidebarReference = () => {
    return [
        {
            text: '案列演示',
            link: 'demo'
        }
    ]
}


export default {
    // site-level options
    title: '飞椽蓝图引擎',
    description: '飞椽蓝图引擎',

    head: [
        ['link', {rel: 'icon', type: 'image+xml', href: '/logo.svg'}],
        ['link', {rel: 'icon', href: '/favicon.ico'}],
    ],
    themeConfig: {
        logo: {src: '/feichuan.png'},

        nav: [
            {
                text: '主页',
                link: '/',
            },
            {
                text: '项目指南',
                link: '/guide/introduce',
                activeMatch: '/guide/'
            },
            {
                text: '蓝图API',
                link: '/refsapi/properties',
                activeMatch: '/refsapi/'
            },
            {
                text: '案例演示',
                link: '/reference/demo',
                activeMatch: '/reference/'
            },
            {
                text: '相关连接',
                items: [
                    {
                        text: '预览地址',
                        link: 'https://gantt.bimcc.net/'
                    },
                    {
                        text: '项目源码',
                        link: 'https://github.com/zw12579/gantt-planing-react'
                    },
                    {
                        text: '发布计划',
                        link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
                    },
                    {
                        text: '更新日志',
                        link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
                    },
                ]
            },
            {
                text: '生态产品',
                items: [
                    {
                        text: '飞椽UI组件库',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '飞椽零代码(SaaS)',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '数据智仓(中台)',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '页面编辑器',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '大屏(PPT)编辑器',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '场景(BIMGIS)编辑器',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '节点蓝图引擎',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '网络图引擎',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '在线Excel表格',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '智能表格',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '思维导图SDK',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '飞椽IMSDK',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '水印相机SDK',
                        link: 'https://www.bimcc.com/'
                    },
                    {
                        text: '720全景云',
                        link: 'https://www.bimcc.com/'
                    },
                ]
            },
            {
                text: '赞助',
                link: '/donate/what-is-vitepress',
                activeMatch: '/donate/'
            },
        ],

        sidebar: {
            '/guide/': {base: '/guide/', items: sidebarGuide()},
            '/refsapi/': {base: '/refsapi/', items: sidebarNetworkApi()},
            '/reference/': {base: '/reference/', items: sidebarReference()}
        },

        // editLink: {
        //   pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
        //   text: 'Edit this page on GitHub'
        // },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/zw12579/gantt-planing-react'},
            {
                icon: {
                    svg: '<svg t="1691646778219" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3993" width="20" height="20"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="3994"></path></svg>'
                },
                link: 'https://gitee.com/zw12579/gantt-network'
            },
            {
                icon: {
                    svg: '<svg t="1691750301825" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8832" width="200" height="200"><path d="M511.09761 957.257c-80.159 0-153.737-25.019-201.11-62.386-24.057 6.702-54.831 17.489-74.252 30.864-16.617 11.439-14.546 23.106-11.55 27.816 13.15 20.689 225.583 13.211 286.912 6.767v-3.061z" fill="#FAAD08" p-id="8833"></path><path d="M496.65061 957.257c80.157 0 153.737-25.019 201.11-62.386 24.057 6.702 54.83 17.489 74.253 30.864 16.616 11.439 14.543 23.106 11.55 27.816-13.15 20.689-225.584 13.211-286.914 6.767v-3.061z" fill="#FAAD08" p-id="8834"></path><path d="M497.12861 474.524c131.934-0.876 237.669-25.783 273.497-35.34 8.541-2.28 13.11-6.364 13.11-6.364 0.03-1.172 0.542-20.952 0.542-31.155C784.27761 229.833 701.12561 57.173 496.64061 57.162 292.15661 57.173 209.00061 229.832 209.00061 401.665c0 10.203 0.516 29.983 0.547 31.155 0 0 3.717 3.821 10.529 5.67 33.078 8.98 140.803 35.139 276.08 36.034h0.972z" fill="#000000" p-id="8835"></path><path d="M860.28261 619.782c-8.12-26.086-19.204-56.506-30.427-85.72 0 0-6.456-0.795-9.718 0.148-100.71 29.205-222.773 47.818-315.792 46.695h-0.962C410.88561 582.017 289.65061 563.617 189.27961 534.698 185.44461 533.595 177.87261 534.063 177.87261 534.063 166.64961 563.276 155.56661 593.696 147.44761 619.782 108.72961 744.168 121.27261 795.644 130.82461 796.798c20.496 2.474 79.78-93.637 79.78-93.637 0 97.66 88.324 247.617 290.576 248.996a718.01 718.01 0 0 1 5.367 0C708.80161 950.778 797.12261 800.822 797.12261 703.162c0 0 59.284 96.111 79.783 93.637 9.55-1.154 22.093-52.63-16.623-177.017" fill="#000000" p-id="8836"></path><path d="M434.38261 316.917c-27.9 1.24-51.745-30.106-53.24-69.956-1.518-39.877 19.858-73.207 47.764-74.454 27.875-1.224 51.703 30.109 53.218 69.974 1.527 39.877-19.853 73.2-47.742 74.436m206.67-69.956c-1.494 39.85-25.34 71.194-53.24 69.956-27.888-1.238-49.269-34.559-47.742-74.435 1.513-39.868 25.341-71.201 53.216-69.974 27.909 1.247 49.285 34.576 47.767 74.453" fill="#FFFFFF" p-id="8837"></path><path d="M683.94261 368.627c-7.323-17.609-81.062-37.227-172.353-37.227h-0.98c-91.29 0-165.031 19.618-172.352 37.227a6.244 6.244 0 0 0-0.535 2.505c0 1.269 0.393 2.414 1.006 3.386 6.168 9.765 88.054 58.018 171.882 58.018h0.98c83.827 0 165.71-48.25 171.881-58.016a6.352 6.352 0 0 0 1.002-3.395c0-0.897-0.2-1.736-0.531-2.498" fill="#FAAD08" p-id="8838"></path><path d="M467.63161 256.377c1.26 15.886-7.377 30-19.266 31.542-11.907 1.544-22.569-10.083-23.836-25.978-1.243-15.895 7.381-30.008 19.25-31.538 11.927-1.549 22.607 10.088 23.852 25.974m73.097 7.935c2.533-4.118 19.827-25.77 55.62-17.886 9.401 2.07 13.75 5.116 14.668 6.316 1.355 1.77 1.726 4.29 0.352 7.684-2.722 6.725-8.338 6.542-11.454 5.226-2.01-0.85-26.94-15.889-49.905 6.553-1.579 1.545-4.405 2.074-7.085 0.242-2.678-1.834-3.786-5.553-2.196-8.135" fill="#000000" p-id="8839"></path><path d="M504.33261 584.495h-0.967c-63.568 0.752-140.646-7.504-215.286-21.92-6.391 36.262-10.25 81.838-6.936 136.196 8.37 137.384 91.62 223.736 220.118 224.996H506.48461c128.498-1.26 211.748-87.612 220.12-224.996 3.314-54.362-0.547-99.938-6.94-136.203-74.654 14.423-151.745 22.684-215.332 21.927" fill="#FFFFFF" p-id="8840"></path><path d="M323.27461 577.016v137.468s64.957 12.705 130.031 3.91V591.59c-41.225-2.262-85.688-7.304-130.031-14.574" fill="#EB1C26" p-id="8841"></path><path d="M788.09761 432.536s-121.98 40.387-283.743 41.539h-0.962c-161.497-1.147-283.328-41.401-283.744-41.539l-40.854 106.952c102.186 32.31 228.837 53.135 324.598 51.926l0.96-0.002c95.768 1.216 222.4-19.61 324.6-51.924l-40.855-106.952z" fill="#EB1C26" p-id="8842"></path></svg>'
                },
                link: 'https://qm.qq.com/cgi-bin/qm/qr?k=XTjkqjV1KynFoEAdrqxMd6i71-TtCVGV&jump_from=webapi'
            }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2022 - present 重庆市筑云科技有限责任公司'
        },

        search: {
            provider: 'algolia',
            options: {
                appId: '8J64VVRP8K',
                apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
                indexName: 'vitepress'
            }
        },

        carbonAds: {
            code: 'CEBDT27Y',
            placement: 'vuejsorg'
        }
    }
}
