// edit-contact.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 原始联系信息，用于在保存时定位联系人
        originalName: '',
        originalPhone: '',
        originalEmail: '',
        originalNote: '',

        // 当前编辑的联系信息
        name: '',
        phone: '',
        email: '',
        note: ''
    },

    goBack:function () {
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            originalName: decodeURIComponent(options.name || ''),
            originalPhone: decodeURIComponent(options.phone || ''),
            originalEmail: decodeURIComponent(options.email || ''),
            originalNote: decodeURIComponent(options.note || ''),

            name: decodeURIComponent(options.name || ''),
            phone: decodeURIComponent(options.phone || ''),
            email: decodeURIComponent(options.email || ''),
            note: decodeURIComponent(options.note || '')
        });
    },

    /**
     * 输入事件处理函数
     */
    onNameInput(e) {
        this.setData({
            name: e.detail.value
        });
    },

    onPhoneInput(e) {
        this.setData({
            phone: e.detail.value
        });
    },

    onEmailInput(e) {
        this.setData({
            email: e.detail.value
        });
    },

    onNoteInput(e) {
        this.setData({
            note: e.detail.value
        });
    },

    /**
     * 保存联系人方法
     */
    saveContact() {
        const {
            name,
            phone,
            email,
            note,
            originalName,
            originalPhone,
            originalEmail,
            originalNote
        } = this.data;

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

        // 验证电话格式是否为11位数字
        if (!/^\d{11}$/.test(phone)) {
            wx.showToast({
                title: '电话号码必须是11位数字',
                icon: 'none',
                duration: 2000
            });
            return;
        }

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

        try {
            // 获取本地存储中的联系人列表
            let contacts = wx.getStorageSync('contacts') || [];

            // 查找要更新的联系人索引
            const index = contacts.findIndex(contact =>
                contact.name === originalName &&
                contact.phone === originalPhone &&
                contact.email === originalEmail &&
                contact.note === originalNote
            );

            if (index !== -1) {
                // 更新联系人信息
                contacts[index] = {
                    name: name.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    note: note.trim()
                };

                // 保存回本地存储
                wx.setStorageSync('contacts', contacts);

                // 显示保存成功的提示
                wx.showToast({
                    title: '联系人已更新',
                    icon: 'success',
                    duration: 2000
                });

            } else {
                wx.showToast({
                    title: '未找到联系人',
                    icon: 'none',
                    duration: 2000
                });
            }
        } catch (error) {
            console.error('更新联系人失败：', error);
            wx.showToast({
                title: '更新失败，请稍后再试',
                icon: 'none',
                duration: 2000
            });
        }
    }
});