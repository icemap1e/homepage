class WeatherManager {
    constructor() {
        this.container = document.querySelector('.weather-card');
        this.cityElement = document.querySelector('.weather-info .city');
        this.tempElement = document.querySelector('.weather-info .temperature');
        this.descElement = document.querySelector('.weather-info .description');
        this.refreshButton = document.getElementById('refresh-location');
        
        this.init();
    }

    async init() {
        // 添加刷新按钮事件监听
        this.refreshButton.addEventListener('click', () => this.refreshWeather());
        
        // 尝试获取天气信息
        await this.getWeather();
        
        // 每30分钟自动更新一次
        setInterval(() => this.getWeather(), 30 * 60 * 1000);
    }

    async getWeather() {
        try {
            // 先获取位置信息
            const location = await this.getLocation();
            if (!location) {
                throw new Error('无法获取位置信息');
            }

            // 获取城市信息
            const cityData = await this.getCityInfo(location.lat, location.lon);
            if (!cityData) {
                throw new Error('无法获取城市信息');
            }

            // 获取天气信息
            const weatherData = await this.getWeatherInfo(location.lat, location.lon);
            if (!weatherData) {
                throw new Error('无法获取天气信息');
            }

            // 更新显示
            this.updateDisplay(cityData, weatherData);
            
            // 保存位置信息
            localStorage.setItem('weatherLocation', JSON.stringify(location));
        } catch (error) {
            console.error('获取天气信息失败:', error);
            this.showError();
        }
    }

    async getLocation() {
        // 先尝试获取保存的位置
        const savedLocation = localStorage.getItem('weatherLocation');
        if (savedLocation) {
            return JSON.parse(savedLocation);
        }

        // 如果没有保存的位置，使用默认位置
        return CONFIG.defaults.weatherCity;
    }

    async getCityInfo(lat, lon) {
        try {
            const response = await fetch(`${CONFIG.weather.geoUrl}?location=${lon},${lat}&key=${CONFIG.weather.apiKey}`, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.code === '200' && data.location && data.location[0]) {
                return data.location[0];
            }
            return null;
        } catch (error) {
            console.error('获取城市信息失败:', error);
            return null;
        }
    }

    async getWeatherInfo(lat, lon) {
        try {
            const response = await fetch(`${CONFIG.weather.apiUrl}?location=${lon},${lat}&key=${CONFIG.weather.apiKey}`, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.code === '200' && data.now) {
                return data.now;
            }
            return null;
        } catch (error) {
            console.error('获取天气信息失败:', error);
            return null;
        }
    }

    updateDisplay(cityData, weatherData) {
        if (this.cityElement) {
            this.cityElement.textContent = cityData.name;
        }
        if (this.tempElement) {
            this.tempElement.textContent = `${weatherData.temp}°C`;
        }
        if (this.descElement) {
            this.descElement.textContent = weatherData.text;
        }
    }

    showError() {
        if (this.cityElement) {
            this.cityElement.textContent = '定位失败';
        }
        if (this.tempElement) {
            this.tempElement.textContent = '--°C';
        }
        if (this.descElement) {
            this.descElement.textContent = '无法获取天气信息';
        }
    }

    async refreshWeather() {
        // 清除保存的位置信息
        localStorage.removeItem('weatherLocation');
        // 重新获取天气
        await this.getWeather();
    }
}

// 初始化天气管理器
document.addEventListener('DOMContentLoaded', () => {
    const weatherManager = new WeatherManager();
}); 