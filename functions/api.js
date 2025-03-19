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
    // 打印环境信息用于调试
    console.log('请求URL:', request.url);
    console.log('环境信息:', Object.keys(env));

    // 获取功德数
    if (request.method === 'GET') {
      try {
        console.log('开始获取功德数...');
        
        // 检查数据库连接
        if (!env.DB) {
          console.error('数据库连接未初始化');
          // 如果数据库未连接，返回默认值
          return new Response(JSON.stringify({ 
            success: true, 
            merit: 0,
            source: 'default'
          }), { headers });
        }
        
        // 查询D1数据库
        try {
          console.log('准备执行查询...');
          const stmt = env.DB.prepare('SELECT merit FROM merit_counter WHERE id = 1');
          const result = await stmt.first();
          console.log('查询结果:', result);
          
          let merit = 0;
          if (result) {
            merit = result.merit;
            console.log('从数据库获取到功德数:', merit);
          } else {
            console.log('数据库中没有记录，创建新记录...');
            try {
              // 如果数据库中没有数据，创建记录
              await env.DB.prepare('INSERT INTO merit_counter (id, merit, last_updated) VALUES (1, 0, CURRENT_TIMESTAMP)').run();
              console.log('新记录创建成功');
            } catch (insertError) {
              console.error('创建记录失败:', insertError);
              // 如果创建记录失败，返回默认值
              return new Response(JSON.stringify({ 
                success: true, 
                merit: 0,
                source: 'default_after_insert_error'
              }), { headers });
            }
          }
          
          return new Response(JSON.stringify({ 
            success: true, 
            merit,
            source: 'database'
          }), { headers });
        } catch (dbError) {
          console.error('数据库操作失败:', dbError);
          // 如果数据库操作失败，返回默认值
          return new Response(JSON.stringify({ 
            success: true, 
            merit: 0,
            source: 'default_after_db_error'
          }), { headers });
        }
      } catch (error) {
        console.error('获取功德数失败:', error);
        // 在错误情况下也返回有效响应，确保前端能继续工作
        return new Response(JSON.stringify({ 
          success: true, 
          merit: 0,
          error: error.message,
          source: 'error_fallback'
        }), { headers });
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
          console.error('数据库连接未初始化');
          // 如果数据库未连接，返回成功但记录未持久化
          return new Response(JSON.stringify({ 
            success: true, 
            merit,
            persisted: false
          }), { headers });
        }
        
        // 更新D1数据库
        try {
          console.log('准备执行更新...');
          await env.DB.prepare('UPDATE merit_counter SET merit = ?, last_updated = CURRENT_TIMESTAMP WHERE id = 1')
            .bind(merit)
            .run();
          console.log('更新成功');
          
          return new Response(JSON.stringify({ 
            success: true, 
            merit,
            persisted: true
          }), { headers });
        } catch (dbError) {
          console.error('数据库更新失败:', dbError);
          // 如果数据库更新失败，返回成功但记录未持久化
          return new Response(JSON.stringify({ 
            success: true, 
            merit,
            persisted: false,
            error: dbError.message
          }), { headers });
        }
      } catch (error) {
        console.error('更新功德数失败:', error);
        // 在错误情况下返回错误信息
        return new Response(JSON.stringify({ 
          success: false, 
          error: '更新功德数失败',
          details: error.message
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