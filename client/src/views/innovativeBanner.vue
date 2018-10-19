<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
    
    </div>
    <div class="content">
     <div class="mb10">
        <button class="btn btn-primary" @click="addBanner">添加Banner</button>
       
      </div>

      <div class="nav-tabs-custom theme-panel">
          <div class="tab-content">
         
          <div class="panel panel-body panel-info">
            <table class="table table-hover">
              <thead>
               <th class="col-md-1 text-center">序号</th>
                <th class="col-md-2 text-center">名字</th>
                <th class="col-md-2 text-center">图片</th>
                  <th class="col-md-3 text-center">链接</th>
                  <th class="col-md-1 text-center">优先级</th>
                        
                <th class="col-md-2 text-center">操作</th>
              </thead>
              <tbody>

                <tr v-for="item in banners">
                  <td class="text-center" v-text="$index+1"></td>
                  <td class="text-center" v-text="item.name"></td>
                 
                  <td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
                  <td class="text-center" v-text="item.link"></td>
                  <td class="text-center" v-text="item.sortId"></td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-primary" @click="editBanner($index)">编辑</button>
                  
                    <button class="btn btn-default" @click="delBanner(item._id, $index)">删除</button>
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
  <modal :show.sync="showBanner" title="添加/编辑Banner">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveBanner">
       
        <div class="form-group">
          <label class="control-label col-sm-2" for="name">名称</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="name" id="name" v-model="curbanner.name" >
          </div>
        </div>
        <div class="form-group" style="position:relative;">
          <label for="cateImg" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="cateImg" text="上传图片" :img.sync="curbanner.img"></upload>

          </div>
          <input type="text" v-text="curbanner.img" :required="curbanner.img?false:true" oninvalid="setCustomValidity('请上传图片。')" style="position:absolute;top:50px;left:300px;opacity:0;">
        </div>
         <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="curbanner.link" required>
            </div>
          </div>

        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="curbanner.sortId">
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
  var bannerOpt = {
    sortId:null,
    ishidden: 1,
   	name:null,
   	link:"",
    img:''
  };

  module.exports = {
    data: function() {
      return {
       
        showBanner:false,
        // banner
         // id: this.$route.params.id,
        banners:[],
        curbanner: $.extend({}, bannerOpt),
        curbannerIndex:0,
         page: {
          total: null,
          current: 1,
          perPage: 10
        }

        
      }
    },
    route: {
      data:function(transition) {
       
         this.getAllBanner();
        
      }
    },
    methods: {

       getAllBanner: function() {
        var self = this;
        
        $.ajax({
          url: domain + '/innovative/getAllBanner',
          data: this.page,
          type: 'GET'
        })
        .done(function(res) {
          console.log(res);
          if ('1' == res.status) {
            
             self.page.total = res.count;
             self.banners = res.data;
          }
        });
      },

           
      //添加banner
      addBanner: function() {
        var self = this;
      if(this.banners.length<5){
          this.curbanner = $.extend({}, bannerOpt);
        this.showBanner = true;
      }else{
        alert("最多添加5个banner!")
      }
      
        
      },
      
    
      // 保存banner
      saveBanner: function() {
        var self = this;
        var param = JSON.parse(JSON.stringify(self.curbanner));
        var num = param.img.lastIndexOf(".")+1
       
        $.ajax({
          url: domain + '/innovative/saveBanner',
          type: 'post',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          
          if (res.status == '1') {
           if (param._id) {
              self.banners.$set(self.curbannerIndex, param);
            } else {
              param._id = res.data._id;
              self.banners.push(param);
            }
            self.showBanner = false;
          }
        });
        // return false;
     
      },

       editBanner:function(index){
        console.log(this.banners[index]);
        var str = JSON.stringify(this.banners[index]);
         this.curbanner = JSON.parse(str);
         console.log(this.curbanner);
        this.curbannerIndex = index;
        this.showBanner = true;

          },
      //删除楼层
      delBanner: function(id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/innovative/delBanner/' + id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.banners.splice(index, 1);
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