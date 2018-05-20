

//创建表格,ele指的是table的选择器。data指的是数组数据
function createTabel(ele, data) {
	var d = data;

	$('tbody tr').remove();
	$.each(d, function(item, ele) {
		var status = ele['status'];
		switch(status) {
			case 0:
				status = "<a  class='set' href='javascript:void(0)' onclick='join(" + ele['id'] + ")' title='加入预警'>加入预警 </a>";
				break;
			case 1:
				status = "<a  class='set' href='javascript:void(0)' onclick='see(" + ele['id'] + ")' title='查看'>查看</a>";
				break;
			default:
				break;
		}

		var iStatus = ele['flag'];
		switch(iStatus) {
			case 1:
				iStatus = "<a  class='set' href='javascript:void(0)' onclick='edit(" + ele['id'] + ")' title='编辑'>编辑 &nbsp;</a><a  class='set' href='javascript:void(0)' title='取消关注' onclick='cancel(" + ele['id'] + ")'>取消关注</a>";
				break;
			case 0:
				iStatus = "<a class='set' href='javascript:void(0)' onclick='edit(" + ele['id'] + ")' title='编辑'>编辑 &nbsp;</a><a class='set' href='javascript:void(0)' title='关注' onclick='follow(" + ele['id'] + ")'>关注</a>";
				break;
			default:
				break;
		}
		
		var monitor = "<a  class='set monitor' href='javascript:void(0)'  data-mac=" + ele['mac']+ " title='监控'>监控 &nbsp;</a>";
		var query = "<a  class='set query' href='javascript:void(0)' data-mac=" + ele['mac']+ " title='查询'>查询 &nbsp;</a>";
		var $tr = $('<tr class="text-c" ></tr>');
		$('<td></td>').text(ele['mac']).appendTo($tr);
		$('<td></td>').text(ele['startTime']).appendTo($tr);
		$('<td></td>').text(ele['userName']).appendTo($tr);
		$('<td></td>').html(status).appendTo($tr);
		$('<td></td>').html(monitor).appendTo($tr);
		$('<td></td>').html(query).appendTo($tr);
		$('<td></td>').html(iStatus).appendTo($tr);

		$tr.appendTo($('tbody'));

	});
}

//关注
function follow(id){
	fnAjax.method_4(url_join("Follow/startFollow"),{"id":id}, "post", function(data) {
		if(data.code == 0) {
			layer.msg(data.message, {
				icon: 1,
				time: 2000
			}, function() {
				parent.location.reload();
				//										parent.parent.location.reload();
			});
		} else {
			layer.msg(data.message, {
				icon: 2,
				time: 2000
			});
		}
	})
}
//取消关注
function cancel(id){
	fnAjax.method_4(url_join("/Follow/stopFollow/"+id), '', "post", function(data) {
		if(data.code == 0) {
			layer.msg(data.message, {
				icon: 1,
				time: 2000
			}, function() {
				parent.location.reload();
				//										parent.parent.location.reload();
			});
		} else {
			layer.msg(data.message, {
				icon: 2,
				time: 2000
			});
		}
	})
}



//监控
$("body").delegate(".monitor","click",function(){
	var mac=$(this).attr("data-mac");
	window.location.href="../searchCenter/search-rTimeMonitoring.html";
	localStorage.setItem('targetMac',mac);
});

//查询
$("body").delegate(".query","click",function(){
	var mac1=$(this).attr("data-mac");
	console.log(mac1);
	window.location.href="../searchCenter/search-queryTarget.html";
	localStorage.setItem('mac',mac1);
});

//编辑
function edit(id){
	 layer.open({
		type: 2,
		title: "编辑别名",
		area: ['40%', '30%'],
		content: "editfllow.html"
	});
	$.cookie("editfllowId",id);

}
//查看
function see(id){
     	layer.open({
		type: 2,
		title: "首现预警",
		area: ['60%', '60%'],
		content: "see.html"
	});
	$.cookie("seeId",id);
}


//加入预警
function join(id) {
	fnAjax.method_4(url_join("Follow/addFirstWarn/" + id), '', "get", function(data) {
		if(data.code == 0) {
			layer.msg(data.message, {
				icon: 1,
				time: 2000
			}, function() {
				parent.location.reload();
				//										parent.parent.location.reload();
			});
		} else {
			layer.msg(data.message, {
				icon: 2,
				time: 2000
			});
		}
	})
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
				"deviceCode": $("#deviceCode").val(),
				"startTime": $("#logmin").val(),
				"endTime": $("#logmax").val(),
				"location": $("#location").val()
			},
			"post",
			function(data) {
				$(".pageNum").text(data.pageSum); //显示的总页数
				$(".dataNum").text(data.count); //显示的数据总条数
				//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
				if(parseInt(data.count) == 0) {
					$(table).children("tbody").html("");
					$("#pageTool").html("当前没有数据！");
					$(".pageNum").text(0); //显示的总页数
					$(".dataNum").text(0); //显示的数据总条数
				} else if(parseInt(data.count) > 0) {
					fn(data);
					laypage({
						cont: "pageTool", //控制分页容器，
						pages: data.pageSum, //总页数
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
										"deviceCode": $("#deviceCode").val(),
										"startTime": $("#logmin").val(),
										"endTime": $("#logmax").val(),
										"location": $("#location").val(),
										"page": obj.curr
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
								"deviceCode": $("#deviceCode").val(),
								"startTime": $("#logmin").val(),
								"endTime": $("#logmax").val(),
								"location": $("#location").val(),
								"page": $(".laypage_skip").val()
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
				"endTime": $("#logmax").val(),
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
										"itemNum": dataN,
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
								"page": $(".laypage_skip").val()
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
active_layPage.method_get(
	url_join("Follow/queryFollow"),
	"10",
	".table-data",
	function(d) {
		setTimeout(function() {
			createTabel(".table-data", d.data.data);
		}, 500)

	}
);