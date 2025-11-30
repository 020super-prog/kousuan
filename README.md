# 小学口算助手微信小程序

<div align="center">
  <p>专为小学生打造的数学口算练习工具</p>
  <p>智慧蓝 + 活力橙 | 专业可靠 | 清新活泼</p>
  <p><strong>🎯 支持1-6年级智能题型匹配 | 基于教学大纲设计</strong></p>
</div>

---

## ✨ 核心特色

- ✅ **智能年级匹配**: 根据教学大纲自动匹配各年级适用题型
- ✅ **云函数题目生成**: 服务端智能生成，确保题目质量
- ✅ **多题型练习**: 加法、减法、乘法、除法、混合运算、小数、分数
- ✅ **即时反馈**: 答题后立即显示结果，正确/错误动画提示
- ✅ **错题管理**: 自动收集错题，智能分类，支持重练
- ✅ **学习统计**: 可视化展示练习数据和正确率
- ✅ **离线使用**: 题目生成完全本地化，无需网络
- 🚧 **拍照批改**: OCR识别手写作业（开发中）
- 🚧 **PDF生成**: 导出纸质练习卷（计划中）

---

## 🎓 年级题型体系

### 📚 基于教学大纲的题型配置

本项目根据教育部小学数学教学大纲，将1-6年级分为三个学段：

#### 第一学段（1-2年级）
- ✅ 20以内加减法（进位/退位）
- ✅ 简单单位换算（长度、货币、时间）
- 难度：⭐ 简单

#### 第二学段（3-4年级）
- ✅ 三位数加减法（连续进位/退位）
- ✅ 乘除法（表内及表外）
- ✅ 混合运算（2步）
- ✅ 小数运算（1位小数）
- ✅ 分数运算（同分母）
- 难度：⭐⭐ 中等

#### 第三学段（5-6年级）
- ✅ 复杂混合运算（3-4步）
- ✅ 简便运算（运算律应用）
- ✅ 小数运算（2位小数）
- ✅ 分数运算（异分母）
- ✅ 高级单位换算（面积、体积）
- 难度：⭐⭐⭐ 困难

---

## 🚀 快速开始

### 1. 环境准备
- Node.js v20.13.1
- npm 10.9.2
- 微信开发者工具（最新版）
- 微信云开发账号

### 2. 安装依赖
```bash
cd miniprogram
npm install
```

### 3. 构建npm包
在微信开发者工具中：
1. 打开项目
2. 点击菜单栏 **工具** → **构建 npm**
3. 等待构建完成

### 4. 部署云函数
```bash
# 方法1: 在微信开发者工具中
右键 cloudfunctions/gradeEngine → 上传并部署：云端安装依赖

# 方法2: 使用命令行
cd cloudfunctions/gradeEngine
npm install
tcb fn deploy gradeEngine
```

### 5. 配置云开发环境
在 `miniprogram/app.js` 中配置你的云开发环境ID：
```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的环境ID
  traceUser: true,
});
```

### 6. 运行项目
1. 配置AppID（project.config.json）
2. 点击编译运行
3. 开始体验

---

## 📱 页面导航

### 首页
- **年级选择器**：选择1-2年级、3-4年级、5-6年级
- **动态题型展示**：根据年级自动加载对应题型
- **快捷练习入口**：一键开始练习
- **今日学习统计**：实时查看练习数据

### 口算练习
- 云函数智能生成题目
- 数字键盘输入
- 实时计时
- 即时反馈动画
- 自动收集错题

### 错题本
- 按题型筛选
- 错题详情展示
- 标记已掌握
- 批量生成练习卷

### 个人中心
- 学习数据统计
- 功能设置
- 关于我们

---

## 🎨 设计规范

### 色彩体系
```
主色调: #4A90E2 (智慧蓝)
辅助色: #FF6B35 (活力橙)
成功色: #27AE60
错误色: #E74C3C
```

### UI组件
- TDesign小程序组件库 v1.5.0
- 全局配置常用组件

---

## 📂 项目结构

```
kousuan19/
├── miniprogram/              # 小程序前端
│   ├── pages/               # 页面
│   │   ├── home/           # 首页（年级选择+题型）
│   │   ├── practice/       # 练习页
│   │   ├── result/         # 结果页
│   │   ├── camera/         # 拍照批改
│   │   ├── mistakes/       # 错题本
│   │   └── profile/        # 个人中心
│   ├── utils/              # 工具类
│   │   ├── gradeApi.js    # 云函数API封装
│   │   └── questionGenerator.js
│   └── app.js/json/wxss    # 全局配置
│
├── cloudfunctions/          # 云函数
│   └── gradeEngine/        # 年级题型引擎
│       ├── index.js        # 云函数入口
│       ├── gradeConfig.js  # 年级配置数据库
│       ├── questionEngine.js # 题目生成引擎
│       └── README.md       # 云函数文档
│
└── docs/                    # 文档
    ├── CLOUD_FUNCTION_GUIDE.md
    ├── GRADE_ENGINE_QUICK_START.md
    └── PROJECT_GUIDE.md
```

---

## 🔧 核心技术

### 前端技术
- **框架**: 微信小程序原生开发
- **UI库**: TDesign小程序组件库
- **存储**: wx.setStorageSync本地存储
- **动画**: CSS3 + WXSS动画

### 后端技术
- **云函数**: 微信云开发
- **题目生成**: 纯JS算法引擎
- **数据库**: 云开发数据库（未来扩展）

### 年级题型引擎
- **配置驱动**: 基于gradeConfig.js配置
- **智能匹配**: 自动关联年级和题型
- **规则引擎**: 题目生成规则可扩展
- **性能优化**: 题目批量生成，避免重复

---

## 📝 核心功能说明

### 1. 年级选择功能
```javascript
// 首页年级选择
showGradeSelector() {
  // 显示年级选择器
}

onGradeConfirm(e) {
  // 保存选择，重新加载题型
  const gradeKey = this.data.grades[value[0]].key;
  await this.loadCategories(gradeKey);
}
```

### 2. 云函数题目生成
```javascript
// 调用云函数生成题目
import { generateQuestions } from '../../utils/gradeApi';

const res = await generateQuestions('grade_1_2', 'addition', 20);
console.log(res.data.questions); // 20道加法题
```

### 3. 题型动态加载
```javascript
// 根据年级动态加载题型
async loadCategories(gradeKey) {
  const res = await getCategoriesByGrade(gradeKey);
  this.setData({
    categories: res.data
  });
}
```

---

## 🚧 待开发功能

### 高优先级
- [ ] 拍照批改（OCR识别）
- [ ] PDF试卷生成
- [ ] 自定义练习设置

### 中优先级
- [ ] 数的分解与组合
- [ ] 单位换算练习
- [ ] 学习数据可视化图表

### 低优先级
- [ ] 云同步功能
- [ ] 排行榜和PK
- [ ] 成就系统

---

## 📊 当前进度

- ✅ 全局配置和样式 (100%)
- ✅ 底部导航结构 (100%)
- ✅ 首页练习中心 (100%)
- ✅ 口算练习功能 (100%)
- ✅ 错题本管理 (100%)
- ✅ 个人中心 (100%)
- ✅ **年级题型引擎** (100%) 🎉
- ✅ **云函数集成** (100%) 🎉
- 🚧 拍照批改 (0%)
- 🚧 PDF生成 (0%)

---

## 📚 开发文档

### 快速开始
- 📖 [云函数快速开始](./GRADE_ENGINE_QUICK_START.md) - 5分钟上手
- 🚀 [云函数部署指南](./CLOUD_FUNCTION_GUIDE.md) - 完整部署流程

### 详细文档
- 📋 [项目开发指南](./PROJECT_GUIDE.md) - 完整功能说明
- 🔧 [云函数技术文档](./cloudfunctions/gradeEngine/README.md) - API接口详解
- ⚡ [快速参考卡](./QUICK_REFERENCE.md) - 常用命令速查

### 配置文档
- 🎨 [TDesign配置说明](./TDESIGN_SETUP.md)
- ✅ [启动检查清单](./STARTUP_CHECKLIST.md)

---

## 🐛 已知问题

1. ~~tabBar图标需要专业设计图标替换~~
2. ~~部分功能显示"开发中"提示~~
3. 需要添加数据埋点
4. OCR功能待集成

---

## 🎉 新功能亮点

### ✨ 年级题型智能匹配引擎

**核心优势：**
1. **教学大纲对齐**：完全基于教育部小学数学教学大纲设计
2. **智能题型推荐**：根据年级自动推荐合适的题型
3. **云端生成**：服务端生成题目，确保质量和性能
4. **灵活扩展**：配置驱动，易于添加新题型

**技术架构：**
```
前端（小程序）
  ↓ 调用API
云函数（gradeEngine）
  ↓ 读取配置
年级配置数据库（gradeConfig.js）
  ↓ 应用规则
题目生成引擎（questionEngine.js）
  ↓ 返回结果
前端显示题目
```

---

## 📞 技术支持

- 微信小程序官方文档：https://developers.weixin.qq.com/miniprogram/dev/
- TDesign组件库文档：https://tdesign.tencent.com/miniprogram/
- 云开发文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/

---

## 📄 开源协议

MIT License

---

**版本**: v2.0.0  
**最后更新**: 2025-11-30  
**开发状态**: 核心功能 + 年级引擎已完成 ✅

**重大更新：**
- 🎉 新增年级题型智能匹配引擎
- 🚀 集成云函数题目生成
- 📊 支持1-6年级完整题型体系
- 🔧 优化题目生成性能

---

<div align="center">
  <p>让学习变得更轻松 | 让进步看得见</p>
  <p>🎓 基于教学大纲 | 🎯 智能匹配题型 | ☁️ 云端生成</p>
  <p>🎉 祝使用愉快！</p>
</div>


