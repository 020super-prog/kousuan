/**
 * 云函数入口文件
 * 年级题型智能匹配引擎
 */

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const { 
  getAllGrades, 
  getCategoriesByGrade, 
  getCategoryRules,
  getGradeConfig,
  getSmartAllocation
} = require('./gradeConfig');

const { generateQuestions } = require('./questionEngine');

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    switch(action) {
      // 获取所有年级列表
      case 'getAllGrades':
        return {
          success: true,
          data: getAllGrades()
        };
      
      // 获取指定年级的题型列表
      case 'getCategoriesByGrade':
        const { gradeKey } = data;
        if (!gradeKey) {
          return { success: false, error: '缺少参数: gradeKey' };
        }
        return {
          success: true,
          data: getCategoriesByGrade(gradeKey)
        };
      
      // 获取指定年级和题型的详细规则
      case 'getCategoryRules':
        const { gradeKey: gk, categoryId } = data;
        if (!gk || !categoryId) {
          return { success: false, error: '缺少参数: gradeKey 或 categoryId' };
        }
        return {
          success: true,
          data: getCategoryRules(gk, categoryId)
        };
      
      // 获取年级完整配置
      case 'getGradeConfig':
        const { gradeKey: key } = data;
        if (!key) {
          return { success: false, error: '缺少参数: gradeKey' };
        }
        return {
          success: true,
          data: getGradeConfig(key)
        };
      
      // 生成题目
      case 'generateQuestions':
        const { gradeKey: grade, categoryId: cat, count = 10 } = data;
        if (!grade || !cat) {
          return { success: false, error: '缺少参数: gradeKey 或 categoryId' };
        }
        
        const questions = generateQuestions(grade, cat, count);
        return {
          success: true,
          data: {
            gradeKey: grade,
            categoryId: cat,
            count: questions.length,
            questions: questions
          }
        };
      
      // 获取推荐练习配置
      case 'getRecommendedPractice':
        const { gradeKey: gKey } = data;
        if (!gKey) {
          return { success: false, error: '缺少参数: gradeKey' };
        }
        
        const config = getGradeConfig(gKey);
        if (!config) {
          return { success: false, error: '未找到年级配置' };
        }
        
        return {
          success: true,
          data: {
            gradeKey: gKey,
            gradeName: config.name,
            level: config.level,
            categories: config.categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              description: cat.description,
              difficulty: cat.difficulty
            })),
            practiceRange: config.practiceRange
          }
        };
      
      // 智能分配生成题目
      case 'smartGenerate':
        const { gradeKey: smartGrade, count: smartCount = 50 } = data;
        if (!smartGrade) {
          return { success: false, error: '缺少参数: gradeKey' };
        }
        
        // 获取智能分配方案
        const allocation = getSmartAllocation(smartGrade, smartCount);
        if (!allocation || allocation.length === 0) {
          return { success: false, error: '无法生成智能分配方案' };
        }
        
        console.log('智能分配方案:', allocation);
        
        // 为每个题型生成相应数量的题目
        const allQuestions = [];
        for (const item of allocation) {
          try {
            const questions = generateQuestions(smartGrade, item.categoryId, item.count);
            allQuestions.push(...questions);
          } catch (error) {
            console.error(`生成题型 ${item.categoryId} 失败:`, error);
          }
        }
        
        // 打乱题目顺序
        for (let i = allQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }
        
        return {
          success: true,
          data: {
            gradeKey: smartGrade,
            totalCount: allQuestions.length,
            allocation: allocation,
            questions: allQuestions
          }
        };
      
      default:
        return {
          success: false,
          error: `未知的操作: ${action}`
        };
    }
  } catch (error) {
    console.error('云函数执行错误:', error);
    return {
      success: false,
      error: error.message || '云函数执行失败'
    };
  }
};
