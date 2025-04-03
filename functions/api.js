// 获取总功德数据
export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // 查询数据库中的总功德记录
    const stmt = await env.DB.prepare(
      'SELECT merit_count FROM total_merit WHERE id = 1'
    );
    
    const result = await stmt.first();
    
    // 准备响应
    const data = {
      meritCount: result ? result.merit_count : 0,
      success: true
    };
    
    // 创建响应
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  } catch (error) {
    // 处理错误
    console.error('获取总功德数据失败:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: '获取总功德数据失败' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// 更新总功德数据
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 解析请求体
    const data = await request.json();
    const meritToAdd = parseInt(data.meritToAdd, 10) || 1; // 默认增加1点功德
    
    if (isNaN(meritToAdd)) {
      throw new Error('无效的功德数值');
    }
    
    // 获取当前总功德数
    const getStmt = await env.DB.prepare(
      'SELECT merit_count FROM total_merit WHERE id = 1'
    );
    
    const currentMerit = await getStmt.first();
    const newMeritCount = (currentMerit ? currentMerit.merit_count : 0) + meritToAdd;
    
    // 更新总功德记录
    const updateStmt = await env.DB.prepare(`
      UPDATE total_merit
      SET merit_count = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = 1
    `).bind(newMeritCount);
    
    await updateStmt.run();
    
    // 创建响应
    return new Response(
      JSON.stringify({ 
        success: true, 
        meritCount: newMeritCount,
        meritAdded: meritToAdd 
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    // 处理错误
    console.error('更新总功德数据失败:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: '更新总功德数据失败' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 