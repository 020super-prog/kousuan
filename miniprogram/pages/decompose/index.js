// pages/decompose/index.js
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    mode: 'basic', // basic(10以内), advanced(20以内), triple(三数相加)
    targetNumber: 0,
    currentQuestion: null,
    
    // 用户输入
    input1: '',
    input2: '',
    input3: '',
    
    // 题目统计
    totalCount: 20,
    currentIndex: 0,
    correctCount: 0,
    answers: [],
    
    // 计时
    elapsedTime: 0,
    startTime: 0,
    
    // UI状态
    showFeedback: false,
    feedbackType: '', // 'correct' or 'wrong'
    loading: false,
    
    // 模式配置
    modeConfig: {
      basic: { name: '10以内分解', min: 2, max: 10, inputs: 2 },
      advanced: { name: '20以内分解', min: 11, max: 20, inputs: 2 },
      triple: { name: '三数相加', min: 6, max: 10, inputs: 3 }
    }
  },

  timer: null,

  onLoad(options) {
    const { mode = 'basic', count = 20 } = options;
    
    this.setData({
      mode,
      totalCount: parseInt(count)
    });

    console.log('数的分解练习页面参数:', { mode, count });
    
    this.generateNewQuestion();
    this.startTimer();
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  // 生成新题目
  generateNewQuestion() {
    const { mode, modeConfig } = this.data;
    const config = modeConfig[mode];
    
    // 生成目标数字
    const targetNumber = this.randomInt(config.min, config.max);
    
    this.setData({
      targetNumber,
      currentQuestion: {
        target: targetNumber,
        mode: mode,
        inputCount: config.inputs
      },
      input1: '',
      input2: '',
      input3: ''
    });
  },

  // 生成随机整数
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 开始计时
  startTimer() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.setData({
        elapsedTime: elapsed
      });
    }, 1000);
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 输入框改变
  onInput1Change(e) {
    this.setData({ input1: e.detail.value });
  },

  onInput2Change(e) {
    this.setData({ input2: e.detail.value });
  },

  onInput3Change(e) {
    this.setData({ input3: e.detail.value });
  },

  // 提交答案
  submitAnswer() {
    const { input1, input2, input3, targetNumber, currentQuestion, mode } = this.data;
    
    // 验证输入
    if (!input1 || !input2) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '请填写所有答案'
      });
      return;
    }

    if (mode === 'triple' && !input3) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '请填写所有答案'
      });
      return;
    }

    const num1 = parseInt(input1);
    const num2 = parseInt(input2);
    const num3 = mode === 'triple' ? parseInt(input3) : 0;

    // 验证非零（除了可能的第三个数）
    if (num1 === 0 || num2 === 0 || (mode === 'triple' && num3 === 0)) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '加数不能为0'
      });
      return;
    }

    // 验证答案
    let isCorrect = false;
    let sum = 0;
    
    if (mode === 'triple') {
      sum = num1 + num2 + num3;
      isCorrect = sum === targetNumber;
    } else {
      sum = num1 + num2;
      isCorrect = sum === targetNumber;
    }

    // 记录答案
    this.data.answers.push({
      target: targetNumber,
      userAnswer: mode === 'triple' ? [num1, num2, num3] : [num1, num2],
      isCorrect,
      mode
    });

    if (isCorrect) {
      this.data.correctCount++;
    }

    // 显示反馈
    this.showAnswerFeedback(isCorrect, sum);

    // 震动反馈
    wx.vibrateShort({
      type: isCorrect ? 'light' : 'medium'
    });

    // 1.2秒后进入下一题或结束
    setTimeout(() => {
      this.nextQuestion();
    }, 1200);
  },

  // 显示答题反馈
  showAnswerFeedback(isCorrect, userSum) {
    const { targetNumber } = this.data;
    
    this.setData({
      showFeedback: true,
      feedbackType: isCorrect ? 'correct' : 'wrong',
      feedbackMessage: isCorrect 
        ? '回答正确！' 
        : `你的答案：${userSum}，正确答案：${targetNumber}`
    });

    setTimeout(() => {
      this.setData({
        showFeedback: false
      });
    }, 1200);
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, totalCount } = this.data;

    if (currentIndex + 1 < totalCount) {
      this.setData({
        currentIndex: currentIndex + 1
      });
      this.generateNewQuestion();
    } else {
      this.finishPractice();
    }
  },

  // 完成练习
  finishPractice() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    const { answers, correctCount, totalCount, elapsedTime } = this.data;
    const correctRate = Math.round((correctCount / totalCount) * 100);

    // 保存记录
    this.savePracticeRecord({
      type: 'decompose',
      answers,
      correctCount,
      totalCount,
      correctRate,
      duration: elapsedTime
    });

    // 跳转到结果页
    wx.redirectTo({
      url: `/pages/result/index?correctCount=${correctCount}&totalCount=${totalCount}&correctRate=${correctRate}&duration=${elapsedTime}`
    });
  },

  // 保存练习记录
  savePracticeRecord(record) {
    let practiceRecords = wx.getStorageSync('practiceRecords') || [];
    
    practiceRecords.unshift({
      id: `pr_${Date.now()}`,
      createTime: Date.now(),
      ...record
    });

    if (practiceRecords.length > 100) {
      practiceRecords = practiceRecords.slice(0, 100);
    }

    wx.setStorageSync('practiceRecords', practiceRecords);
  }
});
