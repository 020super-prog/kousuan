// pages/mistakes/index.js
import Dialog from 'tdesign-miniprogram/dialog/index';
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    currentFilter: 'all',
    filterOptions: [
      { label: '全部', value: 'all' },
      { label: '加法', value: 'add' },
      { label: '减法', value: 'subtract' },
      { label: '乘法', value: 'multiply' },
      { label: '除法', value: 'divide' },
      { label: '混合', value: 'mixed' }
    ],
    mistakesList: [],
    allMistakes: [],
    isSelectAll: false,
    selectedCount: 0,
    selectedIds: []
  },

  onLoad() {
    this.loadMistakes();
  },

  onShow() {
    this.loadMistakes();
    
    // 更新自定义TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },

  // 加载错题数据
  loadMistakes() {
    const mistakes = wx.getStorageSync('mistakes') || [];
    
    // 格式化数据
    const formattedMistakes = mistakes
      .filter(m => !m.masteredAt) // 只显示未掌握的
      .map(m => ({
        id: m.id,
        question: m.question,
        userAnswer: m.userAnswer,
        correctAnswer: m.correctAnswer,
        type: m.type,
        typeName: this.getTypeName(m.type),
        typeColor: this.getTypeColor(m.type),
        createDate: this.formatDate(m.createTime)
      }));

    this.setData({
      allMistakes: formattedMistakes,
      mistakesList: formattedMistakes
    });

    this.filterMistakes();
  },

  // 获取题型名称
  getTypeName(type) {
    const typeMap = {
      add: '加法',
      subtract: '减法',
      multiply: '乘法',
      divide: '除法',
      mixed: '混合运算'
    };
    return typeMap[type] || '其他';
  },

  // 获取题型颜色
  getTypeColor(type) {
    const colorMap = {
      add: 'primary',
      subtract: 'success',
      multiply: 'danger',
      divide: 'primary',
      mixed: 'danger'
    };
    return colorMap[type] || 'primary';
  },

  // 格式化日期
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

  // 切换筛选
  changeFilter(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      currentFilter: value
    });
    this.filterMistakes();
  },

  // 筛选错题
  filterMistakes() {
    const { currentFilter, allMistakes } = this.data;
    
    if (currentFilter === 'all') {
      this.setData({
        mistakesList: allMistakes
      });
    } else {
      const filtered = allMistakes.filter(m => m.type === currentFilter);
      this.setData({
        mistakesList: filtered
      });
    }
  },

  // 重练单题
  retryQuestion(e) {
    const id = e.currentTarget.dataset.id;
    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '单题重练功能开发中...'
    });
  },

  // 标记已掌握
  markMastered(e) {
    const id = e.currentTarget.dataset.id;
    
    Dialog.confirm({
      title: '确认操作',
      content: '确认已掌握这道题？',
      confirmBtn: '确认',
      cancelBtn: '取消'
    }).then(() => {
      const mistakes = wx.getStorageSync('mistakes') || [];
      const index = mistakes.findIndex(m => m.id === id);
      
      if (index !== -1) {
        mistakes[index].masteredAt = Date.now();
        wx.setStorageSync('mistakes', mistakes);
        
        Message.success({
          context: this,
          offset: [20, 32],
          duration: 2000,
          content: '已标记为掌握'
        });
        
        this.loadMistakes();
      }
    }).catch(() => {});
  },

  // 全选
  selectAll(e) {
    const isSelectAll = e.detail.value.includes('all');
    const selectedIds = isSelectAll 
      ? this.data.mistakesList.map(m => m.id)
      : [];
    
    this.setData({
      isSelectAll,
      selectedIds,
      selectedCount: selectedIds.length
    });
  },

  // 生成练习卷
  generatePractice() {
    const { selectedCount } = this.data;
    
    if (selectedCount === 0) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '请先选择错题'
      });
      return;
    }

    Message.info({
      context: this,
      offset: [20, 32],
      duration: 2000,
      content: '生成练习卷功能开发中...'
    });
  },

  // 批量删除
  batchDelete() {
    const { selectedCount, selectedIds } = this.data;
    
    if (selectedCount === 0) {
      Message.warning({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '请先选择错题'
      });
      return;
    }

    Dialog.confirm({
      title: '确认删除',
      content: `确认删除选中的 ${selectedCount} 道错题？`,
      confirmBtn: '确认',
      cancelBtn: '取消'
    }).then(() => {
      let mistakes = wx.getStorageSync('mistakes') || [];
      mistakes = mistakes.filter(m => !selectedIds.includes(m.id));
      wx.setStorageSync('mistakes', mistakes);
      
      Message.success({
        context: this,
        offset: [20, 32],
        duration: 2000,
        content: '删除成功'
      });
      
      this.setData({
        isSelectAll: false,
        selectedCount: 0,
        selectedIds: []
      });
      
      this.loadMistakes();
    }).catch(() => {});
  },

  // 去练习
  goToPractice() {
    wx.switchTab({
      url: '/pages/home/index'
    });
  }
});
