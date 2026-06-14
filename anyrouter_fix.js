/*
 * Anyrouter Context & Beta-Header Fix Script for Egern & Surge
 */

let url = $request.url;
let headers = $request.headers;
let body = $request.body;

console.log("[Anyrouter-Fix] 正在拦截请求: " + url);

// ==================== 核心修复 1: 移除/修改可能导致中转站报错的 anthropic-beta 头 ====================
if (headers['anthropic-beta']) {
    console.log("[Anyrouter-Fix] 检测到 anthropic-beta: " + headers['anthropic-beta'] + "，正在尝试将其移除以兼容中转站。");
    // 方案 A: 直接删除该请求头（推荐，让中转网关当成普通模型请求处理）
    delete headers['anthropic-beta'];
    
    // 方案 B: 如果删了还不行，可以取消下面这行的注释，尝试将其改写为中转站更常兼容的原始 max-tokens 声明
    // headers['anthropic-beta'] = 'max-tokens-32k-welcomed-2024-01-09';
}

// 2. 预防性处理：拦截并篡改可能存在的自定义请求头 (Headers)
if (headers['max-context']) {
    headers['max-context'] = '1M';
}
if (headers['X-Max-Context']) {
    headers['X-Max-Context'] = '1M';
}

// ==================== 核心修复 2: 拦截并篡改请求体 (Body) ====================
if (body) {
    try {
        let obj = JSON.parse(body);
        let changed = false;

        // 如果 OpenMinis 里设置了数字 1000000
        if (obj.max_tokens === 1000000 || obj.max_tokens === '1000000') {
            obj.max_tokens = "1M";
            changed = true;
            console.log("[Anyrouter-Fix] 成功捕获数字 1000000，已篡改为字符串 '1M'");
        }

        // 兼容处理可能携带在 metadata 或 options 里的参数
        if (obj.metadata && (obj.metadata.max_tokens === 1000000 || obj.metadata.max_tokens === '1000000')) {
            obj.metadata.max_tokens = "1M";
            changed = true;
        }
        if (obj.options && (obj.options.max_tokens === 1000000 || obj.options.max_tokens === '1000000')) {
            obj.options.max_tokens = "1M";
            changed = true;
        }

        if (changed) {
            body = JSON.stringify(obj);
        }
    } catch (e) {
        console.log("[Anyrouter-Fix] 解析 JSON Body 失败: " + e);
    }
}

$done({ headers, body });
