class HealthManager {
    constructor() {
        this.timers = {
            water: { id: 'water-timer', lastTime: null },
            rest: { id: 'rest-timer', lastTime: null },
            exercise: { id: 'exercise-timer', lastTime: null }
        };
        
        // 从本地存储加载数据
        this.loadData();
        
        // 初始化重置按钮
        this.initResetButtons();
        
        // 启动定时更新
        this.startUpdateTimer();
    }

    loadData() {
        // 从localStorage加载数据
        Object.keys(this.timers).forEach(type => {
            const savedTime = localStorage.getItem(`health_${type}_time`);
            this.timers[type].lastTime = savedTime ? parseInt(savedTime) : Date.now();
        });
    }

    saveData() {
        // 保存数据到localStorage
        Object.keys(this.timers).forEach(type => {
            localStorage.setItem(`health_${type}_time`, this.timers[type].lastTime.toString());
        });
    }

    updateTimers() {
        const now = Date.now();
        
        // 更新所有计时器显示
        Object.keys(this.timers).forEach(type => {
            const timer = this.timers[type];
            const element = document.getElementById(timer.id);
            if (element) {
                const minutes = Math.floor((now - timer.lastTime) / (1000 * 60));
                element.textContent = this.formatTime(minutes);
            }
        });

        // 更新下次休息时间
        this.updateNextBreak();
        
        // 更新状态
        this.updateStatus();
    }

    formatTime(minutes) {
        if (minutes < 60) {
            return `${minutes}分钟`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`;
        }
    }

    updateNextBreak() {
        const restTimer = this.timers.rest;
        const minutesSinceLastRest = Math.floor((Date.now() - restTimer.lastTime) / (1000 * 60));
        const nextBreakElement = document.querySelector('.next-break');
        
        if (minutesSinceLastRest >= 45) {
            nextBreakElement.textContent = '建议立即休息';
            nextBreakElement.style.color = 'var(--google-red)';
        } else {
            const minutesToBreak = 45 - minutesSinceLastRest;
            nextBreakElement.textContent = `${minutesToBreak}分钟后`;
            nextBreakElement.style.color = '';
        }
    }

    updateStatus() {
        const statusElement = document.querySelector('.status');
        const waterMinutes = Math.floor((Date.now() - this.timers.water.lastTime) / (1000 * 60));
        const restMinutes = Math.floor((Date.now() - this.timers.rest.lastTime) / (1000 * 60));
        
        if (waterMinutes > 120 || restMinutes > 45) {
            statusElement.textContent = '需要注意';
            statusElement.style.color = 'var(--google-red)';
        } else {
            statusElement.textContent = '状态良好';
            statusElement.style.color = 'var(--google-green)';
        }
    }

    resetTimer(type) {
        this.timers[type].lastTime = Date.now();
        this.saveData();
        this.updateTimers();
    }

    initResetButtons() {
        const buttons = document.querySelectorAll('.reset-timer');
        buttons.forEach(button => {
            const type = button.dataset.type;
            button.addEventListener('click', () => this.resetTimer(type));
        });
    }

    startUpdateTimer() {
        // 每分钟更新一次
        setInterval(() => this.updateTimers(), 60000);
        // 立即更新一次
        this.updateTimers();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.healthManager = new HealthManager();
}); 