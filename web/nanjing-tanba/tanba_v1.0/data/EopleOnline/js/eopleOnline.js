$(document).ready(function() {
	var myChartFun = new myChartObj();
	/*初始化*/
	myChartFun.init();
	/*异步请求*/
	myChartFun.doAjax();
})

var myChartObj = function() {
	this._url;
	this.timeArr;
	this.dataArr;
	this.curTime;
	this._data;
}
myChartObj.prototype.init = function() {
	this._url = "http://test.duzuncloud.com:90/index.php";
	this.timeArr = [];
	this.dataArr = [];
	this.curTime = new Date().getHours();
	/*接口参数*/
	this._data = {
		do: 'online'
	}
}
myChartObj.prototype.doAjax = function() {
	var _this = this;
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
			for(var i = 0; i < res.length; i++) {
				/*截取字符串，获取时间*/
				var serverTime = res[i].datetime.slice(11, -3)
				if(parseInt(serverTime) <= parseInt(_this.curTime)) {
					_this.timeArr.push(serverTime);
					_this.dataArr.push(res[i].online);
				} else {
					break;
				}
			}
			/*绘制EChart*/
			_this.doEChart();
			/*数据分析*/
			_this.dataAnalysis();
		},
		error: function(){
			$("#echarts_box").html("连接服务器失败!");
		}
	});
}
myChartObj.prototype.doEChart = function() {
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('echarts_box'));
	// 指定图表的配置项和数据
	var option = {
		title: {
			text: '',
			left: '50%',
			textAlign: 'center',
			top: '0%',
			subtext: "范围内探测到的人数"
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['在线人数']
		},
		xAxis: {
			name: '时间',
			data: this.timeArr
		},
		yAxis: {
			name: '人数'
		},
		toolbox: {
			show: 'true',
			feature: {
				saveAsImage: {
					show: true
				},
				magicType: {
					type: ['line', 'bar']
				},
				dataView: {
					show: true
				},
				restore: {
					show: true
				}
			}
		},
		dataZoom: [{
			type: 'inside'
		}],
		series: [{
			name: '在线人数',
			type: 'line',
			data: this.dataArr,
			markPoint: {
				data: [{
						type: 'max',
						name: '最大值'
					},
					{
						type: 'min',
						name: '最小值'
					}
				]
			},
			markLine: {
				data: [{
					type: 'average',
					name: '平均值'
				}]
			}
		}]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}
myChartObj.prototype.dataAnalysis = function() {
	var numArr = [];
	for(var i = 0; i < this.dataArr.length; i++) {
		numArr.push(this.dataArr[i]);
	}
	/*获取最大值*/
	var max = Math.max.apply(null, numArr);
	/*获取最小值*/
	var min = Math.min.apply(null, numArr);
	/*获取平均值*/
	var sum = 0;
	for(var i = 0; i < numArr.length; i++) {
		sum += parseInt(numArr[i]);
	}
	var mean = (sum / numArr.length).toFixed(2);
	
	/*渲染*/
	var domArr = $(".table_Box_echarts_content_text");
	domArr.eq(0).find(".title").html(min);
	domArr.eq(1).find(".title").html(mean);
	domArr.eq(2).find(".title").html(max);
}