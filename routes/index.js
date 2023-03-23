var express=require('express');
var router=express.Router();
var connection=require("../db/mysql.js")
var queryUser=require("../db/user.js")
var jwt=require('jsonwebtoken')
const tencentcloud=require("tencentcloud-sdk-nodejs");
const { response }=require('express');

const cors = require('cors') //解决跨域请求问题
router.use(cors())
router.use(express.urlencoded({ extended: true }))
 

const alipaySdk=require('../db/aipay.js');
const AlipayFormData = require('alipay-sdk/lib/form').default;
//对接支付宝沙箱接口
router.post("/api/toaliPay", (req, res, next) => {
  let price=req.body.price
  let gname=req.body.name
  let order_num=req.body.order_num
 console.log(price,gname,order_num);
    //开始对接支付宝API
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
    //支付时信息
    formData.addField('bizContent', {
      outTradeNo: order_num,//订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',//写死的
      totalAmount: price,//价格
      subject: gname,//商品名称
    });
    //支付成功或者失败跳转的链接
    formData.addField('returnUrl', 'http://localhost:8080/payment');
    //返回promise
    const result = alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
    //对接支付宝成功，支付宝方返回的数据
    result.then(resp=>{
        res.send({
            data:{
                code:200,
                success:true,
                msg:'支付中',
                paymentUrl : resp
            }
        })
    })
})



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//查询 接口

router.get('/api/tea_shop/goodList', (req, res, next) => {
  // console.log(req.query); 测试前端发的请求，根据请求筛选数据

  console.log(req.query);
  let [searchName, orderName]=Object.keys(req.query) //oderName字段名
  let [name, order]=Object.values(req.query) //name：查询的信息  ，order:asc||desc
  console.log(name, orderName, order);
  if (!orderName&&!order) {
    orderName='id'
    order='asc'
  }

  connection.query(`select * from goodlist where  name  like '%${name}%' order by ${orderName} ${order}`, (error, results) => {
    res.send({
      code: 0,
      data: results
    })
  })
})

// router.get('/api/test', (req, res, next) => {
//   res.send(
//     {
//       code: 0,
//       msg: 'test'
//     }
//   )
// })

//recommend

router.get("/api/index_list/0/data/1", (req, res, next) => {
  res.send(
    {
      code: 0,
      data: {
        //顶部toBar数据
        topBar: [
          {
            name: "1",
            title: "推荐",
            id: 0,
          },
          {
            name: "2",
            title: "金骏眉",
            id: 1,
          },
          {
            name: "3",
            title: "大红袍",
            id: 2,
          },
          {
            name: "3",
            title: "铁观音",
            id: 3,
          },
          {
            name: "4",
            title: "绿茶",
            id: 4,
          },
          {
            name: "6",
            title: "紫砂壶",
            id: 5,
          },
          {
            name: "7",
            title: "谭平水仙",
            id: 6,
          },
          {
            name: "8",
            title: "普洱",
            id: 7,
          },
          {
            name: "9",
            title: "正山小种",
            id: 8,
          },
          {
            name: "10",
            title: "茉莉花茶",
            id: 9,
          },
          {
            name: "11",
            title: "建盏",
            id: 10,
          },
          {
            name: "12",
            title: "大师壶",
            id: 11,
          },
          {
            name: "13",
            title: "茶具",
            id: 12,
          },
        ],

        //icons data
        data: [
          {
            //swiper
            id: 0,
            type: "swiperList",
            data: [
              {
                url: "/images/swiper1.jpeg",
              },
              {
                url: "/images/swiper2.jpeg",
              },
              {
                url: "/images/swiper3.jpeg",
              },
            ]
          },
          {
            //icons
            id: 1,
            type: "iconsList",
            data: [
              {
                title: "自饮茶",
                url: "./images/icons1.png",
              },
              {
                title: "品牌茶",
                url: "./images/icons2.png",
              },
              {
                title: "茶具",
                url: "./images/icons3.png",
              },
              {
                title: "领福利",
                url: "./images/icons4.png",
              },
              {
                title: "官方验证",
                url: "./images/icons5.png",
              },
            ]
          },
          {
            //recommend
            id: 2,
            type: "recommendList",
            data: [
              {
                id: 1,
                name: "龙井1號铁罐250g",
                content: "鲜爽甘醇 口粮首选",
                price: "68",
                imgUrl: "./images/recommend.jpeg",
              },
              {
                id: 2,
                name: "正山小种3號150g",
                content: "难以忘怀的桂花香",
                price: "99",
                imgUrl: "/images/r2.jpeg",
              },
            ]
          },
          {
            //like
            id: 3,
            type: "likeList",
            data: [
              {
                title: "黄山太平猴魁绿茶1号",
                id: 3,
                Url: "/images/lc1.png",
                price: 99,
              },
              {
                title: "绿茶-竹影清风碧螺春",
                id: 4,
                Url: "/images/lc2.png",
                price: 128,
              },
              {
                title: "绿茶-大境枝美白茶",
                id: 5,
                Url: "/images/lc3.png",
                price: 188,
              },
              {
                title: "浅尝-黄观音（武夷岩茶）",
                id: 6,
                Url: "/images/c1.jpeg",
                price: 98,
              },
              {
                title: "金骏眉-红色上茶",
                id: 7,
                Url: "/images/c2.png",
                price: 166,
              },
            ]
          }
        ]
      }
    }
  )
})

//金骏眉
router.get('/api/index_list/1/data/1', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      {

        id: 1,
        type: 'adList',
        data: [
          {
            id: 1,
            imgUrl: './images/jjm1.jpg'
          },
          {
            id: 2,
            imgUrl: './images/jjm2.jpg'
          },
          {
            id: 3,
            imgUrl: './images/jjm3.jpg'
          },
          {
            id: 4,
            imgUrl: './images/jjm4.jpg'
          }
        ]
        ,
      }
    ]
  })
})

//分类页面接口

router.get("/api/list/data", (req, res, next) => {
  res.send(
    {
      code: 0,
      //一级
      data: [
        {
          name: "推荐",


          //二级
          data:
          {
            title: "推荐",

            //三级
            data: [
              {
                name: "紫砂壶",
                imgUrl: "/images/hu1.jpeg"
              },
              {
                name: "铁观音",
                imgUrl: "/images/tgy.jpeg"
              },
              {
                name: "金骏眉",
                imgUrl: "/images/jjm.jpeg"
              },
              {
                name: "武夷岩茶",
                imgUrl: "/images/wy.jpeg"
              },
              {
                name: "龙井",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "云南滇红",
                imgUrl: "/images/yn.jpeg"
              },
              {
                name: "建盏",
                imgUrl: "/images/jz.jpeg"
              },

              {
                name: " 功夫茶具",
                imgUrl: "/images/gf.jpeg"
              },
            ]
          }

        },
        {
          name: "新品",


          //二级
          data:
          {
            title: "新品",
            //三级
            data: [
              {
                name: "五月新品",
                imgUrl: "/images/5.jpeg"
              },
              {
                name: "六月新品",
                imgUrl: "/images/6.png"
              },
              {
                name: "七月新品",
                imgUrl: "/images/7.png"
              }
            ]
          }

        },
        {
          name: "习茶",


          //二级
          data:
          {
            title: "习茶",

            //三级
            data: [
              {
                name: "习茶",
                imgUrl: "/images/xi.jpeg"
              }
            ]
          }

        },
        {
          name: "绿茶",


          //二级
          data:
          {
            title: "绿茶",

            //三级
            data: [
              {
                name: "龙井",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "黄山毛峰",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "碧螺春",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "雀舌",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "太平猴魁",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "珍稀白茶",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "六安瓜片",
                imgUrl: "/images/lj.jpeg"
              },
            ]
          }

        },
        {
          name: "乌龙",


          //二级
          data:
          {
            title: "乌龙",

            //三级
            data: [
              {
                name: "永春佛手",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "铁观音",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "武夷岩茶",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "漳平水仙",
                imgUrl: "/images/lj.jpeg"
              },
            ]
          }

        },

        {
          name: "普洱",


          //二级
          data:
          {
            title: "普洱",

            //三级
            data: [
              {
                name: "生茶",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "熟茶",
                imgUrl: "/images/lj.jpeg"
              }

            ]
          }

        },

        {
          name: "红茶",


          //二级
          data:
          {
            title: "红茶",

            //三级
            data: [
              {
                name: "英德红茶",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "坦洋工夫",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "金骏眉",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "正山小种",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "云南滇红",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "祁门红茶",
                imgUrl: "/images/lj.jpeg"
              }
            ]
          }

        },
        {
          name: "白茶",


          //二级
          data:
          {
            title: "白茶",

            //三级
            data: [
              {
                name: "白牡丹",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "牡丹王",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "白毫银针",
                imgUrl: "/images/lj.jpeg"
              },
              {
                name: "寿眉",
                imgUrl: "/images/lj.jpeg"
              },
            ]
          }

        }
      ]

    }
  )
})


//商品详情页接口

router.get("/api/detail/data", (req, res, next) => {
  res.send(
    {
      code: 0,

      //swiper图片
      swiperdata: [
        { imgUrl: "/images/d1.jpeg" }, { imgUrl: "/images/d2.jpeg" }, { imgUrl: "/images/d3.jpeg" }, { imgUrl: "/images/d4.jpeg" }
      ],

      //详情图片
      detaildata: [
        { imgUrl: "images/x1.jpg" }, { imgUrl: "images/x2.jpg" }, { imgUrl: "images/x3.jpg" }, { imgUrl: "images/x4.jpg" },
      ]

    }
  )
})


//密码登录接口
router.post("/api/login/data", (req, res, next) => {
  const { userTel, userPwd }=req.body

  connection.query(queryUser.queryUserTel(userTel), function (err, results) {
    console.log('查询tel');
    console.log(results);
    if (results.length>0) {
      //手机号存在
      //查询密码
      connection.query(queryUser.queryUserPwd(userTel, userPwd), function (erro, result) {

        if (result.length>0) {
          //密码存在，登录通过
          res.send({
            code: 200,
            data: {
              success: true,
              msg: "登陆成功",
              data: result[0]

            }
          })
        }
        else {
          res.send({
            code: 301,
            data: {
              success: false,
              msg: "密码错误"
            }
          })
        }
      })
    }
    else {
      //手机号不存在 
      res.send({
        code: 302,
        data: {
          success: false,
          msg: "手机号不存在"
        }
      })
    }

  })


})


//发送短信验证码接口,已经在封装成独立模块


//添加用户接口,直接短信验证码登录

router.post("/api/add/data", (req, res, next) => {
  let tel=req.body.userTel

  connection.query(queryUser.queryUserTel(tel), function (erro, results) {

    if (results.length>0) {
      //手机号存在
      res.send({
        code: 200,
        success: true,
        data: {
          msg: "账号已存在，直接登录",
          success: true,
          data: results[0]
        }
      })
    }
    else {
      //添加一条记录
      connection.query(queryUser.addUser(tel), function (erro, results) {
        connection.query(queryUser.queryUserTel(tel), function (err, res) {
          if (res.length>0) {
            res.send({
              code: 201,//直接用短信验证码登录注册的需要更改默认密码

              data: {
                msg: "登录成功,请设置密码",
                success: true,
                data: res[0]
              }
            })
          }
          else {
            //插入数据失败
            res.send({
              code: 202,
              data: {
                msg: "登录注册失败",
                success: false
              }
            })
          }
        })
      })
    }

  })
})


//注册接口
router.post("/api/register/data", function (req, res, next) {
  let tel=req.body.userTel
  let pwd=req.body.userPwd


  connection.query(queryUser.queryUserTel(tel), function (erros, response) {
    if (response.length>0) {
      //如果账号已存在，直接登录不需要注册
      console.log("账号已存在");
      res.send({
        code: 200,
        data: {
          msg: "账号已注册，直接登录",
          success: true,
          data: response[0]
        }

      })
    }

    else {
      //注册

      connection.query(queryUser.addUser(tel, pwd), function (err, results) {

        connection.query(queryUser.queryUserTel(tel), function (erro, result) {
          if (result.length>0) {
            //添加数据成功
            res.send({
              code: 300,
              data: {
                msg: "注册成功",
                success: true,
                data: result[0]
              }
            })
          }
          else {
            res.send({
              err: erro
            })
          }
        })
      })
    }
  })

})

//修改密码接口  
router.post("/api/update/data", function (req, res, next) {
  let tel=req.body.tel
  let newpwd=req.body.newpwd
  //先查询是否存在该号码
  connection.query(queryUser.queryUserTel(tel), function (err, result) {
    if (result.length>0) {
      //账号存在，执行修改密码
      connection.query(`update user set pwd = ${newpwd} where tel = ${tel}`, function (erro, results) {
        res.send({
          code: 203,
          data: {
            success: true,
            msg: "修改成功"
          }
        })
      })


    }
    else {
      //账号不存在,新增数据，并设置密码
      connection.query(queryUser.addUser(tel, newpwd), function (err, result) {
        connection.query(queryUser.queryUserTel(tel), function (erro, results) {
          if (results.length>0) {
            //添加成功
            res.send({
              code: 204,
              data: {
                success: true,
                msg: "设置密码成功"
              }
            })
          }
          else {
            res.send({
              code: 205,
              data: {
                success: false,
                msg: "添加用户失败"
              }
            })
          }
        })
      })

    }
  })
})


//detail页面查询recommend表接口
router.post("/api/detail/recommend", function (req, res, next) {
  let goodsId=req.body.id
  // console.log(`select * from recommend where id = ${goodsId}`);
  connection.query(`select * from recommend where id = ${goodsId}`, function (erro, result) {

    if (result.length>0) {
      res.send({
        data: result[0]
      })
    }
  })

})


//加入购物车接口
router.post("/api/addCar", (req, res, next) => {
  let tel=jwt.decode(req.body.usertoken)
  let goodsId=req.body.goodsId



  //查询tel，找到其uId
  connection.query(`select * from user where tel = ${tel}`, function (erro, result) {
    let uId=result[0].id

    connection.query(`select * from recommend where id = ${goodsId}`, function (erro, results) {
      let goodsName=results[0].name
      let goodsPrice=results[0].price
      let goodsImgUrl=results[0].imgUrl

      // 向goodscar表中插入数据

      //先查询goodscar表中是否有该goodsId的商品，
      connection.query(`select * from goods_car where goodsId = ${goodsId} and uId = ${uId}`, (e, r) => {
        if (r.length>0) {
          //有该商品 ，就不添加，将goodscount++
          let count=r[0].goodscount+1

          // 更新goodscount字段
          connection.query(`update goods_car set goodscount = ${count} where goodsId = ${goodsId}`, (erros, response) => {

          })
        }

        else {
          //没有商品，在表中插入商品
          connection.query(`insert into goods_car (uId,goodsId,goodsName,goodsPrice,goodsImgUrl,goodscount) values (${uId},"${goodsId}","${goodsName}","${goodsPrice}","${goodsImgUrl}","1")`, (ee, rr) => {
            res.send({
              data: {
                success: true,
                msg: '添加购物车成功'
              }
            })
          })
        }
      })

    })







  })
})


//购物车页面goodScar请求接口
router.post("/api/goods_car", (req, res, next) => {
  let tel=jwt.decode(req.body.usertoken)

  connection.query(queryUser.queryUserTel(tel), (erro, result) => {
    let uId=result[0].id

    connection.query(`select * from goods_car where uId = ${uId}`, (err, results) => {

      res.send({
        code: 208,
        data: results
      })
    })
  })
})

//购物车商品数量加减修改接口
router.post("/api/update_count", (req, res, next) => {
  let id=req.body.id
  let newCount=req.body.newCount

  //更新 recommend表中goodscount的值

  connection.query(`update goods_car set goodscount = ${newCount} where id = ${id}`, (erro, result) => {
    res.send({
      data: {
        msg: "修改成功"
      }
    })
  })
})


//购物车商品删除接口
router.post("/api/delete_goods", (req, res, next) => {
  let id=req.body.id



  //删除数据
  connection.query(`delete from goods_car where id = ${id}`, (erros, result) => {
    res.send({
      data: {
        msg: "删除成功"
      }
    })
  })

})

//删除选择的商品接口

router.post("/api/delete_all", (req, res, next) => {
  let IdArray=req.body.Ids

  let Idstr=IdArray.join(',')


  connection.query(`delete from goods_car where id in (${Idstr})`, (erro, result) => {
    res.send({
      data: {
        msg: "删除成功"
      }
    })
  })

})

//用户添加地址接口
router.post("/api/add_path", (req, res, next) => {
  let token=req.body.userToken
  let isSelected=req.body.isSelected
  let usertel=jwt.decode(token)
  let { areaCode, tel, name, province, city, county, addressDetail }=req.body.pathInfo

  connection.query(queryUser.queryUserTel(usertel), (e, r) => {
    let uId=r[0].id
    //先检查表是否为空，为空直接插入，不需要进行排他性操作
    connection.query(`select * from user_path where uID = ${uId}`, (err, re) => {
      if (re.length>0) {
        //表中有该用户，需要先进行排他性操作，再插入新地址
        if (isSelected==1) {
          //此次操作是选中默认 ，需要将其他的清0，再插入
          connection.query(`update user_path set isDefault = ${0}`, (erros, response) => {
            //插入
            connection.query(`insert into user_path (uID,areaCode,tel,name,province,city,county,addressDetail,isDefault) values (${uId},"${areaCode}","${tel}","${name}","${province}","${city}","${county}","${addressDetail}",${isSelected})`, (erro, result) => {
              res.send({
                code: 200,
                data: {
                  success: true,
                  msg: "添加地址成功"
                }
              })
            })
          })
        }
        else {
          //此次操作是未选中，直接插入
          connection.query(`insert into user_path (uID,areaCode,tel,name,province,city,county,addressDetail,isDefault) values (${uId},"${areaCode}","${tel}","${name}","${province}","${city}","${county}","${addressDetail}",${isSelected})`, (erro, result) => {
            res.send({
              code: 200,
              data: {
                success: true,
                msg: "添加地址成功"
              }
            })
          })
        }
      }
      else {
        //表中没有该用户，直接插入
        connection.query(`insert into user_path (uID,areaCode,tel,name,province,city,county,addressDetail,isDefault) values (${uId},"${areaCode}","${tel}","${name}","${province}","${city}","${county}","${addressDetail}",1)`, (erro, result) => {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: "添加地址成功"
            }
          })
        })
      }
    })

  })
})

//地址首页展示数据接口

router.post("/api/init_path", (req, res, next) => {
  let token=req.body.userToken
  let usertel=jwt.decode(token)

  connection.query(queryUser.queryUserTel(usertel), (e, r) => {
    let uId=r[0].id
    connection.query(`select * from user_path where uID = ${uId}`, (erro, result) => {
      if (result.length>0) {
        res.send({
          code: 200,
          data: {
            success: true,
            msg: "查询成功",
            data: result
          }
        })
      }
      else {
        //用户已经登录了，但是userpath表中用户不存在，还没有添加地址
        res.send({
          code: 300,
          data: {
            success: false,
            msg: "用户还未添加地址 "
          }
        })
      }
    })
  })
})

//修改地址接口
router.post("/api/update_path", (req, res, next) => {
  let { areaCode, tel, name, province, city, county, addressDetail }=req.body.newPath
  let pathId=req.body.pathId
  let isSelected=req.body.isSelected

  connection.query(`update user_path set areaCode = "${areaCode}",tel = "${tel}",name = "${name}",province = "${province}",city = "${city}",county ="${county}",addressDetail = "${addressDetail}",isDefault = ${isSelected} where id = ${pathId}`, (err, result) => {
    res.send({
      code: 201,
      data: {
        success: true,
        msg: "更新成功"

      }
    })
  })
})

//默认按钮排他性
router.post("/api/isDefault", (req, res, next) => {
  let pathId=req.body.pathId

  connection.query(`update user_path set isDefault = ${0}`, (e, r) => {
    //先将所有清0

    connection.query(`update user_path set isDefault = ${1} where id = ${pathId}`, (erro, result) => {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: "修改成功"
        }
      })
    })
  })
})

//删除地址接口
router.post("/api/delete_path", (req, res, next) => {
  let pathId=req.body.pathId

  connection.query(`delete from user_path where id = ${pathId}`, (erro, result) => {
    res.send({
      code: 300,
      data: {
        msg: "删除成功",
        success:true
      }
    })
  })
})

//order页数据渲染
router.post("/api/order_index", (req, res, next) => {

 
  let idsStr=req.body.ids
  console.log(idsStr);
  connection.query(`select * from goods_car where id in (${idsStr})`, (erro, result) => {
    res.send({
      code: 200,
      success: true,
      data:{
      msg: "查询成功",
        data:result
      }
    })
  })
})

//生成订单接口
router.post("/api/inser_order", (req, res, next) => {
  let tel=jwt.decode(req.body.userToken)
  let orderNum=generateOrder()
  let count=req.body.count
  let price=req.body.price
   let data = req.body.goodsInfo
  let gName=''
  data.forEach(element => {
    gName+=element.goodsName + ','
  });


  function generateOrder() {
    let date=new Date()
    let year=date.getFullYear()
    let month=timeFmt(date.getMonth()+1)
    let day=timeFmt(date.getDate())
    let hour=timeFmt(date.getHours())
    let minutes=timeFmt(date.getMinutes())
    let seconds=timeFmt(date.getSeconds())
    
    return year.toString() + month.toString() + day.toString() + hour.toString() + minutes.toString() + seconds.toString()+ Math.round(Math.random()*1000000)
  }
  function timeFmt(s) {
    return s<10? '0'+s :s
  }

  connection.query(`select * from user where tel = ${tel}`, (e, r) => {
    let uid=r[0].id

    
    connection.query(`insert into order_goods (order_id,uid,goodsName,goodsCount,goodsPrice,orderStatus) values ("${orderNum}",${uid},"${gName}",${count},${price},${1})`, (err, result) => {
      res.send({
        code: 200,
        data: {
          success: true,
          msg: "插入成功",
          data:orderNum //返回前端订单号
        }
      })
    })
    
  })
})

//渲染默认地址 

router.post("/api/defaut_path", (req, res, next) => {
  let tel=jwt.decode(req.body.userToken)
  
  connection.query(`select * from user where tel = ${tel}`, (e, r) => {
    let uid=r[0].id
    
    connection.query(`select * from user_path where uID = ${uid} and isDefault = 1`, (erro, result) => {
      if (result.length>0) {
        res.send({
          code: 200,
          success: true,
          data: {
            msg: "成功",
            data:result[0]
          }
        })
      }
      else {
        res.send({
          code: 300,
          success: false,
          data: {
            msg:"还没有添加地址"
          }
        })
      }
    })
  })
})

//提交订单接口
router.post("/api/submit_order", (req, res, next) => {
  let tel=jwt.decode(req.body.userToken)
  let gIds=req.body.goodsid
  let order_id=req.body.order_num
 
  //将order表 status改为2 待支付状态  删除goodscar中对于的id
  connection.query(queryUser.queryUserTel(tel), (e, r) => {
    let uid=r[0].id
    connection.query(`select * from order_goods where uid = ${uid} and order_id = "${order_id}"`, (erro, result) => {
     //拿到上面查询这条记录的id
      let oid=result[0].id
      connection.query(`update order_goods set orderStatus = 2 where id = ${oid}`, (erros, response) => {
        //修改状态为待支付 ,删除购物车表中相应数据

        connection.query(`delete from goods_car where id in (${gIds})`, (erros, results) => {
          res.send({
            code: 200,
            success: true,
            data: {
              msg:"购物车中商品已经删除，进入待支付"
            }
          })
        })
      })
    })
 })
})


module.exports=router;
