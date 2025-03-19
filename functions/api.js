/**
 * 电子木鱼API
 * 处理功德数的获取和更新
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');

  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // 处理OPTIONS请求（预检请求）
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // 处理功德相关的API
  if (path === 'merit') {
    // 获取功德数
    if (request.method === 'GET') {
      try {
        console.log('开始获取功德数...');
        
        // 检查数据库连接
        if (!env.DB) {
          throw new Error('数据库连接未初始化');
        }
        
        // 查询D1数据库
        const stmt = env.DB.prepare('SELECT merit FROM merit_counter WHERE id = 1');
        console.log('准备执行查询...');
        
        const result = await stmt.first();
        console.log('查询结果:', result);
        
        let merit = 0;
        if (result) {
          merit = result.merit;
          console.log('从数据库获取到功德数:', merit);
        } else {
          console.log('数据库中没有记录，创建新记录...');
          // 如果数据库中没有数据，创建记录
          const insertStmt = env.DB.prepare('INSERT INTO merit_counter (id, merit) VALUES (1, 0)');
          await insertStmt.run();
          console.log('新记录创建成功');
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          merit 
        }), { headers });
      } catch (error) {
        console.error('获取功德数失败:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: '获取功德数失败',
          details: error.message,
          stack: error.stack
        }), { 
          status: 500, 
          headers 
        });
      }
    }
    
    // 更新功德数
    if (request.method === 'POST') {
      try {
        const data = await request.json();
        const merit = data.merit || 0;
        console.log('准备更新功德数为:', merit);
        
        // 检查数据库连接
        if (!env.DB) {
          throw new Error('数据库连接未初始化');
        }
        
        // 更新D1数据库
        const updateStmt = env.DB.prepare('UPDATE merit_counter SET merit = ? WHERE id = 1');
        console.log('准备执行更新...');
        
        await updateStmt.bind(merit).run();
        console.log('更新成功');
        
        return new Response(JSON.stringify({ 
          success: true, 
          merit 
        }), { headers });
      } catch (error) {
        console.error('更新功德数失败:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          error: '更新功德数失败',
          details: error.message,
          stack: error.stack
        }), { 
          status: 500, 
          headers 
        });
      }
    }
  }
  
  // 处理未知路径
  return new Response(JSON.stringify({ 
    success: false, 
    error: '未找到API路径' 
  }), { 
    status: 404, 
    headers 
  });
} 
