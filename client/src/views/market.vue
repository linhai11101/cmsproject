<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>批发中心</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a href="#">栏目管理</a></li>
        <li class="active">专业市场</li>
      </ol>
    </div>
    <div class="content">
      <div class="mb10">
       <button class="btn btn-primary" @click="syncMarket">同步批发中心</button>
       <!-- <button class="btn btn-primary" @click="cutMarketData">切割数据</button> -->
       <a class="btn btn-danger" href="/industrial.html" target="_blank">预览</a>
     </div>
     <div class="nav-tabs-custom theme-panel">
      <ul class="nav nav-tabs">
        <template v-for="item in industrialCates">
          <li @click="switchCate($index,item.id)"  :class="$index==currIndustrialIndex?'active':''">
            <a href="javascript:;" v-text="item.nameEn">
              </a>
          </li>
        </template>
      </ul>
      </div>
     <div class="row">
      <div class="col-xs-12">
        <div class="box">
          <div class="box-body table-responsive no-padding">
            <table class="table table-hover">
              <tr>
                <th class="col-xs-5">批发中心名称</th>
                <th class="col-xs-5">主营产品</th>
                <th class="col-xs-2 bt-center">操作</th>
              </tr>
              <tr v-for="item in markets">
                <td>{{item.nameEn}}</td>
                <td>{{item.mainProduct}}</td>
                <td class="bt-center">
                  <a class="btn btn-primary" v-link="'/market/' + item.iwId">管理</a>
                  <button class="btn btn-primary" @click="editMarket($index)">编辑</button>
                </td>
              </tr>
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
</div>

<!--添加产品-->
<modal :show.sync="showModal" title="批发中心">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal" v-ajax-submit @submit.prevent="saveMarket">
      <div class="form-horizontal">
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">批发中心</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="market.nameEn"  disabled="true" required>
          </div>
        </div>
        <!-- <div class="form-group" style="position:relative">
          <label for="inputEmail3" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="pick-img" :img.sync="market.img"></upload>
          </div>
          <span style="position:absolute;left:225px;top:5px;">推荐尺寸：260px*158px</span>
        </div> -->
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">是否显示</label>
          <div class="col-sm-10">
            <label class="radio-inline">
              <input type="radio" name="isTop" value="0" v-model="market.isTop"> 推荐
            </label>
            <label class="radio-inline">
              <input type="radio" name="isTop" value="1" v-model="market.isTop"> 不推荐
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
  var webupload = require('../util/webupload/webuploader.min');

  var marketOpt = {id:null,sortId: 10,appSortId: 999,ishidden: '1',name:null,img:'',isTop:'0'};

  module.exports = {
    data: function() {
      return {
        showModal: false,
        showFloorModal: false,
        toggleSearch: true,
        num:null,
        markets: [],
        market: $.extend({}, marketOpt),
        marketIndex: '',
        page: {
          total: null,
          current: 1,
          perPage: 10,
          industryId:10
        },
        search: {
          iwId: this.$route.params.id
        },
        industrialCates:[],
        currIndustrialIndex:0,
        currentIndustrial:{
          id:1,
          name:'',
          sortId:1,
          state:1
        }
      }
    },
    route: {
      data: function(transition) {
       this.getMarket();
       this.getCate();
     }
   },
   methods: {
    // 获取专业镇分类
      getCate:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrialIndexCate',
          dataType:'json',
          type: 'GET',
          data:''
        })
        .done(function(res) {
          if ('1' == res.status) {
            self.industrialCates = res.data;
            self.currentIndustrial =$.extend(true,{},self.industrialCates[self.currIndustrialIndex]);
            self.page.industryId = self.currentIndustrial.id;
            self.getMarket();
          }
        });
      },
      // 转换专业镇分类
      switchCate:function(idx,cateId){
        this.page.current = 1;
        this.page.industryId = cateId;
        this.currIndustrialIndex = idx;
        this.currentIndustrial = this.industrialCates[this.currIndustrialIndex];
        this.page.industryId = this.currentIndustrial.id;
        this.getMarket();
      },
      //获取
      syncMarket: function() {
        var self = this;
        var iwId = this.search.iwId;
        $.ajax({
          url: domain + '/syncZysc',
          data: {iwId:iwId},
          type: 'GET'
        })
        .done(function(res) {
          if(res.status == 1){
           alert('同步了'+res.count+'个专业市场');
           self.getMarket();
         }else{
           alert('同步了0个专业市场');
         }  
       });
      },
      getMarket: function() {
        console.log(123);
        var self = this;
        var params = $.extend({}, this.page);
        $.ajax({
          url: domain + '/market',
          data: params,
          type: 'GET'
        }).done(function(res) {
            if (res.status == '1') {
              self.page.total = res.count;
              self.markets = res.data;
            }else{
              self.page.total = 0;
              self.markets = [];
            };
        });
      },
      saveMarket: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.market));
        $.ajax({
          url: domain + '/market',
          type: 'POST',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              self.markets.$set(self.marketIndex, param);
            } else {
              param._id = res.data._id;
              self.markets.push(param);
            }
            self.showModal = false;
          }
        });
      },
      editMarket: function (index) {
        this.market = this.markets[index];
        this.marketIndex = index;
        this.showModal = true;
      },
      //分页回调函数
      pagerCallback: function(page) {
        this.page.current = page;
        this.getMarket();
      },
      cutMarketData:function(){
        if (confirm('切割数据将会改变旧数据结构，请慎重考虑后再切割！')) {
          $.ajax({
            url: domain + '/market/cutdata',
            type: 'post',
            dataType: 'json',
            data: {},
          }).done(function(res) {
            alert(res.msg);
            console.log(res.msg);
          }).fail(function(err) {
            console.log("error");
            console.log(err);
          }).always(function() {
            console.log("complete");
          });
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
</style>
