# 智能口算引擎部署指南

## 📦 部署准备

### 1. 确认文件完整性

检查以下文件是否存在并已更新：

#### 云函数文件
- ✅ `cloudfunctions/gradeEngine/index.js` (已添加 smartGenerate action)
- ✅ `cloudfunctions/gradeEngine/gradeConfig.js` (新增 grade_1~6 配置)
- ✅ `cloudfunctions/gradeEngine/questionEngine.js` (26个专用生成器)
- ✅ `cloudfunctions/gradeEngine/package.json`
- ✅ `cloudfunctions/gradeEngine/config.json`

#### 小程序前端文件
- ✅ `miniprogram/pages/pdfGenerator/index.js` (集成智能分配调用)
- ✅ `miniprogram/pages/pdfGenerator/index.wxml`
- ✅ `miniprogram/pages/pdfGenerator/index.wxss`

#### 文档文件
- ✅ `SMART_ENGINE_UPGRADE.md` (技术文档)
- ✅ `DEPLOYMENT_GUIDE_SMART_ENGINE.md` (本文件)

---

## 🚀 部署步骤

### 方法一：微信开发者工具部署（推荐）

#### Step 1: 打开项目
```
1. 启动微信开发者工具
2. 打开项目: E:\Codebuddy\kousuan19
3. 等待项目加载完成
```

#### Step 2: 部署云函数
```
1. 在左侧文件树找到 cloudfunctions/gradeEngine 目录
2. 右键点击 gradeEngine 文件夹
3. 选择 "上传并部署：云端安装依赖"
4. 等待上传完成（约1-2分钟）
```

**注意事项**：
- ⚠️ 必须选择"云端安装依赖"，不能选择"仅上传"
- ⚠️ 首次部署需要等待云端安装 `wx-server-sdk` 依赖包
- ✅ 部署成功后会在控制台显示"上传成功"消息

#### Step 3: 验证部署
```
1. 打开"云开发" -> "云函数"面板
2. 找到 gradeEngine 函数
3. 点击"详情"查看版本信息
4. 确认"修改时间"为刚才的部署时间
```

#### Step 4: 测试云函数
```
1. 在云开发控制台点击"测试"按钮
2. 输入测试参数：
   {
     "action": "smartGenerate",
     "data": {
       "gradeKey": "grade_1",
       "count": 20
     }
   }
3. 点击"运行"
4. 检查返回结果是否包含 allocation 和 questions
```

**预期结果示例**：
```json
{
  "success": true,
  "data": {
    "gradeKey": "grade_1",
    "totalCount": 20,
    "allocation": [
      { "categoryId": "1_6", "categoryName": "20以内进位加法", "count": 4 },
      { "categoryId": "1_7", "categoryName": "20以内退位减法", "count": 4 },
      { "categoryId": "1_1", "categoryName": "10以内加法", "count": 2 },
      ...
    ],
    "questions": [
      { "expression": "8 + 7", "answer": 15, ... },
      ...
    ]
  }
}
```

---

### 方法二：命令行部署（高级）

#### 前置条件
- 已安装 [微信开发者工具 CLI](https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html)
- 已登录开发者工具

#### 部署命令
```bash
# 进入项目目录
cd E:\Codebuddy\kousuan19

# 上传云函数
cli cloud functions deploy gradeEngine --env your-env-id

# 或使用批量部署
cli cloud functions deploy --env your-env-id
```

**注意**：将 `your-env-id` 替换为你的云开发环境ID

---

## 🧪 功能测试

### 测试1: 智能分配基础功能

**操作步骤**：
1. 打开小程序
2. 进入"PDF生成"页面
3. 选择"一年级"
4. 启用"智能分配"开关
5. 设置题目数量为"50题"
6. 点击"生成试卷"

**验证点**：
- ✅ 页面显示 "智能分配完成！20以内进位加法:8题, ..." 消息
- ✅ 题型选择按钮变灰（不可手动选择）
- ✅ 生成的PDF包含约50道题
- ✅ 题目类型多样（加法、减法、混合等）

---

### 测试2: 不同年级验证

**测试矩阵**：

| 年级 | 题目数 | 预期题型数量 | 验证重点 |
|------|--------|------------|---------|
| 一年级 | 30 | 10种 | 20以内进位/退位占比高 |
| 二年级 | 40 | 9种 | 包含表内乘除法 |
| 三年级 | 50 | 8种 | 出现两位数乘一位数 |
| 四年级 | 60 | 7种 | 包含小数加减法 |
| 五年级 | 70 | 7种 | 包含分数加减法 |
| 六年级 | 80 | 7种 | 包含分数乘除法 |

**操作**：依次选择不同年级，生成试卷并检查题型分布

---

### 测试3: 题目质量检查

**检查项**：
1. **正确性**：随机抽查10题，验证答案计算正确
2. **难度**：
   - 一年级：主要是20以内，不应出现三位数
   - 六年级：应包含分数、小数混合运算
3. **去重**：同一份试卷不应有完全相同的题目
4. **格式**：表达式格式统一（如 `8 + 7 = ?`）

**示例验证**：
```javascript
// 一年级题目示例
"8 + 7 = ?"     ✅ 正确（15）
"9 - 6 = ?"     ✅ 正确（3）
"7 + □ = 10"    ✅ 正确（3）填空题格式

// 不应出现：
"234 + 567 = ?" ❌ 错误（超出年级范围）
"1/2 + 1/3 = ?" ❌ 错误（一年级不学分数）
```

---

### 测试4: 云函数降级测试

**模拟云函数失败**：
```javascript
// 在 index.js 中临时添加
generateQuestionsWithSmartAllocation() {
  return new Promise((resolve) => {
    // 模拟云函数失败
    const questions = this.generateQuestionsLocally();
    resolve(questions);
  });
}
```

**验证**：
- ✅ 页面不崩溃
- ✅ 仍能生成题目（使用本地逻辑）
- ✅ 用户收到友好提示

---

## 🐛 常见问题排查

### 问题1: 云函数部署失败

**错误信息**：
```
上传失败: 函数部署超时
```

**解决方案**：
1. 检查网络连接
2. 重新打开微信开发者工具
3. 清除缓存后重新部署
4. 尝试选择"仅上传"，然后在云开发控制台手动安装依赖

---

### 问题2: 智能分配无题目返回

**症状**：
```json
{
  "success": true,
  "data": {
    "questions": []  // 空数组
  }
}
```

**排查步骤**：
1. 检查 `gradeConfig.js` 是否包含对应年级配置
   ```javascript
   console.log(GRADE_CONFIG['grade_1']);  // 应输出配置对象
   ```

2. 检查 `questionEngine.js` 中生成器是否正确
   ```javascript
   const q = generate_1_1({ minValue: 0, maxValue: 10 });
   console.log(q);  // 应输出题目对象
   ```

3. 查看云函数日志（云开发控制台 -> 运行日志）

---

### 问题3: 题目类型不符合年级

**症状**：一年级出现分数题、六年级只有加减法等

**可能原因**：
- `gradeConfig.js` 配置错误
- `categoryId` 映射错误

**解决**：
1. 检查 `getSmartAllocation` 返回的 `categoryId`
2. 确认 `generateByRules` 中的映射表正确
   ```javascript
   const generatorMap = {
     '1_1': generate_1_1,  // 确保ID匹配
     '1_2': generate_1_2,
     ...
   };
   ```

---

### 问题4: 前端无法调用云函数

**错误信息**：
```
cloud.callFunction is not a function
```

**解决方案**：
1. 检查 `app.js` 中云开发初始化
   ```javascript
   wx.cloud.init({
     env: 'your-env-id',  // 替换为真实环境ID
     traceUser: true
   });
   ```

2. 确认小程序已开通云开发服务

3. 检查 `project.config.json` 中云开发配置
   ```json
   {
     "cloudfunctionRoot": "cloudfunctions/",
     "miniprogramRoot": "miniprogram/"
   }
   ```

---

## 📊 性能监控

### 云函数耗时统计

在云开发控制台查看：
- **平均耗时**：< 2秒（50题）
- **峰值耗时**：< 5秒（100题）
- **成功率**：> 99%

### 优化建议

如果耗时过长：
1. 减少题目去重尝试次数（修改 `maxAttempts`）
2. 优化生成器算法（避免过多重试）
3. 考虑题目缓存机制

---

## 🔄 版本回滚

如果新版本出现严重问题，快速回滚：

### Step 1: Git回滚代码
```bash
cd E:\Codebuddy\kousuan19
git log --oneline  # 查看提交历史
git revert f8487b6  # 回滚到上一个稳定版本
```

### Step 2: 重新部署旧版云函数
```
1. 微信开发者工具
2. 右键 gradeEngine -> 上传并部署
3. 等待部署完成
```

### Step 3: 清除小程序缓存
```
1. 开发者工具 -> 清除缓存
2. 真机测试：删除小程序重新进入
```

---

## ✅ 部署检查清单

部署完成后，请完成以下检查：

- [ ] 云函数部署成功（云开发控制台可见）
- [ ] 云函数测试通过（smartGenerate 返回正确数据）
- [ ] 小程序模拟器测试（智能分配功能正常）
- [ ] 真机测试（iOS + Android）
- [ ] 题目质量抽查（随机检查20题）
- [ ] 性能测试（生成100题耗时 < 5秒）
- [ ] 日志监控（云函数日志无报错）
- [ ] 用户体验测试（UI交互流畅）

---

## 📞 技术支持

如遇无法解决的问题：

1. **查看日志**：
   - 云开发控制台 -> 运行日志
   - 小程序控制台 -> Console面板

2. **检查文档**：
   - [SMART_ENGINE_UPGRADE.md](SMART_ENGINE_UPGRADE.md) - 技术详解
   - [CLOUD_FUNCTION_GUIDE.md](CLOUD_FUNCTION_GUIDE.md) - 云函数指南

3. **Debug模式**：
   ```javascript
   // 在 index.js 中添加详细日志
   console.log('智能分配参数:', { gradeKey, count });
   console.log('分配结果:', allocation);
   console.log('生成题目数:', questions.length);
   ```

---

**🎉 部署完成！享受智能化的口算题目生成系统吧！**

---

## 📝 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v2.0 | 2025-12-01 | 智能引擎上线，支持82种题型 |
| v1.0 | 2025-11-30 | 基础版本，3个年级段 |
