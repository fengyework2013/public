
//创建表格,ele指的是table的选择器。data指的是数组数据
	function createTabel(ele, d) {
		var data = d.data;
		var str = "";
		for(var i = 0; i < data.length; i++) {
			str += '<tr class="text-c" data-id="'+data[i].id+'"><td><input type="checkbox"/></td><td class="sortTd">'+(d.from+i)+'</td><td>' + data[i].nodeName + '</td><td class="user">'+data[i].userName+'</td><td>' + data[i].time + '</td><td class="targetMac">' + data[i].mac + '</td><td class="targetPhone">' + data[i].Tel + '</td><td class="td-option"><a class="searchDetails">查看</a></td></tr>';
		}
		$(ele).children("tbody").html(str);
		//回显判断有否电话
		setTimeout(function(){
			$(".targetPhone,.targetMac").each(function(k){
				if($(this).text() == "null" || $(this).text() == "undefined" || $(this).text() == ""){
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
					"itemNum": dataN,			
					"page":"1",
					"keyWord":$("#keyWord").val()
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
											"page": obj.curr,
											"keyWord":$("#keyWord").val()
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
									"page": $(".laypage_skip").val(),
									"keyWord":$("#keyWord").val()
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
//查看目标详情界面
	$("body").delegate(".searchDetails","click",function(){
		if($(this).parent().siblings(".targetMac").text() == "暂无"){
			layer.alert("当前目标没mac等正确的设备标识码，无法查询详情");
		}else{
			$.cookie("macId",$(this).attr("data-id"));//存id
			$.cookie("mac",$(this).parent().siblings(".targetMac").text());//存mac
			var index = layer.open({
				type: 2,
				title: "目标详情信息",
				content: "search-queryTarget-details.html",
	//			end: function() {
	//				location.reload();
	//			}
	
			});
			layer.full(index);
		}
		
	});
	

//分页查询
		active_layPage.method_post(
			url_join("Log/queryLog"),
			10,
			".table-data",
			function(data){
				console.log(data);
				createTabel(".table-data", data);
			}
		);