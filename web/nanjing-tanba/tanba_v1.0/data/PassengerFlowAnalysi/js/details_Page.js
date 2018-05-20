$(document).ready(function() {
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('echarts_box'));
	var Comfort = echarts.init(document.getElementById('echarts_Comfort'));

	// 指定图表的配置项和数据
	var option = {
		title: {
			text: '客流量总览'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: ['今日', '昨日'],
			top: '8%'
		},
		toolbox: {
			show: true,
			feature: {
				dataView: {
					show: true,
					readOnly: false
				},
				magicType: {
					show: true,
					type: ['line', 'bar']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
		}],
		yAxis: [{
				type: 'value',
				axisLabel: {
					formatter: '{value} K'
				}
			}

		],
		series: [{
				name: '今日',
				type: 'bar',
				data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 70.7, 28.7, 70.7, 135.6, 162.2, 70.7, 175.6, 182.2, 48.7, 32.6, 20.0, 7.0, 23.2, 26.6, 6.4, 4.3],
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
			},
			{
				name: '昨日',
				type: 'bar',
				data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 142.2, 48.7, 28.7, 135.6, 162.2, 70.7, 70.7, 135.6, 162.2, 70.7, 32.6, 12.2, 48.7, 18.8, 20.0, 6.0, 2.3],
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
			}
		],
		dataZoom: {
			type: 'inside'
		}
	};

	var gauge_value = 60; //舒适度取值

	var option2 = {
		backgroundColor: '#fff',
		title: {
			show: true,
			x: "center",
			y: "55%",
			text: gauge_value, //舒适度取代码置于值于此处
			textStyle: {
				fontSize: 35,
				fontWeight: 'bolder',
				fontStyle: 'normal',
				color: "#666"
			}
		},
		tooltip: {
			show: true,
			formatter: "{a}{b}：{c}",
			backgroundColor: '#F7F9FB',
			borderColor: '#92DAFF',
			borderWidth: '1px',
			textStyle: {
				color: 'black'
			}
		},
		series: [{
			name: '旅游舒适度',
			type: 'gauge',
			splitNumber: 10, //刻度数量
			min: 0,
			max: 100,
			radius: '65%', //图表尺寸
			axisLine: {
				show: true,
				lineStyle: {
					width: 4,
					shadowBlur: 0,
					color: [
						[0.1, '#33CC00'],
						[0.2, '#66CC00'],
						[0.3, '#99CC00'],
						[0.35, '#bbCC00'],
						[0.4, '#CCCC00'],
						[0.45, '#FFCC00'],
						[0.5, '#FFBB00'],
						[0.55, '#FFAA00'],
						[0.6, '#FF9900'],
						[0.7, '#FF6600'],
						[0.8, '#FF3300'],
						[0.9, 'CC0000'],
						[1, '#990000']
					]
				}
			},
			axisTick: {
				show: true,
				lineStyle: {
					color: "#666",
					width: 1
				},
				length: -5,
				splitNumber: 2
			},
			splitLine: {
				show: true,
				length: -10,
				lineStyle: {
					color: '#666'
				}
			},
			axisLabel: {
				distance: -40,
				textStyle: {
					color: "#666",
					fontSize: "14",
				},
				formatter: function(e) {
					switch(e + "") {
						case "0":
							return "0";
						case "10":
							return "舒适";
						case "20":
							return "20";
						case "30":
							return "30";
						case "40":
							return "40";
						case "50":
							return "一般";
						case "60":
							return "60";
						case "70":
							return "70";
						case "80":
							return "80";
						case "90":
							return "爆满";
						default:
							return e;
					}
				}
			},
			pointer: {
				show: true,
			},
			detail: { //指针评价
				show: true,
				offsetCenter: [0, 170],
				textStyle: {
					fontSize: 16,
					color: "#000"
				},
				formatter: function(param) {
					var level = '';
					if(param < 20) {
						level = '人迹罕至'
					} else if(param < 40) {
						level = '熙熙攘攘'
					} else if(param < 60) {
						level = '热闹非凡'
					} else if(param < 80) {
						level = '人来人往'
					} else if(param <= 90) {
						level = '人山人海'
					} else {
						level = '水泄不通';
					}
					return level;
				},
			},
			title: {
				textStyle: {
					fontSize: 24,
					fontWeight: 'bolder',
					fontStyle: 'normal',
					color: "#666"
				},
				offsetCenter: [0, 140]
			},
			data: [{
				name: "舒适度",
				value: Math.floor(gauge_value)
			}]
		}]
	};

	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	Comfort.setOption(option2);
});