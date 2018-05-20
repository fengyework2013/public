(function(win, doc, $) {
	function userManage(options) {
		this._init(options);
	}
	$.extend(userManage.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				addUserBtn: ".addUserBtn", //新增用户按钮
				queryBtn: "#queryBtn", //搜索按钮
				tableData: ".table-data" //数据表格
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
			//搜索按钮对象
			self.$queryBtn = $(opts.queryBtn);
			//新增用户按钮
			self.$addUserBtn = $(opts.addUserBtn);
			//数据表格对象
			self.$tableData = $(opts.tableData);
			//删除按钮对象
			self.$delObj = ".delBtn";
			//编辑按钮对象
			self.$editBtn = ".editBtn";
			/*初始化*/
			self._initDomBindEvent();
			//当前查询页码
			self.$page = 1;
			//当前搜索内容
			self.$keyword = "";
			/*获取权限列表*/
			self._initPowerList();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			self.$addUserBtn.click(function(e) {
				self.openAddPowerWindow();
				return false;
			});
			/*删除权限事件*/
			self.$tableData.on("click", self.$delObj, function(e) {
				var dataId = $(this).parents("tr").attr("data-id");
				self.delNodeEvent(dataId);
				return false;
			});
			/*编辑权限事件*/
			self.$tableData.on("click", self.$editBtn, function(e) {
				var dataId = $(this).parents("tr").attr("data-id");
				self.openEditPowerWindow(dataId);
				return false;
			});
			//搜索事件绑定
			self.$queryBtn.click(function(e) {
				self.$page = 1;
				self.$keyword = $("#keyWord").val();
				$("#pageTool").html("");
				self._initPowerList(self.$page, self.$keyword);
				return false;
			});
		},
		//新增权限窗口
		openAddPowerWindow: function() {
			var self = this;
			layer.open({
				type: 2,
				title: '添加用户',
				maxmin: true,
				area: ['100%', '100%'],
				content: "user-add.html",
				end: function() {
					self._initPowerList(self.$page);
				}
			});
		},
		//编辑权限窗口
		openEditPowerWindow: function(uid) {
			var self = this;
			sessionStorage.editUser = uid;
			layer.open({
				type: 2,
				title: '编辑用户',
				maxmin: true,
				area: ['100%', '100%'],
				content: "user-edit.html",
				end: function() {
					sessionStorage.removeItem("editUser");
					self._initPowerList(self.$page);
				}
			});
		},
		/*获取权限列表*/
		_initPowerList: function(page, keyword) {
			var self = this;
			var data = {
				page: page || 1, //页数
				keyword: keyword || "" //关键字
			};
			fnAjax.method_5(url_join('AdminUser/queryUser'), data, "get", function(res) {
				if(res.code == 1) {
					layer.alert(res.message);
				} else {
					var data = res.data.data;
					if(data.length > 0) {
						var trs = "";
						$.each(data, function(i, obj) {
							trs += '<tr class="text-c" data-id="' + obj.id + '">' +
								'<td><input type="checkbox" name="" id="" value="" /></td>' +
								'<td>' + (i + 1) + '</td>' +
								'<td>' + obj.username + '</td>' +
								'<td>' + obj.rolename + '</td>' +
								'<td>' + obj.createtime + '</td>' +
								'<td class="td-option">' +
								'<a class="editBtn" href="#">编辑</a>' +
								'<a class="delBtn" href="#">删除</a>' +
								'</td>' +
								'</tr>';
						});
						self.$tableData.children("tbody").html(trs);
						/*修改总页数*/
						$(".pageNum").html(res.data.last_page);
						/*修改总条数*/
						$(".dataNum").html(res.data.total);
						/*分页*/
						if($("#pageTool").html() == "") {
							/*调用分页*/
							laypage({
								cont: 'pageTool', //控制分页容器，
								pages: res.data.last_page, //总页数
								skip: true, //是否开启跳页
								groups: 3, //连续显示分页数
								first: '首页', //若不显示，设置false即可
								last: '尾页', //若不显示，设置false即可
								prev: '<', //若不显示，设置false即可
								next: '>', //若不显示，设置false即可
								hash: true, //开启hash
								jump: function(objs, first) {
									if(!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
										self._initPowerList(objs.curr,self.$keyword);
										self.$page = objs.curr;
									};
								}
							});
						};
					} else {
						self.$tableData.children("tbody").html("");
						$("#pageTool").html("没有数据");
					}
				};
			});
		},
		//删除事件处理
		delNodeEvent: function(dataId) {
			var self = this;
			var data = {
				id: dataId
			};
			layer.confirm("确定要删除吗？", function() {
				fnAjax.method_5(url_join("AdminUser/delUser"), data, "post", function(obj) {
					if(obj.code == 0) {
						//更新列表
						self._initPowerList(self.$page);
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
		}
	});
	win.userManage = userManage;
})(window, document, jQuery);
new userManage();