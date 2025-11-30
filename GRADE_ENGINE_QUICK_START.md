# 年级题型引擎 - 快速开始

## 🚀 5分钟快速上手

### 步骤1：部署云函数（2分钟）

```bash
# 在微信开发者工具中
右键 cloudfunctions/gradeEngine → 上传并部署：云端安装依赖
```

### 步骤2：前端调用示例（3分钟）

```javascript
// 1. 获取年级列表
import { getAllGrades } from '../../utils/gradeApi';

const res = await getAllGrades();
console.log(res.data); // [{ key: 'grade_1_2', name: '一二年级', level: 1 }, ...]

// 2. 获取题型列表
import { getCategoriesByGrade } from '../../utils/gradeApi';

const categories = await getCategoriesByGrade('grade_1_2');
console.log(categories.data); // [{ id: 'addition', name: '加法', ... }, ...]

// 3. 生成题目
import { generateQuestions } from '../../utils/gradeApi';

const questions = await generateQuestions('grade_1_2', 'addition', 10);
console.log(questions.data.questions); // 10道加法题
```

---

## 📋 年级题型速查表

### 1-2年级 (grade_1_2)

| 题型ID | 题型名称 | 示例 |
|--------|----------|------|
| addition | 加法 | 8 + 7 = ? |
| subtraction | 减法 | 15 - 8 = ? |
| measurement_basic | 单位换算 | 1米 = ? 厘米 |

### 3-4年级 (grade_3_4)

| 题型ID | 题型名称 | 示例 |
|--------|----------|------|
| addition_advanced | 加法 | 234 + 567 = ? |
| subtraction_advanced | 减法 | 1000 - 456 = ? |
| multiplication | 乘除法 | 23 × 4 = ? |
| mixed_operations | 混合运算 | 3 + 8 × 5 = ? |
| decimals_basic | 小数运算 | 12.4 + 8 = ? |
| fractions_basic | 分数运算 | 1/5 + 2/5 = ? |

### 5-6年级 (grade_5_6)

| 题型ID | 题型名称 | 示例 |
|--------|----------|------|
| mixed_advanced | 整数运算 | 25×4+8.99+36 = ? |
| decimals_advanced | 小数运算 | 25.1 + 12.4 = ? |
| fractions_advanced | 分数运算 | 5/1 + 5/3 = ? |
| mixed_operations_advanced | 混合运算 | (12+8) - 4.3 = ? |
| measurement_advanced | 单位换算 | 1平方千米 = ? 平方米 |

---

## 🔌 API接口速查

### getAllGrades()
```javascript
// 获取所有年级
const res = await getAllGrades();
```

### getCategoriesByGrade(gradeKey)
```javascript
// 获取年级题型列表
const res = await getCategoriesByGrade('grade_1_2');
```

### getCategoryRules(gradeKey, categoryId)
```javascript
// 获取题型规则
const res = await getCategoryRules('grade_1_2', 'addition');
```

### generateQuestions(gradeKey, categoryId, count)
```javascript
// 生成题目
const res = await generateQuestions('grade_1_2', 'addition', 20);
```

### getRecommendedPractice(gradeKey)
```javascript
// 获取推荐练习
const res = await getRecommendedPractice('grade_3_4');
```

---

## 📱 完整使用示例

```javascript
// pages/practice/index.js
import { generateQuestions } from '../../utils/gradeApi';

Page({
  data: {
    questions: [],
    currentIndex: 0
  },

  async onLoad(options) {
    const { gradeKey, categoryId } = options;
    
    // 显示加载中
    wx.showLoading({ title: '生成题目中...' });
    
    try {
      // 调用云函数生成20道题
      const res = await generateQuestions(gradeKey, categoryId, 20);
      
      if (res.success) {
        this.setData({
          questions: res.data.questions
        });
        
        // 开始练习
        this.startPractice();
      } else {
        wx.showToast({
          title: '生成失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('生成题目错误:', error);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  startPractice() {
    // 开始答题逻辑
    console.log('题目已生成，开始练习');
  }
});
```

---

## 🎯 题目数据结构

```javascript
{
  id: "q_1701234567890_0",        // 唯一ID
  question: "8 + 7",               // 题目表达式
  displayQuestion: "8 + 7 = ?",   // 显示文本
  answer: 15,                      // 正确答案
  type: "addition",                // 题型
  operands: [8, 7],                // 操作数数组
  operator: "+",                   // 运算符
  gradeKey: "grade_1_2",          // 年级key
  categoryId: "addition",          // 题型ID
  createdAt: "2025-11-30T..."     // 创建时间戳
}
```

---

## ⚠️ 注意事项

### 1. 参数校验
```javascript
// ❌ 错误
generateQuestions('grade_1', 'add', 10);

// ✅ 正确
generateQuestions('grade_1_2', 'addition', 10);
```

### 2. 错误处理
```javascript
const res = await generateQuestions('grade_1_2', 'addition', 10);

if (res.success) {
  // 成功处理
  console.log(res.data.questions);
} else {
  // 失败处理
  console.error(res.error);
}
```

### 3. 题目数量限制
```javascript
// 建议范围：10-50题
// 太少：体验不好
// 太多：生成时间长，占用内存大

const count = Math.min(Math.max(userInput, 10), 50);
```

---

## 🔍 调试技巧

### 1. 查看云函数日志
```
云开发控制台 → 云函数 → gradeEngine → 日志
```

### 2. 本地测试
```javascript
// 在控制台直接测试
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: {
    action: 'generateQuestions',
    data: {
      gradeKey: 'grade_1_2',
      categoryId: 'addition',
      count: 5
    }
  },
  success: res => console.log(res),
  fail: err => console.error(err)
});
```

### 3. 使用调试工具
```javascript
// 在页面中添加
console.log('年级:', gradeKey);
console.log('题型:', categoryId);
console.log('题目数量:', count);
```

---

## 📚 相关文档

- 📖 [完整云函数文档](./cloudfunctions/gradeEngine/README.md)
- 🚀 [云函数部署指南](./CLOUD_FUNCTION_GUIDE.md)
- 📋 [项目开发指南](./PROJECT_GUIDE.md)

---

## 💡 常见场景

### 场景1：首页快捷练习
```javascript
// 用户点击"加法练习"按钮
startPractice() {
  const gradeKey = wx.getStorageSync('selectedGrade') || 'grade_1_2';
  wx.navigateTo({
    url: `/pages/practice/index?gradeKey=${gradeKey}&categoryId=addition`
  });
}
```

### 场景2：自定义练习
```javascript
// 用户选择年级和题型
customPractice() {
  // 显示年级和题型选择器
  // 生成题目
  const res = await generateQuestions(gradeKey, categoryId, count);
}
```

### 场景3：错题重练
```javascript
// 从错题本生成练习卷
regenerateFromMistakes() {
  // 获取错题的年级和题型
  const mistakes = wx.getStorageSync('mistakes');
  const categoryId = mistakes[0].categoryId;
  const gradeKey = mistakes[0].gradeKey;
  
  // 生成同类型题目
  const res = await generateQuestions(gradeKey, categoryId, 20);
}
```

---

**快速开始，立即使用！** 🎉
