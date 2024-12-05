// pages/course-module/add-course/add-course.js
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
                //星期几上课，一周可以上2次同样的课
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

    // 更新课程号
    onCourseIdInput(e) {
        this.setData({
            'course.courseId': e.detail.value,
        });
        console.log("输入的课程号：", e.detail.value)
    },
    // 课程名
    onNameInput(e) {
        this.setData({
            'course.name': e.detail.value
        });
        console.log("输入的课程名：", e.detail.value)
    },
    // 上课地点
    onLocationInput(e) {
        this.setData({
            'course.location': e.detail.value
        });
        console.log("输入的上课地点：", e.detail.value)
    },
    // 教师姓名
    onTeacherNameInput(e) {
        this.setData({
            'course.teacherName': e.detail.value
        });
        console.log("输入的教师姓名：", e.detail.value)
    },

    // 用户多选输入上课的周次
    onWeeksChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);
        const values = e.detail.value.map(Number); // 转换为数字类型
        const weekOptions = this.data.weekOptions.map((week) => ({
            ...week,
            checked: values.includes(week.value),
        }));

        this.setData({
            weekOptions,
            'course.weeks': values, // 同步选择到 course.weeks
        });
        console.log("course.weeks", values)
    },

    // 用户选择星期几上课
    onDayOfWeekChange: function (e) {
        const selectedIndex = parseInt(e.detail.value); // 获取选择的索引
        const selectedDay = this.data.dayOfWeekOptions[selectedIndex]; // 根据索引获取值

        console.log('选择的星期：', selectedDay);

        // 更新数据
        this.setData({
            selectedDayOfWeekIndex: selectedIndex,
            'course.dayOfWeek': selectedIndex + 1 // dayOfWeek 是从 1 开始的
        });
    },
    // 用户选择第几节上课，范围1-9节
    onStartPeriodChange: function (e) {
        const selectedIndex = parseInt(e.detail.value); // 获取选择的索引
        const selectedPeriod = this.data.startPeriodOptions[selectedIndex]; // 根据索引获取值

        console.log('选择的第几节课：', selectedPeriod);

        // 更新数据
        this.setData({
            selectedStartPeriodIndex: selectedIndex,
            'course.startPeriod': parseInt(selectedPeriod) // 转为数字存储
        });
    },


    //用户选择上几节课,范围1-3节
    onNumPeriodsChange: function (e) {
        const selectedIndex = parseInt(e.detail.value); // 获取选择的索引
        const selectedNumPeriods = this.data.numPeriodsOptions[selectedIndex]; // 根据索引获取值

        console.log('选择的上几节课：', selectedNumPeriods);

        // 更新数据
        this.setData({
            selectedNumPeriodsIndex: selectedIndex,
            'course.numPeriods': parseInt(selectedNumPeriods) // 转为数字存储
        });
    },

    // 添加课程到本地存储
    addCourse() {
        const course = this.data.course;

        // 验证课程信息是否完整
        if (!course.courseId || !course.name || !course.location || !course.dayOfWeek || !course.startPeriod || !course.numPeriods || course.weeks.length === 0) {
            wx.showToast({
                title: '请填写完整课程信息',
                icon: 'none',
            });
            return;
        }

        // 获取本地存储的课程列表
        const storedCourses = wx.getStorageSync('courses') || [];

        // 添加新课程
        storedCourses.push(course);

        // 更新本地存储
        wx.setStorageSync('courses', storedCourses);

        // 清空表单并提示用户
        this.setData({
            course: {
                courseId: '',
                name: '',
                location: '',
                teacherName: '',
                weeks: [],
                dayOfWeek: null,
                startPeriod: null,
                numPeriods: null,
            },
        });

        wx.showToast({
            title: '课程添加成功',
            icon: 'success',
        });

        console.log('当前存储的课程列表:', storedCourses);
    },
})