//查询用户的sql语句
var jwt = require('jsonwebtoken')
const User={
    queryUserTel(userTel) {
        return 'select * from user where tel = '+userTel+'';
    }
,
    queryUserPwd(userTel,userPwd) {
        return 'select * from user where (tel = '+userTel+') and (pwd = "'+userPwd+'")';
    },
    addUser(userTel,userPwd='666666') {
        //默认 密码 为666666
        let secret='bgmmd'
        let token = jwt.sign(userTel,secret)

        return 'insert into user (tel,pwd,token,imgUrl,nickname) values ("'+userTel+'","'+userPwd+'","'+token+'","1.png","'+userTel+'")'
    }
}

module.exports = User