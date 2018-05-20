(function(win, doc, $) {
	function rfManage(options) {
		this._init(options);
	}
	$.extend(rfManage.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				searchType: "#searchType", //搜索类型输入框
				deviceStatus: "#deviceStatus", //设备状态下拉框
				searchCont: "#searchCont", //搜索内容输入框
				refresh: ".refresh", //刷新页面
				queryTarget: ".queryTarget", //搜索内容按钮
				addDevice: ".addDevice", //新增设备
				deviceLisTable: "#deviceLisTable" //设备列表表格
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
			//搜索类型输入框对象
			self.$searchType = $(opts.searchType);
			//设备状态下拉框对象
			self.$deviceStatus = $(opts.deviceStatus);
			//搜索内容输入框对象
			self.$searchCont = $(opts.searchCont);
			//搜索设备按钮对象
			self.$queryTarget = $(opts.queryTarget);
			//刷新页面按钮对象
			self.$refresh = $(opts.refresh);
			//新增设备
			self.$addDevice = $(opts.addDevice);
			//表格对象
			self.$deviceLisTable = $(opts.deviceLisTable);
			/*初始化*/
			self._initDomBindEvent();
			/*初始化当前页数*/
			self.thisPage = 1;
			/*初始化设备列表*/
			self.getDeviceList();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			//搜索内容事件绑定
			self.$queryTarget.click(function(e) {
				e.preventDefault();
				$("#pageTool").html("");
				self.searchContEvent();
			});
			//新增设备
			self.$addDevice.click(function(e) {
				e.preventDefault();
				self.addDeviceAlertEvent();
			});
			//编辑信息
			self.$deviceLisTable.on("click", ".editDevice", function(e) {
				e.preventDefault();
				self.editInfoEvent(this);
			});
			//切换状态
			self.$deviceLisTable.on("click", ".status", function(e) {
				e.preventDefault();
				self.switchStateEvent(this);
			});
			//刷新页面
			self.$refresh.click(function(e) {
				e.preventDefault();
				location.reload(true);
			});
		},
		//搜索内容事件
		searchContEvent: function(pageNum) {
			var self = this;
			var type = self.$searchType.val();
			var keyword = self.$searchCont.val();
			var status = self.$deviceStatus.val();
			var param = {
				page: pageNum || 1,
				type: type || "0",
				keyword: keyword || "",
				status: status || "-1"
			};
			fnAjax.method_5(url_join1("Tag/queryTag"), param, "post", function(res) {
				if(res.code == 0) {
					var data = res.data.data;
					if(data.length > 0) {
						var trs = "";
						for(var i = 0; i < data.length; i++) {
							//状态转换
							var status = "";
							switch(data[i].status) {
								case 0:
									status = "停止"
									break;
								case 1:
									status = "正常"
									break;
								case 2:
									status = "报废"
									break;
								default:
									status = "未知"
							};
							//转换人员是否绑定
							var name = "";
							if(data[i].name == null) {
								name = "未绑定";
							} else {
								name = data[i].name;
							};
							//转换电话是否绑定
							var tel = "";
							if(data[i].tel == null) {
								tel = "未绑定";
							} else {
								tel = data[i].tel;
							};
							trs += '<tr data-id="' + data[i].id + '" data-mac="' + data[i].deviceID + '">' +
								'<td>' + data[i].deviceID + '</td>' +
								'<td>' + name + '</td>' +
								'<td>' + tel + '</td>' +
								'<td><a href="#" class="status">' + status + '</a></td>' +
								'<td>' + data[i].createtime + '</td>' +
								'<td>' +
								'<a href="#" class="editDevice mr-15">编辑</a>' +
								'</td></tr>';
						};
						$(".stateInforBar").hide();
						self.$deviceLisTable.children("tbody").html(trs);
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
										self.searchContEvent(objs.curr, param.type, param.keyword, param.status);
										self.thisPage = objs.curr;
									};
								}
							});
						};
					} else {
						self.$deviceLisTable.children("tbody").html("");
						$("#pageTool").html("");
						$(".stateInforBar").show();
					};
				} else {
					layer.msg(res.message);
				}
			});
		},
		//新增设备弹框事件
		addDeviceAlertEvent: function() {
			var self = this;
			var tPage = self.thisPage;
			layer.open({
				type: 2,
				title: '新增设备',
				maxmin: true,
				area: ['70%', '330px'],
				content: "add-RF.html",
				cancel: function() {
					self.getDeviceList(tPage);
				},
				end: function() {
					self.getDeviceList(tPage);
				}
			});
		},
		//获取设备列表
		getDeviceList: function(pageNum) {
			var self = this;
			var param = {
				page: pageNum || 1
			};
			fnAjax.method_5(url_join1("Tag/queryTag"), param, "get", function(res) {
				if(res.code == 0) {
					var data = res.data.data;
					if(data.length > 0) {
						var trs = "";
						for(var i = 0; i < data.length; i++) {
							//状态转换
							var status = "";
							switch(data[i].status) {
								case 0:
									status = "停止"
									break;
								case 1:
									status = "正常"
									break;
								case 2:
									status = "报废"
									break;
								default:
									status = "未知"
							};
							//转换人员是否绑定
							var name = "";
							if(data[i].name == null) {
								name = "未绑定";
							} else {
								name = data[i].name;
							};
							//转换电话是否绑定
							var tel = "";
							if(data[i].tel == null) {
								tel = "未绑定";
							} else {
								tel = data[i].tel;
							};
							trs += '<tr data-id="' + data[i].id + '" data-mac="' + data[i].deviceID + '">' +
								'<td>' + data[i].deviceID + '</td>' +
								'<td>' + name + '</td>' +
								'<td>' + tel + '</td>' +
								'<td><a href="#" class="status">' + status + '</a></td>' +
								'<td>' + data[i].createtime + '</td>' +
								'<td>' +
								'<a href="#" class="editDevice mr-15">编辑</a>' +
								'</td></tr>';
						};
						$(".stateInforBar").hide();
						self.$deviceLisTable.children("tbody").html(trs);
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
										self.getDeviceList(objs.curr);
										self.thisPage = objs.curr;
									};
								}
							});
						};
					} else {
						self.$deviceLisTable.children("tbody").html("");
						$("#pageTool").html("");
						$(".stateInforBar").show();
					};
				} else {
					layer.msg(res.message);
				}
			});
		},
		//编辑信息事件
		editInfoEvent: function(dom) {
			var self = this;
			var did = $(dom).parents("tr").attr("data-id");
			sessionStorage.did = did;
			var tPage = self.thisPage;
			layer.open({
				type: 2,
				title: '编辑设备',
				maxmin: true,
				area: ['70%', '330px'],
				content: "edit-RF.html",
				cancel: function() {
					self.getDeviceList(tPage);
				},
				end: function() {
					self.getDeviceList(tPage);
				}
			});
		},
		//切换状态事件
		switchStateEvent: function(dom) {
			var self = this;
			var did = $(dom).parents("tr").attr("data-id");
			sessionStorage.did = did;
			var tPage = self.thisPage;	
			layer.open({
				type: 2,
				title: '切换设备状态',
				skin: 'layui-layer-rim', //加上边框
				area: ['300px', '200px'],
				content: "switch-status.html",
				cancel: function() {
					self.getDeviceList(tPage);
				},
				end: function() {
					self.getDeviceList(tPage);
				}
			});
		}
	});
	win.rfManage = rfManage;
})(window, document, jQuery);
new rfManage();