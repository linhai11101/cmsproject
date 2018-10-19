<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>首页</h1>
    </div>
    <div class="content">
      <div class="mb10" style="">
          <button class="btn btn-primary" @click="addFloor"> <span class="glyphicon glyphicon-plus"></span> 添加楼层</button>
          <a class="btn btn-danger" href="/" target="_blank">预览</a>
          <!-- <button class="btn btn-danger" @click="createStatic">生成静态页面</button> -->
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
        </ul>
        <div class="tab-content">
          <div class="mb10">
            <div class="btn-group">
              <button type="button" class="btn btn-default" @click="editFloor">修改楼层</button>
              <button type="button" class="btn btn-default" @click="delFloor">删除楼层</button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-5">
              <div class="box box-default">
                <div class="box-header with-border">
                  <h3 class="box-title">产品</h3>
                  <div class="box-tools pull-right">
                    <a href="javascript:;" class="btn btn-xs btn-default"
                      @click="addProduct">
                      添加产品
                    </a>
                  </div>
                </div>
                <div class="box-body">
                  <div class="row">
                    <table class="table table-hover">
                      <tr>
                        <th style="width:50%">产品</th>
                        <th>显示位置</th>
                        <th>管理</th>
                      </tr>
                      <tr v-for="item in products">
                        <td>
                          <a v-bind:href="item.link" target="_blank" class="media">
                            <span class="media-left">
                              <img v-bind:src="item.img | resize" alt="" width="100">
                            </span>
                            <span class="media-body">
                              {{ item.title }}
                            </span>
                          </a>
                        </td>
                        <td>
                          {{item.type | visual}}
                        </td>
                        <td>
                          <button class="btn btn-sm btn-primary" @click="editProduct($index)">编辑</button>
                          <button class="btn btn-sm btn-default" @click="delProduct(item._id, $index)">删除</button>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="box box-default">
                <div class="box-header with-border">
                  <h3 class="box-title">logo</h3>
                  <div class="box-tools pull-right">
                    <a href="javascript:;" class="btn btn-xs btn-default"
                      @click="addLogo">
                      添加logo
                    </a>
                  </div>
                </div>
                <div class="box-body">
                  <div class="row">
                    <table class="table table-hover">
                      <tr>
                        <th style="width:50%">名字</th>
                        <th>管理</th>
                      </tr>
                      <tr v-for="item in logos">
                        <td>
                          <a v-bind:href="item.link" target="_blank" class="media">
                            <span class="media-left">
                              <img v-bind:src="item.img | resize" alt="" width="100">
                            </span>
                            <span class="media-body">
                              {{ item.title }}
                            </span>
                          </a>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-primary" @click="editLogo($index)">编辑</button>
                          <button class="btn btn-sm btn-default" @click="delLogo(item._id, $index)">删除</button>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="box box-default">
                <div class="box-header with-border">
                  <h3 class="box-title">链接</h3>
                  <div class="box-tools pull-right">
                    <a href="javascript:;" class="btn btn-xs btn-default"
                      @click="addLink">
                      添加链接
                    </a>
                  </div>
                </div>
                <div class="box-body">
                  <div class="row">
                    <table class="table table-hover">
                      <tr>
                        <th style="width:50%">名字</th>
                        <th>管理</th>
                      </tr>
                      <tr v-for="item in links">
                        <td>
                          <a v-bind:href="item.link" target="_blank">
                            {{ item.title }}
                          </a>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-primary" @click="editLink($index)">编辑</button>
                          <button class="btn btn-sm btn-default" @click="delLink(item._id, $index)">删除</button>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--添加楼层-->
  <modal :show.sync="showModal" title="楼层">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveFloor">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">楼层名</label>
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
      <form class="form-horizontal"  v-ajax-submit @submit.prevent="saveProduct">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品名</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="product.title" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品图片</label>
            <div class="col-sm-10">
              <upload id="pick-product" text="上传图片" :img.sync="product.img"></upload>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品链接</label>
            <div class="col-sm-10">
              <input type="url" class="form-control" v-model="product.link">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">产品位置</label>
            <div class="col-sm-10">
              <label class="radio-inline">
                <input type="radio" name="type" value="a" v-model="product.type">
                banner
              </label>
              <label class="radio-inline">
                <input type="radio" name="type" value="b" v-model="product.type">
                其他产品
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="product.sortId">
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

  <!--添加logo-->
  <modal :show.sync="showLogoModal" title="logo">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveLogo">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">名字</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="logo.title" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">图片</label>
            <div class="col-sm-10">
              <upload id="pick1" text="上传图片" :img.sync="logo.img"></upload>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="url" class="form-control" v-model="logo.link">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="logo.sortId">
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

  <!--添加链接-->
  <modal :show.sync="showLinkModal" title="链接">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveLink">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">名字</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="link.title" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="url" class="form-control" v-model="link.link">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="link.sortId">
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

  var Vue = require('vue');
  Vue.filter('visual', function (value) {
    var res = '';

    switch (value) {
      case 'a':
        res = 'banner';
        break;
      case 'b':
        res = '其他产品';
        break;
    }

    return res;
  })

  //楼层配置
  var floorOpt = {
    name: '',
    sortId: 1,
    state: '1'
  }

  //产品默认配置
  var productOpt = {
    sortId: 1,
    type: 'b'
  }

  //logo默认配置
  var logoOpt = {
    sortId: 1
  }

  //link默认配置
  var linkOpt = {
    sortId: 1
  }


  module.exports = {
    data: function() {
      return {
        showModal: false,
        showProModal: false,
        showLogoModal: false,
        showLinkModal: false,
        showsinkModal: false,

        uploadPro: '',
        uploadLogo: '',

        //楼层
        floors: [],
        currentFloor: $.extend({}, floorOpt), //
        currentFloorIndex: 0,  //当前楼层索引
        newFloor: $.extend({}, floorOpt),

        //产品
        products: [],  //产品集合
        product: $.extend({}, productOpt), //当前产品
        productIndex: '', //当前产品索引

        //logo
        logos: [],  //logo集合
        logo: $.extend({}, logoOpt), //当前logo
        logoIndex: '', //当前logo索引

        //logo
        links: [],  //link集合
        link: $.extend({}, linkOpt), //当前link
        linkIndex: '' //当前link索引
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
          url: domain + '/indexFloor',
          type: 'GET'
        })
        .done(function(res) {
          if ('1' == res.status) {
            self.floors = res.data;

            self.currentFloor = res.data[0];
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
          url: domain + '/indexFloor',
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
      },
      //删除楼层
      delFloor: function() {
        var self = this;
        if (confirm('确定删除？')) {
          if (this.currentFloor._id) {
            $.ajax({
              url: domain + '/indexFloor/' + this.currentFloor._id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.floors.splice(self.currentFloorIndex, 1);
                //self.currentFloorIndex = 0;
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
          url: domain + '/indexProduct/' + floorid,
          type: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          if (1 == res.status) {
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
          url: domain + '/indexProduct',
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
              url: domain + '/indexProduct/' + id,
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

      //楼层logo
      //获取logo
      getLogo: function () {
        var self = this;
        var floorid = this.currentFloor._id;
        $.ajax({
          url: domain + '/indexLogo/' + floorid,
          type: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          if (1 == res.status) {
            self.logos = res.data;
          }
        });
      },
      addLogo: function () {
        this.logo = $.extend({}, logoOpt);
        this.showLogoModal = true;
      },
      editLogo: function (index) {
        this.logo = this.logos[index];
        this.logoIndex = index;
        this.showLogoModal = true;
      },
      //保存logo
      saveLogo: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.logo));
        //楼层id
        param.floorid = this.currentFloor._id;
        $.ajax({
          url: domain + '/indexLogo',
          type: 'POST',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.logos.$set(self.logoIndex, param);
            } else {
              param._id = res.data._id;
              self.logos.push(param);
            }
            self.showLogoModal = false;
          }
        });
      },
      //删除logo
      delLogo: function (id, index) {
        var self = this;
        // && confirm('确认要删除吗？')
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/indexLogo/' + id,
              type: 'delete'
            })
            .done(function(res) {
              if (1 == res.status) {
                self.logos.splice(index, 1);
              }
            });
          }
        }
      },


      //楼层link
      //获取link
      getLink: function () {
        var self = this;
        var floorid = this.currentFloor._id;
        $.ajax({
          url: domain + '/indexLink/' + floorid,
          type: 'GET',
          dataType: 'json'
        })
        .done(function(res) {
          if (1 == res.status) {
            self.links = res.data;
          }
        });
      },
      addLink: function () {
        this.link = $.extend({}, linkOpt);
        this.showLinkModal = true;
      },
      editLink: function (index) {
        this.link = this.links[index];
        this.linkIndex = index;
        this.showLinkModal = true;
      },
      //保存link
      saveLink: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.link));
        //楼层id
        param.floorid = this.currentFloor._id;
        $.ajax({
          url: domain + '/indexLink',
          type: 'POST',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.links.$set(self.linkIndex, param);
            } else {
              param._id = res.data._id;
              self.links.push(param);
            }
            self.showLinkModal = false;
          }
        });
      },
      //删除link
      delLink: function (id, index) {
        var self = this;
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/indexLink/' + id,
              type: 'delete'
            })
            .done(function(res) {
              if (1 == res.status) {
                self.links.splice(index, 1);
              }
            });
          }
        }
      },

      createStatic: function() {
        $.ajax({
          url: domain + '/create/index',
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
      'currentFloor._id': function(val, old) {
      //'currentFloorIndex': function(val, old) {
        this.getProduct();
        this.getLogo();
        this.getLink();
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
