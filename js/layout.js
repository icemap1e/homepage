class LayoutManager {
    constructor() {
        // 确保在 DOM 加载完成后再获取元素
        document.addEventListener('DOMContentLoaded', () => {
            this.container = document.querySelector('.container');
            this.layoutToggle = document.getElementById('layoutToggle');
            this.currentLayout = localStorage.getItem('layout') || 'classic';
            this.init();
        });
    }

    init() {
        if (!this.container || !this.layoutToggle) {
            console.error('Layout elements not found');
            return;
        }

        // 设置初始布局
        this.setLayout(this.currentLayout);
        
        // 设置初始图标
        this.updateLayoutIcon();
        
        // 添加切换事件监听
        this.layoutToggle.addEventListener('click', () => this.toggleLayout());
    }

    setLayout(layout) {
        // 添加过渡类
        this.container.classList.add('layout-transitioning');

        this.currentLayout = layout;
        localStorage.setItem('layout', layout);
        
        // 移除所有布局类
        this.container.classList.remove('classic-layout', 'modern-layout');
        
        // 添加当前布局类
        this.container.classList.add(`${layout}-layout`);
        
        // 更新图标
        this.updateLayoutIcon();

        // 动画结束后移除过渡类
        setTimeout(() => {
            this.container.classList.remove('layout-transitioning');
        }, 500);
    }

    toggleLayout() {
        // 如果正在过渡中，则不执行切换
        if (this.container.classList.contains('layout-transitioning')) {
            return;
        }
        const newLayout = this.currentLayout === 'classic' ? 'modern' : 'classic';
        this.setLayout(newLayout);
    }

    updateLayoutIcon() {
        const icon = this.layoutToggle.querySelector('i');
        icon.textContent = this.currentLayout === 'classic' ? 'dashboard' : 'grid_view';
    }
}

// 创建布局管理器实例
const layoutManager = new LayoutManager(); 