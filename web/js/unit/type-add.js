$(function () {
    var typeAdd = {
        T: new CreateTable({}),
        parentInfo:"",
        submit: $("#submitBtn"),
        init: function () {
            this.getParentId();
            $("#parent_id").text(this.parentInfo.name || "没有父类相关信息,现在添加的是顶级分类.");
            this.clickEvent();
            this.submitEvent();
        },
        clickEvent: function () {
            $("#cancelBtn").on("click", function () {
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
            });
        },
        submitEvent: function () {
            var _this = this;
            this.submit.on("click", function (e) {
                e.preventDefault();
                var param = {
                    name: $("#type-name").val(),
                    remarks: $("#remarks").val(),
                    parent_id: _this.parentInfo.parent_id,
                }
                _this.T.ajaxThree(config.pdutypeAdd, param, "post", function (res) {
                    layer.alert(res.message, {
                        yes: function () {
                            layer.confirm('是否留在此页？', {
                                btn: ['否', '是'] //按钮
                            }, function () {
                                var index = parent.layer.getFrameIndex(window.name);
                                parent.layer.close(index);
                            });
                        },
                        cancel: function () {
                            layer.confirm('是否留在此页？', {
                                btn: ['否', '是'] //按钮
                            }, function () {
                                var index = parent.layer.getFrameIndex(window.name);
                                parent.layer.close(index);
                            });
                        }
                    });
                });
            })
        },
        getParentId:function (){
            var info = this.T.getUserData('parentInfo');
            if(info.name){
                console.log(info);
                this.parentInfo = info;
                return info;
            }else{
                info = "没有父类相关信息,现在添加的是定级分类.";
                this.parentInfo = "没有父类相关信息,现在添加的是定级分类.";
                return info;
            }
        }
    }
    typeAdd.init();
});