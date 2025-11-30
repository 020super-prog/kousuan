/**
 * 临时图标生成器
 * 用于生成底部导航的占位图标
 * 在实际开发中，应该使用设计师提供的图标
 */

// 由于小程序不支持直接创建图片文件，这里提供图标的base64数据
// 或者使用在线图标资源

const tabIcons = {
  // 首页图标 - 未激活
  home: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOCAxOEwyNCA2TDQwIDE4VjQwSDMyVjI4SDI0VjQwSDhWMThaIiBzdHJva2U9IiM5NUE1QTYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
  
  // 首页图标 - 激活
  homeActive: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOCAxOEwyNCA2TDQwIDE4VjQwSDMyVjI4SDI0VjQwSDhWMThaIiBmaWxsPSIjNEE5MEUyIiBzdHJva2U9IiM0QTkwRTIiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
};

module.exports = tabIcons;
