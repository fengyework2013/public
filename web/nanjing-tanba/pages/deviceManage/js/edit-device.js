(function(win, doc, $) {
	function editDevice(options) {
		this._init(options);
	}
	$.extend(editDevice.prototype, {
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
			//初始化数据
			self.getDeviceInfoEvent();
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
		//获取设备id
		getLetterCompanyID: function() {
			var did = sessionStorage.getItem("did");
			if(did) {
				return did;
			} else {
				layer.open({
					content: '获取用设备信息失败！',
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
		//获取设备信息事件
		getDeviceInfoEvent: function() {
			var self = this;
			var did = self.getLetterCompanyID();
			if(did) {
				var param = {
					id: did
				};
				fnAjax.method_5(url_join1("Device/getInfo"), param, "get", function(msg) {
					if(msg.code == 0) {
						var data = msg.data;
						//获取以选择的区域
						if(data.areaid) {
							var param2 = {
								id: data.areaid
							};
							var address = "";
							fnAjax.method_5(url_join2("areaInfo"), param2,"get", function(res) {
								if(res.code == "0") {
									addHtml = '<div class="hasSelect btn-group" data-id="' + res.data[0].id + '" data-pid="' + res.data[0].is_parent + '">' +
										'<button type="button" class="btn btn-sm btn-primary selectContent">' + res.data[0].address + '</button>' +
										'<a href="#" class="closeBtn btn btn-sm btn-danger">X</a></div>';
									self.$radiusDiv.html(addHtml);
								} else {
									layer.alert("获取地区信息失败：" + msg.message);
								};
							}, "post");
						};
						//其他数据信息
						self.$deviceMac.val(data.mac);
						self.$deviceName.val(data.nickname);
						self.$deviceStatus.val(data.status);
						self.$deviceType.val(data.ismove);
						self.$longitude.val(data.longitude);
						self.$latitude.val(data.latitude);
						self.$detaiAdd.val(data.addressinfo);
						self.$locationType.val(data.locationType);
						self.$antennaPower.val(data.antennaPower);
					} else {
						layer.alert("获取设备信息失败：" + msg.message);
					};
				});
			}
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
			var did = sessionStorage.getItem("did");
			var param = {
				id: did,
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
			fnAjax.method_5(url_join1("Device/editDevice"), param, "post", function(msg) {
				if(msg.code == 0) {
					layer.alert("修改成功", {
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
	win.editDevice = editDevice;
})(window, document, jQuery);
new editDevice();