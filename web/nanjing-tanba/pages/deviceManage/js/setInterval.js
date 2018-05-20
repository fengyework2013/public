(function(win, doc, $) {
	function setoffline(options) {
		this._init(options);
	}
	$.extend(setoffline.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				apInput: "#setInterval-input1", //设置AP输入框
				staInput: "#setInterval-input2", //设置STA输入框
				rfInput: "#setInterval-input3", //设置RF输入框
				submitBtn: "#submitBtn", //确定按钮
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
			//webSocket地址
			self.$dUrl = "ws://123.58.43.17:9501";
			self.$cUrl = "ws://103.251.36.122:9511";
			//获取操作的设备ID
			self.$ID = self.getSessionDeviceId();
			//ap输入框对象
			self.$apInp = $(opts.apInput);
			//sta输入框对象
			self.$staInp = $(opts.staInput);
			//rf输入框对象
			self.$rfInp = $(opts.rfInput);
			//确定按钮对象
			self.$submitBtn = $(opts.submitBtn);
			//取消按钮对象
			self.$cancelBtn = $(opts.cancelBtn);
			/*初始化*/
			self._initDomBindEvent();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			//切换模式事件绑定
			$(".setMode").click(function() {
				self.changeModeEvent(this);
			});
			//点击"确定"按钮事件绑定
			self.$submitBtn.click(function(e) {
				e.preventDefault();
				self.submitEvent();
			});
			//点击"取消"按钮事件绑定
			self.$cancelBtn.click(function(e) {
				e.preventDefault();
				var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				parent.layer.close(index); //再执行关闭   
				return false;
			});
		},
		/**
		 * webSocket请求
		 * @param url 接口分支
		 * @param param 请求参数
		 */
		webSocketEvent: function(url, param, fn) {
			if("WebSocket" in window) {
				var ws = new WebSocket(url);
				ws.onopen = function() {
					// Web Socket 已连接上，使用 send() 方法发送数据
					ws.send(JSON.stringify(param));
				};
				ws.onmessage = function(res) {
					fn(res.data);
				};
				ws.onclose = function() {
					// 关闭 websocket
					ws.close();
					console.log("连接已关闭...");
				};
				//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
				window.onbeforeunload = function() {
					ws.close();
				};
				return ws;
			} else {
				console.log("游览器不支持WebSocket!")
			}
		},
		//获取本地缓存里的id
		getSessionDeviceId: function() {
			var deviceId = sessionStorage.getItem("mac");
			if(deviceId == null) {
				layer.open({
					type: 0,
					content: "需指定查询的设备",
					yes: function() {
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭   
						return false;
					},
					cancel: function() {
						var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
						parent.layer.close(index); //再执行关闭   
						return false;
					}
				})
			} else {
				return deviceId;
			}
		},
		//切换模式事件
		changeModeEvent: function(dom) {
			var self = this;
			var name = $(dom).attr("name");
			if(name == "setMode-ap") {
				if($(dom).val() == "0") {
					self.$apInp.attr("disabled", false);
				} else {
					self.$apInp.attr("disabled", true).val("");
				}
			};
			if(name == "setMode-sta") {
				if($(dom).val() == "0") {
					self.$staInp.attr("disabled", false);
				} else {
					self.$staInp.attr("disabled", true).val("");
				}
			};
			if(name == "setMode-rf") {
				if($(dom).val() == "0") {
					self.$rfInp.attr("disabled", false);
				} else {
					self.$rfInp.attr("disabled", true).val("");
				}
			};
		},
		//确定提交事件
		submitEvent: function() {
			var self = this;
			//获取选择的模式
			var setmode1 = $("[name=setMode-ap]:checked").val();
			var setmode2 = $("[name=setMode-sta]:checked").val();
			var setmode3 = $("[name=setMode-rf]:checked").val();
			var apVal = 5;
			var staVal = 2;
			var rfVal = 2;
			//正则验证
			var reg = /\d+/;
			//获取ap数值
			if(setmode1 == "0") {
				apVal = self.$apInp.val();
				if(apVal != "") {
					if(reg.test(apVal) == false) {
						layer.alert("【AP】时间不正确");
						return false;
					}
				} else {
					apVal = 5;
				}
			} else if(setmode1 == "1") {
				apVal = 65535;
			} else if(setmode1 == "2") {
				apVal = 0;
			};
			//获取sta数值
			if(setmode2 == "0") {
				staVal = self.$staInp.val();
				if(staVal != "") {
					if(reg.test(staVal) == false) {
						layer.alert("【STA】时间不正确");
						return false;
					}
				} else {
					staVal = 2;
				}
			} else if(setmode2 == "1") {
				staVal = 65535;
			} else if(setmode2 == "2") {
				staVal = 0;
			};
			//获取rf数值
			if(setmode3 == "0") {
				rfVal = self.$rfInp.val();
				if(rfVal != "") {
					if(reg.test(rfVal) == false) {
						layer.alert("【RF】时间不正确");
						return false;
					}
				} else {
					rfVal = 2;
				}
			} else if(setmode3 == "1") {
				rfVal = 65535;
			} else if(setmode3 == "2") {
				rfVal = 0;
			};
			var obj = {
				ap: apVal,
				sta: staVal,
				rf: rfVal
			}
			//传入参数
			var param = {
				type: 'command',
				command: 'setupspace',
				deviceid: self.$ID,
				data: obj
			};
			self.webSocketEvent(self.$cUrl, param, function(res) {
				var obj = JSON.parse(res);
				if(obj.type == "setupspace") {
					if(obj.status == 1) {
						layer.alert(obj.message);
					} else {
						layer.alert(obj.message);
						return false;
					}
				}
			});
		}
	});
	win.setoffline = setoffline;
})(window, document, jQuery);
new setoffline();