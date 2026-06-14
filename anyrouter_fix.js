/*
 * Anyrouter Context Fix Script for Egern & Surge
 * * 作用：修复 OpenMinis 等客户端接入 Anyrouter.top 时，由于客户端前端输入框做了纯数字限制（无法写 "1M"），
 * 导致后端强校验报错“模型已经支持1M上下文，请设置1M上下文”的问题。
 * 本脚本会自动拦截并分析请求 Body，将 1000000 动态重写为 Anyrouter 网关期待的 "1M" 字符串。
 * * 使用方法：
 * 1. 将此脚本上传至 GitHub 仓库或 GitHub Gist。
 * 2. 复制 Raw 链接（例如：https://raw.githubusercontent.com/你的用户名/仓库名/main/anyrouter_fix.js）。
 * 3. 按照下方提供的配置分别写入 Egern 或 Surge。
 */

let url = $request.url;
let headers = $request.headers;
let body = $request.body;

console.log("[Anyrouter-Fix] 正在拦截请求: " + url);

// 1. 预防性处理：拦截并篡改可能存在的自定义请求头 (Headers)
if (headers['max-context']) {
    headers['max-context'] = '1M';
    console.log("[Anyrouter-Fix] 已修改 Header 'max-context' 为 '1M'");
}
if (headers['X-Max-Context']) {
    headers['X-Max-Context'] = '1M';
    console.log("[Anyrouter-Fix] 已修改 Header 'X-Max-Context' 为 '1M'");
}

// 2. 核心处理：拦截并篡改请求体 (Body)
if (body) {
    try {
        let obj = JSON.parse(body);
        let changed = false;

        // 场景：你在 OpenMinis 手动配置模型时，上下文限制/Max Tokens 填写了纯数字 1000000
        // 脚本捕获到该特定数字后，将其强转为网关所需的字符串 "1M"
        if (obj.max_tokens === 1000000 || obj.max_tokens === '1000000') {
            obj.max_tokens = "1M";
            changed = true;
            console.log("[Anyrouter-Fix] 成功捕获数字 1000000，已篡改为字符串 '1M'");
        }

        // 针对某些特殊中转格式（部分网关会把参数塞进 metadata 或 options 字典中）进行兼容处理
        if (obj.metadata && (obj.metadata.max_tokens === 1000000 || obj.metadata.max_tokens === '1000000')) {
            obj.metadata.max_tokens = "1M";
            changed = true;
            console.log("[Anyrouter-Fix] 已修改 metadata.max_tokens 为 '1M'");
        }
        if (obj.options && (obj.options.max_tokens === 1000000 || obj.options.max_tokens === '1000000')) {
            obj.options.max_tokens = "1M";
            changed = true;
            console.log("[Anyrouter-Fix] 已修改 options.max_tokens 为 '1M'");
        }

        if (changed) {
            body = JSON.stringify(obj);
        }
    } catch (e) {
        console.log("[Anyrouter-Fix] 解析 JSON Body 失败，跳过修改: " + e);
    }
}

$done({ headers, body });
