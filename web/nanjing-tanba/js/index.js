var $,tab,skyconsWeather;
layui.config({
	base : "js/"
}).use(['bodyTab','form','element','layer','jquery'],function(){
	
	
	var form = layui.form(),
		layer = layui.layer,
		element = layui.element();
		$ = layui.jquery;
		tab = layui.bodyTab();

		//内部测试弹窗
	layer.alert("温馨提示：该系统数据暂时为测试数据，系统中的一切不合理数据展示，皆为正常现象！",{icon:0});
	
	//加载左边菜单项
	fnAjax.method_5(
		url_join("Login/queryLeft"),
		"",
		"post",
		function(data){
			console.log(data);
			navs = [];
			$.each(data.data, function(i,v) {
				navs.push({
					"href":v.href,
					"icon":"&#xe68e;",
					"spread":false,
					"title":v.name,
					"id":v.id,
					"pid":v.pid
				});
			});
			console.log(navs);
		}
	);
	
	//锁屏
	function lockPage(){
		layer.open({
			title : false,
			type : 1,
			content : $("#lock-box"),
			closeBtn : 0,
			shade : 0.9
		})
	}
	$(".lockcms").on("click",function(){
		window.sessionStorage.setItem("lockcms",true);
		lockPage();
	})
	// 判断是否显示锁屏
	if(window.sessionStorage.getItem("lockcms") == "true"){
		lockPage();
	}
	// 解锁
	$("#unlock").on("click",function(){
		if($(this).siblings(".admin-header-lock-input").val() == ''){
			layer.msg("请输入解锁密码！");
		}else{
			if($(this).siblings(".admin-header-lock-input").val() == "123456"){
				window.sessionStorage.setItem("lockcms",false);
				$(this).siblings(".admin-header-lock-input").val('');
				layer.closeAll("page");
			}else{
				layer.msg("密码错误，请重新输入！");
			}
		}
	});
	$(document).on('keydown', function() {
		if(event.keyCode == 13) {
			$("#unlock").click();
		}
	});

	//手机设备的简单适配
	var treeMobile = $('.site-tree-mobile'),
		shadeMobile = $('.site-mobile-shade')

	treeMobile.on('click', function(){
		$('body').addClass('site-mobile');
	});

	shadeMobile.on('click', function(){
		$('body').removeClass('site-mobile');
	});

	// 添加新窗口
	$(".layui-nav .layui-nav-item a").on("click",function(){
		addTab($(this));
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	})
	
	//退出模块
	$(".exitBtn").click(function(){
		layer.confirm("确定退出？",function(index){
			fnAjax.method_5(
				url_join("Login/adminLoginOut"),
				"",
				"post",
				function(data){
					console.log(data);
					if(data.code == 0){
						toNewPage("login.html");
						layer.close(index);
					}
				}
			);
		});
		
	});
	


	//刷新后还原打开的窗口
	if(window.sessionStorage.getItem("menu") != null){
		menu = JSON.parse(window.sessionStorage.getItem("menu"));
		curmenu = window.sessionStorage.getItem("curmenu");
		var openTitle = '';
		for(var i=0;i<menu.length;i++){
			openTitle = '';
			if(menu[i].icon.split("-")[0] == 'icon'){
				openTitle += '<i class="iconfont '+menu[i].icon+'"></i>';
			}else{
				openTitle += '<i class="layui-icon">'+menu[i].icon+'</i>';
			}
			openTitle += '<cite>'+menu[i].title+'</cite>';
			openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="'+menu[i].layId+'">&#x1006;</i>';
			element.tabAdd("bodyTab",{
				title : openTitle,
		        content :"<iframe src='"+menu[i].href+"' data-id='"+menu[i].layId+"'></frame>",
		        id : menu[i].layId
			})
			//定位到刷新前的窗口
			if(curmenu != "undefined"){
				if(curmenu == '' || curmenu == "null"){  //定位到后台首页
					element.tabChange("bodyTab",'');
				}else if(JSON.parse(curmenu).title == menu[i].title){  //定位到刷新前的页面
					element.tabChange("bodyTab",menu[i].layId);
				}
			}else{
				element.tabChange("bodyTab",menu[menu.length-1].layId);
			}
		}
	}
	
	//收缩左边导航栏
	$(".toggleBox").click(function(){
		if($(this).hasClass("sign")){
			$(this).removeClass("sign");
			$(".layui-nav.layui-nav-tree li cite").each(function(i){
				$(this).removeClass("hide");
				$(this).prev().removeClass("fs-2");
				$(".layui-nav .layui-nav-item a").removeClass("change");
			});
			$(".layui-side.layui-bg-black").removeClass("changeLeft");
			$(".layui-body.layui-form").removeClass("changeLeft2");
			$(".toggleIcon").text("<<");
			$(".navIcon").removeClass("bigIcon");
			$(".layui-layout-admin .layui-footer").removeClass("move");
			
			$(".navBar .layui-nav-tree .layui-nav-item a").each(function(){
				$(this).find(".badge").removeClass("fold");
			});
			//注销事件监听
			$(".layui-nav-tree .layui-nav-item a i").each(function(){
				$(this).off('mouseover');
				
			});
			
		}
		else{
			$(this).addClass("sign");
			$(".layui-nav.layui-nav-tree li cite").each(function(i){
				$(this).addClass("hide");
				$(this).prev().addClass("fs-2");
				$(".layui-nav .layui-nav-item a").addClass("change");
			});
			$(".layui-side.layui-bg-black").addClass("changeLeft");
			$(".layui-body.layui-form").addClass("changeLeft2");
			$(".toggleIcon").text(">>");
			$(".navIcon").addClass("bigIcon");
			
			$(".layui-layout-admin .layui-footer").addClass("move");
			
			$(".navBar .layui-nav-tree .layui-nav-item a").each(function(){
				$(this).find(".badge").addClass("fold");
			});
			//菜单tip提示
			
			$('.layui-nav-tree .layui-nav-item a i').on('mouseover', function() {
			    $(".layui-layer-tips").remove();
				layer.tips($(this).next().text(), $(this),{
					time:1000
				});
				
			});
			
			
		}
	});
	
	//imagesArr
	var aImages = [
		"images/msgCenter.png",
		"images/searchCenter.png",
		"images/lookCenter.png",
		"images/setWarning.png",
		"images/delManner.png",
		"images/specialDelManner.png",
		"images/system.png"
	];
	
	//左边导航菜单添加
	$(".layui-nav-tree .layui-nav-item a i").each(function(i){
		$(this).html($('<img src="'+aImages[i]+'" class="navIcon"/>'));
	});
	
	//添加导航标示
	$(".layui-nav-tree .layui-nav-item a").addClass("parentClear");
	$(".navBar .layui-nav-tree .layui-nav-item:first-child a").append($('<span class="badge rf alert-icon">!</span>'));
	$(".navBar .layui-nav-tree .layui-nav-item:nth-child(5) a").append($('<span class="badge rf alert-icon">8</span>'));
	
	
});

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}
