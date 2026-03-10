// 喜马拉雅VIP解锁Loon脚本
// 适配Loon环境，修改API响应以解锁VIP、移除提示

let url = $request.url;
let body = $response.body;
let obj;

try {
  obj = JSON.parse(body);
} catch (e) {
  $done({body});
}

// 用户首页：设置VIP状态，显示在“我的”页面
if (url.includes("mobile-user/v2/homePage")) {
  if (obj.data && obj.data.user) {
    obj.data.user.vipStatus = 1; // VIP状态
    obj.data.user.vipExpireTime = "4102415999000"; // 过期时间到2099年
    obj.data.user.isVip = true;
    obj.data.user.isPrimary = true;
    obj.data.user.vipType = 1; // VIP类型
    obj.data.user.memberGrade = 3; // 会员等级
    obj.data.user.hasAnyVip = true;
    obj.data.user.nickname = obj.data.user.nickname + " (VIP)"; // 可选，添加VIP标签
  }
}

// 产品/专辑详情：设置已购买
if (url.includes("product/detail/v1")) {
  if (obj.data) {
    obj.data.purchased = true;
    obj.data.buyStatus = 1;
    obj.data.canListen = true;
    obj.data.isFree = true;
  }
}

// 专辑轨道列表：解锁所有轨道
if (url.includes("v1/album/track/ts")) {
  if (obj.data && obj.data.tracks) {
    obj.data.tracks.forEach(track => {
      track.purchased = true;
      track.isPaid = false;
      track.isFree = true;
      track.canDownload = true;
    });
  }
}

// 播放baseInfo：解锁播放，移除语音提示（如“小雅提示您xxxx”）
if (url.includes("mobile-playpage/track/v4/baseInfo/ts")) {
  if (obj.data && obj.data.trackInfo) {
    obj.data.trackInfo.isPaid = false;
    obj.data.trackInfo.isFree = true;
    obj.data.trackInfo.canListen = true;
    obj.data.trackInfo.buyStatus = 0;
    obj.data.trackInfo.hasAd = false; // 移除广告
    obj.data.trackInfo.promptAudio = null; // 移除提示音频
    obj.data.trackInfo.voicePrompt = null; // 移除语音提示
    obj.data.trackInfo.adInfo = null; // 清空广告信息
    obj.data.trackInfo.trialInfo = null; // 移除试听限制
  }
  if (obj.data.ads) {
    obj.data.ads = [];
  }
}

// 播放tabs：解锁下载/高质量
if (url.includes("mobile-playpage/playpage/tabs/v2")) {
  if (obj.data) {
    obj.data.canDownload = true;
    obj.data.canPlayHighQuality = true;
    obj.data.ads = [];
  }
}

// 音质/音效：解锁高品质
if (url.includes("mobile-playpage/playpage/track/qualityAndEffect")) {
  if (obj.data) {
    obj.data.qualityList = ["normal", "high", "super", "lossless"]; // 解锁所有音质
    obj.data.effectList = ["vipEffect1", "vipEffect2"]; // 解锁VIP音效
  }
}

// 下载：允许下载
if (url.includes("mobile/download/v2/track")) {
  if (obj.data) {
    obj.data.canDownload = true;
    obj.data.downloadSize = 999999999; // 模拟大文件大小
    // 注意：下载URL可能需原响应提供，脚本不生成新URL
  }
}

// 用户等级/装饰：解锁VIP皮肤/装饰
if (url.includes("mobile-user-grade/decoratorV2/decorationDetails/page")) {
  if (obj.data) {
    obj.data.hasVipDecoration = true;
    obj.data.decorationList = [{id: "vipSkin1", unlocked: true}]; // 模拟解锁
  }
}

// 专辑plant/grass：设置已购
if (url.includes("mobile-album/album/plant/grass")) {
  if (obj.data) {
    obj.data.purchased = true;
  }
}

body = JSON.stringify(obj);
$done({body});
