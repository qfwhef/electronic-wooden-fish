# 电子木鱼

一个简单的电子木鱼网站，每点击一次木鱼功德+1，有概率点一次加1~100功德。

## 项目结构

```
electronic-wooden-fish/
├── public/                 # 静态资源目录
│   ├── images/             # 图片目录
│   │   └── woodenfish.webp # 木鱼图片
│   ├── index.html          # 主页
│   ├── styles.css          # 样式文件
│   └── script.js           # 前端脚本
├── functions/              # Cloudflare Functions目录
│   └── api/                # API路由
│       └── [[route]].js    # API处理文件
├── schema.sql              # 数据库初始化SQL
├── wrangler.toml           # Cloudflare配置文件
└── README.md               # 项目说明
```

## 功能特点

- 点击木鱼增加功德
- 有0.5%的概率获得1-100的随机功德
- 显示随机的佛家智慧语录
- 使用Cloudflare KV和D1数据库存储功德数据

## 部署指南

### 1. 准备工作

1. 注册[Cloudflare账号](https://dash.cloudflare.com/sign-up)
2. 安装[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)：

```bash
npm install -g wrangler
```

3. 登录Wrangler：

```bash
wrangler login
```

### 2. 创建KV命名空间

```bash
wrangler kv:namespace create MERIT_STORE
```

执行后，你会得到类似以下的输出：

```
🌀 Creating namespace with title "electronic-wooden-fish-MERIT_STORE"
✨ Success!
Add the following to your configuration file:
kv_namespaces = [
	{ binding = "MERIT_STORE", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
]
```

将输出中的KV命名空间ID复制到`wrangler.toml`文件中的`YOUR_KV_NAMESPACE_ID`位置。

### 3. 创建D1数据库

```bash
wrangler d1 create wooden_fish_db
```

执行后，你会得到类似以下的输出：

```
✅ Successfully created DB 'wooden_fish_db' (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
```

将输出中的数据库ID复制到`wrangler.toml`文件中的`YOUR_D1_DATABASE_ID`位置。

### 4. 初始化数据库

```bash
wrangler d1 execute wooden_fish_db --file=./schema.sql
```

### 5. 部署到Cloudflare Pages

```bash
wrangler pages publish public --project-name=electronic-wooden-fish
```

## 本地开发

你可以使用以下命令在本地开发和测试：

```bash
wrangler pages dev public
```

## 注意事项

- 确保将木鱼图片下载到`public/images/woodenfish.webp`
- 修改`wrangler.toml`中的KV命名空间ID和D1数据库ID
- 如果需要自定义域名，可以在Cloudflare Pages的设置中配置 