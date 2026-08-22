if ($request.path === "/push") {
    try {
        const reqBody = JSON.parse($request.body)
        const archive = reqBody.text
        $prefs.setValueForKey(archive, "archive")
        $notify("百层深渊", "存档", "本地备份已更新。")
    } catch (e) {
        $notify("百层深渊", "存档", "本地备份失败：" + e.message)
    }
    $done({})
}

if ($request.path === "/pull") {
    try {
        const resBody = JSON.parse($response.body)
        if (resBody.errorCode && resBody.errorCode != 0) {
            throw new Error("在线存档异常。")
        }
        const archive = $prefs.valueForKey("archive")
        if (archive) {
            resBody.text = archive
            $notify("百层深渊", "读档", "已替换为本地存档。")
        } else {
            $notify("百层深渊", "读档", "无本地存档，仍读取在线存档。")
        }
        $done({body: resBody})
    } catch (e) {
        $notify("百层深渊", "读档", "读档失败: " + e.message)
        $done({})
    }
    return
}

$done({})