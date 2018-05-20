$(document).ready(function() {
	var myChartFun = new myChartObj();
	/*初始化*/
	myChartFun.init();
	/*异步请求*/
	myChartFun.doAjax();
})

var myChartObj = function() {
	this._url;
	/*设备名/占用率*/
	this.device;
	/*传入数据*/
	this._data;
}
myChartObj.prototype.init = function() {
	this._url = "http://test.duzuncloud.com:90/index.php";
	this.device = [];
}
myChartObj.prototype.doAjax = function() {
	var _this = this;
	/*接口参数*/
	_this._data = {
		do: 'devicebrand'
	}
	$.ajax({
		type: "get",
		url: _this._url,
		async: true,
		data: _this._data,
		dataType: "json",
		timeout: 30000,
		beforeSend: function() {
			$("#echarts_box").html("正在获取数据...");
		},
		success: function(res) {
			for(var key in res) {
				_this.device.push({
					name: key,
					value: res[key]
				});
			}
			/*绘制EChart*/
			_this.doEChart();
			/*处理分布排名*/
			_this.DisRanking()
		},
		error: function(){
			$("#echarts_box").html("连接服务器失败!");
		}
	});
}
myChartObj.prototype.doEChart = function() {
	// 基于准备好的dom，初始化echarts实例
	if(this.mychart) {
		this.mychart.clear();
		this.mychart.dispose();
	}
	this.mychart = echarts.init(document.getElementById('echarts_box'));
	// 指定图表的配置项和数据
	var option = {
		title: {
			text: '品牌分布',
			top: 'center',
			left: 'center',
			textStyle: {
				color: '#333'
			}
		},
		label: {
			normal: {
				show: true
			}
		},
		toolbox: {
			right: 20,
			bottom: 20,
			feature: {
				saveAsImage: {
					show: true
				}
			},
		},
		tooltip: {
			formatter: '{a} <br/>{b} : {d}%'
		},
		series: [{
			name: '分布比率',
			type: 'pie',
			radius: ['40%', '85%'],
			center: ['50%', '50%'],
			data: this.device,
			roseType: 'radius',
			animationType: 'scale',
			animationEasing: 'elasticOut',
			animationDelay: function(idx) {
				return Math.random() * 200;
			}
		}]
	};
	// 使用刚指定的配置项和数据显示图表。
	this.mychart.setOption(option);
}
myChartObj.prototype.DisRanking = function() {
	/*排序处理*/
	this.device.sort(function(a, b) {
		return b.value - a.value;
	});
	/*渲染HTML*/
	var domArrs = $(".table_Box_echarts_content_text");
	var str = '';
	for(var i = 0; i < this.device.length; i++) {
		str += '<div class="table_Box_echarts_content_text col-xs-12 col-sm-4">' +
			'<div class="title">' + this.device[i].value + '%</div>' +
			'<p>' + this.device[i].name + '</p>' +
			'<div class="smallTitle">Top ' + (i + 1) + ' :</div>' +
			'</div>';
	}
	/*清空之前重新渲染*/
	$(".table_Box_echarts_content_text_box").remove();
	$(".table_Box_echarts_content_float").after(str);
}