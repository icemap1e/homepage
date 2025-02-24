const CONFIG = {
    // 搜索引擎配置
    searchEngines: {
        baidu: {
            name: '百度',
            url: 'https://www.baidu.com/s?wd=',
            icon: './assets/icons/baidu.ico'
        },
        google: {
            name: 'Google',
            url: 'https://www.google.com/search?q=',
            icon: './assets/icons/google.ico'
        },
        bing: {
            name: 'Bing',
            url: 'https://www.bing.com/search?q=',
            icon: './assets/icons/bing.ico'
        },
        duckduckgo: {
            name: 'DuckDuckGo',
            url: 'https://duckduckgo.com/?q=',
            icon: './assets/icons/duckduckgo.ico'
        },
        sogou: {
            name: '搜狗',
            url: 'https://www.sogou.com/web?query=',
            icon: './assets/icons/sogou.ico'
        }
    },

    // 默认设置
    defaults: {
        searchEngine: 'baidu',
        theme: 'light',
        weatherCity: {
            lat: 39.9042,
            lon: 116.4074,
            name: '北京'
        },
        hasRequestedLocation: false,
        userLocation: null,
        mode: 'leisure' // 默认模式
    },

    // 默认快捷方式 - 工作模式
    workShortcuts: [
        {
            id: 'work-1',
            title: '企业邮箱',
            url: 'https://mail.qiye.163.com/static/login/',
            icon: 'mail'
        },
        {
            id: 'work-2',
            title: 'GitHub',
            url: 'https://github.com',
            icon: 'code'
        },
        {
            id: 'work-3',
            title: 'ChatGPT',
            url: 'https://chat.openai.com/chat',
            icon: 'chat'
        },
        {
            id: 'work-4',
            title: '百度翻译',
            url: 'https://fanyi.baidu.com/mtpe-individual/multimodal?query=%E7%BF%BB%E8%AF%91&lang=en2zh',
            icon: 'translate'
        },
        {
            id: 'work-5',
            title: 'V2EX',
            url: 'https://www.v2ex.com/',
            icon: 'forum'
        },
        {
            id: 'work-6',
            title: '在线学习',
            url: 'https://momoyu.cc/',
            icon: 'sailing'
        }
    ],

    // 娱乐模式快捷方式
    leisureShortcuts: [
        {
            id: 'leisure-1',
            title: '哔哩哔哩',
            url: 'https://www.bilibili.com',
            icon: 'smart_display'
        },
        {
            id: 'leisure-2',
            title: '优酷',
            url: 'https://youku.com/',
            icon: 'share'
        },
        {
            id: 'leisure-3',
            title: 'YouTube',
            url: 'https://www.youtube.com/',
            icon: 'movie'
        },
        {
            id: 'leisure-4',
            title: 'NAS',
            url: 'https://192.168.123.106:5001/',
            icon: 'storage'
        },
        {
            id: 'leisure-5',
            title: '微博',
            url: 'https://weibo.com',
            icon: 'public'
        },
        {
            id: 'leisure-6',
            title: '豆瓣',
            url: 'https://www.douban.com',
            icon: 'star'
        }
    ],

    // 天气 API 配置
    weather: {
        apiKey: '384bcd9d290047a58b50968af59704ad',
        apiUrl: 'https://devapi.qweather.com/v7/weather/now',
        geoUrl: 'https://geoapi.qweather.com/v2/city/lookup'
    }
}; 