if ($response) {
    console.log('=== 响应修改开始 ===');
    console.log('请求URL:', $request.url);
    console.log('原始响应状态:', $response.status);
    
    // 解析请求体
    let requestBody = {};
    try {
        requestBody = JSON.parse($request.body || '{}');
    } catch (e) {
        console.log('请求体解析失败，使用空对象');
        requestBody = {};
    }
    
    // 检查 gift_code 是否以 "fake" 开头
    const giftCode = requestBody.gift_code || '';
    if (!giftCode.startsWith('fake')) {
        console.log('gift_code 不以 fake 开头，跳过修改');
        $done({});
        return;
    }
    
    console.log('检测到 fake gift_code:', giftCode);
    
    // 生成随机字符串函数
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
        
        // 去掉 fake 前缀，按 / 分割
        const groupsStr = giftCode.substring(4); // 去掉 "fake"
        if (!groupsStr) {
            return mockData;
        }
        
        const groups = groupsStr.split('/');
        
        for (const group of groups) {
            if (!group) continue; // 跳过空字符串
            
            // 按 . 分割 name 和 number
            const parts = group.split('.');
            if (parts.length !== 2) {
                console.log('跳过无效格式:', group);
                continue;
            }
            
            const namePart = parts[0];
            const number = parseInt(parts[1]);
            
            if (isNaN(number)) {
                console.log('跳过无效数字:', group);
                continue;
            }
            
            // 检查是否有范围格式（如 145-147）
            if (namePart.includes('-')) {
                const rangeParts = namePart.split('-');
                if (rangeParts.length === 2) {
                    const start = parseInt(rangeParts[0]);
                    const end = parseInt(rangeParts[1]);
                    
                    if (!isNaN(start) && !isNaN(end) && start <= end) {
                        // 生成范围内的所有 name
                        for (let i = start; i <= end; i++) {
                            mockData.push({ name: String(i), number: number });
                        }
                    } else {
                        console.log('跳过无效范围:', group);
                    }
                }
            } else {
                // 单个 name
                mockData.push({ name: namePart, number: number });
            }
        }
        
        return mockData;
    }
    
    // 解析 mock 数据
    const mockData = parseMockData(giftCode);
    console.log('生成的 mock 数据:', JSON.stringify(mockData));
    
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