// pages/course-module/course-list/course-list.js
Page({
    data: {
        courses: [],
        startDate: '2024/09/02', //开学日期

        currentDate: null, //今天是星期几
        currentWeek: '', //当前第几周

        todayCourses: [], // 今天的课程
        weekCourses: [], // 本周的课程
    },

    onShow: function () {
        // 每次页面显示时读取本地存储的 startDate
        const storedDate = wx.getStorageSync('startDate');
        this.setData({
            startDate: storedDate
        });
        console.log("startDate",storedDate)

        // 从本地存储获取最新的课程数据
        const allCourses = wx.getStorageSync('courses') || [];

        this.setData({
            courses: allCourses
        });
        // 显示这学期是第几周
        this.getCurrentWeek(this.data.startDate)
        // 显示今天是星期几
        this.getCurrentDate()
        //  计算出今天有没有课
        this.getTodayCourses()
        // 计算出这周有没有课
        this.getWeekCourses()
    },

    // 计算现在是第几周
    getCurrentWeek(startDate) {
        const start = new Date(startDate); // 将 startDate 转为 Date 对象
        const now = new Date(); // 获取当前时间

        // 计算时间差（单位：毫秒）
        const diff = now - start;

        // 一周的毫秒数
        const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

        // 计算当前是第几周，向上取整避免零周
        const currentWeek = Math.ceil(diff / millisecondsPerWeek);
        // 更新页面数据
        this.setData({
            currentWeek: currentWeek > 0 ? currentWeek : 0,
        })
    },

    // 获得今天是星期几
    getCurrentDate() {
        const today = new Date();
        // console.log("today:", today)
        this.setData({
            currentDate: today.getDay(),
        })
    },

    // 添加课程按钮
    addCourse() {
        wx.navigateTo({
            url: '/pages/course-module/add-course/add-course',
        })
    },

    goToSettings() {
        wx.navigateTo({
            url: '/pages/course-module/settings/settings'
        })
    },

    // 点击每一个课程时，显示课程的详细信息
    goToCourseInfo(e) {
        // 获取绑定的数据
        const course = e.currentTarget.dataset.course;
        // console.log("点击的course：", course)
        wx.navigateTo({
            url: `/pages/course-module/course-info/course-info?course=${encodeURIComponent(JSON.stringify(course))}`,
        })
    },

    // 检查今天是否有课程
    getTodayCourses() {
        const currentWeek = this.data.currentWeek;
        const currentDate = this.data.currentDate;

        const todayCourses = this.data.courses.filter(course => {
            return (
                course.weeks.includes(currentWeek) &&
                course.dayOfWeek === currentDate
            );
        });

        this.setData({
            todayCourses: todayCourses
        })

    },

    // 计算出这周有没有课程
    getWeekCourses() {
        const currentWeek = this.data.currentWeek;

        const weekCourses = this.data.courses.filter(course => {
            return course.weeks.includes(currentWeek);
        });

        this.setData({
            weekCourses: weekCourses
        })
    },

})