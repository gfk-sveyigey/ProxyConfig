if ($response) {
    // 收集调试信息
    let debugInfo = [];
    debugInfo.push('=== 调试开始 ===');
    debugInfo.push('URL: ' + $request.url);
    debugInfo.push('Method: ' + $request.method);
    debugInfo.push('Request Body: ' + ($request.body || '空'));
    debugInfo.push('Response Status: ' + $response.status);
    debugInfo.push('Response Body (前200字符): ' + $response.body.substring(0, 200));
    
    // 发送通知显示调试信息
    $notification.post('QX脚本调试', '请求信息', debugInfo.join('\n'));
    
    // 模拟数据
    const mockData = [
        { name: "281", number: 1 }
    ];
    
    // 解析请求体
    let requestBody = {};
    if ($request.body) {
        try {
            requestBody = JSON.parse($request.body);
            $notification.post('QX脚本调试', '请求体解析成功', JSON.stringify(requestBody));
        } catch (e) {
            $notification.post('QX脚本调试', '请求体解析失败', $request.body);
        }
    }
    
    // 生成随机字符串
    function generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    
    // 构建响应
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
    
    // 最终通知
    $notification.post('QX脚本调试', '响应修改完成', '状态码: 200\n响应体: ' + JSON.stringify(responseBody).substring(0, 200));
    
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify(responseBody)
    });
} else {
    $notification.post('QX脚本调试', '错误', '没有响应对象');
    $done({});
}