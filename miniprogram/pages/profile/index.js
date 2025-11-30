// pages/profile/index.js
import Dialog from 'tdesign-miniprogram/dialog/index';
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    isLogin: false,
    userInfo: {},
    totalDays: 0,
    totalQuestions: 0,
    avgCorrectRate: 0,
    totalHours: 0,
    soundEnabled: true,
    vibrateEnabled: true
  },

  onLoad() {
    this.checkLoginStatus();
    this.loadSettings();
  },

  onShow() {
    if (this.data.isLogin) {
      this.loadStatistics();
    }
    
    // 更新自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.nickName) {
      this.setData({
        isLogin: true,
        userInfo
      });
      this.loadStatistics();
    }
  },

  // 加载统计数据
  loadStatistics() {
    const practiceRecords = wx.getStorageSync('practiceRecords') || [];
    
    // 计算总题数
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalDuration = 0;
    const practiceDays = new Set();

    practiceRecords.forEach(record => {
      totalQuestions += record.questions.length;
      totalCorrect += record.correctCount || 0;
      totalDuration += record.duration || 0;
      
      const dateStr = new Date(record.createTime).toDateString();
      practiceDays.add(dateStr);
    });

    // 计算平均正确率
    const avgCorrectRate = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

    // 计算练习时长（小时）
    const totalHours = Math.floor(totalDuration / 3600);

    this.setData({
      totalDays: practiceDays.size,
      totalQuestions,
      avgCorrectRate,
      totalHours
    });
  },

  // 加载设置
  loadSettings() {
    const settings = wx.getStorageSync('settings') || {
      soundEnabled: true,
      vibrateEnabled: true
    };
    
    this.setData({
      soundEnabled: settings.soundEnabled,
      vibrateEnabled: settings.vibrateEnabled
    });
  },

  // 登录
  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        
        this.setData({
          isLogin: true,
          userInfo
        });

        Message.success({
          context: this,
          offset: [20, 32],
          duration: 2000,
          content: '登录成功'
        });

        this.loadStatistics();
      },
      fail: () => {
        Message.error({
          context: this,
          offset: [20, 32],
          duration: 2000,
          content: '登录失败，请重试'
        });
      }
    });
  },

  // 退出登录
  logout() {
    Dialog.confirm({
      title: '确认退出',
      content: '退出登录后本地数据将保留',
      confirmBtn: '确认',
      cancelBtn: '取消'
    }).then(() => {
      wx.removeStorageSync('userInfo');
      
      this.setData({
        isLogin: false,
        userInfo: {},
        totalDays: 0,
        totalQuestions: 0,
        avgCorrectRate: 0,
        totalHours: 0
      });

      Message.success({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '已退出登录'
      });
    }).catch(() => {});
  },

  // 切换音效
  toggleSound(e) {
    const enabled = e.detail.value;
    this.setData({
      soundEnabled: enabled
    });
    this.saveSettings();
    
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 1500,
      content: enabled ? '音效已开启' : '音效已关闭'
    });
  },

  // 切换震动
  toggleVibrate(e) {
    const enabled = e.detail.value;
    this.setData({
      vibrateEnabled: enabled
    });
    this.saveSettings();
    
    if (enabled) {
      wx.vibrateShort();
    }
    
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 1500,
      content: enabled ? '震动反馈已开启' : '震动反馈已关闭'
    });
  },

  // 保存设置
  saveSettings() {
    const settings = {
      soundEnabled: this.data.soundEnabled,
      vibrateEnabled: this.data.vibrateEnabled
    };
    wx.setStorageSync('settings', settings);
  },

  // 跳转到设置页面
  goToSetting(e) {
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: 'PDF设置功能开发中...'
    });
  },

  // 关于我们
  goToAbout() {
    Dialog.alert({
      title: '关于我们',
      content: '小学口算助手\n\n专为小学生打造的数学口算练习工具，通过智能出题、即时反馈和错题管理，帮助孩子提升计算能力。\n\n版本：v1.0.0',
      confirmBtn: '我知道了'
    });
  },

  // 用户协议
  goToAgreement() {
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '用户协议页面开发中...'
    });
  },

  // 隐私政策
  goToPrivacy() {
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '隐私政策页面开发中...'
    });
  },

  // 反馈与帮助
  goToFeedback() {
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '反馈功能开发中...'
    });
  }
});
