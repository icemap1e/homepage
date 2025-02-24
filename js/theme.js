class ThemeManager {
    constructor() {
        // 确保在 DOM 加载完成后再获取元素和初始化
        document.addEventListener('DOMContentLoaded', () => {
            this.themeToggle = document.getElementById('theme-toggle');
            if (!this.themeToggle) {
                console.error('Theme toggle button not found');
                return;
            }
            this.init();
        });
    }

    init() {
        // 检查本地存储中的主题设置
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
        // 应用主题
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        this.updateThemeIcon(savedTheme === 'dark');

        // 添加切换事件监听器
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const isDark = !document.body.classList.contains('dark-theme');
        this.setTheme(isDark ? 'dark' : 'light');
    }

    setTheme(theme) {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateThemeIcon(isDark);
    }

    updateThemeIcon(isDark) {
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
    }
}

// 创建主题管理器实例
const themeManager = new ThemeManager(); 