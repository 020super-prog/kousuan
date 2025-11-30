# ⚡ 快速参考卡

## 🚀 快速启动（3步）

```bash
# 1. 在微信开发者工具中打开项目
工具 → 构建 npm

# 2. 点击编译
等待编译完成

# 3. 开始体验
点击首页"加法练习"开始答题
```

---

## 📁 核心文件位置

```
关键文件：
├── miniprogram/pages/practice/index.js  # 核心答题逻辑
├── miniprogram/utils/questionGenerator.js  # 题目生成器
├── miniprogram/app.wxss  # 全局样式和主题色
└── miniprogram/app.json  # 页面路由和组件配置

文档：
├── README.md  # 项目说明
├── PROJECT_GUIDE.md  # 开发指南（最详细）
├── USER_GUIDE.md  # 用户使用说明
├── STARTUP_CHECKLIST.md  # 启动检查清单
└── DEVELOPMENT_SUMMARY.md  # 开发总结
```

---

## 🎨 核心色值

```css
主色调: #4A90E2  /* 智慧蓝 */
辅助色: #FF6B35  /* 活力橙 */
成功色: #27AE60  /* 绿色 */
错误色: #E74C3C  /* 红色 */
背景色: #F8F9FA  /* 浅灰 */
文字色: #2C3E50  /* 深灰 */
```

---

## 📊 数据存储键名

```javascript
'userInfo'          // 用户信息
'practiceRecords'   // 练习记录
'mistakes'          // 错题记录
'settings'          // 用户设置
'cameraHistory'     // 批改历史
```

---

## 🔧 常用API

### 题目生成
```javascript
const QuestionGenerator = require('../../utils/questionGenerator');

QuestionGenerator.generate({
  type: 'add',      // 题型: add/subtract/multiply/divide/mixed
  grade: 2,         // 年级: 1-6
  count: 20,        // 题目数量
  minNum: 1,        // 最小数值
  maxNum: 100       // 最大数值
});
```

### 保存数据
```javascript
// 保存练习记录
wx.setStorageSync('practiceRecords', records);

// 保存错题
wx.setStorageSync('mistakes', mistakes);

// 保存设置
wx.setStorageSync('settings', settings);
```

### 获取数据
```javascript
// 获取练习记录
const records = wx.getStorageSync('practiceRecords') || [];

// 获取错题
const mistakes = wx.getStorageSync('mistakes') || [];

// 获取设置
const settings = wx.getStorageSync('settings') || {};
```

---

## 📱 页面路径

```javascript
// Tab页面（使用 wx.switchTab）
'/pages/home/index'      // 首页
'/pages/camera/index'    // 拍照批改
'/pages/mistakes/index'  // 错题本
'/pages/profile/index'   // 个人中心

// 普通页面（使用 wx.navigateTo）
'/pages/practice/index'  // 练习页面
'/pages/result/index'    // 结果页面
```

---

## 🎯 核心功能调用

### 开始练习
```javascript
wx.navigateTo({
  url: `/pages/practice/index?settings=${JSON.stringify({
    type: 'add',
    grade: 1,
    questionCount: 20,
    minNum: 1,
    maxNum: 20
  })}`
});
```

### 查看错题
```javascript
wx.switchTab({
  url: '/pages/mistakes/index'
});
```

### 显示消息
```javascript
import Message from 'tdesign-miniprogram/message/index';

Message.success({
  context: this,
  offset: [20, 32],
  duration: 2000,
  content: '操作成功'
});
```

### 显示对话框
```javascript
import Dialog from 'tdesign-miniprogram/dialog/index';

Dialog.confirm({
  title: '提示',
  content: '确认要执行此操作吗？',
  confirmBtn: '确认',
  cancelBtn: '取消'
}).then(() => {
  // 确认操作
}).catch(() => {
  // 取消操作
});
```

---

## 🐛 常见问题速查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| TDesign组件不显示 | 未构建npm | 工具 → 构建 npm |
| 页面空白 | 路径错误 | 检查app.json配置 |
| tabBar图标异常 | 使用占位图 | 正常现象，可替换 |
| 数据不保存 | 存储满了 | 清理旧数据 |
| 练习卡顿 | 题目过多 | 减少题目数量 |

---

## 💡 快速修改指南

### 修改主题色
```css
/* miniprogram/app.wxss */
.bg-primary {
  background-color: #你的颜色;
}
```

### 修改题目数量默认值
```javascript
// miniprogram/pages/practice/index.js
getDefaultSettings() {
  return {
    questionCount: 30  // 改为30题
  };
}
```

### 修改正确率计算规则
```javascript
// miniprogram/pages/result/index.js
const correctRate = Math.round((correctCount / totalCount) * 100);
```

---

## 📞 获取帮助

1. **查看文档**
   - README.md - 快速了解
   - PROJECT_GUIDE.md - 详细开发指南
   - USER_GUIDE.md - 使用说明

2. **常见问题**
   - STARTUP_CHECKLIST.md - 启动问题
   - DEVELOPMENT_SUMMARY.md - 技术问题

3. **官方文档**
   - 微信小程序: https://developers.weixin.qq.com/miniprogram/dev/
   - TDesign: https://tdesign.tencent.com/miniprogram/

---

## ✅ 测试清单（快速版）

- [ ] 构建npm成功
- [ ] 首页正常显示
- [ ] 点击加法练习进入答题
- [ ] 答题有动画反馈
- [ ] 完成后显示结果
- [ ] 错题本显示错题
- [ ] 个人中心显示统计

---

## 🎉 恭喜！

所有核心功能已完成，可以开始使用了！

**下一步**:
1. ✅ 先体验现有功能
2. 🚧 规划扩展功能（PDF、OCR）
3. 📝 收集用户反馈

---

**版本**: v1.0.0  
**更新**: 2025-11-30
