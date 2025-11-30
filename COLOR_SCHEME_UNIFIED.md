# 小程序统一配色方案说明

## 📋 配色统一完成

所有练习页面（分解练习、单位换算）的视觉风格已与主页完全统一，确保用户体验的一致性。

---

## 🎨 主色调系统

### 1. 主色调 - 智慧蓝
```css
#4A90E2  /* 主按钮、强调文字、进度条 */
#5BA3F5  /* 渐变辅助色 */
```

**使用场景**：
- 年级选择按钮（激活状态）
- 进度文字
- 提交按钮背景
- 进度条填充
- 输入框边框

### 2. 辅助色 - 活力橙
```css
#FF6B35  /* 题目数量按钮、时间显示 */
#FF8C5A  /* 渐变辅助色 */
```

**使用场景**：
- 题目数量选择（激活状态）
- 计时器文字
- 强调提示

### 3. 功能色 - 成功绿
```css
#27AE60  /* 成功反馈、模式标识 */
```

**使用场景**：
- 正确答案反馈图标
- 分解练习模式文字
- 统计数据（正确率）

### 4. 中性色系
```css
#2C3E50  /* 主文字颜色 */
#95A5A6  /* 次要文字、提示文字 */
#F8F9FA  /* 浅灰背景 */
#E8E8E8  /* 边框、分割线 */
#FFFFFF  /* 卡片背景、按钮文字 */
```

---

## 🎯 页面配色对比

### 主页（Home）
```css
/* 背景 */
background: linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx);

/* 卡片 */
background: #FFFFFF;
border-radius: 16rpx;
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

/* 按钮 */
background: linear-gradient(135deg, #4A90E2, #5BA3F5);  /* 年级按钮 */
background: linear-gradient(135deg, #FF6B35, #FF8C5A);  /* 数量按钮 */
```

### 分解练习页（Decompose）- ✅ 已统一
```css
/* 背景 */
background: linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx);  /* ✅ 与主页一致 */

/* 顶部信息栏 */
background: #FFFFFF;                                      /* ✅ 与主页一致 */
border-radius: 16rpx;                                     /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);           /* ✅ 与主页一致 */

/* 题目卡片 */
background: #FFFFFF;                                      /* ✅ 与主页一致 */
border-radius: 16rpx;                                     /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);           /* ✅ 与主页一致 */

/* 提交按钮 */
background: #4A90E2;                                      /* ✅ 与主页一致 */
border-radius: 44rpx;                                     /* ✅ 与主页一致 */
height: 88rpx;                                            /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);       /* ✅ 与主页一致 */

/* 进度条 */
background: #E8E8E8;                                      /* ✅ 与主页一致 */
fill: #4A90E2;                                            /* ✅ 与主页一致 */
```

### 单位换算页（Unit）- ✅ 已统一
```css
/* 背景 */
background: linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx);  /* ✅ 与主页一致 */

/* 顶部信息栏 */
background: #FFFFFF;                                      /* ✅ 与主页一致 */
border-radius: 16rpx;                                     /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);           /* ✅ 与主页一致 */

/* 题目卡片 */
background: #FFFFFF;                                      /* ✅ 与主页一致 */
border-radius: 16rpx;                                     /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);           /* ✅ 与主页一致 */

/* 单位源背景（蓝色渐变） */
background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);  /* ✅ 与主页一致 */
border-radius: 12rpx;                                     /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);       /* ✅ 与主页一致 */

/* 提交按钮 */
background: #4A90E2;                                      /* ✅ 与主页一致 */
border-radius: 44rpx;                                     /* ✅ 与主页一致 */
height: 88rpx;                                            /* ✅ 与主页一致 */
box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);       /* ✅ 与主页一致 */

/* 进度条 */
background: #E8E8E8;                                      /* ✅ 与主页一致 */
fill: 动态颜色（根据单位类型）                          /* 保持个性化 */
```

---

## 📊 修改前后对比

### 分解练习页

| 元素 | 修改前 | 修改后 | 状态 |
|------|--------|--------|------|
| **页面背景** | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` 紫色渐变 | `linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx)` 蓝灰渐变 | ✅ 统一 |
| **卡片背景** | `rgba(255, 255, 255, 0.95)` 半透明白色 | `#FFFFFF` 纯白色 | ✅ 统一 |
| **卡片圆角** | `24rpx / 32rpx` | `16rpx` | ✅ 统一 |
| **卡片阴影** | `0 4rpx 20rpx / 0 8rpx 32rpx rgba(0,0,0,0.08/0.1)` | `0 4rpx 12rpx rgba(0,0,0,0.06)` | ✅ 统一 |
| **按钮背景** | `linear-gradient(135deg, #27AE60 0%, #229954 100%)` 绿色渐变 | `#4A90E2` 智慧蓝 | ✅ 统一 |
| **按钮高度** | `100rpx` | `88rpx` | ✅ 统一 |
| **按钮圆角** | `50rpx` | `44rpx` | ✅ 统一 |
| **进度条背景** | `rgba(255, 255, 255, 0.3)` 半透明白色 | `#E8E8E8` 中性灰 | ✅ 统一 |
| **进度条填充** | `linear-gradient(90deg, #27AE60 0%, #2ECC71 100%)` 绿色渐变 | `#4A90E2` 智慧蓝 | ✅ 统一 |

### 单位换算页

| 元素 | 修改前 | 修改后 | 状态 |
|------|--------|--------|------|
| **页面背景** | `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` 粉红渐变 | `linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx)` 蓝灰渐变 | ✅ 统一 |
| **卡片背景** | `rgba(255, 255, 255, 0.95)` 半透明白色 | `#FFFFFF` 纯白色 | ✅ 统一 |
| **卡片圆角** | `24rpx / 32rpx` | `16rpx` | ✅ 统一 |
| **卡片阴影** | `0 4rpx 20rpx / 0 8rpx 32rpx rgba(0,0,0,0.08/0.1)` | `0 4rpx 12rpx rgba(0,0,0,0.06)` | ✅ 统一 |
| **按钮背景** | `linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)` 双色蓝渐变 | `#4A90E2` 纯色蓝 | ✅ 统一 |
| **按钮高度** | `100rpx` | `88rpx` | ✅ 统一 |
| **按钮圆角** | `50rpx` | `44rpx` | ✅ 统一 |
| **单位源背景** | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` 紫色渐变 | `linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%)` 智慧蓝渐变 | ✅ 统一 |
| **进度条背景** | `rgba(255, 255, 255, 0.3)` 半透明白色 | `#E8E8E8` 中性灰 | ✅ 统一 |

---

## 🔍 详细修改清单

### 分解练习页（decompose/index.wxss）

#### 1. 页面背景
```css
/* 修改前 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 修改后 */
background: linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx);
```
**理由**：与主页保持一致的柔和蓝色渐变，方向改为垂直渐变（180deg）

#### 2. 卡片样式
```css
/* 修改前 */
background: rgba(255, 255, 255, 0.95);
border-radius: 24rpx / 32rpx;
box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08) / 0 8rpx 32rpx rgba(0, 0, 0, 0.1);

/* 修改后 */
background: #FFFFFF;
border-radius: 16rpx;
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
```
**理由**：统一卡片规范，使用纯白背景和一致的圆角阴影

#### 3. 提交按钮
```css
/* 修改前 */
height: 100rpx;
background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
border-radius: 50rpx;
box-shadow: 0 8rpx 24rpx rgba(39, 174, 96, 0.3);

/* 修改后 */
height: 88rpx;
background: #4A90E2;
border-radius: 44rpx;
box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
```
**理由**：按钮尺寸、颜色、阴影与主页大按钮完全一致

#### 4. 进度条
```css
/* 修改前 */
height: 12rpx;
background: rgba(255, 255, 255, 0.3);  /* 背景 */
fill: linear-gradient(90deg, #27AE60 0%, #2ECC71 100%);  /* 填充 */

/* 修改后 */
height: 8rpx;
background: #E8E8E8;
fill: #4A90E2;
```
**理由**：与全局进度条样式统一，使用标准灰色背景和蓝色填充

---

### 单位换算页（unit/index.wxss）

#### 1. 页面背景
```css
/* 修改前 */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* 修改后 */
background: linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx);
```
**理由**：取消粉红色主题，改为与主页一致的蓝灰渐变

#### 2. 卡片样式
```css
/* 修改前 */
background: rgba(255, 255, 255, 0.95);
border-radius: 24rpx / 32rpx;
box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08) / 0 8rpx 32rpx rgba(0, 0, 0, 0.1);

/* 修改后 */
background: #FFFFFF;
border-radius: 16rpx;
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
```

#### 3. 单位源样式
```css
/* 修改前 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-radius: 20rpx;
box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);

/* 修改后 */
background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
border-radius: 12rpx;
box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
```
**理由**：单位源标识改为智慧蓝渐变，与主题色呼应

#### 4. 提交按钮
```css
/* 修改前 */
height: 100rpx;
background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
border-radius: 50rpx;
box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.3);

/* 修改后 */
height: 88rpx;
background: #4A90E2;
border-radius: 44rpx;
box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
```

#### 5. 进度条
```css
/* 修改前 */
height: 12rpx;
background: rgba(255, 255, 255, 0.3);

/* 修改后 */
height: 8rpx;
background: #E8E8E8;
```

---

## 🎯 设计原则

### 1. 色彩一致性
- **主色调**：智慧蓝 `#4A90E2` 贯穿始终
- **辅助色**：活力橙 `#FF6B35` 用于强调
- **功能色**：成功绿 `#27AE60` 用于正反馈

### 2. 层级清晰
- **背景层**：浅蓝渐变 `#E8F4FD → #F8F9FA`
- **内容层**：纯白卡片 `#FFFFFF`
- **交互层**：彩色按钮和强调元素

### 3. 圆角规范
- **卡片圆角**：`16rpx`
- **按钮圆角**：`44rpx`（大按钮）、`12rpx`（小按钮）
- **输入框圆角**：`16rpx`

### 4. 阴影规范
- **卡片阴影**：`0 4rpx 12rpx rgba(0, 0, 0, 0.06)`
- **按钮阴影**：`0 4rpx 12rpx rgba(主色, 0.3)`

### 5. 间距规范
- **卡片间距**：`24rpx`
- **内边距**：`32rpx`（卡片）、`24rpx`（小组件）
- **元素间距**：`16rpx`（紧密）、`24rpx`（标准）

---

## 📱 跨设备一致性保证

### 1. 颜色代码统一
所有颜色值均使用标准十六进制格式（`#4A90E2`），避免设备间色彩差异。

### 2. 相对单位使用
所有尺寸使用 `rpx`（响应式像素），自动适配不同屏幕。

### 3. 渐变方向统一
- **页面背景**：垂直渐变 `180deg`
- **按钮/卡片**：斜向渐变 `135deg`

### 4. 阴影透明度统一
所有阴影使用 `rgba()` 格式，确保叠加效果一致。

---

## ✅ 验收标准

### 视觉一致性检查
- [ ] 背景色与主页完全一致
- [ ] 卡片样式（背景、圆角、阴影）统一
- [ ] 按钮样式（颜色、尺寸、圆角）统一
- [ ] 文字颜色（标题、正文、提示）统一
- [ ] 进度条样式统一

### 交互一致性检查
- [ ] 按钮点击效果一致（缩放 0.98，透明度 0.8）
- [ ] 动画时长一致（0.3s transition）
- [ ] 反馈提示样式一致

### 跨设备检查
- [ ] iPhone（不同型号）显示一致
- [ ] 安卓（不同品牌）显示一致
- [ ] 微信开发者工具预览正常
- [ ] 真机测试色彩准确

---

## 🎨 配色方案速查表

| 用途 | 颜色代码 | 示例 |
|------|----------|------|
| 主色调 | `#4A90E2` | ███ 按钮、强调、进度 |
| 主色浅 | `#5BA3F5` | ███ 渐变辅助 |
| 辅助色 | `#FF6B35` | ███ 数量、时间 |
| 辅助浅 | `#FF8C5A` | ███ 渐变辅助 |
| 成功色 | `#27AE60` | ███ 正确反馈 |
| 深灰色 | `#2C3E50` | ███ 主文字 |
| 中灰色 | `#95A5A6` | ███ 次要文字 |
| 浅灰色 | `#F8F9FA` | ███ 背景 |
| 边框灰 | `#E8E8E8` | ███ 分割线 |
| 纯白色 | `#FFFFFF` | ███ 卡片背景 |

---

## 📝 维护说明

### 新增页面配色规范
1. 背景：使用 `linear-gradient(180deg, #E8F4FD 0%, #F8F9FA 400rpx)`
2. 卡片：白色背景 + 16rpx圆角 + 标准阴影
3. 按钮：智慧蓝 `#4A90E2` + 44rpx圆角 + 88rpx高度
4. 文字：主文字 `#2C3E50`，次要文字 `#95A5A6`

### 配色修改流程
1. 在 `app.wxss` 中定义全局颜色变量
2. 各页面引用全局变量，避免硬编码
3. 修改时统一更新 `app.wxss`
4. 测试所有页面确保一致

---

**配色统一完成日期**：2025-11-30  
**影响页面**：分解练习页、单位换算页  
**下一步建议**：将颜色定义为CSS变量，便于全局管理

🎉 所有页面配色方案已统一完成！
