var express = require('express');
var router = express.Router();
var usr=require('dao/dbConnect');

var md5=require('md5-node');

/* GET home page. */
router.get('/', function(req, res) {
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
if(req.session.islogin){
    res.locals.islogin=req.session.islogin;
}
  res.render('index', { title: 'HOME',test:res.locals.islogin});
});


router.route('/login')
    .get(function(req, res) {
        if(req.session.islogin){
            res.locals.islogin=req.session.islogin;
        }

        if(req.cookies.islogin){
            req.session.islogin=req.cookies.islogin;
        }
        res.render('login', { title: '用户登录' ,test:res.locals.islogin});
    })
    .post(function(req, res) {
        client=usr.connect();
        result=null;
        usr.selectFun(client,req.body.username, function (result) {
            if(result[0]===undefined){
                res.send('没有该用户');
            }else{
                if(result[0].password===md5(req.body.password)){
                    req.session.islogin=req.body.username;
                    res.locals.islogin=req.session.islogin;
                    res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                    res.redirect('/pictureIntro');
                    //
                    /*h= md5.New();
                    salt="astaxie%^7&8888";
                    io.WriteString(h,salt+time.Now().String());
                    token=fmt.Sprintf("%x",h.Sum(nil))
                    if(r.Form["token"]!=token){
                        //提示登录
                    }
                    sess.Set("token",token)*/
                    //
                }else
                {
                    res.redirect('/login');
                }
               }
        });
    });

router.get('/logout', function(req, res) {
    res.clearCookie('islogin');
    req.session.destroy();
    res.redirect('/');
});

router.get('/home', function(req, res) {
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('home', { title: 'Home', user: res.locals.islogin });
});
//注册
router.route('/reg')
    .get(function(req,res){
        res.render('reg',{title:'注册'});
    })
    .post(function(req,res) {
        client = usr.connect();

        usr.insertFun(client,req.body.username ,md5(req.body.password2), function (err) {
              if(err) throw err;
              res.redirect('/');
              //res.send('注册成功');
        });
    });


router.get('/pictureIntro', function(req, res) {
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('pictureIntro', { title: 'PictureIntroduction', user: res.locals.islogin });
});

router.get('/editPicture/:id', function(req, res) {

    var id = req.params.id;
    res.locals.id = id;
    res.status(500).render("editPicture.ejs");
    //res.render('editPicture', { title: 'editPicture', user: res.locals.islogin });
});
//添加编辑访问量
router.post("/editPicture/:id",function(req,res){
    client = usr.connect();

    var result1=null;
    var pv=0;
    usr.searchPicture(client, req.params.id, function (result1) {
        //console.log("vvvvvvvvvvvvvvv"+req.params.id);
        if(result1[0]===undefined){
            //res.send('没有该用户');
            console.log("没有图片");
        }else{
            console.log("mysql pid:"+result1[0].pictureAddr);
            console.log("mysql pageview:"+result1[0].pageview);
            if(result1[0].pictureAddr=req.params.id){
                pv=result1[0].pageview;
                //console.log("浏览次数："+pv);
                pv=pv+1;
                //console.log("然后浏览次数："+pv);
                usr.modifyView(client,req.params.id,pv, function (err) {
                    if(err) throw err;
                     res.redirect('/pictureIntro');
                });
            }
        }
    });

})


router.get('/addItem/:id', function(req, res) {

    var id = req.params.id;
    res.locals.id = id;
    res.status(500).render("addItem.ejs");
    //res.render('addItem', { title: 'addItem', user: res.locals.islogin });
});
//添加加图片访问量
router.post("/addItem/:id",function(req,res){
    client = usr.connect();

    var result1=null;
    var pv=0;
    usr.searchPicture(client, req.params.id, function (result1) {
        //console.log("vvvvvvvvvvvvvvv"+req.params.id);
        if(result1[0]===undefined){
            console.log("没有图片");
        }else{
            console.log("mysql pid:"+result1[0].pictureAddr);
            console.log("mysql pageview:"+result1[0].pageview);
            if(result1[0].pictureAddr=req.params.id){
                pv=result1[0].pageview;
                pv=pv+1;
                usr.modifyView(client,req.params.id,pv, function (err) {
                    if(err) throw err;
                    res.redirect('/pictureIntro');
                });
            }
        }
    });

})

router.route('/upload')
    .get(function(req,res){
        console.log("-----------------------upload");
        res.render('upload',{title:'upload'});
    })

/*router.post('/buttonClicked', function(req, res) {
    console.log("-----------------------uploada");
    res.send(data); // 此处发送的data, 即为前端中callback里将会得到的data, 如不需要则可以省略这一行
    // 这里开始写你需要的东西
    res.end();// 如果不执行end(), 那么前端网页则会一直等待response
});*/


router.post("/upload",function(req,res) {
    //res.redirect('/pictureIntro');
    console.log("-----------------------uploada"+req.body.id||'');
    client = usr.connect();
    //result=null;
    var myDate = new Date();
    /*myDate.getYear();        //获取当前年份(2位)
    myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    myDate.getDate();        //获取当前日(1-31)
    myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
    myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours();       //获取当前小时数(0-23)
    myDate.getMinutes();     //获取当前分钟数(0-59)
    myDate.getSeconds();     //获取当前秒数(0-59)
    myDate.getMilliseconds();    //获取当前毫秒数(0-999)
    myDate.toLocaleDateString();     //获取当前日期*/
    var mytime=myDate.toLocaleTimeString();     //获取当前时间
    console.log("-----------------------uploadb");
    console.log("Current Time is"+mytime);
    myDate.toLocaleString( );        //获取日期与时间
    usr.addPicture(client,req.params.id,mytime, function (err) {
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb"+obj.id);
        if(err) throw err;
        //console.log("haishiwo");
        res.render('upload',{title:'upload'});
    });

});


//添加标签
router.get("/addLabel/:id",function(req,res){
    var id = req.params.id;
    res.locals.id = id;
    res.status(500).render("addLabel.ejs");
})

router.post("/addLabel/:id",function(req,res){
    client = usr.connect();

    result=null;
    numb=0;


    /*var l=req.params.l;
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
            res.render(l);
            //console.log(labels);
        }

    });
    console.log("rrrrrrrrrrrrrrrr"+l);
    res.locals.l = l;*/


    usr.findPictureLabelNum(client, req.params.id, req.body.labels, function (result) {
        //console.log(req.params.id);
        //console.log(req.body.labels);
        if(result[0]===undefined){
            //res.send('没有该用户');
            console.log("第一次添加标签");
            numb=1;
            usr.insertLabel(client,req.params.id,req.body.labels,numb, function (err) {
                //console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb"+req.params.id+"             "+req.body.labels);
                if(err) throw err;
                //console.log("haishiwo");
                res.redirect('/pictureIntro');
            });

        }else{
            console.log("mysql pid:"+result[0].pid);
            console.log("mysql labels:"+result[0].label);
            console.log("mysql labelNum:"+result[0].labelNum);
            if(result[0].pid!=req.params.id || result[0].label!=req.body.labels){//不全相同
                numb=1;
                usr.insertLabel(client,req.params.id,req.body.labels,numb, function (err) {
                    if(err) throw err;
                    res.redirect('/pictureIntro');
                });

            }else{
                numb=result[0].labelNum;
                console.log("标签数量："+numb);
                numb=numb+1;
                console.log("然后标签数量："+numb);
                usr.modifyLabel(client,req.params.id,req.body.labels,numb, function (err) {
                    if(err) throw err;
                    res.redirect('/pictureIntro');
                });
            }
        }
    });

    //添加标签量
    var result1=null;
    var pv=0;
    var ln=0;
    usr.searchPicture(client, req.params.id, function (result1) {
        if(result1[0]===undefined){
            console.log("没有图片");
        }else{
            if(result1[0].pictureAddr=req.params.id){
                pv=result1[0].pageview;
                pv=pv+1;
                usr.modifyView(client,req.params.id,pv, function (err) {
                    if(err) throw err;
                });
                //图片标签总数量添加
                ln=result1[0].labelnumber;
                ln=ln+1;
                usr.modifylabelNum(client,req.params.id,ln, function (err) {
                    if(err) throw err;
                    // res.redirect('/pictureIntro');
                });
            }
        }
    });

})

/*<ul class="data-list">
    <%for(var i=0;i<data.length;i++){ %>
    <li>
        <span><%= data[i].label %></span>
        <span><%= data[i].labelNum %></span>
    </li>
    <% } %>
</ul>*/
var mysql=require('mysql');
var connection=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'123456',
    database:'node'
})
connection.connect();
var sql='select * from pictureinfo';
connection.query(sql,function(err,result){
    if(err){
        console.log('[query]-:'+err);
    }else{
        router.get('/',function(req,res, next){
            res.type('ejs');
            res.render('more',{

                data:result
            });
        });
    }
})
connection.end();
/*router.get("/addLabel/:id",function(req,res,next) {
    console.log("------------------------alllllllll");
    client = usr.connect();

    result = null;
    numb = 0;
    var l = req.params.l;
    console.log("llllllllllllllll" + l);
    usr.findPictureLabel(client, req.params.id, function (result) {
        //console.log(req.params.id);
        if (result[0] === undefined) {
            l = "暂时还没有人来添加标签哟";
            console.log(l);
        } else {
            l = "";
            //for (var i = 0; i < result.length; i++) {
            //    l = l + " " + result[i].label;
            //}
            res.render('',{
                data:result
            });
        }

    });
    /*res.render('',{
        data:result
    });
});*/

    router.get('/more', function (req, res) {
        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }
        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }
        res.render('more', {title: 'more', user: res.locals.islogin});
    });

    router.get('/picview', function (req, res) {
        if(req.session.islogin){
            res.locals.islogin=req.session.islogin;
        }
        if(req.cookies.islogin){
            req.session.islogin=req.cookies.islogin;
        }
        res.render('picview', { title: 'picview', user: res.locals.islogin });
    });
    router.get('/labeladd', function (req, res) {
        if(req.session.islogin){
            res.locals.islogin=req.session.islogin;
        }
        if(req.cookies.islogin){
            req.session.islogin=req.cookies.islogin;
        }
        res.render('labeladd', { title: 'labeladd', user: res.locals.islogin });

    });
    router.get('/picaddtime', function (req, res) {
        if(req.session.islogin){
            res.locals.islogin=req.session.islogin;
        }
        if(req.cookies.islogin){
            req.session.islogin=req.cookies.islogin;
        }
        res.render('picaddtime', { title: 'picaddtime', user: res.locals.islogin });

    });
router.get('/searchLabel', function (req, res) {
    if(req.session.islogin){
        res.locals.islogin=req.session.islogin;
    }
    if(req.cookies.islogin){
        req.session.islogin=req.cookies.islogin;
    }
    res.render('searchLabel', { title: 'searchLabel', user: res.locals.islogin });

});
//添加地图百度api
    router.get('/lbs', function (req, res) {
        if (req.session.islogin) {
            res.locals.islogin = req.session.islogin;
        }
        if (req.cookies.islogin) {
            req.session.islogin = req.cookies.islogin;
        }
        res.render('lbs', {title: 'lbs', user: res.locals.islogin});
    });
    /*router.route('/addLabel')
        .get(function(req,res){
            //console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
            res.render('addLabel',{title:'addLabel'});
        })

        //查看有无改标签，有则加一，无则添加置为一
        .post(function(req,res) {
            client = usr.connect();

            result=null;
            numb=0;

            /*usr.findPictureLabelNum(client, req.body.id, req.body.labels, function (result) {
                console.log(req.body.id);
                console.log(req.body.labels);
                if(result[0]===undefined){
                    //res.send('没有该用户');
                }else{
                    if(result[0].pid===req.body.id&&result[0].labels===req.body.labels){
                        numb=result[0].labelNum;
                        console.log("标签数量："+numb);
                        //req.session.islogin=req.body.username;
                        //res.locals.islogin=req.session.islogin;
                       // res.cookie('islogin',res.locals.islogin,{maxAge:60000});

                    }else
                    {
                       // res.redirect('/login');
                    }
                }
            });


            usr.insertLabel(client,req.body.labels,req.body.labels, function (err) {
                console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb"+req.body.labels+"             "+req.body.labels);
                if(err) throw err;
                //console.log("haishiwo");
                res.redirect('/pictureIntro');
            });
        });*/

/*/*<% if (data.length) { %>
<ul>
    <%data.forEach(function(data){ %>
    <li>
        <div class="bm"><a href="/editPicture/<%=data.pictureAddr%>"><img src="/images/<%=data.pictureAddr%>" style="max-width: 100%;"/></a></div>
    </li>
    <% }) %>
</ul>
<% } %>*/

module.exports = router;

