<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>产业集群</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a href="#">栏目管理</a></li>
        <li class="active">产业集群</li>
      </ol>
    </div>
    <div class="content">
      <div class="mb10">
        <button class="btn btn-primary" @click="syncZyz">同步产业集群</button>
        <button class="btn btn-primary" @click="syncCate">同步产业集群类目</button>
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
        <div class="tab-content">
          <div class="mb10">
            <div class="btn-group">
              <button type="button" class="btn btn-default" @click="editCate">编辑分类</button>
            </div>
          </div>
          <div class="panel panel-body panel-info">
            <table class="table table-hover">
              <thead>
                <th class="col-md-1 text-center">产业集群名称</th>
                <th class="col-md-3 text-center">logo</th>
                <th class="col-md-3 text-center">图片</th>
                <th class="col-md-1 text-center">pc排序</th>
                <th class="col-md-1 text-center">app排序</th>
                <th class="col-md-3 text-center">操作</th>
              </thead>
              <tbody>
                <tr v-for="item in towns">
                  <td class="text-center" v-text="item.nameEn"></td>
                  <td class="text-center uk-vertical-align"><img :src="item.logo | resize"></td>
                  <td class="text-center"><img :src="item.searchImage | resize" width="200" height="200"></td>
                  <td class="text-center" v-text="item.sortId">1</td>
                  <td class="text-center" v-text="item.appSortId">1</td>
                  <td class="text-center">
                    <a class="btn btn-primary" v-link="'/industrial/' + item.iwId + '?name='+item.nameEn">管理</a>
                    <a class="btn btn-primary" @click="editTown(item,$index)">编辑</a>
                    <!-- <a class="btn btn-primary" v-link="'/industrial/' + item.iwId+'/market'">管理批发中心</a> -->
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
  <!-- 编辑专业镇分类 -->
  <modal :show.sync="showCate" title="产业集群类目">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndustrialCate">
        <div class="form-group">
          <label for="cateId" class="control-label col-sm-2">类目ID</label>
          <div class=" col-sm-10">
            <input class="form-control" type="number" name="cateId" id="cateId" disabled v-model="currentIndustrial.id" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="cateName">类目名</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="cateName" id="cateName" disabled v-model="currentIndustrial.nameEn">
          </div>
        </div>
        <div class="form-group">
          <label for="cateImg" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="cateImg" text="上传图片" tips="推荐尺寸:390px*160px" :img.sync="currentIndustrial.img" disabled = disabled></upload>
          </div>
        </div>
        <div class="form-group">
          <label for="cateIconImg" class="col-sm-2 control-label">图标</label>
          <div class="col-sm-10">
            <upload id="cateIconImg" text="上传图标" :img.sync="currentIndustrial.iconImg" disabled = disabled></upload>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="currentIndustrial.sortId">
          </div>
        </div>
        <div class="form-group">
          <label for="cateIsShow" class="col-sm-2 control-label">是否显示</label>
          <div class="col-sm-10">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="currentIndustrial.state">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="currentIndustrial.state">不显示
            </label>
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

  <!-- 编辑专业镇 -->
  <modal :show.sync="showTown" title="产业集群">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTown">
        <div class="form-group">
          <label for="townId" class="control-label col-sm-3">ID</label>
          <div class=" col-sm-9">
            <input class="form-control" type="number" name="townId" id="townId" disabled v-model="currentTown.iwId">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-3" for="townName">产业集群名称</label>
          <div class=" col-sm-9">
            <input class="form-control" type="text" name="townName" id="townName" disabled v-model="currentTown.nameEn">
          </div>
        </div>
         <div class="form-group">
          <label class="control-label col-sm-3" for="sld">三级域名</label>
          <div class="col-sm-9 ">
            <input class="form-control" type="text" name="sld" id="sld" disabled v-model="currentTown.sld">
          </div>
        </div>

        <!-- <div class="form-group">
          <label for="townImg" class="col-sm-3 control-label">图片</label>
          <span>推荐尺寸：280px*180px</span>
          <div class="col-sm-9">
            <upload id="townImg" text="上传图片" :img.sync="currentTown.searchImage"></upload>
          </div>
        </div> -->
        <div class="form-group">
          <label class="control-label col-sm-3" for="townSortId">排序</label>
          <div class="col-sm-9 ">
            <input class="form-control" type="number" name="townSortId" id="townSortId" v-model="currentTown.sortId">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-3" for="appSortId">app排序</label>
          <div class="col-sm-9 ">
            <input class="form-control" type="number" name="appSortId" id="appSortId" v-model="currentTown.appSortId">
          </div>
        </div>
         <div class="form-group">
           <label class="control-label col-sm-3" for="townSortId">是否推荐</label>
            <div class="col-sm-9 ">
             <label class="radio-inline">
                <input type="radio" name="isTop" value="0" v-model="currentTown.isTop"> 推荐
              </label>
              <label class="radio-inline">
                <input type="radio" name="isTop" value="1" v-model="currentTown.isTop"> 不推荐
              </label>
             
            </div>
          </div>

        <div class="form-group">
          <div class="col-sm-9 col-sm-offset-2">
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
var currentTown = {nameEn:null,id:null,sortId:1,isTop: '0',appSortId:null};
var cateIndustrial = {id:null,nameEn:'',img:'',iconImg:'',sortId:null,state:null}

  module.exports = {
    data: function() {
      return {
        showCate:false,
        showTown:false,
        // 专业镇
        towns:[],
        currentTown:$.extend({},currentTown),
        
        currentTownIdx:null,
        currentIndustrialId:null,
        // 专业镇分类
        industrialCates:[],
        currentIndustrial:$.extend({},cateIndustrial),
        currIndustrialIndex:0,
        page: {
          total: null,
          current: 1,
          perPage: 5,
          industryId:null,
          clusterType:1
        }
      }
    },
    route: {
      data:function(transition) {
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
            self.getIndustrial();
          }
        });
      },
      //获取专业镇
      getIndustrial: function() {
        var self = this;
        $.ajax({
          url: domain +'/industrial',
          data: this.page,
          type: 'GET'
        })
        .done(function(res) {
          self.towns = null;
          if ('1' == res.status) {
            self.page.total = res.count;
            self.towns = res.data;
          }
        });
      },


      // 同步专业镇
      syncZyz: function() {
        var self = this;
        $.ajax({
          url: domain + '/industrial/zyz/sync',
          type: 'post',
          dataType: 'json',
        })
        .done(function(res) {
          if (res.status == 1) {
            alert('共' + res.count + '个专业镇，同步了' + res.updateCount + '专业镇');
            self.getIndustrial();
          }
        });
      },
      // 同步专业镇分类
      syncCate: function() {
        var self = this;
        $.ajax({
          url: domain + '/industrialIndexCate',
          type: 'post',
          dataType: 'json',
        })
        .done(function(res) {
          if (res.status == 1) {
            alert('共' + res.count + '个专业镇类目，同步了' + res.updateCount + '专业镇类目');
            self.getCate();
          }
        });
      },
      
      // 编辑专业镇分类
      editCate:function(){
        // 获取当前的分类目。
        this.currentIndustrial =$.extend(true,{},this.industrialCates[this.currIndustrialIndex]);
        this.showCate = true;
      },
      
      editTown:function(a,index){
        var self = this;
        self.currentTownIdx = index;
        self.currentTown = $.extend({},a);
        self.showTown = true;
      },
      // 转换专业镇分类
      switchCate:function(idx,cateId){
        this.page.current = 1;
        this.page.industryId = cateId;
        this.currIndustrialIndex = idx;
        this.currentIndustrial = this.industrialCates[this.currIndustrialIndex];
        this.currentIndustrialId = this.industrialCates[this.currIndustrialIndex]._id;
      },
      // 专业镇分类编辑后保存
      saveIndustrialCate:function(){
        var self = this;
        var param = JSON.parse(JSON.stringify(self.currentIndustrial));
        $.ajax({
          url:domain+'/industrialIndexCate',
          type:'post',
          dataType:'json',
          data:param
        })
        .done(function(res){
          if (res.status == 1) {
            self.industrialCates.$set(self.currIndustrialIndex,param);
            self.showCate = false;
          }
        })
      },
      // 专业镇保存
      saveTown:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(self.currentTown));
        $.ajax({
          url:domain + '/industrial/zyz/sync',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          if (res.status == 1) {
            self.towns.$set(self.currentTownIdx,params);
            self.showTown = false;
          };
        })
      },
      // 跳转页面
      pagerCallback: function(page) {
        this.page.current = page;
        this.getIndustrial();
      }
    },
    watch:{
      'currentIndustrialId':function(val,old){
        this.getIndustrial();
      }
    },
    components: {
      autoComplete: require('../components/autoComplete.vue')
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




