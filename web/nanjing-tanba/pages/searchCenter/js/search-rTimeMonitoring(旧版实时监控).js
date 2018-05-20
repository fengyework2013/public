	var gcm; //伴随
	var oMac = {}; //目标
	var timer; //时间间隔，指示mac目标在界面上
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

	//==================================================模拟伴随的目标实时经纬度模块==========================================================================
	//随机加载伴随经纬度
	function lng_and_lat(lng, lat, arrLength) {
		centerJD = lng;
		centerWD = lat;
		var deviationV = 0.0005; //偏离值
		gcm = [];
		for(var i = 0; i < arrLength; i++) {
			gcm.push({
				"lng": getData(centerJD - deviationV, centerJD + deviationV, centerWD - deviationV, centerWD + deviationV, 1),
				"lat": getData(centerJD - deviationV, centerJD + deviationV, centerWD - deviationV, centerWD + deviationV, 2)
			});
		}

	}
	//初始化加载并且
	function intFloat() {
		lng_and_lat(113.953812, 22.549255, 10);
		setTimeout(function() {
			console.log(gcm);
		}, 3000);
	}
//		intFloat();
	//==================================================模拟伴随的目标实时经纬度模块==========================================================================

	//随机加载目标mac经纬度
	function oMacfn(lng, lat) {
		var deviationV = 0.0005; //偏离值
		oMac.lng = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 1) * 1;
		oMac.lat = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 2) * 1;
	}

	//经纬度数组
	var lngAndlat, map, marker, marker2, myIcon, point;
	
	//封装目标mac的指示物函数
		function drawMap(lng, lat) {
			map.removeOverlay(marker);
			//		map.clearOverlays();
			// 创建点1
			marker = new BMap.Marker(new BMap.Point(lng, lat));
			//添加覆盖物
			map.addOverlay(marker); //增加点
			//		map.addOverlay(marker2);
		}

		//添加覆盖物
		function add_overlay() {
			lngAndlat = [
				[116.406, 39.921],
				[116.407, 39.921],
				[116.408, 39.921],
				[116.409, 39.921],
				[116.410, 39.921]
			];

			for(var i = 0; i < lngAndlat.length; i++) {

				map.clearOverlays();
				map.addOverlay(new BMap.Marker(new BMap.Point(lngAndlat[i][0], lngAndlat[i][1]), {
					icon: myIcon
				}));
			}

			map.addOverlay(marker); //增加点
			map.addOverlay(marker2);
		}
		//清除覆盖物
		function remove_overlay() {
			//		map.clearOverlays();
			map.removeOverlay(marker);
		}
	
	//画地图
	
	function onLoadMap(jingdu,weidu) {

		//画出地图控件==================================================================================================
		// 百度地图API功能
		map = new BMap.Map("main");
		point = new BMap.Point(jingdu,weidu);
		map.centerAndZoom(point, 22);

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
		//画出地图控件==================================================================================================
		//创建指定特殊点
		marker2 = new BMap.Marker(
			new BMap.Point(116.405, 39.920), {
				icon: myIcon
			}
		);
		//指定点的图标
		myIcon = new BMap.Icon("../../images/markers.png",
			new BMap.Size(23, 25), //图标相对地图的指定经纬度的偏移
			{
				imageOffset: new BMap.Size(0, -300) //图标相对于图片本身的像素偏移
			}
		);
		
		//加载某个覆盖物
		setTimeout(function(){
			drawMap(jingdu,weidu);
		},100);
		
		
		//==============================================模拟目标mac的实时经纬度=====================================================================
		
	
//		function initOmac(jd, wd) {
//			oMacfn(jd, wd);
//			setTimeout(function() {
//				//			console.log(oMac);
//				drawMap(oMac.lng, oMac.lat); //画出地图目标指示物，每三秒刷新一次
//				initOmac(jd, wd);
//			}, 3000);
//		}
//		initOmac(113.953812, 22.549255);
	//==============================================模拟目标mac的实时经纬度=====================================================================
		
	}
	
	//递归重新画地图和覆盖物
	function initMap(jd, wd) {
			oMacfn(jd, wd);
			setTimeout(function() {
				onLoadMap(oMac.lng, oMac.lat); //画出地图目标指示物，每三秒刷新一次
//				initMap(jd, wd);
			}, 1000);
	}
	initMap(113.953812, 22.549255);


	//web socket
	var ws, aData;

	function init(data) {
		aData = [];
		ws = new WebSocket("ws://103.251.36.122:9509/");
		// Set event handlers.
		ws.onopen = function() {
			//					ws.send(JSON.stringify(param));
			console.log("开始链接");
			ws.send(JSON.stringify(data));
			//			ws.send(data);
		};
		ws.onmessage = function(e) {
			var mainData = JSON.parse(e.data);
//			console.log(aData);
			aData.push(mainData);
			var tem = "";
			for(var i=0;i<aData.length;i++){
				tem += '<tr class="text-c"><td class="macId">'+aData[i].devid+'</td><td class="address">'+aData[i].addr+'</td><td>'+aData[i].time+'</td><td>'+aData[i].long+','+aData[i].lant+'</td></tr>';
			}
			$("#TableView tbody").html(tem);
			//限制20条数据，存满20条，1秒后再次清空，再次填充数据
			if(aData.length >= 10) {
				ws.close();
				console.log(aData);
				setTimeout(function() {
					init(data);
				}, 3000);
			}
			//画图
			localStorage.setItem("tbData", JSON.stringify(mainData));
			setTimeout(function() {
				var localData = JSON.parse(localStorage.getItem("tbData"));
				console.log(localData);
//				onLoadMap(localData.long, localData.lant); 
				drawMap(localData.long, localData.lant);
			}, 3000);

		};
		ws.onclose = function() {
			console.log("关闭链接");
		};
		ws.onerror = function() {
			console.log("链接报错");
		};

	}

	function onCloseClick() {
		console.log("手动关闭链接");
		ws.close();
	}

	//根据mac查询
	$(".form").Validform({
		btnSubmit: ".rTimeMonitoring",
		beforeSubmit: function(curform) {
			ajaxFn();
		},
		callback: function() {
			return false;
		}
	});

	//封装实时监控请求函数
	function ajaxFn() {
		init({
			"mac": $("#deviceCode").val(),
			"type": $("#delType").val()
		});
	}

	//close ws
	$(".closeBtn").click(function() {
		onCloseClick();
		console.log(localStorage.length);
	});