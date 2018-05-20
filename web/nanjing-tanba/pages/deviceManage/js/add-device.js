(function(win, doc, $) {
	function addDevice(options) {
		this._init(options);
	}
	$.extend(addDevice.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				deviceMac: "#deviceMac", //设备MAC
				deviceName: "#deviceName", //设备名称
				deviceStatus: "#deviceStatus", //设备状态
				deviceType: "#deviceType", //设备类型
				longitude: "#longitude", //经度
				latitude: "#latitude", //纬度
				locationType: "#locationType", //位置类型
				antennaPower: "#antennaPower", //天线功率
				radiusDiv: ".radius", //地区
				detaiAdd: "#detaiAdd", //详细地址
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
			//设备MAC输入框对象
			self.$deviceMac = $(opts.deviceMac);
			//设备名称输入框对象
			self.$deviceName = $(opts.deviceName);
			//设备状态输入框对象
			self.$deviceStatus = $(opts.deviceStatus);
			//设备类型输入框对象
			self.$deviceType = $(opts.deviceType);
			//经度输入框对象
			self.$longitude = $(opts.longitude);
			//纬度输入框对象
			self.$latitude = $(opts.latitude);
			//提交按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$cancelBtn = $(opts.cancelBtn);
			//位置类型
			self.$locationType = $(opts.locationType);
			//天线功率
			self.$antennaPower = $(opts.antennaPower);
			//地区选择对象
			self.$radiusDiv = $(opts.radiusDiv);
			//详细地址输入框对象
			self.$detaiAdd = $(opts.detaiAdd);
			/*初始化*/
			self._initDomBindEvent();
			//初始化区域选择事件
			$.fn.zTree.init($("#treeDemo"), setting);
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
		//表单提交事件
		formSubmitEvent: function() {
			var self = this;
			if(self.$radiusDiv.children("div").length > 1) {
				layer.alert("只能选择一个地区！");
				return false;
			} else {
				var readiusId = self.$radiusDiv.find(".hasSelect").attr("data-id");
			}
			var param = {
				mac: self.$deviceMac.val(),
				nickname: self.$deviceName.val(),
				status: self.$deviceStatus.val(),
				ismove: self.$deviceType.val(),
				longitude: self.$longitude.val(),
				latitude: self.$latitude.val(),
				locationType: self.$locationType.val(),
				antennaPower: self.$antennaPower.val(),
				areaid: readiusId,
				addressinfo: self.$detaiAdd.val()
			};
			fnAjax.method_5(url_join1("Device/addDevice"), param, "post", function(msg) {
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
			});
		}
	});
	win.addDevice = addDevice;
})(window, document, jQuery);
new addDevice();