  	//通用正则
  	//不能输入特殊字符
	var noSpecialStr = /^[\u4E00-\u9FA5a-zA-Z0-9]{0,}$/;
	//只能输入汉字
	var isHanzi = /^[\u4e00-\u9fa5],{0,}$/;
	//用户密码，正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。 
	var userPwd = /^[a-zA-Z]\w{5,17}$/;
	
	// 电话号码
	var phoneNum = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
	//email
	
	//验证InternetURL
 	var InternetURL=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
	
   //验证身份证号（15位或18位数字）
   var idCard = /^\d{15}|\d{17}(\d|x)$/;
   
   //验证最多保留2位小数的百分数（如果没小数），可验证到十万位数，若是小数，则数字最大100，最多两位小数
   var percent = /^(100|[1-9]\d|\d)(.\d{1,2})?%$/;
   
   //验证数字
   var num0 = /^[0-9]*$/;
   
   //验证零和非零开头的数字
   var num1 = /^(0|[1-9][0-9]*)$/;
   
   //验证100以内的数字或者一位小数
   var num_100 = /^\d(\.\d)?$|^[1-9]\d(\.\d)?$/;
   //验证有两位小数的正实数
   var num2 = /^[0-9]+(.[0-9]{2})?$/;
   
   //验证非零的正整数
   var num3 = /^\+?[1-9][0-9]*$/;
   
   //验证n位的数字
   var num4 = /^\d{n}$/;
   
   //验证至少n位数字
   var num5 = /^\d{n,}$/;
   
   //验证m-n位的数字
   var num6 = /^\d{m,n}$/;
   
   //验证由26个英文字母组成的字符串
   var letter = /^[A-Za-z]+$/;
   
   //验证由26个大写英文字母组成的字符串
   var bigLetter = /^[A-Z]+$/;
   
   //验证由26个小写英文字母组成的字符串
   var smallLetter = /^[a-z]+$/;
   
   //验证组织架构代码9位（数字+大写字母）
   var OrganizationCode = /^[0-9A-Z]{n}$/;
  	
  	//手机mac（中间没有符号）
  	var mac1 = /^([0-9a-fA-F]{2})(([0-9a-fA-F]{2}){5})$/;
  	
  	//手机mac（中间有符号）
  	var mac2 = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
  	
  	//手机misi码
  	var misi = /^(01|03)(\d{2})(\w{1})(\w{1})(\d{3})(\d{6})(\w{1})$/;
  	
	//随机生成范围数字：min最小数字，max最大数字（打印数字为最小到最大的范围）
	function randNum(min,max){
	    var num = Math.floor(Math.random()*(max-min)+min);
	    return num;
	}
	
	//判断某字符串是否含有某个子字符串，如有，打印其第一次或者最后一次的索引
	function HasStr(stringText,littleStr,isFirstIndex){
		//stringText指的是整个字符串变量，littleStr指的是整个字符串变量中可能存在的字段,
		//isFirstIndex指的是子字符串存在于字符串大字段之中，并且返回其所在位置的索引。参数为布尔值，true指的是返回第一次出现的索引，false指的是最后一次
		var str = stringText;
		var str2 = littleStr;
		var d = str.length - str2.length;
		if(d >= 0 && str.lastIndexOf(str2) == d){
			if(isFirstIndex){//第一次出现的下标
				return str.indexOf(str2);
			}
			else{//最后一次出现的下标
				return str.lastIndexOf(str2);
			}
		}
		else{
			return false;
		}
	}
	
	//随机生成n个大写字母
	//参数：n指的是字母个数，值为数字；type指的是随机生成的字母类型，值为“str”，即是字符串拼接，值为“arr”，即是数组
    function getCapital(n,type){
    	var result = [];
        for(var i=0;i<n;i++){
           var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
            //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
            result.push(String.fromCharCode(65+ranNum));
        }
        if(type == "str"){
        	return result.join("");
        }
        else if(type == "arr"){
        	return result;
        }
        
    }
	
	//获取当前静态所有时间
	//输入参数oTime，两个值，“y-m-d”是年月日，“h-m-s”是时分秒，调用不加参数或者其他值的时候是年月日时分秒整个时间段
	function getOnTime(oTime){
		//获取当前具体时间
		var oDate = new Date();
		var nYear = oDate.getFullYear();
		var nMonth = oDate.getMonth()*1+1;
		var nDate = oDate.getDate();
		
		var nHours = oDate.getHours();
		var nMinutes = oDate.getMinutes();
		var nSeconds = oDate.getSeconds();
		if(nHours<10){
			nHours = "0"+nHours;
		}
		if(nMinutes<10){
			nMinutes = "0"+nMinutes;
		}
		if(nSeconds<10){
			nSeconds = "0"+nSeconds;
		}
		if(oTime == "y-m-d"){//返回大时间年月日
			return nYear+"-"+nMonth+"-"+nDate;
		}
		if(oTime == "h-m-s"){//返回小时间时分秒
			return nHours+":"+nMinutes+":"+nSeconds;
		}
		else{//不传参数，是整个时间			
			return nYear+"-"+nMonth+"-"+nDate+"\0"+nHours+":"+nMinutes+":"+nSeconds;
		}
		
	}
	
	
	//含有规律的字符串数据转化为数组；（以字符串中的某个字段截取生成数组）
/*
 参数：str指的是大字符串；chart指的是大字符串中的某个子字符串
 */
 function stringToArray(str,chart){
 	var arrPerssion = [];
 	if(str.indexOf(chart) >= 0){
 		var tempArray = str.split(chart);
	    var returnArr = new Array();
	    var i,len = tempArray.length;
	    for(i=0;i<len;i++){				            
	        returnArr.push(tempArray[i]);				           
	    }
	
	    return returnArr;
 	}else{
 		arrPerssion.push(str);
 		return arrPerssion;
 	}
}	


//验证表单禁用特殊字符串的表单验证
//obj指的是选择器的对象字符串
function stopSpecialStr(obj){
	var r = /^[\u4E00-\u9FA5a-zA-Z0-9]{0,}$/;
	$("body").delegate(obj,"blur",function(){
		if(r.test($(obj).val()) == false) {
			alert("不能输入特殊字符");
			$(obj).val("");
		}
	});
}

//返回某个页面
function url_back(mUrl){

//	return "http://10.10.10.20/"+mUrl;//Linux
	return "http://103.251.36.122/"+mUrl;
//	return "http://123.58.43.16/"+mUrl;//统一服务器
}

//当前页面和父页面跳转到其他页面
//Url指的是要跳转的路劲url
function toNewPage(Url){
	if(window.parent.parent.parent.parent){
		parent.parent.parent.parent.location.href = url_back(Url);
	}
	if(window.parent.parent.parent){
		parent.parent.parent.location.href = url_back(Url);
	}
	if(window.parent.parent){
		parent.parent.location.href = url_back(Url);
	}
	else if(window.parent){
		parent.location.href = url_back(Url);
	}
	else{
		window.location.href = url_back(Url);
	}
}
//定义加载层
var layerLoad;
//ajax
var fnAjax = {//
    //普通的ajax请求
    method_1:function(murl,mdata,method,success){
        $.ajax({
            type: method,
            url: murl,
            dataType : "json",
            data: mdata,
            async: true,
            timeout: 2000,
            error: function (data) {
                console.log(data);
                 layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {
                //console.log(data);
                success?success(data):function(){};
            }
        });
    },
    //跨域请求的ajax请求
    method_2:function(murl,mdata,method,success){
        $.ajax({
            type: method,
            url: murl,
            dataType : "jsonp",
            data: mdata,
            async: true,
            timeout: 2000,
            error: function (data) {
                console.log(data);
                layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {
                //console.log(data);
                success?success(data):function(){};
            }
        });
    },
    //跨域保存后台的sessionID的ajax请求
    method_3:function(murl,mdata,method,success){
        $.ajax({
            type: method,
            url: murl,
            dataType : "json",
            data: mdata,
            timeout: 10000,
            async: true,
            xhrFields: {withCredentials: true},
			crossDomain: true,
			beforeSend: function () {
	            layerLoad = layer.load(3);
	        },
            error: function (data) {
            	layer.close(layerLoad);
                console.log(data);
                 layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {
            	layer.close(layerLoad);
                 if(data.code == 3) {//登录超时状态提示字符串
 					layer.confirm(data.message+"。是否重新登录？",function(){
 						toNewPage("login.html");
 					});
 				}
 			    else if(data.code == 2){//账号在其他ip浏览器上被登录或者超时
 			    	layer.confirm(data.message+"。是否重新登录？",function(){
 			    		toNewPage("login.html");
 			    	});
 			    }
 			    else if(data.code == 1){
 			    	layer.confirm(data.message+"。是否重新登录？",function(){
 			    		toNewPage("login.html");
 			    	});
 			    }
 			    else if(data.code == 0){
 			    	successFn(data);
 			    }
 			     else{
 			    	layer.alert(data.message);
 			    }
            }
        });
    },
     //普通的ajax请求,添加超时，掉线的提示
    method_4:function(murl,mdata,method,successFn){
        $.ajax({
            type: method,
            url: murl,
            dataType : "json",
            data: mdata,
            async: true,
            timeout: 10000,
            xhrFields: {withCredentials: true},
			crossDomain: true,
			beforeSend: function () {
	            layerLoad = layer.load(3);
	        },
            error: function (data) {
            	layer.close(layerLoad);
                console.log(data);
                 layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {
            	layer.close(layerLoad);
                if(data.code == 3) {//登录超时状态提示字符串
 					layer.confirm(data.message+"。是否重新登录？",function(){
 						toNewPage("login.html");
 					});
 				}
 			    else if(data.code == 2){//账号在其他ip浏览器上被登录或者超时
 			    	layer.confirm(data.message+"。是否重新登录？",function(){
 			    		toNewPage("login.html");
 			    	});
 			    }
 			    else if(data.code == 1){
 			    	layer.confirm(data.message+"。是否重新登录？",function(){
 			    		toNewPage("login.html");
 			    	});
 			    }
 			    else if(data.code == 0){
 			    	successFn(data);
 			    }
 			    else{
 			    	layer.alert(data.message);
 			    }
            }
        });
    },
     //跨域保存后台的sessionID的ajax请求，添加超时，掉线的提示
    method_5:function(murl,mdata,method,successFn){
        console.log("call");
        $.ajax({
            type: method,
            url: murl,
            dataType : "json",
            data: mdata,
            timeout: 10000,
            async: true,
            xhrFields: {withCredentials: true},
			crossDomain: true,
			beforeSend: function () {
	             layerLoad = layer.load(3);
	        },
            error: function (data) {
            	layer.close(layerLoad);
                console.log(data);
                layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {

                layer.close(layerLoad);
                if(data.code == 3) {//登录超时状态提示字符串
 					layer.confirm(data.message+"。是否重新登录？",function(){
 						toNewPage("login.html");
 					});
 				}
 			    else if(data.code == 2){//账号在其他ip浏览器上被登录或者超时
 			    	layer.confirm(data.message+"。是否重新登录？",function(){
 			    		toNewPage("login.html");
 			    	});
 			    }
 			    else if(data.code == 1){
 			    	layer.confirm(data.message+"。是否重新登录？",function(){
 			    		toNewPage("login.html");
 			    	});
 			    }
 			    else if(data.code == 0){
 			    	successFn(data);
 			    }
 			     else{
 			    	layer.alert(data.message);
 			    }
            }
        });
    },
    //跨域保存后台的sessionID的ajax请求（表单文件上传），添加超时，掉线的提示
     method_6:function(murl,mdata,method,successFn){
        $.ajax({
            type: method,
            url: murl,
          	datatype: "jsonp",
            data: mdata,
            timeout: 2000,
            xhrFields: {withCredentials: true},
			crossDomain: true,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
            error: function (data) {
                console.log(data);
                layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {
                if(data.state == "overtime") {//登录超时状态提示字符串
					toLoginPage();
				}
			    else if(data.state == "hasLogin"){//账号在其他ip浏览器上被登录的字符串提示
			    	layer.alert("注意：该用户在ip为 http://"+data.ip+" 的电脑上被登录了!",{icon:0});
			    }
			     else if(data.code == 0){
			    	successFn(data);
			    }
            }
        });
    },
    //请求的传输数据格式不限制
     method_7:function(murl,mdata,method,successFn){
        $.ajax({
            type: method,
            url: murl,
            data: mdata,
            timeout: 2000,
            async: true,
            xhrFields: {withCredentials: true},
			crossDomain: true,
            error: function (data) {
                console.log(data);
                layer.alert("请求失败，请检查服务器端！",{icon:5});
            },
            success: function (data) {
                if(data.state == "overtime") {//登录超时状态提示字符串
					toLoginPage();
				}
			    else if(data.state == "hasLogin"){//账号在其他ip浏览器上被登录的字符串提示
			    	layer.alert("注意：该用户在ip为 http://"+data.ip+" 的电脑上被登录了!",{icon:0});
			    }
			    else{
			    	successFn(data);
			    }
            }
        });
    }
};


/*关于移动端的判断 */
function isMoblie(fnMobile,fnPc){
	  var sUserAgent = navigator.userAgent.toLowerCase();
	  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	  var bIsAndroid = sUserAgent.match(/android/i) == "android";
	  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {//移动端
	  	fnMobile();
	  }else{
	  	fnPc();
	  }
}
//数组去重
Array.prototype.unique2 = function(){
 this.sort(); //先排序
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  if(this[i] !== res[res.length - 1]){
   res.push(this[i]);
  }
 }
 return res;
}
//调用：arr.unique2()

//url拼接(邱梦霞)
function url_join(mUrl){

//	return "http://10.10.10.20/"+mUrl;//Linux
//	return "http://103.251.36.122:9555/"+mUrl;
	return "http://123.58.43.16:9555/"+mUrl;//统一服务器
}

//url拼接（万宇军）
function url_join1(mUrl){
//	return "http://103.251.36.122:9555/"+mUrl;
//	return "http://10.10.10.21/"+mUrl;//Linux
	return "http://123.58.43.16:9555/"+mUrl;//统一服务器
}
///url拼接（金龙）
function url_join2(mUrl){
//	return "http://103.251.36.122:9555/"+mUrl;
//	return "http://10.10.10.22/"+mUrl;//Linux
	return "http://123.58.43.16:9555/"+mUrl;//统一服务器
}

//url拼接（宝哥）
function url_join3(mUrl){
//	return "http://103.251.36.122:9555/"+mUrl;
//	return "http://10.10.10.23/"+mUrl;//Linux
	return "http://123.58.43.16:9555/"+mUrl;//统一服务器
}
var searchFn = {//参数1请求路径；参数2，一页显示条数；参数3，回调的函数（创建表格）
	method:function(Url,dataN,fn){
		var oData2 = {
			"keyWord":$("#keyWord").val(),
			"datemin":$("#datemin").val(),
			"datemax":$("#datemax").val(),
			"itemNum":dataN
		};
		fnAjax.method_4(Url,oData2,"post",function(d){
			$(".dataNum").text(d.count);
			if(parseInt(d.count) == 0){
				$("table tbody").html("");
				$("#biuuu_city").html("当前搜索不到相关数据！");
			}else if(parseInt(d.count) > 0){
				fn(d);
				laypage({
					cont: 'biuuu_city',//控制分页容器，
					pages: d.pageSum,//总页数
					skip: true, //是否开启跳页
				    groups: 3, //连续显示分页数
				    first: '首页', //若不显示，设置false即可
				    last: '尾页', //若不显示，设置false即可
				    prev: '<', //若不显示，设置false即可
				    next: '>', //若不显示，设置false即可
				    hash: true, //开启hash
					jump: function(obj,first) {
						
						if (!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
							var	oData = {
								"pageNum":obj.curr,
								"keyWord":$("#keyWord").val(),
								"datemin":$("#datemin").val(),
								"datemax":$("#datemax").val(),
								"itemNum":dataN
							};
				            fnAjax.method_4(Url,oData,"post",function(data){
								fn(data);
								
						    });
				        }
					}
				});
				
			}
	    });
	}
};


//表格分页---初始化表格
//输入参数：参数1请求路径；参数2，显示的条数；参数3，表格选择器(table)，参数4，回调的函数（创建表格）
//向后台传递的参数：itemNum（条数），pageNum（页数）；
//后台返回参数：count，显示的数据总条数；pageSum，显示的总页数；data（数组）主要数据
var initTable = {
	method_1:function(Url,dataN,table,fn){
		fnAjax.method_4(Url,{"itemNum":dataN},"post",function(data){
			$(".pageNum").text(data.pageSum);//显示的总页数
			$(".dataNum").text(data.count);//显示的数据总条数
//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
			if(parseInt(data.count) == 0){
				$(table).children("tbody").html("");
				$("#pageTool").html("当前没有数据！");
				$(".pageNum").text(0);//显示的总页数
				$(".dataNum").text(0);//显示的数据总条数
			}
			else if(parseInt(data.count) > 0){
				fn(data);
				laypage({
					cont: "pageTool",//控制分页容器，
					pages: data.pageSum,//总页数
					skip: true, //是否开启跳页
				    groups: 3, //连续显示分页数
				    first: '首页', //若不显示，设置false即可
				    last: '尾页', //若不显示，设置false即可
				    prev: '<', //若不显示，设置false即可
				    next: '>', //若不显示，设置false即可
				    hash: true, //开启hash
					jump: function(obj,first) {
						
						if (!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
				            fnAjax.method_4(Url,{"pageNum":obj.curr,"itemNum":dataN},"post",function(d){
								fn(d);
						    });
				       }
						
					}
				});
				
				$("body").delegate(".laypage_btn","click",function(){
					fnAjax.method_4(Url,{"pageNum":$(".laypage_skip").val(),"itemNum":dataN},"post",function(data){
						fn(data);
				    });
				});
				
			}
			
	    });
	},
	method_2:function(Url,mainData,table,fn){
		fnAjax.method_4(Url,mainData,"post",function(data){
			$(".pageNum").text(data.pageSum);//显示的总页数
			$(".dataNum").text(data.count);//显示的数据总条数
//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
			if(parseInt(data.count) == 0){
				$(table).children("tbody").html("");
				$("#pageTool").html("当前没有数据！");
				$(".pageNum").text(0);//显示的总页数
				$(".dataNum").text(0);//显示的数据总条数
			}
			else if(parseInt(data.count) > 0){
				fn(data);
				laypage({
					cont: "pageTool",//控制分页容器，
					pages: data.pageSum,//总页数
					skip: true, //是否开启跳页
				    groups: 3, //连续显示分页数
				    first: '首页', //若不显示，设置false即可
				    last: '尾页', //若不显示，设置false即可
				    prev: '<', //若不显示，设置false即可
				    next: '>', //若不显示，设置false即可
				    hash: true, //开启hash
					jump: function(obj,first) {
						fn(data);
					}
				});
				
				
			}
			
	    });
	},
	method_3:function(Url,mainData,table,fn){
		fnAjax.method_4(Url,mainData,"get",function(data){
			$(".pageNum").text(data.pageSum);//显示的总页数
			$(".dataNum").text(data.count);//显示的数据总条数
//			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
			if(parseInt(data.count) == 0){
				$(table).children("tbody").html("");
				$("#pageTool").html("当前没有数据！");
				$(".pageNum").text(0);//显示的总页数
				$(".dataNum").text(0);//显示的数据总条数
			}
			else if(parseInt(data.count) > 0){
				fn(data);
				laypage({
					cont: "pageTool",//控制分页容器，
					pages: data.pageSum,//总页数
					skip: true, //是否开启跳页
				    groups: 3, //连续显示分页数
				    first: '首页', //若不显示，设置false即可
				    last: '尾页', //若不显示，设置false即可
				    prev: '<', //若不显示，设置false即可
				    next: '>', //若不显示，设置false即可
				    hash: true, //开启hash
					jump: function(obj,first) {
						fn(data);
					}
				});
				
				
			}
			
	    });
	}
};

//数据排序
function NumAscSort(a,b)
{
 return a - b;
}
function NumDescSort(a,b)
{
 return b - a;
}

//延迟加载器
var keyupTimer = null;
function debounce(fn,wait){//fn指的是函数，wait指的是时间数值（秒）
    //设定默认的延迟时间
    wait=wait||500;
    //清除定时器
    keyupTimer && clearTimeout(keyupTimer);
    //定时器执行
    keyupTimer = setTimeout(fn,wait);
}

//父页面和当前页面刷新加载
function pageReLoad(){
	if(window.parent.parent.parent.parent){
		parent.parent.parent.parent.location.reload();
	}
	if(window.parent.parent.parent){
		parent.parent.parent.location.reload();
	}
	if(window.parent.parent){
		parent.parent.location.reload();
	}
	else if(window.parent){
		parent.location.reload();
	}
	else{
		window.location.reload();
	}
}
// 判断pc浏览器是否缩放，若返回100则为默认无缩放，如果大于100则是放大，否则缩小
function detectZoom (){
  var ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase();
   
   if (window.devicePixelRatio !== undefined) {
      ratio = window.devicePixelRatio;
  }
  else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  }
  else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }
     
   if (ratio){
    ratio = Math.round(ratio * 100);
  }
     
   return ratio;
};

window.onload = function(){
	isMoblie(
		function(){
			return false;
		},
		function(){
			var ratio = detectZoom();
			if(ratio != 100){
				layer.msg("当前游览器缩放比率为："+ratio+"%");
			}
		}
	);
	
}