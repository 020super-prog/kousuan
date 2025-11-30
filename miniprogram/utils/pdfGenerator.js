/**
 * PDF试卷生成工具类
 * 使用Canvas绘制A4尺寸的试卷
 */

class PDFGenerator {
  constructor() {
    // A4纸尺寸 (像素，72dpi)
    this.A4_WIDTH = 595;
    this.A4_HEIGHT = 842;
    
    // 高分辨率倍数
    this.scale = 2;
    
    // 实际画布尺寸
    this.canvasWidth = this.A4_WIDTH * this.scale;
    this.canvasHeight = this.A4_HEIGHT * this.scale;
    
    // 边距
    this.margin = 40 * this.scale;
    
    // 字体大小（需要乘以scale）
    this.fontSizes = {
      title: 24 * this.scale,
      subtitle: 16 * this.scale,
      question: 14 * this.scale,
      answer: 12 * this.scale,
      footer: 10 * this.scale
    };
  }

  /**
   * 生成试卷
   * @param {Object} config 配置参数
   * @returns {Promise<string>} 临时文件路径
   */
  async generate(config) {
    const {
      title = '口算练习题',
      questions = [],
      showAnswer = false,
      columnCount = 3,
      grade = '一年级'
    } = config;

    return new Promise(async (resolve, reject) => {
      try {
        // 获取Canvas实例
        const query = wx.createSelectorQuery();
        query.select('#pdfCanvas')
          .fields({ node: true, size: true })
          .exec(async (res) => {
            if (!res || !res[0] || !res[0].node) {
              reject(new Error('获取Canvas节点失败，请确保页面中存在id为pdfCanvas的canvas组件'));
              return;
            }

            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            // 设置Canvas尺寸
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            
            // 设置高质量渲染
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // 绘制试卷
            await this.drawPaper(ctx, {
              title,
              questions,
              showAnswer,
              columnCount,
              grade
            });

            // 转换为临时文件
            wx.canvasToTempFilePath({
              canvas: canvas,
              fileType: 'png',
              quality: 1.0,
              success: (result) => {
                resolve(result.tempFilePath);
              },
              fail: (err) => {
                console.error('Canvas转图片失败:', err);
                reject(err);
              }
            });
          });
      } catch (error) {
        console.error('生成PDF失败:', error);
        reject(error);
      }
    });
  }

  /**
   * 绘制试卷内容
   */
  async drawPaper(ctx, config) {
    const { title, questions, showAnswer, columnCount, grade } = config;

    // 背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    let currentY = this.margin;

    // 1. 绘制标题
    currentY = this.drawTitle(ctx, title, currentY);

    // 2. 绘制信息栏
    currentY = this.drawInfoBar(ctx, grade, currentY);

    // 3. 绘制分隔线
    currentY = this.drawDivider(ctx, currentY);

    // 4. 绘制题目
    currentY = this.drawQuestions(ctx, questions, showAnswer, columnCount, currentY);

    // 5. 绘制页脚
    this.drawFooter(ctx);
  }

  /**
   * 绘制标题
   */
  drawTitle(ctx, title, startY) {
    ctx.fillStyle = '#2C3E50';
    ctx.font = `bold ${this.fontSizes.title}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const titleY = startY + 20 * this.scale;
    ctx.fillText(title, this.canvasWidth / 2, titleY);

    return titleY + 40 * this.scale;
  }

  /**
   * 绘制信息栏
   */
  drawInfoBar(ctx, grade, startY) {
    ctx.fillStyle = '#2C3E50';
    ctx.font = `${this.fontSizes.subtitle}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'left';

    const infoY = startY + 10 * this.scale;

    // 左侧信息
    ctx.fillText(`年级：${grade}`, this.margin, infoY);
    ctx.fillText('姓名：__________', this.margin, infoY + 30 * this.scale);

    // 右侧信息
    ctx.textAlign = 'right';
    const date = new Date();
    const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    ctx.fillText(`日期：${dateStr}`, this.canvasWidth - this.margin, infoY);
    ctx.fillText('得分：__________', this.canvasWidth - this.margin, infoY + 30 * this.scale);

    return infoY + 50 * this.scale;
  }

  /**
   * 绘制分隔线
   */
  drawDivider(ctx, startY) {
    ctx.strokeStyle = '#E8E8E8';
    ctx.lineWidth = 1 * this.scale;
    
    const dividerY = startY + 10 * this.scale;
    
    ctx.beginPath();
    ctx.moveTo(this.margin, dividerY);
    ctx.lineTo(this.canvasWidth - this.margin, dividerY);
    ctx.stroke();

    return dividerY + 20 * this.scale;
  }

  /**
   * 绘制题目
   */
  drawQuestions(ctx, questions, showAnswer, columnCount, startY) {
    const contentWidth = this.canvasWidth - this.margin * 2;
    const columnWidth = contentWidth / columnCount;
    const questionHeight = showAnswer ? 70 * this.scale : 50 * this.scale;
    const maxQuestionsPerPage = Math.floor((this.canvasHeight - startY - 60 * this.scale) / questionHeight) * columnCount;

    ctx.font = `${this.fontSizes.question}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // 只绘制能放下的题目
    const questionsToShow = questions.slice(0, maxQuestionsPerPage);

    questionsToShow.forEach((q, index) => {
      const col = index % columnCount;
      const row = Math.floor(index / columnCount);

      const x = this.margin + col * columnWidth;
      const y = startY + row * questionHeight;

      // 题号
      ctx.fillStyle = '#95A5A6';
      const questionNumber = `${index + 1}.`;
      ctx.fillText(questionNumber, x, y);

      // 计算题号宽度
      const numberWidth = ctx.measureText(questionNumber).width;

      // 题目
      ctx.fillStyle = '#2C3E50';
      const questionText = q.displayQuestion || `${q.expression} = ?`;
      ctx.fillText(questionText, x + numberWidth + 10 * this.scale, y);

      // 答案（如果需要）
      if (showAnswer && q.answer !== undefined) {
        ctx.fillStyle = '#E74C3C';
        ctx.font = `${this.fontSizes.answer}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillText(`(答案: ${q.answer})`, x + numberWidth + 10 * this.scale, y + 25 * this.scale);
        ctx.font = `${this.fontSizes.question}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      }
    });

    return startY + Math.ceil(questionsToShow.length / columnCount) * questionHeight;
  }

  /**
   * 绘制页脚
   */
  drawFooter(ctx) {
    ctx.fillStyle = '#95A5A6';
    ctx.font = `${this.fontSizes.footer}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    const footerY = this.canvasHeight - 20 * this.scale;
    ctx.fillText('© 口算练习小程序 - 让学习更轻松', this.canvasWidth / 2, footerY);
  }

  /**
   * 保存到相册
   */
  async saveToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum']) {
            // 已授权，直接保存
            this._saveImage(filePath, resolve, reject);
          } else {
            // 请求授权
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this._saveImage(filePath, resolve, reject);
              },
              fail: () => {
                reject(new Error('需要授权保存到相册'));
              }
            });
          }
        },
        fail: reject
      });
    });
  }

  /**
   * 保存图片
   */
  _saveImage(filePath, resolve, reject) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        resolve();
      },
      fail: (err) => {
        console.error('保存图片失败:', err);
        reject(err);
      }
    });
  }

  /**
   * 预览图片
   */
  preview(imagePath) {
    wx.previewImage({
      urls: [imagePath],
      current: imagePath
    });
  }
}

// 导出单例
export default new PDFGenerator();
