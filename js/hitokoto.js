class HitokotoManager {
    constructor() {
        this.text = document.getElementById('hitokoto-text');
        this.from = document.getElementById('hitokoto-from');
        this.container = document.querySelector('.hitokoto-container');
        this.cache = [];
        this.cacheSize = 5; // 预缓存5条
        this.isLoading = false;
        this.init();
    }

    async init() {
        // 显示本地存储的最后一条
        this.showLastHitokoto();
        // 预加载缓存
        await this.preloadCache();
        // 定时更新
        setInterval(() => this.updateHitokoto(), 30000); // 每30秒更新一次
    }

    showLastHitokoto() {
        const lastHitokoto = localStorage.getItem('lastHitokoto');
        if (lastHitokoto) {
            const data = JSON.parse(lastHitokoto);
            this.updateDisplay(data);
        }
    }

    async preloadCache() {
        try {
            // 并行请求多条一言
            const promises = Array(this.cacheSize).fill().map(() => 
                fetch('https://v1.hitokoto.cn/', {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                    .then(response => response.json())
            );
            
            this.cache = await Promise.all(promises);
        } catch (error) {
            console.error('预加载一言失败:', error);
        }
    }

    async fetchHitokoto() {
        try {
            const response = await fetch('https://v1.hitokoto.cn/', {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('获取一言失败:', error);
            return null;
        }
    }

    async updateHitokoto() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            let hitokoto;
            if (this.cache.length > 0) {
                // 使用缓存的一言
                hitokoto = this.cache.shift();
                // 补充缓存
                this.fetchHitokoto().then(data => {
                    if (data) this.cache.push(data);
                });
            } else {
                // 缓存为空时直接获取
                hitokoto = await this.fetchHitokoto();
            }

            if (hitokoto) {
                this.updateDisplay(hitokoto);
                // 保存到本地存储
                localStorage.setItem('lastHitokoto', JSON.stringify(hitokoto));
            }
        } finally {
            this.isLoading = false;
        }
    }

    updateDisplay(hitokoto) {
        // 添加淡出效果
        this.container.style.opacity = '0';
        
        setTimeout(() => {
            this.text.textContent = hitokoto.hitokoto;
            this.from.textContent = `- 「${hitokoto.from}」`;
            
            // 添加淡入效果
            this.container.style.opacity = '1';
        }, 300);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const hitokotoManager = new HitokotoManager();
}); 