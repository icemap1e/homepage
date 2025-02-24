class TimeManager {
    constructor() {
        this.festivals = {
            '1-1': '元旦',
            '2-14': '情人节',
            '5-1': '劳动节',
            '6-1': '儿童节',
            '10-1': '国庆节',
            '12-25': '圣诞节',
            // 农历节日
            'lunar-1-1': '春节',
            'lunar-5-5': '端午节',
            'lunar-8-15': '中秋节',
            // 可以继续添加更多节日
        };
        this.solarTerms = [
            { name: '立春', month: 2, day: 4 },
            { name: '雨水', month: 2, day: 19 },
            { name: '惊蛰', month: 3, day: 6 },
            { name: '春分', month: 3, day: 21 },
            { name: '清明', month: 4, day: 5 },
            { name: '谷雨', month: 4, day: 20 },
            { name: '立夏', month: 5, day: 6 },
            { name: '小满', month: 5, day: 21 },
            { name: '芒种', month: 6, day: 6 },
            { name: '夏至', month: 6, day: 21 },
            { name: '小暑', month: 7, day: 7 },
            { name: '大暑', month: 7, day: 23 },
            { name: '立秋', month: 8, day: 8 },
            { name: '处暑', month: 8, day: 23 },
            { name: '白露', month: 9, day: 8 },
            { name: '秋分', month: 9, day: 23 },
            { name: '寒露', month: 10, day: 8 },
            { name: '霜降', month: 10, day: 24 },
            { name: '立冬', month: 11, day: 7 },
            { name: '小雪', month: 11, day: 22 },
            { name: '大雪', month: 12, day: 7 },
            { name: '冬至', month: 12, day: 22 },
        ];
        this.timeCard = document.getElementById('time-card');
        this.init();
    }

    init() {
        this.updateTime();
        // 每秒更新一次时间
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const dateStr = this.formatDate(now);
        const timeStr = this.formatTime(now);
        const weekStr = this.formatWeek(now);
        const lunarDate = this.getLunarDate(now);
        const solarTerms = this.getSolarTerms(now);

        const timeInfo = this.timeCard.querySelector('.time-info');
        const calendar = this.timeCard.querySelector('.calendar');

        if (timeInfo) {
            timeInfo.innerHTML = `
                <h3 class="date">${dateStr}</h3>
                <p class="time">${timeStr}</p>
                <p class="week">${weekStr}</p>
            `;
        }
        
        if (calendar) {
            const items = calendar.querySelectorAll('.calendar-item span:last-child');
            if (items.length >= 2) {
                items[0].textContent = `农历: ${lunarDate}`;
                items[1].textContent = `节气: ${solarTerms}`;
            }
        }

        // 更新节日信息
        const festivalInfo = this.getFestivalInfo(now);
        document.getElementById('festival').textContent = festivalInfo;
        
        // 更新下班时间
        const offWorkTime = this.getOffWorkTime(now);
        document.getElementById('off-work').textContent = offWorkTime;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    formatWeek(date) {
        const weeks = ['日', '一', '二', '三', '四', '五', '六'];
        return `星期${weeks[date.getDay()]}`;
    }

    getLunarDate(date) {
        try {
            const lunar = Lunar.fromDate(date);
            return `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
        } catch (error) {
            console.error('获取农历日期失败:', error);
            return '获取失败';
        }
    }

    getSolarTerms(date) {
        try {
            const currentMonth = date.getMonth() + 1;
            const currentDay = date.getDate();
            
            // 检查今天是否是节气
            const todayTerm = this.solarTerms.find(term => 
                term.month === currentMonth && term.day === currentDay
            );
            
            if (todayTerm) {
                return todayTerm.name;
            }
            
            // 查找下一个节气
            let nextTerm = this.solarTerms.find(term => 
                (term.month === currentMonth && term.day > currentDay) ||
                term.month > currentMonth
            );
            
            // 如果今年没有下一个节气了，取下一年的第一个节气
            if (!nextTerm) {
                nextTerm = this.solarTerms[0];
            }
            
            // 计算到下一个节气的天数
            const nextTermDate = new Date(date.getFullYear(), nextTerm.month - 1, nextTerm.day);
            if (nextTermDate < date) {
                nextTermDate.setFullYear(date.getFullYear() + 1);
            }
            
            const diffTime = nextTermDate.getTime() - date.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return `距${nextTerm.name}还有${diffDays}天`;
        } catch (error) {
            console.error('获取节气失败:', error);
            return '获取失败';
        }
    }

    getFestivalInfo(date) {
        try {
            const today = `${date.getMonth() + 1}-${date.getDate()}`;
            
            // 检查今天是否是公历节日
            if (this.festivals[today]) {
                return `今天是${this.festivals[today]}`;
            }

            // 检查今天是否是农历节日
            const lunar = Lunar.fromDate(date);
            const lunarDate = `lunar-${lunar.getMonth()}-${lunar.getDay()}`;
            if (this.festivals[lunarDate]) {
                return `今天是${this.festivals[lunarDate]}`;
            }

            // 查找最近的公历节日
            let nearestFestival = null;
            let minDays = Infinity;

            // 遍历所有公历节日
            Object.entries(this.festivals).forEach(([dateStr, name]) => {
                if (dateStr.startsWith('lunar-')) return;

                const [month, day] = dateStr.split('-').map(Number);
                let festivalDate = new Date(date.getFullYear(), month - 1, day);
                
                // 如果节日已过，看明年的日期
                if (festivalDate < date) {
                    festivalDate.setFullYear(date.getFullYear() + 1);
                }
                
                const diffDays = Math.ceil((festivalDate - date) / (1000 * 60 * 60 * 24));
                if (diffDays < minDays) {
                    minDays = diffDays;
                    nearestFestival = name;
                }
            });

            return `距${nearestFestival}还有${minDays}天`;
        } catch (error) {
            console.error('获取节日信息失败:', error);
            return '获取失败';
        }
    }

    getOffWorkTime(date) {
        // 如果是周末
        if (date.getDay() === 0 || date.getDay() === 6) {
            return '享受周末';
        }

        const now = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
        const offWork = 17 * 3600; // 17:00
        
        // 如果已经下班
        if (now >= offWork) {
            return '已经下班啦';
        }
        
        // 如果还没上班
        if (now < 9 * 3600) { // 9:00
            return '还没上班呢';
        }
        
        // 计算剩余时间
        const remainSeconds = offWork - now;
        const hours = Math.floor(remainSeconds / 3600);
        const minutes = Math.floor((remainSeconds % 3600) / 60);
        const seconds = remainSeconds % 60;
        
        return `还剩${hours}小时${minutes}分${seconds}秒下班`;
    }
}

// 初始化时间管理器
const timeManager = new TimeManager(); 