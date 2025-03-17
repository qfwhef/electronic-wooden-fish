# 电子木鱼

一个简单的电子木鱼网站，每点击一次木鱼功德+1，有概率点一次加1~100功德。

## 项目特点

- 点击木鱼增加功德
- 有0.5%的概率获得1-100的随机功德
- 显示随机的佛家智慧语录
- 使用Cloudflare KV和D1数据库存储功德数据
- 优化的声音播放系统，支持快速连续敲击
- 暗黑主题设计，金色光晕效果
- 支持键盘快捷键（空格键或回车键）敲击木鱼

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
│   ├── api.js              # API处理文件
│   └── api/                # API路由目录（旧版）
│       └── [[route]].js    # API处理文件（旧版）
├── _routes.json            # 路由配置文件
├── schema.sql              # 数据库初始化SQL
├── wrangler.toml           # Cloudflare配置文件
└── README.md               # 项目说明
```

## 部署指南

### 1. 准备工作

1. 注册[Cloudflare账号](https://dash.cloudflare.com/sign-up)
2. 在Cloudflare控制台中创建Pages项目，连接到GitHub仓库

### 2. 创建KV命名空间

在Cloudflare控制台中：
1. 进入Workers & Pages > KV
2. 创建一个新的命名空间，命名为`MERIT_STORE`
3. 记下命名空间ID

### 3. 创建D1数据库

在Cloudflare控制台中：
1. 进入Workers & Pages > D1
2. 创建一个新的数据库，命名为`wooden_fish_db`
3. 记下数据库ID
4. 使用`schema.sql`文件初始化数据库

### 4. 配置Pages项目

在Pages项目设置中：
1. 构建设置：
   - 构建命令：留空
   - 构建输出目录：`public`

2. 环境变量和绑定：
   - 添加KV命名空间绑定：`MERIT_STORE`
   - 添加D1数据库绑定：`DB`

### 5. 添加声音文件

将木鱼敲击声音文件保存为`muyu.mp3`并上传到`public/sounds/`目录。

### 6. 部署

将代码推送到GitHub仓库，Cloudflare Pages将自动部署网站。

## 本地开发

如果您安装了Wrangler CLI，可以使用以下命令在本地开发和测试：

```bash
wrangler pages dev public
```

## 注意事项

- 确保将木鱼图片下载到`public/images/woodenfish.webp`
- 确保将木鱼声音文件下载到`public/sounds/muyu.mp3`
- 修改`wrangler.toml`中的KV命名空间ID和D1数据库ID
- 如果需要自定义域名，可以在Cloudflare Pages的设置中配置 