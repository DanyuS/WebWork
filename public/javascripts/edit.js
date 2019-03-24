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
        aspectRatio: 1 / 1,// ���ò��п�Ŀ�߱ȡ�Ĭ������£��ü��������ɱ�����
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
    // ��ʼ������
    $image.cropper(options);
    $image.cropper({
        built: function () {
        }
    });

    // �޸Ĳü���������
    $('#ratio_container .btn').click(function (event) {
        event.stopPropagation();
        var dataRatio = $(this).attr('data-ratio');
        $image.cropper('destroy').cropper({'aspectRatio': dataRatio});
    });
    // �ƶ�����
    $('#move_container .btn').click(function (event) {
        event.stopPropagation();
        var dataMovex = parseInt($(this).attr('data-movex'));
        var dataMovey = parseInt($(this).attr('data-movey'));
        $image.cropper('move', dataMovex, dataMovey)
    });

    // �ƶ�����
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
    // �Ŵ���С
    $('#zoom_container .btn').click(function (event) {
        event.stopPropagation();
        var dataZoom = $(this).attr('data-zoom');
        $image.cropper('zoom', dataZoom);
    });
    // ��ת
    $('#rotate_container .btn').click(function (event) {
        event.stopPropagation();
        var dataRotate = $(this).attr('data-rotate');
        $image.cropper('rotate', dataRotate);
    });
    // ��ת
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
    // reset()�����ü��������ͼƬ����ʼ״̬��
    $('#reset1').click(function (event) {
        event.stopPropagation();
        $image.cropper('crop');
        $image.cropper('destroy').cropper({'preview': '.img-preview'});
    });
    // ����ü��õ�ͼƬ
    $('#getCroppedCanvas').click(function (event) {
        event.stopPropagation();
        var imgurl = $image.cropper("getCroppedCanvas");
        $("#canvas").html(imgurl);
        $download.attr('href', imgurl.toDataURL());
        $('.fixed-canvas').removeClass('hiddle');
    });
    // ���ȡ����������֮��
    $('#modal_canvas_btn .btn').click(function (event) {
        $('.fixed-canvas').addClass('hiddle');
    });
    //ͼƬ�ϳ�
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
                        //˵���û���û�и���ͼ�ӱ�ǩ
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


// m,nΪ�������ķ��Ӻͷ�ĸ
function reductionTo(m, n) {
    var arr = [];
    if (!isInteger(m) || !isInteger(n)) {
        // console.log('m��n����Ϊ����');
        arr[0] = 0;
        arr[1] = 0;
        return arr;
    } else if (m <= 0 || n <= 0) {
        // console.log('m��n�������0');
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

// �ж�һ�����Ƿ�Ϊ����
function isInteger(obj) {
    return obj % 1 === 0
}




