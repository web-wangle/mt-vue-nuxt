import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({
  prefix: '/users'
})

let Store = new Redis().client

router.post('./signup', async(ctx) => {    //注册接口路由
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;    //ES6解构赋值

  if(code){
    const saveCode = await Store.hget(`nodemail:${username}`,'code');
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire');

    if(code === saveCode){
      if(new Date().getTime() - saveExpire > 0){
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新获取'
        }
        return false;
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '验证码错误'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  let user = await User.find({
    username
  })
  if(user.length){
    ctx.body = {
      code: -1,
      msg: '该用户名已被注册'
    }
    return;
  }

  let nuser = await User.create({
    username,
    password,
    email
  });
  if(nuser){
    let res = await axios.post('/users/signin',{
      username,
      password
    })
    if(res.data && res.data.code === 0){
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '错误'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '注册失败，请重试'
    }
  }
})

router.post('/signin', async(ctx,next) => {    //登录接口
  return Passport.authenticate('local', function(err,user,info,status){
    if(err){
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if(user){
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      }else{
        ctx.body = {
          code: 1,
          mdg: info
        }
      }
    }
  })(ctx,next)
})

router.post('/verify', async(ctx,next) => {
  let username = ctx.request.body.username;
  const saveExpire = await Store.hget(`nodemail:${username}`,'expire');
  if(saveExpire && new Date().getTime() - saveExpire < 0){
    ctx.body = {
      code: -1,
      msg: '请求频繁，请稍后再试'
    }
    return false;
  }
  let transporter = nodeMailer.createTransport({    //smtp服务发送邮件
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `“认证邮件” <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《高仿美团全栈实战》注册码',
    html: `您在《高仿美团全栈实战》中注册，您的邀请码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error,info) => {
    if(error){
      return console.log(`验证邮件发送失败：${error}`);
    }else{
      Store.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email);
      Store.expire(`nodemail:${ko.user}`, 60);
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送到您的邮箱，一分钟内有效'
  }
})

router.get('/exit', async(ctx,next) => {    //退出接口
  await ctx.logout();
  if(!ctx.isAuthtnticated()){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async(ctx) => {    //获取用户信息
  if(ctx.isAuthtnticated()){
    const {username, email} = ctx.session.passport.user;
    ctx.body = {
      user: username,
      email
    }
  }else{
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
