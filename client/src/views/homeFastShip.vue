<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>首页快运</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li class="active">首页快运管理</li>
      </ol>
    </div>
    <div class="content">
     <div class="mb10">
        <button class="btn btn-primary" @click="addHomeFastShipCate">添加</button>
       
      </div>

      <div class="nav-tabs-custom theme-panel">
          <div class="tab-content">
         
          <div class="panel panel-body panel-info">
            <table class="table table-hover">
              <thead>
               <th class="col-md-1 text-center">序号</th>
               <th class="col-md-1 text-center">名称</th>
              
               <th class="col-md-3 text-center">图片</th>
                        
                <th class="col-md-2 text-center">操作</th>
              </thead>
              <tbody>

                <tr v-for="item in homeFastShipCate">
                  <td class="text-center" v-text="$index+1"></td>
                   <td class="text-center" v-text="item.name"></td>
                 
                 
                  <td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
                 
                  <td class="text-center">
                    <button class="btn btn-sm btn-primary" @click="editHomeFastShipCate($index)">编辑</button>
                  
                    <button class="btn btn-default" @click="delHomeFastShipCate(item._id, $index)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="col-md-12">
              <div class="text-right">
                <pages :total.sync="page.total" :current="page.current" :per-page="page.perPage" :page-changed="pagerCallback"></pages>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- 添加banner -->
  <modal :show.sync="showHomeFastShip" title="添加">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveHomeFastShipCate">
       <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">名称</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="curhomeFastShipCate.name">
            </div>
          </div>

       
        <div class="form-group">
          <label for="cateImg" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="fastShipImg" text="上传图片" :img.sync="curhomeFastShipCate.img" required></upload>
          </div>
        </div>
         <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="curhomeFastShipCate.link">
            </div>
          </div>

        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="curhomeFastShipCate.sortId">
          </div>
        </div>

      
        
       
        <div class="form-group">
          <div class="col-sm-10 col-sm-offset-2">
            <button type="submit" class="btn btn-primary">提交</button>
          </div>
        </div>
      </form>
    </div>
    <div slot="modal-footer"></div>
  </modal>
</template>

<script>
var webupload = require('../util/webupload/webuploader.min');

  //banner配置
  var homeFastShipOpt = {
   
    ishidden: 1
   
   
  };

  module.exports = {
    data: function() {
      return {
       
        showHomeFastShip:false,
       
        homeFastShipCate:[],
        curhomeFastShipCate: $.extend({}, homeFastShipOpt),
        curhomeFastShipCateIndex:0,
         page: {
          total: null,
          current: 1,
          perPage: 10
        }

        
      }
    },
    route: {
      data:function(transition) {
       
         this.getAllHomeFastShipCate();
         // console.log(this.id);
      }
    },
    methods: {

       getAllHomeFastShipCate: function() {
        var self = this;
        
        $.ajax({
          url: domain + '/getAllHomeFastShipCate',
          data: this.page,
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status) {
            console.log(res);
             self.page.total = res.count;
             self.homeFastShipCate = res.data;
          }
        });
      },

           
      //添加banner
      addHomeFastShipCate: function() {
        var self = this;
        this.curhomeFastShipCate = $.extend({}, homeFastShipOpt);
        this.showHomeFastShip = true;
        
      },
      
    
      // 保存banner
      saveHomeFastShipCate: function() {
        var self = this;
        var param = JSON.parse(JSON.stringify(self.curhomeFastShipCate));
        $.ajax({
          url: domain + '/saveHomeFastShipCate',
          type: 'post',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
           if (param._id) {
              self.homeFastShipCate.$set(self.curhomeFastShipCateIndex, param);
            } else {
              param._id = res.data._id;
              self.homeFastShipCate.push(param);
            }
            self.showHomeFastShip = false;
          }
        });
        return false;
      },

       editHomeFastShipCate:function(index){
         this.curhomeFastShipCate = this.homeFastShipCate[index];
        this.curhomeFastShipCateIndex = index;
        this.showHomeFastShip = true;

          },
      //删除活动
      delHomeFastShipCate:function(id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/homeFastShipCate/' + id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.homeFastShipCate.splice(index, 1);
              }
            })
          }
        }
      }
      // 跳转页面
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