# 🧪 年级题型同步问题修复 - 测试验证文档

## ✅ 已修复的问题

### 问题1: 年级格式不一致 ✅
- **修复前**: 首页使用 `grade_1_2` 调用云函数
- **修复后**: 直接使用 `grade_1` 调用云函数
- **影响文件**: `miniprogram/pages/home/index.js`

### 问题2: 题型数据未传递 ✅
- **修复前**: 只传递 `grade` 和 `count`
- **修复后**: 传递 `grade`, `count`, `smartAllocation`, `fromPage`
- **影响文件**: `miniprogram/pages/home/index.js`

### 问题3: 智能分配未启用 ✅
- **修复前**: PDF页面默认关闭智能分配
- **修复后**: 从首页进入自动启用智能分配
- **影响文件**: `miniprogram/pages/pdfGenerator/index.js`

---

## 📋 测试用例清单

### 测试用例1: 基础数据传递 🔍

**测试步骤**：
1. 打开小程序首页
2. 选择 "三年级"
3. 设置题目数量为 "50题"
4. 点击 "立即生成试卷"

**验证点**：
```
PDF页面应显示：
✅ 年级选择：三年级（已选中）
✅ 题目数量：50
✅ 智能分配：开启状态
✅ 提示消息："已启用智能分配模式，系统将自动配比题型"
```

**验证方法**：
- 打开调试器 Console
- 查看日志：
  ```
  跳转PDF页面，参数: { grade: "grade_3", count: 50, smartAllocation: "true", fromPage: "home" }
  PDF生成页面加载，参数: { grade: "grade_3", count: "50", smartAllocation: "true", fromPage: "home" }
  接收到年级: grade_3
  接收到题目数量: 50
  自动启用智能分配模式
  ```

---

### 测试用例2: 不同年级验证 🔍

**测试矩阵**：

| 测试项 | 一年级 | 三年级 | 六年级 |
|--------|--------|--------|--------|
| 年级参数 | grade_1 | grade_3 | grade_6 |
| 题型数量 | 10种 | 8种 | 7种 |
| 快捷练习 | 显示6个 | 显示6个 | 显示6个 |
| PDF跳转 | ✅ 正常 | ✅ 正常 | ✅ 正常 |
| 智能分配 | ✅ 自动启用 | ✅ 自动启用 | ✅ 自动启用 |

**操作步骤**：
```
For each 年级 in [一年级, 三年级, 六年级]:
  1. 选择年级
  2. 观察快捷练习题型是否更新
  3. 点击"立即生成试卷"
  4. 验证PDF页面参数正确
```

---

### 测试用例3: 云函数调用验证 🔍

**测试代码**：
```javascript
// 在首页控制台执行
const page = getCurrentPages()[0];

// 测试1: 验证年级选择
console.log('当前年级:', page.data.selectedGrade);
console.log('预期格式: grade_1, grade_2, ... grade_6');

// 测试2: 验证题型加载
console.log('题型数量:', page.data.categories.length);
console.log('题型列表:', page.data.categories.map(c => c.name));

// 测试3: 验证跳转参数构建
const params = {
  grade: page.data.selectedGrade,
  count: page.data.selectedCount,
  smartAllocation: 'true',
  fromPage: 'home'
};
console.log('跳转参数:', params);
```

**预期结果**：
```
当前年级: "grade_1"
预期格式: grade_1, grade_2, ... grade_6
题型数量: 10
题型列表: ["10以内加法", "10以内减法", ...]
跳转参数: {grade: "grade_1", count: 20, smartAllocation: "true", fromPage: "home"}
```

---

### 测试用例4: 智能分配功能验证 🔍

**测试步骤**：
1. 从首页跳转到PDF页面（自动启用智能分配）
2. 验证智能分配开关状态：应为 ON
3. 验证题型选择按钮：应为禁用状态（灰色）
4. 点击 "生成试卷"
5. 观察顶部提示消息

**验证点**：
```
✅ 智能分配开关：自动开启
✅ 题型选择按钮：disabled状态
✅ 提示消息：显示各题型分配数量
✅ 生成结果：题目包含多种题型
```

**Console日志验证**：
```javascript
// PDF页面Console
console.log('智能分配状态:', this.data.smartAllocation);
// 预期: true

console.log('题型选择禁用:', this.data.smartAllocation);
// 预期: true（题型按钮应禁用）
```

---

### 测试用例5: 向后兼容性验证 🔍

**目的**: 确保旧数据格式能正确转换

**测试代码**：
```javascript
// 在首页Console执行

// 模拟旧格式数据
wx.setStorageSync('selectedGrade', 'grade_1_2');

// 重新加载页面
wx.reLaunch({ url: '/pages/home/index' });

// 等待页面加载后，检查
const page = getCurrentPages()[0];
console.log('转换后的年级:', page.data.selectedGrade);
// 预期: "grade_1"

console.log('存储中的年级:', wx.getStorageSync('selectedGrade'));
// 预期: "grade_1"（已自动转换）
```

**测试矩阵**：
| 旧格式 | 新格式 | 状态 |
|--------|--------|------|
| grade_1_2 | grade_1 | ✅ 应转换 |
| grade_3_4 | grade_3 | ✅ 应转换 |
| grade_5_6 | grade_5 | ✅ 应转换 |
| grade_1 | grade_1 | ✅ 保持不变 |

---

### 测试用例6: 云函数返回数据验证 🔍

**测试代码**：
```javascript
// 在云开发控制台测试

// 测试新格式调用
{
  "action": "getCategoriesByGrade",
  "data": {
    "gradeKey": "grade_1"
  }
}

// 预期返回:
{
  "success": true,
  "data": [
    { "id": "1_1", "name": "10以内加法", "difficulty": "easy", "weight": 2 },
    { "id": "1_2", "name": "10以内减法", "difficulty": "easy", "weight": 2 },
    // ... 共10种题型
  ]
}

// 测试旧格式调用（应该失败）
{
  "action": "getCategoriesByGrade",
  "data": {
    "gradeKey": "grade_1_2"
  }
}

// 预期返回:
{
  "success": false,
  "error": "未找到年级配置"
}
```

---

### 测试用例7: 跨页面数据流追踪 🔍

**追踪日志脚本**：

**首页 (home/index.js)**:
```javascript
// 在 goToPdfGenerator() 中添加
console.log('🚀 [首页] 准备跳转');
console.log('  ├─ 年级:', this.data.selectedGrade);
console.log('  ├─ 题目数:', this.data.selectedCount);
console.log('  ├─ 题型数:', this.data.categories.length);
console.log('  └─ 参数:', params);
```

**PDF页面 (pdfGenerator/index.js)**:
```javascript
// 在 onLoad(options) 中添加
console.log('📥 [PDF页面] 接收参数');
console.log('  ├─ 原始参数:', options);
console.log('  ├─ 解析年级:', options.grade);
console.log('  ├─ 解析数量:', parseInt(options.count));
console.log('  ├─ 解析智能分配:', options.smartAllocation === 'true');
console.log('  └─ 最终状态:', {
  selectedGrade: this.data.selectedGrade,
  questionCount: this.data.questionCount,
  smartAllocation: this.data.smartAllocation
});
```

**预期日志输出**：
```
🚀 [首页] 准备跳转
  ├─ 年级: grade_3
  ├─ 题目数: 50
  ├─ 题型数: 8
  └─ 参数: {grade: "grade_3", count: 50, smartAllocation: "true", fromPage: "home"}

📥 [PDF页面] 接收参数
  ├─ 原始参数: {grade: "grade_3", count: "50", smartAllocation: "true", fromPage: "home"}
  ├─ 解析年级: grade_3
  ├─ 解析数量: 50
  ├─ 解析智能分配: true
  └─ 最终状态: {selectedGrade: "grade_3", questionCount: 50, smartAllocation: true}
```

---

## 🐛 常见问题排查

### Q1: PDF页面年级仍显示为"一年级"？

**排查步骤**：
```
1. 检查首页是否正确传递参数
   - Console查看: 跳转PDF页面，参数: {...}
   
2. 检查PDF页面是否正确接收
   - Console查看: 接收到年级: grade_X
   
3. 检查数据绑定
   - wxml中检查: {{selectedGrade}}
```

**可能原因**：
- ❌ 缓存问题：清除小程序缓存重试
- ❌ 参数编码问题：检查URL编码是否正确
- ❌ 页面未刷新：检查setData是否生效

---

### Q2: 智能分配未自动启用？

**排查步骤**：
```javascript
// PDF页面Console
console.log('参数:', options);
console.log('smartAllocation值:', options.smartAllocation);
console.log('类型:', typeof options.smartAllocation);
console.log('判断结果:', options.smartAllocation === 'true');
```

**注意事项**：
- ⚠️ URL参数都是字符串类型
- ⚠️ 必须使用 `=== 'true'` 判断
- ⚠️ 不能使用 `=== true`（会失败）

---

### Q3: 题型数据为空？

**排查步骤**：
```javascript
// 首页Console
const { getCategoriesByGrade } = require('../../utils/gradeApi.js');

getCategoriesByGrade('grade_1').then(res => {
  console.log('云函数返回:', res);
  if (res.success) {
    console.log('✅ 成功，题型数量:', res.data.length);
  } else {
    console.log('❌ 失败，错误:', res.error);
  }
});
```

**可能原因**：
- ❌ 云函数未部署最新版本
- ❌ 网络问题导致调用失败
- ❌ 年级格式错误（使用了旧格式）

---

## 📊 回归测试清单

修复完成后，请依次测试以下功能确保没有副作用：

- [ ] **首页年级选择**: 选择不同年级，快捷练习题型正确更新
- [ ] **首页题目数量设置**: 预设值和自定义输入都正常工作
- [ ] **快捷练习入口**: 点击题型卡片能正确跳转到练习页
- [ ] **数的分解入口**: 能正常跳转并传递参数
- [ ] **单位换算入口**: 能正常跳转并传递参数
- [ ] **PDF生成入口**: 能正常跳转并传递所有参数
- [ ] **PDF页面智能分配**: 自动启用并显示提示
- [ ] **PDF页面手动选题**: 关闭智能分配后能手动选择
- [ ] **PDF页面生成功能**: 能正常生成试卷
- [ ] **数据持久化**: 刷新页面后年级和数量保持不变

---

## 🎯 验收标准

### 必须通过的测试

1. ✅ **参数传递完整性**
   - 年级、题目数量、智能分配标识都正确传递

2. ✅ **智能分配自动启用**
   - 从首页进入PDF页面时，智能分配自动开启

3. ✅ **年级格式统一**
   - 全链路使用新格式（grade_1 ~ grade_6）

4. ✅ **云函数调用成功**
   - 能正确获取题型列表，无报错

5. ✅ **向后兼容**
   - 旧数据格式能自动转换为新格式

---

## 📝 测试报告模板

```markdown
# 测试报告

**测试人员**: [姓名]
**测试时间**: [YYYY-MM-DD HH:mm]
**测试环境**: 
  - 微信开发者工具版本: [版本号]
  - 基础库版本: [版本号]
  - 云函数版本: [提交hash]

## 测试结果

### 用例1: 基础数据传递
- 状态: ✅ 通过 / ❌ 失败
- 备注: 

### 用例2: 不同年级验证
- 一年级: ✅ / ❌
- 三年级: ✅ / ❌
- 六年级: ✅ / ❌

### 用例3: 云函数调用验证
- 状态: ✅ 通过 / ❌ 失败
- 响应时间: [毫秒]

### 用例4: 智能分配功能验证
- 状态: ✅ 通过 / ❌ 失败

### 用例5: 向后兼容性验证
- 状态: ✅ 通过 / ❌ 失败

## 问题记录

### Bug 1
- 描述: 
- 复现步骤: 
- 严重程度: 高/中/低

## 总结

- 通过率: [X/Y]
- 是否可发布: ✅ 是 / ❌ 否
- 建议: 
```

---

## 🚀 发布前检查清单

- [ ] 所有测试用例通过
- [ ] 真机测试验证（iOS + Android）
- [ ] 云函数已部署最新版本
- [ ] 代码已提交到Git
- [ ] 文档已更新
- [ ] 用户手册已同步修改
- [ ] 已通知相关人员测试

---

**测试完成标准**: 所有测试用例通过 + 回归测试清单全部打勾 ✅
