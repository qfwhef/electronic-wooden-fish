// 生成唯一的用户ID
function generateUserId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// 获取用户ID
function getUserId(request) {
  // 从Cookie中获取用户ID
  const cookies = request.headers.get('Cookie') || '';
  const userCookie = cookies.split('; ').find(c => c.startsWith('userId='));
  let userId = userCookie ? userCookie.split('=')[1] : null;
  
  // 如果没有用户ID，创建一个新的
  if (!userId) {
    userId = generateUserId();
  }
  
  return userId;
}

// 设置Cookie
function setCookie(response, userId) {
  // 设置Cookie过期时间为一年
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  
  // 添加Cookie到响应头
  response.headers.set('Set-Cookie', `userId=${userId}; Expires=${expires.toUTCString()}; Path=/; SameSite=Strict`);
}

// 获取用户功德数据
export async function onRequestGet(context) {
  const { request, env } = context;
  
  // 获取用户ID
  const userId = getUserId(request);
  
  try {
    // 查询数据库中的用户功德记录
    const stmt = await env.DB.prepare(
      'SELECT merit_count FROM merit_records WHERE user_id = ?'
    ).bind(userId);
    
    const result = await stmt.first();
    
    // 准备响应
    const data = {
      userId,
      meritCount: result ? result.merit_count : 0,
      success: true
    };
    
    // 创建响应
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // 设置Cookie
    setCookie(response, userId);
    
    return response;
  } catch (error) {
    // 处理错误
    console.error('获取功德数据失败:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: '获取功德数据失败' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// 更新用户功德数据
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // 获取用户ID
  const userId = getUserId(request);
  
  try {
    // 解析请求体
    const data = await request.json();
    const meritCount = parseInt(data.meritCount, 10);
    
    if (isNaN(meritCount)) {
      throw new Error('无效的功德数值');
    }
    
    // 更新或插入用户功德记录
    const stmt = await env.DB.prepare(`
      INSERT INTO merit_records (user_id, merit_count, last_updated)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE
      SET merit_count = ?, last_updated = CURRENT_TIMESTAMP
    `).bind(userId, meritCount, meritCount);
    
    await stmt.run();
    
    // 创建响应
    const response = new Response(
      JSON.stringify({ success: true, userId, meritCount }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // 设置Cookie
    setCookie(response, userId);
    
    return response;
  } catch (error) {
    // 处理错误
    console.error('更新功德数据失败:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: '更新功德数据失败' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 