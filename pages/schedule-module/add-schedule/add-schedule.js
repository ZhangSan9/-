// pages/schedule-module/add-schedule/add-schedule.js
Page({
    data: {
        schedule: {
            id: null, // 当前编辑的提醒事项ID,唯一标识，可以使用时间戳
            title: null, //提醒事项标题
            note: null, //备注
            state: '未完成', //状态，分为已完成、未完成、已逾期，默认是'未完成'
            //提醒日期
            date: {
                year: null,
                month: null,
                day: null,
            },
            //提醒时间
            time: {
                hour: null,
                minute: null,
            },
            // 提前提醒的时间
            beforehand: {
                unit: '小时',
                value: 1
            }
        },
        // 存储今天的日期和时间
        currentDate: '',
        currentTime: '',

        // 提前提醒的单位
        beforehandUnits: ['月', '日', '小时', '分钟'],
        // 提前提醒的数值
        beforehandValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },

    // 返回按钮
    goBack() {
        wx.navigateBack()
    },

    onLoad: function () {
        // 获取当前时间
        const currentDate = new Date();
        const currentHours = currentDate.getHours().toString().padStart(2, '0');
        const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');

        // 获取当前日期
        const currentYear = currentDate.getFullYear().toString();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始
        const currentDay = currentDate.getDate().toString().padStart(2, '0');

        // 设置时间和日期的默认值
        this.setData({
            'schedule.time.hour': parseInt(currentHours),
            'schedule.time.minute': parseInt(currentMinutes),
            'schedule.date.year': parseInt(currentYear),
            'schedule.date.month': parseInt(currentMonth),
            'schedule.date.day': parseInt(currentDay),

            currentDate: `${currentYear}/${currentMonth}/${currentDay}`,
            currentTime: `${currentHours}:${currentMinutes}`,

        });
        console.log("schedule:", this.data.schedule)
    },

    // 获得输入的标题
    onInputTitle(e) {
        this.setData({
            'schedule.title': e.detail.value // 将输入的值赋给 title
        });
    },

    // 输入的备注
    onInputNote(e) {
        this.setData({
            'schedule.note': e.detail.value
        });
    },

    // 获得输入的日期
    onDateChange(e) {
        const selectedDate = e.detail.value;
        const [year, month, day] = selectedDate.split('-'); // 分割月份和日
        this.setData({
            'schedule.date.year': parseInt(year),
            'schedule.date.month': parseInt(month),
            'schedule.date.day': parseInt(day),
        });
    },

    // 获取输入的时间值，例如 "16:30"
    onTimeChange(e) {
        const selectedTime = e.detail.value;
        const [hour, minute] = selectedTime.split(':'); // 分割小时和分钟
        // 更新数据到 time 对象
        this.setData({
            'schedule.time.hour': parseInt(hour),
            'schedule.time.minute': parseInt(minute),
        });
    },
    // 选择提前提醒时间的单位
    onBeforehandUnitChange(e) {
        const selectedIndex = e.detail.value;
        const selectedUnit = this.data.beforehandUnits[selectedIndex];

        // 根据选择的单位，动态设置可选值范围
        const newBeforehandValues = this.getBeforehandValues(selectedUnit);

        // 设置提前提醒的单位和重置值
        this.setData({
            'schedule.beforehand.unit': selectedUnit,
            'schedule.beforehand.value': newBeforehandValues[0], // 默认选择第一个值
            beforehandValues: newBeforehandValues
        });
    },

    // 提前提醒数值变化事件
    onBeforehandValueChange(e) {
        const selectedValue = this.data.beforehandValues[e.detail.value];
        this.setData({
            'schedule.beforehand.value': selectedValue
        });
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

    /**
     * 计算提醒时间
     * @param {Object} date - 选择的日期 { year, month, day }
     * @param {Object} time - 选择的时间 { hour, minute }
     * @param {Object} beforehand - 提前提醒的设置 { unit, value }
     * @returns {Number} - 提醒时间的时间戳（毫秒）
     */
    calculateReminderTime(date, time, beforehand) {
        // 构建提醒的目标时间
        const targetDate = new Date(
            parseInt(date.year),
            parseInt(date.month) - 1, // 月份从0开始
            parseInt(date.day),
            parseInt(time.hour),
            parseInt(time.minute),
            0,
            0
        );

        // 根据提前提醒设置，调整提醒时间
        let adjustment = 0; // 以毫秒为单位

        switch (beforehand.unit) {
            case '月':
                targetDate.setMonth(targetDate.getMonth() - beforehand.value);
                break;
            case '日':
                targetDate.setDate(targetDate.getDate() - beforehand.value);
                break;
            case '小时':
                targetDate.setHours(targetDate.getHours() - beforehand.value);
                break;
            case '分钟':
                targetDate.setMinutes(targetDate.getMinutes() - beforehand.value);
                break;
            default:
                return null;
        }

        const reminderTimestamp = targetDate.getTime();
        const currentTimestamp = Date.now();

        if (reminderTimestamp < currentTimestamp) {
            // 提醒时间已过
            return null;
        }

        return reminderTimestamp;
    },

    addSchedule() {
        const {
            title,
            note,
            state,
            date,
            time,
            beforehand
        } = this.data.schedule

        // 输入验证
        if (!title || title.trim() === '') {
            wx.showToast({
                title: '请填写提醒事项标题',
                icon: 'none'
            });
            return;
        }

        // 计算提醒时间
        const reminderTime = this.calculateReminderTime(date, time, beforehand);

        if (!reminderTime) {
            wx.showToast({
                title: '不能在过去的时间提醒',
                icon: 'none',
                duration:3000,
            });
            return;
        }

        const scheduleObject = {
            id: Date.now(), // 唯一标识，可以使用时间戳
            title,
            note,
            state,
            date,
            time,
            beforehand,
        }
        
        // 保存到本地存储 (假设使用 wx.setStorage 或 wx.setStorageSync)
        let schedules = wx.getStorageSync('schedules') || []; // 获取已保存的提醒事项（如果有的话）
        schedules.push(scheduleObject); // 将新提醒事项添加到数组中
        wx.setStorageSync('schedules', schedules); // 保存到本地存储

        // 提示用户添加成功
        wx.showToast({
            title: '提醒事项添加成功',
            icon: 'success'
        });
        console.log("确认添加方法中的schedule:", schedules)
    },

})