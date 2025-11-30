// pages/unit/index.js
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    unitType: 'length', // length, weight, money, time
    currentQuestion: null,
    
    // 用户输入（支持多输入框）
    answer1: '',
    answer2: '',
    
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
    feedbackType: '',
    loading: false,
    
    // 单位配置
    unitConfig: {
      length: {
        name: '长度单位',
        icon: 'ruler',
        color: '#4A90E2',
        conversions: [
          { from: '米', to: '厘米', rate: 100, symbol1: '米', symbol2: '厘米' },
          { from: '厘米', to: '米', rate: 0.01, symbol1: '厘米', symbol2: '米' }
        ]
      },
      weight: {
        name: '重量单位',
        icon: 'gift',
        color: '#27AE60',
        conversions: [
          { from: '千克', to: '克', rate: 1000, symbol1: '千克', symbol2: '克' },
          { from: '克', to: '千克', rate: 0.001, symbol1: '克', symbol2: '千克' }
        ]
      },
      money: {
        name: '人民币单位',
        icon: 'wallet',
        color: '#FF6B35',
        conversions: [
          { from: '元', to: '角', rate: 10, symbol1: '元', symbol2: '角' },
          { from: '角', to: '分', rate: 10, symbol1: '角', symbol2: '分' },
          { from: '元', to: '分', rate: 100, symbol1: '元', symbol2: '分' }
        ]
      },
      time: {
        name: '时间单位',
        icon: 'time',
        color: '#9B59B6',
        conversions: [
          { from: '时', to: '分', rate: 60, symbol1: '时', symbol2: '分' },
          { from: '分', to: '秒', rate: 60, symbol1: '分', symbol2: '秒' },
          { from: '年', to: '月', rate: 12, symbol1: '年', symbol2: '月' }
        ]
      }
    }
  },

  timer: null,

  onLoad(options) {
    const { type = 'length', count = 20 } = options;
    
    this.setData({
      unitType: type,
      totalCount: parseInt(count)
    });

    console.log('单位换算练习页面参数:', { type, count });
    
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
    const { unitType, unitConfig } = this.data;
    const config = unitConfig[unitType];
    
    // 随机选择一个换算类型
    const conversion = config.conversions[this.randomInt(0, config.conversions.length - 1)];
    
    // 生成题目类型：simple(简单换算) 或 complex(复杂换算，仅限部分类型)
    const questionType = this.randomInt(0, 100) > 70 && conversion.rate >= 100 ? 'complex' : 'simple';
    
    let question;
    if (questionType === 'simple') {
      question = this.generateSimpleQuestion(conversion);
    } else {
      question = this.generateComplexQuestion(conversion);
    }
    
    this.setData({
      currentQuestion: question,
      answer1: '',
      answer2: ''
    });
  },

  // 生成简单换算题（如：5米=?厘米）
  generateSimpleQuestion(conversion) {
    const sourceValue = this.randomInt(1, 10);
    const targetValue = sourceValue * conversion.rate;
    
    return {
      type: 'simple',
      sourceValue,
      sourceUnit: conversion.from,
      targetUnit: conversion.to,
      correctAnswer: targetValue,
      displayText: `${sourceValue}${conversion.from} = ? ${conversion.to}`,
      answerCount: 1
    };
  },

  // 生成复杂换算题（如：120厘米=?米?厘米）
  generateComplexQuestion(conversion) {
    // 仅限大单位转小单位且倍率>=100
    if (conversion.rate < 100) {
      return this.generateSimpleQuestion(conversion);
    }
    
    // 生成一个不能整除的数
    const totalSmallUnits = this.randomInt(conversion.rate + 1, conversion.rate * 10);
    const largeUnits = Math.floor(totalSmallUnits / conversion.rate);
    const remainingSmallUnits = totalSmallUnits % conversion.rate;
    
    return {
      type: 'complex',
      sourceValue: totalSmallUnits,
      sourceUnit: conversion.to,
      targetUnit1: conversion.from,
      targetUnit2: conversion.to,
      correctAnswer1: largeUnits,
      correctAnswer2: remainingSmallUnits,
      displayText: `${totalSmallUnits}${conversion.to} = ? ${conversion.from} ? ${conversion.to}`,
      answerCount: 2
    };
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
  onAnswer1Change(e) {
    const value = e.detail.value;
    console.log('答案1输入:', value, '类型:', typeof value);
    this.setData({ answer1: value });
  },

  onAnswer2Change(e) {
    const value = e.detail.value;
    console.log('答案2输入:', value, '类型:', typeof value);
    this.setData({ answer2: value });
  },

  // 提交答案
  submitAnswer() {
    const { answer1, answer2, currentQuestion } = this.data;
    
    // 修复：使用严格检查，允许输入0
    if (answer1 === '' || answer1 === null || answer1 === undefined) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '请填写答案'
      });
      return;
    }

    if (currentQuestion.answerCount === 2 && (answer2 === '' || answer2 === null || answer2 === undefined)) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '请填写所有答案'
      });
      return;
    }

    const userAnswer1 = parseFloat(answer1);
    const userAnswer2 = currentQuestion.answerCount === 2 ? parseFloat(answer2) : 0;

    // 验证答案
    let isCorrect = false;
    if (currentQuestion.type === 'simple') {
      isCorrect = userAnswer1 === currentQuestion.correctAnswer;
    } else {
      isCorrect = userAnswer1 === currentQuestion.correctAnswer1 && 
                  userAnswer2 === currentQuestion.correctAnswer2;
    }

    // 记录答案
    this.data.answers.push({
      question: currentQuestion.displayText,
      userAnswer: currentQuestion.answerCount === 2 ? [userAnswer1, userAnswer2] : userAnswer1,
      correctAnswer: currentQuestion.type === 'simple' 
        ? currentQuestion.correctAnswer 
        : [currentQuestion.correctAnswer1, currentQuestion.correctAnswer2],
      isCorrect
    });

    if (isCorrect) {
      this.data.correctCount++;
    }

    // 显示反馈
    this.showAnswerFeedback(isCorrect);

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
  showAnswerFeedback(isCorrect) {
    const { currentQuestion } = this.data;
    
    let correctAnswerText = '';
    if (currentQuestion.type === 'simple') {
      correctAnswerText = `${currentQuestion.correctAnswer}`;
    } else {
      correctAnswerText = `${currentQuestion.correctAnswer1}${currentQuestion.targetUnit1}${currentQuestion.correctAnswer2}${currentQuestion.targetUnit2}`;
    }
    
    this.setData({
      showFeedback: true,
      feedbackType: isCorrect ? 'correct' : 'wrong',
      feedbackMessage: isCorrect ? '回答正确！' : `正确答案：${correctAnswerText}`
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
      type: 'unit',
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
