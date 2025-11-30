/**
 * 云开发配置检查工具
 * 使用方法：在微信开发者工具控制台中运行此脚本
 */

function checkCloudConfig() {
  console.log('=== 云开发配置检查工具 ===\n');
  
  // 1. 检查云开发初始化
  console.log('1. 检查云开发初始化状态...');
  if (typeof wx !== 'undefined' && wx.cloud) {
    console.log('✅ wx.cloud 对象存在');
    
    // 尝试获取云环境
    try {
      const app = getApp();
      if (app && app.globalData && app.globalData.env !== undefined) {
        if (app.globalData.env === '') {
          console.warn('⚠️ 云环境ID为空，请在 app.js 中配置');
          console.log('   修复方法：在 app.js 中设置 env 参数');
          console.log('   env: "cloud1-xxxxx" // 替换为你的云环境ID');
        } else {
          console.log('✅ 云环境ID已配置:', app.globalData.env);
        }
      }
    } catch (e) {
      console.error('❌ 无法获取应用实例:', e);
    }
  } else {
    console.error('❌ wx.cloud 对象不存在，请检查基础库版本');
    console.log('   最低要求：2.2.3');
  }
  
  console.log('\n2. 检查云函数调用能力...');
  if (wx.cloud && typeof wx.cloud.callFunction === 'function') {
    console.log('✅ 云函数调用接口可用');
  } else {
    console.error('❌ 云函数调用接口不可用');
  }
  
  console.log('\n3. 测试云函数连接...');
  wx.cloud.callFunction({
    name: 'gradeEngine',
    data: {
      action: 'getAllGrades',
      data: {}
    }
  }).then(res => {
    console.log('✅ 云函数调用成功！');
    console.log('返回数据:', res.result);
    
    if (res.result && res.result.success && res.result.data) {
      console.log('\n年级数据列表:');
      res.result.data.forEach((grade, index) => {
        console.log(`  ${index + 1}. ${grade.name} (${grade.key})`);
      });
    }
  }).catch(err => {
    console.error('❌ 云函数调用失败！');
    console.error('错误信息:', err);
    
    if (err.errMsg) {
      if (err.errMsg.includes('cloud init error')) {
        console.log('\n💡 解决方案：');
        console.log('1. 打开云开发控制台获取环境ID');
        console.log('2. 在 app.js 中配置 env 参数');
        console.log('3. 重新编译小程序');
      } else if (err.errMsg.includes('FunctionName')) {
        console.log('\n💡 解决方案：');
        console.log('1. 检查云函数名称是否正确：gradeEngine');
        console.log('2. 确认云函数已上传到云端');
        console.log('3. 右键 cloudfunctions/gradeEngine → 上传并部署');
      }
    }
  });
  
  console.log('\n4. 检查TDesign组件注册...');
  const pages = getCurrentPages();
  if (pages && pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    console.log('当前页面:', currentPage.route);
  }
  
  console.log('\n=== 检查完成 ===');
  console.log('如果所有项目都显示 ✅，说明配置正确');
  console.log('如果有 ❌ 或 ⚠️，请按照提示进行修复\n');
}

// 导出检查函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkCloudConfig };
}

// 如果在控制台直接运行，自动执行检查
if (typeof window !== 'undefined') {
  checkCloudConfig();
}

console.log('💡 提示：将此文件内容复制到微信开发者工具控制台运行');
console.log('或在页面 JS 中调用：checkCloudConfig()');
