$(".targetMac").text($.cookie("mac"));

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
//==================================================随机模拟伴随的目标经纬度模块==========================================================================
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
function intFloat(jd, wd, count) {
	lng_and_lat(jd, wd, count);
	setTimeout(function() {
		console.log(gcm);
		//			intFloat(jd,wd,count);//再次递归执行
		drawFlowMap(gcm);
	}, 100);
}
intFloat(113.953812, 22.549255, 10);
//==================================================随机模拟伴随的目标实时经纬度模块==========================================================================

//==============================================随机模拟目标mac的经纬度=====================================================================
//随机加载目标mac经纬度
function oMacfn(lng, lat) {
	var deviationV = 0.0005; //偏离值
	oMac.lng = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 1) * 1;
	oMac.lat = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 2) * 1;
}

function initOmac(jd, wd) {
	oMacfn(jd, wd);
	setTimeout(function() {
		//			console.log(oMac);
		drawMap(oMac.lng, oMac.lat);
	}, 100);
}
//	initOmac(113.953812, 22.549255);
//==============================================随机模拟目标mac的经纬度=====================================================================

//经纬度数组
var lngAndlat, map, marker, marker2, myIcon, geoc, aNewDate,sNewDate;
//画地图

//画出地图控件==================================================================================================
// 百度地图API功能
map = new BMap.Map("main");
var point = new BMap.Point(113.953812, 22.549255);
map.centerAndZoom(point, 25);

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

//	//自定义覆盖物控件=========================================================================================================================
//	// 复杂的自定义覆盖物  
		function ComplexCustomOverlay(point, text, mouseoverText) {
			this._point = point;
			this._text = text;
			this._overText = mouseoverText;
		}
		ComplexCustomOverlay.prototype = new BMap.Overlay();
		//初始化ComplexCustomOverlay  
		ComplexCustomOverlay.prototype.initialize = function(map) {
			this._map = map;
			var div = document.createElement("div");
			this._div = div;
			div.style.position = "absolute";
			div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
			div.style.backgroundColor = "#1589EE";
//			div.style.border = " 1px solid blue";
//			div.style.borderRadius = "5px";
			div.style.background = "url(../../images/markers.png) no-repeat 0 -0px";
			div.style.color = "#fff";
			div.style.height = "25px";
			div.style.width = "23px";
//			div.style.padding = "2px";
			div.style.overflow = "hidden";
			div.style.whiteSpace = "nowrap";
			div.style.MozUserSelect = "none";
			div.style.fontSize = "12px";
			div.setAttribute("class","signDiv");
			var span = document.createElement("span");
			this._span = span;
			div.appendChild(span);
			span.appendChild(document.createTextNode(this._text));
			var that = this;
			//var arrow = this._arrow = document.createElement("div");  
			var arrow = document.createElement("div");
			this._arrow = arrow;
			arrow.style.backgroundColor = "red";
			arrow.style.position = "absolute";
			arrow.style.width = "0px";
			arrow.style.height = "0px";
			arrow.style.top = "19px";
			arrow.style.left = "10px";
			arrow.style.overflow = "hidden";
			div.appendChild(arrow);
//		
			
			div.onmouseover = function() {				
				console.log(that._overText);
				console.log(that);
//				this.style.backgroundColor = "red";
//				this.getElementsByTagName("span")[0].innerHTML = that._overText;
				this.setAttribute("data",that._overText);
			}
			div.onmouseout = function() {
//				this.style.backgroundColor = "#1589EE";
//				this.getElementsByTagName("span")[0].innerHTML = that._text;
			}
			map.getPanes().labelPane.appendChild(div);
			return div;
		}
		//画ComplexCustomOverlay  
		ComplexCustomOverlay.prototype.draw = function() {
			var map = this._map;
			var pixel = map.pointToOverlayPixel(this._point);
			this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
			this._div.style.top = pixel.y - 30 + "px";
		}
		//添加监听事件  
		ComplexCustomOverlay.prototype.addEventListener = function(event, fun) {
			this._div['on' + event] = fun;
		}
		
		
		
		
var aJson = [
	{
		"name": "2017-06-13 12:12",
		"jd": 113.950512,
		"wd": 22.549255,
		"flag": "被监控者4|嫌疑人|",
		"add": "你大爷1"
	},
	{
		"name": "2017-05-13 12:12",
		"jd": 113.953412,
		"wd": 22.549255,
		"flag": "被监控者5|嫌疑人|",
		"add": "你大爷2"
	},
	{
		"name": "2017-04-13 12:12",
		"jd": 113.950512,
		"wd": 22.549055,
		"flag": "被监控者40|嫌疑人|",
		"add": "你大爷13"
	},
	{
		"name": "2017-03-13 12:12",
		"jd": 113.950412,
		"wd": 22.549255,
		"flag": "被监控者4|嫌疑人|",
		"add": "你大爷1"
	},
	{
		"name": "2017-02-13 12:12",
		"jd": 113.952412,
		"wd": 22.549255,
		"flag": "被监控者5|嫌疑人|",
		"add": "你大爷2"
	},
	{
		"name": "2017-01-13 12:12",
		"jd": 113.951512,
		"wd": 22.549055,
		"flag": "被监控者40|嫌疑人|",
		"add": "你大爷13"
	},
	{
		"name": "2017-06-13 22:12",
		"jd": 113.950112,
		"wd": 22.549255,
		"flag": "被监控者4|嫌疑人|",
		"add": "你大爷1"
	},
	{
		"name": "2017-06-14 12:12",
		"jd": 113.953412,
		"wd": 22.549955,
		"flag": "被监控者5|嫌疑人|",
		"add": "你大爷2"
	},
	{
		"name": "2017-06-15 12:12",
		"jd": 113.950512,
		"wd": 22.549855,
		"flag": "被监控者40|嫌疑人|",
		"add": "你大爷13"
	},
	{
		"name": "2017-06-16 12:12",
		"jd": 113.953102,
		"wd": 22.549255,
		"flag": "被监控者52|嫌疑人|",
		"add": "你大爷21"
	}
];

$(".monitoring").click(function(){
	setTimeout(function(){
		//显示数据在地图上的展示
		dataToShow(aJson);
		//重新渲染历史轨迹标示
		setTimeout(function(){
			aNewDate = [];
			$(".signDiv span").each(function(i){
				if($(this).text() != ""){//再此处做判断
					console.log($(this).text());
					$(this).attr(
						{"data":$(this).text(),"dataTime":new Date($(this).text()).getTime()}
					);
					sNewDate = new Date($(this).text()).getTime();
					aNewDate.push(sNewDate*1);
					$(this).text("");	
				}
			});
			setTimeout(function(){
				aNewDate = aNewDate.sort(NumAscSort);
				console.log(aNewDate);
				$.each(aNewDate, function(k,v) {
					$(".signDiv span").each(function(i){
						if(v == ($(this).attr("dataTime"))*1){
							$(this).parent().addClass("image_bg_"+k);
						}
					});
				});
			},100);
		},100);
	},1000);
	
});

//diy覆盖物函数事件处理
function dataToShow(json){
	for(var o in json) {
		var txt = json[o].name;
		var pointx = json[o].jd;
		var pointy = json[o].wd;
		//var mkr = new BMap.Marker(new BMap.Point(json[o].jd,json[o].wd));  
		var mkr = new ComplexCustomOverlay(new BMap.Point(pointx, pointy), txt, txt);
		map.addOverlay(mkr);
		(function() {
			var index = o;
			/* mkr.addEventListener('touchstart',function(){  
			    this.openInfoWindow(new BMap.InfoWindow('我是'+json[index].name));  
			}); */
			mkr.addEventListener('touchstart', function() {
				//把所有的驾校分离出来  
				var Arr = json[index].flag.split("|");
				//存放单个驾校  
				var jxArr;
				//驾校ID  
				var jxid;
				//驾校名称  
				var jxname;
				var content = '';
				content += "<div class='map' style='display:none;'>";
				content += "<div class='img' style='display:none;'>";
				content += "</div><div class='login' style='display:none;'>";
				for(var i = 0; i < Arr.length; i++) {
					jxArr = Arr[i].split('_');
					jxname = jxArr[0];
					jxid = jxArr[1];
					content += "<span><a >" + jxname + "</a></span>";
				}
				content += "</div><p>基地地址：" + json[index].add + "</p>";
				content += "</div>";
				var infoWindow = new BMap.InfoWindow(content, {
					title: "<h3 class='lt'>" + json[index].name + "</h3>", //标题                                        
					enableAutoPan: true, //自动平移  
					width: 300, //宽度    
					height: 160, //高度     
					enableMessage: false
				}); // 创建信息窗口对象  
				map.openInfoWindow(infoWindow, new BMap.Point(json[index].jd, json[index].wd)); // 打开信息窗口 */  
			});
			mkr.addEventListener('click', function() {
				//把所有的驾校分离出来  
				var Arr = json[index].flag.split("|");
				//存放单个驾校  
				var jxArr;
				//驾校ID  
				var jxid;
				//驾校名称  
				var jxname;
				var content = '';
				content += "<div class='map'>";
				content += "<div class='img'>";
				content += "</div><div class='login'>";
				for(var i = 0; i < Arr.length; i++) {
					jxArr = Arr[i].split('_');
					jxname = jxArr[0];
					jxid = jxArr[1];
					content += "<span><a>" + jxname + "</a></span>";
				}
				content += "</div><p>所在位置：" + map_click(json[index].jd, json[index].wd) + "</p>";
				content += "</div>";
				var infoWindow = new BMap.InfoWindow(content, {
					title: "<h3 class='lt'>" + json[index].name + "</h3>", //标题                                        
					enableAutoPan: true, //自动平移  
					width: 300, //宽度    
					height: 160, //高度     
					enableMessage: false
				}); // 创建信息窗口对象  
				map.openInfoWindow(infoWindow, new BMap.Point(json[index].jd, json[index].wd)); // 打开信息窗口 */  
			});
		})()
	}
}

//自定义覆盖物控件=========================================================================================================================

//画出地图控件==================================================================================================

//指定点的图标
myIcon = new BMap.Icon("../../images/markers.png",
	new BMap.Size(23, 25), //图标相对地图的指定经纬度的偏移
	{
		imageOffset: new BMap.Size(0, -300) //图标相对于图片本身的像素偏移
	}
);

//封装目标mac的指示物函数
function drawMap(lng, lat) {
	map.removeOverlay(marker);

	marker = new BMap.Marker(new BMap.Point(lng, lat));
	map.addOverlay(marker); //增加点
	marker.addEventListener("click", function(obj) {
		var p = this.getPosition();

		layer.alert('目标大概位置：' + map_click(p.lng, p.lat) + '<br/>坐标(' + p.lng + '，' + p.lat + ')');

	});
}

var flowPoint, sDate;
//封装目标mac的伴随mac数组指示物函数	
function drawFlowMap(lngAndlat) {
	//			map.removeOverlay(marker)
	//			map.clearOverlays();
	for(var i = 0; i < lngAndlat.length; i++) {
		flowPoint = new BMap.Marker(new BMap.Point((lngAndlat[i].lng) * 1, (lngAndlat[i].lat) * 1), {
			icon: myIcon
		});
		map.addOverlay(flowPoint);
		flowPoint.addEventListener("click", function(obj) {
			var p = this.getPosition();
			console.log(obj);
			layer.alert('伴随目标大概位置：' + map_click(p.lng, p.lat) + '<br/>坐标(' + p.lng + '，' + p.lat + ')');

		});
	}
}

//清除覆盖物
function remove_overlay() {
	//map.clearOverlays();
	map.removeOverlay(marker);
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

console.log($.cookie("macId")); //存id
console.log($.cookie("mac")); //存mac

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

//七日伴随
//fnAjax.method_4(
//	url_join(""), {
//		mac: $.cookie("mac"),
//		startTime: $.cookie("startTime"),
//		endTime: $.cookie("endTime")
//	},
//	"post",
//	function(data) {
//		console.log(data);
//		if(data.data.length > 0) {
//			//			$(".addressList").html("");
//			//			$.each(data.data, function(i,v) {
//			//				sLi = $('<li class="parentClear"><span class="address lf">'+v.address+'</span><span class="times rf">'+v.times+'</span></li>');
//			//				$(".addressList").append(sLi);
//			//			});
//		}
//
//	}
//);



