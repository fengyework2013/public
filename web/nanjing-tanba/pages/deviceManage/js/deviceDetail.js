(function(win, doc, $) {
	function deviceDetail(options) {
		this._init(options);
	}
	$.extend(deviceDetail.prototype, {
		_init: function(options) {
			var self = this;
			self.options = {
				deviceMac: "#deviceMac", //设备mac
				deviceName: "#deviceName", //设备名称
				disposeArea: "#disposeArea", //部署区域
				addressinfo: "#addressinfo", //详细地址
				serverip: "#serverip", //数据服务器IP
				cfgserverip: "#cfgserverip", //命令服务器IP
				model: "#model", //设备型号
				createtime: "#createtime", //创建时间
				longitud: "#longitude", //经度
				latitude: "#latitude", //纬度
				locationType: "#locationType", //位置类型
				antennaPower: "#antennaPower", //天线功率
				deviceStatus: "#deviceStatus", //运行状态
				onlineType: "#onlineType", //网络类型
				onlineStatus: "#onlineStatus", //联网状态
				sourceStatus: "#sourceStatus", //电源状态
				surplusSource: "#surplusSource", //剩余电量
				devicrTemp: "#devicrTemp", //设备温度
				fanStatus: "#fanStatus", //风扇状态
				restartBtn: "#restartBtn", //重启按钮
				resetBtn: "#resetBtn", //复位按钮
				setOutBtn: "#setOutBtn", //设置离线时间按钮
				adjustBtn: "#adjustBtn" //调整上报间隔按钮
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
			//设备mac对象
			self.$deviceMac = $(opts.deviceMac);
			//设备名称对象
			self.$deviceName = $(opts.deviceName);
			//部署区域
			self.$disposeArea = $(opts.disposeArea);
			//详细地址
			self.$addressinfo = $(opts.addressinfo);
			//数据服务器IP
			self.$serverip = $(opts.serverip);
			//命令服务器IP
			self.$cfgserverip = $(opts.cfgserverip);
			//设备型号
			self.$model = $(opts.model);
			//创建时间
			self.$createtime = $(opts.createtime);
			//经度
			self.$longitude = $(opts.longitud);
			//纬度
			self.$latitude = $(opts.latitude);
			//位置类型
			self.$locationType = $(opts.locationType);
			//天线功率
			self.$antennaPower = $(opts.antennaPower);
			//运行状态
			self.$deviceStatus = $(opts.deviceStatus);
			//网络类型
			self.$onlineType = $(opts.onlineType);
			//联网状态
			self.$onlineStatus = $(opts.onlineStatus);
			//电源状态
			self.$sourceStatus = $(opts.sourceStatus);
			//剩余电量
			self.$surplusSource = $(opts.surplusSource);
			//设备温度
			self.$devicrTemp = $(opts.devicrTemp);
			//风扇状态
			self.$fanStatus = $(opts.fanStatus);
			//重启按钮对象
			self.$restartBtn = $(opts.restartBtn);
			//复位按钮对象
			self.$resetBtn = $(opts.resetBtn);
			//离线时间按钮对象
			self.$setOutBtn = $(opts.setOutBtn);
			//上报间隔按钮对象
			self.$adjustBtn = $(opts.adjustBtn);
			/*初始化*/
			self._initDomBindEvent();
			/*初始化设备信息*/
			self.initDeviceInfo();
			/*初始化WS数据*/
			self.initDeviceStatus();
		},
		/**
		 * 初始化DOM绑定事件
		 * @return {[Object]} [this]
		 * */
		_initDomBindEvent: function() {
			var self = this;
			//重启设备
			self.$restartBtn.click(function(e) {
				e.preventDefault();
				layer.confirm('确定要重启吗？', {
					btn: ['是', '否'],
					yes: function(index) {
						self.restartEvent();
						layer.close(index);
					}
				});
			});
			//复位设备
			self.$resetBtn.click(function(e) {
				e.preventDefault();
				layer.confirm('确定要复位吗？', {
					btn: ['是', '否'],
					yes: function(index) {
						self.resetEvent();
						layer.close(index);
					}
				});
			});
			//设置离线时间
			self.$setOutBtn.click(function(e) {
				e.preventDefault();
				layer.open({
					type: 2,
					title: '设置下线时间',
					maxmin: true,
					area: ['70%', '280px'],
					content: "setoffline.html"
				});
			});
			//上报间隔 
			self.$adjustBtn.click(function(e) {
				e.preventDefault();
				layer.open({
					type: 2,
					title: '设置下线时间',
					maxmin: true,
					area: ['70%', '380px'],
					content: "setInterval.html"
				});
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
		//初始化设备信息
		initDeviceInfo: function() {
			var self = this;
			var did = self.getLetterCompanyID("did");
			var param = {
				id: did
			};
			fnAjax.method_5(url_join1("Device/getInfo"), param, "post", function(msg) {
				if(msg.code == 0) {
					var data = msg.data;
					//设备mac
					self.$deviceMac.html(data.mac || "未知");
					//设备名称
					self.$deviceName.html(data.nickname || "未知");
					//部署区域
					self.$disposeArea.html(data.areas || "未知");
					//详细地址
					self.$addressinfo.html(data.addressinfo || "未知");
					//数据服务器IP
					self.$serverip.html(data.serverip || "未知");
					//命令服务器IP
					self.$cfgserverip.html(data.cfgserverip || "未知");
					//设备型号
					self.$model.html(data.model || "未知");
					//经度
					self.$longitude.html(data.longitude || "未知");
					//纬度
					self.$latitude.html(data.latitude || "未知");
					//位置类型
					var locationType = "";
					switch(data.locationType) {
						case 0:
							locationType = "不设定"
							break;
						case 1:
							locationType = "出口"
							break;
						case 2:
							locationType = "入口"
							break;
						default:
							status = "未知"
					};
					self.$locationType.html(locationType || "未知");
					//天线功率
					var antennaPower = "";
					switch(data.antennaPower) {
						case 0:
							antennaPower = "2db"
							break;
						case 1:
							antennaPower = "3db"
							break;
						case 2:
							antennaPower = "6db"
							break;
						case 3:
							antennaPower = "9db"
							break;
						case 4:
							antennaPower = "10db"
							break;
						default:
							status = "未知"
					};
					self.$antennaPower.html(antennaPower || "未知");
					//创建时间
					self.$createtime.html(data.createtime || "未知");
					//运行状态
					var status = "";
					switch(data.status) {
						case 0:
							status = "停止"
							break;
						case 1:
							status = "正常"
							break;
						case 2:
							status = "维修"
							break;
						case 3:
							status = "报废"
							break;
						default:
							status = "未知"
					};
					self.$deviceStatus.html(status);
				} else {
					layer.alert(msg.message);
				};
			});
		},
		//初始化设备状态
		initDeviceStatus: function() {
			var self = this;
			var mac = self.getLetterCompanyID("mac");
			var param = {
				type: "online",
				deviceID: mac
			};
			self.webSocketEvent(self.$dUrl, param, function(res) {
				var obj = JSON.parse(res);
				var data = obj.data;
				for(var i = 0; i < data.length; i++) {
					if(data[i].status == 1) {
						self.$onlineStatus.html("在线");
					} else {
						self.$onlineStatus.html("离线");
					}
				};
			});
			var param2 = {
				type: "command",
				command: "getstatus",
				deviceid: mac
			};
			self.cws = self.webSocketEvent(self.$cUrl, param2, function(res) {
				var obj = JSON.parse(res);
				if(obj.type == "getstatus") {
					var data = obj.data;
					//网络类型
					self.$onlineType.html(data.net);
					//电源状态
					self.$sourceStatus.html(data.battery[0]);
					//剩余电量
					self.$surplusSource.html(data.battery[1]);
					//设备温度
					self.$devicrTemp.html(data.temp + "°");
					//风扇状态
					self.$fanStatus.html(data.fan);
				};
			});
		},
		//事件处理
		eventProcessing: function(param) {
			var self = this;
			var keyword = param.command;
			self.cws.send(JSON.stringify(param));
			self.cws.onmessage = function(res) {
				var obj = JSON.parse(res.data);
				if(obj.type == keyword) {
					if(obj.status == 1) {
						layer.alert(obj.message);
					} else {
						layer.alert(obj.message);
						return false;
					}
				}
			};
		},
		//重启事件
		restartEvent: function() {
			var self = this;
			var mac = self.getLetterCompanyID("mac");
			var param = {
				type: 'command',
				command: 'restart',
				deviceid: mac,
				data: {
					status: 1
				}
			};
			self.eventProcessing(param);
		},
		//复位按钮对象
		resetEvent: function() {
			var self = this;
			var mac = self.getLetterCompanyID("mac");
			var param = {
				type: 'command',
				command: 'reset',
				deviceid: mac,
				data: {
					status: 2
				}
			};
			self.eventProcessing(param);
		}
	});
	win.deviceDetail = deviceDetail;
})(window, document, jQuery);
new deviceDetail();