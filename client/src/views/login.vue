<template>
  <div class="login-box">
    <div class="login-logo">
      <a href="/"> <b>广贸</b>
        CMS
      </a>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body">
      <p class="login-box-msg">系统管理员登录</p>
      <div class="alert alert-danger hide" role="alert" id="errorInfo"> <i class="fa fa-exclamation-triangle"></i>
        &nbsp;用户名或密码不匹配
      </div>
      <form name="loginForm" v-ajax-submit @submit.prevent="submit">
        <div class="form-group has-feedback">
          <input type="text" class="form-control" placeholder="请输入用户名"
            v-model="user.name"
            required>
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" class="form-control" placeholder="请输入密码"
            v-model="user.password"
            required>
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
          <div class="col-xs-8">
            <div class="checkbox icheck hide">
              <label><input type="checkbox" value="1" v-model="user.isRemember">Remember Me</label>
            </div>
          </div>
          <div class="col-xs-4">
            <button type="submit" class="btn btn-primary btn-block btn-flat">登录</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  module.exports = {
    data: function() {
      return {
        user: {
          name: '',
          password: '',
          isRemember: 0
        }
      }
    },
    methods: {
      submit: function(){
        var self = this;
        $.ajax({
          url: domain + '/login',
          type: 'POST',
          data: this.user
        })
        .done(function(res) {
          if (1 == res.status) {
            localStorage.name = self.user.name;
            var redirect = decodeURIComponent(self.$route.query.redirect || 'home');
            self.$route.router.go(redirect);
          } else {
            alert('用户名或密码不匹配');
          }
        });
      }
    }
  }
</script>

<style>
  .login-logo a{
    color:#fff;
  }
</style>
