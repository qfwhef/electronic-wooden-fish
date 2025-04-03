document.addEventListener('DOMContentLoaded', async () => {
    const woodenfish = document.getElementById('woodenfish');
    const woodenfishImg = document.getElementById('woodenfish-img');
    const meritCount = document.getElementById('merit-count');
    const meritMessage = document.getElementById('merit-message');
    const wisdomText = document.getElementById('wisdom-text');
    
    // 初始化功德值
    let merit = 0;
    let isHitting = false; // 标记是否正在敲击，防止重复提交
    
    // 数据库操作函数
    const dbManager = {
        // 从服务器获取总功德数据
        async fetchMeritFromServer() {
            try {
                const response = await fetch('/api', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('获取总功德数据失败');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    return data.meritCount;
                } else {
                    console.error('获取总功德失败:', data.error);
                    return null;
                }
            } catch (error) {
                console.error('获取总功德数据错误:', error);
                return null;
            }
        },
        
        // 将新增功德发送到服务器
        async addMeritToServer(meritToAdd) {
            if (isHitting) return false; // 如果正在处理敲击，忽略此次提交
            
            isHitting = true; // 标记正在处理敲击
            
            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ meritToAdd })
                });
                
                if (!response.ok) {
                    throw new Error('添加功德数据失败');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    // 更新本地总功德计数
                    merit = data.meritCount;
                    meritCount.textContent = merit;
                    return true;
                } else {
                    console.error('添加功德失败:', data.error);
                    return false;
                }
            } catch (error) {
                console.error('添加功德数据错误:', error);
                return false;
            } finally {
                // 无论成功失败，完成后重置标记
                isHitting = false;
            }
        }
    };
    
    // 初始化功德，从服务器获取总功德数
    const initMerit = async () => {
        // 从服务器获取总功德
        const serverMerit = await dbManager.fetchMeritFromServer();
        
        if (serverMerit !== null) {
            // 使用服务器数据
            merit = serverMerit;
            // 显示功德值
            meritCount.textContent = merit;
        } else {
            console.error('无法获取总功德数，显示为0');
            meritCount.textContent = '0';
        }
    };
    
    // 执行初始化
    await initMerit();
    
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
    
    // 防抖函数，确保短时间内多次敲击不会发送过多请求
    const debounce = (func, wait) => {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
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
        
        // 向服务器提交新增的功德
        await dbManager.addMeritToServer(gainedMerit);
        
        // 随机显示智慧语录
        const randomIndex = Math.floor(Math.random() * wisdomPhrases.length);
        wisdomText.textContent = wisdomPhrases[randomIndex];
    };
    
    // 点击木鱼事件
    woodenfish.addEventListener('click', hitWoodenFish);
    
    // 添加键盘快捷键
    let keyDownTime = 0;
    const KEY_REPEAT_DELAY = 100; // 增加到100毫秒的重复延迟
    
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
