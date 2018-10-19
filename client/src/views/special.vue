<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
    <h1>促销管理</h1>   
    </div>
    <div class="content">
      <div class="mb10">
        <button class="btn btn-primary" @click="addProduct"> <span class="glyphicon glyphicon-plus"></span> 添加商品</button>
        <a class="btn btn-danger" href="/special.html" target="_blank">预览</a>
        <button class="btn btn-primary" @click="syncOverdueProducts">同步过期产品</button>
        <!-- <button class="btn btn-danger" @click="createStatic">生成静态页</button> -->
      </div>
      <div class="nav-tabs-custom theme-panel">
        <ul class="nav nav-tabs">
          <template v-for="item in categorys">
            <li v-if="$index == currentCateIndex" class="active" @click="switchFloor(item._id, $index)">
              <a href="javascript:;">
                {{ item.name }}
              </a>
            </li>
            <li v-if="$index != currentCateIndex" @click="switchFloor(item._id, $index)">
              <a href="javascript:;">
                {{ item.name }}
              </a>
            </li>
          </template>
          <li @click="addFloor">
            <a href="javascript:;">
              + 添加分类
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div class="mb10">
            <div class="btn-group">
              <button type="button" class="btn btn-default" @click="editFloor">修改分类</button>
              <button type="button" class="btn btn-default" @click="delFloor">删除分类</button>
            </div>
          </div>
          <table class="table table-hover">
            <tr>
              <th style="width:10%">商品编号</th>
              <th>商品图片</th>
              <th>商品名称</th>
              <th>原价/售价</th>
              <th>折扣</th>
              <th>折后价</th>
              <th>所属分类</th>
              <th>管理</th>
            </tr>
            <tr v-for="item in products">
              <td><span v-text="$index+1"></span></td>
              <td>
               
                <span v-if="time-(new Date(item.endTime)).getTime()>=0" class="c-span">已过期</span> 
                <a class="media" v-link="item.link" target="_blank">
                  <div class="media-left">
                    <img v-bind:src="item.img | resize" width="100">
                  </div>
                 
                </a>
              </td>
              <td><span v-text="item.name"></span></td>
              <td><span v-text="item.price"></span></td>
              <td><span v-text="item.discount"></span></td>
              <td><span v-text="item.discountPrice"></span></td>
              <td>
                
                  <select class="j-cateName" v-model="item.cateId" disabled="true" style="border:none;background:none; -moz-appearance: none; -webkit-appearance:none;appearance:none; ">
                <option v-for="item in categorys" :value="item._id">
                  {{ item.name }}
                </option>
              </select>

              </td>
            
             
              <td>
                <button class="btn btn-sm btn-primary" @click="editProduct($index)">编辑</button>
                <button class="btn btn-sm btn-default" @click="delProduct(item._id, $index)">删除</button>
                <a target="_blank" :href="item.link"  style="display:none">链接</a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!--添加楼层-->
  <modal :show.sync="showModal" title="分类">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveCate">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">分类名</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="curCate.name" required>
            </div>
          </div>
           <div class="form-group">
            <label  class="col-sm-2 control-label">分类图片</label>
            <div class="col-sm-10">
              <upload id="cate-img" :img.sync="curCate.img" required></upload>
            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="curCate.sortId">
            </div>
          </div>
         
          <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
              <button class="btn btn-primary" type="submit">
                提交
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div slot="modal-footer"></div>
  </modal>
  <!--添加商品-->
  <modal :show.sync="showProModal" title="商品">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveProduct">
        <div class="form-horizontal">
        <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">商品编号</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="product.number" required placeholder="请输入已存在的商品编号">
            </div>
          </div>

                 <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">商品分类</label>
            <div class="col-sm-10">
              <select class="form-control j-cateName" v-model="product.cateId" required>
                <option v-for="item in categorys" :value="item._id">
                  {{ item.name }}
                </option>
              </select>
              <input type="hidden" name="" v-model="product.cateName">
            </div>
          </div>

      <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label"></label>
            <div class="col-sm-10">
              <a class="btn btn-primary" @click="syncProduct"> <span class="glyphicon glyphicon-plus"></span>同步数据</a>
            </div>
          </div>
         

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">商品名</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="product.name"  disabled="true" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">商品图片</label>
            <div class="col-sm-10">
              <upload id="pick-img" :img.sync="product.img"></upload>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">价格</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" disabled="true" v-model="product.price">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">折扣</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" disabled="true" v-model="product.discount">
            </div>
          </div>
           <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">折后价</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" disabled="true" v-model="product.discountPrice">
            </div>
          </div>

          <div class="form-group" style="display:none;">
            <label for="inputEmail3" class="col-sm-2 control-label">是否免运费</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" disabled="true"  v-model="product.free" >
            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">商品链接</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" disabled="true"  v-model="product.link" >
            </div>
          </div>
         
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">是否显示</label>
            <div class="col-sm-10">
             <label class="radio-inline">
                <input type="radio" name="isTop" value="1" v-model="product.isTop"> 显示
              </label>
              <label class="radio-inline">
                <input type="radio" name="isTop" value="0" v-model="product.isTop"> 不显示
              </label>
             
            </div>
          </div>

           <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">是否推荐</label>
            <div class="col-sm-10">
             <label class="radio-inline">
                <input type="radio" name="isrecommend" value="0" v-model="product.isrecommend"> 推荐
              </label>
              <label class="radio-inline">
                <input type="radio" name="isrecommend" value="1" v-model="product.isrecommend"> 不推荐
              </label>
             
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

  //楼层配置
  var cateOpt = {
    name: '',
    sortId: 1,
    img:"",
    state: '1'
  }

  //商品默认配置
  var productOpt = {
    isTop: '1',
    isrecommend:'1',
    name:"",
    link:"",
    free:"",
    price:"",
    discount:"",
    cateName:"",
    discountPrice:"",
    end:"",
    sld:"",
    quantityMax:null,
    remainTime:null
   
  }

  module.exports = {
    data: function() {
      return {
        showModal: false,
        showProModal: false,
        upload: '',
        categorys: [],   //楼层
        currentCate: $.extend({}, cateOpt), //
        currentCateIndex: 0,  //当前楼层索引
        curCate: $.extend({}, cateOpt),
        currentCateId: null,
        products: [],  //商品集合
        product: $.extend({}, productOpt), //当前商品
        productIndex: '3', //当前商品索引
        time:0
      }
    },
    route: {
      data: function(transition) {
         this.getCates();
         // this.getProduct();
      }
    },
    methods: {
      //楼层
      //获取楼层
      getCates: function() {
        var self = this;
        console.log(self.products);
        $.ajax({
          url: domain + '/special/cate',
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status && res.data && res.data.length) {
            self.categorys = res.data;
            self.currentCate = res.data[0];
            self.currentCateId = self.currentCate._id;
            self.time= res.time;
          }
        });
      },
      syncProduct:function() {
        var self = this;
        var param = {productId:self.product.number}
        $.ajax({
          url: domainCrm+"/scheme/productAndPromotion.cf",
          type: 'POST',
          data:param
        })
        .done(function(res) {
          if (res.code=='0') {
             
          var prods =res.data;
          if(prods.length>0){
            for(var i=0;i<prods.length;i++){

              if(prods[i].typeInt==1){
                    var str = prods[i].promotionTimeVo.end;
                    var endTime =  Date.parse(new Date(str))/1000; //结束时间
                    var nowTime =  Date.parse(new Date())/1000; //添加产品的时候的当前时间
                    var remainTime = endTime - nowTime ;//剩余时间
                    self.product.promotionId = prods[i].promotionTimeVo.id;//促销ID
                    self.product.name=prods[i].productName;
                    self.product.price=prods[i].prouductPrice;
                    self.product.discount=prods[i].promotionDiscountVo.discount;
                    self.product.discountPrice=prods[i].discountPrice;
                    self.product.link=prods[i].link;
                    self.product.free=prods[i].free;
                    self.product.tag=prods[i].tag;
                    self.product.sld=prods[i].sld;
                    self.product.productId=prods[i].productId;
                    self.product.quantityMax=prods[i].quantityMax;
                    self.product.endTime = prods[i].promotionTimeVo.end;
                    self.product.endTimes = prods[i].promotionTimeVo.endTime;

                    self.product.remainTime = remainTime;
              }
            }
          }else{
            alert("该商品不存在.");
          }
   
          }else{
            alert("系统错误.")
          }
          })
        
      },
      //添加楼层
      addFloor: function() {
        var self = this;
        this.curCate = $.extend({}, cateOpt);
        this.showModal = true;
      },
      editFloor: function() {
        var self = this;
        self.curCate = $.extend({}, self.currentCate);
        this.showModal = true;
      },
      saveCate: function() {
        var self = this;
       
        var param = JSON.parse(JSON.stringify(self.curCate));
        $.ajax({
          url: domain + '/special/cate',
          type: 'post',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.categorys.$set(self.currentCateIndex, param);
            } else {
              param._id = res.data._id;
              self.categorys.push(param);
            }
            self.showModal = false;
          }
        });
        return false;
      },
      switchFloor: function(id, index) {
        this.currentCateIndex = index;
        this.currentCate = this.categorys[index];
        this.currentCateId = this.currentCate._id;
      },
      //删除楼层
      delFloor: function() {
        var self = this;
        if (confirm('确定删除？')) {
          if (this.currentCate._id) {
            $.ajax({
              url: domain + '/special/cate/' + this.currentCate._id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.categorys.splice(self.currentCateIndex, 1);
              }
            })
          }
        }
      },
      //获取商品
      getProduct: function () {
        var self = this;
        var cateId = this.currentCate._id;
        console.log(cateId);
        $.ajax({
          url: domain + '/special/product/' + cateId,
          type: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          if (1 == res.status) {
            console.log(res);
            self.products = res.items;
          }
        });
      },

      // 同步过期产品
      syncOverdueProducts: function() {
        var self = this;
        $.ajax({
          url: domain + '/special/syncOverdueProducts/'+self.time,
          type: 'post',
          dataType: 'json',
        })
        .done(function(res) {
          if (res.status == 1) {
            alert('共' + res.count + '个专业镇，同步了' + res.updateCount + '专业镇');
            self.getProduct();
          }
        });
      },


      addProduct: function () {
        this.product = $.extend({}, productOpt);
        this.showProModal = true;
      },
      editProduct: function (index) {
        this.product = this.products[index];
        this.productIndex = index;
        this.showProModal = true;
      },
      //保存商品
      saveProduct: function () {
        var self = this;
      
        var param = JSON.parse(JSON.stringify(this.product));
        var str = $(".j-cateName").find("option:selected").eq(0).text();
        param.cateName=$.trim(str);
          console.log($.trim(str));
        //楼层id
        // param.cateId = this.currentCate._id;
        $.ajax({
          url: domain + '/special/product',
          type: 'POST',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.products.$set(self.productIndex, param);
            } else {

              param._id = res.data._id;
              self.products.push(param);
           
            }
            self.showProModal = false;
          }
        });
      },
      //删除商品
      delProduct: function (id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/special/product/' + id,
              type: 'delete'
            })
            .done(function(res) {
              if (1 == res.status) {
                self.products.splice(index, 1);
              }
            });
          }
        }
      },
      createStatic: function() {
        $.ajax({
          url: domain + '/create/special',
          type: 'GET'
        })
        .done(function(res) {
          if (res.status == 1) {
            alert('成功')
          } else {
            alert('失败')
          }
        })
      }
    },

    watch: {
      'currentCateId': function(val, old) {
        this.getProduct();
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

  .c-span{position: relative;top:-40px;color:#999;}
</style>
