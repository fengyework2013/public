var T = new CreateTable({});
(function(win, doc, $) {
	function userAdd(options) {
		this._init(options);
	}
	$.extend(userAdd.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				userName: "#level", //等级
				userPwd: "#base_price", //基础价
				userPwdAgain: "#ratio", //系数
				userBindRole: "#jianName", //简称
				email: "#description", //描述
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
            self.$userBindRole = $(opts.userBindRole);
			self.$email = $(opts.email);



			//提交按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$cancelBtn = $(opts.cancelBtn);
			/*初始化*/
			self._initDomBindEvent();

			/*获取当前用户信息*/
			self.getDeviceInfoEvent();
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

		//获取用户id
		getLetterCompanyID: function() {
			var did = sessionStorage.getItem("editUser");
			if(did) {
				return did;
			} else {
				layer.open({
					content: '获取用户信息失败！',
					yes: function(index, layero) {
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭
						return false;
					},
					cancel: function(index, layero) {
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭
						return false;
					}
				});
			}
		},
		//获取单条报价信息
		getDeviceInfoEvent: function() {
			var self = this;
			var did = self.getLetterCompanyID();
			if(did) {
				var param = {
					id: did
				};
				T.ajaxFive(config.priceLevelGet, param, "get", function(msg) {

					if(msg.code == 0) {
						var data = msg.data;
						self.$userName.val(data.level);
                        self.$userPwd.val(data.base_price);
                        self.$userPwdAgain.val(data.ratio);
						self.$userBindRole.val(data.name);
						self.$email.val(data.remarks);
					} else {
						layer.alert("获取用户信息失败：" + msg.message);
					}
				});
			}
		},
		//表单提交事件
		formSubmitEvent: function() {
			var self = this;
			var did = self.getLetterCompanyID();
			var param = {
				id: did,
                level:self.$userName.val(),
				//密码输入框对象
                base_price:self.$userPwd.val(),
				//再次确认密码输入框对象
                ratio:self.$userPwdAgain.val(),
				//邮箱输入框对象
            	name:self.$userBindRole.val(),
            	remarks:self.$email.val(),
			};
			T.ajaxFive(config.priceLevelUpdate, param, "post", function(msg) {
				if(msg.code == 0) {
					layer.alert("编辑成功", {
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