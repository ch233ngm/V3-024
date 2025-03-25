export const config = {
    runtime: 'edge'  // 添加这个配置
};

export async function onRequest(context) {
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': context.env.ENVIRONMENT === 'production' 
            ? 'https://v3-0324.info' 
            : '*',
        'Access-Control-Allow-Methods': 'POST',
        'X-Content-Type-Options': 'nosniff'
    };

    // 检查请求方法
    if (context.request.method !== 'POST') {
        return new Response('Method not allowed', {
            status: 405,
            headers
        });
    }

    try {
        // 检查是否设置了环境变量
        if (!context.env.OPENROUTER_API_KEY) {
            throw new Error('API key not configured');
        }

        // 获取请求体
        const requestData = await context.request.json();
        
        // 检查是否请求流式响应
        const isStreaming = requestData.stream === true;
        
        // 调用 OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${context.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://v3-0324.info',
                'X-Title': 'DeepSeek V3 0324 Demo',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: requestData.model,
                messages: requestData.messages,
                stream: isStreaming // 添加流式响应参数
            })
        });
        
        // 如果是流式响应，直接返回流
        if (isStreaming) {
            return new Response(response.body, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': context.env.ENVIRONMENT === 'production' 
                        ? 'https://v3-0324.info' 
                        : '*',
                }
            });
        }
        
        // 非流式响应处理
        const data = await response.json();
        return new Response(JSON.stringify(data), { headers });

    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers
        });
    }
}