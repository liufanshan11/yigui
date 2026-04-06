# 智汇衣橱 (SmartWardrobe)

一款智能穿搭管理 H5 应用，帮助年轻人管理衣橱、自动生成穿搭建议。

## 功能

- 📸 AI 衣物识别 - 上传图片，自动识别分类、颜色、风格
- 🎨 AI 穿搭推荐 - 根据场景和温度生成搭配方案
- 💬 AI 穿搭咨询 - 输入身高体重，获取个性化建议
- 📊 衣橱诊断 - 分析衣橱健康状况

## 快速启动

### 方式一：双击 start.bat (Windows)

双击 `start.bat` 文件，自动启动前端和后端。

### 方式二：手动启动

需要打开两个命令行窗口：

**窗口 1 - 后端：**
```bash
cd smart-wardrobe/backend
pip install -r requirements.txt
python main.py
```

**窗口 2 - 前端：**
```bash
cd smart-wardrobe
npm install
npm run dev
```

## 访问

打开浏览器访问：**http://localhost:5173**

## 项目结构

```
smart-wardrobe/
├── src/           # 前端代码
├── backend/       # 后端代码 (FastAPI)
├── dist/          # 构建产物
├── start.bat      # 一键启动 (Windows)
├── README-DEV.md  # 开发者文档
└── 运行指南.md    # 运行说明
```

## 技术栈

- 前端：React + Vite + Tailwind CSS
- 后端：FastAPI + 阿里云通义千问

## 问题排查

- 端口被占用：关闭其他程序
- AI 识别失败：检查后端是否启动
- 手机无法访问：确保同一 WiFi，使用局域网 IP

## GitHub 部署（前端）

本项目已内置 GitHub Pages 工作流：`.github/workflows/deploy-pages.yml`。

### 1) 推送到仓库

将代码推送到 `main` 分支后会自动触发部署。

### 2) 打开 Pages

在 GitHub 仓库设置中：
- `Settings` -> `Pages`
- `Build and deployment` 选择 `GitHub Actions`

部署成功后访问：
- `https://liufanshan11.github.io/yigui/`

### 3) 说明

- GitHub Pages 只部署前端静态页面。
- `/api/analyze` 和 `/api/style-consult` 需要后端服务（FastAPI）单独部署后才能在线使用 AI 功能。
- 如果后端未部署，页面可访问，但 AI 接口会提示连接失败。
