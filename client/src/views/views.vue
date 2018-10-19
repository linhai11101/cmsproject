<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>视图管理</h1>
    </div>
    <div class="content">
      <div class="nav-tabs-custom theme-panel">
        <div class="tab-content">
          <table class="table table-hover">
            <tr>
              <th>名字</th>
              <th>文件类型</th>
              <th>管理</th>
            </tr>
            <tr v-if="path">
              <td><a href="javascript:;" @click="activePath()">返回上级</a></td>
              <td>当前目录: {{path}}</td>
              <td></td>
            </tr>
            <tr v-for="item in views">
              <td>{{ item.name }}</td>
              <td>{{ item.type }}</td>
              <td>
                <template v-if="item.type == 'folder'">
                  <button class="btn btn-sm btn-success" @click="getViews(item.path)">进入</button>
                </template>
                <template v-if="item.type != 'folder'">
                  <button class="btn btn-sm btn-primary" @click="editView($index)">编辑</button>
                </template>
              </td>
            </tr>
          </table>
        </div>
        <div v-show="editMode" class="edit-container">
          <form class="form-horizontal" v-ajax-submit @submit.prevent="saveView">
            <div class="form-group">
              <label for="inputEmail3" class="col-sm-1 control-label">名字</label>
              <div class="col-sm-11">
                {{view.name}}
              </div>
            </div>
            <div class="form-group">
              <label for="inputEmail3" class="col-sm-1 control-label">代码</label>
              <div class="col-sm-11">
                <textarea v-model="view.content" class="view-content"></textarea>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-11 col-sm-offset-1">
                <button class="btn btn-primary" type="submit">提交</button>
                <button class="btn btn-success" @click="editMode=false" type="button">取消</button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

  var userOpt = {
    name: null,
    content: null
  };

  module.exports = {
    data: function() {
      return {
        views: [],
        view: $.extend({}, userOpt),
        viewIndex: '',

        editMode: false,
        path: '',
      }
    },
    route: {
      data: function(transition) {
        this.getViews();
      }
    },
    methods: {
      activePath: function(){
        var path = this.path.substr(0, this.path.lastIndexOf('\\'));
        this.getViews(path);
      },
      getViews: function (path) {
        var self = this;
        $.ajax({
          url: domain + '/viewsAll',
          type: 'GET',
          data: {'dir': path}
        })
        .done(function(res) {
          if (1 == res.status) {
            self.views = res.data;
            self.path = path;
          }
        });
      },
      editView: function (index) {
        var self = this;
        this.view = $.extend(this.view, this.views[index])
        $.ajax({
          url: domain + '/views',
          type: 'GET',
          data: {'dir': this.view.path}
        })
        .done(function(res) {
          if (1 == res.status) {
            self.view.content = res.data.content;
          }
          self.editMode = true;
        });
      },
      saveView: function () {
        var self = this;
        $.ajax({
          url: domain + '/views',
          type: 'POST',
          dataType: 'json',
          data: {
            dir: this.view.path,
            content: this.view.content
          }
        })
        .done(function(res) {
          if (1 == res.status) {
            alert('修改成功')
            self.editMode = false;
          } else {
            alert('修改失败')
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
  .view-content{
    width: 100%;
    height: 500px
  }
  .theme-panel{
    position: relative;
  }
  .edit-container{
    position: absolute;
    width: 100%;
    min-height: 600px;
    height: 100%;
    top:0;
    left: 0;
    background: #fff;
  }
</style>
