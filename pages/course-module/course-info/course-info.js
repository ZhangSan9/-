// pages/course-module/course-info/course-info.js
Page({
    data: {
        course: {}, // 课程数据, JSON 格式
    },

    // 页面加载时，接收课程数据
    onLoad: function (options) {
        const course = JSON.parse(decodeURIComponent(options.course));
        this.setData({
            course: course,
        });
    },

    // 页面显示时刷新数据
    onShow: function () {
        // 获取本地存储中的最新课程信息
        const courseId = this.data.course.courseId;
        const courses = wx.getStorageSync('courses') || [];
        const updatedCourse = courses.find(course => course.courseId === courseId);

        if (updatedCourse) {
            this.setData({
                course: updatedCourse, // 更新页面显示的数据
            });
        }
        console.log("course-info.js中的course:",updatedCourse)
    },

    // 返回上一页
    goBack() {
        wx.navigateBack();
    },

    // 跳转到编辑页面
    editCourse(e) {
        const course = this.data.course;

        // 将课程信息转换为字符串，以便通过 URL 参数传递
        const courseStr = encodeURIComponent(JSON.stringify(course));

        wx.navigateTo({
            url: `/pages/course-module/edit-course/edit-course?course=${courseStr}`,
        });
    },

    // 删除课程
    deleteCourse() {
        const courseId = this.data.course.courseId;
        const courses = wx.getStorageSync('courses') || [];

        // 显示确认删除的弹窗
        wx.showModal({
            title: '删除课程',
            content: '确定要删除这门课程吗？',
            success: (res) => {
                if (res.confirm) {
                    // 过滤掉要删除的课程
                    const updatedCourses = courses.filter(course => course.courseId !== courseId);

                    // 更新本地存储
                    wx.setStorageSync('courses', updatedCourses);

                    // 提示删除成功
                    wx.showToast({
                        title: '课程已删除',
                        icon: 'success',
                        duration: 2000,
                    });

                    // 返回上一页
                    wx.navigateBack();
                } else if (res.cancel) {
                    // 用户取消删除，什么都不做
                    console.log('用户取消删除');
                }
            }
        });
    },
})