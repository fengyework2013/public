
	var oMac = {}; //目标
	var lngAndlat, map, marker, marker2, myIcon, point, pt ,oTime2,timer,gcm,ws, aData,timer2;
	var nTr = 10;
	
	
		//画地图
	map = new BMap.Map("main");
	map.centerAndZoom(new BMap.Point(113.953812, 22.549255), 22);		
	var scaleControl = new BMap.ScaleControl({
		anchor: BMAP_ANCHOR_BOTTOM_LEFT
	});
	scaleControl.setUnit(BMAP_UNIT_METRIC);
	map.addControl(scaleControl);
	var navControl = new BMap.NavigationControl({
		anchor: BMAP_ANCHOR_TOP_LEFT,
		type: BMAP_NAVIGATION_CONTROL_LARGE
	});
	map.addControl(navControl);
	map.enableScrollWheelZoom();//能够滚动
	
	//消息中心过来的参数
	console.log(localStorage.getItem("targetMac")); //存预警目标mac
	console.log(localStorage.getItem("data-macType")); //存预警目标mac
	//回显消息中心的mac	
	if(localStorage.getItem("targetMac") != null) {
		$("#deviceCode").val(localStorage.getItem("targetMac"));
	}
	//	回显消息中心的mac类型
	if(localStorage.getItem("data-macType") == "rf") {
		$("#delType").val("1");
	} else if(localStorage.getItem("data-macType") == "sta") {
		$("#delType").val("0");
	}
	
	//根据mac查询
	$(".form").Validform({
		btnSubmit: ".rTimeMonitoring",
		beforeSubmit: function(curform) {
			$(".rTimeMonitoring").attr("disabled","disabled");
			$(".closeBtn").removeAttr("disabled");
			//初始化地图（模拟数据）	
			resetJWD(113.953812, 22.549255);
			//初始化地图（ws数据请求）
			ajaxFn();
		},
		callback: function() {
			return false;
		}
	});

	//close ws
	$(".closeBtn").click(function() {
		$(".rTimeMonitoring").removeAttr("disabled");
		$(this).attr("disabled","disabled");		
		clearInterval(timer2);
		console.log("手动关闭链接");
		ws.close();
		layer.msg("关闭ws链接",{icon:2,time:1500},function(){
			ws.close();
		});
	});
	
	//根据传入的最大经度，最小经度，最大纬度，最小纬度，以及输出类型返回结果，type：1表示输出经度
	//2表示输出纬度，3表示输出经纬度			
	function getData(maxJD, minJD, maxWD, minWD, type) {
		//获取在最大经度跟最小经度之间的随机数
		var randomJD = Math.random() * (maxJD - minJD) + minJD;
		//保留6位小数点
		randomJD = randomJD.toFixed(6);
		var randomWD = Math.random() * (maxWD - minWD) + minWD;
		randomWD = randomWD.toFixed(6);
		if(1 == type) {
			return randomJD;
		} else if(2 == type) {
			return randomWD;
		} else if(3 == type) {
			return randomJD + ',' + randomWD;
		}
	}
	
	//随机加载目标mac经纬度
	function oMacfn(lng, lat) {
		var deviationV = 0.0003; //偏离值
		oMac.lng = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 1) * 1;
		oMac.lat = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 2) * 1;
	}
	
	//画地图
	function onLoadMap(centerJD,centerWD,targetJD,targetWD) {
		point = new BMap.Point(centerJD,centerWD);
		var startIcon = new BMap.Icon("../../images/tanba2_36.gif", new BMap.Size(36, 36));
		var markerStrat = new BMap.Marker(point, {
			icon: startIcon
		}); // 创建探霸标注
		map.addOverlay(markerStrat); // 将标注添加到地图中
		
		
		//清除覆盖物，再次画出目标覆盖物
		map.removeOverlay(marker2)
		pt = new BMap.Point(targetJD,targetWD);
		console.log(pt);
		var myIcon = new BMap.Icon("../../images/icon.png", new BMap.Size(36, 36), { 
			//offset: new BMap.Size(0, -5),    //相当于CSS精灵
			//imageOffset: new BMap.Size(-20, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		});
		marker2 = new BMap.Marker(pt, {
			icon: myIcon
		}); // 创建标注			
		map.addOverlay(marker2); // 将标注添加到地图中*/
		
		distance = Math.ceil(map.getDistance(pt, point));//实时获取覆盖物距离终点的距离
		//添加覆盖物实时文字标签
		var label = new BMap.Label("目标距离终点（探霸）" + distance + '米', {
			offset: new BMap.Size(0, -30)
		});
		label.setStyle({
			fontSize: "0.6em",
			border: "1px solid #1589EE",
			fontFamily: "微软雅黑",
			"border-radius": "20px",
			padding: "0.5em 13.5em 0.5em 1em",
			
		});
		marker2.setLabel(label);
		map.centerAndZoom(pt, 22);
	}
	
	//根据指定中心经纬度，随机生成附近的覆盖物经纬度
	function resetJWD(j,w){
		oMacfn(j,w);
		onLoadMap(j,w,oMac.lng,oMac.lat);
		//递归测试数据
		timer2 = setTimeout(function(){
			resetJWD(j,w)
		},2000);
	}

	//web socket
	function init(data) {
		if(typeof WebSocket != 'undefined') {
			var wskUrl = "ws://103.251.36.122:9508/";
			aData = [];
			//实例化断开重连对象
			ws = new ReconnectingWebSocket(wskUrl);
			ws.onopen = function() {
				console.log("开始链接");
				ws.send(JSON.stringify(data));
			};
			ws.onmessage = function(e) {
	//			console.log(typeof e.data);
				var mainData = JSON.parse(e.data);
				sHtml = $('<tr class="text-c"><td class="macId">'+mainData.devid+'</td><td class="address">'+mainData.addr+'</td><td>'+mainData.time+'</td><td>'+mainData.long+','+mainData.lant+'</td></tr>');	
				$("#TableView tbody").append(sHtml);
				if($("#TableView tbody tr").length >= nTr){
					$("#TableView tbody tr:first-child").remove();
				}
				//存储探霸数据
				localStorage.setItem("tbData", JSON.stringify(mainData));
			};
			ws.onclose = function() {
				console.log("关闭链接");
			};
			ws.onerror = function() {
				console.log("链接报错");
			};
		}else{
			layer.alert("该浏览器不支持查看实时数据，请更新到最新版本");
		}
		

	}
	//封装实时监控请求函数
	function ajaxFn() {
		//关闭测试数据		
		clearInterval(oTime2);
		//ws请求
		init({
			"mac": $("#deviceCode").val(),
			"type": $("#delType").val(),
			"serviceType":"monitor"
		});
		
		//延时加载ws本地保存的数据
			if(localStorage.getItem("tbData") != null){
				//方式1：ws数据（探霸和探霸探测到的mac经纬度）
				oTime2 = setInterval(function() {
					var localData = JSON.parse(localStorage.getItem("tbData"));
					console.log(localData);
					onLoadMap(localData.long, localData.lant, localData.long, localData.lant);
				}, 5000);
				
				//方式2：ws数据+自己模拟数据（探霸和附近经过计算的目标mac的经纬度）
//				oTime2 = setInterval(function() {
//					var localData = JSON.parse(localStorage.getItem("tbData"));
//					console.log(localData);
//					resetJWD(localData.long, localData.lant);
//				},5000);
			}				
		
	}
	
	

