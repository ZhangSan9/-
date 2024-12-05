// pages/course-module/edit-course/edit-course.js
Page({
    data: {
        course: {
            courseId: '', //课程id，只能是数字
            name: '', //课程名
            location: '', //上课地点
            teacherName: '', //教师姓名
            weeks: {
                //第几周上课,可以是很多周，字符串数组
            },
            dayOfWeek: {
                //星期几上课
            },
            startPeriod: '', //第几节上课，范围1-9节
            numPeriods: '', //上几节课,白天一般是2节，晚上的课一般是3节
        },

        // 用户选择有多少周上课，范围1-18周
        weekOptions: [{
                value: 1,
                selected: false
            },
            {
                value: 2,
                selected: false
            },
            {
                value: 3,
                selected: false
            },
            {
                value: 4,
                selected: false
            },
            {
                value: 5,
                selected: false
            },
            {
                value: 6,
                selected: false
            },
            {
                value: 7,
                selected: false
            },
            {
                value: 8,
                selected: false
            },

            {
                value: 9,
                selected: false
            },
            {
                value: 10,
                selected: false
            },
            {
                value: 11,
                selected: false
            },
            {
                value: 12,
                selected: false
            },
            {
                value: 13,
                selected: false
            },
            {
                value: 14,
                selected: false
            },
            {
                value: 15,
                selected: false
            },
            {
                value: 16,
                selected: false
            },
            {
                value: 17,
                selected: false
            },
            {
                value: 18,
                selected: false
            },
        ],
        // 用户选择星期几上课
        dayOfWeekOptions: ['星期一', '星期二', '星期三', '星期四', '星期五'], // 可选的星期几
        selectedDayOfWeekIndex: 0, // 默认选择星期一
        // 用户选择第几节上课
        startPeriodOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9], // 可选的第几节
        selectedStartPeriodIndex: 0, // 默认选择第 1 节
        // 用户选择上几节课
        numPeriodsOptions: [1, 2, 3], // 可选的上几节课
        selectedNumPeriodsIndex: 0, // 默认选择 1 节
    },

    // 返回按钮
    goBack() {
        wx.navigateBack()
    },

    onLoad: function (options) {
        // 接收参数并解析
        const course = JSON.parse(decodeURIComponent(options.course));
        this.setData({
            course
        });
        console.log("edit-course.js中的course:", this.data.course);

        // 初始化 weeks 的选中状态
        this.syncWeeksToOptions();
        // 初始化 dayOfWeek 的选中状态
        this.syncDayOfWeekToOptions();
        // 初始化 startPeriod 的选中状态
        this.syncStartPeriodToOptions();
        // 初始化 numPeriods 的选中状态
        this.syncNumPeriodsToOptions();
    },

    // 课程名
    onNameInput(e) {
        this.setData({
            'course.name': e.detail.value
        });
    },
    // 上课地点
    onLocationInput(e) {
        this.setData({
            'course.location': e.detail.value
        });
    },
    // 教师姓名
    onTeacherNameInput(e) {
        this.setData({
            'course.teacherName': e.detail.value
        });
    },

    // 表单数据双向绑定，包含课程名、上课地点、教师姓名，课程号不允许编辑
    handleInput(e) {
        const {
            field
        } = e.currentTarget.dataset;
        const value = e.detail.value;

        this.setData({
            [`course.${field}`]: value,
        });
    },

    // 更新 weekOptions 的 checked 状态
    syncWeeksToOptions() {
        const {
            weeks
        } = this.data.course;
        const updatedOptions = this.data.weekOptions.map((week) => ({
            ...week,
            checked: weeks.includes(week.value), // 如果 weeks 包含该值，则选中
        }));

        this.setData({
            weekOptions: updatedOptions,
        });
    },

    // 更新 dayOfWeekOptions 的选中状态
    syncDayOfWeekToOptions() {
        const {
            dayOfWeek
        } = this.data.course;

        const selectedIndex = dayOfWeek - 1; // dayOfWeek 数字减去 1 来匹配数组索引

        this.setData({
            selectedDayOfWeekIndex: selectedIndex >= 0 ? selectedIndex : 0, // 如果超出范围，默认选择星期一
        });
    },
    // 更新 startPeriod 的选中状态
    syncStartPeriodToOptions(e) {
        const {
            startPeriod
        } = this.data.course;

        const selectedIndex = startPeriod - 1;

        this.setData({
            selectedStartPeriodIndex: selectedIndex >= 0 ? selectedIndex : 0, // 默认选择第1节
        })
    },

    // 更新 numPeriodsOptions 的选中状态
    syncNumPeriodsToOptions() {
        const {
            numPeriods
        } = this.data.course;

        // 找到对应节次的索引
        const selectedIndex = this.data.numPeriodsOptions.indexOf(numPeriods.toString());
        this.setData({
            selectedNumPeriodsIndex: selectedIndex >= 0 ? selectedIndex : 0, // 默认选择1节课
        });
    },


    // 处理 checkbox 的变更
    onWeeksChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        const values = e.detail.value.map(Number); // 转换为数字类型

        // 更新 weekOptions 的 checked 状态
        const updatedOptions = this.data.weekOptions.map((week) => ({
            ...week,
            checked: values.includes(week.value),
        }));

        // 更新数据
        this.setData({
            weekOptions: updatedOptions,
            'course.weeks': values, // 同步选择到 course.weeks
        });

        console.log("course.weeks:", values);
    },

    // 处理 picker 选择变更
    onDayOfWeekChange(e) {
        const selectedIndex = e.detail.value;
        const selectedDay = Number(selectedIndex) + 1
        // 更新 course.dayOfWeek
        this.setData({
            'course.dayOfWeek': selectedDay,//只存储数字
            selectedDayOfWeekIndex: selectedIndex, // 更新 picker 显示的选项索引
        });
        
        console.log("course.dayOfWeek:", selectedDay); // 打印更新后的值
    },

    // 处理节次选择变更
    onStartPeriodChange(e) {
        const selectedIndex = e.detail.value;
        const selectedPeriod = this.data.startPeriodOptions[selectedIndex]; // 获取选中的节次

        // 更新 course.startPeriod
        this.setData({
            'course.startPeriod': selectedPeriod, // 更新课程的节次
            selectedStartPeriodIndex: selectedIndex, // 更新 picker 显示的选项索引
        });

        console.log("course.startPeriod:", selectedPeriod); // 打印更新后的值
    },

    // 处理上几节课选择变更
    onNumPeriodsChange(e) {
        const selectedIndex = e.detail.value;
        const selectedNum = this.data.numPeriodsOptions[selectedIndex]; // 获取选中的上几节课

        // 更新 course.numPeriods
        this.setData({
            'course.numPeriods': selectedNum, // 更新课程的上几节课
            selectedNumPeriodsIndex: selectedIndex, // 更新 picker 显示的选项索引
        });

        console.log("course.numPeriods:", selectedNum); // 打印更新后的值
    },

    // 保存编辑后的课程信息
    saveCourse() {
        const updatedCourse = this.data.course;

        if (!updatedCourse.name.trim()) {
            wx.showToast({
                title: '课程名不能为空',
                icon: 'error',
                duration: 2000
            });
            return;
        }

        if (!updatedCourse.location.trim()) {
            wx.showToast({
                title: '上课地点不能为空',
                icon: 'error',
                duration: 2000
            });
            return;
        }

        // 更新本地存储的课程信息
        const courses = wx.getStorageSync('courses') || [];
        const index = courses.findIndex(c => c.courseId === updatedCourse.courseId);

        if (index !== -1) {
            // 如果找到课程，更新信息
            courses[index] = updatedCourse;
        } else {
            // 如果未找到，直接添加
            courses.push(updatedCourse);
        }

        wx.setStorageSync('courses', courses);

        wx.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000,
        })
    },


})