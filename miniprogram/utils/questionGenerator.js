/**
 * 题目生成器
 * 根据不同题型和参数生成数学题目
 */

class QuestionGenerator {
  /**
   * 生成题目列表
   * @param {Object} options - 生成选项
   * @param {String} options.type - 题型: add, subtract, multiply, divide, mixed
   * @param {Number} options.grade - 年级: 1-6
   * @param {Number} options.count - 题目数量
   * @param {Number} options.minNum - 最小数值
   * @param {Number} options.maxNum - 最大数值
   * @returns {Array} 题目列表
   */
  static generate(options) {
    const { type, count = 20 } = options;
    const questions = [];
    const usedQuestions = new Set(); // 去重

    while (questions.length < count) {
      let question;
      
      switch (type) {
        case 'add':
          question = this.generateAddition(options);
          break;
        case 'subtract':
          question = this.generateSubtraction(options);
          break;
        case 'multiply':
          question = this.generateMultiplication(options);
          break;
        case 'divide':
          question = this.generateDivision(options);
          break;
        case 'mixed':
          question = this.generateMixed(options);
          break;
        default:
          question = this.generateAddition(options);
      }

      // 去重
      const questionKey = `${question.expression}=${question.answer}`;
      if (!usedQuestions.has(questionKey)) {
        usedQuestions.add(questionKey);
        questions.push({
          id: this.generateId(),
          ...question,
          type
        });
      }
    }

    return questions;
  }

  /**
   * 生成加法题目
   */
  static generateAddition(options) {
    const { minNum = 1, maxNum = 20 } = options;
    const num1 = this.randomInt(minNum, maxNum);
    const num2 = this.randomInt(minNum, maxNum);
    
    return {
      expression: `${num1} + ${num2}`,
      answer: num1 + num2,
      num1,
      num2,
      operator: '+'
    };
  }

  /**
   * 生成减法题目
   */
  static generateSubtraction(options) {
    const { minNum = 1, maxNum = 20 } = options;
    let num1 = this.randomInt(minNum, maxNum);
    let num2 = this.randomInt(minNum, maxNum);
    
    // 确保被减数大于减数，避免负数结果
    if (num1 < num2) {
      [num1, num2] = [num2, num1];
    }
    
    return {
      expression: `${num1} - ${num2}`,
      answer: num1 - num2,
      num1,
      num2,
      operator: '-'
    };
  }

  /**
   * 生成乘法题目
   */
  static generateMultiplication(options) {
    const { minNum = 1, maxNum = 9 } = options;
    const num1 = this.randomInt(minNum, maxNum);
    const num2 = this.randomInt(minNum, maxNum);
    
    return {
      expression: `${num1} × ${num2}`,
      answer: num1 * num2,
      num1,
      num2,
      operator: '×'
    };
  }

  /**
   * 生成除法题目
   */
  static generateDivision(options) {
    const { minNum = 1, maxNum = 9 } = options;
    const divisor = this.randomInt(minNum, maxNum); // 除数
    const quotient = this.randomInt(minNum, maxNum); // 商
    const dividend = divisor * quotient; // 被除数 = 除数 × 商
    
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      num1: dividend,
      num2: divisor,
      operator: '÷'
    };
  }

  /**
   * 生成混合运算题目
   */
  static generateMixed(options) {
    const operators = ['+', '-', '×', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    switch (operator) {
      case '+':
        return this.generateAddition(options);
      case '-':
        return this.generateSubtraction(options);
      case '×':
        return this.generateMultiplication(options);
      case '÷':
        return this.generateDivision(options);
      default:
        return this.generateAddition(options);
    }
  }

  /**
   * 生成随机整数
   * @param {Number} min - 最小值
   * @param {Number} max - 最大值
   * @returns {Number}
   */
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 生成唯一ID
   */
  static generateId() {
    return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 根据年级获取默认参数
   */
  static getDefaultParamsByGrade(grade, type) {
    const params = {
      1: { // 一年级
        add: { minNum: 1, maxNum: 20 },
        subtract: { minNum: 1, maxNum: 20 }
      },
      2: { // 二年级
        add: { minNum: 1, maxNum: 100 },
        subtract: { minNum: 1, maxNum: 100 },
        multiply: { minNum: 1, maxNum: 5 }
      },
      3: { // 三年级
        add: { minNum: 1, maxNum: 1000 },
        subtract: { minNum: 1, maxNum: 1000 },
        multiply: { minNum: 1, maxNum: 9 },
        divide: { minNum: 1, maxNum: 9 }
      },
      4: { // 四年级
        add: { minNum: 1, maxNum: 10000 },
        subtract: { minNum: 1, maxNum: 10000 },
        multiply: { minNum: 1, maxNum: 99 },
        divide: { minNum: 1, maxNum: 9 }
      },
      5: { // 五年级
        mixed: { minNum: 1, maxNum: 100 }
      },
      6: { // 六年级
        mixed: { minNum: 1, maxNum: 1000 }
      }
    };

    return params[grade]?.[type] || { minNum: 1, maxNum: 100 };
  }
}

module.exports = QuestionGenerator;
