(function(win, doc, $) {
	function permissManage(options) {
		this._init(options);
	}
	$.extend(permissManage.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				addPowerBtn: ".addPowerBtn", //新增权限按钮
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
			//新增权限按钮
			self.$addPowerBtn = $(opts.addPowerBtn);
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
			/*获取权限列表*/
			self._initPowerList();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			self.$addPowerBtn.click(function(e) {
				e.preventDefault();
				self.openAddPowerWindow();
			});
			/*删除权限事件*/
			self.$tableData.on("click", self.$delObj, function(e) {
				e.stopPropagation();
				var dataId = $(this).parents("tr").attr("data-id");
				self.delNodeEvent(dataId);
			});
			/*编辑权限事件*/
			self.$tableData.on("click", self.$editBtn, function(e) {
				e.stopPropagation();
				var dataId = $(this).parents("tr").attr("data-id");
				self.openEditPowerWindow(dataId);
			});
		},
		//新增权限窗口
		openAddPowerWindow: function() {
			var self = this;
			layer.open({
				type: 2,
				title: '新增权限',
				maxmin: true,
				area: ['100%', '100%'],
				content: "permiss-add.html",
				end: function() {
					self._initPowerList(self.$page);
				}
			});
		},
		//编辑权限窗口
		openEditPowerWindow: function(did) {
			var self = this;
			sessionStorage.editPowerId = did;
			layer.open({
				type: 2,
				title: '编辑权限',
				maxmin: true,
				area: ['100%', '100%'],
				content: "permiss-edit.html",
				end: function() {
					sessionStorage.removeItem("editPowerId");
					self._initPowerList(self.$page);
				}
			});
		},
		/*获取权限列表*/
		_initPowerList: function(page) {
			var self = this;
			var data = {
				page: page || 1, //页数
			};
			fnAjax.method_5(url_join('Node/queryNode'), data, "get", function(res) {
				if(res.code == 1) {
					layer.alert(res.message);
				} else {
					var data = res.data.data;
					if(data.length > 0) {
						var trs = "";
						$.each(data, function(i, obj) {
							trs += '<tr data-id="' + obj.id + '" class="power-group">' +
								'<td>' +
								'<i class="glyphicon glyphicon-th"></i>' +
								'<span>' + obj.name + '</span>' +
								'</td>' +
								'<td colspan="2">' +
								'<span>' + obj.operation + '</span>' +
								'</td>' +
								'<td class="text-c">' +
								'<a href="#" class="btn btn-default delBtn">删除权限组</a>' +
								'</td>' +
								'</tr>';
							$.each(obj.child, function(i, child) {
								trs += '<tr data-id="' + child.id + '" data-pid="' + child.parentid + '">' +
									'<td>' +
									'<i class="glyphicon glyphicon-minus pl-15"></i> ' +
									'<span>' + child.name + '</span>' +
									'</td>' +
									'<td>' +
									'<span>' + child.operation + '</span>' +
									'</td>' +
									'<td>' +
									'<span>(' + child.str + ')</span>' +
									'</td>' +
									'<td class="text-c">' +
									'<a href="#" class="btn btn-default mr-5 delBtn">删除</a>' +
									'<a href="#" class="btn btn-default editBtn">编辑</a>' +
									'</td>' +
									'</tr>';
							});
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
										self._initPowerList(objs.curr);
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
				fnAjax.method_5(url_join("Node/delNode"), data, "post", function(obj) {
					if(obj.result == "success") {
						//更新列表
						self._initPowerList(self.$page);
						layer.msg("删除成功", {
							icon: 1
						})
					} else {
						layer.alert("删除失败", {
							icon: 5
						});
					};
				});
			});
		}
	});
	win.permissManage = permissManage;
})(window, document, jQuery);
new permissManage();