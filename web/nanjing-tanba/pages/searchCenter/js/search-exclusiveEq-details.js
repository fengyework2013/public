//经纬度数组
var map, geoc;
var points = []; //设置描绘历史轨迹的坐标数组
var commomArr = []; //公用data数组
var marker, lushu;
var arrPois = [];
var ws, aData;

//常出现地方
fnAjax.method_4(
	url_join("Follow/queryAddress"), {
		mac: $.cookie("mac"),
		startTime: $.cookie("startTime"),
		endTime: $.cookie("endTime")
	},
	"post",
	function(data) {
		console.log(data);
		if(data.data.length > 0) {
			$(".addressList").html("");
			$.each(data.data, function(i, v) {
				sLi = $('<li class="parentClear"><span class="address lf">' + v.address + '</span><span class="times rf">' + v.times + '</span></li>');
				$(".addressList").append(sLi);
			});
		}

	}
);

//活跃时间
fnAjax.method_4(
	url_join("Follow/queryTime"), {
		mac: $.cookie("mac"),
		startTime: $.cookie("startTime"),
		endTime: $.cookie("endTime")
	},
	"post",
	function(data) {
		console.log(data);
		if(data.data.length > 0) {
			$(".activeList").html("");
			$.each(data.data, function(i, v) {
				sLi = $('<li class="parentClear"><span class="address lf">' + v.time + '</span><span class="times rf">' + v.times + '</span></li>');
				$(".activeList").append(sLi);
			});
		}

	}
);




// 百度地图API功能
map = new BMap.Map("main");
map.centerAndZoom(new BMap.Point(117.270591, 23.812975), 15);//默认地图中心点
map.enableScrollWheelZoom(); //能够滚动

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

console.log($.cookie("macId")); //存id
console.log($.cookie("mac")); //存mac
console.log($.cookie("startTime"));
console.log($.cookie("endTime"));

//获取父页面传来的macid
if($.cookie("mac")) $(".targetMac").text($.cookie("mac"));


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

//根据坐标解析地址
function map_click(lng, lat) {
	geoc = new BMap.Geocoder();
	var parsePoint = new BMap.Point(lng, lat);
	geoc.getLocation(parsePoint, function(rs) {
		var addComp = rs.addressComponents;
		sAddress = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
		localStorage.setItem("sAddress", sAddress);
	});
	return localStorage.getItem("sAddress");

}

//ws请求函数
function init(data) {
	if(typeof WebSocket != 'undefined'){
		aData = [];
	//	ws = new WebSocket("ws://103.251.36.122:9509/");
		ws = new ReconnectingWebSocket("ws://103.251.36.122:9509/");
		ws.onopen = function() {
			console.log("开始链接");
			ws.send(JSON.stringify(data));
		};
		ws.onmessage = function(e) {
			var mainData = JSON.parse(e.data);
			console.log(mainData);
		};
		ws.onclose = function() {
			console.log("关闭链接");
		};
		ws.onerror = function() {
			console.log("链接报错");
		};
	}
	else{
		layer.alert("该浏览器不支持查看实时数据，请更新到最新版本");
	}
}

//关闭ws请求函数
function onCloseClick() {
	console.log("手动关闭链接");
	ws.close();
	layer.msg("关闭链接了", {
		icon: 2,
		time: 1500
	}, function() {
		ws.close();
	});
}


//画地图目标的历史轨迹
function drawMAP(arr) {
	map.clearOverlays();
	if(arrPois.length > 0)
		arrPois.splice(0, arrPois.length);
	if(points.length > 0)
		points.splice(0, points.length);
	$.each(arr, function(i, v) {
		points.push(new BMap.Point(v.logAndLat[0], v.logAndLat[1]));
		arrPois.push(new BMap.Point(v.logAndLat[0], v.logAndLat[1]));
	});

	var s_JD = arr[0].logAndLat[0]; //开始点的经度
	var s_WD = arr[0].logAndLat[1]; //开始点的维度
	var e_JD = arr[arr.length - 1].logAndLat[0]; //结束点的经度
	var e_WD = arr[arr.length - 1].logAndLat[1]; //结束点的纬度
	
	//创建起点
	var pt_start = new BMap.Point(s_JD, s_WD); //开始点
	var startIcon = new BMap.Icon("../../images/start.png", new BMap.Size(36, 36));
	var markerStrat = new BMap.Marker(pt_start, {
		icon: startIcon
	}); // 创建标注
	map.addOverlay(markerStrat); // 将标注添加到地图中
	//创建终点
	var pt_end = new BMap.Point(e_JD, e_WD) //最后一个点
	var endIcon = new BMap.Icon("../../images/end.png", new BMap.Size(36, 36));
	var markerEnd = new BMap.Marker(pt_end, {
		icon: endIcon
	}); // 创建标注
	map.addOverlay(markerEnd); // 将标注添加到地图中
	
	map.centerAndZoom();
	map.setViewport(arrPois);
	marker = new BMap.Marker(arrPois[0], {
//		icon  : new BMap.Icon("../../images/icon.png",new BMap.Size(36,36)),
	});
	var label = new BMap.Label("目标", {
		offset: new BMap.Size(0, -30)
	});
	label.setStyle({
		border: "1px solid rgb(204, 204, 204)",
		color: "rgb(0, 0, 0)",
		borderRadius: "10px",
		padding: "5px",
		background: "rgb(255, 255, 255)",
	});
	marker.setLabel(label);

	map.addOverlay(marker);
	BMapLib.LuShu.prototype._move = function(initPos, targetPos, effect) {
		var pointsArr = [initPos, targetPos]; //点数组
		var me = this,
			//当前的帧数
			currentCount = 0,
			//步长，米/秒
			timer = 10,
			step = this._opts.speed / (1000 / timer),
			//初始坐标
			init_pos = this._projection.lngLatToPoint(initPos),
			//获取结束点的(x,y)坐标
			target_pos = this._projection.lngLatToPoint(targetPos),
			//总的步长
			count = Math.round(me._getDistance(init_pos, target_pos) / step);
		//显示折线 syj201607191107
		this._map.addOverlay(new BMap.Polyline(pointsArr, {
			strokeColor: "#c00",
			strokeWeight: 5,
			strokeOpacity: 0.5
		})); // 画线  
		//如果小于1直接移动到下一点
		if(count < 1) {
			me._moveNext(++me.i);
			return;
		}
		me._intervalFlag = setInterval(function() {
			//两点之间当前帧数大于总帧数的时候，则说明已经完成移动
			if(currentCount >= count) {
				clearInterval(me._intervalFlag);
				//移动的点已经超过总的长度
				if(me.i > me._path.length) {
					return;
				}
				//运行下一个点
				me._moveNext(++me.i);
			} else {
				currentCount++;
				var x = effect(init_pos.x, target_pos.x, currentCount, count),
					y = effect(init_pos.y, target_pos.y, currentCount, count),
					pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
				//设置marker
				if(currentCount == 1) {
					var proPos = null;
					if(me.i - 1 >= 0) {
						proPos = me._path[me.i - 1];
					}
					if(me._opts.enableRotation == true) {
						me.setRotation(proPos, initPos, targetPos);
					}
					if(me._opts.autoView) {
						if(!me._map.getBounds().containsPoint(pos)) {
							me._map.setCenter(pos);
						}
					}
				}
				//正在移动
				me._marker.setPosition(pos);
				//设置自定义overlay的位置
				me._setInfoWin(pos);
			}
		}, timer);
	};
	lushu = new BMapLib.LuShu(map, arrPois, {
		defaultContent: "目标", //"从天安门到百度大厦"
		autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
//		icon  : new BMap.Icon("../../images/icon.png",new BMap.Size(36,36)),
		speed: 2500,
		enableRotation: false, //是否设置marker随着道路的走向进行旋转
		landmarkPois: [{
			lng: points[2].lng,
			lat: points[2].lat,
			html: "我想静静，思考下人生...",
			pauseTime: 2
		}]

	});
		
	//===========加载历史轨迹============================
	marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
	marker.hide();
	lushu.start();
	//===========加载历史轨迹============================
}


	

//关闭ws请求
$(".closeLink").click(function() {
	onCloseClick();
});

//监控历史数据
$(".monitoring").click(function() {
	if(lushu){
		if(lushu.i < (commomArr.length - 1)) {  
	  		console.log(lushu.i);
	        layer.alert("请等待当前目标跑完.");   
	        return;  
	    }
	}
	//实时监控===模拟数据（异步）
	fnAjax.method_4(
		"../../json/Jingweidu.json",
		"",
		"get",
		function(data) {
			commomArr = data.data;
			drawMAP(commomArr);
	
		}
	);
	
	//实时监控==ws数据
	init({
		"mac": $.cookie("mac"),
		"type": "0",
		"old": "1",
		"starttime": $.cookie("startTime"),
		"endtime": $.cookie("endTime"),
		"timeScale": $("#timeScale").val()
	});
});



