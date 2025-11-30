# 云函数部署完整指南

## 📦 项目云函数概览

本项目包含一个核心云函数：**gradeEngine（年级题型智能匹配引擎）**

---

## 🎯 云函数功能

### gradeEngine - 年级题型匹配引擎

**核心功能：**
1. 管理1-6年级题型配置（基于教学大纲）
2. 智能生成符合年级要求的题目
3. 提供年级题型查询API
4. 支持多种题型（加减乘除、混合运算、小数、分数等）

**API接口：**
- `getAllGrades` - 获取所有年级列表
- `getCategoriesByGrade` - 获取年级题型列表
- `getCategoryRules` - 获取题型详细规则
- `getGradeConfig` - 获取年级完整配置
- `generateQuestions` - 生成题目（核心）
- `getRecommendedPractice` - 获取推荐练习

---

## 🚀 部署步骤

### 前置条件

1. ✅ 已注册微信小程序账号
2. ✅ 已开通云开发服务
3. ✅ 已创建云开发环境
4. ✅ 已安装微信开发者工具

---

### 步骤1：初始化云开发环境

#### 在微信开发者工具中

1. 打开项目根目录
2. 点击工具栏的"云开发"图标
3. 如果未开通，点击"开通云开发"
4. 创建一个新环境（如：kousuan-prod）
5. 记录环境ID（后面要用）

#### 配置app.js

确保 `miniprogram/app.js` 中已初始化云开发：

```javascript
App({
  onLaunch: function () {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 替换为你的环境ID
        traceUser: true,
      });
    }
  }
});
```

---

### 步骤2：部署gradeEngine云函数

#### 方法一：通过微信开发者工具（推荐）

1. 在项目中找到 `cloudfunctions/gradeEngine` 文件夹
2. 右键点击该文件夹
3. 选择 **"上传并部署：云端安装依赖"**
4. 等待上传完成（约30秒-1分钟）
5. 看到"上传成功"提示即可

#### 方法二：通过命令行

```bash
# 进入云函数目录
cd cloudfunctions/gradeEngine

# 安装依赖
npm install

# 使用云开发CLI上传
tcb fn deploy gradeEngine
```

---

### 步骤3：验证部署

#### 在云开发控制台

1. 打开[微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 选择你的环境
3. 进入"云函数"页面
4. 找到 `gradeEngine` 函数
5. 状态应显示为"正常"
6. 点击函数名查看详情

#### 测试云函数

在云开发控制台测试面板输入：

```json
{
  "action": "getAllGrades",
  "data": {}
}
```

点击"测试"，应该返回：

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

---

### 步骤4：前端调用测试

在小程序任意页面中测试调用：

```javascript
// 测试生成题目
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
  success: res => {
    console.log('生成题目成功:', res.result);
    if (res.result.success) {
      console.log('题目列表:', res.result.data.questions);
    }
  },
  fail: err => {
    console.error('调用失败:', err);
  }
});
```

---

## 🔧 配置说明

### 云函数配置文件

**cloudfunctions/gradeEngine/config.json**

```json
{
  "permissions": {
    "openapi": []
  }
}
```

**说明：**
- `permissions.openapi`: 云函数需要调用的开放接口权限
- 当前配置为空数组，表示不需要特殊权限

---

### 依赖包说明

**cloudfunctions/gradeEngine/package.json**

```json
{
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

**说明：**
- `wx-server-sdk`: 微信云开发服务端SDK
- 版本 `~2.6.3`: 使用2.6.x最新版本

---

## 📊 数据模型

### 题目数据结构

```javascript
{
  id: 'q_1234567890_0',           // 唯一ID
  question: '8 + 7',               // 题目表达式
  displayQuestion: '8 + 7 = ?',   // 显示文本
  answer: 15,                      // 正确答案
  type: 'addition',                // 题型
  operands: [8, 7],                // 操作数
  operator: '+',                   // 运算符
  gradeKey: 'grade_1_2',          // 年级
  categoryId: 'addition',          // 题型ID
  createdAt: '2025-11-30T...'     // 创建时间
}
```

---

## ⚙️ 环境变量配置

### 在云开发控制台设置

1. 进入"云函数" → "gradeEngine"
2. 点击"环境变量"标签
3. 添加以下变量（如果需要）：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| ENV | 环境标识 | production |
| DEBUG | 调试模式 | false |

---

## 🐛 常见问题

### 1. 部署失败：权限不足

**问题：** 提示"权限不足，无法上传云函数"

**解决：**
- 确保微信开发者工具已登录
- 检查账号是否有云开发权限
- 重新登录微信开发者工具

---

### 2. 调用失败：云函数不存在

**问题：** 调用时提示"cloud.callFunction:fail cloud function not exists"

**解决：**
1. 确认云函数已成功部署
2. 检查函数名称是否正确（`gradeEngine`）
3. 在云开发控制台确认函数状态为"正常"
4. 重新编译小程序

---

### 3. 返回数据为空

**问题：** 调用成功但返回的题目数组为空

**解决：**
1. 检查传入的参数是否正确
   - `gradeKey`: 必须是 'grade_1_2', 'grade_3_4', 'grade_5_6' 之一
   - `categoryId`: 必须是有效的题型ID
2. 查看云函数日志排查错误
3. 在控制台测试相同参数

---

### 4. 性能问题：生成题目很慢

**问题：** 生成题目耗时超过3秒

**解决：**
1. 减少题目数量（建议20-50题）
2. 检查网络连接
3. 考虑使用缓存策略
4. 升级云开发套餐提升性能

---

### 5. 云函数日志查看

1. 打开云开发控制台
2. 进入"云函数" → "gradeEngine"
3. 点击"日志"标签
4. 查看实时日志和错误信息

---

## 📈 性能优化建议

### 1. 减少调用次数

```javascript
// ❌ 不好的做法：每次练习都调用
const questions = await generateQuestions(gradeKey, categoryId, 10);

// ✅ 推荐做法：一次性生成多题，缓存使用
const questions = await generateQuestions(gradeKey, categoryId, 50);
wx.setStorageSync('questionsCache', questions);
```

### 2. 使用本地题库

对于常用题型，可以预生成题库：

```javascript
// 在小程序启动时预加载
async function preloadQuestions() {
  const cache = wx.getStorageSync('questionsCache');
  if (!cache || cache.length < 20) {
    // 生成新题目
    const res = await generateQuestions('grade_1_2', 'addition', 100);
    wx.setStorageSync('questionsCache', res.data.questions);
  }
}
```

### 3. 监控调用量

在云开发控制台查看：
- 每日调用次数
- 平均响应时间
- 错误率

---

## 💰 计费说明

### 免费额度

微信云开发免费套餐包含：
- 云函数调用：**10万次/月**
- 外网出流量：**1GB/月**
- 云函数执行时长：**4万GBs/月**

### 计费公式

- 调用费用 = 调用次数 × 单价
- 执行时长费用 = 内存配置 × 执行时长 × 单价

### 本项目预估

- 单次题目生成耗时：**~200ms**
- 每天100次调用：月费用 **~0元**（在免费额度内）
- 每天1000次调用：月费用 **~5元**

---

## 🔐 安全建议

### 1. 数据校验

在云函数中增强参数校验：

```javascript
// 校验年级key
const validGrades = ['grade_1_2', 'grade_3_4', 'grade_5_6'];
if (!validGrades.includes(gradeKey)) {
  return { success: false, error: '无效的年级参数' };
}

// 校验题目数量
const maxCount = 100;
if (count > maxCount) {
  return { success: false, error: `题目数量不能超过${maxCount}` };
}
```

### 2. 限流保护

使用云开发的触发器限流：

```javascript
// 设置调用频率限制
const rateLimiter = {
  maxRequests: 10,     // 最大请求数
  windowMs: 60000      // 时间窗口（1分钟）
};
```

### 3. 错误监控

接入云监控服务，实时监控：
- 错误率
- 响应时间
- 异常调用

---

## 📚 参考资源

- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云函数开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html)
- [云开发控制台](https://console.cloud.tencent.com/tcb)
- [云开发社区](https://developers.weixin.qq.com/community/develop/cloud)

---

## 📞 技术支持

遇到问题？请按以下顺序排查：

1. ✅ 检查本文档的"常见问题"部分
2. ✅ 查看云函数日志（云开发控制台）
3. ✅ 阅读云函数README文档（`cloudfunctions/gradeEngine/README.md`）
4. ✅ 参考微信官方文档
5. ✅ 在微信开发者社区提问

---

**版本**: v1.0.0  
**更新时间**: 2025-11-30  
**作者**: 口算助手开发团队
