class ShortcutsManager {
    constructor() {
        // 确保在 DOM 加载完成后再获取元素
        document.addEventListener('DOMContentLoaded', () => {
            this.container = document.getElementById('shortcuts-grid');
            this.colors = [
                { color: 'var(--google-blue)', bg: 'rgba(66, 133, 244, 0.1)' },
                { color: 'var(--google-red)', bg: 'rgba(219, 68, 55, 0.1)' },
                { color: 'var(--google-yellow)', bg: 'rgba(244, 180, 0, 0.1)' },
                { color: 'var(--google-green)', bg: 'rgba(15, 157, 88, 0.1)' }
            ];
            this.currentMode = localStorage.getItem('mode') || CONFIG.defaults.mode;
            this.init();
        });
    }

    init() {
        if (!this.container) {
            console.error('Shortcuts container not found');
            return;
        }

        this.renderShortcuts();
        this.setupHoverEffects();
        this.initModeToggle();
        document.body.classList.add(`${this.currentMode}-mode`);
    }

    renderShortcuts() {
        const shortcuts = this.currentMode === 'work' ? CONFIG.workShortcuts : CONFIG.leisureShortcuts;
        this.container.innerHTML = shortcuts.map(shortcut => `
            <a href="${shortcut.url}" 
               class="shortcut-card"
               target="_blank">
                <span class="material-icons">${shortcut.icon}</span>
                <h3>${shortcut.title}</h3>
            </a>
        `).join('');
    }

    setupHoverEffects() {
        const cards = document.querySelectorAll('.shortcut-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                card.style.setProperty('--hover-color', randomColor.color);
                card.style.setProperty('--hover-bg', randomColor.bg);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.removeProperty('--hover-color');
                card.style.removeProperty('--hover-bg');
            });
        });
    }

    toggleMode() {
        const ANIMATION_DURATION = 600; // 总动画时长
        const COLOR_CHANGE_DELAY = 300; // 颜色变化延迟

        // 添加翻页动画
        this.container.classList.add('switching-mode');

        // 获取所有卡片，包括时间卡片
        const cards = [
            ...document.querySelectorAll('.shortcut-card'),
            ...document.querySelectorAll('.time-card'),
            ...document.querySelectorAll('.weather-card'),
            ...document.querySelectorAll('.health-card'),
            ...document.querySelectorAll('.memo-card'),
            document.querySelector('#time-display'), // 时间卡片的容器ID
        ].filter(Boolean); // 过滤掉不存在的元素

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('card-flipping');
            }, index * 50);
        });

        // 等待动画完成后更新内容
        setTimeout(() => {
            this.renderShortcuts();
            this.setupHoverEffects();
            
            // 移除动画类
            this.container.classList.remove('switching-mode');
            cards.forEach(card => {
                card.classList.remove('card-flipping');
            });
        }, ANIMATION_DURATION);

        // 在翻转到背面时切换模式（确保颜色变化在卡片不可见时发生）
        setTimeout(() => {
            document.body.classList.remove(`${this.currentMode}-mode`);
            this.currentMode = this.currentMode === 'work' ? 'leisure' : 'work';
            localStorage.setItem('mode', this.currentMode);
            document.body.classList.add(`${this.currentMode}-mode`);
            
            const modeIcon = document.querySelector('#modeToggle i');
            modeIcon.textContent = this.currentMode === 'work' ? 'work' : 'weekend';
        }, COLOR_CHANGE_DELAY);
    }

    initModeToggle() {
        const modeToggle = document.getElementById('modeToggle');
        if (!modeToggle) return;

        const modeIcon = modeToggle.querySelector('i');
        if (modeIcon) {
            modeIcon.textContent = this.currentMode === 'work' ? 'work' : 'weekend';
        }
        
        modeToggle.addEventListener('click', () => {
            this.toggleMode();
        });
    }
}

// 创建快捷方式管理器实例
const shortcutsManager = new ShortcutsManager();

// 在创建快捷方式卡片时添加随机主题色
function createShortcutCard(shortcut) {
    const card = document.createElement('a');
    card.href = shortcut.url;
    card.className = 'shortcut-card ' + getRandomThemeClass();
    card.target = '_blank';
    
    // ... 其他卡片创建代码 ...
}

// 获取随机主题色类名
function getRandomThemeClass() {
    const themes = ['theme-blue', 'theme-red', 'theme-yellow', 'theme-green'];
    return themes[Math.floor(Math.random() * themes.length)];
}

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Alt + 数字键快速切换搜索引擎
    if (e.altKey && !isNaN(e.key)) {
        const engines = Object.keys(CONFIG.searchEngines);
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < engines.length) {
            // 切换搜索引擎
            const engineKey = engines[index];
            searchManager.switchEngine(engineKey);
        }
    }
    
    // Ctrl + / 聚焦搜索框
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Alt + T 切换主题
    if (e.altKey && e.key === 't') {
        document.getElementById('theme-toggle').click();
    }
    
    // Alt + M 切换模式
    if (e.altKey && e.key === 'm') {
        document.getElementById('modeToggle').click();
    }
}); 