console.log(localStorage.getItem("peopleId"));
if(localStorage.getItem("clickType") == "edit"){
	//请求回显信息
	$("#userName").val(localStorage.getItem("peopleName"));
	$("#mac").val(localStorage.getItem("peopleMac"));
	$("#phone").val(localStorage.getItem("peoplePhone"));
}


//表单提交--添加
$(".form").Validform({
	btnSubmit: "#submitBtn",
	beforeSubmit: function(curform) {
		if(localStorage.getItem("clickType") == "edit"){
			ajaxFn2();
		}
		else if(localStorage.getItem("clickType") == "add"){
			ajaxFn();
		}
		
	},
	callback: function() {
		return false;
	}

});


//封装添加人员的函数
function ajaxFn(){
	fnAjax.method_5(
		url_join('PersonManage/addPerson'),
		{
			"username":$("#userName").val(),
			"tel":$("#phone").val(),
			"mac":$("#mac").val()
		},
		"post",
		function(data){
			console.log(data);
			layer.msg("操作成功",{icon:1,time:1500},function(){
				parent.location.reload();
			});
		}
	);
}

//封装编辑人员的函数
function ajaxFn2(){
	fnAjax.method_5(
		url_join('PersonManage/updatePerson'),
		{
			"username":$("#userName").val(),
			"tel":$("#phone").val(),
			"mac":$("#mac").val(),
			"id":localStorage.getItem("peopleId")
		},
		"post",
		function(data){
			console.log(data);
			layer.msg("操作成功",{icon:1,time:1500},function(){
				parent.location.reload();
			});
		}
	);
}


