$(function() {
	//动态分页
	//输入参数：参数1请求路径；参数2，显示的条数；参数3，表格选择器(table)，参数4，回调的函数（创建表格）
	//向后台传递的参数：itemNum（条数），pageNum（页数）；
	//目标查询：后台返回参数：total，显示的数据总条数；last_page，显示的总页数；data（数组）主要数据
	var active_layPage = {
		//动态分页--post
		method_post: function(Url, dataN, table, fn) {
			fnAjax.method_5(
				Url, {
					"itemNum": dataN,
					"deviceCode": $("#deviceCode").val(),
					"startTime": $("#logmin").val(),
					"endTime": $("#logmax").val(),
					//				"location":$("#location").val()
				},
				"post",
				function(data) {
					$(".pageNum").text(data.data.last_page); //显示的总页数
					$(".dataNum").text(data.data.total); //显示的数据总条数
					//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
					if(parseInt(data.data.total) == 0) {
						$(table).children("tbody").html("");
						$("#pageTool").html("当前没有数据！");
						$(".pageNum").text(0); //显示的总页数
						$(".dataNum").text(0); //显示的数据总条数
					} else if(parseInt(data.data.total) > 0) {
						fn(data.data);
						laypage({
							cont: "pageTool", //控制分页容器，
							pages: data.data.last_page, //总页数
							skip: true, //是否开启跳页
							groups: 3, //连续显示分页数
							first: '首页', //若不显示，设置false即可
							last: '尾页', //若不显示，设置false即可
//							prev: '<', //若不显示，设置false即可
//							next: '>', //若不显示，设置false即可
							hash: true, //开启hash
							jump: function(obj, first) {

								if(!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
									fnAjax.method_5(
										Url, {
											"itemNum": dataN,
											"deviceCode": $("#deviceCode").val(),
											"startTime": $("#logmin").val(),
											"endTime": $("#logmax").val(),
											//										"location":$("#location").val(),
											"page": obj.curr
										},
										"post",
										function(d) {
											fn(d.data);
										}
									);
								}

							}
						});

						$("body").delegate(".laypage_btn", "click", function() {
							fnAjax.method_5(
								Url, {
									"itemNum": dataN,
									"deviceCode": $("#deviceCode").val(),
									"startTime": $("#logmin").val(),
									"endTime": $("#logmax").val(),
									//							"location":$("#location").val(),
									"page": $(".laypage_skip").val()
								},
								"post",
								function(data) {
									fn(data.data);
								}
							);
						});

					}

				});
		}
		
	};

	var oMac = {}; //目标
	var timer,lngAndlat, map, marker, marker2, myIcon, geoc,aTarget;
	
	$(".form").Validform({
		btnSubmit: ".accompanyTarget,.queryTarget",
		beforeSubmit: function(curform) {
			setTimeout(function(){
				if($.cookie("btnType") == "查询"){
					ajaxFn();
				}else{
					ajaxFn2();
				}
			},100);
			
		},
		callback: function() {
			return false;
		}
	
	});
	
	//收缩table面板
	$(".cutBtn").click(function(event) {
		$(this).parents(".tableBox").hide();
		return false;
	});
	
		//加入关注
	$(".attention").click(function() {
		aTarget = [];
		aTarget.push($("#deviceCode").val());
		setTimeout(function() {
			fnAjax.method_5(
				url_join("Follow/addFollow"),
				{
					"dataArr": aTarget //加入关注参数，数组类型				
				},
				"post",
				function(data) {
					console.log(data);
					layer.msg(data.message,{icon:1,time:1500});
				}
			);
		},100);

	});
	
	//查询mac详情
	$("body").delegate(".searchDetails","click",function(){
		if($(".header-title").attr("data-sign") == "1"){//目标
			var obj = $(this).parent().siblings(".targetAddr");
			initOmac((obj.attr("data-lng"))*1,(obj.attr("data-lat"))*1);
			layer.open({
			  type: 2,
		//	  area: ['600px', '500px'],
			  area: ['100%', '100%'],
			  fixed: false, //不固定
			  maxmin: true,
			  title:"专属目标详情信息",
			  content: 'search-exclusiveEq-detialis.html'
			});
		}else{
			$.cookie("macId",$(this).attr("data-id"));//存id
			$.cookie("mac",$(this).parent().siblings(".mac").text());//存mac
			layer.open({
			  type: 2,
		//	  area: ['600px', '500px'],
			  area: ['100%', '100%'],
			  fixed: false, //不固定
			  maxmin: true,
			  title:"专属目标详情信息",
			  content: 'search-exclusiveEq-detialis.html'
			});
		}
		
	});
	
	
	
	
	//画地图
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
	
	//指定点的图标
	myIcon = new BMap.Icon("../../images/markers.png",
		new BMap.Size(23, 25), //图标相对地图的指定经纬度的偏移
		{
			imageOffset: new BMap.Size(0, -300) //图标相对于图片本身的像素偏移
		}
	);
	initOmac(113.953812, 22.549255);
	
	//封装查询专属目标请求函数
	function ajaxFn() {
		$(".tableBox").show();
		$(".tanbaOrMac").text("探霸ID");
		$(".addrOrPhone").text("出现地点");
		$(".header-title").text("目标查询结果").attr("data-sign","1");
		$(".table-data thead th:first-child").addClass("hide");
		$.cookie("startTime",$("#logmin").val());
		$.cookie("endTime",$("#logmax").val());
		$.cookie("mac",$("#deviceCode").val());

		
		//分页查询
		active_layPage.method_post(
			url_join("Follow/queryRfbase"),
			10,
			".table-data",
			function(data){
				console.log(data);
				createTabel(".table-data", data);
				
			}
		);
	
	}
	
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
//			localStorage.setItem("sAddress", sAddress);
			$.cookie("sAddress", sAddress);
		});
//		return localStorage.getItem("sAddress");
		return $.cookie("sAddress");
	}

//==============================================随机模拟目标mac的经纬度=====================================================================
	//随机加载目标mac经纬度
	function oMacfn(lng, lat) {
		var deviationV = 0.0005; //偏离值
		oMac.lng = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 1) * 1;
		oMac.lat = getData(lng + deviationV, lng - deviationV, lat + deviationV, lat - deviationV, 2) * 1;
	}
	//封装目标mac的指示物函数
	function drawMap(lng, lat) {
		map.removeOverlay(marker);
		
		marker = new BMap.Marker(new BMap.Point(lng, lat));
		map.addOverlay(marker); //增加点
		marker.addEventListener("click",function(obj){
			var p = this.getPosition();
			layer.alert('目标大概位置：' + map_click(p.lng, p.lat) + '<br/>坐标(' + p.lng + '，' + p.lat + ')');
			
		});
	}
	function initOmac(jd,wd) {
		oMacfn(jd,wd);
		setTimeout(function() {
//			console.log(oMac);
//			drawMap(oMac.lng, oMac.lat); 
			drawMap(jd,wd); 
		}, 100);
	}
	
//==============================================随机模拟目标mac的经纬度=====================================================================
	//创建表格,ele指的是table的选择器。data指的是数组数据
	function createTabel(ele, d) {
		var data = d.data;
		var str = "";
		for(var i = 0; i < data.length; i++) {
			str += '<tr class="text-c" data-id="'+data[i].id+'"><td class="hide"><input type="checkbox"/></td><td class="sortTd">'+(d.from+i)+'</td><td>' + data[i].tbid + '</td><td class="targetAddr" data-lng="'+data[i].longitude+'" data-lat="'+data[i].latitude+'"></td><td>' + data[i].count + '</td><td class="td-option"><a class="searchDetails">查看</a></td></tr>';
		}
		$(ele).children("tbody").html(str);
		
		//回显地址
		setTimeout(function(){
			$(".targetAddr").each(function(j){
				$(this).text(map_click(($(this).attr("data-lng"))*1, ($(this).attr("data-lat"))*1));
			});
		},100);
	}
	


	

	
});