# TDesign 小程序组件库配置指南

## ✅ 配置完成状态

### 1. 环境检查 ✓
- **Node.js版本**: v20.13.1 ✓
- **npm版本**: 10.9.2 ✓
- 版本符合要求，可以正常使用

### 2. 依赖安装 ✓
- 已创建 `package.json`
- 已安装 `tdesign-miniprogram` v1.5.0
- 依赖包安装成功

### 3. 项目配置 ✓
- ✓ `project.config.json` - 已启用 `nodeModules: true`
- ✓ `app.json` - 已配置全局组件引入

### 4. 测试页面 ✓
- 已创建测试页面 `pages/tdesign-test/index`
- 包含多个组件测试用例

---

## 📋 使用步骤

### 第一步：构建npm包（重要）
在微信开发者工具中执行以下操作：
1. 打开项目
2. 点击菜单栏 **工具** → **构建 npm**
3. 等待构建完成，会在 `miniprogram` 目录下生成 `miniprogram_npm` 文件夹

### 第二步：访问测试页面
1. 在微信开发者工具中打开项目
2. 导航到 `pages/tdesign-test/index` 测试页面
3. 验证各组件功能是否正常

---

## 🧪 测试用例说明

测试页面包含以下TDesign组件的功能验证：

### 1. 按钮组件 (t-button)
- **主要按钮**: 测试主题色和点击事件
- **次要按钮**: 测试次要主题和交互
- **危险按钮**: 测试危险操作样式

### 2. 输入框组件 (t-input)
- 测试输入内容实时绑定
- 测试清除功能
- 显示输入结果

### 3. 单元格组件 (t-cell / t-cell-group)
- 测试基础单元格显示
- 测试箭头指示器
- 测试带图标的单元格

### 4. 图标组件 (t-icon)
- 测试多个内置图标
- 测试图标颜色和尺寸

### 5. 对话框组件 (t-dialog)
- 测试确认对话框
- 测试确认/取消回调

### 6. 消息提示组件 (t-message)
- 测试成功提示
- 测试信息提示

---

## 🎨 已全局引入的组件

在 `app.json` 中已配置以下全局组件，可在任意页面直接使用：

```json
{
  "t-button": "tdesign-miniprogram/button/button",
  "t-cell": "tdesign-miniprogram/cell/cell",
  "t-cell-group": "tdesign-miniprogram/cell-group/cell-group",
  "t-icon": "tdesign-miniprogram/icon/icon",
  "t-input": "tdesign-miniprogram/input/input",
  "t-dialog": "tdesign-miniprogram/dialog/dialog",
  "t-message": "tdesign-miniprogram/message/message"
}
```

---

## 📚 使用示例

### 在页面中使用按钮
```xml
<t-button theme="primary" size="large" bind:tap="handleClick">
  点击我
</t-button>
```

### 在页面中使用输入框
```xml
<t-input 
  placeholder="请输入内容" 
  value="{{value}}"
  bind:change="onChange"
  clearable
/>
```

### 使用对话框
```javascript
import Dialog from 'tdesign-miniprogram/dialog/index';

Dialog.confirm({
  title: '提示',
  content: '确认要执行此操作吗？',
}).then(() => {
  console.log('确认');
});
```

---

## 🔗 相关资源

- [TDesign 小程序官方文档](https://tdesign.tencent.com/miniprogram/overview)
- [TDesign GitHub](https://github.com/Tencent/tdesign-miniprogram)
- [组件示例](https://tdesign.tencent.com/miniprogram/components/button)

---

## ⚠️ 注意事项

1. **必须先构建npm**: 首次使用或更新依赖后，必须在微信开发者工具中构建npm
2. **基础库版本**: 建议使用微信小程序基础库 2.20.1 或更高版本
3. **样式兼容**: TDesign 组件已包含完整样式，无需额外引入
4. **按需引入**: 如不需要全局引入，可在页面的 `.json` 文件中单独引入组件

---

## ✨ 验证清单

使用以下清单验证配置是否成功：

- [ ] 在微信开发者工具中成功构建npm
- [ ] 打开测试页面无报错
- [ ] 按钮组件可正常点击并显示提示
- [ ] 输入框可正常输入并实时显示内容
- [ ] 单元格列表正常显示
- [ ] 图标正常显示且颜色正确
- [ ] 对话框可正常弹出和交互
- [ ] 消息提示可正常显示

全部通过即表示TDesign组件库配置成功！🎉
