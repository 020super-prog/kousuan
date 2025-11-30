# 题目不显示问题快速诊断清单

## 🚀 30秒快速检查

在微信开发者工具控制台依次执行以下命令：

```javascript
// ✅ 1. 检查云开发初始化
console.log('云环境ID:', wx.cloud.env);

// ✅ 2. 测试云函数
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: { action: 'getAllGrades' },
  success: res => console.log('✅ 云函数正常:', res),
  fail: err => console.error('❌ 云函数异常:', err)
});

// ✅ 3. 检查页面数据
const page = getCurrentPages()[getCurrentPages().length - 1];
console.log('页面参数:', page.options);
console.log('题目数据:', {
  questions: page.data.questions,
  currentQuestion: page.data.currentQuestion,
  loading: page.data.loading
});
```

---

## 🔍 根据结果判断问题

### 情况1: 云环境ID为空或undefined
```
❌ 云环境ID: undefined
```

**解决方案：**
```javascript
// 修改 miniprogram/app.js
globalData: {
  env: "cloud1-7gp87xsj6a201b2a"  // 填入你的云环境ID
}
```

---

### 情况2: 云函数调用失败
```
❌ 云函数异常: {errCode: -404005, errMsg: "..."}
```

**错误码对照表：**

| 错误码 | 含义 | 解决方案 |
|--------|------|----------|
| -404005 | 云函数不存在 | 上传并部署云函数 |
| -404003 | 权限不足 | 检查云函数权限设置 |
| -1 | 网络超时 | 检查网络连接 |
| 其他 | 未知错误 | 查看详细错误信息 |

**解决方案：**
```bash
# 步骤
1. 右键 cloudfunctions/gradeEngine
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成（1-2分钟）
4. 重新测试
```

---

### 情况3: 页面参数缺失
```
页面参数: { gradeKey: undefined, categoryId: undefined }
```

**解决方案：**
检查首页跳转代码是否正确传递参数

```javascript
// pages/home/index.js
startPractice(e) {
  const categoryId = e.currentTarget.dataset.id;
  const categoryName = e.currentTarget.dataset.name;
  
  const cloudGradeKey = this.convertToCloudFormat(this.data.selectedGrade);
  
  wx.navigateTo({
    url: `/pages/practice/index?gradeKey=${cloudGradeKey}&categoryId=${categoryId}&categoryName=${categoryName}&count=${this.data.selectedCount}`
  });
}
```

---

### 情况4: 题目数据为空
```
题目数据: { questions: [], currentQuestion: null }
```

**可能原因：**
1. 云函数返回数据为空
2. 年级或题型配置错误
3. 题目生成逻辑有问题

**解决方案：**
查看练习页面控制台日志，找到具体错误信息

---

## 📋 完整排查流程（5分钟）

### 步骤1: 基础检查 ✅

```javascript
// 在小程序控制台执行
console.group('🔍 基础检查');

// 1. 云开发环境
console.log('1️⃣ 云环境ID:', getApp().globalData.env);

// 2. 网络状态
wx.getNetworkType({
  success: res => console.log('2️⃣ 网络类型:', res.networkType)
});

// 3. 云函数列表（需要在云开发控制台查看）
console.log('3️⃣ 请打开云开发控制台查看云函数列表');

console.groupEnd();
```

**预期结果：**
- ✅ 云环境ID不为空
- ✅ 网络类型为 wifi/4g/5g
- ✅ 云函数 gradeEngine 已部署

---

### 步骤2: 云函数测试 ✅

```javascript
console.group('🔍 云函数测试');

// 测试1: 获取年级列表
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: { action: 'getAllGrades' },
  success: res => {
    console.log('✅ 测试1通过: 获取年级列表', res.result);
  },
  fail: err => {
    console.error('❌ 测试1失败:', err);
  }
});

// 测试2: 生成题目
setTimeout(() => {
  wx.cloud.callFunction({
    name: 'gradeEngine',
    data: { 
      action: 'generateQuestions',
      data: {
        gradeKey: 'grade_1_2',
        categoryId: 'addition_within_20',
        count: 10
      }
    },
    success: res => {
      console.log('✅ 测试2通过: 生成题目', res.result);
      console.log('题目数量:', res.result.data.questions.length);
    },
    fail: err => {
      console.error('❌ 测试2失败:', err);
    }
  });
}, 1000);

console.groupEnd();
```

**预期结果：**
- ✅ 测试1返回3个年级
- ✅ 测试2返回10道题目

---

### 步骤3: 页面数据检查 ✅

```javascript
// 在练习页面控制台执行
console.group('🔍 页面数据检查');

const page = getCurrentPages()[getCurrentPages().length - 1];

console.log('1️⃣ 页面路由:', page.route);
console.log('2️⃣ 页面参数:', page.options);
console.log('3️⃣ 数据状态:', {
  gradeKey: page.data.gradeKey,
  categoryId: page.data.categoryId,
  count: page.data.count,
  loading: page.data.loading,
  questionsCount: page.data.questions.length,
  currentQuestion: page.data.currentQuestion
});

console.groupEnd();
```

**预期结果：**
- ✅ gradeKey 不为空
- ✅ categoryId 不为空
- ✅ loading 为 false
- ✅ questions 数组有数据
- ✅ currentQuestion 不为 null

---

### 步骤4: 渲染检查 ✅

```javascript
// 在练习页面控制台执行
console.group('🔍 渲染检查');

const page = getCurrentPages()[getCurrentPages().length - 1];

if (!page.data.currentQuestion) {
  console.error('❌ currentQuestion 为 null');
} else {
  console.log('✅ 题目对象:', page.data.currentQuestion);
  console.log('✅ 题目表达式:', page.data.currentQuestion.expression);
  console.log('✅ 题目答案:', page.data.currentQuestion.answer);
}

// 检查DOM是否渲染
setTimeout(() => {
  const query = wx.createSelectorQuery();
  query.select('.question-text').boundingClientRect();
  query.exec(res => {
    if (res[0]) {
      console.log('✅ 题目DOM已渲染:', res[0]);
    } else {
      console.error('❌ 题目DOM未渲染');
    }
  });
}, 500);

console.groupEnd();
```

---

## 🛠️ 常见问题快速修复

### 问题1: 云函数未部署

**症状：**
```
errCode: -404005
errMsg: "cloud function execution error"
```

**修复：**
```bash
1. 右键 cloudfunctions/gradeEngine
2. 选择"上传并部署：云端安装依赖"
3. 等待部署成功
```

**验证：**
```javascript
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: { action: 'getAllGrades' },
  success: res => console.log('✅ 修复成功:', res),
  fail: err => console.error('❌ 仍然失败:', err)
});
```

---

### 问题2: 环境ID未配置

**症状：**
```
云环境ID: undefined 或 ""
```

**修复：**
1. 打开微信开发者工具
2. 点击"云开发"按钮
3. 复制环境ID（例如：cloud1-xxxxx）
4. 修改 `miniprogram/app.js`:
```javascript
globalData: {
  env: "cloud1-7gp87xsj6a201b2a"  // 粘贴你的环境ID
}
```
5. 重新编译

**验证：**
```javascript
console.log('环境ID:', getApp().globalData.env);  // 应显示正确的ID
```

---

### 问题3: 参数传递错误

**症状：**
```
页面参数: { gradeKey: undefined }
```

**修复：**
检查首页跳转代码，确保参数完整：

```javascript
// pages/home/index.js
startPractice(e) {
  const categoryId = e.currentTarget.dataset.id;
  const categoryName = e.currentTarget.dataset.name;
  
  if (!this.data.selectedGrade) {
    Message.warning({ context: this, content: '请先选择年级' });
    return;
  }

  const cloudGradeKey = this.convertToCloudFormat(this.data.selectedGrade);
  
  // ✅ 确保所有参数都传递
  wx.navigateTo({
    url: `/pages/practice/index?gradeKey=${cloudGradeKey}&categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}&count=${this.data.selectedCount}`
  });
}
```

---

### 问题4: 题目数据格式错误

**症状：**
```
currentQuestion: { question: "5 + 3" }
// 缺少 expression 字段
```

**修复：**
确保云函数返回的题目包含所有必需字段：

```javascript
// cloudfunctions/gradeEngine/questionEngine.js
return {
  id: `q_${Date.now()}_${index}`,
  question: `${num1} + ${num2}`,           // ✅ 必需
  expression: `${num1} + ${num2}`,         // ✅ 必需（用于显示）
  displayQuestion: `${num1} + ${num2} = ?`, // ✅ 必需
  answer: answer,                           // ✅ 必需
  type: 'addition',
  gradeKey: gradeKey,
  categoryId: categoryId
};
```

---

### 问题5: WXML条件渲染错误

**症状：**
- 控制台数据正常
- 界面不显示题目

**修复：**
检查 `pages/practice/index.wxml`:

```xml
<!-- ❌ 错误写法 -->
<view wx:if="{{currentQuestion.expression}}">
  <text>{{currentQuestion.expression}} = ?</text>
</view>

<!-- ✅ 正确写法 -->
<view wx:if="{{currentQuestion}}">
  <text>{{currentQuestion.expression || currentQuestion.question}} = ?</text>
</view>
```

---

## 📊 诊断结果对照表

| 检查项 | 正常 | 异常 | 修复方案 |
|--------|------|------|----------|
| 云环境ID | 有值 | 空/undefined | 配置环境ID |
| 云函数部署 | 已部署 | 未部署 | 上传云函数 |
| 网络连接 | wifi/4g/5g | none | 检查网络 |
| 页面参数 | gradeKey有值 | undefined | 检查跳转代码 |
| 题目数据 | questions.length > 0 | [] | 检查云函数逻辑 |
| 当前题目 | currentQuestion有值 | null | 检查setData |
| DOM渲染 | 元素存在 | 未找到 | 检查WXML条件 |

---

## 🆘 终极解决方案

如果所有方法都失败，使用以下应急代码：

```javascript
// 在练习页面控制台执行
const page = getCurrentPages()[getCurrentPages().length - 1];

// 手动生成10道简单题目
const testQuestions = [];
for (let i = 0; i < 10; i++) {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  testQuestions.push({
    id: `test_${i}`,
    question: `${num1} + ${num2}`,
    expression: `${num1} + ${num2}`,
    displayQuestion: `${num1} + ${num2} = ?`,
    answer: num1 + num2,
    type: 'addition'
  });
}

// 设置数据
page.setData({
  questions: testQuestions,
  totalCount: testQuestions.length,
  currentQuestion: testQuestions[0],
  loading: false
});

console.log('✅ 应急题目已加载');
```

---

## 📞 需要帮助？

如果问题仍未解决，请提供以下信息：

1. **所有控制台输出**（包括错误和警告）
2. **云函数日志截图**（云开发控制台 → 云函数 → gradeEngine → 日志）
3. **页面数据快照**（执行步骤3的输出）
4. **微信开发者工具版本**
5. **基础库版本**

---

**检查清单版本**: v1.0  
**最后更新**: 2025-11-30  
**预计排查时间**: 5-10分钟
