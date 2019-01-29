export default {

  //设置mongodb相关配置
  dbs: 'mongodb://127.0.0.1:27017/student',

  //设置redis相关配置
  redis: {
    get host(){
      return '127.0.0.1'
    },
    get port(){
      return 6379
    }
  }, 

  //设置smtp相关配置
  smtp: {
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      return '******'    //邮箱账号
    },
    get pass(){
      return '******'    //smtp服务密码
    },
    get code(){
      return () => {
        return Math.random().toString(16).slice(2,6).toUpperCase();
      }
    },
    get expire(){
      return () => {
        return new Date().getTime() + 60*1000;
      }
    }
  }
}
