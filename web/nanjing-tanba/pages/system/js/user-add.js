(function(win, doc, $) {
	function userAdd(options) {
		this._init(options);
	}
	$.extend(userAdd.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				userName: "#userName", //角色名称
				userPwd: "#userPwd", //密码
				userPwdAgain: "#userPwdAgain", //再次确认密码
				userBindRole: "#userBindRole", //绑定角色下拉框
				email: "#email", //邮箱
				phone: "#phone", //手机
				userBindRoleSel: "#userBindRole option:selected", //绑定角色下拉框
				submitBtn: "#submitBtn", //提交按钮
				cancelBtn: "#cancelBtn" //取消按钮
			};
			$.extend(true, self.options, options || {});
			self._initDomEvent();
			return self;
		},
		/**
		 * 初始化DOM引用
		 * @method _initDomEvent
		 * @return {CusScrollBar}
		 */
		_initDomEvent: function() {
			var self = this;
			var opts = this.options;
			//角色名称输入框对象
			self.$userName = $(opts.userName);
			//密码输入框对象
			self.$userPwd = $(opts.userPwd);
			//再次确认密码输入框对象
			self.$userPwdAgain = $(opts.userPwdAgain);
			//邮箱输入框对象
			self.$email = $(opts.email);
			//手机输入框对象
			self.$phone = $(opts.phone);
			//角色下拉框对象
			self.$userBindRole = $(opts.userBindRole);
			//提交按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$cancelBtn = $(opts.cancelBtn);
			/*初始化*/
			self._initDomBindEvent();
			/*初始化角色列表*/
			self._initRoleListEvent();
			/*初始化表单验证*/
			$(".form-horizontal").Validform({
				btnSubmit: "#submitBtn",
				beforeSubmit: function(curform) {
					self.formSubmitEvent();
				},
				callback: function() {
					return false;
				}
			});
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			self.$cancelBtn.click(function(e) {
				e.preventDefault();
				var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				parent.layer.close(index); //再执行关闭   
				return false;
			});
		},
		//获取角色列表
		_initRoleListEvent: function() {
			var self = this;
			fnAjax.method_5(url_join1("AdminUser/queryRole"), {}, "get", function(msg) {
				if(msg.code == 0) {
					if(msg.data.length > 0) {
						var optionStr = "";
						$.each(msg.data, function(i, obj) {
							optionStr += "<option value='" + obj.id + "'>" + obj.name + "</option>";
						});
						self.$userBindRole.html(optionStr);
					}
				} else {
					layer.alert(msg.message);
				};
			});
		},
		//表单提交事件
		formSubmitEvent: function() {
			var self = this;
			var param = {
				username: self.$userName.val(),
				password: self.$userPwd.val(),
				password_confirmation: self.$userPwdAgain.val(),
				email: self.$email.val(),
				phone: self.$phone.val(),
				roleid: self.$userBindRole.val()
			};
			fnAjax.method_5(url_join1("AdminUser/addUser"), param, "post", function(msg) {
				if(msg.code == 0) {
					layer.alert("添加成功", {
						yes: function() {
							layer.confirm('是否留在此页？', {
								btn: ['否', '是'] //按钮
							}, function() {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							});
						},
						cancel: function() {
							layer.confirm('是否留在此页？', {
								btn: ['否', '是'] //按钮
							}, function() {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							});
						}
					});
				} else {
					layer.alert(msg.message)
				};
			}, "post");
		}
	});
	win.userAdd = userAdd;
})(window, document, jQuery);
new userAdd();