<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>基本参数</h1>
    </div>
    <div class="content">
      <button class="btn btn-primary" @click="reboot">重启系统</button>
    </div>
  </div>
</template>
<script>


  module.exports = {
    data: function() {
      return {

      }
    },
    methods: {

      //楼层用户
      //获取用户
      reboot: function () {
        $.ajax({
          url: domain + '/reboot',
          type: 'post'
        })
        .done(function(res) {
          if (1 == res.status) {
            alert('正常重启, 请稍后');
          } else {
            alert('失败');
            console.log(res.msg);
          }
        });
      }
    }
  }
</script>
<style>
  .palent{
    background: #fff;
    border:1px solid #ddd;
    padding: 10px;
  }
  .mb10{
    margin-bottom: 10px;
  }
</style>
