// pages/result/index.js
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    correctCount: 0,
    totalCount: 0,
    wrongCount: 0,
    correctRate: 0,
    duration: 0
  },

  onLoad(options) {
    const correctCount = parseInt(options.correctCount) || 0;
    const totalCount = parseInt(options.totalCount) || 0;
    const correctRate = parseInt(options.correctRate) || 0;
    const duration = parseInt(options.duration) || 0;
    const wrongCount = totalCount - correctCount;

    this.setData({
      correctCount,
      totalCount,
      wrongCount,
      correctRate,
      duration
    });

    // 震动反馈
    this.vibrateFeedback(correctRate);
  },

  // 震动反馈
  vibrateFeedback(correctRate) {
    const settings = wx.getStorageSync('settings') || {};
    if (!settings.vibrateEnabled) return;

    if (correctRate >= 80) {
      // 优秀：长震动
      wx.vibrateLong();
    } else if (correctRate >= 60) {
      // 良好：短震动
      wx.vibrateShort();
    }
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}分${secs}秒`;
    }
    return `${secs}秒`;
  },

  // 获取成绩标题
  getScoreTitle(rate) {
    if (rate >= 90) return '太棒了！';
    if (rate >= 80) return '很不错！';
    if (rate >= 60) return '继续加油！';
    return '再接再厉！';
  },

  // 获取成绩副标题
  getScoreSubtitle(rate) {
    if (rate >= 90) return '你真是个口算小天才';
    if (rate >= 80) return '继续保持这个状态';
    if (rate >= 60) return '多练习会更好哦';
    return '不要气馁，坚持就是胜利';
  },

  // 获取鼓励图标
  getEncourageIcon(rate) {
    if (rate >= 90) return '🎉';
    if (rate >= 80) return '👍';
    if (rate >= 60) return '💪';
    return '🌟';
  },

  // 获取鼓励文字
  getEncourageText(rate) {
    const texts = {
      excellent: [
        '你的计算能力超强！继续保持！',
        '完美的表现，你是最棒的！',
        '你已经掌握得很好了！'
      ],
      good: [
        '表现很不错，再接再厉！',
        '你在不断进步，加油！',
        '继续努力，你会更优秀！'
      ],
      normal: [
        '多多练习，你会更好的！',
        '每一次练习都是进步！',
        '相信自己，你可以做得更好！'
      ],
      needImprove: [
        '不要气馁，熟能生巧！',
        '多练习几次就会提高的！',
        '坚持练习，你一定能进步！'
      ]
    };

    let category = 'needImprove';
    if (rate >= 90) category = 'excellent';
    else if (rate >= 80) category = 'good';
    else if (rate >= 60) category = 'normal';

    const categoryTexts = texts[category];
    return categoryTexts[Math.floor(Math.random() * categoryTexts.length)];
  },

  // 查看错题
  viewMistakes() {
    wx.switchTab({
      url: '/pages/mistakes/index'
    });
  },

  // 再练一次
  practiceAgain() {
    wx.navigateBack();
  },

  // 返回首页
  backHome() {
    wx.switchTab({
      url: '/pages/home/index'
    });
  },

  // 分享
  onShareAppMessage() {
    const { correctRate, totalCount } = this.data;
    return {
      title: `我在口算练习中得了${correctRate}分，答对了${totalCount}题中的${this.data.correctCount}题！`,
      path: '/pages/home/index',
      imageUrl: '' // 可以设置分享图片
    };
  }
});
