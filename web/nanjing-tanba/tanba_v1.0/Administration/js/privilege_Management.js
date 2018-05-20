(function(win, doc, $) {
	function privilegeManagement(options) {
		this._init(options);
	}
	$.extend(privilegeManagement.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				tagsSelector: "", //打开模态窗选择器
				modalSelector: "#modal-Content-box", //模态窗选择器
				colseSelector: "#modal-Content-window-title-closeBtn", //关闭模态窗选择器
				modalTextSelector: ".modal-Content-window-title-text", //模态框标题
				maskSelector: ".modal-Content-mask", //蒙版选择器
				inputSelector: "#powersName", //输入框选择器
				submitSelector: "#powersNameSubmit", //提交按钮选择器
				changeSelector: "#powersNameChange", //修改按钮选择器
				promptSelector: ".conShow_box_Prompt", //状态提示窗选择器
				tableSelector: "#conShow-box-inner-table" //数据展示表格选择器
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
			//输入框对象
			this.$input = $(opts.inputSelector);
			//提交按钮对象
			this.$submitBtn = $(opts.submitSelector);
			/*修改按钮对象*/
			this.$changeBtn = $(opts.changeSelector);
			//状态提示对象
			this.$prompt = $(opts.promptSelector);
			//展示表格对象
			this.$table = $(opts.tableSelector);
			//当前查询页码
			this.$page = 1;
			//每次查询数目
			this.$itemNum = 10;
			//删除按钮对象
			this.$delObj = ".conShow-table-delBtn";
			//修改按钮对象
			this.$changeObj = ".conShow-table-changeBtn";
			//分配按钮对象
			this.$allotObj = ".conShow-table-allotBtn";
			/*初始化*/
			this.selPermissions(this.$page, this.$itemNum);
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
				self.$title.html("新增权限");
				self.$input.val("");
				self.$submitBtn.show();
				self.$changeBtn.hide();
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
			/*新增权限ajax请求事件*/
			self.$submitBtn.on("click", function(e) {
				e.stopPropagation();
				self.newPermissions();
			});
			/*删除权限名事件*/
			self.$table.on("click", self.$delObj, function(e) {
				e.stopPropagation();
				var dataId = $(this).parents("tr").attr("data-id");
				self.delPermissions(dataId);
			});
			/*修改权限名事件*/
			self.$table.on("click", self.$changeObj, function(e) {
				e.stopPropagation();
				/*显示模态窗*/
				self.$modal.fadeIn(350);
				self.$input.val("");
				/*修改模态窗DOM*/
				self.$title.html("修改权限");
				self.$changeBtn.show();
				self.$submitBtn.hide();
				/*获取修改的ID*/
				var dataId = $(this).parents("tr").attr("data-id");
				/*获取修改的名称*/
				var roleName = $(this).parent().siblings()[1].innerHTML;
				self.changePermissions(dataId, roleName);
			});
			/*分配权限事件*/
			self.$table.on("click", self.$allotObj, function(e) {
				e.stopPropagation();
				/*获取修改的ID*/
				var dataId = $(this).parents("tr").attr("data-id");
				/*存入本地缓存*/
				sessionStorage.setItem("dataId", dataId);
				layer.open({
					type: 2,
					maxmin: true, //开启最大化最小化按钮
					area: ['530px', "375px"],
					title: "权限分配",
					content: 'iframe/allot-Page.html' //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
				});
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
		selPermissions: function(page, itemNum) {
			var self = this;
			var data = {
				page: page,
				itemNum: itemNum
			};
			self.aJaxRequestEvent(url_join("Role/queryRole"), data, function(obj) {
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
					self.$table.hide();
					$('#pageToolbar').find('div').remove();
					self.$prompt.show();
				} else {
					self.$prompt.hide();
					self.$table.show();
					var arrs = obj.data;
					var str = "";
					$.each(arrs, function(i, ele) {
						var isbind = "";
						if(ele.isbind == 1) {
							isbind = "<td><span class='bind'>绑定</span></td>";
						} else {
							isbind = "<td><span class='nobind'>未绑定</span></td>";
						};
						str += "<tr data-id='" + ele.id + "'><td>" + (i + 1) + "</td>" +
							"<td>" + ele.roleName + "</td>" + isbind +
							"<td>" + ele.time + "</td>" +
							"<td><button class='conShow-table-allotBtn'>分配</button>" +
							"<button class='conShow-table-changeBtn'>修改</button>" +
							"<button class='conShow-table-delBtn'>删除</button>" +
							"</td></tr>";
					});
					self.$table.children("tbody").html(str);
					//载入分页
					self.pagedQueryPermissions(obj);
				};
			});
		},
		//分页查询事件
		pagedQueryPermissions: function(obj) {
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
				// toolbar: true,
				callback: function(page, size, count) {
					self.selPermissions(page, size);
				}
			});
		},
		//新增事件处理
		newPermissions: function() {
			var self = this;
			var val = self.$input.val();
			var data = {
				roleName: val
			};
			self.aJaxRequestEvent(url_join("Role/addRole"), data, function(obj) {
				if(obj.result == "success") {
					//更新列表
					self.selPermissions(self.$page, self.$itemNum);
					$.infoAlert(obj.message, 1000);
					self.$input.val("");
					self.$modal.fadeOut(350);
				} else {
					$.infoAlert(obj.message);
				};
			});
		},
		//删除事件处理
		delPermissions: function(dataId) {
			var self = this;
			var data = {
				id: dataId
			};
			layer.confirm("您确定要删除该权限吗？", function() {
				self.aJaxRequestEvent(url_join("Role/delRole"), data, function(obj) {
					if(obj.result == "success") {
						//更新列表
						self.selPermissions(self.$page, self.$itemNum);
						layer.msg("删除成功", {
							icon: 1
						})
					} else {
						layer.alert(obj.message, {
							icon: 5
						});
					};
				});
			});
		},
		//修改事件处理
		changePermissions: function(id, name) {
			var self = this;
			var dataID = id;
			/*把当前修改的名称映射到表单上*/
			self.$input.val(name);
			/*取消on旧的绑定事件，绑定新的事件*/
			self.$changeBtn.off("click").on("click", function(e) {
				e.stopPropagation();
				var val = self.$input.val();
				var data = {
					id: dataID,
					roleName: val
				};
				self.aJaxRequestEvent(url_join("Role/updateRole"), data, function(obj) {
					if(obj.result == "success") {
						//更新列表
						self.selPermissions(self.$page, self.$itemNum);
						$.infoAlert("修改成功！");
						self.$input.val("");
						self.$modal.fadeOut(350);
					} else {
						$.infoAlert(obj.message);
					};
				});
			});
		}
	});

	win.privilegeManagement = privilegeManagement;
})(window, document, jQuery);

new privilegeManagement({
	tagsSelector: "#addPowersA"
});