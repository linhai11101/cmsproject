<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>用户中心</h1>
    </div>
    <div class="content">
      <button class="btn btn-primary mb10" @click="addUser">+ 添加用户</button>
      <div class="nav-tabs-custom theme-panel">
        <div class="tab-content">
          <table class="table table-hover">
            <tr>
              <th>用户名</th>
              <th>密码</th>
              <th>角色</th>
              <th>最后登陆时间</th>
              <th>管理</th>
            </tr>
            <tr v-for="item in users">
              <td>{{ item.name }}</td>
              <td>{{ item.password }}</td>
              <td>{{ item.role }}</td>
              <td>{{ item.meta.updateAt }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click="editUser($index)">编辑</button>
                <button class="btn btn-sm btn-default" @click="delUser(item._id, $index)">删除</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!--添加用户-->
  <modal :show.sync="showProModal" title="用户">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveUser">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">用户名</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="user.name" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">密码</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="user.password" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">角色</label>
            <div class="col-sm-10">
              <select class="form-control" v-model="user.role" required>
                <option value="0">信息录入员</option>
                <option value="11">管理员</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
              <button class="btn btn-primary" type="submit">提交</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div slot="modal-footer"></div>
  </modal>

</template>
<script>

  //用户默认配置
  var userOpt = {
  }

  var webupload = require('../util/webupload/webuploader.min');
  module.exports = {
    data: function() {
      return {
        showProModal: false,

        //用户
        users: [],  //用户集合
        user: $.extend({}, userOpt), //当前用户
        userIndex: '' //当前用户索引

      }
    },
    route: {
      data: function(transition) {
        this.getUser();
      }
    },
    methods: {

      //楼层用户
      //获取用户
      getUser: function () {
        var self = this;
        $.ajax({
          url: domain + '/users',
          type: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          if (1 == res.status) {
            self.users = res.data;
          }
        });
      },
      addUser: function () {
        this.user = $.extend({}, userOpt);
        this.showProModal = true;
      },
      editUser: function (index) {
        this.user = this.users[index];
        this.userIndex = index;
        this.showProModal = true;
      },
      //保存用户
      saveUser: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.user));
        //楼层id
        $.ajax({
          url: domain + '/user',
          type: 'POST',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.users.$set(self.userIndex, param);
            } else {
              param._id = res.data._id;
              self.users.push(param);
            }
            self.showProModal = false;
          }
        });
      },
      //删除用户
      delUser: function (id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/user/' + id,
              type: 'delete'
            })
            .done(function(res) {
              if (1 == res.status) {
                self.users.splice(index, 1);
              }
            });
          }
        }
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
