// pages/schedule-module/finished-schedule/finished-schedule.js
Page({
    data: {
        finishedSchedules: [], // 存储已完成的提醒事项
    },

    onLoad() {
        this.loadFinishedSchedules();
    },

    onShow() {
        this.loadFinishedSchedules(); // 每次页面显示时刷新数据
    },

    goBack() {
        wx.navigateBack()
    },

    loadFinishedSchedules() {
        const storedSchedules = wx.getStorageSync('schedules') || [];
        const finished = storedSchedules.filter(item => item.state === '已完成');
        this.setData({
            finishedSchedules: finished
        });
        console.log("已完成的提醒事项:", finished);
    },

    goToScheduleInfo(event) {
        const id = event.currentTarget.dataset.id;
        if (id === undefined) {
            console.error("未获取到 id");
            return;
        }

        wx.navigateTo({
            url: `/pages/schedule-module/schedule-info/schedule-info?id=${id}`
        });
    },
});