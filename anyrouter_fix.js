export default async function(ctx) {
  // 只处理发往 anyrouter 的请求
  if (!ctx.request.url.includes("anyrouter.top")) return;

  // 读取原始 body
  const body = await ctx.request.json();

  // 1. 替换模型名
  if (body.model) {
    if (body.model.toLowerCase().includes("opus")) {
      body.model = "opus[1m]";
    } else if (body.model.toLowerCase().includes("sonnet")) {
      body.model = "sonnet[1m]";
    } else if (body.model.toLowerCase().includes("haiku")) {
      body.model = "haiku[1m]";
    }
  }

  // 2. 注入 Claude Code attribution block 到 system
  const attribution = {
    type: "text",
    text: "<claude_code_attribution>\n<version>2.1.0</version>\n<client>cli</client>\n<fingerprint>a1b2c3d4</fingerprint>\n</claude_code_attribution>"
  };

  if (!body.system) {
    body.system = [attribution];
  } else if (Array.isArray(body.system)) {
    body.system.unshift(attribution);
  } else if (typeof body.system === "string") {
    // 有些客户端 system 是字符串，转成数组格式
    body.system = [attribution, { type: "text", text: body.system }];
  }

  // 3. 修改 headers
  const headers = ctx.request.headers;
  headers.set("User-Agent", "claude-cli/2.1.0 (external, cli)");
  headers.set("anthropic-version", "2023-06-01");
  // 把 Authorization: Bearer sk-xxx 转成 x-api-key: sk-xxx
  const auth = headers.get("Authorization") || headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    headers.set("x-api-key", auth.replace("Bearer ", ""));
    headers.delete("Authorization");
  }

  return {
    headers: headers,
    body: body  // Object 会自动序列化为 JSON
  };
}
