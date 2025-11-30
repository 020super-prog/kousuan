// pages/tdesign-test/index.js
import Dialog from 'tdesign-miniprogram/dialog/index';
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    inputValue: ''
  },

  onLoad() {
    console.log('TDesign测试页面加载成功');
  },

  // 按钮点击事件
  onPrimaryClick() {
    console.log('主要按钮被点击');
    wx.showToast({
      title: '主要按钮被点击',
      icon: 'success'
    });
  },

  onLightClick() {
    console.log('次要按钮被点击');
    wx.showToast({
      title: '次要按钮被点击',
      icon: 'none'
    });
  },

  onDangerClick() {
    console.log('危险按钮被点击');
    wx.showToast({
      title: '危险按钮被点击',
      icon: 'none'
    });
  },

  // 输入框变化事件
  onInputChange(e) {
    console.log('输入框内容:', e.detail.value);
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 显示对话框
  showDialog() {
    Dialog.confirm({
      title: '提示',
      content: '这是一个TDesign对话框组件',
      confirmBtn: '确认',
      cancelBtn: '取消',
    }).then(() => {
      console.log('用户点击了确认');
      Message.success({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '您点击了确认',
      });
    }).catch(() => {
      console.log('用户点击了取消');
      Message.info({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '您点击了取消',
      });
    });
  },

  // 显示消息提示
  showMessage() {
    Message.success({
      context: this,
      offset: [20, 32],
      duration: 3000,
      content: 'TDesign消息组件正常工作！',
    });
  }
});
