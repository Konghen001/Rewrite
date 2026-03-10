// 喜马拉雅VIP解锁Loon脚本（优化版）
// 适配Loon，修改API响应解锁VIP、移除提示、确保播放

let url = $request.url.replace(/(\/|\/ts-)\d+(\.\d+)?/g, ''); // 规范化URL，忽略时间戳
let body = $response.body;
let obj;

try {
  obj = JSON.parse(body);
} catch (e) {
  $done({body});
}

// 用户首页：设置永久VIP，显示在“我的”页面
if (url.includes("mobile-user/v2/homePage") || url.includes("mobile-user/v1/homePage")) {
  if (obj.data && obj.data.user) {
    obj.data.user.vipStatus = 5; // 永久VIP状态
    obj.data.user.vipExpireTime = "1861804800000"; // 到2029年
    obj.data.user.isVip = true;
    obj.data.user.isPrimary = true;
    obj.data.user.vipType = 5;
    obj.data.user.memberGrade = 5;
    obj.data.user.hasAnyVip = true;
    obj.data.user.vipLevel = 5;
    obj.data.user.nickname += " (V5 VIP)"; // 添加标签
  }
  if (obj.data.anchorVipInfo) {
    obj.data.anchorVipInfo.isVip = true;
  }
  if (obj.data.serviceModule && obj.data.serviceModule.entrances) {
    obj.data.serviceModule.entrances = obj.data.serviceModule.entrances.filter(e => [210, 213, 215].includes(e.id)); // 保留必要入口
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
if (url.includes("v1/album/track")) {
  if (obj.data && obj.data.tracks) {
    obj.data.tracks.forEach(track => {
      track.purchased = true;
      track.isPaid = true; // 保留isPaid=true以确保播放
      track.isFree = true;
      track.canDownload = true;
      delete track.price;
      delete track.displayPrice;
      delete track.discountedPrice;
      delete track.priceTypeId;
      delete track.priceTypeEnum;
    });
  }
  if (obj.data.list) {
    obj.data.list = obj.data.list.map(list => {
      list.isPaid = true;
      list.isFree = true;
      delete list.price;
      delete list.displayPrice;
      delete list.discountedPrice;
      delete list.priceTypeId;
      delete list.priceTypeEnum;
      return list;
    });
  }
}

// 播放baseInfo：解锁播放，移除小雅提示
if (url.includes("mobile-playpage/track/v4/baseInfo") || url.includes("mobile-playpage/track/v3/baseInfo")) {
  if (obj.trackInfo) {
    obj.trackInfo.isPaid = true; // 确保播放
    obj.trackInfo.isFree = true;
    obj.trackInfo.canListen = true;
    obj.trackInfo.buyStatus = 0;
    obj.trackInfo.hasAd = false;
    obj.trackInfo.promptAudio = null;
    obj.trackInfo.voicePrompt = null;
    obj.trackInfo.adInfo = null;
    obj.trackInfo.trialInfo = null;
    delete obj.trackInfo.type;
    delete obj.trackInfo.relatedId;
    delete obj.trackInfo.price;
    delete obj.trackInfo.discountedPrice;
    delete obj.trackInfo.priceTypeId;
    delete obj.trackInfo.priceTypeEnum;
    delete obj.trackInfo.isVipFree;
    delete obj.trackInfo.vipFreeType;
    delete obj.trackInfo.hqNeedVip;
    delete obj.trackInfo.permissionSource;
    obj.trackInfo.isAntiLeech = false;
  }
  if (obj.albumInfo) {
    obj.albumInfo.isPaid = true;
    obj.albumInfo.vipFreeType = 0;
    delete obj.albumInfo.saleScope;
    delete obj.albumInfo.price;
    delete obj.albumInfo.displayPrice;
    delete obj.albumInfo.discountedPrice;
    delete obj.albumInfo.priceTypeEnum;
    delete obj.albumInfo.priceTypeId;
    delete obj.albumInfo.isVipFree;
  }
  if (obj.ads) obj.ads = [];
  obj.yellowZone = {}; // 移除可能触发提示的区域
  obj.talkBindings = [];
}

// 播放tabs：解锁下载/高质量
if (url.includes("mobile-playpage/playpage/tabs/v2")) {
  if (obj.data && obj.data.playpage) {
    obj.data.playpage.trackInfo.isPaid = false;
    delete obj.data.playpage.trackInfo.type;
    delete obj.data.playpage.trackInfo.relatedId;
    delete obj.data.playpage.trackInfo.price;
    delete obj.data.playpage.trackInfo.discountedPrice;
    delete obj.data.playpage.trackInfo.priceTypeId;
    delete obj.data.playpage.trackInfo.priceTypeEnum;
    delete obj.data.playpage.trackInfo.displayPrice;
    delete obj.data.playpage.trackInfo.displayDiscountedPrice;
    delete obj.data.playpage.trackInfo.isVipFree;
    delete obj.data.playpage.trackInfo.vipFreeType;
    delete obj.data.playpage.trackInfo.hqNeedVip;
    delete obj.data.playpage.trackInfo.permissionSource;
    obj.data.playpage.trackInfo.isAntiLeech = false;

    obj.data.playpage.albumInfo.isPaid = false;
    obj.data.playpage.albumInfo.vipFreeType = 0;
    delete obj.data.playpage.albumInfo.price;
    delete obj.data.playpage.albumInfo.displayPrice;
    delete obj.data.playpage.albumInfo.priceUnit;
    delete obj.data.playpage.albumInfo.discountedPrice;
    delete obj.data.playpage.albumInfo.priceTypeEnum;
    delete obj.data.playpage.albumInfo.priceTypeId;
    delete obj.data.playpage.albumInfo.isVipFree;
    delete obj.data.playpage.albumInfo.canShareAndStealListen;
    delete obj.data.playpage.albumInfo.canInviteListen;
    delete obj.data.playpage.albumInfo.refundSupportType;
    delete obj.data.playpage.albumInfo.isCpsProductExist;
    delete obj.data.playpage.albumInfo.cpsPromotionRate;
    delete obj.data.playpage.albumInfo.cpsProductCommission;
    delete obj.data.playpage.albumInfo.ximiVipFreeType;

    obj.data.playpage.albumInfo.priceTypes = [];
    obj.data.playpage.talkBindings = [];
    obj.data.playpage.yellowZone = {};
  }
  if (obj.data) {
    obj.data.canDownload = true;
    obj.data.canPlayHighQuality = true;
    obj.data.ads = [];
  }
}

// 音质/音效：解锁高品质
if (url.includes("mobile-playpage/playpage/track/qualityAndEffect")) {
  if (obj.data) {
    obj.data.qualityList = ["normal", "high", "super", "lossless"];
    obj.data.effectList = ["vipEffect1", "vipEffect2"];
  }
}

// 下载：允许下载
if (url.includes("mobile/download/v2/track")) {
  if (obj.data) {
    obj.data.canDownload = true;
    obj.data.downloadSize = 999999999;
  }
}

// 用户等级/装饰：解锁VIP皮肤
if (url.includes("mobile-user-grade/decoratorV2/decorationDetails/page")) {
  if (obj.data) {
    obj.data.hasVipDecoration = true;
    obj.data.decorationList = [{id: "vipSkin1", unlocked: true}];
  }
}

// 专辑plant/grass：设置已购
if (url.includes("mobile-album/album/plant/grass")) {
  if (obj.data) {
    obj.data.purchased = true;
  }
}

// 播放页推荐分配：去广告
if (url.includes("mobile-playpage/playpage/recommend/resource/allocation")) {
  if (obj.recommendBarTab) {
    obj.recommendBarTab = obj.recommendBarTab.filter(tab => tab.id !== 0); // 移除特惠广告
  }
}

// 播放页推荐内容：去广告
if (url.includes("mobile-playpage/playpage/recommendContentV2")) {
  if (obj.data && obj.data.recommendElementList) {
    obj.data.recommendElementList = obj.data.recommendElementList.filter(el => !el.bizType.includes('AD'));
  }
}

// 专辑付费信息：设置免费
if (url.includes("mobile/v1/album/paid/info")) {
  obj.isPaid = false;
  obj.type = 0;
  delete obj.vipFreeType;
  delete obj.isVipFree;
  delete obj.priceTypeEnum;
  delete obj.isGoToAlbumPresalePage;
  delete obj.newPage;
  delete obj.priceTypeId;
}

// 会员页礼物详情：模拟V5礼包
if (url.includes("business-vip-level-h5-web/api/gift/detail/")) {
  if (obj.data) {
    obj.data.enable = true;
    obj.data.content.title = "V5会员等级_月度礼包";
    // ... (添加礼包数据，如果需要；这里省略以简洁)
  }
}

// 会员页profile：设置永久
if (url.includes("business-vip-level-h5-web/api/profile")) {
  if (obj.data && obj.data.vipProfileVo) {
    obj.data.vipProfileVo.expire = "2029-12-31 23:59:59";
    obj.data.vipProfileVo.level = 5;
    obj.data.vipProfileVo.value = 28888;
    obj.data.vipProfileVo.state = 4;
  }
}

// 我的会员页：设置永久VIP
if (url.includes("business-vip-presale-mobile-web/page")) {
  if (obj.data && obj.data.modules) {
    obj.data.modules.forEach(module => {
      if (module.key === "userInfo") {
        module.userInfo.userLevel.userLevel = 5;
        module.userInfo.userLevel.userLevelIcon = "http://imagev2.xmcdn.com/storages/2fd2-audiofreehighqps/93/C6/GKwRIDoF9MpUAAAP_AEhz-MP.png";
        module.userInfo.vipStatus = 2;
        module.userInfo.subtitle = "永久会员";
      } else if (["productAdsResource", "vipProducts", "jointVipProducts", "vipLevelPrivilege", "vipPrivileges"].includes(module.key)) {
        module.vipStatus = 2;
        if (module.key === "vipProducts") module.renewTips = "您是永久会员";
        if (module.key === "vipLevelPrivilege") {
          module.userLevel = 5;
          module.level = { /* 进度数据 */ };
        }
      }
    });
  }
}

// 会员权益：去广告
if (url.includes("business-vip-welfare-mobile-web/welfare/module/exclusive/list")) {
  if (obj.data) {
    obj.data.level = 5;
    obj.data.templateVos = [];
  }
}

body = JSON.stringify(obj);
$done({body});
