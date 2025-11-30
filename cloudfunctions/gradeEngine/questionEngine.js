/**
 * 题目生成引擎
 * 根据年级和题型规则智能生成题目
 */

const { getCategoryRules } = require('./gradeConfig');

/**
 * 生成随机整数
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成加法题目
 */
function generateAddition(rules) {
  const { minValue, maxValue, allowCarry, allowMultiDigit } = rules;
  
  let num1, num2;
  
  if (allowMultiDigit && maxValue > 20) {
    // 两位数及以上加法
    num1 = randomInt(minValue, maxValue);
    num2 = randomInt(minValue, maxValue - num1);
  } else {
    // 20以内加法
    num1 = randomInt(minValue, maxValue);
    num2 = randomInt(minValue, maxValue);
    
    // 如果需要进位，确保和大于10
    if (allowCarry && num1 + num2 <= 10) {
      num2 = randomInt(10 - num1 + 1, maxValue - num1);
    }
  }
  
  const answer = num1 + num2;
  const expression = `${num1} + ${num2}`;
  
  return {
    expression: expression,           // 标准表达式（不含 = ?）
    displayQuestion: `${expression} = ?`,  // 显示格式（含 = ?）
    question: expression,             // 兼容旧版
    answer: answer,
    type: 'addition',
    operands: [num1, num2],
    operator: '+'
  };
}

/**
 * 生成减法题目
 */
function generateSubtraction(rules) {
  const { minValue, maxValue, allowBorrow, resultPositive } = rules;
  
  let num1, num2;
  
  if (maxValue > 20) {
    // 两位数及以上减法
    num1 = randomInt(minValue + 10, maxValue);
    num2 = randomInt(minValue, num1);
  } else {
    // 20以内减法
    num1 = randomInt(minValue + 5, maxValue);
    num2 = randomInt(minValue, num1);
    
    // 如果需要退位，确保个位数小于被减数个位
    if (allowBorrow) {
      const digit1 = num1 % 10;
      const digit2 = num2 % 10;
      if (digit1 >= digit2) {
        num2 = Math.floor(num2 / 10) * 10 + randomInt(digit1 + 1, 9);
        if (num2 > num1) num2 = num1 - 1;
      }
    }
  }
  
  const answer = num1 - num2;
  const expression = `${num1} - ${num2}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'subtraction',
    operands: [num1, num2],
    operator: '-'
  };
}

/**
 * 生成乘法题目
 */
function generateMultiplication(rules) {
  const { multiplicandMax = 99, multiplierMax = 9, allowZero = false } = rules;
  
  const num1 = randomInt(allowZero ? 0 : 1, multiplicandMax);
  const num2 = randomInt(allowZero ? 0 : 1, multiplierMax);
  
  const answer = num1 * num2;
  const expression = `${num1} × ${num2}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'multiplication',
    operands: [num1, num2],
    operator: '×'
  };
}

/**
 * 生成除法题目
 */
function generateDivision(rules) {
  const { multiplicandMax = 99, multiplierMax = 9, allowZero = false } = rules;
  
  const divisor = randomInt(1, multiplierMax); // 除数不能为0
  const quotient = randomInt(allowZero ? 0 : 1, Math.floor(multiplicandMax / divisor));
  const dividend = divisor * quotient; // 保证整除
  
  const answer = quotient;
  const expression = `${dividend} ÷ ${divisor}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'division',
    operands: [dividend, divisor],
    operator: '÷'
  };
}

/**
 * 生成混合运算题目
 */
function generateMixedOperation(rules) {
  const { operators, operands, allowParentheses = false, steps = 2 } = rules;
  
  // 随机选择运算符
  const selectedOps = [];
  for (let i = 0; i < steps; i++) {
    selectedOps.push(operators[randomInt(0, operators.length - 1)]);
  }
  
  // 生成数字
  const nums = [];
  for (let i = 0; i <= steps; i++) {
    nums.push(randomInt(1, 20));
  }
  
  // 构建表达式
  let expression = `${nums[0]}`;
  for (let i = 0; i < steps; i++) {
    expression += ` ${selectedOps[i]} ${nums[i + 1]}`;
  }
  
  // 如果允许括号，随机添加括号
  if (allowParentheses && steps >= 2 && Math.random() > 0.5) {
    expression = `(${nums[0]} ${selectedOps[0]} ${nums[1]}) ${selectedOps[1]} ${nums[2]}`;
  }
  
  // 计算答案（简化版，实际应使用更严格的表达式解析）
  let answer;
  try {
    // 替换数学符号为JavaScript运算符
    const jsExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\s/g, '');
    answer = eval(jsExpression);
    answer = Math.round(answer * 100) / 100; // 保留两位小数
  } catch (e) {
    answer = 0;
  }
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'mixed',
    operators: selectedOps
  };
}

/**
 * 生成小数运算题目
 */
function generateDecimalOperation(rules) {
  const { operators, decimalPlaces = 1, maxValue = 100 } = rules;
  
  const operator = operators[randomInt(0, operators.length - 1)];
  const factor = Math.pow(10, decimalPlaces);
  
  let num1 = randomInt(1, maxValue * factor) / factor;
  let num2 = randomInt(1, maxValue * factor) / factor;
  
  let answer;
  let displayOp = operator;
  
  switch(operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      if (num1 < num2) [num1, num2] = [num2, num1]; // 确保结果为正
      answer = num1 - num2;
      break;
    case '×':
      displayOp = '×';
      answer = num1 * num2;
      break;
    case '÷':
      displayOp = '÷';
      num2 = randomInt(1, 9); // 除数用整数
      answer = num1 / num2;
      break;
  }
  
  answer = Math.round(answer * factor) / factor;
  const expression = `${num1} ${displayOp} ${num2}`;
  
  return {
    expression: expression,
    displayQuestion: `${expression} = ?`,
    question: expression,
    answer: answer,
    type: 'decimal',
    operands: [num1, num2],
    operator: displayOp
  };
}

/**
 * 生成分数运算题目
 */
function generateFractionOperation(rules) {
  const { operators, sameDenominator = true, maxNumerator = 20, maxDenominator = 20 } = rules;
  
  const operator = operators[randomInt(0, operators.length - 1)];
  
  let denominator1, denominator2, numerator1, numerator2;
  
  if (sameDenominator) {
    // 同分母
    denominator1 = denominator2 = randomInt(2, maxDenominator);
    numerator1 = randomInt(1, denominator1 - 1);
    numerator2 = randomInt(1, denominator1 - 1);
  } else {
    // 异分母（简化版，使用倍数关系）
    denominator1 = randomInt(2, 10);
    denominator2 = denominator1 * randomInt(2, 3);
    numerator1 = randomInt(1, denominator1 - 1);
    numerator2 = randomInt(1, denominator2 - 1);
  }
  
  let answerNumerator, answerDenominator;
  
  if (operator === '+') {
    if (sameDenominator) {
      answerNumerator = numerator1 + numerator2;
      answerDenominator = denominator1;
    } else {
      // 通分
      answerDenominator = denominator1 * denominator2;
      answerNumerator = numerator1 * denominator2 + numerator2 * denominator1;
    }
  } else if (operator === '-') {
    if (sameDenominator) {
      if (numerator1 < numerator2) [numerator1, numerator2] = [numerator2, numerator1];
      answerNumerator = numerator1 - numerator2;
      answerDenominator = denominator1;
    } else {
      answerDenominator = denominator1 * denominator2;
      answerNumerator = numerator1 * denominator2 - numerator2 * denominator1;
      if (answerNumerator < 0) answerNumerator = Math.abs(answerNumerator);
    }
  }
  
  // 化简（最大公约数）
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(answerNumerator, answerDenominator);
  answerNumerator /= divisor;
  answerDenominator /= divisor;
  
  const fraction1 = `${numerator1}/${denominator1}`;
  const fraction2 = `${numerator2}/${denominator2}`;
  const answer = answerDenominator === 1 ? answerNumerator : `${answerNumerator}/${answerDenominator}`;
  
  return {
    question: `${fraction1} ${operator} ${fraction2}`,
    displayQuestion: `${fraction1} ${operator} ${fraction2} = ?`,
    answer: answer.toString(),
    type: 'fraction',
    fractions: [fraction1, fraction2],
    operator: operator
  };
}

/**
 * 生成比较大小题目
 */
function generateComparison(rules) {
  const { minValue = 0, maxValue = 100 } = rules;
  
  const num1 = randomInt(minValue, maxValue);
  const num2 = randomInt(minValue, maxValue);
  
  let answer;
  if (num1 > num2) answer = '>';
  else if (num1 < num2) answer = '<';
  else answer = '=';
  
  const expression = `${num1} ○ ${num2}`;
  
  return {
    expression: expression,
    displayQuestion: expression,  // 比较大小不需要 = ?
    question: expression,
    answer: answer,
    type: 'comparison',
    operands: [num1, num2],
    operator: '○'
  };
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
  const operators = rules.operators || [];
  
  // 根据题型ID和规则选择生成器
  if (categoryId.includes('addition')) {
    return generateAddition(rules);
  } else if (categoryId.includes('subtraction')) {
    return generateSubtraction(rules);
  } else if (categoryId.includes('multiplication')) {
    return generateMultiplication(rules);
  } else if (categoryId === 'mixed_operations' || categoryId === 'mixed_operations_advanced' || categoryId === 'mixed_advanced') {
    return generateMixedOperation(rules);
  } else if (categoryId.includes('decimal')) {
    return generateDecimalOperation(rules);
  } else if (categoryId.includes('fraction')) {
    return generateFractionOperation(rules);
  } else if (operators.length === 1) {
    // 单一运算符
    switch(operators[0]) {
      case '+': return generateAddition(rules);
      case '-': return generateSubtraction(rules);
      case '×': return generateMultiplication(rules);
      case '÷': return generateDivision(rules);
      default: return generateComparison(rules);
    }
  } else {
    // 多运算符混合
    return generateMixedOperation(rules);
  }
}

/**
 * 批量生成题目
 */
function generateQuestions(gradeKey, categoryId, count = 10) {
  const questions = [];
  const usedQuestions = new Set();
  
  let attempts = 0;
  const maxAttempts = count * 10; // 防止无限循环
  
  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    
    try {
      const question = generateQuestion(gradeKey, categoryId);
      const questionKey = question.question;
      
      // 避免重复题目
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
