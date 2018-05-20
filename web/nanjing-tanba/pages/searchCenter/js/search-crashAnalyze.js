

//查询
//$(".queryTarget").click(function(){
//	$(".tableBox").show();
//	//静态分页
//	fnAjax.method_4(
//		"table.json",
//		{
//			"deviceCode":$("#deviceCode").val(),
//			"startTime":$("#logmin").val(),
//			"endTime":$("#logmin").val(),
//		},
//		"get",
//		function(d){
//			static_layPage(d.data,".table-data",10);
//		}
//	);
//	
//	
//	//动态分页
////	active_layPage.method_get(
////		"table.json",
////		"10",
////		".table-data",
////		function(d){
////			createTabel(".table-data",d.data)
////		}
////	);
//});

var addrIndex;
//静态分页
function static_layPage(data,ele,pageNum){//data,数据，ele表格类名,pageNum每页出现的数量
		var nums = pageNum; //每页出现的数量
		var pages = Math.ceil(data.length / nums); //得到总页数
		var thisDate = function(curr) {
			var str = '',
				last = curr * nums - 1;
			last = last >= data.length ? (data.length - 1) : last;
			for(var i = (curr * nums - nums); i <= last; i++) {
				str += '<tr class="text-c"><td><input type="checkbox"/></td><td>目标'+i+'</td><td>'+data[i].id+'</td><td>'+data[i].logins+'</td><td>'+data[i].city+'</td><td>'+data[i].city+'</td><td><a class="searchDetails">查看</a></td></tr>';
			}
			return str;
		};
		
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
function createTabel(ele,data){
	var str = "";
	for(var i=0;i<data.length;i++){
		str += '<tr class="text-c"><td><input type="checkbox"/></td><td>目标'+i+'</td><td>'+data[i].id+'</td><td>'+data[i].logins+'</td><td>'+data[i].city+'</td><td>'+data[i].city+'</td><td><a class="searchDetails">查看</a></td></tr>';
	}
	$(ele).children("tbody").html(str);
}

//动态分页
//输入参数：参数1请求路径；参数2，显示的条数；参数3，表格选择器(table)，参数4，回调的函数（创建表格）
//向后台传递的参数：itemNum（条数），pageNum（页数）；
//后台返回参数：count，显示的数据总条数；pageSum，显示的总页数；data（数组）主要数据
var active_layPage = {
	//动态分页--post
	method_post:function(Url,dataN,table,fn){
		fnAjax.method_4(
			Url,
			{
				"itemNum":dataN,
				"deviceCode":$("#deviceCode").val(),
				"startTime":$("#logmin").val(),
				"endTime":$("#logmin").val(),
				"location":$("#location").val()
			},
			"post",
			function(data){
				$(".pageNum").text(data.pageSum);//显示的总页数
				$(".dataNum").text(data.count);//显示的数据总条数
	//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
				if(parseInt(data.count) == 0){
					$(table).children("tbody").html("");
					$("#pageTool").html("当前没有数据！");
					$(".pageNum").text(0);//显示的总页数
					$(".dataNum").text(0);//显示的数据总条数
				}
				else if(parseInt(data.count) > 0){
					fn(data);
					laypage({
						cont: "pageTool",//控制分页容器，
						pages: data.pageSum,//总页数
						skip: true, //是否开启跳页
					    groups: 3, //连续显示分页数
					    first: '首页', //若不显示，设置false即可
					    last: '尾页', //若不显示，设置false即可
					    prev: '<', //若不显示，设置false即可
					    next: '>', //若不显示，设置false即可
					    hash: true, //开启hash
						jump: function(obj,first) {
							
							if (!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
					            fnAjax.method_4(
					            	Url,
					            	{
										"itemNum":dataN,
										"deviceCode":$("#deviceCode").val(),
										"startTime":$("#logmin").val(),
										"endTime":$("#logmin").val(),
										"location":$("#location").val(),
										"pageNum":obj.curr
									},
					            	"post",
					            	function(d){
										fn(d);
								    }
					            );
					       }
							
						}
					}
			);
				
				$("body").delegate(".laypage_btn","click",function(){
					fnAjax.method_4(
						Url,
						{
							"itemNum":dataN,
							"deviceCode":$("#deviceCode").val(),
							"startTime":$("#logmin").val(),
							"endTime":$("#logmin").val(),
							"location":$("#location").val(),
							"pageNum":$(".laypage_skip").val()
						},
						"post",
						function(data){
							fn(data);
					    }
					);
				});
				
			}
			
	    });
	},
	//动态分页--get
	method_get:function(Url,dataN,table,fn){
		fnAjax.method_4(
			Url,
			{
				"itemNum":dataN,
				"deviceCode":$("#deviceCode").val(),
				"startTime":$("#logmin").val(),
				"endTime":$("#logmin").val(),
				"location":$("#location").val()
			},
			"get",
			function(data){
				$(".pageNum").text(data.pageSum);//显示的总页数
				$(".dataNum").text(data.count);//显示的数据总条数
	//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
				if(parseInt(data.count) == 0){
					$(table).children("tbody").html("");
					$("#pageTool").html("当前没有数据！");
					$(".pageNum").text(0);//显示的总页数
					$(".dataNum").text(0);//显示的数据总条数
				}
				else if(parseInt(data.count) > 0){
					fn(data);
					laypage({
						cont: "pageTool",//控制分页容器，
						pages: data.pageSum,//总页数
						skip: true, //是否开启跳页
					    groups: 3, //连续显示分页数
					    first: '首页', //若不显示，设置false即可
					    last: '尾页', //若不显示，设置false即可
					    prev: '<', //若不显示，设置false即可
					    next: '>', //若不显示，设置false即可
					    hash: true, //开启hash
						jump: function(obj,first) {
							
							if (!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
					            fnAjax.method_4(
					            	Url,
					            	{
										"itemNum":dataN,
										"deviceCode":$("#deviceCode").val(),
										"startTime":$("#logmin").val(),
										"endTime":$("#logmin").val(),
										"location":$("#location").val(),
										"pageNum":obj.curr
									},
					            	"get",
					            	function(d){
										fn(d);
								    }
					            );
					        }
							
						}
					});
				
					$("body").delegate(".laypage_btn","click",function(){
					fnAjax.method_4(
						Url,
						{
							"itemNum":dataN,
							"deviceCode":$("#deviceCode").val(),
							"startTime":$("#logmin").val(),
							"endTime":$("#logmin").val(),
							"location":$("#location").val(),
							"pageNum":$(".laypage_skip").val()
						},
						"get",
						function(data){
							fn(data);
					    }
					);
				});
				
				}
			
	    });
	}
};

$(".form").Validform({
	btnSubmit: ".queryTarget",
	beforeSubmit: function(curform) {
		ajaxFn();
	},
	callback: function() {
		return false;
	}

});

//封装查询目标请求函数
	function ajaxFn() {
		var addreAndTime = [];//碰撞时间和地点
		$(".areaInputBox input").each(function(i){
	//		$(this).attr("data-id")
			addreAndTime.push({
				"addr":$(this).attr("data-id"),
				"time":$(".Wdate").eq(i).val(),
				"value":$(this).val()
			});
		});
		setTimeout(function(){
			console.log(addreAndTime);
			fnAjax.method_4(
				url_join3("impact/query"),
				{
					"impactSetting":addreAndTime,
					"impactCount":$("#crashTimes").val(),
					"impactFloatBand":$("#floatTime").val()
				},
				"post",
				function(data){
					console.log(data);
					layer.alert("功能待完善...");
					if(data.data == null || data.data.length == 0){
						layer.alert("暂无数据");
						$(".table-data tbody").html("");
						$(".pageNum,.dataNum").text("0");
					}else{
						//动态分页
						//	active_layPage.method_get(
						//		"table.json",
						//		"10",
						//		".table-data",
						//		function(d){
						//			createTabel(".table-data",d.data)
						//		}
						//	);
					}
					
				}
			);
		},100);
		
	}
	
//获取模板列表
fnAjax.method_4(
	url_join3("impact"),
	"",
	"get",
	function(data){
		console.log(data);
		
		$("#template").html($('<option value="0">选择模板</option>'));
		$.each(data.data, function(i,v) {
			var sHtml = $('<option value="'+v.id+'">模板:'+v.iTempName+'</option>');
			$("#template").append(sHtml);
		});
		
		
	}
);
	
//添加 保存模板
$(".saveTemplate").click(function(){	
	layer.prompt(
		{
			formType: 0,
			value: '模板名称',
			title: '请输入要添加的模板名称'
		},
		function(value, index, elem) {
			var addreAndTime = [];//碰撞时间和地点
			$(".areaInputBox input").each(function(i){
				addreAndTime.push({					
					"addr":$(this).attr("data-id"),
					"time":$(".Wdate").eq(i).val(),
					"value":$(this).val()
				});
			});
			setTimeout(function(){
				console.log(addreAndTime);
				fnAjax.method_4(
					url_join3("impact/new"),
					{
						"templateName":value,
						"impactSetting":addreAndTime,
						"impactCount":$("#crashTimes").val(),
						"impactFloatBand":$("#floatTime").val()
					},
					"post",
					function(data){
						console.log(data);
						
						layer.msg("操作成功！",{icon:1,time:1500},function(){
							location.reload();
						});
						
					}
				);
			},100);
		}
	);
	
	
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



//查询  指定加载某个模板
$("#template").change(function(){
	if($(this).val() != "0"){
		fnAjax.method_4(
			url_join3("impact/"+$(this).val()),
			"",
			"get",
			function(data){
				console.log(data);
				
					//回显数据
				console.log(JSON.parse(data.data.jImpactSetting));
				$("#crashTimes").val(data.data.iImpactCount);
				$("#floatTime").val(data.data.iImpactFloatBand);
				
				var addrAndTime = JSON.parse(data.data.jImpactSetting);
				$.each(addrAndTime, function(i,v) {
					$(".areaInputBox input").eq(i).val(v.value).attr("data-id",v.addr);
					$(".Wdate").eq(i).val(v.time);
				});
					
				
	
			}
		);
	}
	
});

//删除模板
$(".delTemplate").click(function(){
	if($("#template").val() == "0"){
		layer.alert("请选择模板才能删除！");
	}else{
		fnAjax.method_4(
			url_join3("impact/del/"+$("#template").val()),
			"",
			"get",
			function(data){
				console.log(data);
				
				layer.msg("操作成功！",{icon:1,time:1500},function(){
					location.reload();
				});
			}
		);
	}
});

//查看目标详情界面
$("body").delegate(".searchDetails","click",function(){
	$.cookie("macId",$(this).attr("data-id"));//存id
	$.cookie("mac",$(this).parent().siblings(".mac").text());//存mac
	var index = layer.open({
		type: 2,
		title: "目标详情信息",
		content: "search-queryTarget-details.html",
	});
	layer.full(index);
});