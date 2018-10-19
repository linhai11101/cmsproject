<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>首页活动</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li class="active">首页活动管理</li>
      </ol>
    </div>
    <div class="content">
     <div class="mb10">
        <button class="btn btn-primary" @click="addHomeAct">添加活动</button>
       
      </div>

      <div class="nav-tabs-custom theme-panel">
          <div class="tab-content">
         
          <div class="panel panel-body panel-info">
            <table class="table table-hover">
              <thead>
               <th class="col-md-1 text-center">序号</th>
               <th class="col-md-1 text-center">名称</th>
               <th class="col-md-1 text-center">活动时间</th>
               <th class="col-md-3 text-center">图片</th>
                        
                <th class="col-md-2 text-center">操作</th>
              </thead>
              <tbody>

                <tr v-for="item in homeActs">
                  <td class="text-center" v-text="$index+1"></td>
                   <td class="text-center" v-text="item.name"></td>
                   <td class="text-center"><span v-text="item.startTime"></span>--<span v-text="item.endTime"></span></td>
                 
                  <td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
                 
                  <td class="text-center">
                    <button class="btn btn-sm btn-primary" @click="editHomeAct($index)">编辑</button>
                  
                    <button class="btn btn-default" @click="delHomeAct(item._id, $index)">删除</button>
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
  <modal :show.sync="showHomeAct" title="添加活动">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveHomeAct">
       <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">名称</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="curhomeAct.name">
            </div>
          </div>

        <div class="form-group">
          <label class="control-label col-sm-2" for="time">时间</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="startTime" id="startTime" v-model="curhomeAct.startTime" style="width:48.2%;display:inline-block" placeholder="起始时间" required>
           --
             <input class="form-control" type="text" name="endTime" id="endTime" v-model="curhomeAct.endTime" style="width:48.2%;display:inline-block" placeholder="结束时间"  required>
          </div>
        </div>
        <div class="form-group" style="position:relative">
          <label for="cateImg" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="actImg" text="上传图片" :img.sync="curhomeAct.img" required></upload>
          </div>
          <span style="position:absolute;top:10px;left:220px;">推荐尺寸:272px*173px</span>
        </div>
         <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="curhomeAct.link">
            </div>
          </div>

        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="curhomeAct.sortId">
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
  var homeActOpt = {
   
    ishidden: 1
   
   
  };

  module.exports = {
    data: function() {
      return {
       
        showHomeAct:false,
        // banner
         // id: this.$route.params.id,
        homeActs:[],
        curhomeAct: $.extend({}, homeActOpt),
        curhomeActIndex:0,
         page: {
          total: null,
          current: 1,
          perPage: 10
        }

        
      }
    },
    route: {
      data:function(transition) {
       
         this.getAllHomeActs();
         // console.log(this.id);
      }
    },
    methods: {

       getAllHomeActs: function() {
        var self = this;
        
        $.ajax({
          url: domain + '/getAllHomeAct',
          data: this.page,
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status) {
            console.log(res);
             self.page.total = res.count;
             self.homeActs = res.data;
          }
        });
      },

           
      //添加banner
      addHomeAct: function() {
        var self = this;
        this.curhomeAct = $.extend({}, homeActOpt);
        this.showHomeAct = true;
        
      },
      
    
      // 保存banner
      saveHomeAct: function() {
        var self = this;
        var param = JSON.parse(JSON.stringify(self.curhomeAct));
        $.ajax({
          url: domain + '/saveHomeAct',
          type: 'post',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
           if (param._id) {
              self.homeActs.$set(self.curhomeActIndex, param);
            } else {
              param._id = res.data._id;
              self.homeActs.push(param);
            }
            self.showHomeAct = false;
          }
        });
        return false;
      },

       editHomeAct:function(index){
         this.curhomeAct = this.homeActs[index];
        this.curhomeActIndex = index;
        this.showHomeAct = true;

          },
      //删除活动
      delHomeAct:function(id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/homeAct/' + id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.homeActs.splice(index, 1);
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