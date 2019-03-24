var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
//var uld = require('./public/javascripts/uld');///????
var http = require('http');
var util = require('util');
var url = require('url');

var ejs = require('ejs');

//引入关于post提交数据的
var bodyParser = require("body-parser");


var md5=require('md5-node');


//  需要添加的
var session=require('express-session');

var app = express();


//配置模板的文件路径`12.3
app.set("views",__dirname+"/views");
//配置模板引擎
app.set("view engine","ejs");
//设置静态文件的加载(js,css,img)
app.use(express.static(__dirname+"/public"));
//设置用来接收json格式的数据
app.use(bodyParser.json());
//设置接收任何数据类型
app.use(bodyParser.urlencoded({extended:true}));





var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/images/')
    },
    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
        cb(null, Date.now()+'.'+str[1]);
    }
})
var upload = multer({ storage: storage });
app.post("/upload",upload.array("file",20),function(req,res,next){

    var arr = [];
    for(var i in req.files){

        arr.push(req.files[i].path);
    }
    res.json({
        code:200,
        data:arr
    })
});



//需要修改的
app.use(cookieParser("An"));
//需要添加的
app.use(session({
    secret:'an',
    resave:false,
    saveUninitialized:true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//需要修改的
app.use(cookieParser("An"));
//需要添加的
app.use(session({
    secret:'an',

    //
    cookie: {
        // domain: 'xxx.xxx.xxx.xxx:xxxx', // 域名
        //path: '路径'
        httpOnly: true, // 开启后前端无法通过 JS 操作
        maxAge: 1800000 // 这一条 是控制 sessionID 的过期时间的！！！
    },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期

    resave:false,
    saveUninitialized:true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(8100,function(){
    console.log("Server Start!");
});
/*app.get("/buttonClicked",function(req,res){
    console.log(req.query.value); //get param

    client = usr.connect();
    var l="";
    console.log("llllllllllllllll"+l);
    usr.findPictureLabel(client, req.params.id, function (result) {
        //console.log(req.params.id);
        if(result[0]===undefined){
            l="暂时还没有人来添加标签哟";
            console.log(l);
        }else{
            l="";
            for(var i=0;i<result.length;i++){
                l=l+" "+result[i].label;
            }

            console.log(l);
        }

    });
    console.log("rrrrrrrrrrrrrrrr"+l);


    var data =l
    res.send(data);
    res.end();

})*/


//session hijacking
/*createtime:=sess.Get("createtime");
if(createtime == nil){
    sess.Set("createtime", time.Now().Unix())
} else if (createtime.(int64) + 60) < (time.Now().Unix())
{
    globalSessions.SessionDestroy(w, r)
    sess = globalSessions.SessionStart(w, r)
}*/

//使用客户端脚本来设置Cookie到浏览器,防御方式可以是设置HttpOnly属性
//将cookie中httponly属性设置为true,,,利用HttpResponse的addHeader方法，设置Set-Cookie的值
//但有少数低版本浏览器存在漏洞，即使设置了HttpOnly，也可以重写Cookie。所以还需要加其他方式的校验
//网站a.com只要对用户的评论信息做转义就可以有效的防止XSS注入.这不属于SESSION安全的范畴,但是的确可以通过这种方法保护SessionID.
//最主要的是开启session.cookie_httponly,杜绝使用JavaScript读取cookie.但是这个设置有个前提,就是用户使用高质量的浏览器,因为这个
// 设置只能起到通知浏览器的作用,具体逻辑是由浏览器实现的.
app.use(function(req, res, next) {
    res.addHeader("Set-Cookie", "uid=112; Path=/; Secure; HttpOnly");
});



module.exports = app;
