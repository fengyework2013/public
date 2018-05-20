$(document).ready(function(){
    //动态分页
    var active_layPage = {
        //动态分页--post
        method_post: function (Url, dataN, table, fn) {
            fnAjax.method_4(
                Url, {
                    "itemNum": dataN,
                    "deviceCode": $("#deviceCode").val(),
                    "startTime": $("#logmin").val(),
                    "endTime": $("#logmax").val(),
                    "location": $("#location").val()
                },
                "post",
                function (data) {
                    $(".pageNum").text(data.pageSum); //显示的总页数
                    $(".dataNum").text(data.count); //显示的数据总条数
                    if (parseInt(data.count) == 0) {
                        $(table).children("tbody").html("");
                        $("#pageTool").html("当前没有数据！");
                        $(".pageNum").text(0); //显示的总页数
                        $(".dataNum").text(0); //显示的数据总条数
                    } else if (parseInt(data.count) > 0) {
                        fn(data);
                        laypage({
                            cont: "pageTool", //控制分页容器，
                            pages: data.pageSum, //总页数
                            skip: true, //是否开启跳页
                            groups: 3, //连续显示分页数
                            first: '首页', //若不显示，设置false即可
                            last: '尾页', //若不显示，设置false即可
                            prev: '<', //若不显示，设置false即可
                            next: '>', //若不显示，设置false即可
                            hash: true, //开启hash
                            jump: function (obj, first) {

                                if (!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    fnAjax.method_4(
                                        Url, {
                                            "itemNum": dataN,
                                            "deviceCode": $("#deviceCode").val(),
                                            "startTime": $("#logmin").val(),
                                            "endTime": $("#logmax").val(),
                                            "location": $("#location").val(),
                                            "page": obj.curr
                                        },
                                        "post",
                                        function (d) {
                                            fn(d);
                                        }
                                    );
                                }

                            }
                        });

                        $("body").delegate(".laypage_btn", "click", function () {
                            fnAjax.method_4(
                                Url, {
                                    "itemNum": dataN,
                                    "deviceCode": $("#deviceCode").val(),
                                    "startTime": $("#logmin").val(),
                                    "endTime": $("#logmax").val(),
                                    "location": $("#location").val(),
                                    "page": $(".laypage_skip").val()
                                },
                                "post",
                                function (data) {
                                    fn(data);
                                }
                            );
                        });

                    }

                });
        },
        //动态分页--get
        method_get: function (Url, dataN, table, fn) {
            fnAjax.method_4(
                Url, {
                    "itemNum": dataN, //表格一页显示的数量
                    "deviceCode": $("#deviceCode").val(),
                    "startTime": $("#logmin").val(),
                    "endTime": $("#logmax").val(),
                    "location": $("#location").val()
                },
                "get",
                function (data) {

                    $(".pageNum").text(data.pageSum); //显示的总页数
                    $(".dataNum").text(data.count); //显示的数据总条数
                    if (parseInt(data.data.total) == 0) {
                        $(table).children("tbody").html("");
                        $("#pageTool").html("当前没有数据！");
                        $(".pageNum").text(0); //显示的总页数
                        $(".dataNum").text(0); //显示的数据总条数
                    } else if (parseInt(data.data.total) > 0) {
                        fn(data);
                        $(".pageNum").text(data.data.last_page); //显示的总页数
                        $(".dataNum").text(data.data.total); //显示的数据总条数
                        laypage({
                            cont: "pageTool", //控制分页容器，
                            pages: data.data.last_page, //总页数
                            skip: true, //是否开启跳页
                            groups: 3, //连续显示分页数
                            first: '首页', //若不显示，设置false即可
                            last: '尾页', //若不显示，设置false即可
                            prev: '<', //若不显示，设置false即可
                            next: '>', //若不显示，设置false即可
                            hash: true, //开启hash
                            jump: function (obj, first) {

                                if (!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    fnAjax.method_4(
                                        Url, {
//										"itemNum": dataN,
                                            "deviceCode": $("#deviceCode").val(),
                                            "startTime": $("#logmin").val(),
                                            "endTime": $("#logmax").val(),
                                            "location": $("#location").val(),
                                            "page": obj.curr
                                        },
                                        "get",
                                        function (d) {
                                            fn(d);

                                        }
                                    );
                                }

                            }
                        });

                        $("body").delegate(".laypage_btn", "click", function () {
                            fnAjax.method_4(
                                Url, {
                                    "itemNum": dataN,
                                    "deviceCode": $("#deviceCode").val(),
                                    "startTime": $("#logmin").val(),
                                    "endTime": $("#logmax").val(),
                                    "location": $("#location").val(),
                                    "page": $(".laypage_skip").val()
                                },
                                "get",
                                function (data) {
                                    fn(data);

                                }
                            );
                        });

                    }

                });
        }
    };

    //动态分页
    active_layPage.method_get(
        url_join3("taskaction/list/4"),
        "10",
        ".table-data",
        function (d) {
            createTabel(".table-data", d.data.data);
        }
    );


});
//创建表格,ele指的是table的选择器。data指的是数组数据
function createTabel(ele, data) {
    var d = data;
    $('tbody tr').remove();
    $.each(d, function (item, ele) {
        var iStatus = ele['iStatus'];
        var look = "<a  data-id='" + ele.id + "' class='lookId set' href='javascript:void(0)' title='查看'>查看</a>";

        switch (iStatus) {
            case 0:
                iStatus = "<a onclick='set(" + ele['id'] + ")' class='set' href='javascript:void(0)' title='编辑'>编辑 &nbsp;</a><a onclick='start(" + ele['id'] + ")' class='set' href='javascript:void(0)' title='开始'>开始 &nbsp;</a><a onclick='del(" + ele['id'] + ")' class='set' href='javascript:void(0)' title='删除'>删除</a>";
                break;
            case 1:
                iStatus = "<a onclick='set(" + ele['id'] + ")' class='set' href='javascript:void(0)' title='编辑'>编辑 &nbsp;</a><a onclick='stop(" + ele['id'] + ")' class='set' href='javascript:void(0)' title='停止'>停止 &nbsp;</a><a onclick='del(" + ele['id'] + ")' class='set' href='javascript:void(0)' title='删除'>删除</a>";
                break;
            default:
                break;
        }
        var $tr = $('<tr class="text-c" ></tr>');
        $('<td></td>').text(ele['sTaskName']).appendTo($tr);
        $('<td></td>').text(ele['iStartTime']).appendTo($tr);
        $('<td></td>').text(ele['iEndTime']).appendTo($tr);
        $('<td></td>').html(look).appendTo($tr);
        $('<td></td>').html(iStatus).appendTo($tr);
        $tr.appendTo($('tbody'));
    });
   
    // 绑定单击事件
    $(".lookId").on("click",function (){

        var id = $(this).data("id");
        var taskName = $(this).parent().siblings().eq(0).text(); // 获取任务名
        var dateStart = $(this).parent().siblings().eq(1).text();
        var dateEnd = $(this).parent().siblings().eq(2).text();

        var pare = window.parent.document;
        $(pare).find(".tab-li4").addClass("active").siblings().removeClass("active");
        $.cookie('lookdynamicId', id);
        $.cookie("taskName",taskName);
        $.cookie("dateStart",dateStart);
        $.cookie("dataEnd",dateEnd);
        window.location.href = "dynamicEarlyWarninglog.html";
    });
}

//编辑
function set(id) {
    $.cookie('ifset', 1);
    var index = layer.open({
        type: 2,
        title: "编辑动态预警任务",
        area: ['40%', '50%'],
        content: "addtask.html"
    });
    layer.full(index);
    $.cookie("setId", id);
}

//开始任务
function start(id) {
    fnAjax.method_4(url_join3("taskaction/start/" + id), '', "get", function (data) {
        if (data.code == 0) {
            layer.msg(data.message, {
                icon: 1,
                time: 2000
            }, function () {
                parent.location.reload();
            });
        } else {
            layer.msg(data.message, {
                icon: 2,
                time: 2000
            });
        }
    });
}

//停止任务
function stop(id) {
    fnAjax.method_4(url_join3("taskaction/stop/" + id), '', "get", function (data) {
        if (data.code == 0) {
            layer.msg(data.message, {
                icon: 1,
                time: 2000
            }, function () {
                parent.location.reload();
                //										parent.parent.location.reload();
            });
        } else {
            layer.msg(data.message, {
                icon: 2,
                time: 2000
            });
        }
    })
}

//删除任务
function del(id) {
    fnAjax.method_4(url_join3("taskaction/del/" + id), '', "get", function (data) {
        if (data.code == 0) {
            layer.msg(data.message, {
                icon: 1,
                time: 2000
            }, function () {
                parent.location.reload();
            });
        } else {
            layer.msg(data.message, {
                icon: 2,
                time: 2000
            });
        }
    })
}