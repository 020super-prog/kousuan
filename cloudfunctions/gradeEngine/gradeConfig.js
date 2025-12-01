/**
 * 年级题型配置数据库
 * 基于小学1-6年级口算引擎题型拆解大纲
 */

const GRADE_CONFIG = {
  // 一年级 (100以内加减法基础)
  'grade_1': {
    name: '一年级',
    level: 1,
    categories: [
      {
        id: '1_1',
        name: '10以内加法',
        description: '如: 3 + 5',
        rules: { minValue: 0, maxValue: 10, operators: ['+'], allowCarry: false },
        difficulty: 'easy', weight: 2
      },
      {
        id: '1_2',
        name: '10以内减法',
        description: '如: 9 - 6',
        rules: { minValue: 0, maxValue: 10, operators: ['-'], allowBorrow: false },
        difficulty: 'easy', weight: 2
      },
      {
        id: '1_3',
        name: '凑十法加法',
        description: '如: 7 + □ = 10',
        rules: { target: 10, operators: ['+'], fillBlank: true },
        difficulty: 'easy', weight: 1
      },
      {
        id: '1_4',
        name: '20以内不进位加法',
        description: '如: 12 + 5',
        rules: { minValue: 10, maxValue: 20, operators: ['+'], allowCarry: false },
        difficulty: 'easy', weight: 2
      },
      {
        id: '1_5',
        name: '20以内不退位减法',
        description: '如: 18 - 6',
        rules: { minValue: 10, maxValue: 20, operators: ['-'], allowBorrow: false },
        difficulty: 'easy', weight: 2
      },
      {
        id: '1_6',
        name: '20以内进位加法',
        description: '如: 8 + 7',
        rules: { minValue: 0, maxValue: 20, operators: ['+'], allowCarry: true, requireCarry: true },
        difficulty: 'medium', weight: 3
      },
      {
        id: '1_7',
        name: '20以内退位减法',
        description: '如: 15 - 9',
        rules: { minValue: 10, maxValue: 20, operators: ['-'], allowBorrow: true, requireBorrow: true },
        difficulty: 'medium', weight: 3
      },
      {
        id: '1_8',
        name: '整十数加整十数',
        description: '如: 30 + 40',
        rules: { minValue: 10, maxValue: 90, operators: ['+'], tensOnly: true },
        difficulty: 'easy', weight: 1
      },
      {
        id: '1_9',
        name: '整十数减整十数',
        description: '如: 70 - 20',
        rules: { minValue: 10, maxValue: 90, operators: ['-'], tensOnly: true },
        difficulty: 'easy', weight: 1
      },
      {
        id: '1_10',
        name: '100以内一步混合',
        description: '连加/连减/加减混合, 2步',
        rules: { minValue: 0, maxValue: 20, operators: ['+', '-'], steps: 2 },
        difficulty: 'medium', weight: 2
      }
    ],
    practiceRange: { questionCount: [10, 20, 30], timeLimit: 300, targetAccuracy: 80 }
  },

  // 二年级 (100以内加减法提高与表内乘除法)
  'grade_2': {
    name: '二年级',
    level: 2,
    categories: [
      {
        id: '2_1',
        name: '100以内不进位加法',
        description: '两位数加两位数, 如: 34 + 52',
        rules: { minValue: 10, maxValue: 99, operators: ['+'], allowCarry: false },
        difficulty: 'easy', weight: 2
      },
      {
        id: '2_2',
        name: '100以内进位加法',
        description: '两位数加两位数, 如: 48 + 35',
        rules: { minValue: 10, maxValue: 99, operators: ['+'], allowCarry: true, requireCarry: true },
        difficulty: 'medium', weight: 3
      },
      {
        id: '2_3',
        name: '100以内不退位减法',
        description: '两位数减两位数, 如: 76 - 34',
        rules: { minValue: 10, maxValue: 99, operators: ['-'], allowBorrow: false },
        difficulty: 'easy', weight: 2
      },
      {
        id: '2_4',
        name: '100以内退位减法',
        description: '两位数减两位数, 如: 53 - 17',
        rules: { minValue: 10, maxValue: 99, operators: ['-'], allowBorrow: true, requireBorrow: true },
        difficulty: 'medium', weight: 3
      },
      {
        id: '2_5',
        name: '表内乘法',
        description: '如: 6 × 9',
        rules: { minValue: 1, maxValue: 9, operators: ['×'] },
        difficulty: 'medium', weight: 3
      },
      {
        id: '2_6',
        name: '表内除法',
        description: '如: 54 ÷ 6',
        rules: { minValue: 1, maxValue: 9, operators: ['÷'], exactDivision: true },
        difficulty: 'medium', weight: 3
      },
      {
        id: '2_7',
        name: '简单乘加/乘减',
        description: '如: 3 × 5 + 4',
        rules: { minValue: 1, maxValue: 9, operators: ['×', '+', '-'], steps: 2, pattern: 'multiply_first' },
        difficulty: 'medium', weight: 2
      },
      {
        id: '2_8',
        name: '简单除加/除减',
        description: '如: 20 ÷ 4 - 2',
        rules: { minValue: 1, maxValue: 9, operators: ['÷', '+', '-'], steps: 2, pattern: 'divide_first' },
        difficulty: 'medium', weight: 2
      },
      {
        id: '2_9',
        name: '两位数加减整十数/一位数',
        description: '如: 56 + 4 或 85 - 30',
        rules: { minValue: 10, maxValue: 99, operators: ['+', '-'], specialPattern: true },
        difficulty: 'easy', weight: 1
      }
    ],
    practiceRange: { questionCount: [20, 30, 40], timeLimit: 400, targetAccuracy: 82 }
  },

  // 三年级 (三位数加减法与两位数乘除法引入)
  'grade_3': {
    name: '三年级',
    level: 3,
    categories: [
      {
        id: '3_1',
        name: '三位数加减整百数',
        description: '如: 400 + 300, 750 - 50',
        rules: { minValue: 100, maxValue: 999, operators: ['+', '-'], hundredsOnly: true },
        difficulty: 'easy', weight: 1
      },
      {
        id: '3_2',
        name: '几百几十加减几百几十',
        description: '如: 230 + 150, 680 - 450',
        rules: { minValue: 100, maxValue: 999, operators: ['+', '-'], noOnes: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '3_3',
        name: '两位数乘一位数',
        description: '不进位和简单进位, 如: 34 × 2, 17 × 5',
        rules: { multiplicandMax: 99, multiplierMax: 9, operators: ['×'] },
        difficulty: 'medium', weight: 3
      },
      {
        id: '3_4',
        name: '整百整十数除以一位数',
        description: '如: 420 ÷ 7, 800 ÷ 4',
        rules: { dividendMin: 100, dividendMax: 900, divisorMax: 9, operators: ['÷'], exactDivision: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '3_5',
        name: '两位数除以一位数',
        description: '简单不带余数或带简单余数, 如: 96 ÷ 3, 55 ÷ 5',
        rules: { dividendMax: 99, divisorMax: 9, operators: ['÷'], allowRemainder: true },
        difficulty: 'medium', weight: 3
      },
      {
        id: '3_6',
        name: '带括号简单混合',
        description: '如: (50 - 20) ÷ 5',
        rules: { minValue: 1, maxValue: 50, operators: ['+', '-', '×', '÷'], steps: 2, allowParentheses: true },
        difficulty: 'hard', weight: 2
      },
      {
        id: '3_7',
        name: '乘除混合',
        description: '如: 3 × 6 ÷ 2',
        rules: { minValue: 1, maxValue: 9, operators: ['×', '÷'], steps: 2 },
        difficulty: 'hard', weight: 2
      },
      {
        id: '3_8',
        name: '单位换算口算',
        description: '简单时间/长度/质量单位换算',
        rules: { type: 'unit_conversion', units: ['时间', '长度', '质量'] },
        difficulty: 'easy', weight: 1
      }
    ],
    practiceRange: { questionCount: [30, 40, 50], timeLimit: 500, targetAccuracy: 85 }
  },

  // 四年级 (整数四则混合运算与小数基础)
  'grade_4': {
    name: '四年级',
    level: 4,
    categories: [
      {
        id: '4_1',
        name: '大数四则运算',
        description: '整百/整千, 如: 600 × 50, 4900 ÷ 70',
        rules: { minValue: 100, maxValue: 9999, operators: ['+', '-', '×', '÷'], largeNumbers: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '4_2',
        name: '加法/乘法交换律和结合律速算',
        description: '如: 28 + 55 + 72, 25 × 16',
        rules: { useProperties: ['commutative', 'associative'], operators: ['+', '×'] },
        difficulty: 'hard', weight: 2
      },
      {
        id: '4_3',
        name: '乘法分配律速算',
        description: '如: 102 × 5, 99 × 8 + 8',
        rules: { useProperties: ['distributive'], operators: ['×', '+'] },
        difficulty: 'hard', weight: 2
      },
      {
        id: '4_4',
        name: '小数一位加减法',
        description: '如: 3.5 + 1.2, 4.8 - 0.5',
        rules: { decimalPlaces: 1, maxValue: 10, operators: ['+', '-'] },
        difficulty: 'medium', weight: 2
      },
      {
        id: '4_5',
        name: '小数与整数加减',
        description: '如: 5 + 0.9, 1.7 - 1',
        rules: { decimalPlaces: 1, maxValue: 10, operators: ['+', '-'], mixedTypes: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '4_6',
        name: '整数四则运算(不含括号)',
        description: '如: 40 - 2 × 5 + 6',
        rules: { minValue: 1, maxValue: 50, operators: ['+', '-', '×', '÷'], steps: 3, allowParentheses: false },
        difficulty: 'hard', weight: 3
      },
      {
        id: '4_7',
        name: '整数四则运算(含括号)',
        description: '如: 100 ÷ (5 + 5) × 2',
        rules: { minValue: 1, maxValue: 50, operators: ['+', '-', '×', '÷'], steps: 3, allowParentheses: true },
        difficulty: 'hard', weight: 3
      }
    ],
    practiceRange: { questionCount: [40, 50, 60], timeLimit: 600, targetAccuracy: 87 }
  },

  // 五年级 (小数乘除法与分数基础)
  'grade_5': {
    name: '五年级',
    level: 5,
    categories: [
      {
        id: '5_1',
        name: '小数乘法',
        description: '简单小数乘一位数或整十数, 如: 0.8 × 6, 1.5 × 10',
        rules: { decimalPlaces: 1, multiplierMax: 10, operators: ['×'] },
        difficulty: 'medium', weight: 2
      },
      {
        id: '5_2',
        name: '小数除法',
        description: '简单被除数是小数的除法, 如: 4.2 ÷ 7, 18 ÷ 10',
        rules: { decimalPlaces: 1, divisorMax: 10, operators: ['÷'] },
        difficulty: 'medium', weight: 2
      },
      {
        id: '5_3',
        name: '小数混合运算',
        description: '小数加减乘除两步混合, 如: 2.5 + 0.5 × 2',
        rules: { decimalPlaces: 1, maxValue: 10, operators: ['+', '-', '×', '÷'], steps: 2 },
        difficulty: 'hard', weight: 3
      },
      {
        id: '5_4',
        name: '同分母分数加减法',
        description: '结果需化简, 如: 3/5 + 1/5, 7/8 - 3/8',
        rules: { sameDenominator: true, maxDenominator: 10, operators: ['+', '-'], needSimplify: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '5_5',
        name: '异分母分数加减法',
        description: '分母倍数关系, 简单通分, 如: 1/2 + 1/4, 5/6 - 1/3',
        rules: { sameDenominator: false, maxDenominator: 12, operators: ['+', '-'], multipleRelation: true },
        difficulty: 'hard', weight: 3
      },
      {
        id: '5_6',
        name: '分数与整数加减',
        description: '如: 1 + 2/3, 2 - 1/4',
        rules: { maxDenominator: 10, operators: ['+', '-'], mixedTypes: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '5_7',
        name: '解简单方程',
        description: '加减乘除, 如: x + 5 = 12, 3x = 18',
        rules: { maxValue: 20, operators: ['+', '-', '×', '÷'], equationType: 'simple' },
        difficulty: 'hard', weight: 2
      }
    ],
    practiceRange: { questionCount: [40, 50, 70], timeLimit: 700, targetAccuracy: 88 }
  },

  // 六年级 (分数四则混合运算与百分数)
  'grade_6': {
    name: '六年级',
    level: 6,
    categories: [
      {
        id: '6_1',
        name: '分数乘法',
        description: '考察约分, 如: 1/3 × 6/7, 4 × 3/8',
        rules: { maxNumerator: 10, maxDenominator: 12, operators: ['×'], needSimplify: true },
        difficulty: 'hard', weight: 3
      },
      {
        id: '6_2',
        name: '分数除法',
        description: '考察倒数与乘法转换, 如: 2/5 ÷ 4, 1 ÷ 3/4',
        rules: { maxNumerator: 10, maxDenominator: 12, operators: ['÷'], reciprocal: true },
        difficulty: 'hard', weight: 3
      },
      {
        id: '6_3',
        name: '分数四则混合运算',
        description: '至少两步的混合运算, 如: 1/2 × 4 + 1/4',
        rules: { maxNumerator: 10, maxDenominator: 12, operators: ['+', '-', '×', '÷'], steps: 2 },
        difficulty: 'hard', weight: 3
      },
      {
        id: '6_4',
        name: '分数、小数、百分数互化',
        description: '常见数的互化, 如: 0.25 = □% = □ (分数)',
        rules: { type: 'conversion', commonValues: true },
        difficulty: 'medium', weight: 2
      },
      {
        id: '6_5',
        name: '简单的百分数应用',
        description: '求百分之几是多少, 如: 20 的 10% 是多少',
        rules: { maxValue: 100, percentageMax: 100, operators: ['×'] },
        difficulty: 'medium', weight: 2
      },
      {
        id: '6_6',
        name: '求比值/化简比',
        description: '如: 1/2 : 1/4 的比值',
        rules: { type: 'ratio', maxValue: 12, needSimplify: true },
        difficulty: 'hard', weight: 2
      },
      {
        id: '6_7',
        name: '倒数口算',
        description: '求一个数的倒数, 如: 5 的倒数是 □',
        rules: { type: 'reciprocal', maxValue: 20 },
        difficulty: 'easy', weight: 1
      }
    ],
    practiceRange: { questionCount: [50, 70, 100], timeLimit: 900, targetAccuracy: 90 }
  }
};

/**
 * 获取年级配置
 */
function getGradeConfig(gradeKey) {
  return GRADE_CONFIG[gradeKey] || null;
}

/**
 * 获取所有年级列表
 */
function getAllGrades() {
  return Object.keys(GRADE_CONFIG).map(key => ({
    key,
    name: GRADE_CONFIG[key].name,
    level: GRADE_CONFIG[key].level
  }));
}

/**
 * 根据年级获取题型列表
 */
function getCategoriesByGrade(gradeKey) {
  const config = getGradeConfig(gradeKey);
  if (!config) return [];
  
  return config.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    difficulty: cat.difficulty,
    weight: cat.weight || 1
  }));
}

/**
 * 根据年级和题型ID获取详细规则
 */
function getCategoryRules(gradeKey, categoryId) {
  const config = getGradeConfig(gradeKey);
  if (!config) return null;
  
  const category = config.categories.find(cat => cat.id === categoryId);
  return category || null;
}

/**
 * 智能分配题型权重 - 根据年级和权重随机选择题型
 * @param {string} gradeKey - 年级键值
 * @param {number} count - 需要生成的题目总数
 * @returns {Array} 题型分配列表 [{categoryId, count}]
 */
function getSmartAllocation(gradeKey, count) {
  const config = getGradeConfig(gradeKey);
  if (!config || !config.categories || config.categories.length === 0) {
    return [];
  }

  // 计算总权重
  const totalWeight = config.categories.reduce((sum, cat) => sum + (cat.weight || 1), 0);
  
  // 根据权重分配题目数量
  const allocation = [];
  let remaining = count;
  
  config.categories.forEach((cat, index) => {
    const weight = cat.weight || 1;
    let catCount;
    
    if (index === config.categories.length - 1) {
      // 最后一个题型，分配剩余所有题目
      catCount = remaining;
    } else {
      // 按权重比例分配
      catCount = Math.round((weight / totalWeight) * count);
      catCount = Math.max(1, catCount); // 至少1题
    }
    
    if (catCount > 0 && remaining > 0) {
      catCount = Math.min(catCount, remaining);
      allocation.push({
        categoryId: cat.id,
        categoryName: cat.name,
        count: catCount,
        weight: weight
      });
      remaining -= catCount;
    }
  });
  
  // 如果还有剩余题目，随机分配给某个题型
  while (remaining > 0) {
    const randomIndex = Math.floor(Math.random() * allocation.length);
    allocation[randomIndex].count++;
    remaining--;
  }
  
  return allocation;
}

/**
 * 验证题目是否符合年级要求
 */
function validateQuestion(gradeKey, categoryId, question) {
  const rules = getCategoryRules(gradeKey, categoryId);
  if (!rules) return { valid: false, reason: '未找到对应规则' };
  
  // TODO: 实现详细的题目验证逻辑
  return { valid: true };
}

module.exports = {
  GRADE_CONFIG,
  getGradeConfig,
  getAllGrades,
  getCategoriesByGrade,
  getCategoryRules,
  getSmartAllocation,
  validateQuestion
};
