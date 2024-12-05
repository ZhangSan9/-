// pages/schedule-module/schedule-info/schedule-info.js
Page({
    data: {
        schedule: {},

    },

    onLoad(options) {
        const id = options.id;
        const storedSchedules = wx.getStorageSync('schedules') || [];
        const schedule = storedSchedules.find(item => item.id === Number(id));
        if (schedule) {
            this.setData({
                schedule: schedule
            });
        } else {
            console.error("未找到对应的提醒事项");
        }
    },

    onShow() {
        const id = this.data.schedule.id;
        const storedSchedules = wx.getStorageSync('schedules') || [];
        const updatedSchedule = storedSchedules.find(item => item.id === Number(id));
        if (updatedSchedule) {
            this.setData({
                schedule: updatedSchedule
            });
        } else {
            console.error("未找到对应的提醒事项");
        }
    },

    // 返回按钮
    goBack() {
        wx.navigateBack()
    },

    // 编辑按钮
    editSchedule() {
        const id = this.data.schedule.id;
        wx.navigateTo({
            url: `/pages/schedule-module/edit-schedule/edit-schedule?id=${id}`
        });
    },

    // 删除提醒事项
    deleteSchedule() {
        const that = this;
        wx.showModal({
            title: '确认删除',
            content: '你确定要删除这个提醒事项吗？',
            success(res) {
                if (res.confirm) {
                    const id = that.data.schedule.id;
                    let storedSchedules = wx.getStorageSync('schedules') || [];

                    storedSchedules = storedSchedules.filter(item => item.id !== id);

                    wx.setStorageSync('schedules', storedSchedules);

                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                    });
                }
            }
        });
    },


})