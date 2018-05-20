$.extend({
	/*
	 * 信息反馈弹框
	 * txt : 显示的文字
	 * timer :  弹框持续时间
	 * boole : 是否显示确定按钮, 显示按钮则不自动关闭
	 * */
	infoAlert: function(txt, timer, boole) {
		var txt = txt || '请稍后...';
		var timer = timer || 2500;
		var boole = (boole == undefined ? false : true);
		//清除之前的定时器
		if(window.clearSet != 0) {
			clearTimeout(window.clearSet);
			window.clearSet = 0;
		}
		/*载入要输出的文字*/
		$("#infoAlertText").html(txt);
		/*是否显示按钮*/
		if(boole) {
			$(".infoAlertBtn").show();
		} else {
			$(".infoAlertBtn").hide();
		}
		/*显示弹窗*/
		$(".infoAlertBox").show();
		/*指定时间关闭弹窗*/
		if(boole == false) {
			window.clearSet = setTimeout(function() {
				$(".infoAlertBox").hide();
			}, timer);
		} else {
			$("#infoAlertBtn").on("click", function() {
				$(".infoAlertBox").hide();
			})
		}
	}
});
$(document).ready(function() {
	$(".chart").hover(function() {
		$(this).find(".chart_Prompt").stop(false).fadeIn(300);
	}, function() {
		$(this).find(".chart_Prompt").stop(false).fadeOut(300);
	})

	/*iframe子页，点击首页效果切换*/
	$("#home").on("click", function(e) {
		e.preventDefault();
		//在iframe子页面中查找父页面元素
		window.parent.activeHome();
	})
})