<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>类目管理</h1>
    </div>
    <div class="content">
      <div class="mb10" style="">
          <button class="btn btn-primary" @click="addCategory(1)"> <span class="glyphicon glyphicon-plus"></span> 添加顶级类目</button>
          <button class="btn btn-primary" @click="updateCache()">更新缓存</button>
      </div>
      <div class="nav-tabs-custom theme-panel">
        <ul class="nav nav-tabs">
          <template v-for="item in categorys">
            <li v-if="$index == currentCategoryIndex" class="active" @click="switchCategory(item._id, $index)">
              <a href="javascript:;">
                {{ item.name }}
              </a>
            </li>
            <li v-if="$index != currentCategoryIndex" @click="switchCategory(item._id, $index)">
              <a href="javascript:;">
                {{ item.name }}
              </a>
            </li>
          </template>
        </ul>
        <div class="tab-content" v-if="currentCategory._id">
          <div class="mb10">
            <div class="btn-group">
              <button type="button" class="btn btn-default" @click="addCategory(2, currentCategory._id)">添加子类目</button>
              <button type="button" class="btn btn-default" @click="editCategory(1, currentCategoryIndex)">编辑类目</button>
              <button type="button" class="btn btn-default" @click="delCategory(1, currentCategoryIndex)">删除类目</button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 col-md-6" v-for="(i, items) in currentCategory.children">
              <div class="box box-default">
                <div class="box-header with-border">
                  <h3 class="box-title"> {{items.name}} </h3>

                  <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" @click="addCategory(3, items._id, i)">
                      添加子类
                    </button>
                    <button type="button" class="btn btn-box-tool" @click="move(2, [i], items._id)">
                      移动
                    </button>
                    <button type="button" class="btn btn-box-tool" @click="editCategory(2, [i], items)">
                      编辑
                    </button>
                    <button type="button" class="btn btn-box-tool" @click="delCategory(2, [i], items._id)">
                      删除
                    </button>
                  </div>
                </div>
                <div class="box-body" style="display: block;">
                  <ul class="contacts-list">
                    <li class="" v-for="(index, item) in items.children">
                        <span class="pull-right">
                          <button type="button" class="btn btn-box-tool" @click="move(3, [i, index], item._id)">
                            移动
                          </button>
                          <button type="button" class="btn btn-box-tool" @click="editCategory(3, [i, index], item)">
                            编辑
                          </button>
                          <button type="button" class="btn btn-box-tool" @click="delCategory(3, [i, index], item._id)">
                            删除
                          </button>
                        </span>
                        {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  <!--添加类目-->
  <modal :show.sync="showModal" title="类目">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveCategory">
        <div class="form-horizontal">
          <!-- <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">父级类目</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="newCategory.parentid">
            </div>
          </div> -->
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">名字</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="newCategory.name" required>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" v-model="newCategory.link">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="newCategory.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="inputPassword3" class="col-sm-2 control-label">是否显示</label>
            <div class="col-sm-10">
              <input type="radio" name="ishidden" value="1" v-model="newCategory.ishidden"> 是
              <input type="radio" name="ishidden" value="0" v-model="newCategory.ishidden"> 否
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
  <modal :show.sync="moveModal" title="移动类目">
    <div slot="modal-body" class="modal-body">
      <div class="alert">
        <strong>提示:</strong>
        <p>移动后， 不能还原，请谨慎修改 <br>
        类目最多只有3级；
        移动到1级菜单时，不改变该菜单的子菜单；移动到2级菜单时，该菜单的子菜单也一并移动。
        </p>
      </div>
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveMove">
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">类目</label>
          <div class="col-sm-10">
            <select v-model="moveCategory.target" class="form-control">
              <template v-for="(x, menus) in categorys">
                <option :value="'1|[' + x +']|' + menus._id">{{menus.name}}</option>
                <option
                  v-if="menus.children && menus.children.length"
                  v-for="(y, menu) in menus.children"
                  :value="'2|[' + x + ',' + y + ']|' + menu._id">
                  &nbsp;&nbsp;|- {{menu.name}}
                </option>
              </template>
            </select>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-10 col-sm-offset-2">
            <button class="btn btn-primary" type="submit">
              提交
            </button>
          </div>
        </div>
      </form>
    </div>
    <div slot="modal-footer"></div>
  </modal>
</template>
<script>

  //类目管理， 最多3级。

  var toTreeData = require('../util/tree');

  var categoryOpt = {
    parentid: '0',
    ishidden: 1,
    sortId: 10,
    children: []
  };

  module.exports = {
    data: function() {
      return {
        showModal: false,
        moveModal: false,
        //类目
        categorys: [],
        currentCategory: $.extend({}, categoryOpt), //
        currentCategoryIndex: 0,  //当前楼层索引
        newCategory: $.extend({}, categoryOpt),

        //移动类目
        moveCategory: {
          target: null,
          originId: null,
          originLevel: null
        }
      }
    },
    route: {
      data: function(tranition) {
        this.getCategory()
      }
    },
    methods: {
      //楼层
      //获取楼层
      getCategory: function() {
        var self = this;
        $.ajax({
          url: domain + '/category',
          type: 'GET'
        })
        .done(function(res) {
          if (1 == res.status) {
            var a = toTreeData(res.data, 0);
            self.categorys = a;
            self.currentCategory = $.extend({}, categoryOpt, a[self.currentCategoryIndex]);
          }
        });
      },
      //添加楼层
      addCategory: function(zIndex, id, index) {
        var self = this;
        if (id) {
          categoryOpt.parentid = id;
        }
        this.newCategory = $.extend({}, categoryOpt, {zIndex: zIndex, index: index});
        this.showModal = true;
      },
      //编辑楼层
      // zIndex 层级 indexs 数组  item 对象
      editCategory: function(zIndex, indexs, item) {
        var self = this;
        //只有顶级不传item，
        item = item || this.categorys[indexs];

        indexs = indexs || [];
        delete item.children;
        self.newCategory = $.extend({}, item, {zIndex:zIndex, index: indexs});
        this.showModal = true;
      },
      //保存
      saveCategory: function() {
        var self = this;
        var param = JSON.parse(JSON.stringify(self.newCategory));
        $.ajax({
          url: domain + '/category',
          type: 'post',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            // 新增
            if (!param._id) {
              param._id = res.data._id;
              switch (param.zIndex) {
                case 1:
                  self.categorys.push(param);
                  break;
                case 2:
                  self.currentCategory.children.push(param);
                  break;
                case 3:
                  self.currentCategory.children[self.newCategory.index].children.push(param);
                  break;
              }
            }
            // 更新
            else {
              switch (param.zIndex) {
                case 1:
                  self.categorys.$set(self.currentCategoryIndex, param);
                  break;
                case 2:
                  self.currentCategory.children.$set(self.newCategory.index[0], param);
                  break;
                case 3:
                  self.currentCategory.children[self.newCategory.index[0]]
                    .children.$set(self.newCategory.index[1], param);
                  break;
              }
            }
            self.showModal = false;
          }
        });
        return false;
      },
      //删除楼层
      delCategory: function(zIndex, index, id) {
        var self = this;
        id = id || this.currentCategory._id
        if (confirm('确定删除？')) {
          if (id) {
            $.ajax({
              url: domain + '/category/' + id,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                switch (zIndex) {
                  case 1:
                    self.categorys.splice(self.currentCategoryIndex, 1);
                    var a = (self.currentCategoryIndex >= self.categorys.length)
                            ? self.categorys.length : self.currentCategoryIndex;
                    self.currentCategory = self.categorys[a];
                    break;
                  case 2:
                    self.currentCategory.children.splice(index[0], 1);
                    break;
                  case 3:
                    self.currentCategory.children[index[0]].children.splice(index[1], 1);
                    break;
                }
              }
            })
          }
        }
      },
      updateCache: function(){
        $.ajax({
          url: domain + '/category/cache',
          type: 'POST'
        })
        .done(function(res) {
          console.log(res);
          if (1 == res.status) {
            alert('更新成功')
          }
        })
      },
      move: function(zIndex, coord, id){
        this.moveModal = true;
        this.moveCategory.originLevel = zIndex;
        this.moveCategory.originId = id;
        this.moveCategory.originCoord = coord;
      },
      saveMove: function() {
        if(!confirm('确定移动？')) return;
        var self = this;
        var params = {
          targetId: this.moveCategory.target.split('|')[2]
        };
        //移动到一级菜单
        if (this.moveCategory.target.split('|')[0] == 2 && this.moveCategory.originLevel == 2) {
          var ids = [this.moveCategory.originId];
          var currentMenu = this.currentCategory.children[this.moveCategory.originCoord[0]];
          currentMenu.children.forEach(function(item){
            ids.push(item._id);
          })
          params.originIds = ids.join(',');
        } else {
          params.originIds = this.moveCategory.originId
        }
        $.ajax({
          url: domain + '/category/move',
          type: 'POST',
          data: params,
        })
        .done(function(res) {
          if (1 == res.status) {
            //移动的数据太麻烦了， 还是重新获取
            self.getCategory();
            self.moveModal = false;
          }
        });
      },
      switchCategory: function(id, index) {
        this.currentCategoryIndex = index;
        this.currentCategory = this.categorys[index];
      }
    }
  }

  //递归生成树形结构

</script>


<style>
  .contacts-list li{
    padding: 0;
    line-height: 30px;
  }
  .alert{
    background: #f4f4f4;
    border:1px solid #ddd;
  }
</style>
