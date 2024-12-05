// pages/schedule-module/edit-schedule/edit-schedule.js
Page({
    data: {
        schedule: {},

        stateOptions: ['未完成', '已完成', '已逾期'],
        selectedStateOptionsIndex: 0,

        // 提前提醒的单位
        beforehandUnit: ['月', '日', '小时', '分钟'],
        selectedBeforehandUnitIndex: 0,

        // 提前提醒的数值
        beforehandValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        selectedBeforehandValueIndex: 0,
    },

    onLoad(options) {
        const id = options.id;
        const storedSchedules = wx.getStorageSync('schedules') || [];
        const schedule = storedSchedules.find(item => item.id === Number(id));
        if (schedule) {
            this.setData({
                schedule: schedule,
                formattedDate: `${schedule.date.year}-${this.formatNumber(schedule.date.month)}-${this.formatNumber(schedule.date.day)}`,
                formattedTime: `${this.formatNumber(schedule.time.hour)}:${this.formatNumber(schedule.time.minute)}`
            });
        } else {
            console.error("未找到对应的提醒事项");
        }
    },

    // 辅助函数，确保月份和分钟为两位数
    formatNumber(n) {
        return n < 10 ? `0${n}` : `${n}`;
    },

    onInputTitle(event) {
        this.setData({
            'schedule.title': event.detail.value
        });
    },

    onInputNote(event) {
        this.setData({
            'schedule.note': event.detail.value
        });
    },

    onDateChange(event) {
        const date = event.detail.value.split("-");
        this.setData({
            'schedule.date.year': Number(date[0]),
            'schedule.date.month': Number(date[1]),
            'schedule.date.day': Number(date[2])
        });
    },

    onTimeChange(event) {
        const time = event.detail.value.split(":");
        this.setData({
            'schedule.time.hour': Number(time[0]),
            'schedule.time.minute': Number(time[1])
        });
    },

    // 提前提醒单位更改
    onBeforehandUnitChange(event) {
        const selectedIndex = event.detail.value; // 用户选择的索引
        const selectedUnit = this.data.beforehandUnit[selectedIndex];

        // 根据选择的单位，动态设置可选值范围
        const newBeforehandValues = this.getBeforehandValues(selectedUnit);

        this.setData({
            selectedBeforehandUnitIndex: selectedIndex,
            'schedule.beforehand.unit': selectedUnit, // 更新到 schedule
            beforehandValues: newBeforehandValues,
        });

        console.log('提前提醒单位更新为:', selectedUnit);

        console.log("newBeforehandValues",newBeforehandValues)
    },

    /**
     * 根据单位返回可选的数值范围
     * @param {String} unit - 选择的单位
     * @returns {Array} - 返回相应的数值数组
     */
    getBeforehandValues(unit) {
        switch (unit) {
            case '月':
                return Array.from({
                    length: 12
                }, (v, k) => k + 1); // 1-12
            case '日':
                return Array.from({
                    length: 30
                }, (v, k) => k + 1); // 1-30
            case '小时':
                return Array.from({
                    length: 23
                }, (v, k) => k + 1); // 1-23
            case '分钟':
                return Array.from({
                    length: 59
                }, (v, k) => k + 1); // 1-59
            default:
                return [1];
        }
    },

    // 提前提醒数值更改
    onBeforehandValueChange(event) {
        const selectedIndex = event.detail.value; // 用户选择的索引
        // 需要变化数值，1个月30天，
        const selectedValue = this.data.beforehandValues[selectedIndex];

        this.setData({
            selectedBeforehandValueIndex: selectedIndex,
            'schedule.beforehand.value': selectedValue // 更新到 schedule
        });

        console.log('提前提醒数值更新为:', selectedValue);
    },

    // 状态修改
    onStateChange(e) {
        const selectedIndex = e.detail.value;
        const selectedState = this.data.stateOptions[Number(selectedIndex)]
        this.setData({
            'schedule.state': selectedState,
            selectedStateOptionsIndex: selectedIndex,
        })
        console.log("状态更新为:", selectedState)
    },

    // 返回按钮
    goBack() {
        wx.navigateBack()
    },

    // 编辑按钮
    saveEdit() {
        const updatedSchedule = this.data.schedule;
        let storedSchedules = wx.getStorageSync('schedules') || [];
        const index = storedSchedules.findIndex(item => item.id === updatedSchedule.id);
        if (index !== -1) {
            storedSchedules[index] = updatedSchedule;
            wx.setStorageSync('schedules', storedSchedules);
            wx.showToast({
                title: '更新成功',
                icon: 'success',
                duration: 2000
            });
        } else {
            console.error("未找到对应的提醒事项进行更新");
        }
    },

})