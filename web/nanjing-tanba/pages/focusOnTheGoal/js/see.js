

//创建表格,ele指的是table的选择器。data指的是数组数据
function createTabel(ele, data) {
	var d = data;
	console.log(d);
	//	var str = "";
	//	for(var i=0;i<data.length;i++){
	//		str += '<tr class="text-c"><td>' + data[i].sTaskName + '</td><td>'+data[i].created_at+'</td><td>admin</td><td>'+data[i].iStartTime+'</td><td>'+data[i].iEndTime+'</td><td><a class="searchDetails">查看</a></td><td><a class="set" onclick="set(' +data[i].id +')">编辑&nbsp;  </a><a class="stop" onclick="stop(' +data[i].id +')">  停止</a></td></tr>';
	//	}
	//	$(ele).children("tbody").html(str);
	$('tbody tr').remove();
	$.each(d, function(item, ele) {
		var $tr = $('<tr class="text-c" ></tr>');
		$('<td></td>').text(ele['targetName']).appendTo($tr);
		$('<td></td>').text(ele['time']).appendTo($tr);
		$('<td></td>').text(ele['address']).appendTo($tr);
		$tr.appendTo($('tbody'));

	});

}



//动态分页
//输入参数：参数1请求路径；参数2，显示的条数；参数3，表格选择器(table)，参数4，回调的函数（创建表格）
//向后台传递的参数：itemNum（条数），pageNum（页数）；
//后台返回参数：count，显示的数据总条数；pageSum，显示的总页数；data（数组）主要数据
var active_layPage = {
	//动态分页--post
	method_post: function(Url, dataN, table, fn) {
		fnAjax.method_4(
			Url, {
				"itemNum": dataN,
				"page": 1,
				"id": $.cookie("seeId")
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
					fn(data);
					laypage({
						cont: "pageTool", //控制分页容器，
						pages: data.data.last_page, //总页数
						skip: true, //是否开启跳页
						groups: 3, //连续显示分页数
						first: '首页', //若不显示，设置false即可
						last: '尾页', //若不显示，设置false即可
						prev: '<', //若不显示，设置false即可
						next: '>', //若不显示，设置false即可
						hash: true, //开启hash
						jump: function(obj, first) {

							if(!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
								fnAjax.method_4(
									Url, {
										"itemNum": dataN,
										"id":$.cookie("seeId"),
										"pageNum": obj.curr
									},
									"post",
									function(d) {
										fn(d);
									}
								);
							}

						}
					});

					$("body").delegate(".laypage_btn", "click", function() {
						fnAjax.method_4(
							Url, {
								"itemNum": dataN,
								"id":$.cookie("seeId"),
								"pageNum": $(".laypage_skip").val()
							},
							"post",
							function(data) {
								fn(data);
							}
						);
					});

				}

			});
	},
	//动态分页--get
	method_get: function(Url, dataN, table, fn) {
		fnAjax.method_4(
			Url, {
				"itemNum": dataN, //表格一页显示的数量
				"deviceCode": $("#deviceCode").val(),
				"startTime": $("#logmin").val(),
				"endTime": $("#logmin").val(),
				"location": $("#location").val()
			},
			"get",
			function(data) {

				$(".pageNum").text(data.pageSum); //显示的总页数
				$(".dataNum").text(data.count); //显示的数据总条数
				//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
				if(parseInt(data.data.total) == 0) {
					$(table).children("tbody").html("");
					$("#pageTool").html("当前没有数据！");
					$(".pageNum").text(0); //显示的总页数
					$(".dataNum").text(0); //显示的数据总条数
				} else if(parseInt(data.data.total) > 0) {
					fn(data);
					$(".pageNum").text(data.data.last_page); //显示的总页数
					$(".dataNum").text(data.data.total); //显示的数据总条数
					laypage({
						cont: "pageTool", //控制分页容器，
						pages: data.data.last_page, //总页数
						skip: true, //是否开启跳页
						groups: 3, //连续显示分页数
						first: '首页', //若不显示，设置false即可
						last: '尾页', //若不显示，设置false即可
						prev: '<', //若不显示，设置false即可
						next: '>', //若不显示，设置false即可
						hash: true, //开启hash
						jump: function(obj, first) {

							if(!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
								fnAjax.method_4(
									Url, {
//										"itemNum": dataN,
										"deviceCode": $("#deviceCode").val(),
										"startTime": $("#logmin").val(),
										"endTime": $("#logmax").val(),
										"location": $("#location").val(),
										"page": obj.curr
									},
									"get",
									function(d) {
										fn(d);

									}
								);
							}

						}
					});

					$("body").delegate(".laypage_btn", "click", function() {
						fnAjax.method_4(
							Url, {
								"itemNum": dataN,
								"deviceCode": $("#deviceCode").val(),
								"startTime": $("#logmin").val(),
								"endTime": $("#logmax").val(),
								"location": $("#location").val(),
								"pageNum": $(".laypage_skip").val()
							},
							"get",
							function(data) {
								fn(data);

							}
						);
					});

				}

			});
	}
};

//动态分页
active_layPage.method_post(
	url_join3("Follow/queryFirstWarn"),
	"10",
	".table-data",
	function(d) {
		setTimeout(function() {
			createTabel(".table-data", d.data.data);
		}, 500)

	}
);