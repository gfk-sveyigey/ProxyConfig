function generateRandomHex(length) {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}


if ($request.method !== "POST") {
    $done({});
}

if ($request.path == "/api/v1.0/cdk/game/submit-simple") {
    const modifiedStatus = "HTTP/1.1 307 Temporary Redirect";
    const modifiedHeaders = {};
    const reqBody = JSON.parse($request.body);

    if (reqBody.gift_code.toLowerCase().startsWith("fake")) {
        modifiedHeaders.Location = "https://poster-api.xd.cn/fake";
    } else {
        modifiedHeaders.Location = "https://poster-api.xd.cn/direction";
    }

    $done({
        status: modifiedStatus,
        headers: modifiedHeaders
    });
}

if ($request.path == "/direction") {
    $done({
        path: "/api/v1.0/cdk/game/submit-simple"
    });
}

if ($request.path == "/fake") {
    let res;
    let reqBody;
    let giftCode;

    try {
        reqBody = JSON.parse($request.body);
        giftCode = reqBody.gift_code || "fake";
        giftCode = giftCode.substring(4);

        const mockData = [];

        if (!giftCode) {
            throw new Error("无效兑换码");
        }

        const groups = giftCode.split('..');
        for (const group of groups) {
            if (!group || !group.trim()) {
                continue;
            }

            const parts = group.trim().split('.');
            if (parts.length !== 2) {
                continue;
            }

            const namePart = parts[0].trim();
            const number = parseInt(parts[1]);

            if (isNaN(number) || number <= 0) {
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
                    }
                }
            } else {
                mockData.push({
                    name: namePart,
                    number: number
                });
            }
        }
				
				if (mockData.length == 0) {
					  throw new Error("无效兑换码");
				}

        const responseBody = {
            activity_id: "TDS20260812151632J4I",
            custom: {},
            error: 0,
            nonce_str: generateRandomHex(3).toUpperCase(),
            success: true,
            c_sign: generateRandomHex(40),
            content: JSON.stringify(mockData),
            content_obj: mockData,
            sign: reqBody.sign || '',
            timestamp: reqBody.timestamp || Math.floor(Date.now() / 1000)
        };

        // 返回伪造响应
        res = {
            status: "HTTP/1.1 200 OK",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responseBody)
        };

    } catch (error) {
        res = {
            status: "HTTP/1.1 307 Temporary Redirect",
            headers: {
                "Location": "https://poster-api.xd.cn/direction"
            }
        };
    } finally {
        $done(res);
    }
}
