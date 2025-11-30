/**
 * 年级题型配置数据库
 * 基于图片中的教学大纲要求
 */

const GRADE_CONFIG = {
  // 1-2年级（第一学段）
  'grade_1_2': {
    name: '一二年级',
    level: 1,
    categories: [
      {
        id: 'addition',
        name: '加法',
        description: '20以内进位/连进位加法；两位数加一位数/整十数',
        rules: {
          operands: 2,
          operators: ['+'],
          minValue: 0,
          maxValue: 20,
          allowCarry: true,
          allowMultiDigit: true,
          examples: ['8+7', '15+6', '34+5', '50+12']
        },
        difficulty: 'easy'
      },
      {
        id: 'subtraction',
        name: '减法',
        description: '20以内退位的借位；两位数的位值分解',
        rules: {
          operands: 2,
          operators: ['-'],
          minValue: 0,
          maxValue: 20,
          allowBorrow: true,
          resultPositive: true,
          examples: ['12-5', '10=7+( )', '( )+10=( )']
        },
        difficulty: 'easy'
      },
      {
        id: 'measurement_basic',
        name: '单位换算',
        description: '长度（米/厘米）；人民币（元/角/分）；时间（整时/半时，时/分）',
        rules: {
          units: {
            length: ['米', '厘米'],
            money: ['元', '角', '分'],
            time: ['时', '分']
          },
          examples: ['1米=100厘米', '1元=10角', '1时=60分']
        },
        difficulty: 'easy'
      }
    ],
    practiceRange: {
      questionCount: [10, 20, 30],
      timeLimit: 300, // 5分钟
      targetAccuracy: 80
    }
  },

  // 3-4年级（第二学段）
  'grade_3_4': {
    name: '三四年级',
    level: 2,
    categories: [
      {
        id: 'addition_advanced',
        name: '加法',
        description: '三位数以内的连续进位加法',
        rules: {
          operands: 2,
          operators: ['+'],
          minValue: 0,
          maxValue: 999,
          allowCarry: true,
          multipleCarry: true,
          examples: ['234+567', '456+789']
        },
        difficulty: 'medium'
      },
      {
        id: 'subtraction_advanced',
        name: '减法',
        description: '三位数四位数的连续借位分解',
        rules: {
          operands: 2,
          operators: ['-'],
          minValue: 0,
          maxValue: 9999,
          allowBorrow: true,
          multipleBorrow: true,
          examples: ['1234-567', '5000-2345']
        },
        difficulty: 'medium'
      },
      {
        id: 'multiplication',
        name: '乘除法',
        description: '表内乘除法；两位数乘一位数；整百数乘一位数',
        rules: {
          operands: 2,
          operators: ['×', '÷'],
          multiplicandMax: 99,
          multiplierMax: 9,
          allowZero: false,
          examples: ['6×9', '45÷5', '23×3', '400×2']
        },
        difficulty: 'medium'
      },
      {
        id: 'mixed_operations',
        name: '混合运算',
        description: '两步应用乘除加减的混合运算',
        rules: {
          operands: 3,
          operators: ['+', '-', '×', '÷'],
          steps: 2,
          allowParentheses: false,
          examples: ['3+8×5', '20-15÷3', '3×4-5', '2+0-1']
        },
        difficulty: 'medium'
      },
      {
        id: 'measurement_intermediate',
        name: '单位换算',
        description: '长度（毫米/分米/千米）；重量（吨/千克/克）；时间（秒/分/时/日）',
        rules: {
          units: {
            length: ['毫米', '厘米', '分米', '米', '千米'],
            weight: ['克', '千克', '吨'],
            time: ['秒', '分', '时', '日']
          },
          examples: ['1千米=1000米', '1千克=1000克', '1时=60分']
        },
        difficulty: 'medium'
      },
      {
        id: 'fractions_basic',
        name: '小数运算',
        description: '一位小数的加减乘除',
        rules: {
          operands: 2,
          operators: ['+', '-', '×', '÷'],
          decimalPlaces: 1,
          maxValue: 100,
          examples: ['12.4+8', '0.5+0.3', '4.9+3']
        },
        difficulty: 'medium'
      },
      {
        id: 'fractions_division',
        name: '分数运算',
        description: '同分母分数的加减法',
        rules: {
          operands: 2,
          operators: ['+', '-'],
          sameDenominator: true,
          maxNumerator: 20,
          maxDenominator: 20,
          examples: ['1/5+2/5', '3/4-1/4']
        },
        difficulty: 'medium'
      }
    ],
    practiceRange: {
      questionCount: [20, 30, 50],
      timeLimit: 600, // 10分钟
      targetAccuracy: 85
    }
  },

  // 5-6年级（第三学段）
  'grade_5_6': {
    name: '五六年级',
    level: 3,
    categories: [
      {
        id: 'mixed_advanced',
        name: '整数运算',
        description: '运用混合算律的简便运算；较大整十/整百数的乘除法',
        rules: {
          operands: [3, 4],
          operators: ['+', '-', '×', '÷'],
          allowParentheses: true,
          useProperties: ['distributive', 'associative', 'commutative'],
          examples: ['25×4+8.99+36', '60÷50']
        },
        difficulty: 'hard'
      },
      {
        id: 'decimals_advanced',
        name: '小数运算',
        description: '一位/两位小数的加减乘除',
        rules: {
          operands: 2,
          operators: ['+', '-', '×', '÷'],
          decimalPlaces: [1, 2],
          maxValue: 1000,
          examples: ['25.1+12.4', '8-0.5', '0.3×4', '0.9÷3']
        },
        difficulty: 'hard'
      },
      {
        id: 'fractions_advanced',
        name: '分数运算',
        description: '同分母分数的加减法',
        rules: {
          operands: 2,
          operators: ['+', '-'],
          sameDenominator: false,
          needSimplify: true,
          maxNumerator: 100,
          maxDenominator: 100,
          examples: ['51+53', '87-83']
        },
        difficulty: 'hard'
      },
      {
        id: 'mixed_operations_advanced',
        name: '混合运算',
        description: '涉及/减法并用/除法/小数/分数的混合运算',
        rules: {
          operands: [3, 4, 5],
          operators: ['+', '-', '×', '÷'],
          allowDecimals: true,
          allowFractions: true,
          allowParentheses: true,
          steps: [2, 3],
          examples: ['(12+8)-4', '30÷(10-4)', '3.5米-(1厘米; 2千5百万厘米/1厘米)', '(12+8)-4.30÷(10-4)']
        },
        difficulty: 'hard'
      },
      {
        id: 'measurement_advanced',
        name: '单位换算',
        description: '面积/体积容积（公顷/平方千米）；容量（升/毫升）；体积（立方米/立方厘米）',
        rules: {
          units: {
            area: ['平方厘米', '平方分米', '平方米', '公顷', '平方千米'],
            volume: ['立方厘米', '立方分米', '立方米'],
            capacity: ['毫升', '升']
          },
          examples: ['1平方千米=1000000平方米', '1立方米=1000立方分米']
        },
        difficulty: 'hard'
      }
    ],
    practiceRange: {
      questionCount: [30, 50, 100],
      timeLimit: 900, // 15分钟
      targetAccuracy: 90
    }
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
    difficulty: cat.difficulty
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
  validateQuestion
};
