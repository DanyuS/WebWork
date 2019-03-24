$(function () {
    'use strict';
    var $image = $('#image');
    var $download = $('#download');
    var $dataX = $('#dataX');
    var $dataY = $('#dataY');
    var $dataHeight = $('#dataHeight');
    var $dataWidth = $('#dataWidth');
    var $dataRotate = $('#dataRotate');
    var $dataScaleX = $('#dataScaleX');
    var $dataScaleY = $('#dataScaleY');
    var $dataWH = $('#dataWH');
    var options = {
        aspectRatio: 1 / 1,// 设置裁切框的宽高比。默认情况下，裁剪框是自由比例。
        preview: '.img-preview',
        crop: function (e) {
            $dataX.html(Math.round(e.x));
            $dataY.html(Math.round(e.y));
            $dataHeight.html(Math.round(e.height));
            $dataWidth.html(Math.round(e.width));
            $dataRotate.html(e.rotate);
            $dataScaleX.html(e.scaleX);
            $dataScaleY.html(e.scaleY);
            var _$dataWH = reductionTo(Math.round(e.width), Math.round(e.height));
            $dataWH.html(_$dataWH[0] + '/' + _$dataWH[1]);
        }
    };
    // 初始化函数
    $image.cropper(options);
    $image.cropper({
        built: function () {
        }
    });

    // 修改裁剪比例函数
    $('#ratio_container .btn').click(function (event) {
        event.stopPropagation();
        var dataRatio = $(this).attr('data-ratio');
        $image.cropper('destroy').cropper({'aspectRatio': dataRatio});
    });
    // 移动函数
    $('#move_container .btn').click(function (event) {
        event.stopPropagation();
        var dataMovex = parseInt($(this).attr('data-movex'));
        var dataMovey = parseInt($(this).attr('data-movey'));
        $image.cropper('move', dataMovex, dataMovey)
    });

    // 移动函数
    $('#move_container .btn').click(function (event) {
        event.stopPropagation();
        var dataMovex = parseInt($(this).attr('data-movex'));
        var dataMovey = parseInt($(this).attr('data-movey'));
        $image.cropper('move', dataMovex, dataMovey)
    });

    // Keyboard
    $(document.body).on('keydown', function (e) {
        if (!$image.data('cropper') || this.scrollTop > 300) {
            return;
        }
        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }

    });
    // 放大缩小
    $('#zoom_container .btn').click(function (event) {
        event.stopPropagation();
        var dataZoom = $(this).attr('data-zoom');
        $image.cropper('zoom', dataZoom);
    });
    // 旋转
    $('#rotate_container .btn').click(function (event) {
        event.stopPropagation();
        var dataRotate = $(this).attr('data-rotate');
        $image.cropper('rotate', dataRotate);
    });
    // 翻转
    var scalexVal = 1;
    var scaleyVal = 1;
    $('#scale_container .btn').click(function (event) {
        event.stopPropagation();
        var dataScale = $(this).attr('data-scale');
        if (dataScale == 'x') {
            scalexVal = -scalexVal;
            $image.cropper('scaleX', scalexVal);
        } else if (dataScale == 'y') {
            scaleyVal = -scaleyVal;
            $image.cropper('scaleY', scaleyVal);
        }
    });
    // reset()：重置剪裁区域的图片到初始状态。
    $('#reset1').click(function (event) {
        event.stopPropagation();
        $image.cropper('crop');
        $image.cropper('destroy').cropper({'preview': '.img-preview'});
    });
    // 输出裁剪好的图片
    $('#getCroppedCanvas').click(function (event) {
        event.stopPropagation();
        var imgurl = $image.cropper("getCroppedCanvas");
        $("#canvas").html(imgurl);
        $download.attr('href', imgurl.toDataURL());
        $('.fixed-canvas').removeClass('hiddle');
    });
    // 点击取消或者下载之后
    $('#modal_canvas_btn .btn').click(function (event) {
        $('.fixed-canvas').addClass('hiddle');
    });
    //图片合成
    $('#join').click(function (event) {
        var thisURL = decodeURI(window.location.href);
        var name = thisURL.split('~')[1];
        var url = encodeURI("join?~" + name);
        window.location.href = url;
    });
    $('#addMark').click(function (event) {
        var thisURL = decodeURI(window.location.href);
        var name1 = thisURL.split('~')[1].substr(33);
        var userId = thisURL.split('~')[2];
        $.ajax({
            url: '/checkIfMarked/' + userId + "/" + name1,
            type: 'get',
            dataType: 'json',
            data: {},
            success: function (data) {
                if (data.code > 0) {
                    if (data.msg == true) {
                        //说明用户还没有给该图加标签
                        var thisURL = decodeURI(window.location.href);
                        var name = thisURL.split('~')[1];
                        var userId = thisURL.split('~')[2];
                        var url = encodeURI("addmark?~" + name + "~" + userId);
                        window.location.href = url;
                    }
                    else {
                        alert("you can't mark one photo twice!");
                        console.log("you can't mark one photo twice!");
                    }
                }
            },
            error: function (result) {
                alert('error');
            }
        });

    });
});


// m,n为正整数的分子和分母
function reductionTo(m, n) {
    var arr = [];
    if (!isInteger(m) || !isInteger(n)) {
        // console.log('m和n必须为整数');
        arr[0] = 0;
        arr[1] = 0;
        return arr;
    } else if (m <= 0 || n <= 0) {
        // console.log('m和n必须大于0');
        arr[0] = 0;
        arr[1] = 0;
        return arr;
    }
    var a = m;
    var b = n;
    (a >= b) ? (a = m, b = n) : (a = n, b = m);
    if (m != 1 && n != 1) {
        for (var i = b; i >= 2; i--) {
            if (m % i == 0 && n % i == 0) {
                m = m / i;
                n = n / i;
            }
        }
    }
    arr[0] = m;
    arr[1] = n;
    return arr;
}

// 判断一个数是否为整数
function isInteger(obj) {
    return obj % 1 === 0
}




