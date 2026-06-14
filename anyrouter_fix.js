/*
 * Anyrouter Max_Tokens 1M Hard-Fix Script
 * 适用客户端：OpenMinis / 适用中转站：Anyrouter.top
 */

let url = $request.url;
let headers = $request.headers;
let body = $request.body;

console.log("[Anyrouter-Fix] 正在拦截请求进行 1M 上下文强修...");

// 1. 清理干扰 Header
if (headers['anthropic-beta']) delete headers['anthropic-beta'];
if (headers['max-context']) {
    headers['max-context'] = '1M';
}
if (headers['X-Max-Context']) {
    headers['X-Max-Context'] = '1M';
}
// 2. 核心：强行修改 Body 中的 max_tokens
if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 打印修改前的值
        console.log("[Anyrouter-Fix] 原始 max_tokens 值为: " + obj.max_tokens);

        // 【核心修改点】不管客户端传过来的是 32000 还是多少，一律强行覆盖为 1,000,000
        // 如果网关要的是纯数字 1M，这就直接对齐了
        obj.max_tokens = “1M”; 
        obj.metadata.max_tokens = "1M";
        obj.options.max_tokens = "1M";  



        // 备用方案：如果网关设计奇葩非要字符串 "1M"，可以把上面那行加双引号，即：obj.max_tokens = "1M";
        
        // 顺便规范清理 OpenMinis 夹带的、可能干扰网关的客户端专属参数
        if (obj.output_config) {
            console.log("[Anyrouter-Fix] 移除非标参数 output_config");
            delete obj.output_config;
        }

        body = JSON.stringify(obj);
        
        // 重新计算内容长度，防止 400 错误
        headers['content-length'] = String(body.length);
        console.log("[Anyrouter-Fix] Body 强修成功，新 max_tokens: " + obj.max_tokens + ", 新长度: " + headers['content-length']);

    } catch (e) {
        console.log("[Anyrouter-Fix] JSON 解析或强修失败: " + e);
    }
}

$done({ headers, body });
