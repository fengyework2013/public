$(document).ready(function () {
    var basicsAdd = {
        T: new CreateTable({}),
        submit: $("#submitBtn"),
        select: $("#selectType"),
        typeid: "",
        init: function () {
            this.getPduEvent();
            this.clickEvent();
            this.submitEvent();
        },
        getPduEvent: function () {
            var _this = this;
            var param = {parent_id: 0};
            this.T.ajaxThree(config.pdutype, param, "get", function (res) {
                if (res.message == "获取PDU分类列表成功") {
                    var data = res.data.data;
                    $.each(data, function (i, v) {
                        var options = $(
                            "<option data-name='" + v.name + "' data-parent-id='" + v.parent_id + "' value=" + v.id + ">" + v.name + "</option>"
                        );
                        _this.select.append(options);
                    });
                }
            });
        },
        clickEvent: function () {
            var _this = this;
            // $("#cancelBtn").on("click", function () {
            //     var index = parent.layer.getFrameIndex(window.name);
            //     parent.layer.close(index);
            // });
            this.select.on("change", function () {
                _this.typeid = $(this).val();
            });

        },
        submitEvent: function () {
            var _this = this;
            this.submit.on("click", function (e) {
                // e.preventDefault();
                // _this.fsubmit();


                // if (_this.typeid) {
                //     var form = document.getElementById("form1");
                //     var param = new FormData(form);
                //
                //     // var param = {
                //     //     parent_id: _this.typeid,
                //     //     name: $("#type-name").val(),
                //     //     remarks: $("#remarks").val(),
                //     //     image:new FormData(form),
                //     // }
                //     console.log(param);
                //     _this.T.ajaxSix(config.pduarchivesAdd, param, "post", function (res) {
                //         layer.alert(res.message, {
                //             yes: function () {
                //                 layer.confirm('是否留在此页？', {
                //                     btn: ['否', '是'] //按钮
                //                 }, function () {
                //                     var index = parent.layer.getFrameIndex(window.name);
                //                     parent.layer.close(index);
                //                 });
                //             },
                //             cancel: function () {
                //                 layer.confirm('是否留在此页？', {
                //                     btn: ['否', '是'] //按钮
                //                 }, function () {
                //                     var index = parent.layer.getFrameIndex(window.name);
                //                     parent.layer.close(index);
                //                 });
                //             }
                //         });
                //     });
                // } else {
                //     layer.alert("请选择分类");
                // }

            });
        },
    }

    basicsAdd.init();

});


function FileInput() {
    //0.初始化fileinput
    // var oFileInput = new FileInput();
    // oFileInput.Init("txt_file", config.updateImage);


    var oFile = new Object();

    //初始化fileinput控件（第一次初始化）
    oFile.Init = function (ctrlName, uploadUrl) {
        var control = $(ctrlName);

        //初始化上传控件的样式
        control.fileinput({
            language: 'zh', //设置语言
            // uploadUrl: uploadUrl, //上传的地址
            allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
            showUpload: true, //是否显示上传按钮
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式
            //dropZoneEnabled: false,//是否显示拖拽区域
            //minImageWidth: 50, //图片的最小宽度
            //minImageHeight: 50,//图片的最小高度
            //maxImageWidth: 1000,//图片的最大宽度
            //maxImageHeight: 1000,//图片的最大高度
            //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
            //minFileCount: 0,
            maxFileCount: 10, //表示允许同时上传的最大文件个数
            enctype: 'multipart/form-data',
            validateInitialCount: true,
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
            msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        });

        //导入文件上传完成之后的事件
        $("#txt_file").on("fileuploaded", function (event, data, previewId, index) {
            alert("上传完毕");

            // $("#myModal").modal("hide");
            // var data = data.response.lstOrderImport;
            // if (data == undefined) {
            //     toastr.error('文件格式类型不正确');
            //     return;
            // }
            // //1.初始化表格
            // var oTable = new TableInit();
            // oTable.Init(data);
            // $("#div_startimport").show();
        });


    }


    return oFile;
}