if ($response) {
    console.log('=== 响应修改开始 ===');
    console.log('请求URL:', $request.url);
    console.log('原始响应状态:', $response.status);
    
    // 模拟数据
    const mockData = [
        { name: "281", number: 1 }
    ];
    
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
    
    console.log('修改后的响应:', JSON.stringify(responseBody));
    console.log('=== 响应修改结束 ===');
    
    // 返回修改后的响应
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify(responseBody)
    });
} else {
    console.log('没有响应对象');
    $done({});
}