//tab页面跳转iframe
$(".targerBox ul li").click(function() {
	var nSort = $(this).index();
	var sHref = $(this).attr("data-href");
	var sHtml = $('<iframe src="' + sHref + '" width="100%"  class="no-border childPage"></iframe>');
	$(".targerBox .tab-content>div").eq(nSort).html(sHtml);
	$(".targerPage").text($(this).children("a").text());
});

//全选数据
$("table thead tr th:first-child input").click(function() {
	var bool = $(this).prop("checked");
	console.log(bool);
	$("table tbody td:first-child input").prop("checked", bool);
});

//目标查询和伴随查询的封装	
$(".accompanyTarget,.queryTarget").mouseover(function(){
	$.cookie("btnType",$(this).attr("data"));
});
//级联地区组件sss，参数为数组
/*
 	var aUrl = [{
					Url: "../../json/province.json",
					dataType: "省级数据"
				}]
 * */
var selectSearch = {
	method: function(Url) {
		//页面加载获取初始化省级城市
		fnAjax.method_4(
			Url+"/",
			"",
			"post",
			function(data) {
				$.each(data.data, function(i, v) {
					sHtml = $('<option value="' + v.id + '" data-pid="'+v.parent_id+'">' + v.address + '</option>');
					$("#level_1").append(sHtml);
				});
			}
		);

		//除了一级的数据，所有数据集成数组
		var urlArr = [];
		for(var j=0;j<100;j++){
			urlArr.push(Url);
		}
		
		//循环请求数据，动态生成下拉框
		setTimeout(function() {
			console.log(urlArr);
			$.each(urlArr, function(i, v) {
				//下拉框循环创建和请求
				$("body").delegate("#level_" + (i + 1) + "", "change", function() {
					if($(this).val() == "-1") {
						$(this).parent().nextAll().remove(); //删除已存在的下拉模块   	后面的更低一级的模块
					} else {
						var nLevel = ($(this).attr("data-level")) * 1;
						var obj = $(this);
						fnAjax.method_4(
							v,
							{"id":obj.val()},
							"post",
							function(data) {
								if(data.data.length > 0) {
									$("#level_" + (nLevel + 1) + "").parent().remove(); //删除已存在的下拉模块   					
									sHtml = $('<div class="form-group col-sm-2 col-xs-12 btn-group"><select class="form-control selectReset"id="level_' + (nLevel + 1) + '" data-level="' + (nLevel + 1) + '"><option value="-1">请选择地区</option></select></div>');
									obj.parent().after(sHtml);
									setTimeout(function() {
										$.each(data.data, function(i, v) {
											sHtml = $('<option value="' + v.id + '" data-pid="'+v.parent_id+'">' + v.address + '</option>');
											$("#level_" + (nLevel + 1) + "").append(sHtml);
										});
										$("#level_" + (nLevel + 1) + "").parent().nextAll().remove(); //删除已存在的下拉模块   	后面的更低一级的模块
										setTimeout(function() {
											$("#level_" + (nLevel + 1) + "").after($('<a href="#"class="selectClose btn btn-danger" id="selectClose_' + (nLevel + 1) + '">X</a>'));
										}, 100);
									}, 100);
								}
							}
						);
					}
				});

				//下拉框按钮关闭操作
				$("body").delegate("#selectClose_" + (i + 2) + "", "click", function() {
					$(this).parent().nextAll().remove();
					$(this).parent().remove();
				});
			});

		}, 100);

		//确定地区，生成预览标签，
		$("body").delegate(".sureArea", "click", function() {
			if($("#level_1").val() != "0") {
				var aSign = [];
				var bindId = $(".selectBox div:last-child select").val(); //最后一个下拉菜单值id；
				$(".selectBox div select").each(function(i) {
					// 				var selectId = $(this).val();
					var selectContent = $(this).children("option:selected").text();
					aSign.push(selectContent)
				});

				setTimeout(function() {
					var sHtml = $('<div class="hasSelect btn-group" data-id="' + bindId + '"><button type="button"class="btn btn-sm btn-primary selectContent">' + aSign.join("-") + '</button><a href="#"class="closeBtn btn btn-sm btn-danger">X</a></div>');
					$(".showArea").append(sHtml);
					console.log(aSign.join("-"));
					console.log(bindId);
				}, 100);
			} else {
				layer.alert("请先选择省份", {
					icon: 0
				});
			}

		});

		//删除标签
		$("body").delegate(".hasSelect .closeBtn", "click", function() {
			$(this).parent().remove();
		});

	}
};

$("body").delegate(".exlBtn","click",function(){
	layer.alert("功能尚未完善");
	return false;
});
//$(window).resize(function() {
//	$('.layui-layer-iframe').css({
//		"width": "100%",
//		"height": "100%"
//	})
//});