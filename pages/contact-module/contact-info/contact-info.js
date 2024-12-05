// contact-info.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 原始联系信息，用于在 onShow 中查找联系人
        originalName: '',
        originalPhone: '',
        originalEmail: '',
        originalNote: '',

        // 当前显示的联系信息
        name: '',
        phone: '',
        email: '',
        note: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            originalName: options.name || '',
            originalPhone: options.phone || '',
            originalEmail: options.email || '',
            originalNote: options.note || '',

            name: options.name || '',
            phone: options.phone || '',
            email: options.email || '',
            note: options.note || ''
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.loadContactInfo();
    },

    /**
     * 加载并刷新联系人信息
     */
    loadContactInfo() {
        const { originalName, originalPhone, originalEmail, originalNote } = this.data;

        // 从本地存储中获取所有联系人
        let contacts = wx.getStorageSync('contacts') || [];

        // 根据原始信息查找联系人
        const contact = contacts.find(contact => 
            contact.name === originalName &&
            contact.phone === originalPhone &&
            contact.email === originalEmail &&
            contact.note === originalNote
        );

        if (contact) {
            // 找到联系人，更新页面数据
            this.setData({
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
                note: contact.note
            });
        } else {
            // 未找到联系人，可能已被删除或信息已更改
            wx.showToast({
                title: '未找到联系人',
                icon: 'none',
                duration: 2000
            });

            // 返回上一页
            wx.navigateBack();
        }
    },

    /**
     * 删除联系人方法
     */
    deleteContact() {
        const { originalName, originalPhone, originalEmail, originalNote } = this.data;

        wx.showModal({
            title: '确认删除',
            content: `你确定要删除联系人 "${originalName}" 吗？`,
            success: (res) => {
                if (res.confirm) {
                    // 从本地存储中获取联系人列表
                    let contacts = wx.getStorageSync('contacts') || [];

                    // 删除匹配的联系人
                    contacts = contacts.filter(contact => 
                        !(contact.name === originalName &&
                          contact.phone === originalPhone &&
                          contact.email === originalEmail &&
                          contact.note === originalNote)
                    );

                    // 保存更新后的联系人列表
                    wx.setStorageSync('contacts', contacts);

                    // 显示删除成功的提示
                    wx.showToast({
                        title: '联系人已删除',
                        icon: 'success',
                        duration: 2000
                    });

                    // 返回上一页
                    wx.navigateBack();
                } else if (res.cancel) {
                    console.log('用户取消删除操作');
                }
            }
        });
    },

    /**
     * 呼叫联系人方法
     */
    callContact() {
        const { phone, name } = this.data;

        if (!phone) {
            wx.showToast({
                title: '电话号码无效',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        wx.makePhoneCall({
            phoneNumber: phone,
            success: () => {
                console.log(`正在呼叫 ${name} (${phone})`);
            },
            fail: () => {
                wx.showToast({
                    title: '呼叫失败，请稍后再试',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    },

    /**
     * 编辑联系人方法
     */
    editContact() {
        const { originalName, originalPhone, originalEmail, originalNote } = this.data;

        // 使用 encodeURIComponent 确保特殊字符在 URL 中正确传递
        const query = `?name=${encodeURIComponent(originalName)}&phone=${encodeURIComponent(originalPhone)}&email=${encodeURIComponent(originalEmail)}&note=${encodeURIComponent(originalNote)}`;
        
        wx.navigateTo({
            url: `/pages/contact-module/edit-contact/edit-contact${query}`
        });
    },
    // 返回到联系人列表页面
    goBack: function () {
        wx.navigateBack({
        })
    },
});
