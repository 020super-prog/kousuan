// pages/camera/index.js
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    historyList: []
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    this.loadHistory();
    
    // 更新自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      });
    }
  },

  // 加载批改历史
  loadHistory() {
    const history = wx.getStorageSync('cameraHistory') || [];
    this.setData({
      historyList: history.slice(0, 10) // 只显示最近10条
    });
  },

  // 拍照
  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.processImage(tempFilePath);
      },
      fail: () => {
        Message.error({
          context: this,
          offset: [20, 32],
          content: '拍照失败，请重试'
        });
      }
    });
  },

  // 从相册选择
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.processImage(tempFilePath);
      },
      fail: () => {
        Message.error({
          context: this,
          offset: [20, 32],
          content: '选择图片失败，请重试'
        });
      }
    });
  },

  // 处理图片
  processImage(imagePath) {
    wx.showLoading({
      title: '识别中...',
      mask: true
    });

    // TODO: 调用OCR识别接口
    // 这里先模拟识别过程
    setTimeout(() => {
      wx.hideLoading();
      Message.info({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: 'OCR识别功能开发中...'
      });
    }, 2000);
  },

  // 查看历史记录
  viewHistory(e) {
    const id = e.currentTarget.dataset.id;
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '查看历史记录功能开发中...'
    });
  }
});
