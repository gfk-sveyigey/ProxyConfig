// Quantumult X 请求拦截脚本
// 使用 script-request-header 类型

if ($request) {
    console.log('=== 请求拦截开始 ===');
    console.log('原始URL:', $request.url);
    console.log('请求方法:', $request.method);
    console.log('请求头:', JSON.stringify($request.headers));
    console.log('请求体:', $request.body);
    
    // 解析请求体
    let requestBody = {};
    try {
        requestBody = JSON.parse($request.body || '{}');
    } catch (e) {
        console.log('请求体解析失败，使用空对象');
        requestBody = {};
    }
    
    // 生成随机字符串函数
    function generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    
    // 模拟响应数据
    const mockData = [
        { name: "281", number: 1 },
        { name: "282", number: 2 },
        { name: "283", number: 3 }
    ];
    
    // 构建响应体
    const responseBody = {
        activity_id: "TDS20260812151632J4I",
        custom: {},
        error: 0,
        nonce_str: generateRandomHex(3).toUpperCase(),
        success: true,
        c_sign: generateRandomHex(32),
        content: JSON.stringify(mockData),
        content_obj: mockData,
        sign: requestBody.sign || '',
        timestamp: requestBody.timestamp || Math.floor(Date.now() / 1000)
    };
    
    console.log('模拟响应数据:', JSON.stringify(responseBody));
    console.log('=== 请求拦截结束 ===');
    
    // 关键：使用 $done 返回 response 对象来阻断请求
    $done({
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        }
    });
} else {
    console.log('没有请求对象');
    $done({});
}