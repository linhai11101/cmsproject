<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
     <h1 v-text="category"></h1>
   </div>
   <div class="content">
     <div class="mb10">
      <button class="btn btn-primary" @click="addProduct">添加</button>
      
    </div>

    <div class="nav-tabs-custom theme-panel">
      <div class="tab-content">
       
        <div class="panel panel-body panel-info">
          <table class="table table-hover">
            <thead>
             <th class="col-md-1 text-center">序号</th>
             <th class="col-md-2 text-center">名字</th>
             <th class="col-md-2 text-center">图片</th>
             <th class="col-md-2 text-center">价格</th>
             <th class="col-md-2 text-center">最小起批量</th>
             <th class="col-md-1 text-center">优先级</th>  
             <th class="col-md-2 text-center">操作</th>
           </thead>
           <tbody>

            <tr v-for="item in products">
              <td class="text-center" v-text="$index+1"></td>
              <td class="text-center" v-text="item.name"></td>
              
              <td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
              <td class="text-center" >
                <span v-text=" " v-if="item.priceRange == '0.00' "></span>
                <span v-text="item.priceRange" v-if="item.priceRange != '0.00' "></span>
              </td>
              <td class="text-center" v-text="item.minOrder"></td>
              <td class="text-center" v-text="item.sortId"></td>
              <td class="text-center">
                <button class="btn btn-sm btn-primary" @click="editProduct($index)">编辑</button>
                <button class="btn btn-default" @click="delProduct(item._id, $index)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</div>


<!-- 添加banner -->
<modal :show.sync="showBanner"  :title=title+"产品">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal"  @submit.prevent="saveProduct">
      <div class="form-group">
        <label class="control-label col-sm-2" for="product">关联产品</label>
        <div class="col-sm-10">
          <input class="form-control  col-sm-9" type="text" name="product" id="product-id" v-model="product.id" autocomplete="off">
          <input type="button"  class="btn btn-primary" @click="search" class="col-sm-2" value="搜索" >
          <table class="table table-bordered" v-show="flag == 1" >
            <thead>
              <th class="col-md-1 text-center"></th>
              <th class="col-md-1 text-center">id</th>
              <th class="col-md-2 text-center">名称</th>
              <th class="col-md-2 text-center">价格</th>
              <th class="col-md-2 text-center">最小起批量</th>
            </thead>
            <tbody>
             <tr>
               <td class="text-center"><input type="radio" v-model="check" ></td>
               <td class="text-center" v-text="product.id"> </td>
               <td class="text-center" v-text="product.name"></td>
               <td class="text-center">
                 <span v-text=" " v-if="product.priceRange == '0.00' "></span>
                 <span v-text="product.priceRange" v-if="product.priceRange != '0.00' "></span>
               </td>
               <td class="text-center" v-text="product.minOrder"></td>
             </tr>
           </tbody>
         </table>
         <div v-show="flag == 2">该产品查找不到，请从新输入</div>
         <input type="text"  style="position:absolute;left:-50px;top:120px;opacity:0"  v-model="check"  v-if="flag == 1"  
         id="product-check"  />
       </div>
     </div>
     <div class="form-group">
      <label for="cateImg" class="col-sm-2 control-label">图片</label>
      <div class="col-sm-10">
        <upload id="cateImg" text="上传图片" :img.sync="product.img"></upload><span class="size">图片尺寸：320px*300px</span>
      </div>
    </div>
    <div class="form-group">
      <label class="control-label col-sm-2" for="sortId">优先级</label>
      <div class="col-sm-10 ">
        <input class="form-control" type="number" name="sortId" id="sortId" v-model="product.sortId">
      </div>
    </div>
    
    <div class="form-group">
      <label for="inputEmail3" class="col-sm-2 control-label">是否推荐</label>
      <div class="col-sm-10">
       <label class="radio-inline">
        <input type="radio" name="isTop" value="0" v-model="product.isTop"> 推荐
      </label>
      <label class="radio-inline">
        <input type="radio" name="isTop" value="1" v-model="product.isTop"> 不推荐
      </label>
      
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

<script >
  var webupload = require('../util/webupload/webuploader.min');

  //banner配置
  var productOpt = {id:'',isTop: '1',name:null,priceRange:null,minOrder:null,sortId:null,img:''};
  module.exports = {
    data: function() {
      return {
       category:this.$route.params.name,
       showBanner:false,
       product:{},
       flag:0,
       check:'',
       products:[],
       title:'',
       curproduct: $.extend({}, productOpt),
       curproductIndex:null,
       page: {
        total: null,
        current: 1,
        perPage: 10
      }
    }
  },
  route: {
    data:function(transition) {
      this.getProduct();
    }
  },
  methods: {
    addProduct:function(){
      this.title="添加";
      this.showBanner = true;
      this.flag = 0;
      this.product = $.extend({}, productOpt);
      $("#product-id").val("")
    },
    search:function(){
      var self = this;
      $.ajax({
        url: domainCrm + '/cms/innoDesignProduct/product.cf',
        data: {
          id:$("#product-id").val()
        },
        type: 'POST'
      }).done(function(res) {
        if(res.data){
          self.$set('product.name', res.data.name);
          self.$set('product.id', res.data.id);
          self.$set('product.priceRange', res.data.priceRange);
          self.$set('product.minOrder', res.data.minOrder);
          self.$set('product.privacy', res.data.privacy);
          self.$set('product.productType', res.data.type);
          self.$set('product.unit', res.data.unit);
          self.flag = 1;
          self.ckeck = 'false';
        }else{
         self.flag = 2 ;
       }
     });
    },
    getProduct: function() {
      var self = this;
      this.page.cateId = this.$route.query.Id;
      $.ajax({
        url: domain + '/innovative/getProduct',
        data: this.page,
        type: 'GET'
      })
      .done(function(res) {
        if ('1' == res.status) {
          console.log(res);
          self.page.total = res.count;
          self.products = res.data;
        }
      });
    },
      // 保存产品
      saveProduct: function() {
        var self = this;
        self.product.hide = self.$route.query.hide;
        self.product.cateId = self.$route.query.Id;
        self.product.cateName = self.category;
        var param = JSON.parse(JSON.stringify(self.product));
        if(self.product._id){   //如果ID存在，说明是编辑某个产品
         //console.log(self.product._id);
          $.ajax({
                    url: domain + '/innovative/saveProduct',
                    type: 'post',
                    dataType: 'json',
                    data: param
                  }).done(function(res) {
                    if (1 == res.status) {
                      self.getProduct();
                      self.showBanner = false;
                    }
                  });

        }else{

          for(var i=0;i<self.products.length;i++){
            if(self.products[i].id==self.product.id){
              alert("你已添加该产品.");
              self.showBanner = false;
              return false;
            }else{

            }
          }
          $.ajax({
            url: domain + '/innovative/saveProduct',
            type: 'post',
            dataType: 'json',
            data: param
          }).done(function(res) {
            if (1 == res.status) {
              self.getProduct();
              self.showBanner = false;
            }
          });

        }
        
        
      },
      editProduct:function(index){
        var self = this;
        self.curproductIndex = index;
        self.product = self.products[index];
        self.flag = 1;
        self.check = "on" ;
        self.showBanner = true;
        this.title="编辑";
      },
      //删除楼层
      delProduct: function(id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/innovative/delProduct/' + id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.products.splice(index, 1);
              }
            })
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
  .col-sm-9{width: 82% !important;margin-right: 30px;}
  table{margin-top: 20px;}
  .size{position: absolute;top:10px;right: 240px;color: #f08200;}
</style>