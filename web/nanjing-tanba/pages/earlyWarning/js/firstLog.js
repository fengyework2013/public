$(document).ready(function () {
    //任务名列表创建
    fnAjax.method_4(url_join3("taskaction/list/3"), '', "get", function (data) {
        if (data.code == 0) {
            var taskName = $.cookie("taskName");
            var dateStart = $.cookie("dateStart");
            var dateEnd = $.cookie("dataEnd");

            $.each(data.data.data, function (item, ele) {
                if (ele.sTaskName == taskName) {
                    $('<option></option>').val(ele.id).text(ele.sTaskName).attr("selected","selected").appendTo($('#taskName'));
                    $("#logmin").val(dateStart);
                    $("#logmax").val(dateEnd);
                } else {
                    $('<option></option>').val(ele.id).text(ele.sTaskName).appendTo($('#taskName'));
                }
            });
            $.cookie("taskName", "");
            $.cookie("dateStart","");
            $.cookie("dataEnd","");
            dynamic_page(); //动态分页
        } else {
            layer.msg(data.message, {
                icon: 2,
                time: 2000
            });
        }
    });

    //地区选择
    var strId = '';
    var strArea = "";
    $('#chooseAdress').click(function () {
        layer.open({
            type: 2,
            title: "区域选择",
            area: ['55%', '45%'],
            content: "ztree-area-search-one.html",
            end: function () {

                aArea = JSON.parse($.cookie("addressInfo"));

                console.log(aArea);

                strArea = aArea.text;
                strId = aArea.id;

                $('#area').val(strArea);
                console.log(strId);

            }
        });
    })

    //点击查看搜索
    $('#search').click(function () {
        var taskName = $('#taskName').find('option:selected').val();
        active_layPage.method_post(
            url_join3("taskaction/showlog/3/" + taskName),
            "10",
            ".table-data",
            function (d) {
                setTimeout(function () {
                    createTabel(".table-data", d.data.data);
                }, 500)

            }
        );
    })

    //动态分页
    var active_layPage = {
        method_post: function (Url, dataN, table, fn) {
            fnAjax.method_4(
                Url, {
                    "itemNum": dataN,
                    "startTime": $("#logmin").val(),
                    "endTime": $("#logmax").val(),
                    "areaid": strId
                },
                "post",
                function (data) {
                    $(".pageNum").text(data.data.last_page); //显示的总页数
                    $(".dataNum").text(data.data.total); //显示的数据总条数
                    //			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
                    if (parseInt(data.data.total) == 0) {
                        $(table).children("tbody").html("");
                        $("#pageTool").html("当前没有数据！");
                        $(".pageNum").text(0); //显示的总页数
                        $(".dataNum").text(0); //显示的数据总条数
                    } else if (parseInt(data.data.total) > 0) {
                        fn(data);
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
                                            "itemNum": dataN,
                                            "startTime": $("#logmin").val(),
                                            "endTime": $("#logmax").val(),
                                            "areaid": strId,
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
                                    "startTime": $("#logmin").val(),
                                    "endTime": $("#logmax").val(),
                                    "areaid": strId,
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
        method_get: function (Url, dataN, table, fn) {
            fnAjax.method_4(
                Url, {
                    "itemNum": dataN, //表格一页显示的数量
                },
                "get",
                function (data) {

                    $(".pageNum").text(data.data.last_page); //显示的总页数
                    $(".dataNum").text(data.data.total); //显示的数据总条数
                    //			$("table").after($('<div id="biuuu_city" class="text-c mt-20"></div>'));//表格和表格后面的分页控制器
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
                                            "itemNum": dataN,
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
    function dynamic_page() {
        var lookFirstId = $.cookie('lookFirstId');
        var taskName = $.cookie('taskName');
        if (lookFirstId) {
            active_layPage.method_get(
                url_join3("taskaction/showlog/3/" + lookFirstId),
                "10",
                ".table-data",
                function (d) {
                    createTabel(".table-data", d.data.data);
                }
            );
            $.cookie('lookFirstId',"");
        }
    }
});


//创建表格,ele指的是table的选择器。data指的是数组数据
function createTabel(ele, data) {
    var d = data;
    console.log(d);
    $('tbody tr').remove();
    $.each(d, function (item, ele) {
        var jLogInfo = JSON.parse(ele.jLogInfo);
        var $tr = $('<tr class="text-c" ></tr>');
        $('<td></td>').text("#" + jLogInfo.tbid + "[动态预警]").appendTo($tr);
        $('<td></td>').text(jLogInfo.targetName + "[" + jLogInfo.mac + "]").appendTo($tr);
        $('<td></td>').text("出现地点[" + jLogInfo.address + "]").appendTo($tr);
        $('<td></td>').text("出现时间[" + jLogInfo.time + "]").appendTo($tr);
        $tr.appendTo($('tbody'));
    });

}