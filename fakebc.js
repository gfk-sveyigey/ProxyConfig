// 百层试炼作弊脚本
if ($response) {
    console.log('=== 响应修改开始 ===');
    console.log('请求URL:', $request.url);
    
    // 解析请求体
    let requestBody = {};
    try {
        requestBody = JSON.parse($request.body || '{}');
        console.log('请求体:', JSON.stringify(requestBody));
    } catch (e) {
        console.log('请求体解析失败:', e);
        requestBody = {};
    }
    
    // 检查 gift_code 是否以 "fake" 开头
    const giftCode = (requestBody.gift_code || '').toString();
    console.log('gift_code:', giftCode);
    
    if (!giftCode.toLowerCase().startsWith('fake')) {
        console.log('gift_code 不以 fake 开头，返回原始响应');
        $done($response);
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
        
        // 去掉 fake 前缀（不区分大小写）
        const groupsStr = giftCode.substring(4);
        if (!groupsStr) {
            console.log('gift_code 只有 fake 前缀，无数据');
            return mockData;
        }
        
        console.log('解析数据部分:', groupsStr);
        
        // 使用 .. 作为组分隔符
        const groups = groupsStr.split('..');
        console.log('分割后的组:', groups);
        
        for (const group of groups) {
            if (!group || !group.trim()) continue;
            
            // 按 . 分割 name 和 number
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
            
            // 检查是否有范围格式（如 145-147）
            if (namePart.includes('-')) {
                const rangeParts = namePart.split('-');
                if (rangeParts.length === 2) {
                    const start = parseInt(rangeParts[0]);
                    const end = parseInt(rangeParts[1]);
                    
                    if (!isNaN(start) && !isNaN(end) && start <= end) {
                        for (let i = start; i <= end; i++) {
                            mockData.push({ name: String(i), number: number });
                        }
                        console.log(`添加范围 ${start}-${end}，数量 ${number}`);
                    } else {
                        console.log('跳过无效范围:', group);
                    }
                }
            } else {
                mockData.push({ name: namePart, number: number });
                console.log(`添加单项 ${namePart}，数量 ${number}`);
            }
        }
        
        return mockData;
    }
    
    // 解析 mock 数据
    const mockData = parseMockData(giftCode);
    console.log('生成的 mock 数据:', JSON.stringify(mockData));
    
    if (mockData.length === 0) {
        console.log('mock 数据为空，返回原始响应');
        $done($response);
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