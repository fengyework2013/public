var aData,ws;
var nTr = 10;

//刷新
$(".btnRefresh").click(function() {
	location.reload();
});

//获取设备状态的数据,首现预警的数据,动态预警的数据
fnAjax.method_4(
	url_join1("taskAndDeviceStatistics"),
	"",
	"get",
	function(data) {
		console.log(data);
		//设备状态的数据
		$("#delState .outlineTotal").text(data.data[0].deviceInfo.offLine);
		$("#delState .onlineTotal").text(data.data[0].deviceInfo.onLine);
		$("#delState .delTotal").text(data.data[0].deviceInfo.total);
		
		//首现预警的数据
		$("#firstWarning .warningWork").text(data.data[0].firstApearTaskInfo.taskCount);//预警任务
		$("#firstWarning .log").text(data.data[0].firstApearTaskInfo.logsCount);//日志记录
		$("#firstWarning .aboutTarget").text(data.data[0].firstApearTaskInfo.targetsCount);//相关目标
		
		//动态预警的数据
		$("#activeWarning .warningWork").text(data.data[0].statusTaskInfo.taskCount);//预警任务
		$("#activeWarning .log").text(data.data[0].statusTaskInfo.logsCount);//日志记录
		$("#activeWarning .aboutTarget").text(data.data[0].statusTaskInfo.targetsCount);//相关目标
		
	}
);
//查看设备状态详情
$(".delDetails").click(function(){
	layer.open({
	  type: 2,
//	  area: ['600px', '500px'],
	  area: ['100%', '100%'],
	  fixed: false, //不固定
	  maxmin: true,
	  title:"设备状态详情列表界面",
	  content: '../deviceManage/deviceManage.html'
	});
});

//查看首现预警详情
$(".firstDetails").click(function(){
	layer.open({
	  type: 2,
//	  area: ['600px', '500px'],
	  area: ['100%', '100%'],
	  fixed: false, //不固定
	  maxmin: true,
	  title:"首现预警详情列表界面",
	  content: '../earlyWarning/firstWaring.html'
	});
});

//查看动态预警详情
$(".activeDetails").click(function(){
	layer.open({
	  type: 2,
//	  area: ['600px', '500px'],
	  area: ['100%', '100%'],
	  fixed: false, //不固定
	  maxmin: true,
	  title:"动态预警详情列表界面",
	  content: '../earlyWarning/dynamicEarlyWarning.html'
	});
});




//页面加载执行日志通报函数
WebSocketTest();

//停止和重启链接ws
$(".cutWs").on("click",function(){
	if($(this).attr("data") == "0"){
		$(this).text("重新加载数据");
		console.log("手动关闭链接");
		ws.close();
		layer.msg("关闭链接了",{icon:2,time:1500},function(){
			ws.close();
		});
		$(this).attr("data","1");
		return;
	}
	if($(this).attr("data") == "1"){
		$(this).text("停止加载数据");
		layer.msg("重启链接了",{icon:1,time:1500},function(){
			WebSocketTest();
		});
		$(this).attr("data","0");
		return;
	}
});


//查看日志详情
$("body").delegate(".log","click",function(){
	var logInfo = $(this).parents("tr").attr("data");
	$.cookie("logInfo",logInfo);
	console.log(JSON.parse(logInfo));
	var oData = JSON.parse(logInfo);
	var len = '';
	$.each(oData, function(i,v) {
		len += i+":"+v+"<br/>";
	});
	console.log(len);
	layer.alert(len);
});

//监控日志
$("body").delegate(".monitoring","click",function(){
	//data-macType
	var obj = $(this);
	localStorage.setItem("targetMac",obj.parent().siblings(".warningMac").children(".mac").text());
	localStorage.setItem("data-macType",obj.parents("tr").attr("data-macType"));
	setTimeout(function(){
		layer.open({
		  type: 2,
	//	  area: ['600px', '500px'],
		  area: ['100%', '100%'],
		  fixed: false, //不固定
		  maxmin: true,
		  title:"设备状态详情列表界面",
		  content: '../searchCenter/search-rTimeMonitoring.html'
		});
	},100);
	
});


//判断预警类型函数
function toAlertType(str){
	if(str == "ah01"){
		return "动态预警";
	}
	if(str == "ah00"){
		return "首现预警";
	}
	if(str == "ah02"){
		return "集结预警";
	}
}

//ws请求函数
function WebSocketTest() {
	aData = [];
	var wskUrl = "ws://103.251.36.122:9508/";
	if(typeof WebSocket != 'undefined') {
		console.log("游览器支持 WebSocket!");
		var param = {
			type: "a001"
		};
		//实例化断开重连对象
		ws = new ReconnectingWebSocket(wskUrl);
		ws.onopen = function() {
			// Web Socket 已连接上，使用 send() 方法发送数据
			ws.send(JSON.stringify({"serviceType":"halert"}));
			console.log("数据发送中...");
		};

		ws.onmessage = function(evt) {
			var received_msg = evt.data;
			console.log("数据已接收...");			
			console.log(JSON.parse(received_msg));
			sHtml = $("<tr class='text-c' data-macType='"+JSON.parse(received_msg).macType+"' data='"+received_msg+"'><td class='warningType'><span></span>[<span class='type'>"+toAlertType(JSON.parse(received_msg).alertType)+"</span>]</td><td class='warningMac'><span>"+JSON.parse(received_msg).targetName+"</span>[<span class='mac'>"+JSON.parse(received_msg).mac+"</span>]</td><td class='warningArea'><span>出现地点</span>[<span class='area'>"+JSON.parse(received_msg).address+"</span>]</td><td class='warningDate'>"+JSON.parse(received_msg).time+"</td><td>"+JSON.parse(received_msg).eleSum+"</td><td class='warningOption td-option'><a href='#'class='log'>日志</a><a href='#'class='monitoring'>监控</a></td></tr>");
			$(".warningTable tbody").append(sHtml);
			$(".warningMac").each(function(i){
				if($(this).children("span").text() == ""){
					$(this).html("集结预警");
				}
			});
			if($(".warningTable tbody tr").length >= nTr){
				$(".warningTable tbody tr:first-child").remove();
			}
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

	} else {
		layer.alert("该浏览器不支持查看实时数据，请更新到最新版本");
	}
}