$(document).ready(function() {
	var myChartFun = new myChartObj();
	/*初始化*/
	myChartFun.init();
	/*异步请求*/
	myChartFun.doAjax();

	/*日期插件*/
	$('#mydatepicker').flatpickr({
		enableSeconds: 'false',
		defaultDate: myChartFun.selectTime,
		onClose: function(dateObject, dateString) {
			/*重新初始化*/
			myChartFun.init();
			/*修改日期*/
			myChartFun.selectTime = dateString;
			/*重新异步请求*/
			myChartFun.doAjax();
		}
	});
})

var myChartObj = function() {
	this.mychart;
	this._url;
	/*新客户*/
	this.newCur;
	/*老客户*/
	this.oldCur;
	/*进店人数*/
	this.allCur;
	/*数据时间*/
	this.timeArr;
	/*查询日期*/
	this._fullYear;
	this._month;
	this._date;
	this.selectTime;
	/*传入数据*/
	this._data;
}
myChartObj.prototype.init = function() {
	this._url = "http://test.duzuncloud.com:90/index.php";
	this.newCur = [];
	this.oldCur = [];
	this.allCur = [];
	this.timeArr = [];
	/*初始化查询当天数据*/
	var curTime = new Date();
	/*年*/
	this._fullYear = curTime.getFullYear();
	/*月*/
	this._month = curTime.getMonth() + 1;
	this._month = this._month < 10 ? '0' + this._month : this._month;
	/*日*/
	this._date = curTime.getDate();
	this._date = this._date < 10 ? '0' + this._date : this._date;
	/*年-月-日*/
	this.selectTime = [this._fullYear, this._month, this._date].join("-");
}
myChartObj.prototype.doAjax = function() {
	var _this = this;
	/*接口参数*/
	_this._data = {
		do: 'customersummary',
		shopid: 3,
		date: _this.selectTime
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
			for(var i = 0; i < res.length; i++) {
				_this.timeArr.push(res[i].hour);
				/*新顾客数*/
				_this.newCur.push(res[i].new);
				/*老顾客数*/
				_this.oldCur.push(res[i].old);
				/*所有顾客数*/
				_this.allCur.push(res[i].pass);
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
	if(this.mychart) {
		this.mychart.clear();
		this.mychart.dispose();
	}
	this.mychart = echarts.init(document.getElementById('echarts_box'));
	// 指定图表的配置项和数据
	var option = {
		title: {
			text: '',
			left: '50%',
			textAlign: 'center',
			top: '0%',
			subtext: "店门口人流量监控"
		},
		grid: {
			bottom: 70
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['总人数', '新顾客', '老顾客']
		},
		xAxis: {
			name: '时间',
			data: this.timeArr
		},
		yAxis: {
			name: '人数'
		},
		toolbox: {
			bottom: 20,
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
			name: '总人数',
			type: 'bar',
			data: this.allCur,
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
		}, {
			name: '新顾客',
			type: 'line',
			data: this.newCur
		}, {
			name: '老顾客',
			type: 'line',
			data: this.oldCur
		}]
	};
	// 使用刚指定的配置项和数据显示图表。
	this.mychart.setOption(option);
}
myChartObj.prototype.dataAnalysis = function() {
	var max;
	var min;
	var mean;
	/*渲染Dom*/
	var domArr = $(".table_Box_echarts_content_text");
	/*计算新客户*/
	evaluation(this.newCur);
	domArr.eq(0).find(".title").html(min);
	domArr.eq(1).find(".title").html(mean);
	domArr.eq(2).find(".title").html(max);
	/*计算老客户*/
	evaluation(this.oldCur);
	domArr.eq(3).find(".title").html(min);
	domArr.eq(4).find(".title").html(mean);
	domArr.eq(5).find(".title").html(max);
	/*计算总客户*/
	evaluation(this.allCur);
	domArr.eq(6).find(".title").html(min);
	domArr.eq(7).find(".title").html(mean);
	domArr.eq(8).find(".title").html(max);

	function evaluation(Arrs) {
		/*获取最大值*/
		max = Math.max.apply(null, Arrs);
		/*获取最小值*/
		min = Math.min.apply(null, Arrs);
		/*获取平均值*/
		var sum = 0;
		for(var i = 0; i < Arrs.length; i++) {
			sum += parseInt(Arrs[i]);
		}
		mean = (sum / Arrs.length).toFixed(2);
	}
}