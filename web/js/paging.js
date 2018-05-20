/* opt.num //每页显示的条数 10
   opt.value // $("#keywords").val()
   opt.pagination // 页码
   opt.text // "获取用户列表成功"
   opt.tableEle // $('.table')
   opt.pagingUrl // 分页的地址
   opt.delUrl // 删除数据的url
   opt.createTable // 回调函数
 */
// 1 请求 2 渲染 3 分页,  3个步骤也可以独立出来的.
function paging(opt) {
    var T = new CreateTable({});
    var tableEle = opt.tableEle;
    T.ajaxFive(opt.pagingUrl,
        {
            page: opt.pagination,//页码
            keyword: opt.value,//关键词
            itemNum: opt.num,//一页显示的条数
        },
        'get',
        function (res) {
            if (res.message == opt.text) {
                var page = parseInt(res.data.current_page);
                // 2 渲染
                opt.createTable(tableEle, res.data);// 创建表格
                // 3 分页
                T.paging(
                    {
                        pageSum: res.data.last_page, // 总页数
                    },
                    function (obj) {
                        var data = {
                            page: obj.curr,//页码
                            keyword: opt.value,// 关键词
                            itemNum: opt.num,//一页显示的条数
                        }
                        T.ajaxFive(opt.pagingUrl, data, "get", function (res) {
                            if (parseInt(res.data.total)) {
                                page = parseInt(res.data.current_page);
                                opt.createTable(tableEle, res.data);// 创建表格
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
}
