document.addEventListener('DOMContentLoaded', async () => {
    const woodenfish = document.getElementById('woodenfish');
    const woodenfishImg = document.getElementById('woodenfish-img');
    const meritCount = document.getElementById('merit-count');
    const meritMessage = document.getElementById('merit-message');
    const wisdomText = document.getElementById('wisdom-text');
    
    // 音效
    const hitSound = new Audio();
    hitSound.src = 'https://cdn.jsdelivr.net/gh/Jogiter/assets@main/audio/muyu.mp3';
    
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
    
    // 初始化功德计数
    let merit = 0;
    
    // 从服务器获取当前功德数
    try {
        const response = await fetch('/api/merit');
        const data = await response.json();
        if (data.success && data.merit !== undefined) {
            merit = data.merit;
            meritCount.textContent = merit;
        }
    } catch (error) {
        console.error('获取功德数失败:', error);
    }
    
    // 点击木鱼事件
    woodenfish.addEventListener('click', async () => {
        // 播放音效
        hitSound.currentTime = 0;
        hitSound.play();
        
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
            
            // 显示特殊消息
            meritMessage.textContent = `+${gainedMerit} 功德!`;
            meritMessage.classList.add('show');
            
            // 移除动画类以便下次触发
            setTimeout(() => {
                meritMessage.classList.remove('show');
            }, 2000);
        }
        
        // 更新功德计数
        merit += gainedMerit;
        meritCount.textContent = merit;
        
        // 随机显示智慧语录
        const randomIndex = Math.floor(Math.random() * wisdomPhrases.length);
        wisdomText.textContent = wisdomPhrases[randomIndex];
        
        // 将功德数发送到服务器
        try {
            await fetch('/api/merit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ merit }),
            });
        } catch (error) {
            console.error('保存功德数失败:', error);
        }
    });
}); 