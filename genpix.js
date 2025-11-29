/*
 * 软件名称: GenPix
 * 脚本说明: 解锁会员
 * 原作者: Yu9191
 * Loon适配版
 */

var isResponse = typeof $response !== "undefined";
var url = $request.url;

if (isResponse) {
    // 处理 get-tx-info 响应
    var body = {
        "status": "success",
        "message": "Operation completed successfully",
        "code": 0,
        "data": 1,
        "balance": "Operation completed successfullyOperation completed successfullyration completed successfully",
        "free_balance": 0,
        "paid_balance": 0,
        "is_bindphone": 1,
        "subscribe_id": "com.niceprompt.bindphone",
        "is_subscribe": 0,
        "subscribe_expire_time": 0,
        "subscribe_type": "yearly_bindphone_free_v2",
        "subscribe_source": "promotion_yearly_bindphone_free_v2"
    };
    $done({ body: JSON.stringify(body) });
} else {
    // 处理 gen-image-v3 请求
    var reqBody = $request.body;
    if (reqBody) {
        try {
            var obj = JSON.parse(reqBody);
            obj.balance = "Operation completed successfullyOperation completed successfullyration completed successfully";
            $done({ body: JSON.stringify(obj) });
        } catch (e) {
            $done({});
        }
    } else {
        $done({});
    }
}