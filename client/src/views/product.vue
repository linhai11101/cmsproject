<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>产品管理</h1>
    </div>
    <div class="content">
      <button class="btn btn-primary mb10" @click="addProduct">+ 添加产品</button>
      <div class="box box-solid">
        <div class="box-body table-responsive no-padding">
          <table class="table table-hover">
            <thead>
              <tr>
                <th style="width:50%">产品名</th>
                <th>
                  <dropdown>
                    <a href="javascript:;" data-toggle="dropdown">
                      显示位置
                      <span class="caret"></span>
                    </a>
                    <ul slot="dropdown-menu" class="dropdown-menu dropdown-area">
                      <li @click="filter(null)"><a href="javascript:;">全部</a></li>
                      <template v-for="area in areas">
                        <li @click="filter(area.id)"><a href="javascript:;">{{area.name}}</a></li>
                        <li v-if="area.children && area.children.length" v-for="item in area.children" @click="filter(item.id)"><a href="javascript:;">&nbsp; |- {{ item.name }}</a></li>
                      </template>
                    </ul>
                  </dropdown>
                </th>
                <th>是否显示</th>
                <th>管理</th>
              </tr>
            </thead>
            <tbody>
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
                <td>{{ item.area | areaText }}</td>
                <td>{{ item.ishidden | ishidden }}</td>
                <td>
                  <button class="btn btn-sm btn-primary" @click="editProduct($index)">编辑</button>
                  <button class="btn btn-sm btn-default" @click="delProduct(item._id, $index)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="col-md-12 text-right">
            <pages :total.sync="page.total" :current="page.current" :per-page="page.perPage" :page-changed="pageCallback"></pages>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--添加产品-->
  <modal :show.sync="showProductModal" title="产品">
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
            <label for="inputEmail3" class="col-sm-2 control-label">产品描述</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="product.desc" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">图片</label>
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
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="url" class="form-control" v-model="product.link">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">内容类型</label>
            <div class="col-sm-10">
              <label class="radio-inline">
                <input type="radio" name="type" value="1" v-model="product.type"> 推荐产品
              </label>
              <label class="radio-inline" style="display:none">
                <input type="radio" name="type" value="2" v-model="product.type"> 热门产品
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="product.sortid">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">显示位置</label>
            <div class="col-sm-10">
              <select name="" class="form-control" v-model="product.area" required>
                <template v-for="area in areas">
                <option :value="area.id">{{area.name}}</option>
                <option v-if="area.children && area.children.length" v-for="item in area.children" :value="item.id">&nbsp; |- {{ item.name }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">是否显示</label>
            <div class="col-sm-10">
              <label class="radio-inline">
                <input type="radio" name="ishidden" value="1" v-model="product.ishidden"> 显示
              </label>
              <label class="radio-inline">
                <input type="radio" name="ishidden" value="0" v-model="product.ishidden"> 不显示
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

  //产品默认配置
  var productOpt = {
    ishidden: 1,
    target: '_blank',
    sortid: 10,
    type: '',
    area:1
  }
  //显示位置  area
  // 1=>首页; 2=>列表页; 3=>专业镇; 4=>专业市场; 其他按id来。


  module.exports = {
    data: function() {
      return {
        showProductModal: false,

        //产品
        products: [],  //产品集合
        product: $.extend({}, productOpt), //当前产品
        productIndex: '', //当前产品索引

        areas: [
          {id: 1, name: '首页', children: []},
          {id: 2, name: '样品中心', children: []},
          {id: 3, name: '专业镇', children: []},
          {id: 4, name: '专业市场', children: []}
        ],
        page: {
          total: null,
          current: 1,
          perPage: 10
        },
        search: {
          area: null
        }
      }
    },
    route: {
      data: function(transition) {
        this.getArea();
        this.getProduct();
      }
    },
    methods: {

      filter: function(id) {
        this.search.area = id;
        this.page.current = 1;
        this.page.total = null;
        this.getProduct();
      },
      //楼层产品
      //获取产品
      getProduct: function () {
        var self = this;
        var params = $.extend({}, this.page, this.search);

        $.ajax({
          url: domain + '/product',
          data: params,
          type: 'GET',
        })
        .done(function(res) {
          if (1 == res.status) {
            self.page.total = res.count;
            self.products = res.data;
          }
        });
      },

      addProduct: function () {
        this.product = $.extend({}, productOpt);
        this.showProductModal = true;
      },
      editProduct: function (index) {
        this.product = this.products[index];
        this.productIndex = index;
        this.showProductModal = true;
      },
      //保存产品
      saveProduct: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.product));
        //楼层id
        $.ajax({
          url: domain + '/product',
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
            self.showProductModal = false;
          }
        });
      },
      //删除产品
      delProduct: function (id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/product/' + id,
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
      pageCallback: function(page) {
        this.page.current = page;
        this.getProduct();
      },

      getArea: function(){
        var self = this;
        $.ajax({
          url: domain + '/industrial',
          data: {perPage: 100},
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status && res.data) {
            var a = [];
            for (var i = 0; i < res.data.length; i++) {
              a.push({id: res.data[i]._id, name: res.data[i].name})
            }
            self.areas[2].children = a;
          }
        });

        $.ajax({
          url: domain + '/market',
          data: {perPage: 100},
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status && res.data) {
            var a = [];
            for (var i = 0; i < res.data.length; i++) {
              a.push({id: res.data[i]._id, name: res.data[i].name})
            }
            self.areas[3].children = a;
          }
        });

      }
    },

    filters: {
      areaText: function(val) {

        var res = '其他';
        if (val !== null && val !== undefined) {

          for (var i = this.areas.length - 1; i >= 0; i--) {
            if (this.areas[i].id == val) {
              res = this.areas[i].name;
              break;
            }
            var children = this.areas[i].children;
            if (children && children.length) {
              for (var x = children.length - 1; x >= 0; x--) {
                if (children[x].id == val) {
                  res = this.areas[i].name + ' - ' + children[x].name;
                  break;
                }
              }
            }
          }
        }
        return res;
      }
    },

    components: {
      dropdown: require('../components/dropdown.vue')
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
  .dropdown-area{
    max-height: 300px;
    overflow-y:auto;
  }
  .table-responsive{
    overflow: visible;
  }
</style>
