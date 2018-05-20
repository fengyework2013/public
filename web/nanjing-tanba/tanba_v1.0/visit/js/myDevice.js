$(function() {
	var myDevice = new myDeviceObj();
	myDevice.init();
	myDevice.Ajax();

	//设置列表查询
	$("#queryCriteriaInput").keyup(function() {
		$("#device_dataUl_tbody").find("tr").stop().hide() //将tbody中的tr都隐藏
		$("#device_dataUl_tbody").find("tr").filter(":contains('" + ($(this).val()) + "')").show(); //，将符合条件的筛选出来
	});
})
var myDeviceObj = function() {
	this.ajaxSrc;
	this.wsSrc;
	this.send;
}
myDeviceObj.prototype.init = function() {
	this.ajaxSrc = "http://119.10.54.43:8090/Device/index";
	this.wsSrc = "ws://123.58.43.17:9501/";
	this.send = "";
}
myDeviceObj.prototype.Ajax = function() {
	var _this = this;
	$.ajax({
		type: "get",
		dataType: "json",
		url: _this.ajaxSrc,
		timeout: 10000,
		success: function(res) {
			/*隐藏状态提示框*/
			$("#device_dataUl").find(".list_Prompt").hide();
			/*显示数据表格*/
			$("#device_dataUl").find("table").show();
			/*渲染dom*/
			_this.draw(res.data);
		},
		error: function() {
			$("#device_dataUl").find(".list_Prompt").html("连接服务器失败！")
		}
	});
}
myDeviceObj.prototype.draw = function(res) {
	var _this = this;
	var str = '';
	for(var i = 0; i < res.length; i++) {
		var deviceId = res[i].deviceId;
		var Online;
		if(res[i].online == 1) {
			Online = '<td class="onlineTd"><i></i> 在线</td>';
		} else {
			Online = '<td class="onlineTd"><i class="error"></i> 离线</td>';
		}
		var Update = res[i].createtime;
		var DServer = res[i].servip;
		var CServer = res[i].cfgservip;
		var Latitude = res[i].latitude;
		var Longitude = res[i].longitude;
		str += '<tr>' +
			'<td class="did">' + deviceId + '</td>' + Online +
			'<td>' + Update + '</td>' +
			'<td>' + DServer + '</td>' +
			'<td>' + CServer + '</td>' +
			'<td>' + Latitude + '</td>' +
			'<td>' + Longitude + '</td>' +
			'<td>' +
			'<button class="Restart">重启</button>' +
			'<button>管理</button>' +
			'</td>' +
			'</tr>';
	}
	/*渲染数量*/
	$("#urrentNumber").html(res.length);
	/*渲染tr*/
	$("#device_dataUl_tbody").html(str);
	/*重启操作*/
	this.Operate();
}
myDeviceObj.prototype.Operate = function() {
	if("WebSocket" in window) {
		var _this = this;
		var ws = new ReconnectingWebSocket(_this.wsSrc);

		ws.onopen = function() {
			// Web Socket 已连接上，使用 send() 方法发送数据
			console.log("已连接...");
		};

		ws.onmessage = function(evt) {
			var msg = JSON.parse(evt.data);
			/*数据处理*/
			console.log(evt);
		};

		ws.onclose = function() {
			// 关闭 websocket
			ws.close();
			console.log("连接已关闭...");
		};

		//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
		window.onbeforeunload = function() {
			ws.close();
		}

		/*重启操作*/
		$("#device_dataUl_tbody").find(".Restart").click(function() {
			var idHtml = $(this).parent().siblings(".did").html();
			var send = {
				"type": "command",
				"data": {
					"deviceid": idHtml,
					"msg": "restart"
				}
			}
			ws.send(JSON.stringify(send));
		})
	} else {
		console.log("游览器不支持WebSocket!")
	}
}