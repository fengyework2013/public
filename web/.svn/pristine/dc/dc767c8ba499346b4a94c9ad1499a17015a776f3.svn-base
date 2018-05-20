

//目标伴随表格，创建表格,ele指的是table的选择器。data指的是数组数据
function createTabel(ele, d) {
	var data = d.data;
	var str = "";
	for(var i = 0; i < data.length; i++) {
		str += '<tr class="text-c" data-id="' + data[i].id + '"><td><input type="checkbox"/></td><td class="sortTd">' + (d.from + i) + '</td><td class="username">' + data[i].username + '</td><td class="mac">' + data[i].mac + '</td><td class="phone">' + data[i].Tel + '</td><td>' + data[i].time + '</td><td class="td-option"><a class="editBtn" href="#">编辑</a><a class="delBtn" href="#">删除</a></td></tr>';
	}
	$(ele).children("tbody").html(str);
	
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
				"itemNum": dataN,
				"page":"1",
				"keyWord":$("#keyWord").val()
//				"deviceCode": $("#deviceCode").val(),
//				"startTime": $("#logmin").val(),
//				"endTime": $("#logmax").val(),
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
//										"deviceCode": $("#deviceCode").val(),
//										"startTime": $("#logmin").val(),
//										"endTime": $("#logmax").val(),
										"keyWord":$("#keyWord").val(),
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
//								"deviceCode": $("#deviceCode").val(),
//								"startTime": $("#logmin").val(),
//								"endTime": $("#logmax").val(),
								"keyWord":$("#keyWord").val(),
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



//分页查询（页面初始化）
active_layPage.method_post(
	url_join("PersonManage/queryPerson"),
	10,
	".table-data",
	function(data){
		console.log(data);
		createTabel(".table-data", data);
		
	}
);

//人员添加
$(".addUserBtn").click(function(){
	localStorage.setItem("clickType","add");
	layer.open({
	  type: 2,
//	  area: ['600px', '500px'],
	  area: ['100%', '100%'],
	  fixed: false, //不固定
	  maxmin: true,
	  title:"人员添加",
	  content: 'people-add.html'
	});
});

//人员删除
$("body").delegate(".delBtn","click",function(){
	var obj = $(this);
	var index = layer.confirm("确定删除？",function(){
		fnAjax.method_5(
			url_join("PersonManage/delPerson"),
			{"id":obj.parents("tr").attr("data-id")},
			"post",
			function(data){
				layer.msg("操作成功",{icon:1,time:1500},function(){
					location.reload();
				});
			}
		);
	});
});

//人员编辑
$("body").delegate(".editBtn","click",function(){
	localStorage.setItem("clickType","edit");//存点击类型
	localStorage.setItem("peopleId",$(this).parents("tr").attr("data-id"));//存id
	localStorage.setItem("peopleName",$(this).parents("tr").children(".username").text());//存姓名
	localStorage.setItem("peopleMac",$(this).parents("tr").children(".mac").text());//存mac
	localStorage.setItem("peoplePhone",$(this).parents("tr").children(".phone").text());//存手机
	layer.open({
	  type: 2,
//	  area: ['600px', '500px'],
	  area: ['100%', '100%'],
	  fixed: false, //不固定
	  maxmin: true,
	  title:"人员编辑",
	  content: 'people-add.html'
	});
});

//模糊查询
$("#queryBtn").click(function(){
	active_layPage.method_post(
		url_join("PersonManage/queryPerson"),
		10,
		".table-data",
		function(data){
			console.log(data);
			createTabel(".table-data", data);
			
		}
	);
});

$("#keyWord").keyup(function(){
	debounce(function(){
		active_layPage.method_post(
			url_join("PersonManage/queryPerson"),
			10,
			".table-data",
			function(data){
				console.log(data);
				createTabel(".table-data", data);
				
			}
		);
	},1000);
});