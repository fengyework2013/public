(function(win, doc, $) {
	function privilegeManagement(options) {
		this._init(options);
	}
	$.extend(privilegeManagement.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				tagsSelector: "#addUserA", //打开模态窗选择器
				modalSelector: "#modal-Content-box", //模态窗选择器
				colseSelector: "#modal-Content-window-title-closeBtn", //关闭模态窗选择器
				modalTextSelector: ".modal-Content-window-title-text", //模态框标题
				maskSelector: ".modal-Content-mask", //蒙版选择器
				promptSelector: ".conShow_box_Prompt", //状态提示窗选择器
				tableSelector: "#conShow-box-inner-table", //数据展示表格选择器
				unInputSelector: "#userName", //名称输入框选择器
				pdInputSelector: "#userPwd", //密码输入框选择器
				cpdInputSelector: "#againUserPwd", //确认密码输入框选择器
				selectSelector: "#userPowerSelect", //下拉列表选择器
				submitSelector: "#userNameSubmit", //提交按钮选择器
				changeSelector: "#userNameChange" //修改按钮选择器
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
			//打开模态框对象
			this.$tags = $(opts.tagsSelector);
			//模态窗对象
			this.$modal = $(opts.modalSelector);
			//关闭模态框对象
			this.$colse = $(opts.colseSelector);
			//蒙板对象
			this.$mask = $(opts.maskSelector);
			//模态框标题
			this.$title = $(opts.modalTextSelector);
			//状态提示对象
			this.$prompt = $(opts.promptSelector);
			//展示表格对象
			this.$table = $(opts.tableSelector);
			//名称输入框对象
			this.$unInp = $(opts.unInputSelector);
			//密码输入框对象
			this.$pdInp = $(opts.pdInputSelector);
			//确认密码输入框对象
			this.$cpdInp = $(opts.cpdInputSelector);
			//下拉列表对象
			this.$select = $(opts.selectSelector);
			//提交按钮对象
			this.$submitBtn = $(opts.submitSelector);
			/*修改按钮对象*/
			this.$changeBtn = $(opts.changeSelector);
			//当前查询页码
			this.$page = 1;
			//每次查询数目
			this.$itemNum = 10;
			//删除按钮对象
			this.$delObj = ".conShow-table-delBtn";
			//编辑按钮对象
			this.$allotObj = ".conShow-table-allotBtn";
			//修改密码按钮对象
			this.$changeObj = ".conShow-table-changeBtn";
			/*初始化*/
			this.selUserEvent(this.$page, this.$itemNum);
			this._initDomBindEvent();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			/*打开模态窗事件*/
			self.$tags.on("click", function(e) {
				e.preventDefault();
				self.$modal.fadeIn(350);
				/*修改模态窗DOM*/
				self.clearValueEvent();
				self.$pdInp.parent().show();
				self.$cpdInp.parent().show();
				self.$submitBtn.show();
				self.$changeBtn.hide();
				/*初始化权限列表事件*/
				self.initPowerListEvent();
			});
			/*关闭模态窗事件*/
			self.$colse.on("click", function(e) {
				e.preventDefault();
				e.stopPropagation();
				self.$modal.fadeOut(350);
			});
			/*点击蒙板关闭模态窗事件*/
			self.$mask.on("click", function(e) {
				e.stopPropagation();
				self.$modal.fadeOut(350);
			});
			/*新增提交按钮事件*/
			self.$submitBtn.on("click", function(e) {
				e.preventDefault();
				self.addUserEvent();
			});
			/*删除用户事件*/
			self.$table.on("click", self.$delObj, function(e) {
				e.stopPropagation();
				var dataId = $(this).parents("tr").attr("data-id");
				self.delUserEvent(dataId);
			});
			/*编辑用户事件*/
			self.$table.on("click", self.$allotObj, function(e) {
				e.stopPropagation();
				/*显示模态窗*/
				self.$modal.fadeIn(350);
				/*修改模态窗DOM*/
				self.clearValueEvent();
				self.$title.html("编辑用户");
				/*隐藏密码输入框*/
				self.$pdInp.parent().hide();
				self.$cpdInp.parent().hide();
				/*切换按钮*/
				self.$changeBtn.show();
				self.$submitBtn.hide();
				/*初始化编辑页面*/
				self.updataUserInit(this);
			});
			/*修改密码事件*/
			self.$table.on("click", self.$changeObj, function(e) {
				e.stopPropagation();
				/*显示模态窗*/
				self.$modal.fadeIn(350);
				/*修改模态窗DOM*/
				self.clearValueEvent();
				self.$title.html("修改密码");
				self.$pdInp.siblings("label").html("修改新密码：");
				self.$cpdInp.siblings("label").html("确认新密码：");
				/*隐藏用户名输入框*/
				self.$unInp.parent().hide();
				self.$select.parent().hide();
				/*切换按钮*/
				self.$changeBtn.show();
				self.$submitBtn.hide();
				/*初始化修改页面*/
				self.modifyPasswordInit(this);
			});
		},
		/**
		 * AJAX请求
		 * @param url 接口分支
		 * @param param 请求参数
		 */
		aJaxRequestEvent: function(url, param, fn) {
			$.ajax({
				type: "get",
				url: url,
				async: true,
				data: param,
				dataType: "json",
				timeout: 30000,
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				beforeSend: function() {
					layer.msg('请稍后...');
				},
				success: function(result) {
					layer.closeAll();
					fn(result);
				},
				error: function() {
					$.infoAlert("连接服务器失败！", null, true);
				}
			});
		},
		//查询事件处理
		selUserEvent: function(page, itemNum) {
			var self = this;
			var data = {
				page: page,
				itemNum: itemNum
			}
			self.aJaxRequestEvent(url_join("AdminUser/queryUser"), data, function(obj) {
				if(obj.ResultCode == "ERROR") {
					layer.alert(obj.message, {
						btn: ["确定"],
						btnAlign: 'c',
						yes: function() {
							jumpLogin();
						}
					});
					return
				};
				if(obj.count == 0) {
					self.$prompt.show();
				} else {
					self.$prompt.hide();
					self.$table.show();
					var arrs = obj.data;
					var str = "";
					$.each(arrs, function(i, ele) {
						str += "<tr data-id='" + ele.id + "'><td>" + (i + 1) + "</td>" +
							"<td>" + ele.userName + "</td>" +
							"<td data-id='" + ele.roleId + "'>" + ele.roleName + "</td>" +
							"<td>" + ele.time + "</td>" +
							"<td><button class='conShow-table-allotBtn'>编辑用户</button>" +
							"<button class='conShow-table-changeBtn'>修改密码</button>" +
							"<button class='conShow-table-delBtn'>删除用户</button>" +
							"</td></tr>";
					});
					self.$table.children("tbody").html(str);
					//载入分页
					self.pagedQueryEvent(obj);
				};
			});
		},
		//分页查询事件
		pagedQueryEvent: function(obj) {
			var self = this;
			//总页数
			var totalPage = obj.totalPage;
			//当前页数
			self.$page = obj.currPage;
			//总条数 
			var totalcount = obj.count;
			//显示条数/
			// self.$itemNum = 5;
			//调用分页插件
			$('#pageToolbar').Paging({
				current: self.$page,
				pagesize: self.$itemNum,
				count: totalcount,
				callback: function(page, size, count) {
					self.selPermissions(page, size);
				}
			});
		},
		//清理事件
		clearValueEvent: function() {
			var self = this;
			self.$title.html("新增用户");
			self.$unInp.parent().show();
			self.$select.parent().show();
			self.$pdInp.parent().show();
			self.$cpdInp.parent().show();
			self.$pdInp.siblings("label").html("账号密码：");
			self.$cpdInp.siblings("label").html("确认密码：");
			self.$unInp.val("");
			self.$pdInp.val("");
			self.$cpdInp.val("");
		},
		//初始化权限列表事件
		initPowerListEvent: function(vid) {
			var self = this;
			var valId = vid || false;
			self.aJaxRequestEvent(url_join("AdminUser/queryRole"), {}, function(obj) {
				if(obj.length > 0) {
					var opt = "";
					$.each(obj, function(index, data) {
						opt += "<option value='" + data.id + "'>" + data.roleName + "</option>"
					});
					self.$select.html(opt);
					//如果有传参数则设置选中项
					if(valId) {
						self.$select.val(valId);
					};
				} else {
					layer.msg("没有以创建的权限", {
						time: 0,
						btn: '确定',
						btnAlign: 'c'
					});
				}
			});
		},
		//新增用户事件
		addUserEvent: function() {
			var self = this;
			//获取用户名
			var userName = self.$unInp.val();
			//获取密码
			var userPwd = self.$pdInp.val();
			//获取再一次输入密码
			var againPwd = self.$cpdInp.val();
			//获取选择的权限
			var userPower = self.$select.val();
			//验证两次密码是否一致
			if(userPwd == againPwd) {
				var data = {
					userName: userName,
					passWord: userPwd,
					roleId: userPower
				};
				self.aJaxRequestEvent(url_join("AdminUser/addUser"), data, function(obj) {
					if(obj.result == "success") {
						//更新列表
						self.selUserEvent(self.$page, self.$itemNum);
						layer.msg(obj.message);
						self.clearValueEvent();
						self.$modal.fadeOut(350);
					} else {
						layer.msg(obj.message);
					};
				});
			} else {
				layer.msg("两次密码不一致", {
					time: 0,
					btn: '确定',
					btnAlign: 'c'
				});
			}
		},
		//删除事件处理
		delUserEvent: function(dataId) {
			var self = this;
			var data = {
				id: dataId
			};
			layer.confirm("您确定要删除该角色吗？", function() {
				self.aJaxRequestEvent(url_join("AdminUser/delUser"), data, function(obj) {
					if(obj.result == "success") {
						//更新列表
						self.selUserEvent(self.$page, self.$itemNum);
						layer.msg(obj.message, {
							icon: 1
						});
					} else {
						layer.alert(obj.message, {
							icon: 5
						});
					};
				});
			});
		},
		//编辑用户事件处理
		updataUserInit: function(ele) {
			var self = this;
			/*获取ID*/
			var dataId = $(ele).parents("tr").attr("data-id");
			/*获取名称*/
			var userName = $(ele).parent().siblings()[1].innerHTML;
			/*获取拥有权限*/
			var pId = $(ele).parent().siblings().eq(2).attr("data-id");
			/*获取权限列表*/
			self.initPowerListEvent(pId);
			/*显示当前角色的值*/
			self.$unInp.val(userName);
			//编辑提交事件
			self.$changeBtn.off("click").on("click", function(e) {
				e.stopPropagation();
				self.updateUserEvent(dataId);
			});
		},
		//编辑用户提交事件
		updateUserEvent: function(dataId) {
			var self = this;
			//获取用户名
			var userName = self.$unInp.val();
			//获取选择的权限
			var userPower = self.$select.val();
			//参数
			var data = {
				id: dataId,
				userName: userName,
				roleId: userPower
			};
			self.aJaxRequestEvent(url_join("AdminUser/updateUser"), data, function(obj) {
				if(obj.result == "success") {
					//更新列表
					self.selUserEvent(self.$page, self.$itemNum);
					layer.msg(obj.message);
					self.clearValueEvent();
					self.$modal.fadeOut(350);
				} else {
					layer.msg(obj.message);
				};
			});
		},
		//修改密码事件处理
		modifyPasswordInit: function(ele) {
			var self = this;
			/*获取ID*/
			var dataId = $(ele).parents("tr").attr("data-id");
			//编辑提交事件
			self.$changeBtn.off("click").on("click", function(e) {
				e.stopPropagation();
				self.modifyPasswordEvent(dataId);
			});
		},
		//修改密码提交事件
		modifyPasswordEvent: function(dataId) {
			var self = this;
			//获取新密码
			var pwd = self.$pdInp.val();
			//获取确认密码
			var cpwd = self.$cpdInp.val();
			if(pwd == cpwd) {
				//参数
				var data = {
					id: dataId,
					newpsw: pwd,
					checkedPwd: cpwd
				};
				self.aJaxRequestEvent(url_join("AdminUser/modifyPassword"), data, function(obj) {
					if(obj.result == "success") {
						//更新列表
						self.selUserEvent(self.$page, self.$itemNum);
						layer.msg(obj.message);
						self.clearValueEvent();
						self.$modal.fadeOut(350);
					} else {
						layer.msg(obj.message);
					};
				});
			} else {
				layer.msg("两次密码不一致", {
					time: 0,
					btn: '确定',
					btnAlign: 'c'
				});
			}
		}
	});
	win.privilegeManagement = privilegeManagement;
})(window, document, jQuery);
new privilegeManagement();