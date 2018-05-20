
//静态分页
function static_layPage(data,ele,pageNum){//data,数据，ele表格类名,pageNum每页出现的数量
		var nums = pageNum; //每页出现的数量
		var pages = Math.ceil(data.length / nums); //得到总页数
		var thisDate = function(curr) {
			var str = '',
				last = curr * nums - 1;
			last = last >= data.length ? (data.length - 1) : last;
			for(var i = (curr * nums - nums); i <= last; i++) {
				str += '<tr class="text-c"><td><input type="checkbox"/></td><td class="sortTd">'+(i+1)+'</td><td>' + data[i].address1 + '</td><td>' + data[i].time + '</td><td>' + data[i].state + '</td><td class="mac">'+data[i].mac+'</td><td>'+data[i].mobile+'</td><td class="td-option"><a class="searchDetails" data-id="'+data[i].id+'">查看</a></td></tr>';
			}
			return str;
		};
		//总页数和总条数
		$(".pageNum").text(pages);
		$(".dataNum").text(data.length);
		//调用分页
		laypage({
			cont: "pageTool", //控制分页容器，biuuu_city3
			pages: pages, //总页数
			skip: true, //是否开启跳页
		    groups: 3, //连续显示分页数
		    first: '首页', //若不显示，设置false即可
		    last: '尾页', //若不显示，设置false即可
		    prev: '<', //若不显示，设置false即可
		    next: '>', //若不显示，设置false即可
		    hash: true, //开启hash
			jump: function(obj) {
//				console.log(thisDate(obj.curr));
				$(ele).children("tbody").html(thisDate(obj.curr));
			}
		});
}

//创建表格,ele指的是table的选择器。data指的是数组数据
function createTabel(ele,d){
	var data = d.data;
	var str = "";
	for(var i = 0; i < data.length; i++) {
		str += '<tr class="text-c"><td><input type="checkbox"/></td><td class="sortTd">'+(d.from+i)+'</td><td>' + data[i].address + '</td><td>'+data[i].time+'</td><td class="comeAndGo" data-state="'+data[i].inOut+'"></td><td>'+data[i].deviceMac+'</td><td class="targetPhone">'+data[i].phone+'</td><td class="td-option"><a class="searchDetails">查看</a></td></tr>';
	}
	$(ele).children("tbody").html(str);
	setTimeout(function(){
		//回显出入状态和电话
		$(".comeAndGo").each(function(k){
			if($(this).attr("data-state") == "1"){
				$(this).text("入");
			}
			if($(this).attr("data-state") == "2"){
				$(this).text("出");
			}
		});
		
		$(".targetPhone").each(function(k){
			if($(this).text() == "null" || $(this).text() == "undefined"){
				$(this).text("暂无");
			}
		});
	},100);
}

//动态分页
	//输入参数：参数1请求路径；参数2，显示的条数；参数3，表格选择器(table)，参数4，回调的函数（创建表格）
	//向后台传递的参数：itemNum（条数），pageNum（页数）；
	//目标查询：后台返回参数：total，显示的数据总条数；last_page，显示的总页数；data（数组）主要数据
	var active_layPage = {
		//动态分页--post
		method_post: function(Url, dataN, table, fn) {
			fnAjax.method_5(
				Url, {
					"pageSize": dataN,
					"mac": $("#deviceCode").val(), //目标设别码参数（mac、手机、misi）
					"startTime": $("#logmin").val(), //开始采集时间
					"endTime": $("#logmax").val(), //结束采集时间
					"areaId":$("#address_1").attr("data-id")
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
											"pageSize": dataN,
											"mac": $("#deviceCode").val(), //目标设别码参数（mac、手机、misi）
											"startTime": $("#logmin").val(), //开始采集时间
											"endTime": $("#logmax").val(), //结束采集时间
											"areaId":$("#address_1").attr("data-id"),
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
									"pageSize": dataN,
									"mac": $("#deviceCode").val(), //目标设别码参数（mac、手机、misi）
									"startTime": $("#logmin").val(), //开始采集时间
									"endTime": $("#logmax").val(), //结束采集时间
									"areaId":$("#address_1").attr("data-id"),
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

//封装查询目标
function ajaxFn(){
	if($("#address_1").val() == ""){
		layer.alert("请选择出现位置",{icon:0});
	}
	else{
		$(".tanbaOrMac").text("探霸ID");
		$(".table-title").text("目标数据列表").attr("data-state","1");
		$.cookie("startTime",$("#logmin").val());
		$.cookie("endTime",$("#logmax").val());
		$.cookie("mac",$("#deviceCode").val());
		//分页查询
		active_layPage.method_post(
			url_join2("inAndOut"),
			10,
			".table-data",
			function(data){
				console.log(data);
				createTabel(".table-data", data);
			}
		);
	}
}

//封装伴随
function ajaxFn2(){
	if($("#address_1").val() == ""){
		layer.alert("请选择出现位置",{icon:0});
	}
	else{
		$(".tanbaOrMac").text("设备识别码");
		$(".table-title").text("伴随数据列表").attr("data-state","2");
		$.cookie("startTime",$("#logmin").val());
		$.cookie("endTime",$("#logmax").val());
		fnAjax.method_4(
			"../../json/common.json",
			{
				"mac": $("#deviceCode").val(), //目标设别码参数（mac、手机、misi）
				"startTime": $("#logmin").val(), //开始采集时间
				"endTime": $("#logmax").val(), //结束采集时间
				"areaId":$("#address_1").attr("data-id")
			},
			"get",
			function(d) {
				static_layPage(d.data, ".table-data", 10);
			}
		);
	}
}
//查询目标
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
	tiptype:1,
	callback: function() {
		return false;
	}

});

//获取采集地点
$(".chooseAdress").click(function(){
	var obj = $(this);
	$.cookie("getAddress",$(this).attr("data"));
	addrIndex = layer.open({
	  type: 2,
	  area: ['600px', '500px'],
	  fixed: false, //不固定
	  maxmin: true,
	  content: 'ztree-area-search-one.html',
	  end: function() {
	  	//layer子页面传值
	  	console.log($.cookie("addressInfo"));
		var oAddress = JSON.parse($.cookie("addressInfo"));
		console.log(oAddress);
		obj.prev()
			.val(oAddress.text).attr(
				{"data-id":oAddress.id,"readonly":"readonly"}
			);
	  }
	});
});

//查看目标详情界面
	$("body").delegate(".searchDetails","click",function(){
//		
		if($(".table-title").attr("data-state") == "1"){//目标
			var index = layer.open({
				type: 2,
				title: "目标详情信息",
				content: "search-queryTarget-details.html",
			});
			layer.full(index);
		}else{
			$.cookie("macId",$(this).attr("data-id"));//存id
			$.cookie("mac",$(this).parent().siblings(".mac").text());//存mac
			var index = layer.open({
				type: 2,
				title: "目标详情信息",
				content: "search-queryTarget-details.html",
			});
			layer.full(index);
		}
		
	});