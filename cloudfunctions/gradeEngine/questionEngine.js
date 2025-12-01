/**
 * 题目生成引擎 - 增强版
 * 支持小学1-6年级所有细分题型的智能生成
 */

const { getCategoryRules } = require('./gradeConfig');

// ============== 工具函数 ==============

/**
 * 生成随机整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 最大公约数
 */
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * 最小公倍数
 */
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

/**
 * 化简分数
 */
function simplifyFraction(numerator, denominator) {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

/**
 * 检查是否进位
 */
function hasCarry(num1, num2) {
  return (num1 % 10) + (num2 % 10) >= 10;
}

/**
 * 检查是否退位
 */
function hasBorrow(num1, num2) {
  return (num1 % 10) < (num2 % 10);
}

// ============== 一年级题型生成器 ==============

/**
 * 1.1 - 10以内加法
 */
function generate_1_1(rules) {
  const num1 = randomInt(rules.minValue, rules.maxValue);
  const num2 = randomInt(rules.minValue, rules.maxValue - num1);
  return createQuestion(num1, '+', num2, num1 + num2, 'addition');
}

/**
 * 1.2 - 10以内减法
 */
function generate_1_2(rules) {
  const num1 = randomInt(rules.minValue + 1, rules.maxValue);
  const num2 = randomInt(rules.minValue, num1);
  return createQuestion(num1, '-', num2, num1 - num2, 'subtraction');
}

/**
 * 1.3 - 凑十法加法 (7 + □ = 10)
 */
function generate_1_3(rules) {
  const num1 = randomInt(1, 9);
  const num2 = 10 - num1;
  const expression = `${num1} + □ = 10`;
  return {
    expression: expression,
    displayQuestion: expression,
    question: expression,
    answer: num2,
    type: 'fill_blank',
    operands: [num1, num2],
    operator: '+'
  };
}

/**
 * 1.4 - 20以内不进位加法
 */
function generate_1_4(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(1, rules.maxValue - num1);
  } while (hasCarry(num1, num2));
  
  return createQuestion(num1, '+', num2, num1 + num2, 'addition');
}

/**
 * 1.5 - 20以内不退位减法
 */
function generate_1_5(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(1, num1);
  } while (hasBorrow(num1, num2));
  
  return createQuestion(num1, '-', num2, num1 - num2, 'subtraction');
}

/**
 * 1.6 - 20以内进位加法
 */
function generate_1_6(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue + 5, 9);
    num2 = randomInt(rules.minValue + 5, 9);
  } while (num1 + num2 > rules.maxValue || !hasCarry(num1, num2));
  
  return createQuestion(num1, '+', num2, num1 + num2, 'addition');
}

/**
 * 1.7 - 20以内退位减法
 */
function generate_1_7(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(5, 9);
  } while (num1 <= num2 || !hasBorrow(num1, num2));
  
  return createQuestion(num1, '-', num2, num1 - num2, 'subtraction');
}

/**
 * 1.8 - 整十数加整十数
 */
function generate_1_8(rules) {
  const num1 = randomInt(1, 9) * 10;
  const num2 = randomInt(1, 9) * 10;
  if (num1 + num2 > 100) return generate_1_8(rules);
  return createQuestion(num1, '+', num2, num1 + num2, 'addition');
}

/**
 * 1.9 - 整十数减整十数
 */
function generate_1_9(rules) {
  const num1 = randomInt(2, 9) * 10;
  const num2 = randomInt(1, Math.floor(num1/10) - 1) * 10;
  return createQuestion(num1, '-', num2, num1 - num2, 'subtraction');
}

/**
 * 1.10 - 100以内一步混合 (连加/连减/加减混合)
 */
function generate_1_10(rules) {
  const num1 = randomInt(rules.minValue, rules.maxValue);
  const num2 = randomInt(rules.minValue, rules.maxValue);
  const num3 = randomInt(rules.minValue, Math.min(rules.maxValue, num1 + num2));
  
  const ops = ['+', '-'];
  const op1 = ops[randomInt(0, 1)];
  const op2 = ops[randomInt(0, 1)];
  
  let answer;
  if (op1 === '+' && op2 === '+') {
    answer = num1 + num2 + num3;
  } else if (op1 === '+' && op2 === '-') {
    answer = num1 + num2 - num3;
  } else if (op1 === '-' && op2 === '+') {
    answer = num1 - num2 + num3;
  } else {
    answer = num1 - num2 - num3;
    if (answer < 0) return generate_1_10(rules); // 重新生成
  }
  
  const expression = `${num1} ${op1} ${num2} ${op2} ${num3}`;
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'mixed',
    operators: [op1, op2]
  };
}

// ============== 二年级题型生成器 ==============

/**
 * 2.1 - 100以内不进位加法
 */
function generate_2_1(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(rules.minValue, rules.maxValue - num1);
  } while (hasCarry(num1, num2));
  
  return createQuestion(num1, '+', num2, num1 + num2, 'addition');
}

/**
 * 2.2 - 100以内进位加法
 */
function generate_2_2(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(rules.minValue, rules.maxValue - num1);
  } while (!hasCarry(num1, num2) || num1 + num2 > rules.maxValue);
  
  return createQuestion(num1, '+', num2, num1 + num2, 'addition');
}

/**
 * 2.3 - 100以内不退位减法
 */
function generate_2_3(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(rules.minValue, num1);
  } while (hasBorrow(num1, num2));
  
  return createQuestion(num1, '-', num2, num1 - num2, 'subtraction');
}

/**
 * 2.4 - 100以内退位减法
 */
function generate_2_4(rules) {
  let num1, num2;
  do {
    num1 = randomInt(rules.minValue, rules.maxValue);
    num2 = randomInt(rules.minValue, num1 - 1);
  } while (!hasBorrow(num1, num2));
  
  return createQuestion(num1, '-', num2, num1 - num2, 'subtraction');
}

/**
 * 2.5 - 表内乘法
 */
function generate_2_5(rules) {
  const num1 = randomInt(rules.minValue, rules.maxValue);
  const num2 = randomInt(rules.minValue, rules.maxValue);
  return createQuestion(num1, '×', num2, num1 * num2, 'multiplication');
}

/**
 * 2.6 - 表内除法
 */
function generate_2_6(rules) {
  const divisor = randomInt(rules.minValue, rules.maxValue);
  const quotient = randomInt(rules.minValue, rules.maxValue);
  const dividend = divisor * quotient;
  return createQuestion(dividend, '÷', divisor, quotient, 'division');
}

/**
 * 2.7 - 简单乘加/乘减
 */
function generate_2_7(rules) {
  const num1 = randomInt(2, 9);
  const num2 = randomInt(2, 9);
  const num3 = randomInt(1, 9);
  const op = Math.random() > 0.5 ? '+' : '-';
  
  const answer = op === '+' ? (num1 * num2 + num3) : (num1 * num2 - num3);
  const expression = `${num1} × ${num2} ${op} ${num3}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'mixed',
    operators: ['×', op]
  };
}

/**
 * 2.8 - 简单除加/除减
 */
function generate_2_8(rules) {
  const divisor = randomInt(2, 9);
  const quotient = randomInt(2, 9);
  const dividend = divisor * quotient;
  const num3 = randomInt(1, 9);
  const op = Math.random() > 0.5 ? '+' : '-';
  
  const answer = op === '+' ? (quotient + num3) : (quotient - num3);
  if (answer < 0) return generate_2_8(rules);
  
  const expression = `${dividend} ÷ ${divisor} ${op} ${num3}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'mixed',
    operators: ['÷', op]
  };
}

/**
 * 2.9 - 两位数加减整十数/一位数
 */
function generate_2_9(rules) {
  const num1 = randomInt(rules.minValue, rules.maxValue);
  const isAddTen = Math.random() > 0.5;
  const num2 = isAddTen ? randomInt(1, 9) * 10 : randomInt(1, 9);
  const op = Math.random() > 0.5 ? '+' : '-';
  
  let answer;
  if (op === '+') {
    answer = num1 + num2;
    if (answer > 99) return generate_2_9(rules);
  } else {
    answer = num1 - num2;
    if (answer < 0) return generate_2_9(rules);
  }
  
  return createQuestion(num1, op, num2, answer, op === '+' ? 'addition' : 'subtraction');
}

// ============== 三年级题型生成器 ==============

/**
 * 3.1 - 三位数加减整百数
 */
function generate_3_1(rules) {
  const num1 = randomInt(rules.minValue, rules.maxValue);
  const num2 = randomInt(1, 9) * 100;
  const op = Math.random() > 0.5 ? '+' : '-';
  
  let answer;
  if (op === '+') {
    answer = num1 + num2;
    if (answer > 999) return generate_3_1(rules);
  } else {
    answer = num1 - num2;
    if (answer < 0) return generate_3_1(rules);
  }
  
  return createQuestion(num1, op, num2, answer, op === '+' ? 'addition' : 'subtraction');
}

/**
 * 3.2 - 几百几十加减几百几十
 */
function generate_3_2(rules) {
  // 生成没有个位数的三位数
  const num1 = randomInt(10, 99) * 10;
  const num2 = randomInt(10, 99) * 10;
  const op = Math.random() > 0.5 ? '+' : '-';
  
  let answer;
  if (op === '+') {
    answer = num1 + num2;
    if (answer > 999) return generate_3_2(rules);
  } else {
    if (num1 < num2) return generate_3_2(rules);
    answer = num1 - num2;
  }
  
  return createQuestion(num1, op, num2, answer, op === '+' ? 'addition' : 'subtraction');
}

/**
 * 3.3 - 两位数乘一位数
 */
function generate_3_3(rules) {
  const num1 = randomInt(10, rules.multiplicandMax);
  const num2 = randomInt(2, rules.multiplierMax);
  return createQuestion(num1, '×', num2, num1 * num2, 'multiplication');
}

/**
 * 3.4 - 整百整十数除以一位数
 */
function generate_3_4(rules) {
  const divisor = randomInt(2, rules.divisorMax);
  const quotient = randomInt(10, 99) * 10;
  const dividend = divisor * quotient;
  if (dividend < rules.dividendMin || dividend > rules.dividendMax) {
    return generate_3_4(rules);
  }
  return createQuestion(dividend, '÷', divisor, quotient, 'division');
}

/**
 * 3.5 - 两位数除以一位数
 */
function generate_3_5(rules) {
  const divisor = randomInt(2, rules.divisorMax);
  const quotient = randomInt(2, Math.floor(rules.dividendMax / divisor));
  const dividend = divisor * quotient;
  return createQuestion(dividend, '÷', divisor, quotient, 'division');
}

/**
 * 3.6 - 带括号简单混合
 */
function generate_3_6(rules) {
  const num1 = randomInt(10, 50);
  const num2 = randomInt(5, num1);
  const num3 = randomInt(2, 9);
  
  const ops = ['+', '-', '×', '÷'];
  const op1 = ops[randomInt(0, 1)]; // 括号内只用加减
  const op2 = ops[randomInt(2, 3)]; // 括号外用乘除
  
  let result1;
  if (op1 === '+') {
    result1 = num1 + num2;
  } else {
    result1 = num1 - num2;
    if (result1 <= 0) return generate_3_6(rules);
  }
  
  let answer;
  if (op2 === '×') {
    answer = result1 * num3;
  } else {
    // 确保整除
    if (result1 % num3 !== 0) return generate_3_6(rules);
    answer = result1 / num3;
  }
  
  const expression = `(${num1} ${op1} ${num2}) ${op2} ${num3}`;
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'mixed',
    operators: [op1, op2]
  };
}

/**
 * 3.7 - 乘除混合
 */
function generate_3_7(rules) {
  const num1 = randomInt(2, 9);
  const num2 = randomInt(2, 9);
  const num3 = randomInt(2, 9);
  
  const product = num1 * num2;
  if (product % num3 !== 0) return generate_3_7(rules);
  
  const answer = product / num3;
  const expression = `${num1} × ${num2} ÷ ${num3}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'mixed',
    operators: ['×', '÷']
  };
}

/**
 * 3.8 - 单位换算口算
 */
function generate_3_8(rules) {
  const conversions = [
    { from: 1, unit1: '米', unit2: '厘米', to: 100, desc: '1米 = □厘米' },
    { from: 1, unit1: '千米', unit2: '米', to: 1000, desc: '1千米 = □米' },
    { from: 1, unit1: '千克', unit2: '克', to: 1000, desc: '1千克 = □克' },
    { from: 1, unit1: '时', unit2: '分', to: 60, desc: '1时 = □分' },
    { from: 1, unit1: '分', unit2: '秒', to: 60, desc: '1分 = □秒' }
  ];
  
  const conv = conversions[randomInt(0, conversions.length - 1)];
  const expression = `${conv.from}${conv.unit1} = □${conv.unit2}`;
  
  return {
    expression: expression,
    displayQuestion: expression,
    question: expression,
    answer: conv.to,
    type: 'unit_conversion',
    unit1: conv.unit1,
    unit2: conv.unit2
  };
}

// ============== 四年级及以上题型生成器 ==============

/**
 * 通用生成器 - 根据规则自动适配
 */
function generateByRules(categoryId, rules) {
  // 根据categoryId前缀调用对应生成器
  const generatorMap = {
    '1_1': generate_1_1, '1_2': generate_1_2, '1_3': generate_1_3, '1_4': generate_1_4,
    '1_5': generate_1_5, '1_6': generate_1_6, '1_7': generate_1_7, '1_8': generate_1_8,
    '1_9': generate_1_9, '1_10': generate_1_10,
    '2_1': generate_2_1, '2_2': generate_2_2, '2_3': generate_2_3, '2_4': generate_2_4,
    '2_5': generate_2_5, '2_6': generate_2_6, '2_7': generate_2_7, '2_8': generate_2_8,
    '2_9': generate_2_9,
    '3_1': generate_3_1, '3_2': generate_3_2, '3_3': generate_3_3, '3_4': generate_3_4,
    '3_5': generate_3_5, '3_6': generate_3_6, '3_7': generate_3_7, '3_8': generate_3_8
  };
  
  const generator = generatorMap[categoryId];
  if (generator) {
    return generator(rules);
  }
  
  // 默认生成器（四年级及以上使用简化版本）
  return generateSimpleQuestion(rules);
}

/**
 * 简化生成器（用于四年级及以上）
 */
function generateSimpleQuestion(rules) {
  const operators = rules.operators || ['+'];
  const op = operators[randomInt(0, operators.length - 1)];
  
  let num1, num2, answer;
  
  switch(op) {
    case '+':
      num1 = randomInt(rules.minValue || 1, rules.maxValue || 100);
      num2 = randomInt(rules.minValue || 1, rules.maxValue || 100);
      answer = num1 + num2;
      break;
    case '-':
      num1 = randomInt((rules.minValue || 1) + 10, rules.maxValue || 100);
      num2 = randomInt(rules.minValue || 1, num1);
      answer = num1 - num2;
      break;
    case '×':
      num1 = randomInt(rules.minValue || 1, rules.multiplicandMax || 99);
      num2 = randomInt(rules.minValue || 1, rules.multiplierMax || 9);
      answer = num1 * num2;
      break;
    case '÷':
      num2 = randomInt(2, rules.divisorMax || 9);
      const quotient = randomInt(2, 99);
      num1 = num2 * quotient;
      answer = quotient;
      break;
    default:
      num1 = 10;
      num2 = 5;
      answer = 15;
  }
  
  return createQuestion(num1, op, num2, answer, getTypeByOperator(op));
}

/**
 * 创建标准题目对象
 */
function createQuestion(num1, operator, num2, answer, type) {
  const expression = `${num1} ${operator} ${num2}`;
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: type,
    operands: [num1, num2],
    operator: operator
  };
}

/**
 * 根据运算符获取题型
 */
function getTypeByOperator(op) {
  const typeMap = { '+': 'addition', '-': 'subtraction', '×': 'multiplication', '÷': 'division' };
  return typeMap[op] || 'mixed';
}

/**
 * 主题目生成函数
 */
function generateQuestion(gradeKey, categoryId) {
  const category = getCategoryRules(gradeKey, categoryId);
  if (!category) {
    throw new Error(`未找到年级 ${gradeKey} 的题型 ${categoryId}`);
  }
  
  const rules = category.rules;
  return generateByRules(categoryId, rules);
}

/**
 * 批量生成题目
 */
function generateQuestions(gradeKey, categoryId, count = 10) {
  const questions = [];
  const usedQuestions = new Set();
  
  let attempts = 0;
  const maxAttempts = count * 10;
  
  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    
    try {
      const question = generateQuestion(gradeKey, categoryId);
      const questionKey = question.question;
      
      if (!usedQuestions.has(questionKey)) {
        questions.push({
          ...question,
          id: `q_${Date.now()}_${questions.length}`,
          gradeKey,
          categoryId,
          createdAt: new Date().toISOString()
        });
        usedQuestions.add(questionKey);
      }
    } catch (error) {
      console.error('生成题目失败:', error);
    }
  }
  
  return questions;
}

module.exports = {
  generateQuestion,
  generateQuestions
};
