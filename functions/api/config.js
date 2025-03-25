export async function onRequest(context) {
    // 添加 CORS 和安全头
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': context.env.ENVIRONMENT === 'production' 
            ? 'https://v3-0324.info' 
            : '*',
        'Access-Control-Allow-Methods': 'GET',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
    };

    // 检查请求方法
    if (context.request.method !== 'GET') {
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

        // 返回 API key
        return new Response(
            JSON.stringify({
                apiKey: context.env.OPENROUTER_API_KEY
            }), 
            { headers }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: 'Internal server error'
            }), 
            {
                status: 500,
                headers
            }
        );
    }
}