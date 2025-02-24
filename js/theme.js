class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        this.updateThemeIcon(savedTheme === 'dark');

        // 添加切换事件监听器
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
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

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
}); 