$(function() {
	/*点击登录事件*/
	var inputValiDate = new inputValiDateObj();
	$("#loginBtn").on("click", function() {
		inputValiDate.init();
	})
	/*单页面查询按钮,点击事件*/
	var devicePage = new devicePageObj();
	$("#deviceBtn").on("click", function(e) {
		e.preventDefault();
		devicePage.init();
	})

	if(navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
		$(window).load(function() {
			$('ul input:not(input[type=submit])').each(function() {
				var outHtml = this.outerHTML;
				$(this).append(outHtml);
			});
		});
	}
})

/*单页面查询*/
var devicePageObj = function() {
	this.deviceInputValue;
	this.ajaxUrl;
	this.data;
}

devicePageObj.prototype.init = function() {
	this.ajaxUrl = "";
	this.deviceInputValue = $("#deviceInput").val();
	var val = this.deviceInputValue;
	if(val) {
		this.Ajax(val);
	}
}

devicePageObj.prototype.Ajax = function(val) {
	var _this = this;
	/*接口参数*/
	_this.data = {
		id: val
	}
	$.ajax({
		type: "get",
		url: _this.ajaxUrl,
		async: true,
		data: _this.data,
		dataType: "json",
		timeout: 30000,
		beforeSend: function() {
			$.infoAlert("正在查询：" + _this.data.id);
		},
		success: function(res) {
			/*查询成功跳转*/
		},
		error: function() {
			$.infoAlert("查询失败！");
		}
	});
}

/*登录表单验证*/
var inputValiDateObj = function() {
	/*账户*/
	this.userVal;
	/*账户正则*/
	this.userRegExp;
	/*密码*/
	this.passVal;
	/*密码正则*/
	this.passRegExp;
	/*等页面接口*/
	this.ajaxUrl;
}

inputValiDateObj.prototype.init = function() {
	/*等页面接口*/
	this.ajaxUrl = url_join("Login/adminLogin");
	/*初始化*/
	this.userVal = $("#userInp").val();
	this.passVal = $("#passInp").val();
	this.userRegExp = /\S/;
	this.passRegExp = /\S/;
	/*验证*/
	this.Validate();

}
/*验证输入*/
inputValiDateObj.prototype.Validate = function() {
	var bool;
	bool = this.userRegExp.test(this.userVal);
	if(!bool) {
		/*没输入账户*/
		$.infoAlert("请输入：账户");
		return;
	}
	bool = this.passRegExp.test(this.passVal);
	if(!bool) {
		/*没输入账户*/
		$.infoAlert("请输入：密码");
		return;
	}
	this.Ajax();
}

inputValiDateObj.prototype.Ajax = function(val) {
	var _this = this;
	/*接口参数*/
	_this.data = {
		userName: _this.userVal,
		passWord: _this.passVal
	}
	$.ajax({
		type: "post",
		url: _this.ajaxUrl,
		async: true,
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		data: _this.data,
		dataType: "json",
		timeout: 30000,
		success: function(data) {
			if(data.result == "success" && data.state == "1") {
				/*查询成功跳转*/
				sessionStorage.setItem("userData",JSON.stringify(data));
				window.location.href = "index.html";
			} else if(data.result == "error" && data.state == 'isLogin') {
				window.location.href = "index.html";
			} else if(data.result == "error" && data.state == "-1") {
				var message = data.message;
				$.infoAlert(message);
			}
		},
		error: function() {
			$.infoAlert("查询失败！");
		}

	});

}