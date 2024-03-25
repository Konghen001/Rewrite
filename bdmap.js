#!name = 百度地图
#!desc = 移除广告

hostname = newclient.map.baidu.com, yongche.baidu.com, ugc.map.baidu.com


# 组件包
^https:\/\/newclient\.map\.baidu\.com\/client\/crossmarketing\/\?container=du_aide_module url reject-dict
^https:\/\/newclient\.map\.baidu\.com\/client\/crossmarketing\/\?container=du_card_ugc url reject-dict
^https:\/\/newclient\.map\.baidu\.com\/client\/crossmarketing\/\?container=du_trip_route_tab url reject-dict
^https:\/\/newclient\.map\.baidu\.com\/client\/crossmarketing\/\?oem= url reject-dict
^https:\/\/newclient\.map\.baidu\.com\/client\/imap\/dl\/s\/UpdateInfo\.php\? url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/baidu/map.js
# 首页 小横条,左上角动图
^https:\/\/newclient\.map\.baidu\.com\/client\/noticebar\/get\? url reject-dict
^https:\/\/newclient\.map\.baidu\.com\/client\/phpui2\/\?qt=ads url reject-dict
# 我的页面
^https:\/\/newclient\.map\.baidu\.com\/client\/usersystem\/mine\/page\? url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/baidu/map.js
^https:\/\/newclient\.map\.baidu\.com\/grow-engine\/api\/common\/userHome\? url reject-dict
# 打车页
//^https:\/\/yongche\.baidu\.com\/goorder\/passenger\/notice url reject-dict
//^https:\/\/yongche\.baidu\.com\/gomarketing\/api\/activity\/talos\/activitycard\? url reject-dict
^https:\/\/yongche\.baidu\.com\/gomarketing\/api\/popup\/getentrancecordovaurl url reject-dict
^https:\/\/yongche\.baidu\.com\/goorder\/passenger\/baseinfo url reject-dict

# > 百度地图_首页底部推荐
^https?:\/\/ugc\.map\.baidu\.com\/govui\/rich_content url reject-200
