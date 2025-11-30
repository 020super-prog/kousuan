# 年级选择器调试指南

## 🔧 已修复的问题

### 1. ⛔ 核心问题：t-picker-item组件未注册
**问题描述：** `t-picker-item` 组件在 `app.json` 中未全局注册，导致选择器无法正常渲染。

**修复内容：**
```json
// app.json
"usingComponents": {
  "t-picker": "tdesign-miniprogram/picker/picker",
  "t-picker-item": "tdesign-miniprogram/picker-item/picker-item",  // ✅ 新增
  ...
}
```

### 2. 📊 数据格式问题
**问题描述：** 云函数返回的年级数据格式与TDesign Picker组件要求不匹配。

**修复前格式：**
```javascript
[
  { key: 'grade_1_2', name: '一二年级', level: 1 },
  { key: 'grade_3_4', name: '三四年级', level: 2 },
  { key: 'grade_5_6', name: '五六年级', level: 3 }
]
```

**修复后格式：**
```javascript
[
  { label: '一二年级', value: 'grade_1_2' },
  { label: '三四年级', value: 'grade_3_4' },
  { label: '五六年级', value: 'grade_5_6' }
]
```

**修复代码（index.js）：**
```javascript
const grades = res.data.map(grade => ({
  label: grade.name,    // TDesign要求使用label作为显示文本
  value: grade.key      // TDesign要求使用value作为选项值
}));
```

### 3. 🎯 选择器索引追踪问题
**问题描述：** `value` 属性固定为 `[0]`，无法记住用户上次的选择。

**修复内容：**
```javascript
// 新增数据字段
data: {
  selectedGradeIndex: 0,  // 记录当前选中的索引
  ...
}

// WXML中绑定动态值
<t-picker value="{{[selectedGradeIndex]}}" ...>
```

### 4. 📝 增强日志输出
**新增调试信息：**
```javascript
console.log('年级数据加载结果:', res);
console.log('格式化后的年级数据:', grades);
console.log('年级选择确认事件:', e.detail);
console.log('选中的年级:', gradeKey);
```

---

## 🧪 测试步骤

### 第一步：检查组件注册
1. 打开微信开发者工具
2. 查看控制台是否有 "Component is not found in path" 错误
3. 如果没有此错误，说明组件注册成功 ✅

### 第二步：测试年级数据加载
1. 打开首页
2. 查看控制台输出：
   ```
   年级数据加载结果: {success: true, data: [...]}
   格式化后的年级数据: [{label: '一二年级', value: 'grade_1_2'}, ...]
   ```
3. 确认数据格式正确 ✅

### 第三步：测试选择器交互
1. 点击"请选择年级"按钮
2. 选择器应该正常弹出
3. 查看是否显示三个年级选项
4. 选择任意年级后点击确定
5. 观察控制台输出：
   ```
   年级选择确认事件: {value: [1]}
   选中的年级: grade_3_4
   ```
6. 首页应显示"已切换到三四年级"提示 ✅

### 第四步：测试题型加载
1. 选择年级后，首页应自动加载该年级的题型
2. 快捷练习区域应显示6个题型按钮
3. 点击任意题型按钮能正常跳转到练习页 ✅

---

## ⚠️ 常见问题排查

### 问题1：云函数调用失败
**症状：** 控制台显示 "云函数调用错误" 或 "网络错误"

**排查步骤：**
1. 检查 `app.js` 中的云开发环境ID：
   ```javascript
   // app.js
   wx.cloud.init({
     env: "", // ⚠️ 这里需要填写真实的云环境ID
     traceUser: true,
   });
   ```

2. 获取云环境ID：
   - 打开微信开发者工具
   - 点击"云开发"按钮
   - 在云开发控制台中查看环境ID（如：`cloud1-xxx`）
   - 将ID填入 `app.js` 中的 `env` 字段

3. 检查云函数是否已上传：
   - 在云开发控制台 → 云函数列表
   - 确认 `gradeEngine` 云函数存在且状态正常
   - 如果未上传，右键 `cloudfunctions/gradeEngine` 目录，选择"上传并部署"

### 问题2：选择器不显示选项
**症状：** 选择器弹出但是空白

**排查步骤：**
1. 检查 `grades` 数据是否为空：
   ```javascript
   // 在 showGradeSelector 中添加日志
   showGradeSelector() {
     console.log('当前年级数据:', this.data.grades);
     this.setData({ showGradePicker: true });
   }
   ```

2. 确认数据格式是否正确（必须包含 `label` 和 `value` 字段）

3. 检查 `t-picker-item` 是否正确绑定了 `options` 属性

### 问题3：选择后没有反应
**症状：** 点击确定后页面没有变化

**排查步骤：**
1. 检查事件绑定是否正确：
   ```xml
   bindconfirm="onGradeConfirm"  <!-- 确认事件 -->
   bindcancel="onGradeCancel"    <!-- 取消事件 -->
   ```

2. 查看控制台是否有错误信息

3. 在 `onGradeConfirm` 方法开头添加日志：
   ```javascript
   onGradeConfirm(e) {
     console.log('确认事件触发，参数:', e.detail);
     // ...
   }
   ```

### 问题4：题型不加载
**症状：** 选择年级后，快捷练习区域显示"请先选择年级"

**排查步骤：**
1. 检查 `loadCategories` 方法是否被调用
2. 查看云函数 `getCategoriesByGrade` 是否返回正确数据
3. 确认 `quickPractices` 数组是否有数据

---

## 📋 完整修复文件清单

| 文件 | 修改内容 | 状态 |
|------|---------|------|
| `miniprogram/app.json` | 新增 `t-picker-item` 组件注册 | ✅ |
| `miniprogram/pages/home/index.js` | 修复数据格式、增加索引追踪、增强日志 | ✅ |
| `miniprogram/pages/home/index.wxml` | 修复 `value` 属性绑定 | ✅ |

---

## 🎯 下一步建议

### 1. 配置云开发环境ID（必须）
```javascript
// miniprogram/app.js
wx.cloud.init({
  env: "你的云环境ID",  // ⚠️ 必须填写
  traceUser: true,
});
```

### 2. 上传云函数（必须）
```bash
# 方式1：开发者工具界面操作
右键 cloudfunctions/gradeEngine → 上传并部署：云端安装依赖

# 方式2：命令行（如果已配置）
./uploadCloudFunction.sh
```

### 3. 测试完整流程
- [ ] 启动小程序
- [ ] 点击年级选择器
- [ ] 选择不同年级
- [ ] 验证题型是否正确加载
- [ ] 点击题型进入练习页

### 4. 可选优化
- 添加选择器加载动画
- 增加网络异常提示
- 实现年级切换动画效果

---

## 🆘 紧急联系

如果问题仍未解决，请提供以下信息：
1. 微信开发者工具控制台完整日志
2. 云函数调用日志（云开发控制台 → 云函数日志）
3. 小程序基础库版本（右上角详情 → 本地设置 → 调试基础库）
4. 具体的错误提示截图
