@echo off
echo ==========================================
echo   口算小程序 - 云函数快速部署工具
echo ==========================================
echo.

set CLOUD_FUNCTION=gradeEngine

echo [1/3] 检查云函数目录...
if not exist "cloudfunctions\%CLOUD_FUNCTION%" (
    echo ❌ 错误: 找不到云函数目录 cloudfunctions\%CLOUD_FUNCTION%
    pause
    exit /b 1
)

echo ✅ 云函数目录存在
echo.

echo [2/3] 检查必要文件...
if not exist "cloudfunctions\%CLOUD_FUNCTION%\index.js" (
    echo ❌ 错误: 缺少 index.js
    pause
    exit /b 1
)
if not exist "cloudfunctions\%CLOUD_FUNCTION%\package.json" (
    echo ❌ 错误: 缺少 package.json
    pause
    exit /b 1
)

echo ✅ 文件检查通过
echo.

echo [3/3] 准备部署...
echo.
echo 📦 云函数名称: %CLOUD_FUNCTION%
echo 📂 云函数路径: cloudfunctions\%CLOUD_FUNCTION%
echo.
echo 📋 包含文件:
dir /b cloudfunctions\%CLOUD_FUNCTION%\*.js
echo.

echo ⚠️  请在微信开发者工具中手动部署云函数：
echo.
echo 步骤 1: 打开微信开发者工具
echo 步骤 2: 右键点击 cloudfunctions/%CLOUD_FUNCTION% 目录
echo 步骤 3: 选择"上传并部署：云端安装依赖"
echo 步骤 4: 等待部署完成（约1-2分钟）
echo.

echo ✨ 本次更新内容：
echo - 新增1-6年级独立配置（82种题型）
echo - 新增smartGenerate智能分配功能
echo - 优化题目生成算法
echo - 添加权重分配系统
echo.

echo 💡 部署后测试建议：
echo 1. 在云开发控制台测试 smartGenerate action
echo 2. 在小程序中启用"智能分配"功能
echo 3. 生成一份试卷验证题目质量
echo.

pause
