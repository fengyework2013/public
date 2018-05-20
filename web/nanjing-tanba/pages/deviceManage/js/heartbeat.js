(function(win, doc, $) {
	function heartbeat(options) {
		this._init(options);
	}
	$.extend(heartbeat.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				setTimeInput: "#setTime-input", //设置时间输入框
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
			//设置时间输入框对象
			self.$setTimeInput = $(opts.setTimeInput);
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
		//获取设备id
		getLetterCompanyID: function(keyStr) {
			var did = sessionStorage.getItem(keyStr);
			if(did) {
				return did;
			} else {
				layer.open({
					content: '获取设备信息失败！',
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
		//提交按钮事件
		submitEvent: function() {
			var self = this;
			//获取选择的服务器
			var check1 = $("#setSever1").is(':checked');
			var check2 = $("#setSever2").is(':checked');
			if(check1 == false && check2 == false) {
				layer.alert("请选择服务器！");
				return false;
			};
			//获取设置时间
			var getTime = self.$setTimeInput.val();
			var obj = {
				data: 5,
				cfg: 5
			};
			var reg = /\[1-300]+/g;
			var result = reg.test(getTime);
			if(result == false) {
				layer.alert("请输入正确的时间，范围1-300分钟！");
				return false;
			};
			if(check1 == true) {
				obj.data = parseInt(getTime)
			};
			if(check2 == true) {
				obj.cfg = parseInt(getTime)
			};
			//获取设备ID
			var did = self.getLetterCompanyID("mac");
			var param = {
				type: 'command',
				command: 'heartbeat',
				deviceid: did,
				data: obj
			};
			//再次确认
			layer.confirm('确定要进行设置吗？', {
				btn: ['确定', '取消'] //按钮
			}, function() {
				self.webSocketEvent(self.$cUrl, param, function(res) {
					var obj = JSON.parse(res);
					if(obj.type == "heartbeat") {
						if(obj.status == 1) {
							layer.alert(obj.message);
						} else {
							layer.alert(obj.message);
							return false;
						}
					}
				});
			});
		}
	});
	win.heartbeat = heartbeat;
})(window, document, jQuery);
new heartbeat();