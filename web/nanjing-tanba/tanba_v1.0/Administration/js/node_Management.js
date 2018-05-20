(function(win, doc, $) {
	function nodeManagement(options) {
		this._init(options);
	}
	$.extend(nodeManagement.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				tagsSelector: "#addPowersA", //打开模态窗选择器
				modalSelector: "#modal-Content-box", //模态窗选择器
				colseSelector: "#modal-Content-window-title-closeBtn", //关闭模态窗选择器
				modalTextSelector: ".modal-Content-window-title-text", //模态框标题
				maskSelector: ".modal-Content-mask", //蒙版选择器
				promptSelector: '.conShow_box_Prompt', //没有数据
				tableSelector: "#conShow-box-inner-table", //数据展示表格选择器
				nodeNameTypeSelect: "#nodeNameType-select", //节点类型选择器
				nodeNameSelect: "#nodeName-select", //节点名称下拉列表选择器
				nodeNameSelectOption: "#nodeName-select option:selected", //节点名称下拉列表选择器（选中的）
				nodeNameInputSelect: "#nodeName-input", //节点控制器输入框选择器
				upNodeSelect: "#upNode", //上级权限下拉框选择器
				childNodeSelect: "#childNodeName-input", //子节点名控制器输入框选择器
				childNodeFunSelect: "#childNodeFunName", //子节点接口名输入框选择器
				childNodeTypeSelect: "#childNodeType", //子权限定义的功能类型下拉列表选择器
				childNodeTypeSelectOption: "#childNodeType option:selected", //子权限定义的功能类型下拉列表选择器（选中的）
				submitSelector: "#nodeNameSubmit", //提交按钮选择器
				typeSubmitSelector: "#childNodeTypeSubmit", //子节点提交按钮选择器
				updateSubmitSelector: "#updateSubmit" //编辑按钮选择器
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
			//蒙板标题对象
			this.$title = $(opts.modalTextSelector);
			//状态提示对象
			this.$prompt = $(opts.promptSelector);
			//展示表格对象
			this.$table = $(opts.tableSelector);
			//节点类型对象
			this.$nodeType = $(opts.nodeNameTypeSelect);
			//节点名称下拉列表对象
			this.$nodeSelect = $(opts.nodeNameSelect);
			//上级权限下拉框对象
			this.$upNodeSelect = $(opts.upNodeSelect);
			//节点名称输入框对象
			this.$nodeInput = $(opts.nodeNameInputSelect);
			//子节点名称输入框对象
			this.$childInput = $(opts.childNodeSelect);
			//子节点接口名输入框对象
			this.$childFunInput = $(opts.childNodeFunSelect);
			//子节点接口类型下拉框对象
			this.$childType = $(opts.childNodeTypeSelect);
			//提交按钮对象
			this.$submitBtn = $(opts.submitSelector);
			//子节点提交按钮对象
			this.$childSubmitBtn = $(opts.typeSubmitSelector);
			//编辑提交按钮对象
			this.$updataSubmitBtn = $(opts.updateSubmitSelector);
			//删除按钮对象
			this.$delObj = ".conShow-table-delBtn";
			//编辑按钮对象
			this.$updateObj = ".conShow-table-updateBtn";
			//当前查询页码
			this.$page = 1;
			//每次查询数目
			this.$itemNum = 10;
			/*初始化*/
			this.selNodeEvent(this.$page, this.$itemNum);
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
				//修改标题文字
				self.$title.html("新增权限");
				self.$nodeType.val("0").trigger("change");
				self.$modal.fadeIn(350);
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
			/*新增节点ajax请求事件*/
			self.$submitBtn.on("click", function(e) {
				e.stopPropagation();
				self.addNodeEvent();
			});
			/*删除权限名事件*/
			self.$table.on("click", self.$delObj, function(e) {
				e.stopPropagation();
				var dataId = $(this).parents("tr").attr("data-id");
				self.delNodeEvent(dataId);
			});
			//下拉列表切换事件
			self.$nodeType.on("change", function() {
				if($(this).val() == "1") {
					//隐藏权限名下拉框
					self.$nodeSelect.parent("div").hide();
					//隐藏后台控制器输入框
					self.$nodeInput.parent("div").hide();
					//显示上级权限下拉框
					self.$upNodeSelect.parent("div").show();
					//显示子节点名输入框
					self.$childInput.parent("div").show();
					//显示子接口名输入框
					self.$childFunInput.parent("div").show();
					//显示子接口类型下拉框
					self.$childType.parent("div").show();
					//切换提交按钮
					self.$submitBtn.hide();
					self.$childSubmitBtn.show();
					self.$updataSubmitBtn.hide();
					//切换事件
					self.switchTypeEvent();
				} else {
					//隐藏上级权限下拉框
					self.$upNodeSelect.parent("div").hide();
					//隐藏子节点名输入框
					self.$childInput.parent("div").hide();
					//隐藏子接口名输入框
					self.$childFunInput.parent("div").hide();
					//隐藏子接口类型下拉框
					self.$childType.parent("div").hide();
					//显示权限名下拉框
					self.$nodeSelect.parent("div").show();
					//显示后台控制器输入框
					self.$nodeInput.parent("div").show();
					//切换提交按钮
					self.$submitBtn.show();
					self.$childSubmitBtn.hide();
					self.$updataSubmitBtn.hide();
				}
			});
			/*新增子节点ajax请求事件*/
			self.$childSubmitBtn.on("click", function(e) {
				e.stopPropagation();
				self.addChildNodeEvent();
			});
			/*编辑子节点事件*/
			self.$table.on("click", self.$updateObj, function(e) {
				e.stopPropagation();
				//修改标题文字
				self.$title.html("编辑子权限");
				//隐藏权限名下拉框
				self.$nodeSelect.parent("div").hide();
				//隐藏后台控制器输入框
				self.$nodeInput.parent("div").hide();
				//显示上级权限下拉框
				self.$upNodeSelect.parent("div").show();
				//显示子节点名输入框
				self.$childInput.parent("div").show();
				//显示子接口名输入框
				self.$childFunInput.parent("div").show();
				//显示子接口类型下拉框
				self.$childType.parent("div").show();
				//切换提交按钮
				self.$submitBtn.hide();
				self.$childSubmitBtn.hide();
				self.$updataSubmitBtn.show();
				//事件
				self.updateChildNodeEvent(this);
			});
			//编辑提交事件
			self.$updataSubmitBtn.on("click", function(e) {
				e.stopPropagation();
				self.updateChildNodeSubmitEvent();
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
				data: param || {},
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				dataType: "json",
				timeout: 30000,
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
		selNodeEvent: function(page, itemNum) {
			var self = this;
			var data = {
				page: page, //页数
				itemNum: itemNum //条目
			}
			self.aJaxRequestEvent(url_join('Node/queryNode'), data, function(obj) {
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
				//如果总量未0，则...
				if(obj.count == 0) {
					self.$prompt.show();
				} else {
					self.$prompt.hide();
					var arrs = obj.data;
					var str = "";
					var optionStr = "";
					/*渲染表格 tr*/
					$.each(arrs, function(i, ele) {
						str += '<tr class="tr-ul" data-id="' + ele.id + '">' +
							'<td><span class="glyphicon glyphicon-th-large"></span>' + ele.name + '</td>' +
							"<td>" + ele.operation + "</td>" +
							'<td class="td-operate"><button class="conShow-table-delBtn">删除权限组</button></td>' +
							"</td></tr>";
						$.each(ele.child, function(i, e) {
							str += '<tr data-id="' + e.id + '" data-uid="' + ele.id + '">' +
								'<td><span class="glyphicon glyphicon-list tr-li"></span>' +
								'<span class="nodeName">' + e.name + '</span>' +
								'<span class="str">(' + e.str + ')</span></td>' +
								"<td><span class='nodeOper'>" + e.operation + "</span></td>" +
								'<td class="td-operate"><button class="conShow-table-updateBtn">编辑</button><button class="conShow-table-delBtn">删除</button></td>' +
								"</td></tr>";
						})
					});
					/*渲染表格*/
					self.$table.children("tbody").html(str);
					//载入分页
					self.pagedQueryPermissions(obj);
				}
			});
		},
		//分页查询事件
		pagedQueryPermissions: function(obj) {
			var self = this;
			//当前页数
			self.$page = obj.currPage;
			//总条数
			var totalcount = obj.count;
			//调用分页插件
			$('#pageToolbar').Paging({
				current: self.$page,
				pagesize: self.$itemNum,
				count: totalcount,
				callback: function(page, size, count) {
					self.selNodeEvent(page, size);
				}
			});
		},
		//新增事件处理
		addNodeEvent: function() {
			var self = this;
			//节点类型内容
			var tid = self.$nodeType.val();
			//节点名称下拉列表对象(选中的)
			self.$nodeOption = $(self.options.nodeNameSelectOption);
			var name = self.$nodeOption.text();
			//获取输入框控制器名称
			var val = self.$nodeInput.val();
			var data = {
				parentId: tid,
				name: name,
				operation: val,
				str: 0
			};
			self.aJaxRequestEvent(url_join('Node/addNode'), data, function(obj) {
				if(obj.result == "success") {
					//更新页面
					self.selNodeEvent(self.$page, self.$itemNum);
					$.infoAlert(obj.message, 1000);
					self.$nodeInput.val("");
					self.$modal.fadeOut(350);
				} else {
					layer.alert(obj.message);
				}
			});
		},
		//删除事件处理
		delNodeEvent: function(dataId) {
			var self = this;
			var data = {
				id: dataId
			};
			layer.confirm("您确定要删除角色吗？", function() {
				self.aJaxRequestEvent(url_join("Node/delNode"), data, function(obj) {
					if(obj.result == "success") {
						//更新列表
						self.selNodeEvent(self.$page, self.$itemNum);
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
		},
		//切换类型事件处理
		switchTypeEvent: function() {
			var self = this;
			self.aJaxRequestEvent(url_join('Node/getParentNode'), {}, function(obj) {
				if(obj.ResultCode == "SUCCESS") {
					/*判断有无上级节点*/
					if(obj.data.length > 0) {
						var optionStr = "";
						$.each(obj.data, function(i, obj) {
							optionStr += "<option value='" + obj.id + "'>" + obj.controller + "</option>";
						});
						self.$upNodeSelect.html(optionStr);
					} else {
						layer.alert("至少要有一个一级节点");
						self.$nodeType.val("0").trigger("change");
					}
				} else {
					layer.alert(obj.message);
				};
			});
		},
		//新增子节点事件处理
		addChildNodeEvent: function() {
			var self = this;
			//上级权限id
			var upId = self.$upNodeSelect.val();
			//权限名
			var name = self.$childInput.val();
			//子节点函数名
			var val = self.$childFunInput.val();
			//子节点函数名类型
			if(self.$childType.val() == "-1") {
				layer.alert("请选择类别");
			} else {
				self.$childTypeOption = $(self.options.childNodeTypeSelectOption);
				var type = self.$childTypeOption.html();
				var data = {
					parentId: upId,
					name: name,
					operation: val,
					str: type
				};
				self.aJaxRequestEvent(url_join('Node/addNode'), data, function(obj) {
					if(obj.result == "success") {
						//更新页面
						self.selNodeEvent(self.$page, self.$itemNum);
						$.infoAlert(obj.message, 1000);
						/*清空输入项*/
						self.$childInput.val("");
						self.$childFunInput.val("");
						self.$childType.val("-1");
						/*关闭弹框*/
						self.$modal.fadeOut(350);
					} else {
						layer.alert(obj.message);
					}
				});
			}
		},
		//编辑子节点事件
		updateChildNodeEvent: function(ele) {
			var self = this;
			//当前子节点id
			var nodeId = $(ele).parents("tr").attr("data-id");
			//获取当前子节点的数据
			var obj = self.getNodeDetail(nodeId);
			//载入父节点列表，切换到选项
			self.aJaxRequestEvent(url_join('Node/getParentNode'), {}, function(obj) {
				if(obj.ResultCode == "SUCCESS") {
					var optionStr = "";
					$.each(obj.data, function(i, obj) {
						optionStr += "<option value='" + obj.id + "'>" + obj.controller + "</option>";
					});
					self.$upNodeSelect.html(optionStr);
					var upNodeId = $(ele).parents("tr").attr("data-uid");
					$(self.options.upNodeSelect).val(upNodeId);
				} else {
					layer.alert(obj.message);
				};
			});
		},
		//获取指定id的子节点
		getNodeDetail: function(nodeId) {
			var self = this;
			var data = {
				id: nodeId
			};
			self.aJaxRequestEvent(url_join('Node/getNodeDetail'), data, function(obj) {
				if(obj) {
					//修改类型
					if(obj[0].lervel == "2") {
						self.$nodeType.val("1");
					} else {
						self.$nodeType.val("0");
					};
					//当前子节点的名称
					self.$childInput.val(obj[0].name);
					//当前子节点的接口
					self.$childFunInput.val(obj[0].action);
					//显示模态框
					self.$modal.fadeIn(350);
					//保存当前子节点的ID
					$("#childNodeId").val(nodeId);
					//当前子节点类型
					var str = "";
					switch(obj[0].str) {
						case "添加":
							var str = "0";
							break;
						case "删除":
							var str = "3";
							break;
						case "编辑":
							var str = "2";
							break;
						case "查看":
							var str = "1";
							break;
						default:
							break;
					}
					self.$childType.val(str);
				}
			});
		},
		//编辑提交事件
		updateChildNodeSubmitEvent: function() {
			var self = this;
			//当前子节点的id
			var nodeId = $("#childNodeId").val();
			//上级权限id
			var upId = self.$upNodeSelect.val();
			//权限名
			var name = self.$childInput.val();
			//子节点函数名
			var val = self.$childFunInput.val();
			//子节点函数名类型
			if(self.$childType.val() == "-1") {
				layer.alert("请选择类别");
			} else {
				self.$childTypeOption = $(self.options.childNodeTypeSelectOption);
				var type = self.$childTypeOption.html();
				var data = {
					parentId: upId,
					name: name,
					operation: val,
					str: type,
					id: nodeId
				};
				self.aJaxRequestEvent(url_join('Node/updateNode'), data, function(obj) {
					if(obj.result == "success") {
						//更新页面
						self.selNodeEvent(self.$page, self.$itemNum);
						$.infoAlert(obj.message, 1000);
						/*清空输入项*/
						self.$childInput.val("");
						self.$childFunInput.val("");
						self.$childType.val("-1");
						/*关闭弹框*/
						self.$modal.fadeOut(350);
					} else {
						layer.alert(obj.message);
					}
				});
			}
		}
	});
	win.nodeManagement = nodeManagement;
})(window, document, jQuery);

new nodeManagement();