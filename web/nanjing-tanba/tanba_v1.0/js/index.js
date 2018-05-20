/*iframe src*/
var iframeObj = function() {
	/*用户手册*/
	this.userManual;
	/*个人资料*/
	this.personalData;
	/*数据图表*/
	this.dataChart;
	/*排行分析*/
	this.rankingAnalysis;
	/*权限管理*/
	this.weightManagement;
	/*节点管理*/
	this.nodeManagement;
	/*数据信息*/
	this.myData;
	/*设备信息*/
	this.myDevice;
	/*订单*/
	this.orderForm;
	/*购买*/
	this.purchase;
	/*工具*/
	this.tool;
	/*设置*/
	this.setUp;
};

iframeObj.prototype.init = function() {
	this.myData = "visit/myData.html";
	this.myDevice = "visit/myDevice.html";
	this.dataChart = "visit/display_Data.html";
	this.personalData = "visit/personal_Data.html";
	this.rankingAnalysis = "visit/ranking_List.html";
	this.weightManagement = "Administration/privilege_Management.html";
	this.nodeManagement = "Administration/node_Management.html";
	this.userManagement = "Administration/user_Management.html";
	this.orderForm = "shop/order_Page.html";
	this.purchase = "shop/managed_Purchasenew.html";
	this.tool = "tool_Page.html";
	this.setUp = "config_Page.html";
	this.userManual = "user_Manual.html";
}

$(document).ready(function() {
	/*登录状态验证*/
	var userData = sessionStorage.getItem("userData");
	if(userData == null) {
		layer.alert("请先登录！", {
			btn: ["确定"],
			btnAlign: 'c',
			yes: function() {
				window.location.href = "login.html";
				return;
			}
		});
	} else {
		/*查询权限*/
		var jsonData = JSON.parse(userData);
		console.log(jsonData);
		/*显示登录人名称*/
		$("#loginName").html(jsonData.UserName);
		var parentArrs = new Array();
		for(var i = 0; i < jsonData.permissions.length; i++) {
			parentArrs.push(jsonData.permissions[i].parent);
		}
		new ListQuery(parentArrs);
	};

	/*菜单按钮点击事件*/
	$("#menuBtn").click(function() {
		if($(".left-chart-nav").css("left") == "-190px") {
			$(".left-chart-nav").stop().animate({
				left: "0px"
			}, 300);
		} else if($(".left-chart-nav").css("left") == "0px") {
			$(".left-chart-nav").stop().animate({
				left: "-190px"
			}, 300, function() {
				$(".left-chart-nav").removeAttr("style");
			});
		};
	});
	/*顶部导航点击事件*/
	$(".navbar-toggle").click(function() {
		if($(".left-chart-nav").css("left") == "0px") {
			$(".left-chart-nav").stop().animate({
				left: "-190px"
			}, 300);
		}
	});
	/*只有屏幕小于768像素才会触发移动端样式*/
	if($(window).width() < 768) {
		if($(window).scrollTop() > 0) {
			$(".navbar-bg").css("background-color", "rgba(51, 51, 51, 0.85)");
		}
		$(window).scroll(function() {
			if($(window).scrollTop() > 0) {
				$(".navbar-bg").css("background-color", "rgba(51, 51, 51, 0.85)");
			} else {
				$(".navbar-bg").css("background-color", "rgba(0,0,0,0.9)");
			};
		});
	};
	/*左侧菜单栏切换事件*/
	var leftMenuBar = new iframeObj();
	leftMenuBar.init();
	$(".left-chart-nav li").on("click", "a", function(e) {
		e.preventDefault();
		/*获取切换显示内容*/
		var dataSrc = $(this).attr("data-src");
		if(leftMenuBar[dataSrc]) {
			$("#myiframe").attr("src", leftMenuBar[dataSrc]);
			if($("#menuBtn").css("display") == "block" && $(".left-chart-nav").css("left") == "0px") {
				$(".left-chart-nav").stop().animate({
					left: "-190px"
				}, 300, function() {
					$(".left-chart-nav").removeAttr("style");
				});
			};
		};
		/*修改选中样式*/
		$(".left-chart-nav ul li").find("a").removeClass("active");
		if($(this).hasClass("aTitle")) {
			$(this).next().addClass("active");
		} else {
			$(this).addClass("active");
		}
	})

	//用户退出
	$(".exitBtn").click(function() {

		layer.confirm("您确定要退出？", function() {
			$.ajax({
				type: "post",
				url: url_join("Login/adminLoginOut"),
				async: true,
				data: '',
				dataType: "json",
				timeout: 30000,
				error: function(data) {
					layer.alert("请求失败，请检查服务器端！", {
						icon: 5
					});
				},
				success: function(data) {
					sessionStorage.removeItem("userData");
					parent.location.href = "login.html";
				}
			});

		});

	});

})

/*iframe父页，修改首页选中样式*/
function activeHome() {
	$(".left-chart-nav ul li").find("a").removeClass("active");
	$("#homePage").addClass("active");
	$("#myiframe").attr("src", "personal_Data.html");
}