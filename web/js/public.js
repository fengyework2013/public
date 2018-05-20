var PublicMethods = (function () {
    var instantiated;
    function init() {
        /*这里定义单例代码*/
        return {
            random: function (lower, upper) {
                var sum = upper - lower + 1;  //最大-最小+1 = 范围基数
                return Math.floor(Math.random() * sum + lower); //随机数 * 范围基数 + 最小
            },
            extend: function (father, boy) {
                var tem = new Function(); // 创建临时函数,接收父类原型
                tem.prototype = father.prototype; // 给的是原型,构造函数没给
                boy.prototype = new tem(); //继承了父类的原型
                boy.prototype.constructor = boy; //还原构造器 (这中方式不会被枚举)
                boy.superClass = father.prototype; // 解耦:定义一个属性接收父类原型, 用于冒充的方式继承. 属性方法冲突时,可重载
                if (father.prototype.constructor === Object.prototype.constructor) { // fu.prototype = {name:""} , 会指向Object
                    father.prototype.constructor = father;
                }
            },
            // 地址栏参数查找和截取
            // @param 要查找的字符串,  start:截取的开始位置, end : 截取几位数
            // 说明: var dtp = p.addressFind("dtp=",4,1); dtp= 是4位数
            addressFind: function (param, start, end) {
                var href = location.href,
                    index = href.indexOf(param);
                if (index > 0) {
                    var result = {index: index};
                    if (start && end) {
                        result.str = href.substring(index + start, index + start + end);
                    } else if (start) {
                        result.str = href.substring(index + start);
                    } else {
                        result.str = href.substring(index);
                    }
                    return result;
                } else {
                    return false;
                }
            },
            // 获取url参数
            // 调用 var args = GetUrlParms();
            //if(args["id"] !=undefined){}
            GetUrlParams: function () {
                var args = new Object();

                var query = location.search.substring(1);//获取查询串

                var pairs = query.split("&");//在逗号处断开

                for (var i = 0; i < pairs.length; i++) {
                    var pos = pairs[i].indexOf('=');//查找name=value
                    if (pos == -1) continue;//如果没有找到就跳过
                    var argname = pairs[i].substring(0, pos);//提取name
                    var value = pairs[i].substring(pos + 1);//提取value
                    args[argname] = unescape(value);//存为属性
                }
                return args;
            },

            /*------------下面几个时间函数-----------*/

            // 时间戳转日期时间,返回 2018-03-29 或 2018-03-29 15:20:08
            tampToTime: function (stamp, time) {
                var stamp = String(stamp).length == 10 ? stamp * 1000 : stamp;
                var T = new Date(stamp),
                    Format = function (Q) {return Q < 10 ? '0' + Q : Q},
                    Result = Format(T.getFullYear()) + "-" + Format(T.getMonth() + 1) + "-" + Format(T.getDate()) +
                        (time ? " " + Format(T.getHours()) + ":" + Format(T.getMinutes()) + ":" + Format(T.getSeconds()) : "");
                return Result;
            },

            //转时间戳: 可以传"2018-05-06" 或 "2018-05-06 10:02:01"
            //单传日期: 返回该天的时间戳,时间为 0:0:0
            dateTransverter: function (s) {
                if (typeof s == "string") {
                    var date = new Date(s.replace(/-/g, '/'));
                    return Date.parse(date) / 1000;
                }
                throw new Error("你传入的时间不是一个字符串,无法转换!");
            },

            //比较两个时间,返回相差结果,参数可选,默认返回分钟
            compareTime: function (s, e, type) {
                var ST = new Date(s.replace(/-/g, '/')), //兼容苹果手机
                    ET = new Date(e.replace(/-/g, '/')),//转为日期对象

                    sTime = ST.getTime(), // 获得总毫秒数
                    eTime = ET.getTime(),
                    difference = eTime - sTime;

                switch (type) {
                    case "seconds":
                        return difference / 1000;// 转为秒数
                    case "minutes":
                        return difference / (60 * 1000);// 转为分钟,保留一位小数
                    case "hours":
                        return difference / (60 * 60 * 1000);// 转为小时
                    case "days":
                        return difference / (60 * 60 * 24 * 1000);// 转为天数
                    default:
                        return difference / (60 * 1000).toFixed(1);// 默认分钟
                }
            },


            // 获取服务器时间: 返回 2018-03-29 15:20:08
            getServerTime: function () {
                var serverTime = "";
                $.ajax({
                    type: "OPTIONS",
                    url: "/",
                    async: false,
                    complete: function (x) {
                        var time = x.getResponseHeader("Date");
                        var Format = function (Q) {return Q < 10 ? '0' + Q : Q},
                            d = new Date(time),
                            year = d.getFullYear(),
                            month = Format(d.getMonth() + 1),
                            day = Format(d.getDate()),
                            hours = Format(d.getHours()),
                            minutes = Format(d.getMinutes()),
                            seconds = Format(d.getSeconds());

                        var str = year + "-" + month + "-" + day;
                        serverTime = str + " " + hours + ":" + minutes + ":" + seconds;
                    },
                    error: function () {
                        console.error("亲,别慌 [405] 是正常现象,不影响需求的!");
                    }
                });
                return serverTime;
            },
            saveUserData: function (name, opt) {
                var strOpt = JSON.stringify(opt);
                if (window.sessionStorage) {
                    sessionStorage.setItem(name, strOpt);
                } else if ($.cookie) {
                    $.cookie(name, strOpt, {
                        path: "/", expires: 1
                    });
                }
            },
            getUserData: function (name) {
                var data;
                if (window.sessionStorage) {
                    data = JSON.parse(sessionStorage.getItem(name));
                } else if ($.cookie) {
                    data = JSON.parse($.cookie(name));
                }
                return data;
            },


            // --------------------数组对象的一些方法----------------

            // 删除指定的 key == value 的对象
            // 调用 objectFilter(this.staffData,"status","上班打卡");
            objectFilter: function (arr, key, value) {
                // callee 在严格模式用不了, 用闭包代替
                function foo() {
                    for (var i = 0, len = arr.length; i < len; i++) {
                        if (arr[i][key] == value) {
                            arr.splice(i, 1);
                            foo();
                            break;
                        }
                    }
                }

                foo();
            },
            //对象数组去重: key 可以是 "string" , 也可以是 ["Array","Array"]
            //调用: var res = arrayFilter(personData,["time","username"]);
            arrayFilter: function (arr, key) {
                var keyArr = typeof key == "string" ? new Array(key) : key;
                //注意: i++ 还是0 , 不是++i
                for (var i = 0, temp = {}, result = [], item; item = arr[i++];) {
                    var flag = 0;
                    // flag 代表在每一个item里,有几个key重复
                    for (var j = 0; j < key.length; j++) {
                        var value = item[key[j]];
                        // 第一个是不满足条件的
                        if (temp[value]) {
                            flag++;
                            continue;
                        }
                        temp[value] = true;
                    }
                    // j = key.length ,即全部重复
                    if (flag < j) {
                        result.push(item);
                    }
                }
                return result;
            },


            // 判断已有数组里面的对象: 如果key值 == obj的key值, 就移除该对象
            // use:  1 isRepeat(arr, obj, "urerid");
            //       2 isRepeat(arr, obj, ["userid", "status"]); // 两个key 值同时相等

            isRepeat: function (arr, obj, key) {
                var key = typeof key == "string" ? new Array(key) : key;
                !function foo() {
                    var len = arr.length;
                    for (var j = 0; j < len; j++) {
                        var flag = false;
                        for (var i = 0; i < key.length; i++) {
                            if (arr[j][key[i]] == obj[key[i]]) {
                                flag = true;
                            } else {
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            arr.splice(j, 1);
                            foo();
                            break;
                        }
                    }
                }();
            },

            // --------webSocket请求封装------
            webSocketEvent: function (url, param, fn) {
                var _this = this
                if ('WebSocket' in window) {
                    var ws = new ReconnectingWebSocket(url)
                    ws.onopen = function () {
                        ws.send(JSON.stringify(param))
                    }
                    ws.onmessage = function (res) {
                        fn(res.data);
                    }
                    ws.onclose = function () {
                        _this.isOnline = false
                    }
                    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                    window.onbeforeunload = function () {
                        ws.close();
                    }
                    return ws
                } else {
                    alert(
                        '您的浏览器版本过低,请升级到最新版本!推荐使用谷歌或者火狐浏览器.'
                    )
                }
            },
            AnimationFrame: function () {
                if (!window.requestAnimationFrame) {
                    window.requestAnimationFrame = function (fn) {
                        setTimeout(fn, 25);
                    };
                }
            },
        };
    }
    return {
        getInstance: function () {
            if (!instantiated) {
                instantiated = init();
            }
            return instantiated;
        }
    };
})();