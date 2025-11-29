/*
 * 软件名称: GenPix
 * 脚本说明: 解锁会员 (Loon版)
 * 原作者: Yu9191
 * Loon适配
 */

var url = $request.url;

// 处理 get-tx-info 响应
if (/get-tx-info/.test(url)) {
    var obj = {
        "status": "success",
        "message": "Operation completed successfully",
        "code": 0,
        "data": 1,
        "balance": 30000,
        "free_balance": 30000,
        "paid_balance": 30000,
        "is_bindphone": 1,
        "subscribe_id": "com.niceprompt.bindphone",
        "is_subscribe": 1,
        "subscribe_expire_time": 4092599349,
        "subscribe_type": "yearly_bindphone_free_v2",
        "subscribe_source": "promotion_yearly_bindphone_free_v2"
    };
    $done({ body: JSON.stringify(obj) });
}
// 处理 gen-image-v3 请求
else if (/gen-image-v3/.test(url)) {
    var body = $request.body;
    if (body) {
        try {
            var obj = JSON.parse(body);
            obj.balance = 30000;
            obj.is_vip = 1;
            $done({ body: JSON.stringify(obj) });
        } catch (e) {
            $done({});
        }
    } else {
        $done({});
    }
}
else {
    $done({});
}