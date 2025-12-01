// pages/pdfGenerator/index.js
import Message from 'tdesign-miniprogram/message/index';
import PDFGenerator from '../../utils/pdfGenerator';

Page({
  data: {
    // 年级选项
    gradeOptions: [
      { value: 'grade_1', label: '一年级' },
      { value: 'grade_2', label: '二年级' },
      { value: 'grade_3', label: '三年级' },
      { value: 'grade_4', label: '四年级' },
      { value: 'grade_5', label: '五年级' },
      { value: 'grade_6', label: '六年级' }
    ],
    selectedGrade: 'grade_1',
    
    // 题型选项
    categoryOptions: [
      { value: 'addition', label: '加法', icon: 'add' },
      { value: 'subtraction', label: '减法', icon: 'remove' },
      { value: 'multiplication', label: '乘法', icon: 'close' },
      { value: 'division', label: '除法', icon: 'slash' },
      { value: 'mixed', label: '混合运算', icon: 'layers' }
    ],
    selectedCategories: ['addition'],
    
    // 智能分配
    smartAllocation: false,
    
    // 题目数量选项
    questionCountOptions: [20, 30, 50, 80, 100],
    questionCount: 50,
    
    // 试卷配置
    paperTitle: '口算练习题',
    showAnswer: false,
    
    // 列数选项
    columnOptions: [
      { value: 2, label: '2列' },
      { value: 3, label: '3列' },
      { value: 4, label: '4列' },
      { value: 5, label: '5列' }
    ],
    columnCount: 3,
    
    // 生成状态
    generating: false,
    
    // 预览数据
    previewVisible: false,
    previewImageUrl: '',
    
    // 题目预览
    questions: []
  },

  onLoad(options) {
    console.log('PDF生成页面加载，参数:', options);
    
    // 从首页传来的参数
    if (options.grade) {
      this.setData({ selectedGrade: options.grade });
    }
    if (options.count) {
      this.setData({ questionCount: parseInt(options.count) });
    }
    
    console.log('初始数据:', {
      selectedGrade: this.data.selectedGrade,
      selectedCategories: this.data.selectedCategories,
      questionCount: this.data.questionCount,
      columnCount: this.data.columnCount
    });
  },

  onShow() {
    console.log('页面显示，当前选中题型:', this.data.selectedCategories);
  },

  // 选择年级 - 网格点击
  onGradeSelect(e) {
    const grade = e.currentTarget.dataset.grade;
    this.setData({ selectedGrade: grade });
    console.log('选择年级:', grade);
  },

  // 选择年级 - 兼容原方法
  onGradeChange(e) {
    this.setData({ selectedGrade: e.detail.value });
  },

  // 智能分配切换
  onSmartAllocationToggle() {
    const newValue = !this.data.smartAllocation;
    this.setData({ smartAllocation: newValue });
    
    if (newValue) {
      // 启用智能分配，根据年级自动配置题型
      const smartCategories = this.getSmartCategories(this.data.selectedGrade);
      this.setData({ selectedCategories: smartCategories });
      
      Message.success({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '已启用智能分配，系统将自动配比题型'
      });
    } else {
      Message.info({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '已关闭智能分配，请手动选择题型'
      });
    }
    
    console.log('智能分配:', newValue, '题型:', this.data.selectedCategories);
  },

  // 根据年级获取智能题型配置
  getSmartCategories(grade) {
    const gradeConfigs = {
      'grade_1': ['addition', 'subtraction'],
      'grade_2': ['addition', 'subtraction', 'mixed'],
      'grade_3': ['addition', 'subtraction', 'multiplication'],
      'grade_4': ['multiplication', 'division', 'mixed'],
      'grade_5': ['multiplication', 'division', 'mixed'],
      'grade_6': ['addition', 'subtraction', 'multiplication', 'division', 'mixed']
    };
    
    return gradeConfigs[grade] || ['addition'];
  },

  // 选择题型
  onCategoryToggle(e) {
    // 如果启用了智能分配，禁止手动选择
    if (this.data.smartAllocation) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 1500,
        content: '智能分配模式下无法手动选择题型'
      });
      return;
    }
    
    const category = e.currentTarget.dataset.category;
    let selectedCategories = [...this.data.selectedCategories];
    const index = selectedCategories.indexOf(category);
    
    console.log('点击题型:', category, '当前选中:', selectedCategories);
    
    if (index > -1) {
      // 至少保留一个题型
      if (selectedCategories.length > 1) {
        selectedCategories.splice(index, 1);
        console.log('取消选择:', category);
      } else {
        Message.warning({
          context: this,
          offset: [20, 32],
          duration: 1500,
          content: '至少选择一个题型'
        });
        return;
      }
    } else {
      selectedCategories.push(category);
      console.log('添加选择:', category);
    }
    
    console.log('更新后的选中题型:', selectedCategories);
    this.setData({ selectedCategories });
  },

  // 题目数量改变
  onQuestionCountChange(e) {
    const count = parseInt(e.detail.value) || 10;
    console.log('题目数量改变:', count);
    this.setData({ questionCount: count });
  },

  // 列数选择 - 网格点击
  onColumnSelect(e) {
    const column = parseInt(e.currentTarget.dataset.column);
    this.setData({ columnCount: column });
    console.log('选择列数:', column);
  },

  // 列数改变 - 兼容原方法
  onColumnCountChange(e) {
    const column = parseInt(e.detail.value) || 3;
    console.log('列数改变:', column);
    this.setData({ columnCount: column });
  },

  // 试卷标题改变
  onTitleInput(e) {
    const title = e.detail.value || '';
    this.setData({ paperTitle: title });
  },

  // 是否显示答案
  onShowAnswerChange(e) {
    this.setData({ showAnswer: e.detail.value });
  },

  // 生成试卷
  async generatePaper() {
    const { selectedGrade, selectedCategories, questionCount, paperTitle } = this.data;
    
    console.log('=== 开始生成试卷 ===');
    console.log('配置信息:', {
      年级: selectedGrade,
      题型: selectedCategories,
      题目数量: questionCount,
      标题: paperTitle
    });
    
    if (!paperTitle.trim()) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '请输入试卷标题'
      });
      return;
    }
    
    if (!selectedCategories || selectedCategories.length === 0) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '请至少选择一个题型'
      });
      return;
    }

    this.setData({ generating: true });

    try {
      console.log('步骤1: 生成题目');
      const questions = await this.generateQuestions();
      
      if (!questions || questions.length === 0) {
        throw new Error('题目生成失败，没有生成任何题目');
      }
      
      console.log(`题目生成成功，共${questions.length}道题`);
      console.log('题目示例:', questions.slice(0, 3));
      
      // 2. 生成PDF
      console.log('步骤2: 生成PDF');
      await this.createPDF(questions);
      
      console.log('试卷生成成功！');
      Message.success({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '试卷生成成功！已保存到相册'
      });
      
    } catch (error) {
      console.error('生成试卷失败:', error);
      Message.error({
        context: this,
        offset: [20, 32],
        duration: 3000,
        content: `生成失败：${error.message || '未知错误'}`
      });
    } finally {
      this.setData({ generating: false });
    }
  },

  // 生成题目
  async generateQuestions() {
    const { selectedGrade, selectedCategories, questionCount } = this.data;
    
    // 检查是否初始化了云开发
    const hasCloud = typeof wx.cloud !== 'undefined' && wx.cloud;
    
    if (!hasCloud) {
      console.log('云开发未初始化，使用本地生成');
      return this.generateQuestionsLocally();
    }
    
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'gradeEngine',
        data: {
          action: 'generateQuestions',
          gradeKey: this.convertToCloudFormat(selectedGrade),
          categories: selectedCategories,
          count: questionCount
        },
        success: (res) => {
          console.log('云函数返回结果:', res);
          if (res.result && res.result.success && res.result.data && res.result.data.length > 0) {
            const questions = res.result.data;
            this.setData({ questions });
            resolve(questions);
          } else {
            // 云函数返回失败，使用本地生成
            console.log('云函数返回失败，使用本地生成');
            const questions = this.generateQuestionsLocally();
            this.setData({ questions });
            resolve(questions);
          }
        },
        fail: (err) => {
          console.error('云函数调用失败:', err);
          // 使用本地生成作为降级方案
          const questions = this.generateQuestionsLocally();
          this.setData({ questions });
          resolve(questions);
        }
      });
    });
  },

  // 本地生成题目（降级方案）
  generateQuestionsLocally() {
    const { selectedCategories, questionCount } = this.data;
    
    // 验证题型选择
    if (!selectedCategories || selectedCategories.length === 0) {
      console.error('未选择题型，使用默认加法题型');
      this.setData({ selectedCategories: ['addition'] });
      return this.generateQuestionsLocally();
    }
    
    const questions = [];
    
    console.log(`本地生成题目：数量=${questionCount}，题型=${selectedCategories.join(',')}`);
    
    // 计算每种题型应该生成的题目数量
    const countPerCategory = Math.floor(questionCount / selectedCategories.length);
    const remainder = questionCount % selectedCategories.length;
    
    // 为每种题型生成题目
    selectedCategories.forEach((category, index) => {
      const count = countPerCategory + (index < remainder ? 1 : 0);
      console.log(`生成${category}题型，数量：${count}`);
      
      for (let i = 0; i < count; i++) {
        const question = this.generateSingleQuestion(category);
        questions.push(question);
      }
    });
    
    // 打乱题目顺序
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    console.log(`生成完成，共${questions.length}道题，题型分布:`, 
      selectedCategories.map(cat => `${cat}=${questions.filter(q => q.category === cat).length}`).join(', ')
    );
    
    return questions;
  },

  // 生成单个题目
  generateSingleQuestion(category) {
    let expression, answer;
    
    switch (category) {
      case 'addition':
        const num1 = Math.floor(Math.random() * 50) + 1;
        const num2 = Math.floor(Math.random() * 50) + 1;
        expression = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
        
      case 'subtraction':
        const n1 = Math.floor(Math.random() * 50) + 20;
        const n2 = Math.floor(Math.random() * n1);
        expression = `${n1} - ${n2}`;
        answer = n1 - n2;
        break;
        
      case 'multiplication':
        const m1 = Math.floor(Math.random() * 9) + 1;
        const m2 = Math.floor(Math.random() * 9) + 1;
        expression = `${m1} × ${m2}`;
        answer = m1 * m2;
        break;
        
      case 'division':
        const d2 = Math.floor(Math.random() * 9) + 1;
        const d1 = d2 * (Math.floor(Math.random() * 9) + 1);
        expression = `${d1} ÷ ${d2}`;
        answer = d1 / d2;
        break;
        
      case 'mixed':
        // 混合运算：随机选择加减或乘除
        if (Math.random() > 0.5) {
          const a = Math.floor(Math.random() * 20) + 1;
          const b = Math.floor(Math.random() * 20) + 1;
          const c = Math.floor(Math.random() * 10) + 1;
          expression = `${a} + ${b} - ${c}`;
          answer = a + b - c;
        } else {
          const a = Math.floor(Math.random() * 9) + 1;
          const b = Math.floor(Math.random() * 9) + 1;
          const c = Math.floor(Math.random() * 5) + 1;
          expression = `${a} × ${b} + ${c}`;
          answer = a * b + c;
        }
        break;
        
      default:
        console.warn('未知题型:', category, '使用默认加法');
        expression = '10 + 5';
        answer = 15;
    }
    
    return {
      category: category,      // 添加题型标识
      expression: expression,
      displayQuestion: `${expression} = `,
      answer: answer
    };
  },

  // 创建PDF
  async createPDF(questions) {
    const { paperTitle, showAnswer, columnCount, selectedGrade } = this.data;
    
    try {
      // 使用PDF生成工具类
      const tempFilePath = await PDFGenerator.generate({
        title: paperTitle,
        questions: questions,
        showAnswer: showAnswer,
        columnCount: columnCount,
        grade: this.getGradeLabel(selectedGrade)
      });
      
      // 保存到相册
      await PDFGenerator.saveToAlbum(tempFilePath);
      
      // 预览
      PDFGenerator.preview(tempFilePath);
      
      return tempFilePath;
    } catch (error) {
      console.error('创建PDF失败:', error);
      throw error;
    }
  },

  // 获取年级标签
  getGradeLabel(gradeValue) {
    const grade = this.data.gradeOptions.find(g => g.value === gradeValue);
    return grade ? grade.label : '一年级';
  },

  // 转换年级格式
  convertToCloudFormat(gradeKey) {
    const cloudMapping = {
      'grade_1': 'grade_1_2',
      'grade_2': 'grade_1_2',
      'grade_3': 'grade_3_4',
      'grade_4': 'grade_3_4',
      'grade_5': 'grade_5_6',
      'grade_6': 'grade_5_6'
    };
    return cloudMapping[gradeKey] || 'grade_1_2';
  }
});
