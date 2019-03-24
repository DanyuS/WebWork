var gm = require("gm");
var spawn = require('child_process').spawn; //提供生成node子进程的方法

var config = {};
config.position = {
    NorthWest:"NorthWest",
    North:"North",
    NorthEast:"NorthEast",
    West:"West",
    Center:"Center",
    East:"East",
    South:"South",
    SouthWest:"SouthWest",
    SouthEast:"SouthEast"
};

/**
 * 裁剪图片
 * @param srcImg    待裁剪的图片路径
 * @param width     宽度
 * @param height    高度
 * @param x         x坐标
 * @param y         y坐标
 */
function cropCurrentImg(srcImg,width, height, x, y) {
    gm(srcImg).crop(width, height, x, y).write(srcImg, function (err) {
        if (err) {
            return handler(err);
        }
    });
}

/**
 * 裁剪图片
 * @param srcImg    待裁剪的图片路径
 * @param destImg   裁剪后的图片路径
 * @param width     宽度
 * @param height    高度
 * @param x         x坐标
 * @param y         y坐标
 */
function cropImg(srcImg,destImg,width, height, x, y) {
    gm(srcImg).crop(width, height, x, y).write(destImg, function (err) {
        if (err) {
            return handler(err);
        }
    });
}

cropCurrentImg("../../public/aa.png","../../public/dest.jpg",100,100,50,50);

/**
 * 缩放图片
 * @param srcImg    待缩放的图片路径
 * @param size      缩放后的图片大小(长宽均为size)
 */
function resizeCurrentImg(srcImg, size) {
    gm(srcImg).resize(size, size).write(srcImg, function (err) {
        if (err) {
            return handler(err);
        }
    });
}

/**
 * 缩放图片，默认输出图片质量75%，格式PNG
 * @param srcImg    待缩放的图片路径
 * @param destImg   缩放后的图片输出路径
 * @param size      缩放后的图片大小(长宽均为size)
 */
function resizeImgWithArgs(srcImg, destImg, size) {
    gm(srcImg).resize(size, size).write(destImg, function (err) {
        if (err) {
            return handler(err);
        }
    });
}

/**
 * 缩放图片
 * @param srcImg    待缩放的图片路径
 * @param destImg   缩放后的图片输出路径
 * @param quality   缩放的图片质量，0~100(质量最优)
 * @param width     缩放后的图片宽度
 * @param height    缩放后的图片高度
 * @param imgFormat 缩放后的图片格式
 */
function resizeImgWithFullArgs(srcImg, destImg, quality, width, height, imgFormat) {
    gm(srcImg).resize(width, height).quality(quality).setFormat(imgFormat).write(destImg, function (err) {
        if (err) {
            return handler(err);
        }
    });
}

/**
 * 添加水印
 * @param srcImg    待添加水印的图片路径
 * @param watermarkImg  水印图片路径
 * @param destImg   添加水印后图片输出路径
 * @param alpha     透明度，0~100(为0表示全透明，100不透明)
 * @param position  水印位置，NorthWest, North, NorthEast, West, Center,East, SouthWest, South, or SouthEast
 */
function addWaterMark(srcImg,watermarkImg,destImg,alpha,position){
    var composite = spawn('gm', ['composite', '-gravity', position, '-dissolve', alpha, watermarkImg, srcImg,destImg]);
    composite.on('exit', function (code) {

    });
}

exports.config = config;
exports.resizeCurrentImg = resizeCurrentImg;
exports.resizeImgWithArgs = resizeImgWithArgs;
exports.resizeImgWithFullArgs = resizeImgWithFullArgs;
exports.cropCurrentImg = cropCurrentImg;
exports.cropImg = cropImg;
exports.addWaterMark = addWaterMark;