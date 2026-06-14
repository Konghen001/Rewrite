/*
 * Anyrouter Content-Type & Body Clean Script
 */

let url = $request.url;
let headers = $request.headers;
let body = $request.body;

console.log("[Anyrouter-Fix] 拦截到请求，当前 Body 长度: " + (body ? body.length : 0));

// 1. 彻底清理干扰 Header
if (headers['anthropic-beta']) delete headers['anthropic-beta'];
if (headers['max-context']) delete headers['max-context'];
if (headers['X-Max-Context']) delete headers['X-Max-Context'];

// 2. 深入解析并清洗加密/庞大的 Body
if (body) {
    try {
        let obj = JSON.parse(body);
        
        // 【关键调试】：在日志中打印整个请求体，方便在 Egern 的文本日志里查看 OpenMinis 到底发了什么
        console.log("[Anyrouter-Fix] 原始 Body 内容: " + JSON.stringify(obj));

        let changed = false;

        // 强行检查并规范化 max_tokens 字段
        if (obj.max_tokens) {
            console.log("[Anyrouter-Fix] 发现原始 max_tokens 为: " + obj.max_tokens);
            // 无论客户端发的是 1000000 还是 4096，直接强行改成中转网关想要的字符串 "1M"
            obj.max_tokens = "1M";
            changed = true;
        } else {
            // 如果客户端根本没发 max_tokens，网关可能因此报错，我们帮它补上
            obj.max_tokens = "1M";
            changed = true;
        }

        // 【安全清洗】：删除 OpenMinis 可能自带的、会导致中转站网关解析崩溃的自定义非标准字段
        // 比如某些客户端会自带 options, extra, client_info 等
        const allowedKeys = ['model', 'messages', 'max_tokens', 'system', 'stream', 'temperature', 'top_p', 'top_k', 'tools', 'tool_choice', 'thinking'];
        
        for (let key in obj) {
            if (!allowedKeys.includes(key)) {
                console.log("[Anyrouter-Fix] 正在移除客户端私货字段: " + key);
                delete obj[key];
                changed = true;
            }
        }

        if (changed) {
            body = JSON.stringify(obj);
            // 重新计算并更新 content-length，防止因长度不符引发 400 错误
            headers['content-length'] = String(body.length); 
        }
    } catch (e) {
        console.log("[Anyrouter-Fix] JSON 解析失败: " + e);
    }
}

$done({ headers, body });
