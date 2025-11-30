/**
 * 年级题型云函数API封装
 * 提供便捷的前端调用接口
 */

/**
 * 调用云函数
 */
async function callCloudFunction(action, data = {}) {
  try {
    console.log(`📡 调用云函数: ${action}`, data);
    const startTime = Date.now();
    
    const res = await wx.cloud.callFunction({
      name: 'gradeEngine',
      data: {
        action,
        data
      }
    });
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ 云函数响应时间: ${duration}ms`);
    
    if (res.result && res.result.success) {
      console.log(`✅ 云函数成功:`, res.result);
      return {
        success: true,
        data: res.result.data
      };
    } else {
      console.warn(`⚠️ 云函数失败:`, res.result);
      return {
        success: false,
        error: res.result?.error || '云函数调用失败'
      };
    }
  } catch (error) {
    console.error('❌ 云函数调用错误:', error);
    
    // 详细的错误信息
    let errorMsg = '网络错误';
    if (error.errCode === -1) {
      errorMsg = '网络超时，请检查网络连接';
    } else if (error.errCode === -404005) {
      errorMsg = '云函数不存在，请检查是否已部署';
    } else if (error.errCode === -404003) {
      errorMsg = '云函数权限不足';
    } else if (error.errMsg) {
      errorMsg = error.errMsg;
    }
    
    return {
      success: false,
      error: errorMsg,
      errCode: error.errCode
    };
  }
}

/**
 * 获取所有年级列表
 * @returns {Promise<Object>} { success, data: [{ key, name, level }] }
 */
export async function getAllGrades() {
  return await callCloudFunction('getAllGrades');
}

/**
 * 获取指定年级的题型列表
 * @param {string} gradeKey - 年级key (如: 'grade_1_2')
 * @returns {Promise<Object>} { success, data: [{ id, name, description, difficulty }] }
 */
export async function getCategoriesByGrade(gradeKey) {
  return await callCloudFunction('getCategoriesByGrade', { gradeKey });
}

/**
 * 获取指定年级和题型的详细规则
 * @param {string} gradeKey - 年级key
 * @param {string} categoryId - 题型ID
 * @returns {Promise<Object>} { success, data: { id, name, rules, ... } }
 */
export async function getCategoryRules(gradeKey, categoryId) {
  return await callCloudFunction('getCategoryRules', { gradeKey, categoryId });
}

/**
 * 获取年级完整配置
 * @param {string} gradeKey - 年级key
 * @returns {Promise<Object>} { success, data: { name, level, categories, practiceRange } }
 */
export async function getGradeConfig(gradeKey) {
  return await callCloudFunction('getGradeConfig', { gradeKey });
}

/**
 * 生成题目
 * @param {string} gradeKey - 年级key
 * @param {string} categoryId - 题型ID
 * @param {number} count - 题目数量
 * @returns {Promise<Object>} { success, data: { questions: [...] } }
 */
export async function generateQuestions(gradeKey, categoryId, count = 10) {
  return await callCloudFunction('generateQuestions', { gradeKey, categoryId, count });
}

/**
 * 获取推荐练习配置
 * @param {string} gradeKey - 年级key
 * @returns {Promise<Object>} { success, data: { categories, practiceRange, ... } }
 */
export async function getRecommendedPractice(gradeKey) {
  return await callCloudFunction('getRecommendedPractice', { gradeKey });
}

/**
 * 年级映射表（用于前端显示）
 */
export const GRADE_MAP = {
  'grade_1_2': {
    key: 'grade_1_2',
    name: '一二年级',
    shortName: '1-2年级',
    level: 1,
    description: '基础加减法、简单单位换算'
  },
  'grade_3_4': {
    key: 'grade_3_4',
    name: '三四年级',
    shortName: '3-4年级',
    level: 2,
    description: '乘除法、混合运算、小数分数基础'
  },
  'grade_5_6': {
    key: 'grade_5_6',
    name: '五六年级',
    shortName: '5-6年级',
    level: 3,
    description: '复杂混合运算、高级单位换算'
  }
};

/**
 * 难度映射
 */
export const DIFFICULTY_MAP = {
  'easy': { name: '简单', color: '#27AE60', icon: '⭐' },
  'medium': { name: '中等', color: '#FF6B35', icon: '⭐⭐' },
  'hard': { name: '困难', color: '#E74C3C', icon: '⭐⭐⭐' }
};

/**
 * 获取年级显示名称
 */
export function getGradeName(gradeKey) {
  return GRADE_MAP[gradeKey]?.name || '未知年级';
}

/**
 * 获取难度显示信息
 */
export function getDifficultyInfo(difficulty) {
  return DIFFICULTY_MAP[difficulty] || { name: '未知', color: '#95A5A6', icon: '?' };
}
