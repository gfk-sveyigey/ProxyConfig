// fakebc.js - 针对 bad.com 的请求处理
if ($request.url.indexOf("ad") !== -1) {
  // 拦截请求，返回空数据或自定义响应
  $done({
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      code: 0, 
      msg: "Request blocked by QX script",
      data: null 
    })
  });
}
$done({});