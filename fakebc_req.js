if ($request) {
    console.log('=== 礼包码判断开始 ===');
    console.log('请求URL:', $request.url);
    console.log('请求体:', $request.body);
    
    // 解析请求体
    let requestBody = {};
    try {
        requestBody = JSON.parse($request.body || '{}');
    } catch (e) {
        console.log('请求体解析失败');
        requestBody = {};
    }
    
    // 获取gift_code字段
    const giftCode = requestBody.gift_code || '';
    console.log('gift_code:', giftCode);
    
    // 判断是否以fake开头
    if (giftCode.toLowerCase().startsWith('fake')) {
        // 重定向到目标URL
        const redirectUrl = "https://www.baidu.com"; // 替换为你的目标URL
        
        console.log('检测到fake礼包码，重定向到:', redirectUrl);
        
        $done({
            url: redirectUrl,
            headers: $request.headers,
            body: $request.body
        });
    } else {
        // 不是fake开头，放行
        console.log('正常礼包码，放行请求');
        $done({});
    }
} else {
    console.log('没有请求对象');
    $done({});
}