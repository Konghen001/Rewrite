/*
喜马拉雅 + 会员调试
适用于 Loon
原作者：未知（来自 WeiGiegie/666）
适配 Loon：Grok 调整
更新时间：2026-03-xx
使用声明：仅供学习交流，请于24小时内删除
*/

const url = $request.url;
const body = $response.body;
let obj = JSON.parse(body);

// ==================== 核心修改逻辑 ====================

// 1. 首页 / 个人中心相关 - 强制 VIP 状态
if (url.includes("mobile-user/v2/homePage") || 
    url.includes("mobile-user-grade/decoratorV2/decorationDetails/page")) {
    if (obj?.data?.user) {
        obj.data.user.vipStatus = 1;
        obj.data.user.vipType = 1;           // 或 2，根据需要
        obj.data.user.vipLevel = 30;         // 最高等级
        obj.data.user.remainingDays = 999;
        obj.data.user.expireDate = 4102435200000;  // 遥远的未来时间戳
    }
    if (obj?.data?.vip) {
        obj.data.vip.status = 1;
        obj.data.vip.level = 30;
        obj.data.vip.validDays = 999;
    }
}

// 2. 专辑 / 音轨详情 - 解锁付费内容
if (url.includes("product/detail/v1") || 
    url.includes("v1/album/track/ts") || 
    url.includes("mobile-playpage/track/v4/baseInfo/ts")) {
    if (obj?.data) {
        obj.data.isFree = true;
        obj.data.isPaid = false;
        obj.data.isVipFree = true;
        obj.data.vipFreeStatus = 1;
        if (obj.data.price) obj.data.price = 0;
        if (obj.data.displayPrice) obj.data.displayPrice = "0";
    }
    if (obj?.data?.track) {
        obj.data.track.isFree = true;
        obj.data.track.canPlay = true;
        obj.data.track.vipFree = true;
    }
}

// 3. 音质 / 音效 / 下载权限
if (url.includes("mobile-playpage/playpage/track/qualityAndEffect")) {
    if (obj?.data?.qualityEffects) {
        obj.data.qualityEffects.forEach(item => {
            item.canUse = true;
            item.isVip = false;
            if (item.qualityLevel) item.qualityLevel = Math.max(item.qualityLevel, 3); // 最高音质
        });
    }
}

// 4. 下载权限
if (url.includes("mobile/download/v2/track")) {
    if (obj?.data) {
        obj.data.canDownload = true;
        obj.data.downloadVip = false;
        obj.data.isVipFree = true;
    }
}

// 5. 播放页 tab / 皮肤等
if (url.includes("mobile-playpage/playpage/tabs/v2")) {
    if (obj?.data?.tabs) {
        obj.data.tabs.forEach(tab => {
            tab.isVip = false;
            tab.canAccess = true;
        });
    }
}

// 6. 大师课 / 付费专辑通用处理
if (url.includes("mobile-album/album/plant/grass")) {
    if (obj?.data) {
        obj.data.isFree = true;
        obj.data.vipFree = true;
        if (obj.data.price) obj.data.price = 0;
    }
}

// ==================== 输出 ====================

$done({ 
    status: "HTTP/1.1 200 OK",
    headers: $response.headers,
    body: JSON.stringify(obj)
});