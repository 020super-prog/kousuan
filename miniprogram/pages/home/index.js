// pages/home/index.js
import Message from 'tdesign-miniprogram/message/index';
import { getAllGrades, getCategoriesByGrade, getGradeName, getDifficultyInfo } from '../../utils/gradeApi';

Page({
  data: {
    userName: '',
    todayCount: 0,
    correctRate: 0,
    mistakeCount: 0,
    // 年级数据 - 明确展示1-6年级
    gradeOptions: [
      { value: 'grade_1', name: '一年级', number: '一' },
      { value: 'grade_2', name: '二年级', number: '二' },
      { value: 'grade_3', name: '三年级', number: '三' },
      { value: 'grade_4', name: '四年级', number: '四' },
      { value: 'grade_5', name: '五年级', number: '五' },
      { value: 'grade_6', name: '六年级', number: '六' }
    ],
    selectedGrade: '',
    selectedGradeName: '',
    categories: [],
    // 题目数量选择
    countPresets: [
      { value: 10, label: '10道题' },
      { value: 20, label: '20道题' },
      { value: 50, label: '50道题' }
    ],
    selectedCount: 20, // 默认20道题
    isCustomCount: false, // 是否自定义数量
    customCountValue: '', // 自定义数量输入值
    // 快捷练习数据(根据年级动态生成)
    quickPractices: []
  },

  onLoad() {
    this.loadUserInfo();
    this.loadStatistics();
    this.loadSelectedGrade();
    this.loadSelectedCount();
  },

  onShow() {
    // 每次显示页面时刷新统计数据
    this.loadStatistics();
    
    // 更新自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      });
    }
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.nickName) {
      this.setData({
        userName: userInfo.nickName
      });
    }
  },

  // 加载统计数据
  loadStatistics() {
    // 从本地存储获取今日练习数据
    const today = new Date().toDateString();
    const practiceRecords = wx.getStorageSync('practiceRecords') || [];
    
    // 筛选今日记录
    const todayRecords = practiceRecords.filter(record => {
      return new Date(record.createTime).toDateString() === today;
    });

    // 计算今日练习题数
    let todayCount = 0;
    let totalQuestions = 0;
    let correctQuestions = 0;

    todayRecords.forEach(record => {
      todayCount += record.questions.length;
      totalQuestions += record.questions.length;
      correctQuestions += record.correctCount || 0;
    });

    // 计算正确率
    const correctRate = totalQuestions > 0 
      ? Math.round((correctQuestions / totalQuestions) * 100) 
      : 0;

    // 获取错题数量
    const mistakes = wx.getStorageSync('mistakes') || [];
    const unmastered = mistakes.filter(m => !m.masteredAt);

    this.setData({
      todayCount,
      correctRate,
      mistakeCount: unmastered.length
    });
  },

  // 加载已选择的年级
  async loadSelectedGrade() {
    // 从本地存储获取上次选择的年级，默认为一年级
    let gradeKey = wx.getStorageSync('selectedGrade') || 'grade_1';
    
    // 将旧格式转换为新格式
    const gradeMapping = {
      'grade_1_2': 'grade_1',
      'grade_3_4': 'grade_3',
      'grade_5_6': 'grade_5'
    };
    
    if (gradeMapping[gradeKey]) {
      gradeKey = gradeMapping[gradeKey];
      wx.setStorageSync('selectedGrade', gradeKey);
    }
    
    // 获取年级名称
    const gradeOption = this.data.gradeOptions.find(g => g.value === gradeKey);
    const gradeName = gradeOption ? gradeOption.name : '一年级';
    
    this.setData({
      selectedGrade: gradeKey,
      selectedGradeName: gradeName
    });

    // 加载该年级的题型（兼容云函数格式）
    await this.loadCategories(this.convertToCloudFormat(gradeKey));
  },

  // 加载已选择的题目数量
  loadSelectedCount() {
    const savedCount = wx.getStorageSync('selectedCount');
    if (savedCount && savedCount > 0) {
      // 检查是否是预设值
      const isPreset = this.data.countPresets.some(p => p.value === savedCount);
      this.setData({
        selectedCount: savedCount,
        isCustomCount: !isPreset,
        customCountValue: isPreset ? '' : savedCount.toString()
      });
    }
  },

  // 转换为云函数格式（兼容旧的年级分组）
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
  },

  // 加载指定年级的题型列表
  async loadCategories(gradeKey) {
    try {
      const res = await getCategoriesByGrade(gradeKey);
      if (res.success) {
        const categories = res.data.map(cat => ({
          ...cat,
          difficultyInfo: getDifficultyInfo(cat.difficulty)
        }));

        // 生成快捷练习数据（取前6个题型）
        const quickPractices = categories.slice(0, 6).map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: this.getCategoryIcon(cat.id),
          difficulty: cat.difficulty,
          difficultyInfo: cat.difficultyInfo
        }));

        this.setData({
          categories,
          quickPractices
        });
      }
    } catch (error) {
      console.error('加载题型失败:', error);
    }
  },

  // 根据题型ID获取图标
  getCategoryIcon(categoryId) {
    const iconMap = {
      'addition': 'add',
      'addition_advanced': 'add',
      'subtraction': 'remove',
      'subtraction_advanced': 'remove',
      'multiplication': 'close',
      'mixed_operations': 'layers',
      'mixed_operations_advanced': 'layers',
      'mixed_advanced': 'layers',
      'decimals_advanced': 'precise-monitor',
      'fractions_advanced': 'chart-pie',
      'measurement_basic': 'ruler',
      'measurement_intermediate': 'ruler',
      'measurement_advanced': 'ruler'
    };
    return iconMap[categoryId] || 'calculation';
  },

  // 选择年级
  async selectGrade(e) {
    const gradeValue = e.currentTarget.dataset.value;
    const gradeName = e.currentTarget.dataset.name;
    
    console.log('选择年级:', gradeValue, gradeName);
    
    // 保存选择
    wx.setStorageSync('selectedGrade', gradeValue);
    
    this.setData({
      selectedGrade: gradeValue,
      selectedGradeName: gradeName
    });

    // 重新加载题型（转换为云函数格式）
    const cloudGradeKey = this.convertToCloudFormat(gradeValue);
    await this.loadCategories(cloudGradeKey);

    Message.success({
      context: this,
      offset: [20, 32],
      duration: 1500,
      content: `已切换到${gradeName}`
    });
  },

  // 选择题目数量
  selectCount(e) {
    const count = e.currentTarget.dataset.value;
    
    console.log('选择题目数量:', count);
    
    // 保存选择
    wx.setStorageSync('selectedCount', count);
    
    this.setData({
      selectedCount: count,
      isCustomCount: false,
      customCountValue: ''
    });

    Message.success({
      context: this,
      offset: [20, 32],
      duration: 1500,
      content: `已设置为${count}道题`
    });
  },

  // 显示自定义数量输入
  showCustomCountInput() {
    this.setData({
      isCustomCount: true,
      customCountValue: this.data.selectedCount.toString()
    });
  },

  // 自定义数量输入
  onCustomCountInput(e) {
    this.setData({
      customCountValue: e.detail.value
    });
  },

  // 确认自定义数量
  confirmCustomCount() {
    const count = parseInt(this.data.customCountValue);
    
    if (!count || count < 1 || count > 200) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '请输入1-200之间的数字'
      });
      return;
    }

    // 保存自定义数量
    wx.setStorageSync('selectedCount', count);
    
    this.setData({
      selectedCount: count,
      isCustomCount: false
    });

    Message.success({
      context: this,
      offset: [20, 32],
      duration: 1500,
      content: `已设置为${count}道题`
    });
  },

  // 取消自定义数量
  cancelCustomCount() {
    this.setData({
      isCustomCount: false,
      customCountValue: ''
    });
  },

  // 开始快捷练习（使用云函数）
  startPractice(e) {
    const categoryId = e.currentTarget.dataset.id;
    const categoryName = e.currentTarget.dataset.name;
    
    if (!this.data.selectedGrade) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '请先选择年级'
      });
      return;
    }

    // 转换为云函数格式
    const cloudGradeKey = this.convertToCloudFormat(this.data.selectedGrade);
    
    // 跳转到练习页面，传递年级、题型和题目数量信息
    wx.navigateTo({
      url: `/pages/practice/index?gradeKey=${cloudGradeKey}&categoryId=${categoryId}&categoryName=${categoryName}&count=${this.data.selectedCount}`
    });
  },

  // 自定义练习
  customPractice() {
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '自定义练习功能开发中...'
    });
    // TODO: 跳转到自定义设置页面
  },

  // 跳转到数的分解页面
  goToDecompose(e) {
    const mode = e.currentTarget.dataset.mode;
    
    // 根据模式选择对应的练习类型
    let practiceMode = 'basic'; // 默认10以内
    if (mode === 'split') {
      // 分解练习：根据年级选择难度
      if (this.data.selectedGrade >= 'grade_2') {
        practiceMode = 'advanced'; // 20以内
      }
    } else if (mode === 'combine') {
      // 组合练习：三数相加
      practiceMode = 'triple';
    }
    
    // 跳转到分解练习页面
    wx.navigateTo({
      url: `/pages/decompose/index?mode=${practiceMode}&count=${this.data.selectedCount}`
    });
  },

  // 跳转到单位换算页面
  goToUnit(e) {
    const type = e.currentTarget.dataset.type;
    
    // 跳转到单位换算页面
    wx.navigateTo({
      url: `/pages/unit/index?type=${type}&count=${this.data.selectedCount}`
    });
  },

  // 跳转到PDF生成页面
  goToPdfGenerator() {
    wx.navigateTo({
      url: `/pages/pdfGenerator/index?grade=${this.data.selectedGrade}&count=${this.data.selectedCount}`
    });
  }
});
