class SearchManager {
    constructor() {
        this.searchEngines = CONFIG.searchEngines;
        // 允许用户覆盖默认搜索引擎
        this.currentEngine = localStorage.getItem('searchEngine') || CONFIG.defaults.searchEngine;
        this.init();
    }

    init() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.engineDropdown = document.getElementById('engine-dropdown');
        this.engineButton = document.getElementById('current-engine');
        
        this.updateEngineDisplay();
        this.bindEvents();
        this.createEngineDropdown();
    }

    bindEvents() {
        // 搜索按钮点击事件
        this.searchButton.addEventListener('click', () => this.performSearch());
        
        // 输入框事件
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        
        // 添加输入事件监听
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // 搜索引擎切换按钮点击事件
        this.engineButton.addEventListener('click', () => {
            this.engineDropdown.classList.toggle('show');
        });

        // 点击其他地方关闭下拉菜单和建议列表
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-engine-selector')) {
                this.engineDropdown.classList.remove('show');
            }
            const suggestionsContainer = document.getElementById('suggestions');
            if (e.target !== this.searchInput && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    createEngineDropdown() {
        this.engineDropdown.innerHTML = Object.entries(this.searchEngines)
            .map(([key, engine]) => `
                <div class="engine-option" data-engine="${key}">
                    <img src="${engine.icon}" alt="${engine.name}">
                </div>
            `).join('');

        // 为每个选项添加点击事件
        this.engineDropdown.querySelectorAll('.engine-option').forEach(option => {
            option.addEventListener('click', () => {
                const engineKey = option.dataset.engine;
                this.setSearchEngine(engineKey);
                this.engineDropdown.classList.remove('show');
            });
        });
    }

    setSearchEngine(engineKey) {
        this.currentEngine = engineKey;
        localStorage.setItem('searchEngine', engineKey);
        this.updateEngineDisplay();
    }

    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            const searchUrl = this.searchEngines[this.currentEngine].url + encodeURIComponent(query);
            window.location.href = searchUrl;
        }
    }

    updateEngineDisplay() {
        const engine = this.searchEngines[this.currentEngine];
        document.getElementById('engine-icon').src = engine.icon;
        document.getElementById('engine-icon').alt = engine.name;
    }

    async handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        const suggestionsContainer = document.getElementById('suggestions');

        // 清空建议列表
        suggestionsContainer.innerHTML = '';

        if (searchTerm.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        try {
            // 创建 JSONP 回调函数
            window.baiduSuggCallback = (data) => {
                const suggestions = data.s;
                
                if (suggestions && suggestions.length > 0) {
                    suggestionsContainer.style.display = 'block';
                    suggestions.forEach(suggestion => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.textContent = suggestion;
                        div.onclick = () => {
                            this.searchInput.value = suggestion;
                            suggestionsContainer.style.display = 'none';
                            this.performSearch();
                        };
                        suggestionsContainer.appendChild(div);
                    });
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            };

            // 创建并添加 script 标签
            const script = document.createElement('script');
            script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(searchTerm)}&cb=baiduSuggCallback`;
            document.body.appendChild(script);

            // 清理 script 标签
            script.onload = () => {
                document.body.removeChild(script);
            };
        } catch (error) {
            console.error('获取搜索建议失败:', error);
            suggestionsContainer.style.display = 'none';
        }
    }
}

// 初始化搜索管理器
const searchManager = new SearchManager(); 