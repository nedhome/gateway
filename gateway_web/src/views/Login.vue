<template>
  <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="loginForm.username" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <br><br><br>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="login" >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      login () {

        showLoading()
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            const that = this
            // sessionStorage.setItem('userSn', 1)
            // sessionStorage.setItem('token', 1)
            // sessionStorage.setItem('userName', 1)
            // that.$router.push({path: '/record/chart'})
            closeLoading()
            $.ajax({
              type:"POST",
              async: true,
              crossDomain: true,
              url: "/gateway/login/login",
              dataType:"json",
              headers: {},
              data: that.loginForm,
              success: function(response){
                if (0 == response.code){
                  sessionStorage.setItem('userId', response.data.userId)
                  sessionStorage.setItem('token', response.data.token)
                  sessionStorage.setItem('userName', response.data.name)
                  that.$router.push({path: '/'})
                }else {
                  layer.msg("账号或密码错误！！");
                }
              }
              ,
              error: function(result) {
                layer.msg("网络异常，请稍后再登陆！！");
              }
            });
          }
        })
      }
    }
  }


</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }

</style>