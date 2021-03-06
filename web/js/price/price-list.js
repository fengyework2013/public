var T = new CreateTable({});
$(function () {
    var tableEle = $('.table');
    T.ajaxFive(config.priceLevel,
        {
            page: 1,//页码
        },
        'get',
        function (res) {
            if (res.code == 0) {
                var page = parseInt(res.data.current_page);
                createTable(tableEle, res.data);// 创建表格
                T.paging(
                    {
                        pageSum: res.data.last_page, // 总页数
                    },
                    function (obj) {
                        var data = {
                            page: obj.curr,//页码
                        }
                        T.ajaxFive(config.userIp, data, "post", function (res) {
                            if (parseInt(res.data.total)) {
                                page = parseInt(res.data.current_page);
                                createTable(tableEle, res.data);// 创建表格
                            }
                            else if (parseInt(res.data.total) == 0) {
                                $(tableEle).find("tbody").html("").after($("<div>没有相关数据!</div>"));
                            }
                        });
                    }
                ); //分页
            }
        }
    );

    function createTable(container, data) {
        container.children("tbody").html("");
        $.each(data.data, function (i, v) {
            var sTr = '<tr class="text-c" data-role-id="' + v.roleid + '" data-id="' + v.id + '">' +
                '<td class="num">' + (data.from + i) + '</td>' +
                '<td class="userName">' + v.level + '</td>' +
                // '<td class="roleName" >' + v.base_price + '</td>' +
                '<td class="createTime">RMB</td>' +
                '<td class="option f-14">'+v.ratio+'</td>' +
                // '<td>'+v.name+'</td>'+
                '<td>'+v.remarks +'</td>'+
                '<td>'+
                '<a title="编辑" href="javascript:void(0);"  style="text-decoration:none" class="btn-edit">编辑</a>' +
                '<a title="删除" href="javascript:void(0);"  class="ml-5 btn-del" style="text-decoration:none">删除</a>' +
                '</td>' +
                '</tr>';
            container.children("tbody").append($(sTr));
        });

        // 编辑用户
        $(".btn-edit").on("click",function (){

            var dataId = $(this).parents("tr").attr("data-id");
            sessionStorage.editUser = dataId;
            layer.open({
                type: 2,
                title: '编辑用户',
                area: ['100%', '91%'],
                content: "price-edit.html",
                end: function() {
                    window.location.reload();
                }
            });

        });


        //删除数据
        $('.table tbody').on("click", ".btn-del", function () {
            var nId = $(this).parents("tr").attr("data-id");
            layer.confirm("是否删除当前数据", function () {
                T.ajaxFour(
                    config.priceLevelDelete,
                    {id: nId},
                    "post",
                    function (data) {
                        layer.msg(data.message, {time: 1500}, function () {
                            window.location.reload();
                        });
                    }
                );

            });
        });

    }

    // 添加等级
    $(".addUser").on("click",function (){

        layer.open({
            type: 2,
            title: '添加等级',
            maxmin: true,
            area: ['100%', '91%'],
            content: "../price/price-add.html",
            end: function() {
                window.location.reload();
            }
        });
    });





});