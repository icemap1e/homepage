class WeatherManager {
    constructor() {
        this.apiKey = CONFIG.weather.apiKey;
        this.weatherCard = document.getElementById('weather-card');
        this.userSettings = {
            hasRequestedLocation: localStorage.getItem('hasRequestedLocation') === 'true',
            userLocation: JSON.parse(localStorage.getItem('userLocation'))
        };
        
        this.init();
    }

    init() {
        // 绑定刷新按钮事件
        document.getElementById('refresh-location')?.addEventListener('click', () => {
            this.refreshLocation();
        });

        if (this.userSettings.userLocation) {
            // 如果已有用户位置信息，直接使用
            const { lat, lon } = this.userSettings.userLocation;
            this.fetchWeather(lat, lon);
        } else if (!this.userSettings.hasRequestedLocation) {
            // 如果从未请求过位置权限，请求一次
            this.getLocation()
                .then(position => {
                    // 保存用户位置
                    const userLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    localStorage.setItem('userLocation', JSON.stringify(userLocation));
                    localStorage.setItem('hasRequestedLocation', 'true');
                    this.fetchWeather(position.coords.latitude, position.coords.longitude);
                })
                .catch(() => {
                    // 如果获取位置失败，使用默认城市
                    const defaultCity = CONFIG.defaults.weatherCity;
                    this.fetchWeather(defaultCity.lat, defaultCity.lon);
                });
        } else {
            // 如果之前请求失败过，直接使用默认城市
            const defaultCity = CONFIG.defaults.weatherCity;
            this.fetchWeather(defaultCity.lat, defaultCity.lon);
        }
    }

    getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持地理位置'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    async fetchWeather(lat, lon) {
        try {
            // 先通过经纬度获取城市信息
            const cityResponse = await fetch(
                `${CONFIG.weather.geoUrl}?location=${lon},${lat}&key=${this.apiKey}`
            );
            
            if (!cityResponse.ok) throw new Error('城市信息获取失败');
            
            const cityData = await cityResponse.json();
            if (cityData.code !== '200' || !cityData.location?.[0]) {
                throw new Error('城市信息解析失败');
            }

            const cityId = cityData.location[0].id;
            const cityName = cityData.location[0].name;
            
            // 获取天气信息
            const response = await fetch(
                `${CONFIG.weather.apiUrl}?location=${cityId}&key=${this.apiKey}`
            );
            
            if (!response.ok) throw new Error('天气数据获取失败');
            
            const data = await response.json();
            if (data.code !== '200') {
                throw new Error('天气数据解析失败');
            }

            this.updateWeatherCard(data, cityName);
        } catch (error) {
            console.error('获取天气信息失败:', error);
            this.showError();
        }
    }

    updateWeatherCard(data, cityName) {
        const weatherIcon = this.getWeatherIcon(data.now.icon);
        
        // 保存刷新按钮
        const refreshButton = this.weatherCard.querySelector('.refresh-location');
        
        this.weatherCard.innerHTML = `
            ${refreshButton ? refreshButton.outerHTML : ''}
            <div class="weather-main">
                <div class="weather-icon">
                    <span class="material-icons">${weatherIcon}</span>
                </div>
                <div class="weather-info">
                    <h3 class="city">${cityName || '未知城市'}</h3>
                    <p class="temperature">${data.now.temp}°C</p>
                    <p class="description">${data.now.text}</p>
                </div>
            </div>
            <div class="weather-details">
                <div class="weather-detail-item">
                    <span class="material-icons">thermostat</span>
                    <span>体感温度: ${data.now.feelsLike}°C</span>
                </div>
                <div class="weather-detail-item">
                    <span class="material-icons">water_drop</span>
                    <span>相对湿度: ${data.now.humidity}%</span>
                </div>
                <div class="weather-detail-item">
                    <span class="material-icons">air</span>
                    <span>风速: ${data.now.windSpeed}km/h</span>
                </div>
                <div class="weather-detail-item">
                    <span class="material-icons">explore</span>
                    <span>风向: ${data.now.windDir}</span>
                </div>
            </div>
        `;

        // 重新绑定刷新按钮事件
        this.bindRefreshButton();
    }

    getWeatherIcon(code) {
        // 根据和风天气的图标代码返回对应的 Material Icon
        const iconMap = {
            '100': 'wb_sunny',           // 晴
            '101': 'partly_cloudy_day',  // 多云
            '102': 'cloud',              // 少云
            '103': 'cloud',              // 晴间多云
            '104': 'cloud',              // 阴
            '150': 'wb_sunny',           // 晴
            '151': 'partly_cloudy_day',  // 多云
            '152': 'cloud',              // 少云
            '153': 'cloud',              // 晴间多云
            '154': 'cloud',              // 阴
            '300': 'grain',              // 阵雨
            '301': 'rainy',              // 强阵雨
            '302': 'flash_on',           // 雷阵雨
            '303': 'flash_on',           // 强雷阵雨
            '304': 'flash_on',           // 雷阵雨伴有冰雹
            '305': 'rainy',              // 小雨
            '306': 'rainy',              // 中雨
            '307': 'rainy',              // 大雨
            '308': 'rainy',              // 极端降雨
            '309': 'grain',              // 毛毛雨/细雨
            '310': 'rainy',              // 暴雨
            '311': 'rainy',              // 大暴雨
            '312': 'rainy',              // 特大暴雨
            '313': 'grain',              // 冻雨
            '314': 'rainy',              // 小到中雨
            '315': 'rainy',              // 中到大雨
            '316': 'rainy',              // 大到暴雨
            '317': 'rainy',              // 暴雨到大暴雨
            '318': 'rainy',              // 大暴雨到特大暴雨
            '399': 'rainy',              // 雨
            '400': 'ac_unit',            // 小雪
            '401': 'ac_unit',            // 中雪
            '402': 'ac_unit',            // 大雪
            '403': 'ac_unit',            // 暴雪
            '404': 'ac_unit',            // 雨夹雪
            '405': 'ac_unit',            // 雨雪天气
            '406': 'ac_unit',            // 阵雨夹雪
            '407': 'ac_unit',            // 阵雪
            '408': 'ac_unit',            // 小到中雪
            '409': 'ac_unit',            // 中到大雪
            '410': 'ac_unit',            // 大到暴雪
            '499': 'ac_unit',            // 雪
            '500': 'blur_on',            // 薄雾
            '501': 'blur_on',            // 雾
            '502': 'blur_on',            // 霾
            '503': 'blur_on',            // 扬沙
            '504': 'blur_on',            // 浮尘
            '507': 'blur_on',            // 沙尘暴
            '508': 'blur_on',            // 强沙尘暴
            '509': 'blur_on',            // 浓雾
            '510': 'blur_on',            // 强浓雾
            '511': 'blur_on',            // 中度霾
            '512': 'blur_on',            // 重度霾
            '513': 'blur_on',            // 严重霾
            '514': 'blur_on',            // 大雾
            '515': 'blur_on',            // 特强浓雾
            '900': 'hot_tub',            // 热
            '901': 'ac_unit',            // 冷
            '999': 'help'                // 未知
        };
        
        return iconMap[code] || 'cloud';
    }

    bindRefreshButton() {
        document.getElementById('refresh-location')?.addEventListener('click', () => {
            this.refreshLocation();
        });
    }

    showError() {
        this.weatherCard.innerHTML = `
            <button class="refresh-location" id="refresh-location">
                <span class="material-icons">my_location</span>
            </button>
            <div class="weather-main">
                <div class="weather-icon">
                    <span class="material-icons">error</span>
                </div>
                <div class="weather-info">
                    <h3 class="city">获取失败</h3>
                    <p class="description">无法获取天气信息</p>
                </div>
            </div>
        `;
        this.bindRefreshButton();
    }

    refreshLocation() {
        // 清除保存的位置信息
        localStorage.removeItem('userLocation');
        localStorage.removeItem('hasRequestedLocation');
        
        // 重新请求位置
        this.getLocation()
            .then(position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                localStorage.setItem('userLocation', JSON.stringify(userLocation));
                localStorage.setItem('hasRequestedLocation', 'true');
                this.fetchWeather(position.coords.latitude, position.coords.longitude);
            })
            .catch(() => {
                const defaultCity = CONFIG.defaults.weatherCity;
                this.fetchWeather(defaultCity.lat, defaultCity.lon);
            });
    }
}

// 初始化天气管理器
const weatherManager = new WeatherManager(); 