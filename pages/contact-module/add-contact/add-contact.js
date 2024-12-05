// pages/contacts-module/add-contact/add-contact.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        phone: '',
        email: '',
        notes: ''
    },
    // 返回按钮
    goBack: function (params) {
        wx.navigateBack({
        })
    },

    /**
     * 姓名输入事件处理
     */
    onNameInput: function (e) {
        this.setData({
            name: e.detail.value
        });
    },

    /**
     * 电话输入事件处理
     */
    onPhoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        });
    },

    /**
     * 邮箱输入事件处理
     */
    onEmailInput: function (e) {
        this.setData({
            email: e.detail.value
        });
    },

    /**
     * 备注输入事件处理
     */
    onNoteInput: function (e) {
        this.setData({
            note: e.detail.value
        });
    },

    onSubmit: function () {
        const { name, phone, email, note } = this.data;

        // 验证姓名是否为空
        if (!name.trim()) {
            wx.showToast({
                title: '姓名不能为空',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        // 验证电话是否为空
        if (!phone.trim()) {
            wx.showToast({
                title: '电话不能为空',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        
        if (!/^\d{11}$/.test(phone)) {
            wx.showToast({
                title: '电话号码必须是11位数字',
                icon: 'none'
            });
            return;
        }
        // 邮箱可以为空，但是如果输入了东西，就必须符合邮箱的格式
        // 验证邮箱格式（如果邮箱不为空）
        if (email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                wx.showToast({
                    title: '邮箱格式不正确，必须是:***@*.*',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
        }

        // 从本地存储中获取现有的联系人列表
        let contacts = wx.getStorageSync('contacts') || [];

        // 添加新的联系人到列表
        contacts.push({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            note: note.trim()
        });

        // 将更新后的联系人列表保存回本地存储
        wx.setStorageSync('contacts', contacts);

        // 显示添加成功的提示
        wx.showToast({
            title: '联系人已添加',
            icon: 'success',
            duration: 2000
        });
    },
})