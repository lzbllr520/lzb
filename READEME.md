
通过/opcua/connected-servers获得：(get请求)
{
"code": 0,
"msg": "操作成功",
"data": {
"servers": [
{
"id": "server1",
"name": "本地测试服务器",
"ip": "192.168.2.15"
}
],
"total_count": 1
}
}


通过/opcua/browse-nodes（post请求）：
请求体：
{
"id": "server1"
}
获得：
{
"code": 0,
"msg": "操作成功",
"data": {
"current_path": [
"Objects"
],
"current_node_id": "ns=0;i=85",
"nodes": [
{
"index": 0,
"node_id": "ns=0;i=2253",
"browse_name": "Server",
"display_name": "Server",
"node_class": "对象",
"has_children": true,
"browsable": true
},
{
"index": 1,
"node_id": "ns=1;s=HelloNode",
"browse_name": "Hello",
"display_name": "问候",
"node_class": "对象",
"has_children": true,
"browsable": true
},
{
"index": 2,
"node_id": "ns=2;s=edge01",
"browse_name": "edge01",
"display_name": "边缘设备01",
"node_class": "对象",
"has_children": true,
"browsable": true
}
],
"total_count": 3
}
}


通过/opcua/browse-nodes（post请求）：
请求体：
{
"id": "server1",
"node_id": "ns=0;i=2253"
}
获得：
{
"code": 0,
"msg": "操作成功",
"data": {
"current_path": [
"Server"
],
"current_node_id": "ns=0;i=2253",
"nodes": [
{
"index": 0,
"node_id": "ns=0;i=2994",
"browse_name": "Auditing",
"display_name": "Auditing",
"node_class": "变量",
"has_children": false,
"browsable": false
},
{
"index": 1,
"node_id": "ns=0;i=2267",
"browse_name": "ServiceLevel",
"display_name": "ServiceLevel",
"node_class": "变量",
"has_children": false,
"browsable": false
},
{
"index": 2,
"node_id": "ns=0;i=2255",
"browse_name": "NamespaceArray",
"display_name": "NamespaceArray",
"node_class": "变量",
"has_children": false,
"browsable": false
},
{
"index": 3,
"node_id": "ns=0;i=2254",
"browse_name": "ServerArray",
"display_name": "ServerArray",
"node_class": "变量",
"has_children": false,
"browsable": false
},
{
"index": 4,
"node_id": "ns=0;i=2296",
"browse_name": "ServerRedundancy",
"display_name": "ServerRedundancy",
"node_class": "对象",
"has_children": true,
"browsable": true
},
{
"index": 5,
"node_id": "ns=0;i=2295",
"browse_name": "VendorServerInfo",
"display_name": "VendorServerInfo",
"node_class": "对象",
"has_children": true,
"browsable": true
},
{
"index": 6,
"node_id": "ns=0;i=2274",
"browse_name": "ServerDiagnostics",
"display_name": "ServerDiagnostics",
"node_class": "对象",
"has_children": true,
"browsable": true
},
{
"index": 7,
"node_id": "ns=0;i=2268",
"browse_name": "ServerCapabilities",
"display_name": "ServerCapabilities",
"node_class": "对象",
"has_children": true,
"browsable": true
},
{
"index": 8,
"node_id": "ns=0;i=2256",
"browse_name": "ServerStatus",
"display_name": "ServerStatus",
"node_class": "变量",
"has_children": false,
"browsable": false
},
{
"index": 9,
"node_id": "ns=0;i=12873",
"browse_name": "ResendData",
"display_name": "ResendData",
"node_class": "方法",
"has_children": false,
"browsable": false
},
{
"index": 10,
"node_id": "ns=0;i=11492",
"browse_name": "GetMonitoredItems",
"display_name": "GetMonitoredItems",
"node_class": "方法",
"has_children": false,
"browsable": false
}
],
"total_count": 11
}
}

