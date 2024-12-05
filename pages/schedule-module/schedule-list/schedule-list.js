// pages/schedule-module/schedule-list/schedule-list.js
Page({
    data: {
        schedules: [], // 存储所有提醒事项的数组
        currentDate: '', //今天的日期，例如2024/12/04
        currentTime: '', //现在的时间，例如19:33

        overdueSchedules: [], //已逾期的提醒事项
        todaySchedules: [], //今天的提醒事项
        tomorrowSchedules: [], //明天的提醒事项
        unfinishedSchedules: [], //未完成的提醒事项
    },

    // 页面加载
    onLoad: function () {
        const storedSchedules = wx.getStorageSync('schedules') || [];
        this.setData({
            schedules: storedSchedules
        }, () => {
            this.getCurrentDateTime();
            this.getTodaySchedules();
            this.getTomorrowSchedules();
            this.getOverdueSchedules(); // 获取已逾期的提醒事项
            this.getUnfinishedSchedules(); // 获取未完成的提醒事项
        });
    },

    onShow: function () {
        const storedSchedules = wx.getStorageSync('schedules') || [];
        this.setData({
            schedules: storedSchedules
        }, () => {
            this.getCurrentDateTime();
            this.getTodaySchedules();
            this.getTomorrowSchedules();
            this.getOverdueSchedules(); // 获取已逾期的提醒事项
            this.getUnfinishedSchedules(); // 获取未完成的提醒事项
        });
    },

    // 添加日程按钮
    addSchedule() {
        wx.navigateTo({
            url: '/pages/schedule-module/add-schedule/add-schedule',
        })
    },
    // 点击提醒事项，进入编辑页面
    navigateToEdit: function (e) {
        const scheduleId = e.currentTarget.dataset.id;
        // console.log("scheduleId:",scheduleId)
        wx.navigateTo({
            url: `/pages/schedule-module/edit-schedule/edit-schedule?id=${scheduleId}`
        });
    },

    // 跳转到详情信息页面
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

    goToFinishedSchedule() {
        wx.navigateTo({
            url: '/pages/schedule-module/finished-schedule/finished-schedule',   
        })
    },

    // 打印现在的时间
    getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        this.setData({
            currentDate: `${year}/${month}/${day}`,
            currentTime: `${hours}:${minutes}`
        })
    },
    // 已逾期的提醒事项，提醒事项过了 提醒时间+1天 还未完成就是已逾期
    getOverdueSchedules() {
        const now = new Date();
        const currentTimestamp = now.getTime();

        const overdue = this.data.schedules.filter(item => {
            // 构建提醒事项的日期时间对象
            const itemDate = new Date(
                item.date.year,
                item.date.month - 1, // 月份从0开始
                item.date.day,
                item.time.hour,
                item.time.minute
            );
            const itemTimestamp = itemDate.getTime();

            // 判断条件：
            // 1. 提醒事项过了 提醒时间+1天 还未完成
            // 2. 或者 item.state 明确标记为 '已逾期'
            return (
                ((itemTimestamp + 86400000) < currentTimestamp && item.state !== '已完成') ||
                item.state === '已逾期'
            );
        });

        this.setData({
            overdueSchedules: overdue
        });
        console.log("已逾期的提醒事项:", overdue);
    },

    // 未完成的提醒事项
    getUnfinishedSchedules() {
        const unfinished = this.data.schedules.filter(item => item.state === '未完成');
        this.setData({
            unfinishedSchedules: unfinished
        });
        console.log("未完成的提醒事项:", unfinished);
    },

    // 获得今天的提醒事项
    getTodaySchedules() {
        const {
            schedules,
            currentDate
        } = this.data;
        const [year, month, day] = currentDate.split('/').map(Number);
        const today = schedules.filter(item =>
            item.date.year === year &&
            item.date.month === month &&
            item.date.day === day &&
            item.state !== '已完成' //已完成的提醒事项就不会放进去
        );
        this.setData({
            todaySchedules: today
        });
        console.log("今天的提醒事项:", today);
    },

    // 获得明天的提醒事项
    getTomorrowSchedules() {
        const now = new Date();
        now.setDate(now.getDate() + 1); // 设置日期为明天
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 月份从0开始，需要加1
        const day = now.getDate();

        const tomorrow = {
            year: year,
            month: month,
            day: day
        };

        const tomorrowSchedules = this.data.schedules.filter(item =>
            item.date.year === tomorrow.year &&
            item.date.month === tomorrow.month &&
            item.date.day === tomorrow.day &&
            item.state !== '已完成' // 已完成的就不会算进去
        );

        this.setData({
            tomorrowSchedules: tomorrowSchedules
        });
        console.log("明天的提醒事项:", tomorrowSchedules);
    },


    // 复选框点击时，更新状态并重新过滤
    onCheckboxChange(event) {
        const id = event.currentTarget.dataset.id;
        if (id === undefined) {
            console.error("未获取到 id");
            return;
        }

        const updatedSchedules = this.data.schedules.map(item => {
            if (item.id === Number(id)) {
                return {
                    ...item,
                    state: '已完成'
                };
            }
            return item;
        });

        this.setData({
            schedules: updatedSchedules
        }, () => {
            wx.setStorageSync('schedules', updatedSchedules);
            this.getTodaySchedules(); // 重新过滤今天的提醒
            this.getTomorrowSchedules(); // 重新过滤明天的提醒
            this.getOverdueSchedules();
            this.getUnfinishedSchedules(); // 更新未完成的提醒事项
            console.log("更新后的提醒事项:", updatedSchedules);
        });
    },

})