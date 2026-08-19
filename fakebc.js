// 简化测试版本
if ($response) {
    console.log('脚本执行成功');
    console.log('URL:', $request.url);
    
    // 解析请求体
    let requestBody = {};
    try {
        requestBody = JSON.parse($request.body || '{}');
        console.log('请求体:', JSON.stringify(requestBody));
    } catch (e) {
        console.log('解析失败:', e);
    }
    
    // 简单修改响应
    let modifiedBody = $response.body;
    try {
        const originalData = JSON.parse($response.body);
        console.log('原始响应:', JSON.stringify(originalData));
        
        // 这里可以添加你的修改逻辑
        // 暂时返回原始响应加标记
        originalData._test = "脚本已执行";
        modifiedBody = JSON.stringify(originalData);
    } catch (e) {
        console.log('响应解析失败，使用原始响应');
    }
    
    $done({
        status: 200,
        headers: $response.headers,
        body: modifiedBody
    });
} else {
    console.log('无响应对象');
    $done({});
}