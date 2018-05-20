(function(win, doc, $) {
	function addRF(options) {
		this._init(options);
	}
	$.extend(addRF.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				deviceID: "#deviceID", //设备MAC
				bindPers: "#bindPers", //设备名称
				contactWay: "#contactWay", //设备状态
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
			//设备ID输入框对象
			self.$deviceID = $(opts.deviceID);
			//用户名称输入框对象
			self.$bindPers = $(opts.bindPers);
			//联系方式输入框对象
			self.$contactWay = $(opts.contactWay);
			//下拉框对象
			self.$deviceStatus = $(opts.deviceStatus);
			//提交按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$cancelBtn = $(opts.cancelBtn);
			/*初始化*/
			self._initDomBindEvent();
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
			var param = {
				deviceId: self.$deviceID.val(),
				name: self.$bindPers.val(),
				tel: self.$contactWay.val(),
				status : self.$deviceStatus.val()
			};
			fnAjax.method_5(url_join1("Tag/addTag"), param, "post",function(msg) {
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
	win.addRF = addRF;
})(window, document, jQuery);
new addRF();