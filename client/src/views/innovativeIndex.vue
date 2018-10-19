<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
    
    </div>
    <div class="content">
     <div class="mb10">
        <button class="btn btn-primary" @click="syncCate">同步类目</button>
        <a class="btn btn-danger" href="/innovative.html" target="_blank">预览</a>
      </div>

      <div class="nav-tabs-custom theme-panel">
          <div class="tab-content">
         
          <div class="panel panel-body panel-info">
            <table class="table table-hover">
              <thead>
               <th class="col-md-1 text-center">序号</th>
               <th class="col-md-2 text-center">类目</th>
                <th class="col-md-2 text-center">类目图片</th>
                  <th class="col-md-1 text-center">优先级</th>
                        
                <th class="col-md-2 text-center">操作</th>
              </thead>
              <tbody>

                <tr v-for="item in cates">
                  <td class="text-center" v-text="$index+1"></td>
                  <td class="text-center" v-text="item.nameEn"></td>
                  <td class="text-center">
                  <div v-if="item.img">
                  <img :src="item.img | resize" width="200" height="200">
                   <button class="btn btn-default" @click="editImg(item)">编辑背景图</button>
                  </div>
                   <div v-else>
                  <button class="btn btn-default" @click="editImg(item)">添加背景图</button>
                  </div>
                  </td>
                  <td class="text-center" v-text="item.sortId"></td>
                  <td class="text-center">
                  <div v-if="$index == 0">
                    <a class="btn btn-primary" v-link="'/innovativeProduct/'+item.nameEn+'?Id='+item.id+'&hide='+item.ishidden ">管理产品</a>
                    <button class="btn btn-sm btn-primary" @click="shiftDown(item,$index)">下移</button>
                  
                    <button class="btn btn-default" @click="hide(1,item)" v-if="item.ishidden == 1">隐藏</button>
                    <button class="btn btn-default" @click="hide(0,item)" v-if="item.ishidden == 0">显示</button>
                  </div>
                     <div v-if="$index != 0&&$index != cates.length - 1">
                  <a class="btn btn-primary" v-link="'/innovativeProduct/' +  item.nameEn + '?Id=' + item.id +'&hide='+item.ishidden">管理产品 </a>
                    <button class="btn btn-sm btn-primary" @click="shiftUp(item,$index)">上移</button>
                    <button class="btn btn-sm btn-primary" @click="shiftDown(item,$index)">下移</button>
                   <button class="btn btn-default" @click="hide(1,item)" v-if="item.ishidden == 1">隐藏</button>
                    <button class="btn btn-default" @click="hide(0,item)" v-if="item.ishidden == 0">显示</button>
                  </div>
                    <div v-if="$index == cates.length - 1">
                   <a class="btn btn-primary" v-link="'/innovativeProduct/' + item.nameEn + '?Id=' + item.id +'&hide='+item.ishidden">管理产品</a>
                    <button class="btn btn-sm btn-primary" @click="shiftUp(item,$index)">上移</button>
                   <button class="btn btn-default" @click="hide(1,item)" v-if="item.ishidden == 1">隐藏</button>
                    <button class="btn btn-default" @click="hide(0,item)" v-if="item.ishidden == 0">显示</button>
                  </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="col-md-12">
             
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- 添加banner -->
  <modal :show.sync="showBanner" title="类目背景图">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveMsg">
       
        <div class="form-group">
          <label class="control-label col-sm-2" for="name">类目</label>
          <div class=" col-sm-10">
            <input class="form-control" readonly="readonly" type="text" name="name" id="name" v-model="curbanner.nameEn">
          </div>
        </div>
        <div class="form-group">
          <label for="cateImg" class="col-sm-2 control-label">背景图</label>
          <div class="col-sm-10">
            <upload id="cateImg" text="上传图片" :img.sync="curbanner.img" ></upload> <span class="size">图片尺寸：240px*160px</span>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-10 col-sm-offset-2">
            <button type="submit" class="btn btn-primary">保存</button>
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
   	nameEn:null,
     img:'',
     _id:''
   
  };

  module.exports = {
    data: function() {
      return {
       
        showBanner:false,
        cates:[],
        curbanner: $.extend({}, bannerOpt),
        curbannerIndex:0,
        cateNum:null
        
      }
    },
    route: {
      data:function(transition) {
         this.getCate();
      }
    },
    methods: {
    syncCate: function() {
        var self = this;
        $.ajax({
          url: domain + '/innovative/syncCate',
          type: 'GET'
        })
        .done(function(res) {
         self.getCate();
         alert('同步了'+ self.cateNum +'个类目')
      })
    },
       getCate:function(){
        var self = this;
        $.ajax({
          url: domain + '/innovative/getCate',
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status) {
            console.log(res)
            self.cateNum = res.count;
             self.cates = res.data;
          }
        });
      },
      shiftDown:function(item,index){
        var self = this;
       console.log(index)
        item.sortId = item.sortId + 1;

        var param = $.extend({sortId:item.sortId}, item);
        console.log(param)
         $.ajax({
          url: domain + '/innovative/shift',
          type: 'POST',
          dataType: 'json',
          data:param
        })
        .done(function(res) {
         
              self.cates[index+1].sortId = self.cates[index+1].sortId - 1;
               $.ajax({
                    url: domain + '/innovative/shift',
                    type: 'POST',
                    dataType: 'json',
                    data:self.cates[index+1]
                  })
               .done(function(res){
                 if ('1' == res.status) {
                self.getCate ();
              }
               })
        });
      },
       shiftUp:function(item,index){
        var self = this;
        item.sortId = item.sortId - 1;
        var param = $.extend({sortId:item.sortId}, item);
        console.log(param)
         $.ajax({
          url: domain + '/innovative/shift',
          type: 'POST',
          dataType: 'json',
          data:param
        })
        .done(function(res) {
                       self.cates[index-1].sortId = self.cates[index-1].sortId + 1;
               $.ajax({
                    url: domain + '/innovative/shift',
                    type: 'POST',
                    dataType: 'json',
                    data:self.cates[index-1]
                  })
               .done(function(res){
                 if ('1' == res.status) {
                self.getCate ();
              }
               })
        });
      },     
      hide:function(flag,item){
         var self = this;
          var param  = null;
         if(flag == 1){
           item.ishidden = 0;
           param = JSON.parse(JSON.stringify(item));
         }else{
             item.ishidden = 1;
             param = JSON.parse(JSON.stringify(item));
         }
        console.log(param)
         $.ajax({
          url: domain + '/innovative/shift',
          type: 'POST',
          dataType: 'json',
          data:param
        })
       .done(function(res){
                 if ('1' == res.status) {
                self.getCate ();
              }
               })
      },
       editImg:function(item){
          this.showBanner = true;
          this.curbanner._id = item._id;
          this.curbanner.nameEn = item.nameEn;
          this.curbanner.img = item.img;
          },
      saveMsg:function(){
        var self= this;
            var param = JSON.parse(JSON.stringify(this.curbanner))
             $.ajax({
                    url: domain + '/innovative/shift',
                    type: 'POST',
                    dataType: 'json',
                    data:param
                  })
               .done(function(res){
                 if ('1' == res.status) {
                  self.showBanner = false;
                self.getCate ();
              }
               })
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
  .size{position: absolute;top:10px;right: 240px;color: #f08200;}

</style>