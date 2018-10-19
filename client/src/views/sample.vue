<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>样品中心</h1>
    </div>
    <div class="content">
      <div class="mb10">
        <button class="btn btn-primary" @click="addProduct"> <span class="glyphicon glyphicon-plus"></span> 添加产品</button>
        <a class="btn btn-danger" href="/sample.html" target="_blank">预览</a>
        <!-- <button class="btn btn-danger" @click="createStatic">生成静态页</button> -->
      </div>
      <div class="nav-tabs-custom theme-panel">
        <ul class="nav nav-tabs">
          <template v-for="item in floors">
            <li v-if="$index == currentFloorIndex" class="active" @click="switchFloor(item._id, $index)">
              <a href="javascript:;">
                {{ item.name }}
              </a>
            </li>
            <li v-if="$index != currentFloorIndex" @click="switchFloor(item._id, $index)">
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
              <th style="width:50%">产品</th>
              <th>价格</th>
              <th>点赞数</th>
              <th>管理</th>
            </tr>
            <tr v-for="item in products">
              <td>
                <a class="media" v-link="item.link" target="_blank">
                  <div class="media-left">
                    <img v-bind:src="item.img | resize" width="100">
                  </div>
                  <div class="media-body">
                    {{ item.name }}
                  </div>
                </a>
              </td>
              <td>{{ item.price }}</td>
              <td>{{ item.like }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click="editProduct($index)">编辑</button>
                <button class="btn btn-sm btn-default" @click="delProduct(item._id, $index)">删除</button>
                <a target="_blank" :href="item.link" >链接</a>
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
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveFloor">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">分类名</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="newFloor.name" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="newFloor.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="inputPassword3" class="col-sm-2 control-label">是否显示</label>
            <div class="col-sm-10">
              <label class="radio-inline">
                <input type="radio" name="state" value="1" v-model="newFloor.state"> 是
              </label>
              <label class="radio-inline">
                <input type="radio" name="state" value="0" v-model="newFloor.state"> 否
              </label>
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
  <!--添加产品-->
  <modal :show.sync="showProModal" title="产品">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveProduct">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品名</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="product.name" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品图片</label>
            <div class="col-sm-10">
              <upload id="pick-img" :img.sync="product.img"></upload>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">价格</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="product.price">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">点赞数</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="product.like">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品链接</label>
            <div class="col-sm-10">
              <input type="url" class="form-control" v-model="product.link">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品类型</label>
            <div class="col-sm-10">
              <select class="form-control" v-model="product.pid" required>
                <option v-for="item in floors" :value="item._id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">是否显示</label>
            <div class="col-sm-10">
              <label class="radio-inline">
                <input type="radio" name="isTop" value="1" v-model="product.isTop"> 显示
              </label>
              <label class="radio-inline">
                <input type="radio" name="isTop" value="0" v-model="product.isTop"> 隐藏
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
  var floorOpt = {
    name: '',
    sortId: 1,
    state: '1'
  }

  //产品默认配置
  var productOpt = {
    isTop: '1',
    type: 'b'
  }

  module.exports = {
    data: function() {
      return {
        showModal: false,
        showProModal: false,

        upload: '',

        //楼层
        floors: [],
        currentFloor: $.extend({}, floorOpt), //
        currentFloorIndex: 0,  //当前楼层索引
        newFloor: $.extend({}, floorOpt),
        currentFloorId: null,

        //产品
        products: [],  //产品集合
        product: $.extend({}, productOpt), //当前产品
        productIndex: '' //当前产品索引

      }
    },
    route: {
      data: function(transition) {
        this.getFloor();
      }
    },
    methods: {
      //楼层
      //获取楼层
      getFloor: function() {
        var self = this;
        $.ajax({
          url: domain + '/sample/sort',
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status && res.data && res.data.length) {

            self.floors = res.data;
            console.log(self.floors);
            self.currentFloor = res.data[0];
            console.log(self.currentFloor)
            self.currentFloorId = self.currentFloor._id;
            console.log(self.currentFloorId)
          }
        });
      },
      //添加楼层
      addFloor: function() {
        var self = this;
        this.newFloor = $.extend({}, floorOpt);
        this.showModal = true;
      },
      editFloor: function() {
        var self = this;
        self.newFloor = $.extend({}, self.currentFloor);
        this.showModal = true;
      },
      saveFloor: function() {
        var self = this;
        var param = JSON.parse(JSON.stringify(self.newFloor));
        $.ajax({
          url: domain + '/sample/sort',
          type: 'post',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.floors.$set(self.currentFloorIndex, param);
            } else {
              param._id = res.data._id;
              self.floors.push(param);
            }
            self.showModal = false;
          }
        });
        return false;
      },
      switchFloor: function(id, index) {
        this.currentFloorIndex = index;
        this.currentFloor = this.floors[index];
        this.currentFloorId = this.currentFloor._id;
      },
      //删除楼层
      delFloor: function() {
        var self = this;
        if (confirm('确定删除？')) {
          if (this.currentFloor._id) {
            $.ajax({
              url: domain + '/sample/sort/' + this.currentFloor._id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.floors.splice(self.currentFloorIndex, 1);
              }
            })
          }
        }
      },

      //楼层产品
      //获取产品
      getProduct: function () {
        var self = this;
        var floorid = this.currentFloor._id;
        $.ajax({
          url: domain + '/sample/product/' + floorid,
          type: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          if (1 == res.status) {
            console.log(res);
            self.products = res.data;
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
      //保存产品
      saveProduct: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.product));
        //楼层id
        param.floorid = this.currentFloor._id;
        $.ajax({
          url: domain + '/sample/product',
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
      //删除产品
      delProduct: function (id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/sample/product/' + id,
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
          url: domain + '/create/sample',
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
      'currentFloorId': function(val, old) {
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
</style>
