# 电子木鱼

一个简单的电子木鱼网站，每点击一次木鱼功德+1，有概率点一次加1~100功德。功德数据会自动保存到Cloudflare D1数据库中。

## 项目特点

- 点击木鱼增加功德
- 有0.5%的概率获得1-100的随机功德
- 显示随机的佛家智慧语录
- 使用Cloudflare D1数据库存储功德数据
- 基于用户ID识别不同用户，自动同步功德数据
- 优化的声音播放系统，支持快速连续敲击
- 暗黑主题设计，金色光晕效果
- 支持键盘快捷键（空格键或回车键）敲击木鱼
- 节流保存技术，减少数据库写入次数，提高性能

## 项目结构

```
electronic-wooden-fish/
├── public/                 # 静态资源目录
│   ├── images/             # 图片目录
│   │   └── woodenfish.webp # 木鱼图片
│   ├── sounds/             # 声音目录
│   │   └── muyu.mp3        # 木鱼敲击声音
│   ├── index.html          # 主页
│   ├── styles.css          # 样式文件
│   └── script.js           # 前端脚本
├── functions/              # Cloudflare Functions目录
│   └── api.js              # API处理文件，处理功德数据的获取和保存
├── _routes.json            # 路由配置文件
├── schema.sql              # 数据库初始化SQL
├── wrangler.toml           # Cloudflare配置文件
└── README.md               # 项目说明
```

## 数据库功能

本项目使用Cloudflare D1数据库来存储用户的功德数据。主要功能包括：

1. **用户识别**：通过浏览器Cookie识别用户，生成唯一用户ID
2. **功德数据存储**：将用户的功德数据存储在数据库中
3. **数据同步**：自动同步本地功德数据和数据库数据
4. **节流保存**：限制数据库写入频率，避免频繁写入
5. **优雅退出保存**：在用户关闭页面前自动保存功德数据

### 数据表结构

```sql
CREATE TABLE IF NOT EXISTS merit_records (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    merit_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以便快速查找用户数据
CREATE INDEX IF NOT EXISTS idx_merit_records_user_id ON merit_records(user_id);
```

## 部署指南

### 1. 准备工作

1. 注册[Cloudflare账号](https://dash.cloudflare.com/sign-up)
2. 在Cloudflare控制台中创建Pages项目，连接到GitHub仓库

### 2. 创建D1数据库

在Cloudflare控制台中：
1. 进入Workers & Pages > D1
2. 创建一个新的数据库，命名为`wooden_fish_db`
3. 记下数据库ID
4. 使用`schema.sql`文件初始化数据库：
   ```bash
   wrangler d1 execute wooden_fish_db --file=./schema.sql
   ```

### 3. 配置Pages项目

在Pages项目设置中：
1. 构建设置：
   - 构建命令：留空
   - 构建输出目录：`public`

2. 环境变量和绑定：
   - 添加D1数据库绑定：`DB` -> `wooden_fish_db`

### 4. 配置函数路由

确保项目根目录中有`_routes.json`文件，配置API路由：

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"],
  "routes": [
    {
      "pattern": "/api",
      "function": "api"
    },
    {
      "pattern": "/api/:path*",
      "function": "api"
    }
  ]
}
```

### 5. 部署

将代码推送到GitHub仓库，Cloudflare Pages将自动部署网站。

## 本地开发

如果您安装了Wrangler CLI，可以使用以下命令在本地开发和测试：

```bash
# 确保先安装依赖
npm install -g wrangler

# 本地开发
wrangler pages dev --d1=DB:wooden_fish_db
```

## 注意事项

- 确保将木鱼图片下载到`public/images/woodenfish.webp`
- 确保将木鱼声音文件下载到`public/sounds/muyu.mp3`
- 修改`wrangler.toml`中的D1数据库ID为你的实际ID
- 如果需要自定义域名，可以在Cloudflare Pages的设置中配置 