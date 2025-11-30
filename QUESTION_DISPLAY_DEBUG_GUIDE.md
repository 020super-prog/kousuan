# 题目不显示问题全面诊断与修复指南

## 📋 目录
1. [数据库查询问题](#1-数据库查询问题)
2. [前端渲染逻辑问题](#2-前端渲染逻辑问题)
3. [网络请求问题](#3-网络请求问题)
4. [权限设置问题](#4-权限设置问题)
5. [缓存机制问题](#5-缓存机制问题)
6. [完整排查流程](#完整排查流程)
7. [快速修复方案](#快速修复方案)

---

## 🔍 1. 数据库查询问题

### 问题现象
- 题目数组为空 `questions: []`
- 云函数返回成功但数据为空
- 控制台显示 `data.questions.length === 0`

### 排查步骤

#### 1.1 检查云函数是否已部署
```bash
# 在微信开发者工具中
1. 打开"云开发"控制台
2. 点击"云函数" tab
3. 查看 gradeEngine 是否存在且显示"已部署"
4. 查看最后部署时间（应该是最近）
```

**控制台命令检查：**
```javascript
// 在小程序控制台执行
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: { action: 'getAllGrades' },
  success: res => console.log('云函数测试结果:', res),
  fail: err => console.error('云函数调用失败:', err)
})
```

**预期结果：**
```json
{
  "success": true,
  "data": [
    { "key": "grade_1_2", "name": "一二年级", "level": 1 },
    { "key": "grade_3_4", "name": "三四年级", "level": 2 },
    { "key": "grade_5_6", "name": "五六年级", "level": 3 }
  ]
}
```

#### 1.2 检查 gradeConfig.js 配置
```bash
# 文件路径
cloudfunctions/gradeEngine/gradeConfig.js
```

**验证年级和题型配置是否完整：**
```javascript
// 确保包含所有年级定义
const GRADES = {
  grade_1_2: { ... },  // ✅ 必须存在
  grade_3_4: { ... },  // ✅ 必须存在
  grade_5_6: { ... }   // ✅ 必须存在
}

// 确保每个年级包含题型
categories: [
  { id: 'addition_within_20', name: '20以内加法', ... },
  // ... 更多题型
]
```

#### 1.3 测试题目生成逻辑
```javascript
// 在云函数中添加日志（临时调试）
// cloudfunctions/gradeEngine/index.js

case 'generateQuestions':
  console.log('接收参数:', data);  // 📝 添加日志
  const { gradeKey: grade, categoryId: cat, count = 10 } = data;
  
  if (!grade || !cat) {
    console.error('参数缺失!', { grade, cat });  // 📝 添加日志
    return { success: false, error: '缺少参数: gradeKey 或 categoryId' };
  }
  
  const questions = generateQuestions(grade, cat, count);
  console.log('生成题目数量:', questions.length);  // 📝 添加日志
  
  return {
    success: true,
    data: {
      gradeKey: grade,
      categoryId: cat,
      count: questions.length,
      questions: questions
    }
  };
```

### 修复方案

#### 方案1: 重新部署云函数
```bash
# 步骤
1. 右键点击 cloudfunctions/gradeEngine 目录
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成（查看控制台日志）
4. 部署成功后重新测试
```

#### 方案2: 检查并修复题目生成逻辑
```javascript
// pages/practice/index.js
async generateQuestionsFromCloud() {
  wx.showLoading({ title: '生成题目中...' });

  try {
    // ✅ 添加详细日志
    console.log('调用云函数参数:', {
      gradeKey: this.data.gradeKey,
      categoryId: this.data.categoryId,
      count: this.data.count || 20
    });

    const res = await generateQuestions(
      this.data.gradeKey, 
      this.data.categoryId, 
      this.data.count || 20  // ✅ 使用传入的count参数
    );

    console.log('云函数返回结果:', res);

    // ✅ 增强错误检查
    if (!res) {
      throw new Error('云函数无响应');
    }

    if (!res.success) {
      throw new Error(res.error || '云函数返回失败');
    }

    if (!res.data || !res.data.questions) {
      throw new Error('返回数据格式错误');
    }

    if (res.data.questions.length === 0) {
      throw new Error('题目生成数量为0');
    }

    const questions = res.data.questions;
    
    this.setData({
      questions,
      totalCount: questions.length,
      currentQuestion: questions[0],
      loading: false
    });

    // 初始化答案记录
    this.data.answers = new Array(questions.length).fill(null);

    // 开始计时
    this.startTimer();

    // 加载设置
    this.loadSettings();
  } catch (error) {
    console.error('生成题目失败:', error);
    
    // ✅ 显示具体错误信息
    Message.error({
      context: this,
      offset: [20, 32],
      duration: 3000,
      content: `题目生成失败: ${error.message || '未知错误'}`
    });
    
    setTimeout(() => {
      wx.navigateBack();
    }, 3000);
  } finally {
    wx.hideLoading();
  }
}
```

---

## 🎨 2. 前端渲染逻辑问题

### 问题现象
- 数据正常但界面不显示题目
- `currentQuestion` 为 `null`
- 白屏或显示加载中

### 排查步骤

#### 2.1 检查 WXML 渲染条件
```xml
<!-- pages/practice/index.wxml -->

<!-- ❌ 错误：条件判断可能导致不渲染 -->
<view wx:if="{{currentQuestion && currentQuestion.expression}}">
  <text>{{currentQuestion.expression}} = ?</text>
</view>

<!-- ✅ 正确：增加日志和降级显示 -->
<view class="question-wrapper">
  <view wx:if="{{currentQuestion}}">
    <text class="question-text">{{currentQuestion.expression || currentQuestion.question}} = ?</text>
  </view>
  <view wx:else>
    <text class="error-hint">题目加载中或数据异常...</text>
  </view>
</view>
```

#### 2.2 检查数据绑定
```javascript
// pages/practice/index.js

// ❌ 错误：直接修改 data 而没有 setData
this.data.currentQuestion = questions[0];

// ✅ 正确：使用 setData
this.setData({
  currentQuestion: questions[0]
});
```

#### 2.3 验证题目数据结构
```javascript
// 在云函数返回后立即打印
console.log('当前题目数据:', JSON.stringify(this.data.currentQuestion, null, 2));

// 预期输出：
{
  "id": "q_1234567890_0",
  "question": "5 + 3",
  "expression": "5 + 3",  // ⚠️ 注意字段名
  "displayQuestion": "5 + 3 = ?",
  "answer": 8,
  "type": "addition",
  "gradeKey": "grade_1_2",
  "categoryId": "addition_within_20"
}
```

### 修复方案

#### 方案1: 修复 onLoad 参数接收
```javascript
// pages/practice/index.js

async onLoad(options) {
  // ✅ 添加详细日志
  console.log('页面参数:', options);
  
  const { gradeKey, categoryId, categoryName, count } = options;
  
  // ✅ 参数验证增强
  if (!gradeKey) {
    console.error('缺少 gradeKey 参数');
    Message.error({
      context: this,
      content: '年级参数缺失'
    });
    setTimeout(() => wx.navigateBack(), 2000);
    return;
  }

  if (!categoryId) {
    console.error('缺少 categoryId 参数');
    Message.error({
      context: this,
      content: '题型参数缺失'
    });
    setTimeout(() => wx.navigateBack(), 2000);
    return;
  }

  this.setData({
    gradeKey,
    categoryId,
    categoryName: decodeURIComponent(categoryName || ''),
    count: parseInt(count) || 20  // ✅ 新增：接收题目数量
  });

  // 使用云函数生成题目
  await this.generateQuestionsFromCloud();
}
```

#### 方案2: 增强 WXML 渲染逻辑
```xml
<!-- pages/practice/index.wxml -->

<!-- 题目展示区 - 增强版 -->
<view class="question-display">
  <!-- 加载状态 -->
  <view wx:if="{{loading}}" class="loading-wrapper">
    <t-loading theme="circular" size="80rpx" />
    <text class="loading-text">正在生成题目...</text>
  </view>

  <!-- 题目显示 -->
  <view wx:elif="{{currentQuestion}}" class="question-wrapper">
    <!-- 优先使用 expression，降级使用 displayQuestion 和 question -->
    <text class="question-text">
      {{currentQuestion.expression || currentQuestion.displayQuestion || currentQuestion.question}} = ?
    </text>
    
    <!-- 用户答案显示 -->
    <view class="answer-display">
      <text class="answer-text" wx:if="{{userAnswer}}">{{userAnswer}}</text>
      <text class="answer-placeholder" wx:else>请输入答案</text>
    </view>

    <!-- 调试信息（开发时显示，上线删除） -->
    <!-- <view class="debug-info">
      <text>题目ID: {{currentQuestion.id}}</text>
      <text>答案: {{currentQuestion.answer}}</text>
    </view> -->
  </view>

  <!-- 错误状态 -->
  <view wx:else class="error-wrapper">
    <t-icon name="error-circle" size="80rpx" color="#E74C3C" />
    <text class="error-text">题目加载失败</text>
    <button class="retry-btn" bindtap="generateQuestionsFromCloud">重新生成</button>
  </view>
</view>
```

#### 方案3: 修复题目字段名不一致
```javascript
// cloudfunctions/gradeEngine/questionEngine.js

// ✅ 确保所有生成器返回统一的字段
function generateAddition(rules) {
  const num1 = randomInt(minValue, maxValue);
  const num2 = randomInt(minValue, maxValue);
  const answer = num1 + num2;
  
  return {
    question: `${num1} + ${num2}`,        // ✅ 原始表达式
    expression: `${num1} + ${num2}`,      // ✅ 用于显示
    displayQuestion: `${num1} + ${num2} = ?`,  // ✅ 完整问题
    answer: answer,
    type: 'addition',
    operands: [num1, num2],
    operator: '+'
  };
}
```

---

## 🌐 3. 网络请求问题

### 问题现象
- 云函数调用超时
- 控制台显示 `errCode: -1`
- 错误信息: `fail operation timeout`

### 排查步骤

#### 3.1 检查云开发环境初始化
```javascript
// miniprogram/app.js

App({
  onLaunch: function () {
    // ✅ 检查环境ID是否正确
    console.log('云开发环境ID:', this.globalData.env);
    
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      wx.showModal({
        title: '版本过低',
        content: '当前微信版本过低，请升级后使用',
        showCancel: false
      });
      return;
    }
    
    try {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
      console.log('云开发初始化成功');
    } catch (error) {
      console.error('云开发初始化失败:', error);
    }
  },
  
  globalData: {
    env: "cloud1-7gp87xsj6a201b2a"  // ✅ 确认这是正确的环境ID
  }
});
```

#### 3.2 测试网络连接
```javascript
// 在小程序控制台执行
wx.getNetworkType({
  success: res => {
    console.log('网络类型:', res.networkType);
    // wifi / 2g / 3g / 4g / 5g / none / unknown
  }
});

// 测试云函数连通性
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: { action: 'getAllGrades' },
  success: res => {
    console.log('✅ 云函数调用成功:', res);
  },
  fail: err => {
    console.error('❌ 云函数调用失败:', err);
  }
});
```

#### 3.3 检查云函数超时设置
```javascript
// utils/gradeApi.js

async function callCloudFunction(action, data = {}) {
  try {
    console.log(`调用云函数: ${action}`, data);
    const startTime = Date.now();
    
    const res = await wx.cloud.callFunction({
      name: 'gradeEngine',
      data: { action, data },
      // ✅ 可选：设置超时时间（毫秒）
      timeout: 10000  // 10秒超时
    });
    
    const duration = Date.now() - startTime;
    console.log(`云函数响应时间: ${duration}ms`);
    
    if (res.result && res.result.success) {
      return {
        success: true,
        data: res.result.data
      };
    } else {
      return {
        success: false,
        error: res.result?.error || '云函数调用失败'
      };
    }
  } catch (error) {
    console.error('云函数调用错误:', error);
    
    // ✅ 详细的错误信息
    let errorMsg = '网络错误';
    if (error.errCode === -1) {
      errorMsg = '网络超时，请检查网络连接';
    } else if (error.errCode === -404005) {
      errorMsg = '云函数不存在，请检查是否已部署';
    } else if (error.errMsg) {
      errorMsg = error.errMsg;
    }
    
    return {
      success: false,
      error: errorMsg,
      errCode: error.errCode
    };
  }
}
```

### 修复方案

#### 方案1: 添加重试机制
```javascript
// utils/gradeApi.js

/**
 * 带重试的云函数调用
 */
async function callCloudFunctionWithRetry(action, data = {}, maxRetries = 3) {
  let lastError = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`云函数调用尝试 ${i + 1}/${maxRetries}`);
      
      const res = await callCloudFunction(action, data);
      
      if (res.success) {
        return res;
      }
      
      lastError = res.error;
      
      // 如果是网络超时，等待后重试
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    } catch (error) {
      lastError = error.message || '未知错误';
    }
  }
  
  return {
    success: false,
    error: `重试${maxRetries}次后失败: ${lastError}`
  };
}

/**
 * 生成题目（带重试）
 */
export async function generateQuestions(gradeKey, categoryId, count = 10) {
  return await callCloudFunctionWithRetry('generateQuestions', { 
    gradeKey, 
    categoryId, 
    count 
  }, 3);
}
```

#### 方案2: 添加离线缓存机制
```javascript
// pages/practice/index.js

async generateQuestionsFromCloud() {
  wx.showLoading({ title: '生成题目中...' });

  try {
    // ✅ 先尝试从缓存获取
    const cacheKey = `questions_${this.data.gradeKey}_${this.data.categoryId}`;
    const cachedQuestions = wx.getStorageSync(cacheKey);
    
    if (cachedQuestions && cachedQuestions.length > 0) {
      console.log('使用缓存的题目');
      this.loadQuestionsFromCache(cachedQuestions);
      wx.hideLoading();
      return;
    }

    // ✅ 缓存未命中，调用云函数
    const res = await generateQuestions(
      this.data.gradeKey, 
      this.data.categoryId, 
      this.data.count || 20
    );

    if (res.success && res.data.questions.length > 0) {
      const questions = res.data.questions;
      
      // ✅ 保存到缓存（7天有效期）
      wx.setStorageSync(cacheKey, questions);
      
      this.setData({
        questions,
        totalCount: questions.length,
        currentQuestion: questions[0],
        loading: false
      });

      this.data.answers = new Array(questions.length).fill(null);
      this.startTimer();
      this.loadSettings();
    } else {
      throw new Error('题目生成失败');
    }
  } catch (error) {
    console.error('生成题目失败:', error);
    
    // ✅ 显示用户友好的错误提示
    wx.showModal({
      title: '题目生成失败',
      content: '网络连接异常，请检查网络后重试',
      confirmText: '重试',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          this.generateQuestionsFromCloud();
        } else {
          wx.navigateBack();
        }
      }
    });
  } finally {
    wx.hideLoading();
  }
}

// 从缓存加载题目
loadQuestionsFromCache(cachedQuestions) {
  // 随机打乱题目顺序
  const shuffled = cachedQuestions.sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, this.data.count || 20);
  
  this.setData({
    questions,
    totalCount: questions.length,
    currentQuestion: questions[0],
    loading: false
  });

  this.data.answers = new Array(questions.length).fill(null);
  this.startTimer();
  this.loadSettings();
}
```

---

## 🔐 4. 权限设置问题

### 问题现象
- 云函数调用返回 `errCode: -404003`
- 错误信息: `permission denied`
- 开发环境正常，体验版/正式版报错

### 排查步骤

#### 4.1 检查云函数权限配置
```bash
# 云开发控制台
1. 打开"云开发"控制台
2. 点击"数据库" tab
3. 点击左侧"权限设置"
4. 查看当前权限模式
```

#### 4.2 检查云函数是否公开
```bash
# cloudfunctions/gradeEngine 目录
# 查看是否有 config.json 文件

# config.json（如果存在）
{
  "permissions": {
    "openapi": []
  }
}
```

#### 4.3 验证用户登录状态
```javascript
// 在小程序控制台执行
wx.cloud.callFunction({
  name: 'login',
  success: res => {
    console.log('用户登录状态:', res);
  },
  fail: err => {
    console.error('登录失败:', err);
  }
});
```

### 修复方案

#### 方案1: 设置云函数公开访问
```javascript
// 云开发控制台设置
1. 打开"云开发"控制台
2. 点击"云函数" tab
3. 点击 gradeEngine 云函数
4. 点击"权限设置"
5. 选择"所有用户可访问"
6. 保存设置
```

#### 方案2: 在云函数中添加权限检查
```javascript
// cloudfunctions/gradeEngine/index.js

exports.main = async (event, context) => {
  const { action, data } = event;
  const { OPENID, APPID, UNIONID } = cloud.getWXContext();
  
  // ✅ 记录调用信息（用于调试）
  console.log('云函数调用信息:', {
    action,
    openid: OPENID,
    appid: APPID,
    timestamp: new Date().toISOString()
  });
  
  try {
    // ... 原有逻辑
  } catch (error) {
    console.error('云函数执行错误:', {
      error: error.message,
      stack: error.stack,
      action,
      openid: OPENID
    });
    
    return {
      success: false,
      error: error.message || '云函数执行失败'
    };
  }
};
```

#### 方案3: 添加用户身份验证
```javascript
// miniprogram/app.js

App({
  onLaunch: function () {
    this.userReady = false;
    
    // ✅ 初始化云开发
    wx.cloud.init({
      env: this.globalData.env,
      traceUser: true
    });
    
    // ✅ 获取用户登录态
    this.getUserInfo();
  },
  
  getUserInfo() {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('用户登录成功:', res);
        this.globalData.openid = res.result.openid;
        this.userReady = true;
      },
      fail: err => {
        console.error('用户登录失败:', err);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  
  globalData: {
    env: "cloud1-7gp87xsj6a201b2a",
    openid: null
  }
});
```

---

## 💾 5. 缓存机制问题

### 问题现象
- 题目一直显示旧数据
- 切换年级/题型后题目不变
- 题目数量不正确

### 排查步骤

#### 5.1 检查缓存数据
```javascript
// 在小程序控制台执行
const storage = wx.getStorageInfoSync();
console.log('缓存信息:', storage);

// 查看特定缓存
const questions = wx.getStorageSync('questions_grade_1_2_addition_within_20');
console.log('缓存的题目:', questions);

// 清除所有缓存
// wx.clearStorageSync();
```

#### 5.2 验证缓存键名生成
```javascript
// pages/practice/index.js

const cacheKey = `questions_${this.data.gradeKey}_${this.data.categoryId}`;
console.log('使用的缓存键:', cacheKey);

// 检查是否与实际缓存匹配
const allKeys = wx.getStorageInfoSync().keys;
console.log('所有缓存键:', allKeys);
```

#### 5.3 检查缓存过期机制
```javascript
// 检查缓存时间戳
const cacheData = wx.getStorageSync(cacheKey);
if (cacheData && cacheData.timestamp) {
  const age = Date.now() - cacheData.timestamp;
  const ageInDays = age / (1000 * 60 * 60 * 24);
  console.log(`缓存年龄: ${ageInDays.toFixed(2)} 天`);
}
```

### 修复方案

#### 方案1: 改进缓存策略
```javascript
// pages/practice/index.js

async generateQuestionsFromCloud() {
  wx.showLoading({ title: '生成题目中...' });

  try {
    const cacheKey = `questions_${this.data.gradeKey}_${this.data.categoryId}`;
    
    // ✅ 检查缓存（带过期检查）
    const cachedData = wx.getStorageSync(cacheKey);
    const cacheMaxAge = 7 * 24 * 60 * 60 * 1000; // 7天
    
    if (cachedData && cachedData.timestamp) {
      const age = Date.now() - cachedData.timestamp;
      
      if (age < cacheMaxAge && cachedData.questions && cachedData.questions.length > 0) {
        console.log(`使用缓存 (${(age / (1000 * 60 * 60 * 24)).toFixed(2)}天前)`);
        this.loadQuestionsFromCache(cachedData.questions);
        wx.hideLoading();
        return;
      } else {
        console.log('缓存已过期，重新生成');
      }
    }

    // ✅ 调用云函数生成新题目
    const res = await generateQuestions(
      this.data.gradeKey, 
      this.data.categoryId, 
      this.data.count || 20
    );

    if (res.success && res.data.questions.length > 0) {
      const questions = res.data.questions;
      
      // ✅ 保存到缓存（带时间戳）
      wx.setStorageSync(cacheKey, {
        questions: questions,
        timestamp: Date.now(),
        gradeKey: this.data.gradeKey,
        categoryId: this.data.categoryId
      });
      
      this.setData({
        questions,
        totalCount: questions.length,
        currentQuestion: questions[0],
        loading: false
      });

      this.data.answers = new Array(questions.length).fill(null);
      this.startTimer();
      this.loadSettings();
    } else {
      throw new Error('题目生成失败');
    }
  } catch (error) {
    console.error('生成题目失败:', error);
    Message.error({
      context: this,
      offset: [20, 32],
      duration: 3000,
      content: `题目生成失败: ${error.message || '未知错误'}`
    });
    
    setTimeout(() => {
      wx.navigateBack();
    }, 3000);
  } finally {
    wx.hideLoading();
  }
}
```

#### 方案2: 添加强制刷新选项
```javascript
// pages/practice/index.js

data: {
  // ... 其他字段
  forceRefresh: false  // 强制刷新标志
},

async onLoad(options) {
  const { gradeKey, categoryId, categoryName, count, refresh } = options;
  
  this.setData({
    gradeKey,
    categoryId,
    categoryName: decodeURIComponent(categoryName || ''),
    count: parseInt(count) || 20,
    forceRefresh: refresh === 'true'  // ✅ 支持强制刷新参数
  });

  await this.generateQuestionsFromCloud();
},

async generateQuestionsFromCloud() {
  const cacheKey = `questions_${this.data.gradeKey}_${this.data.categoryId}`;
  
  // ✅ 如果强制刷新，删除缓存
  if (this.data.forceRefresh) {
    console.log('强制刷新，清除缓存');
    wx.removeStorageSync(cacheKey);
  }
  
  // ... 其他逻辑
}
```

```javascript
// pages/home/index.js
// 在题型选择时支持强制刷新

startPractice(e) {
  const categoryId = e.currentTarget.dataset.id;
  const categoryName = e.currentTarget.dataset.name;
  const forceRefresh = e.currentTarget.dataset.refresh || false;
  
  const cloudGradeKey = this.convertToCloudFormat(this.data.selectedGrade);
  
  wx.navigateTo({
    url: `/pages/practice/index?gradeKey=${cloudGradeKey}&categoryId=${categoryId}&categoryName=${categoryName}&count=${this.data.selectedCount}&refresh=${forceRefresh}`
  });
}
```

#### 方案3: 添加缓存管理页面
```javascript
// pages/settings/cache-manager.js

Page({
  data: {
    cacheInfo: {},
    cachedQuestions: []
  },

  onLoad() {
    this.loadCacheInfo();
  },

  loadCacheInfo() {
    const info = wx.getStorageInfoSync();
    const keys = info.keys.filter(k => k.startsWith('questions_'));
    
    const cachedQuestions = keys.map(key => {
      const data = wx.getStorageSync(key);
      return {
        key,
        count: data.questions ? data.questions.length : 0,
        timestamp: data.timestamp,
        age: data.timestamp ? (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24) : 0
      };
    });

    this.setData({
      cacheInfo: {
        totalKeys: info.keys.length,
        currentSize: info.currentSize,
        limitSize: info.limitSize
      },
      cachedQuestions
    });
  },

  clearAllCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有题目缓存吗？',
      success: res => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '缓存已清除', icon: 'success' });
          this.loadCacheInfo();
        }
      }
    });
  },

  clearSingleCache(e) {
    const key = e.currentTarget.dataset.key;
    wx.removeStorageSync(key);
    wx.showToast({ title: '已删除', icon: 'success' });
    this.loadCacheInfo();
  }
});
```

---

## 🔧 完整排查流程

### 第一步：基础检查（5分钟）
```javascript
// 1. 检查云开发环境
console.log('环境ID:', wx.cloud.env);

// 2. 测试云函数连通性
wx.cloud.callFunction({
  name: 'gradeEngine',
  data: { action: 'getAllGrades' },
  success: res => console.log('✅ 云函数正常:', res),
  fail: err => console.error('❌ 云函数异常:', err)
});

// 3. 检查页面参数
console.log('页面参数:', getCurrentPages()[0].options);

// 4. 检查题目数据
console.log('题目数据:', getCurrentPages()[0].data.questions);
console.log('当前题目:', getCurrentPages()[0].data.currentQuestion);
```

### 第二步：云函数检查（5分钟）
```bash
# 1. 查看云函数列表
打开云开发控制台 → 云函数

# 2. 查看云函数日志
点击 gradeEngine → 日志 → 查看最近调用记录

# 3. 测试云函数
点击"调试" → 输入测试数据：
{
  "action": "generateQuestions",
  "data": {
    "gradeKey": "grade_1_2",
    "categoryId": "addition_within_20",
    "count": 10
  }
}
```

### 第三步：前端调试（10分钟）
```javascript
// 在 pages/practice/index.js 的 generateQuestionsFromCloud 中添加
console.group('🔍 题目生成调试');
console.log('1. 调用参数:', {
  gradeKey: this.data.gradeKey,
  categoryId: this.data.categoryId,
  count: this.data.count
});

const res = await generateQuestions(...);
console.log('2. 云函数响应:', res);

if (res.success) {
  console.log('3. 题目数量:', res.data.questions.length);
  console.log('4. 第一题:', res.data.questions[0]);
  
  this.setData(...);
  console.log('5. setData 后:', this.data.currentQuestion);
} else {
  console.error('❌ 失败原因:', res.error);
}
console.groupEnd();
```

### 第四步：网络监控（5分钟）
```javascript
// 在 app.js 添加
App({
  onLaunch() {
    // 监控网络状态
    wx.onNetworkStatusChange(res => {
      console.log('网络状态变化:', {
        isConnected: res.isConnected,
        networkType: res.networkType
      });
      
      if (!res.isConnected) {
        wx.showToast({
          title: '网络已断开',
          icon: 'none'
        });
      }
    });
  }
});
```

---

## 🚀 快速修复方案

### 场景1: 云函数未部署
```bash
解决方案：
1. 右键 cloudfunctions/gradeEngine
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成（约1-2分钟）
4. 重新测试
```

### 场景2: 参数传递错误
```javascript
// 修复首页跳转参数
// pages/home/index.js

startPractice(e) {
  const categoryId = e.currentTarget.dataset.id;
  const categoryName = e.currentTarget.dataset.name;
  
  if (!this.data.selectedGrade) {
    Message.warning({ context: this, content: '请先选择年级' });
    return;
  }

  const cloudGradeKey = this.convertToCloudFormat(this.data.selectedGrade);
  
  // ✅ 确保参数完整
  const params = {
    gradeKey: cloudGradeKey,
    categoryId: categoryId,
    categoryName: encodeURIComponent(categoryName),
    count: this.data.selectedCount
  };
  
  console.log('跳转参数:', params);
  
  wx.navigateTo({
    url: `/pages/practice/index?` + 
         `gradeKey=${params.gradeKey}&` +
         `categoryId=${params.categoryId}&` +
         `categoryName=${params.categoryName}&` +
         `count=${params.count}`
  });
}
```

### 场景3: 渲染条件错误
```xml
<!-- pages/practice/index.wxml -->

<!-- ❌ 错误写法 -->
<view wx:if="{{currentQuestion.expression}}">
  <text>{{currentQuestion.expression}} = ?</text>
</view>

<!-- ✅ 正确写法 -->
<view wx:if="{{currentQuestion}}">
  <text>{{currentQuestion.expression || currentQuestion.question || '题目加载中'}} = ?</text>
</view>
```

### 场景4: 数据结构不匹配
```javascript
// cloudfunctions/gradeEngine/questionEngine.js

// ✅ 修改所有生成器，确保返回统一结构
function generateAddition(rules) {
  // ... 生成逻辑
  
  return {
    id: `q_${Date.now()}_${Math.random()}`,
    question: `${num1} + ${num2}`,           // ✅ 必须
    expression: `${num1} + ${num2}`,         // ✅ 必须（用于显示）
    displayQuestion: `${num1} + ${num2} = ?`, // ✅ 必须
    answer: answer,                           // ✅ 必须
    type: 'addition',
    operands: [num1, num2],
    operator: '+'
  };
}
```

---

## 📝 测试检查清单

- [ ] 云函数已部署且显示"已部署"状态
- [ ] 云开发环境ID正确（`app.js` 中）
- [ ] 网络连接正常（wifi/4G/5G）
- [ ] 云函数测试调用成功
- [ ] 页面接收到正确的参数（gradeKey、categoryId、count）
- [ ] `generateQuestions` API 返回成功
- [ ] 返回的题目数组不为空
- [ ] `currentQuestion` 不为 null
- [ ] WXML 条件渲染正确
- [ ] 控制台无报错信息
- [ ] 题目正常显示在界面上
- [ ] 切换年级/题型后题目更新

---

## 🆘 紧急救援代码

如果所有方法都不奏效，使用以下临时方案：

```javascript
// pages/practice/index.js

async generateQuestionsFromCloud() {
  wx.showLoading({ title: '生成题目中...' });

  try {
    // 🚨 方案1: 使用本地题库（临时）
    const localQuestions = this.generateLocalQuestions();
    if (localQuestions && localQuestions.length > 0) {
      console.warn('⚠️ 使用本地题库（临时方案）');
      this.loadLocalQuestions(localQuestions);
      return;
    }

    // 🚨 方案2: 云函数（正常流程）
    const res = await generateQuestions(
      this.data.gradeKey, 
      this.data.categoryId, 
      this.data.count || 20
    );

    if (res.success && res.data.questions.length > 0) {
      this.loadCloudQuestions(res.data.questions);
    } else {
      throw new Error(res.error || '题目生成失败');
    }
  } catch (error) {
    console.error('生成题目失败:', error);
    
    // 🚨 方案3: 降级到简单题目
    wx.showModal({
      title: '提示',
      content: '题目生成失败，使用简单题目继续练习？',
      success: res => {
        if (res.confirm) {
          const fallbackQuestions = this.generateFallbackQuestions();
          this.loadLocalQuestions(fallbackQuestions);
        } else {
          wx.navigateBack();
        }
      }
    });
  } finally {
    wx.hideLoading();
  }
},

// 生成降级题目（10以内加法）
generateFallbackQuestions() {
  const questions = [];
  for (let i = 0; i < 20; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    questions.push({
      id: `fallback_${i}`,
      question: `${num1} + ${num2}`,
      expression: `${num1} + ${num2}`,
      displayQuestion: `${num1} + ${num2} = ?`,
      answer: num1 + num2,
      type: 'addition'
    });
  }
  return questions;
},

loadLocalQuestions(questions) {
  this.setData({
    questions,
    totalCount: questions.length,
    currentQuestion: questions[0],
    loading: false
  });
  this.data.answers = new Array(questions.length).fill(null);
  this.startTimer();
  this.loadSettings();
}
```

---

## 📞 联系支持

如果问题仍未解决，请提供以下信息：

1. **错误截图**（控制台、界面）
2. **云函数日志**（最近10条）
3. **页面参数**（`console.log(options)`）
4. **云开发环境ID**
5. **微信开发者工具版本**
6. **基础库版本**

---

**文档版本**: v1.0  
**最后更新**: 2025-11-30  
**适用项目**: 口算练习小程序 kousuan19
