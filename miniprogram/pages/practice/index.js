// pages/practice/index.js
import Message from 'tdesign-miniprogram/message/index';
import { generateQuestions } from '../../utils/gradeApi';

Page({
  data: {
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    totalCount: 0,
    count: 20, // ✅ 新增：题目数量
    userAnswer: '',
    answers: [], // 用户答案记录
    correctCount: 0,
    elapsedTime: 0,
    progress: 0,
    showFeedback: false,
    feedbackType: '', // 'correct' or 'wrong'
    gradeKey: '',
    categoryId: '',
    categoryName: '',
    loading: true,
    settings: {  // ✅ 新增：练习设置
      soundEnabled: true,
      vibrateEnabled: true,
      type: ''  // 题型标识
    }
  },

  timer: null,
  startTime: 0,

  async onLoad(options) {
    // ✅ 添加详细日志
    console.log('🔍 练习页面参数:', options);
    
    const { gradeKey, categoryId, categoryName, count } = options;
    
    // ✅ 增强参数验证
    if (!gradeKey) {
      console.error('❌ 缺少 gradeKey 参数');
      Message.error({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '年级参数缺失'
      });
      setTimeout(() => wx.navigateBack(), 2000);
      return;
    }

    if (!categoryId) {
      console.error('❌ 缺少 categoryId 参数');
      Message.error({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '题型参数缺失'
      });
      setTimeout(() => wx.navigateBack(), 2000);
      return;
    }

    this.setData({
      gradeKey,
      categoryId,
      categoryName: decodeURIComponent(categoryName || ''),
      count: parseInt(count) || 20,  // ✅ 接收题目数量参数
      'settings.type': categoryId  // ✅ 设置题型标识
    });

    console.log('✅ 页面数据初始化完成:', {
      gradeKey: this.data.gradeKey,
      categoryId: this.data.categoryId,
      count: this.data.count,
      settingsType: this.data.settings.type
    });

    // 使用云函数生成题目
    await this.generateQuestionsFromCloud();
  },

  async generateQuestionsFromCloud() {
    wx.showLoading({ title: '生成题目中...' });

    try {
      // ✅ 添加详细日志
      console.group('📝 题目生成流程');
      console.log('1️⃣ 调用参数:', {
        gradeKey: this.data.gradeKey,
        categoryId: this.data.categoryId,
        count: this.data.count || 20
      });

      const res = await generateQuestions(
        this.data.gradeKey, 
        this.data.categoryId, 
        this.data.count || 20  // ✅ 使用传入的题目数量
      );

      console.log('2️⃣ 云函数响应:', res);

      // ✅ 增强错误检查
      if (!res) {
        throw new Error('云函数无响应，请检查网络连接');
      }

      if (!res.success) {
        throw new Error(res.error || '云函数返回失败');
      }

      if (!res.data || !res.data.questions) {
        throw new Error('返回数据格式错误');
      }

      if (res.data.questions.length === 0) {
        throw new Error('题目生成数量为0，请检查年级和题型配置');
      }

      const questions = res.data.questions;
      console.log('3️⃣ 题目数量:', questions.length);
      console.log('4️⃣ 第一题:', questions[0]);
      
      this.setData({
        questions,
        totalCount: questions.length,
        currentQuestion: questions[0],
        loading: false
      });

      console.log('5️⃣ setData 完成，当前题目:', this.data.currentQuestion);
      console.groupEnd();

      // 初始化答案记录
      this.data.answers = new Array(questions.length).fill(null);

      // 开始计时
      this.startTimer();

      // 加载设置
      this.loadSettings();

      // ✅ 显示成功提示
      Message.success({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: `已生成${questions.length}道题目`
      });

    } catch (error) {
      console.error('❌ 生成题目失败:', error);
      console.groupEnd();
      
      // ✅ 显示具体错误信息
      const errorMsg = error.message || '未知错误';
      
      wx.showModal({
        title: '题目生成失败',
        content: errorMsg + '\n\n可能原因：\n1. 云函数未部署\n2. 网络连接异常\n3. 参数配置错误',
        confirmText: '重试',
        cancelText: '返回',
        success: (res) => {
          if (res.confirm) {
            // 重试
            this.generateQuestionsFromCloud();
          } else {
            wx.navigateBack();
          }
        }
      });
    } finally {
      wx.hideLoading();
    }
  },

  onUnload() {
    // 清除计时器
    if (this.timer) {
      clearInterval(this.timer);
    }
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

  // 加载用户设置
  loadSettings() {
    const settings = wx.getStorageSync('settings') || {
      soundEnabled: true,
      vibrateEnabled: true
    };
    this.userSettings = settings;
    
    // ✅ 同步到 data 中
    this.setData({
      'settings.soundEnabled': settings.soundEnabled,
      'settings.vibrateEnabled': settings.vibrateEnabled
    });
  },

  // 输入数字
  inputNumber(e) {
    const num = e.currentTarget.dataset.num;
    const currentAnswer = this.data.userAnswer + num.toString();
    
    // 限制最大位数（避免输入过长）
    if (currentAnswer.length <= 8) {
      this.setData({
        userAnswer: currentAnswer
      });
    }
  },

  // 删除数字
  deleteNumber() {
    const currentAnswer = this.data.userAnswer;
    if (currentAnswer.length > 0) {
      this.setData({
        userAnswer: currentAnswer.slice(0, -1)
      });
    }
  },

  // 提交答案
  submitAnswer() {
    const { userAnswer, currentQuestion, currentIndex } = this.data;

    if (!userAnswer) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '请输入答案'
      });
      return;
    }

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer;

    // 记录答案
    this.data.answers[currentIndex] = {
      questionId: currentQuestion.id,
      question: currentQuestion.expression,
      correctAnswer: currentQuestion.answer,
      userAnswer: parseInt(userAnswer),
      isCorrect,
      type: this.data.settings.type
    };

    if (isCorrect) {
      this.data.correctCount++;
    }

    // 显示反馈动画
    this.showAnswerFeedback(isCorrect);

    // 震动反馈
    if (this.userSettings?.vibrateEnabled) {
      wx.vibrateShort({
        type: isCorrect ? 'light' : 'medium'
      });
    }

    // 1秒后进入下一题
    setTimeout(() => {
      this.nextQuestion();
    }, 1200);
  },

  // 显示答题反馈
  showAnswerFeedback(isCorrect) {
    this.setData({
      showFeedback: true,
      feedbackType: isCorrect ? 'correct' : 'wrong'
    });

    setTimeout(() => {
      this.setData({
        showFeedback: false
      });
    }, 1200);
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, totalCount, questions } = this.data;

    if (currentIndex + 1 < totalCount) {
      // 还有题目，继续
      const nextIndex = currentIndex + 1;
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: questions[nextIndex],
        userAnswer: '',
        progress: ((nextIndex + 1) / totalCount) * 100
      });
    } else {
      // 全部完成，跳转到结果页
      this.finishPractice();
    }
  },

  // 完成练习
  finishPractice() {
    // 停止计时
    if (this.timer) {
      clearInterval(this.timer);
    }

    const { answers, correctCount, totalCount, elapsedTime, settings } = this.data;
    const correctRate = Math.round((correctCount / totalCount) * 100);

    // 保存练习记录
    this.savePracticeRecord({
      answers,
      correctCount,
      totalCount,
      correctRate,
      duration: elapsedTime,
      settings
    });

    // 保存错题
    this.saveMistakes(answers);

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
      questions: this.data.questions,
      ...record
    });

    // 只保留最近100条记录
    if (practiceRecords.length > 100) {
      practiceRecords = practiceRecords.slice(0, 100);
    }

    wx.setStorageSync('practiceRecords', practiceRecords);
  },

  // 保存错题
  saveMistakes(answers) {
    let mistakes = wx.getStorageSync('mistakes') || [];

    // 筛选错题
    const wrongAnswers = answers.filter(a => !a.isCorrect);

    wrongAnswers.forEach(answer => {
      mistakes.push({
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question: answer.question,
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        type: answer.type,
        createTime: Date.now(),
        masteredAt: null // 未掌握
      });
    });

    wx.setStorageSync('mistakes', mistakes);
  }
});
