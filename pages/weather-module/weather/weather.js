// pages/weather-module/weather/weather.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userLocation: null, // 用户所在的位置
        locationID: null, // 地区/城市ID，例如101050101哈尔滨
        cityInput: '', // 用户输入的城市
        weather: { // 天气数据
            city: '', // 城市名称
            temperature: null, // 温度
            icon: null, // 图标
            feelsLike: null, // 体感温度
            text: null, // 天气状况描述
            humidity: null, // 相对湿度
            windSpeed: null, // 风速，公里/小时
        },

        imagePath: '', // 用于存储本地图片路径，下载天气的icon

        airQuality: { // 空气质量数据
            aqi: null, // aqi，
            catagory: null, // 空气质量等级
        },

        qweatherApiKey: '80f1246ce0f843a39fb6a10db77b36d8', // 和风天气的 API Key
        loading: false, // 加载状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 可在此处初始化获取用户当前位置的天气
        // 例如调用 getUserLocation 并获取天气数据
    },

    /**
     * 获取搜索栏输入的内容
     */
    onInput(e) {
        console.log("搜索栏输入的位置:", e.detail.value);
        this.setData({
            cityInput: e.detail.value
        });
    },

    /**
     * 点击搜索按钮时执行的方法
     */
    onSearch() {
        const city = this.data.cityInput.trim();
        if (city === '') {
            wx.showToast({
                title: '请输入城市名',
                icon: 'none'
            });
            return;
        }

        console.log("执行搜索，城市名:", city);
        this.setData({
            loading: true
        });

        // 调用获取 locationID 的方法
        this.lookupCityLocation(city);
    },

    /**
     * 使用城市搜索 API 获取 locationID
     * @param {string} cityName - 城市名称
     */
    lookupCityLocation(cityName) {
        const that = this;
        const apiKey = this.data.qweatherApiKey;
        const lookupUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(cityName)}&key=${apiKey}&number=1`;

        wx.request({
            url: lookupUrl,
            method: 'GET',
            success(res) {
                if (res.data.code === '200') {
                    const locations = res.data.location;
                    if (locations.length > 0) {
                        const location = locations[0]; // 选择第一个结果
                        console.log("获取到的 locationID:", location.id);
                        that.setData({
                            locationID: location.id,
                            weather: { // 重置天气数据
                                city: location.name,
                                temperature: null,
                                icon: null,
                                feelsLike: null,
                                text: null,
                                humidity: null,
                                windSpeed: null,
                            },
                            airQuality: { // 重置空气质量数据
                                aqi: null,
                                catagory: null,
                            }
                        });
                        // 使用 locationID 查询天气数据
                        that.fetchWeatherData(location.id, location.name);
                    } else {
                        wx.showToast({
                            title: '未找到相关城市',
                            icon: 'none'
                        });
                        that.setData({
                            loading: false
                        });
                    }
                } else {
                    wx.showToast({
                        title: '城市搜索失败',
                        icon: 'none'
                    });
                    that.setData({
                        loading: false
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '请求城市搜索接口失败',
                    icon: 'none'
                });
                that.setData({
                    loading: false
                });
            }
        });
    },

    /**
     * 获取天气和空气质量数据的方法
     * @param {string} locationID - 城市的 location ID
     * @param {string} cityName - 城市名称
     */
    fetchWeatherData(locationID, cityName) {
        const that = this;
        const apiKey = this.data.qweatherApiKey;
        const weatherUrl = `https://devapi.qweather.com/v7/weather/now?location=${locationID}&key=${apiKey}`;
        const airQualityUrl = `https://devapi.qweather.com/v7/air/now?location=${locationID}&key=${apiKey}`;

        // 获取天气数据
        wx.request({
            url: weatherUrl,
            method: 'GET',
            success(res) {
                if (res.data.code === '200') {
                    const weatherData = res.data.now;
                    that.setData({
                        weather: {
                            city: cityName,
                            temperature: weatherData.temp,
                            icon: weatherData.icon,
                            feelsLike: weatherData.feelsLike,
                            text: weatherData.text,
                            humidity: weatherData.humidity,
                            windSpeed: weatherData.windSpeed,
                        }
                    });

                    console.log("weatherData.icon:", weatherData.icon)

                    const imageUrl = `https://icons.qweather.com/assets/icons/${weatherData.icon}.svg`

                    // 下载天气icon
                    wx.downloadFile({
                        url: imageUrl,
                        success: (res) => {
                            if (res.statusCode === 200) {
                                that.setData({
                                    imagePath: res.tempFilePath // 将临时文件路径设置到数据绑定
                                });
                            } else {
                                wx.showToast({
                                    title: '下载天气图标失败',
                                    icon: 'none'
                                });
                            }
                        },
                        fail: function (err) {
                            console.error('下载失败:', err);
                            wx.showToast({
                                title: '下载失败',
                                icon: 'none'
                            });
                        }
                    });

                } else {
                    wx.showToast({
                        title: '获取天气数据失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '请求天气数据失败',
                    icon: 'none'
                });
            }
        });

        // 获取空气质量数据，包括aqi值和级别
        wx.request({
            url: airQualityUrl,
            method: 'GET',
            success(res) {
                if (res.data.code === '200') {
                    const airData = res.data.now;
                    that.setData({
                        airQuality: {
                            aqi: airData.aqi,
                            catagory: airData.category
                        }
                    });
                } else {
                    wx.showToast({
                        title: '获取空气质量数据失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '请求空气质量数据失败',
                    icon: 'none'
                });
            },
            complete() {
                // 所有请求完成后，关闭加载状态
                that.setData({
                    loading: false
                });
            }
        });
    },

})