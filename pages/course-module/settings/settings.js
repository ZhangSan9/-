// pages/course-module/settings/settings.js
Page({
    data: {
        startDate: '', // 初始化 startDate
        maxDate: '', // 最大可选日期
    },
    onLoad(options) {
        // 获取本地存储的 startDate
        const storedDate = wx.getStorageSync('startDate');
        this.setData({
            startDate: storedDate
        });

        // 初始化最大日期为今天
        const today = this.getToday();
        this.setData({
            maxDate: today
        });
    },

    // 获取今天的日期
    getToday() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    // 修改 startDate
    onDateChange(e) {
        this.setData({
            startDate: e.detail.value
        });
    },

    goBack(){
        wx.navigateBack()
    },

    // 保存 startDate 到本地
    save() {
        const { startDate } = this.data;

        // 保存到本地存储
        wx.setStorageSync('startDate', startDate);

        // 提示保存成功
        wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
        });
    },
})