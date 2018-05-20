var indexObiect= (function () {
    var instantiated;
    function init() {
        /*这里定义单例代码*/
        return {
            init:function (){
                this.clickEvent();
            },
            clickEvent:function (){
                var _this = this;
                $(".myInfo").on('click',function (){
                    _this.myselfinfo();
                });

                $(".displayArrow").on('click',function (){
                    displaynavbar($(this));
                });
            },
            // personal information
            myselfinfo:function (){
                layer.open({
                    type: 1,
                    area: ['300px', '200px'],
                    fix: false, //不固定
                    maxmin: true,
                    shade: 0.4,
                    title: '查看信息',
                    content: '<div>管理员信息</div>'
                });
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

