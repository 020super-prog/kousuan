# 年级题型智能匹配引擎 - 云函数文档

## 📋 功能概述

本云函数是**小学口算助手**项目的核心引擎，负责：
- 管理1-6年级的题型配置数据
- 根据年级和题型智能生成题目
- 提供年级题型查询API接口
- 确保题目难度符合各年级教学要求

---

## 📁 文件结构

```
gradeEngine/
├── index.js              # 云函数入口
├── gradeConfig.js        # 年级题型配置数据库
├── questionEngine.js     # 题目生成引擎
├── package.json          # 依赖配置
├── config.json           # 云函数配置
└── README.md             # 本文档
```

---

## 🎯 核心模块

### 1. gradeConfig.js - 年级配置数据库

基于教学大纲图片设计的完整年级题型映射：

#### 年级分类
- **1-2年级（第一学段）**：基础加减法、简单单位换算
- **3-4年级（第二学段）**：乘除法、混合运算、小数分数基础
- **5-6年级（第三学段）**：复杂混合运算、高级单位换算

#### 数据模型
```javascript
{
  name: '年级名称',
  level: 1-3,
  categories: [
    {
      id: '题型ID',
      name: '题型名称',
      description: '题型说明',
      rules: {
        // 题目生成规则
        operands: 2,
        operators: ['+', '-'],
        minValue: 0,
        maxValue: 20,
        // ...更多规则
      },
      difficulty: 'easy|medium|hard'
    }
  ],
  practiceRange: {
    questionCount: [10, 20, 30],
    timeLimit: 300,
    targetAccuracy: 80
  }
}
```

---

### 2. questionEngine.js - 题目生成引擎

智能生成符合年级要求的题目：

#### 支持的题型
- ✅ 加法（进位/不进位）
- ✅ 减法（退位/不退位）
- ✅ 乘法（表内/表外）
- ✅ 除法（整除）
- ✅ 混合运算（2-3步）
- ✅ 小数运算（1-2位小数）
- ✅ 分数运算（同分母/异分母）
- ✅ 比较大小

#### 生成特性
- 避免重复题目
- 自动调整难度
- 符合年级要求
- 支持批量生成

---

## 🔌 API接口

### 1. getAllGrades - 获取所有年级

**请求参数：** 无

**返回数据：**
```javascript
{
  success: true,
  data: [
    { key: 'grade_1_2', name: '一二年级', level: 1 },
    { key: 'grade_3_4', name: '三四年级', level: 2 },
    { key: 'grade_5_6', name: '五六年级', level: 3 }
  ]
}
```

---

### 2. getCategoriesByGrade - 获取年级题型列表

**请求参数：**
```javascript
{
  gradeKey: 'grade_1_2' // 年级key
}
```

**返回数据：**
```javascript
{
  success: true,
  data: [
    {
      id: 'addition',
      name: '加法',
      description: '20以内进位/连进位加法',
      difficulty: 'easy'
    },
    // ...更多题型
  ]
}
```

---

### 3. getCategoryRules - 获取题型详细规则

**请求参数：**
```javascript
{
  gradeKey: 'grade_1_2',
  categoryId: 'addition'
}
```

**返回数据：**
```javascript
{
  success: true,
  data: {
    id: 'addition',
    name: '加法',
    description: '20以内进位/连进位加法',
    rules: {
      operands: 2,
      operators: ['+'],
      minValue: 0,
      maxValue: 20,
      allowCarry: true
    },
    difficulty: 'easy'
  }
}
```

---

### 4. getGradeConfig - 获取年级完整配置

**请求参数：**
```javascript
{
  gradeKey: 'grade_3_4'
}
```

**返回数据：**
```javascript
{
  success: true,
  data: {
    name: '三四年级',
    level: 2,
    categories: [...],
    practiceRange: {
      questionCount: [20, 30, 50],
      timeLimit: 600,
      targetAccuracy: 85
    }
  }
}
```

---

### 5. generateQuestions - 生成题目（核心功能）

**请求参数：**
```javascript
{
  gradeKey: 'grade_1_2',
  categoryId: 'addition',
  count: 10 // 题目数量，默认10
}
```

**返回数据：**
```javascript
{
  success: true,
  data: {
    gradeKey: 'grade_1_2',
    categoryId: 'addition',
    count: 10,
    questions: [
      {
        id: 'q_1234567890_0',
        question: '8 + 7',
        displayQuestion: '8 + 7 = ?',
        answer: 15,
        type: 'addition',
        operands: [8, 7],
        operator: '+',
        gradeKey: 'grade_1_2',
        categoryId: 'addition',
        createdAt: '2025-11-30T...'
      },
      // ...更多题目
    ]
  }
}
```

---

### 6. getRecommendedPractice - 获取推荐练习

**请求参数：**
```javascript
{
  gradeKey: 'grade_1_2'
}
```

**返回数据：**
```javascript
{
  success: true,
  data: {
    gradeKey: 'grade_1_2',
    gradeName: '一二年级',
    level: 1,
    categories: [...],
    practiceRange: {
      questionCount: [10, 20, 30],
      timeLimit: 300,
      targetAccuracy: 80
    }
  }
}
```

---

## 🚀 部署步骤

### 1. 在微信开发者工具中

1. 右键点击 `cloudfunctions/gradeEngine` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

### 2. 在云开发控制台

1. 打开[微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 选择你的环境
3. 进入"云函数"页面
4. 找到 `gradeEngine` 函数
5. 确认状态为"正常"

---

## 🧪 测试方法

### 在微信开发者工具中测试

```javascript
// 在小程序页面中调用
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
  },
  fail: err => {
    console.error('调用失败:', err);
  }
});
```

### 在云函数控制台测试

测试模板：
```json
{
  "action": "getAllGrades",
  "data": {}
}
```

```json
{
  "action": "generateQuestions",
  "data": {
    "gradeKey": "grade_1_2",
    "categoryId": "addition",
    "count": 10
  }
}
```

---

## 📊 年级题型映射表

### 1-2年级
| 题型ID | 题型名称 | 难度 | 说明 |
|--------|----------|------|------|
| addition | 加法 | 简单 | 20以内进位加法 |
| subtraction | 减法 | 简单 | 20以内退位减法 |
| measurement_basic | 单位换算 | 简单 | 长度/货币/时间 |

### 3-4年级
| 题型ID | 题型名称 | 难度 | 说明 |
|--------|----------|------|------|
| addition_advanced | 加法 | 中等 | 三位数连续进位 |
| subtraction_advanced | 减法 | 中等 | 四位数连续退位 |
| multiplication | 乘除法 | 中等 | 表内乘除法 |
| mixed_operations | 混合运算 | 中等 | 两步混合运算 |
| decimals_basic | 小数运算 | 中等 | 一位小数 |
| fractions_basic | 分数运算 | 中等 | 同分母分数 |

### 5-6年级
| 题型ID | 题型名称 | 难度 | 说明 |
|--------|----------|------|------|
| mixed_advanced | 整数运算 | 困难 | 简便运算 |
| decimals_advanced | 小数运算 | 困难 | 两位小数 |
| fractions_advanced | 分数运算 | 困难 | 异分母分数 |
| mixed_operations_advanced | 混合运算 | 困难 | 3-4步混合 |
| measurement_advanced | 单位换算 | 困难 | 面积/体积 |

---

## ⚠️ 注意事项

1. **云函数环境变量**：确保已初始化云开发环境
2. **权限配置**：云函数默认有读取数据库权限
3. **并发限制**：免费版有并发限制，请注意控制
4. **计费说明**：根据调用次数和执行时长计费
5. **错误处理**：所有API都包含错误处理逻辑

---

## 🔄 更新日志

**v1.0.0** (2025-11-30)
- ✅ 初始版本发布
- ✅ 支持1-6年级题型配置
- ✅ 实现8种题型生成器
- ✅ 提供6个核心API接口
- ✅ 完整的错误处理机制

---

## 📞 技术支持

如有问题，请检查：
1. 云函数是否正确部署
2. 云开发环境是否已初始化
3. 前端调用参数是否正确
4. 查看云函数日志排查错误

---

**开发者**: 口算助手团队  
**版本**: v1.0.0  
**更新时间**: 2025-11-30
