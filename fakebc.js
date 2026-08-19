// 在脚本开头添加检查
if (typeof $request === 'undefined' || !$request.url) {
  // 如果没有$request对象，直接放行
  $done({});
}

// 后续代码
if ($request && $request.url && $request.url.indexOf("bad.com") !== -1) {
  $done({
    status: 200,
    body: "{}"
  });
}
$done({});