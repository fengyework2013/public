(function(win, doc, $) {
	function editRF(options) {
		this._init(options);
	}
	$.extend(editRF.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				deviceStatus: "#deviceStatus", //下拉框对象
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
			//下拉框对象
			self.$deviceStatus = $(opts.deviceStatus);
			//提交按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$cancelBtn = $(opts.cancelBtn);
			/*初始化*/
			self._initDomBindEvent();
			/*初始化设备信息*/
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
				fnAjax.method_5(url_join1("Tag/getInfo"), param, "get", function(msg) {
					if(msg.code == 0) {
						var data = msg.data;
						//下拉框对象
						self.$deviceStatus.val(data.status);
					} else {
						layer.alert("获取设备信息失败：" + msg.message);
					};
				});
			}
		},
		//表单提交事件
		formSubmitEvent: function() {
			var self = this;
			var did = self.getLetterCompanyID();
			var param = {
				id: did,
				status: self.$deviceStatus.val()
			};
			fnAjax.method_5(url_join1("Tag/setStatus"), param, "post", function(msg) {
				if(msg.code == 0) {
					layer.msg("修改成功", function() {
						//do something
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭   
						return false;
					});
				} else {
					layer.msg(msg.message)
				};
			});
		}
	});
	win.editRF = editRF;
})(window, document, jQuery);
new editRF();