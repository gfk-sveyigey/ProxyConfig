// 匹配包含"ad"的请求，返回空JSON
if ($request.url.indexOf("ad") !== -1) {
  $done({
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: "{}"
  });
}
$done({});