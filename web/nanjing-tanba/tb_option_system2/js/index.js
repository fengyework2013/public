var cityList = new BMapLib.CityList({
	container: 'cityContainer',
	map: map
});
var sHtml = null;
//已经部署的探霸数据数组
var aTbInfo = [];
var curMkr = null; // 记录当前添加的Mkr
var geoc = new BMap.Geocoder();//实例化查询定位对象
var infoWin,mkrTool;
var labelStyle = {
		border: "solid 1px gray",
		padding:'2px 5px',
		borderRadius:'3px',
		minWidth:'50px',
		overflow:'hidden',
		whiteSpace:'nowrap',
		textOverflow:'ellipsis'
};
var isAddState = true;//判断是否添加或者编辑的状态
var editId = '';
var cStyle = {
	fillColor:"blue",
	strokeWeight: 1 ,
	fillOpacity: 0.3, 
	strokeOpacity: 0.3
}
//信息窗口模板
  		sHtml = '<div class="container-fluid"><form class="form-horizontal"><div class="form-group"><label for="tanbaID" class="col-sm-3 control-label">设备id：</label><div class="col-sm-9"><input type="text" class="form-control" id="tanbaID" placeholder="MAC" datatype="s15-18" errormsg="请输入正确的探霸id！"></div></div><div class="form-group"><label for="tanbaName" class="col-sm-3 control-label">设备名称：（可选）</label><div class="col-sm-9"><input type="text" class="form-control" id="tanbaName" placeholder="Name"></div></div><div class="form-group mobile-hide"><label for="deviceStatus" class="col-sm-3 control-label">设备状态：</label><div class="col-sm-9"><select class="form-control" id="deviceStatus"><option value="0">正常</option><option value="1">在线</option><option value="2">离线</option><option value="3">故障</option><option value="4">维修中</option><option value="5">报废</option></select></div></div><div class="form-group mobile-hide"><label for="deviceType" class="col-sm-3 control-label">设备类型：</label><div class="col-sm-9"><select class="form-control" id="deviceType"><option value="0">基站</option><option value="1">移动</option></select></div></div><div class="form-group mobile-hide"><label for="locationType" class="col-sm-3 control-label">位置类型：</label><div class="col-sm-9"><select class="form-control" id="locationType"><option value="0">不设定</option><option value="1">出口</option><option value="2">入口</option></select></div></div><div class="form-group"><label for="radius" class="col-sm-3 control-label">天线功率：</label><div class="col-sm-9"><select class="form-control" id="radius"><option value="-2" data="0">0db(0m)</option><option value="-1" data="50">1db(50m)</option><option value="0" data="100" selected>2db(100m)</option><option value="1" data="150">3db(150m)</option><option value="2" data="200">6db(200m)</option><option value="3" data="300">9db(300m)</option><option value="4" data="320">10db(320m)</option><option value="5" data="350">12db(350m)</option></select></div></div><div class="form-group"><label for="longitude" class="col-sm-3 control-label">经度：</label><div class="col-sm-9"><input type="number" class="form-control" id="lng" placeholder="经度" readonly></div></div><div class="form-group"><label for="latitude" class="col-sm-3 control-label">纬度：</label><div class="col-sm-9"><input type="number" class="form-control" id="lat" placeholder="纬度" readonly></div></div><div class="form-group"><label for="tanbaAddr" class="col-sm-3 control-label">详细地址：</label><div class="col-sm-9"><input type="text" class="form-control" id="tanbaAddr" placeholder="地址" datatype="s" readonly></div></div><div class="form-group mobile-hide"><label for="tanbaIcon" class="col-sm-3 control-label">图标url：</label><div class="col-sm-9"><input type="text" class="form-control" id="tanbaIcon" placeholder="图标" datatype="s" readonly></div></div><div class="form-group"><label for="desc" class="col-sm-3 control-label">备注：</label><div class="col-sm-9"><input type="text" class="form-control" id="desc" placeholder="备注" datatype="s"></div></div><div class="form-group mobile-hide"><label for="" class="col-sm-3 control-label">安装区域：</label><div class="col-sm-9"><div class="ztreeBox"><div class="content_wrap"><div class="zTreeDemoBackground left"><ul id="treeDemo" class="ztree"></ul></div></div><div class=""><div><h5>已选择地区(单选)</h5></div><div class="showArea row border-2-gray radius"><div class="hasSelect btn-group" data-id="1" data-pid="null"><button type="button" class="btn btn-sm btn-primary selectContent">深圳市</button><a href="#" class="closeBtn btn btn-sm btn-danger">X</a></div></div></div></div></div></div><div class="text-center"><button type="button" id="submitBtn" class="btn btn-primary mr-20" onclick="fnOK()">确定</button> <button type="reset" id="cancelBtn" class="btn btn-default">重置</button></div></form></div>';

//初始化已部署探霸列表，获取第一页数据
$('.table-container').paging({
	url:url_join2('Device/queryDevice'),
	data: {
		page:1,
	},
	type: "post",
	callBack: function(data) {
		
		//删除之前的覆盖物
		delOverlays();
		//分页递增在地图上
		aTbInfo = data.data;
		initData();
	}
});

//查询指定状态的探霸所在位置
$('.searchStatusBtn').click(function(){
	//删除之前的覆盖物	
	delOverlays();
	$('#pageContainer').remove();
	$('.table-container').paging({
		url:url_join2('Device/queryDevice'),
		data: {
			page:1,
			type:0,
			status:$('#searchStatus').val(),
			keyword:$('#searchCont').val()
		},
		type: "post",
		callBack: function(data) {
			//分页递增在地图上
			aTbInfo = data.data;
			initData();
		}
	});
});

/*
 打开覆盖物窗口，回显信息函数
 param:{object}
 object.ele,//obj覆盖物对象
 obj.openWinInfoState,//bool是否打开窗口
 obj.info//bool是否回显信息
 * */
function getInfoToDo(obj){
	this.ele = obj.ele;
	this.openWinInfoState = obj.openWinInfoState;
	this.info = obj.backInfo;
}
getInfoToDo.prototype.init = function(){
	//监听开始拖拽的事件
	var _this = this;
	var oPoint = null;
	var _self = this.ele;
	//打开窗口
	function openWin(){
		if(_this.openWinInfoState){
			_self.openInfoWindow(infoWin);
			$(".BMap_bubble_content").parent().addClass('scroll');
		}
	}
	
	//回显数据
	function backMainInfo(){
		if(_this.info){
			if(_self.code){
				$('#tanbaIcon').val(getTbIcon(_self.code.status));
				$('#tanbaID').val(_self.code.deviceId);
				$('#deviceStatus').val(_self.code.status);
				$('#radius').val(_self.code.antennaPower);
				//判断打开信息窗口之后的操作状态
				isAddState = false;
				editId = _self.code.id;
			}
			else{
				$('#tanbaIcon').val(_self.z.kj.imageUrl);
				$('#deviceStatus').val(backTbState($('#tanbaIcon').val()));
				isAddState = true;
			}
			backAddr(_self.getPosition(),$('#tanbaAddr'));
			$('#lng').val(_self.getPosition().lng);
			$('#lat').val(_self.getPosition().lat);
			
			//监听天线功率值变化事件，更新其覆盖范围
			editTbdb(_self);
			//监听探霸设备状态值变化事件，更新其覆盖物icon图标
			editIcon(_self);
		}
	}
	
	$.isMoblie(
		function(){},//mobile
		function(){
			_self.enableDragging(); //设置可拖拽
			_self.addEventListener('dragstart',function(){
				oPoint = _self.point;
				openWin();						
				backMainInfo();
				
			});
			_self.addEventListener('dragend',function(){
				backMainInfo();
				//圆对象随之移动
				var oCircle = oBackCircle(oPoint);
				oCircle.setCenter(this.getPosition());
			});
			
		}
	);
	_self.addEventListener('click',function(){
		openWin();						
		backMainInfo();
	});				
	backMainInfo();
}

//实例化标注,初始化标注数据
function initData(){
	
	//sHtml form formTpl.js,创建信息窗口
	infoWin = new BMap.InfoWindow(sHtml, {
		offset: new BMap.Size(0, -10),
		width:500,
		height:500
	});
	
	//监听关闭信息窗口
	infoWin.addEventListener('open',function(evt){
		onloadZtree();
	});
	
	//回显已经部署的探霸
	if(aTbInfo.length > 0){
		console.log(aTbInfo);
		//重新设置中心点
		map.centerAndZoom(new BMap.Point(aTbInfo[0].longitude*1, aTbInfo[0].latitude*1), 17);
		//添加标注
		for(var ke in aTbInfo){
			var backP = new BMap.Point(aTbInfo[ke].longitude*1, aTbInfo[ke].latitude*1);
			var backIcon = new BMap.Icon(getTbIcon(aTbInfo[ke].status), new BMap.Size(36, 36));
			var backMkr = new BMap.Marker(backP, {
				icon: backIcon
			}); 
			
			backMkr.code = aTbInfo[ke];//绑定属性数据
			map.addOverlay(backMkr); // 将标注添加到地图中
			
			//设置label和
			if(backMkr) {
				var lbl = new BMap.Label(aTbInfo[ke].deviceId, {
					offset: new BMap.Size(15, -15)
				});
				lbl.setStyle(labelStyle);
				backMkr.setLabel(lbl);
			}
			
				//设置范围圆圈
			var circle = new BMap.Circle(backP,getAntennaPowerR(aTbInfo[ke].antennaPower),cStyle);		
			map.addOverlay(circle);
		
			
			
			//实例化构造函数
			var getInfo = new getInfoToDo({
				ele:backMkr,
				openWinInfoState:true,
				backInfo:true
			});
//			初始化探霸设备相关信息
			getInfo.init();
		}
		
	}
	
	//自定义标注类对象
	mkrTool = new BMapLib.MarkerTool(map, {
		autoClose: true
	});
	//监听覆盖物添加到地图事件
	mkrTool.addEventListener("markend", function(evt) {
		$('.noticeTxt').addClass('hide');
		console.log(evt.target._opts.icon);
		var mkr = evt.marker;
		//画圆
		var nLng = mkr.getPosition().lng,
			nLat = mkr.getPosition().lat;
		var cp = new BMap.Point(nLng, nLat);
		var circle = new BMap.Circle(cp,100,cStyle);
		map.addOverlay(circle);
		
		curMkr = mkr;
		mkr.enableDragging(); //设置可拖拽
		mkr.openInfoWindow(infoWin);
		$(".BMap_bubble_content").parent().addClass('scroll');
		//实例化构造函数
		var getInfo = new getInfoToDo({
			ele:mkr,
			openWinInfoState:true,
			backInfo:true
		});
//			初始化探霸设备相关信息
		getInfo.init();
		
	});
	
}

//提交数据
function fnOK() {
	//提交后台数据
	var tanbaName = $('#tanbaName').val();//探霸名称
	var tanbaID = $('#tanbaID').val();//id
	var tanbaAddr = $('#tanbaAddr').val();//详细地址
	var lng = $('#lng').val();//经度
	var lat = $('#lat').val();//维度
	var desc = $('#desc').val();//备注
	var tbDB = $('#radius').val();//天线功率
	var tanbaIcon = $('#tanbaIcon').val();//tbIcon
	var deviceStatus = $('#deviceStatus').val();//设备状态
	var deviceType = $('#deviceType').val();//设备类型
	var locationType = $('#locationType').val();//位置类型	
	var hasSelect = $('.hasSelect').attr('data-id');//安装区域id
	
	var hasSelectTxt = $('.hasSelect .selectContent').text();//安装区域字段	
	var radius = $('#radius').find('option:selected').attr('data');//覆盖范围半径（米）
	var deviceStatusTxt = $('#deviceStatus').find('option:selected').text();//设备状态字段
	var deviceTypeTxt = $('#deviceType').find('option:selected').text();//设备类型字段
	var locationTypeTxt = $('#locationType').find('option:selected').text();//位置类型字段
	var jwd = lng + ',' + lat;//经纬度
	
	if(curMkr) {
		//设置label
		var lbl = new BMap.Label(tanbaID, {
			offset: new BMap.Size(15, -15)
		});
		lbl.setStyle(labelStyle);
		curMkr.setLabel(lbl);

	}
	if(infoWin.isOpen()) {
		map.closeInfoWindow();
	}
	

	//提交后台
	if(isAddState){
		//添加
		fnAjax.method_4(
			url_join2('Device/addDevice'),
			{
				mac:tanbaID,
				nickname:tanbaName,
				status:deviceStatus,
				ismove:deviceType,
				longitude:lng,
				latitude:lat,
				locationType:locationType,
				antennaPower:tbDB,
				areaid:hasSelect,
				addressinfo:tanbaAddr,
				tanbaIcon:tanbaIcon,
				desc:desc
			},
			"post",
			function(data){
				layer.msg(data.message,{time:1500},function(){
					window.location.reload();
				});
			}
		);
	}else{
		fnAjax.method_4(
			url_join2('Device/editDevice'),
			{
				id:editId,
				mac:tanbaID,
				nickname:tanbaName,
				status:deviceStatus,
				ismove:deviceType,
				longitude:lng,
				latitude:lat,
				locationType:locationType,
				antennaPower:tbDB,
				areaid:hasSelect,
				addressinfo:tanbaAddr,
				tanbaIcon:tanbaIcon,
				desc:desc
			},
			"post",
			function(data){
				layer.msg(data.message,{time:1500},function(){
					window.location.reload();
				});
			}
		);
	}
	
}



//选择覆盖物样式
function selectStyle(index) {
	mkrTool.open(); //打开工具 
	console.log(BMapLib);
	var icon = BMapLib.MarkerTool.SYS_ICONS[index]; //设置工具样式，使用系统提供的样式BMapLib.MarkerTool.SYS_ICONS[0] -- BMapLib.MarkerTool.SYS_ICONS[23]
	console.log(icon);
	mkrTool.setIcon(icon);
	$('.noticeTxt').removeClass('hide');
	$('#divStyle').hide();
}


//定位回显地址到表单
function backAddr(pt,ele){
	geoc.getLocation(pt, function(rs) {
		addComp = rs.addressComponents;
		dizhi = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
		ele.val(dizhi);
	});
}


/*
 返回最小绝对值
 输入aN，数组对象，o，对象
 return arr
 * */
function backMin(aN,o){
	return	_.min(aN,function(v){
			return Math.abs(v.lat - o.lat) && Math.abs(v.lng - o.lng);
	});
}
/*
 返回匹配的圆对象
 输入:匹配的接近经纬度对象
 输出：obj，圆对象
 * */

function oBackCircle(oPoint){
	var getCircle;
	var aPoints = [];
	var aO = map.getOverlays();
	//重新设置圆的中心点,因为拖拽的时候触点有误差，故加入最小偏差算法
	$.each(aO, function(i,v) {
		if(v.__proto__.vQ == 'Circle'){
			aPoints.push(v.point);
		} 
	});
	
	$.each(aO, function(i,v) {
		if(_.isEqual(v.point,backMin(aPoints,oPoint))){
			getCircle = v;
		}
	});
	return getCircle;
	
}

//导入树状菜单
function onloadZtree(){
	$('#sc').remove();
	var sc = $('<script src="../js/ztree-area-search-one.js" type="text/javascript" id="sc"></script>');
	$('body').append(sc);
}

//返回探霸状态
function backTbState(str){
	switch(true) {
		case(str == 'img/tb_normal.png' || str == 'img/tb_normal2.png' || str == 'img/tb_normal3.png'):
			return '0'
			break;
		case(str == 'img/tb_online.gif' || str == 'img/tb_online2.gif' || str == 'img/tb_online3.gif'):
			return '1'
			break;
		case(str == 'img/tb_outline.png'):
			return '2'
			break;
		case(str == 'img/tb_fault.png'):
			return '3'
			break;
		case(str == 'img/tb_servicing.png'):
			return '4'
			break;
		case(str == 'img/tb_scrap.png'):
			return '5'
			break;
	}
}

//返回图标状态
function getTbIcon(n){
	switch (n){
		case 0:
			return 'img/tb_normal2.png';
			break;
		case 1:
			return 'img/tb_online2.gif';
			break;
		case 2:
			return 'img/tb_outline.png';
			break;
		case 3:
			return 'img/tb_fault.png';
			break;
		case 4:
			return 'img/tb_servicing.png';
			break;
		case 5:
			return 'img/tb_scrap.png';
			break;
	}
}
//根据探霸天线功率值返回覆盖半径范围
function getAntennaPowerR(n){
	switch (n){
		case 0:
			return 100;
			break;
		case 1:
			return 150;
			break;		
		case 2:
			return 200;
			break;
		case 3:
			return 300;
			break;
		case 4:
			return 320;
			break;
		case 5:
			return 350;
			break;
		case -1:
			return 50;
			break;
		case -2:
			return 0;
			break;
	}
}

//删除指定覆盖物，圆和点
function delOverlays(){
	var allOverlay = map.getOverlays();
	if(allOverlay.length > 0){
		$.each(allOverlay, function(i,v) {
			if(v instanceof BMap.Marker || v instanceof BMap.Circle){
				map.removeOverlay(v);
			}
		});
	}
	
}

//改变设备状态值的时候修改设备的图片
function editIcon(ele){
	$('#deviceStatus').on("change",function(){
		var Icon = new BMap.Icon(getTbIcon($(this).val()*1), new BMap.Size(36, 36));
		ele.setIcon(Icon);
	});
}

//监听天线功率值变化事件，更新其覆盖范围
function editTbdb(ele){
	$('#radius').on('change',function(){
		var nMeter = $(this).find('option:selected').attr('data');
		var oCircle = oBackCircle(ele.point);
		oCircle.setRadius(nMeter);
	});
}

			