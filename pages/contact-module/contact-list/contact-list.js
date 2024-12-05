// pages/contacts-module/contact-list/contact-list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contacts: [],
        searchQuery: '', //搜索
    },

    navigateToAddContactPage: function () {
        wx.navigateTo({
            url: '/pages/contact-module/add-contact/add-contact'
        });
    },
    // 点击联系人姓名时，跳转到contact-info页面，这个页面显示这个联系人的具体信息
    goToContactInfo(e) {
        const contact = e.currentTarget.dataset.contact;
        wx.navigateTo({
            url: '/pages/contact-module/contact-info/contact-info?name=' + contact.name + '&phone=' + contact.phone + '&email=' + contact.email + '&note=' + contact.note
        });
    },

    // 获取搜索栏输入的内容
    onInput(e) {
        console.log("搜索栏输入的内容:", e.detail.value)
        this.setData({
            searchQuery: e.detail.value
        });
    },
    // 搜索姓名、电话、邮件
    performSearch() {
        const query = this.data.searchQuery.trim().toLowerCase();
        if (query) {
            const allContacts = wx.getStorageSync('contacts') || [];
            const filteredContacts = allContacts.filter(contact => {
                return contact.name.toLowerCase().includes(query) ||
                    contact.phone.includes(query) ||
                    contact.email.toLowerCase().includes(query);
            });
            this.setData({
                contacts: filteredContacts
            });
        } else {
            const contacts = wx.getStorageSync('contacts') || [];
            this.setData({
                contacts
            });
        }
    },
    //   点击搜索按钮时，执行按照姓名、电话、邮件搜索联系人信息
    onSearch() {
        this.performSearch();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.performSearch();
    },
})