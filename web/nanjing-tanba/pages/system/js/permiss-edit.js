(function(win, doc, $) {
	function permissAdd(options) {
		this._init(options);
	}
	$.extend(permissAdd.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				powerName: "#powerName", //权限名称下拉框
				powerNameSel: "#powerName option:selected", //权限名称下拉框(已选择)
				powerType: "#powerType", //权限类型下拉框
				powerNode: "#powerNode", //权值组对应后台控制器
				supPower: "#supPower", //上级权限下拉框
				powerNameSub: "#powerName-sub", //子权限名称
				powerNodeSub: "#powerNode-sub", //子权限函数名
				powerTypeStr: "#powerType-str", //子权限功能类型
				powerTypeStrSel: "#powerType-str option:selected", //子权限功能类型(已选择)
				submitBtn: ".submitBtn", //提交按钮
				resetBtn: ".resetBtn" //取消按钮
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
			//权限名称下拉框对象
			self.$powerName = $(opts.powerName);
			//权限类型下拉框对象
			self.$powerType = $(opts.powerType);
			//权限组控制器对象
			self.$powerNode = $(opts.powerNode);
			//上级权限下拉框对象
			self.$supPower = $(opts.supPower);
			//子权限名称对象
			self.$powerNameSub = $(opts.powerNameSub);
			//子权限函数名对象
			self.$powerNodeSub = $(opts.powerNodeSub);
			//子权限功能类型对象
			self.$powerTypeStr = $(opts.powerTypeStr);
			//提交按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$resetBtn = $(opts.resetBtn);
			/*初始化*/
			self._initDomBindEvent();
			/*初始化表单*/
			self.changeTypeEvent();
			/*获取子权限数据*/
			self.getSubPowerDataEvent();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			//确定按钮事件绑定
			self.$submitBtn.click(function(e) {
				e.preventDefault();
				self.submitBtnEvent();
			});
			//取消按钮事件绑定
			self.$resetBtn.click(function(e) {
				e.preventDefault();
				var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				parent.layer.close(index); //再执行关闭   
				return false;
			});
		},
		//切换类型事件
		changeTypeEvent: function() {
			var self = this;
			var value = self.$powerType.val();
			if(value == "1") {
				//子权限事件
				self.supPowerList();
				$("input").val("");
				$(".supPowerBox").hide();
				$(".subPowerBox").show();
			} else {
				//权限组事件
				$("input").val("");
				$(".supPowerBox").show();
				$(".subPowerBox").hide();
			}
		},
		//确定事件
		submitBtnEvent: function() {
			var self = this;
			//更具类型提交不同事件
			var tid = self.$powerType.val();
			if(tid == "0") {
				//权限组提交事件
				self.addNodeEvent();
			} else {
				//子权限提交事件
				self.addSubPowerEvent();
			}
		},
		//权限组-权限名称列表
		powerNameList: function() {
			var self = this;
			fnAjax.method_5('js/navList.json', {}, "get", function(obj) {
				if(obj.ResultCode == "SUCCESS") {
					/*判断有无上级节点*/
					if(obj.data.length > 0) {
						var optionStr = "";
						$.each(obj.data, function(i, obj) {
							optionStr += "<option value='" + obj.str + "'>" + obj.str + "</option>";
						});
						self.$powerName.html(optionStr);
					} else {
						layer.alert("至少要有一个权限组", {
							end: function() {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							}
						});
					}
				} else {
					layer.alert(obj.message);
				};
			});
		},
		//权限组-上级权限列表
		supPowerList: function() {
			var self = this;
			fnAjax.method_5(url_join('Node/getParentNode'), {}, "get", function(obj) {
				if(obj.ResultCode == "SUCCESS") {
					/*判断有无上级节点*/
					if(obj.data.length > 0) {
						var optionStr = "";
						$.each(obj.data, function(i, obj) {
							optionStr += "<option value='" + obj.id + "'>" + obj.controller + "</option>";
						});
						self.$supPower.html(optionStr);
					} else {
						layer.alert("至少要有一个权限组", {
							end: function() {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							}
						});
					}
				} else {
					layer.alert(obj.message);
				};
			});
		},
		//获取子权限数据
		getSubPowerDataEvent: function() {
			var self = this;
			var did = sessionStorage.getItem("editPowerId");
			var data = {
				id: did
			};
			fnAjax.method_5(url_join('Node/getNodeDetail'), data, "get", function(obj) {
				//当前上级权限
				self.$supPower.val(obj[0].parentId);
				//当前子权限名称
				self.$powerNameSub.val(obj[0].name);
				//当前子节点函数名
				self.$powerNodeSub.val(obj[0].action);
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
				self.$powerTypeStr.val(str);
			});
		},
		//新增权限组事件处理
		addNodeEvent: function() {
			var self = this;
			//节点类型内容
			var tid = self.$powerType.val();
			//节点名称下拉列表对象(选中的)
			self.$nodeOption = $(self.options.powerNameSel);
			var name = self.$nodeOption.val();
			//获取输入框控制器名称
			var val = self.$powerNode.val();
			var data = {
				parentId: tid,
				name: name,
				operation: val,
				str: 0
			};
			fnAjax.method_5(url_join('Node/addNode'), data, "post", function(obj) {
				if(obj.result == "success") {
					layer.alert(obj.message, {
						end: function() {
							layer.confirm('是否留在此页？', {
								btn: ['否', '是'] //按钮
							}, function() {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							});
						}
					});
				} else {
					layer.alert(obj.message);
				}
			});
		},
		//新增子权限事件
		addSubPowerEvent: function() {
			var self = this;
			//上级权限id
			var upId = self.$supPower.val();
			//权限名
			var name = self.$powerNameSub.val();
			//子节点函数名
			var val = self.$powerNodeSub.val();
			//子节点函数名类型
			if(self.$powerTypeStr.val() == "-1") {
				layer.alert("请选择类别");
			} else {
				self.$powerTypeStrSel = $(self.options.powerTypeStrSel);
				var type = self.$powerTypeStrSel.html();
				var data = {
					parentId: upId,
					name: name,
					operation: val,
					str: type
				};
				fnAjax.method_5(url_join('Node/updateNode'), data, "post", function(obj) {
					if(obj.result == "success") {
						layer.alert(obj.message, {
							end: function() {
								layer.confirm('是否留在此页？', {
									btn: ['否', '是'] //按钮
								}, function() {
									var index = parent.layer.getFrameIndex(window.name);
									parent.layer.close(index);
								});
							}
						});
					} else {
						layer.alert(obj.message);
					}
				});
			};
		}
	});
	win.permissAdd = permissAdd;
})(window, document, jQuery);
new permissAdd();