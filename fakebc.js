if ($response) {
    console.log('=== 响应修改开始 ===');
    console.log('原始状态:', $response.status);
    console.log('原始响应体:', $response.body);
    
    // 解析请求体
    let requestBody = {};
    try {
        requestBody = JSON.parse($request.body || '{}');
        console.log('请求体:', JSON.stringify(requestBody));
    } catch (e) {
        console.log('请求体解析失败');
    }
    
    const giftCode = (requestBody.gift_code || '').toString();
    console.log('gift_code:', giftCode);
    
    if (!giftCode.toLowerCase().startsWith('fake')) {
        console.log('非fake，返回原始响应');
        $done({});
        return;
    }
    
    console.log('检测到fake兑换码');
    
    // 生成随机字符串
    function generateRandomHex(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    
    // 解析 mock 数据
    function parseMockData(giftCode) {
        const mockData = [];
        const dataStr = giftCode.substring(4);
        
        if (!dataStr) return mockData;
        
        const groups = dataStr.split('..');
        console.log('分割后的组:', groups);
        
        for (const group of groups) {
            if (!group || !group.trim()) continue;
            
            const parts = group.trim().split('.');
            if (parts.length !== 2) {
                console.log('跳过无效格式:', group);
                continue;
            }
            
            const namePart = parts[0].trim();
            const number = parseInt(parts[1]);
            
            if (isNaN(number) || number <= 0) {
                console.log('跳过无效数字:', group);
                continue;
            }
            
            if (namePart.includes('-')) {
                const rangeParts = namePart.split('-');
                if (rangeParts.length === 2) {
                    const start = parseInt(rangeParts[0]);
                    const end = parseInt(rangeParts[1]);
                    
                    if (!isNaN(start) && !isNaN(end) && start <= end) {
                        for (let i = start; i <= end; i++) {
                            mockData.push({ 
                                name: String(i), 
                                number: number 
                            });
                        }
                        console.log(`添加范围 ${start}-${end}, 数量 ${number}`);
                    }
                }
            } else {
                mockData.push({ 
                    name: namePart, 
                    number: number 
                });
                console.log(`添加 ${namePart}, 数量 ${number}`);
            }
        }
        
        return mockData;
    }
    
    const mockData = parseMockData(giftCode);
    console.log('生成的mock数据:', JSON.stringify(mockData));
    
    if (mockData.length === 0) {
        console.log('mock数据为空');
        $done({});
        return;
    }
    
    // 构建响应体
    const responseBody = {
        activity_id: "TDS20260812151632J4I",
        custom: {},
        error: 0,
        nonce_str: generateRandomHex(3).toUpperCase(),
        success: true,
        c_sign: generateRandomHex(40),
        content: JSON.stringify(mockData),
        content_obj: mockData,
        sign: requestBody.sign || '',
        timestamp: requestBody.timestamp || Math.floor(Date.now() / 1000)
    };
    
    console.log('修改后的响应:', JSON.stringify(responseBody, null, 2));
    console.log('=== 响应修改结束 ===');
    
    // 强制返回 200
    $done({
        status: 200,
        headers: {
            ...$response.headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(responseBody)
    });
    
} else {
    console.log('无响应对象');
    $done({});
}