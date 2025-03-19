document.addEventListener('DOMContentLoaded', async () => {
    const woodenfish = document.getElementById('woodenfish');
    const woodenfishImg = document.getElementById('woodenfish-img');
    const meritCount = document.getElementById('merit-count');
    const meritMessage = document.getElementById('merit-message');
    const wisdomText = document.getElementById('wisdom-text');
    
    // 音效管理
    const soundManager = {
        // 音效池，用于管理多个音效实例
        soundPool: [],
        // 初始化音效池
        init(poolSize = 5) {
            for (let i = 0; i < poolSize; i++) {
                const sound = new Audio();
                // 优先使用本地声音文件，如果不存在则使用CDN
                sound.src = './sounds/muyu.mp3';
                sound.onerror = () => {
                    // 如果本地文件加载失败，使用CDN
                    sound.src = 'https://cdn.jsdelivr.net/gh/Jogiter/assets@main/audio/muyu.mp3';
                };
                sound.load();
                this.soundPool.push(sound);
            }
        },
        // 播放音效
        play() {
            // 查找一个未播放的音效实例
            const availableSound = this.soundPool.find(sound => sound.paused);
            if (availableSound) {
                availableSound.currentTime = 0;
                availableSound.play().catch(err => console.error('播放音效失败:', err));
            } else {
                // 如果所有实例都在播放，创建一个新实例
                const newSound = new Audio();
                newSound.src = this.soundPool[0].src;
                newSound.play().catch(err => console.error('播放音效失败:', err));
                this.soundPool.push(newSound);
            }
        }
    };
    
    // 初始化音效池
    soundManager.init();
    
    // 智慧语录
    const wisdomPhrases = [
        "善念起，福报生。",
        "一念放下，万般自在。",
        "心若简单，世界则简单。",
        "修心不如修德，修德不如行善。",
        "心中有佛，处处是净土。",
        "心静自然清，心清意自明。",
        "与人方便，自己方便。",
        "心中安静，世界就会安静。",
        "心中有爱，处处是天堂。",
        "心中有光，何惧黑暗。",
        "心中有佛，口中有德。",
        "心中有爱，手中有善。",
        "心中有光，脚下有路。",
        "心中有善，举手投足皆是福。",
        "心中有爱，举手投足皆是善。"
    ];
    

    // 从服务器获取当前功德数
    try {
        console.log('开始从服务器获取功德数...');
        // 使用相对路径，让浏览器自动处理域名
        const response = await fetch('/api/merit');
        const data = await response.json();
        console.log('服务器返回数据:', data);
        
        if (data.success && data.merit !== undefined) {
            merit = data.merit;
            meritCount.textContent = merit;
            console.log('成功更新功德数:', merit);
        } else {
            console.error('服务器返回数据格式错误:', data);
            // 如果请求失败，至少显示初始功德为0
            meritCount.textContent = '0';
        }
    } catch (error) {
        console.error('获取功德数失败:', error);
    }
    
    // 在点击位置显示功德消息
    const showMeritAtPosition = (amount, x, y) => {
        // 创建新的功德提示元素
        const popup = document.createElement('div');
        popup.className = 'merit-popup';
        popup.textContent = `功德 +${amount}`;
        
        // 设置位置
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        
        // 添加到页面
        document.body.appendChild(popup);
        
        // 动画结束后移除元素
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 1500);
    };
    
    // 在木鱼右下方显示功德消息
    const showMeritAtWoodenFish = (amount) => {
        // 获取木鱼元素的位置
        const woodenfishRect = woodenfish.getBoundingClientRect();
        const x = woodenfishRect.right - 80; // 距离右边缘100px
        const y = woodenfishRect.bottom - 75; // 距离底部50px
        
        showMeritAtPosition(amount, x, y);
    };
    
    // 敲击木鱼的函数
    const hitWoodenFish = async (event) => {
        // 播放音效
        soundManager.play();
        
        // 木鱼动画
        woodenfishImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            woodenfishImg.style.transform = 'scale(1)';
        }, 100);
        
        // 计算获得的功德
        let gainedMerit = 1;
        const luckyChance = Math.random();
        
        // 0.5% 的概率获得额外功德
        if (luckyChance < 0.005) {
            gainedMerit = Math.floor(Math.random() * 100) + 1;
        }
        
        // 如果是鼠标点击，在点击位置显示功德
        if (event && event.clientX) {
            showMeritAtPosition(gainedMerit, event.clientX, event.clientY);
        } else {
            // 如果是键盘触发，在木鱼右下方显示
            showMeritAtWoodenFish(gainedMerit);
        }
        
        // 更新功德计数
        merit += gainedMerit;
        meritCount.textContent = merit;
        
        // 随机显示智慧语录
        const randomIndex = Math.floor(Math.random() * wisdomPhrases.length);
        wisdomText.textContent = wisdomPhrases[randomIndex];
        
        // 将功德数发送到服务器
        try {
            console.log('准备发送功德数到服务器:', merit);
            // 使用相对路径，让浏览器自动处理域名
            const response = await fetch('/api/merit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ merit }),
            });
            const data = await response.json();
            console.log('服务器响应:', data);
            
            if (!data.success) {
                console.error('保存功德数失败:', data.error);
            }
        } catch (error) {
            console.error('保存功德数失败:', error);
        }
    };
    
    // 点击木鱼事件
    woodenfish.addEventListener('click', hitWoodenFish);
    
    // 添加键盘快捷键
    let keyDownTime = 0;
    const KEY_REPEAT_DELAY = 50; // 50毫秒的重复延迟
    
    document.addEventListener('keydown', (event) => {
        // 空格键或回车键
        if (event.code === 'Space' || event.code === 'Enter') {
            // 防止页面滚动
            event.preventDefault();
            
            // 检查是否是新的按键按下
            const now = Date.now();
            if (now - keyDownTime > KEY_REPEAT_DELAY) {
                keyDownTime = now;
                hitWoodenFish();
            }
        }
    });
});