
<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>产业集群展贸活动邀请</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a href="#">栏目管理</a></li>
        <li class="active">产业集群展贸活动邀请</li>
      </ol>
    </div>
    <div class="content">
      <div class="mb10">
        <a class="btn btn-danger" href="/cms/exhinvite/recent.html" target="_blank">预览</a>
      </div>
      <div class="nav-tabs-custom theme-panel">
        <ul class="nav nav-tabs">
          <template v-for="item in industrialCates">
            <li @click="switchCate($index,item.id)"  :class="$index==currIndustrialIndex?'active':''">
              <a href="javascript:;" v-text="item.nameEn"></a>
            </li>
          </template>
          <li @click="switchCate(-1)"  :class="currIndustrialIndex==-1?'active':''">
            <a href="javascript:;" v-text="'Other'"></a>
          </li>
        </ul>
        <div class="tab-content">
          <div class="mb10">
            <div>
              <button type="button" class="btn btn-primary" @click="syncFairActive">同步展贸活动</button> 
              <!-- <button type="button" class="btn btn-default" @click="editCate" v-if="currIndustrialIndex>=0">编辑分类</button> -->
            </div>
          </div>
          <div class="panel panel-body panel-info">
            <table class="table table-hover" v-if="currIndustrialIndex>=0">
              <thead>
              	<th class="col-md-1 text-center">序号</th>
                <th class="col-md-4 text-center">集群名称</th>
                <th class="col-md-3 text-center">专业镇/专业市场</th>
                <th class="col-md-4 text-center">操作</th>
              </thead>
              <tbody>
                <tr v-for="(index,item) in clusters">
                  <td class="text-center" v-text="$index+1"></td>
                  <td class="text-center" v-text="item.nameEn"></td>
                  <td class="text-center" v-text="(item.clusterType==1)?'专业镇':'专业市场'"></td>
                  <td class="text-center">
                  	<a class="btn btn-primary" @click="adminFairActive(item)">管理活动邀请</a>
                    <!-- <a class="btn btn-default" @click="townFAshow(item,index)" v-text="(item.FAshow==1?'显示':'不显示') + '（展贸页面）'"></a> -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="table table-hover" v-if="currIndustrialIndex==-1">
              <thead>
                <th class="col-md-2 text-center">图片</th>
                <th class="col-md-3 text-center">名称</th>
                <th class="col-md-4 text-center">链接</th>
                <th class="col-md-1 text-center">排序</th>
                <th class="col-md-2 text-center">操作</th>
              </thead>
              <tbody>
                <tr v-for="(index,item) in fairActives">
                  <td class="text-center">
                    <img :src="item.cmsImg | resize 60 60 3">
                  </td>
                  <td class="text-center" v-text="item.name"></td>
                  <td class="text-center" v-text="item.link"></td>
                  <td class="text-center" v-text="item.sortId"></td>
                  <td class="text-center">
                    <a class="btn btn-primary" @click="editFair(item,index)">编辑</a>
                    <a class="btn btn-default" @click="editFair(item,index,2)" v-text="(item.isTop==1)?'显示':'不显示'"></a>
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

  <!-- 编辑集群类目 -->
  <modal :show.sync="showCate" title="集群类目">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndustrialCate">
        <div class="form-group">
          <label for="cateId" class="control-label col-sm-3">类目ID</label>
          <div class=" col-sm-9">
            <input class="form-control" type="number" name="cateId" id="cateId" disabled v-model="currentIndustrial.id" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-3" for="cateName">类目名</label>
          <div class=" col-sm-9">
            <input class="form-control" type="text" name="cateName" id="cateName" disabled v-model="currentIndustrial.nameEn">
          </div>
        </div>
        <div class="form-group">
          <label for="cateIsShow" class="col-sm-3 control-label">展贸页面显示</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="currentIndustrial.FAshow">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="currentIndustrial.FAshow">不显示
            </label>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-9 col-sm-offset-3">
            <button type="submit" class="btn btn-primary">提交</button>
          </div>
        </div>
      </form>
    </div>
    <div slot="modal-footer"></div>
  </modal>
  <!-- 活动邀请列表 -->
  <modal :show.sync="showFairs" :title="'管理' + clusterName + '活动邀请'" class="dialog-list-width">
  	<div slot="modal-body" class="modal-body">
  		<table class="table table-hover">
          <thead>
          	<th class="col-md-3 text-center">图片</th>
            <th class="col-md-4 text-center">名称</th>
            <th class="col-md-2 text-center">排序</th>
            <th class="col-md-3 text-center">操作</th>
          </thead>
          <tbody>
            <tr v-for="(index,item) in fairActives">
              <td class="text-center">
              	<img :src="item.cmsImg | resize 60 60 3">
              </td>
              <td class="text-center" v-text="item.name"></td>
              <td class="text-center" v-text="item.sortId"></td>
              <td class="text-center">
              	<a class="btn btn-primary" @click="editFair(item,index)">编辑</a>
                <a class="btn btn-default" @click="editFair(item,index,2)" v-text="(item.isTop==1)?'显示':'不显示'"></a>
              </td>
            </tr>
          </tbody>
        </table>
  	</div>
  	<div slot="modal-footer">
  		<div class="text-right dialog-pages">
  			<pages :total.sync="fairPage.total" :current="fairPage.current" :per-page="fairPage.perPage" :page-changed="dialogPageCallback"></pages>
  		</div>
  	</div>
  </modal>
  <!-- 编辑展贸活动 -->
  <modal :show.sync="showFairsAct" title="编辑展贸活动">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveFairActive">
        <div class="form-group">
          <label for="actName" class="control-label col-sm-2">名称</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="actName" id="actName" disabled v-model="currFairActive.name">
          </div>
        </div>
         <div class="form-group">
          <label class="control-label col-sm-2" for="FAsortId">排序</label>
          <div class=" col-sm-10">
            <input class="form-control" type="number" name="FAsortId" id="FAsortId" v-model="currFairActive.sortId">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="FAImg">图片</label>
          <div class=" col-sm-10">
            <upload :img.sync="currFairActive.cmsImg" tips="推荐尺寸:800px*320px" id="FAImg" text="上传图片">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="FAImg">APP图片</label>
          <div class=" col-sm-10">
            <upload :img.sync="currFairActive.appImg" tips="推荐尺寸:750px*480px" id="FAAPPImg" text="上传APP图片">
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
var currentTown = {nameEn:null,id:null,sortId:1,isTop: '0',appSortId:null};
var cateIndustrial = {id:null,nameEn:'',fairTop:null,FAshow:null};
var fairActive = {cmsImg:"",name:null,isTop:null,sortId:null,appImg:""}

  module.exports = {
    data: function() {
      return {
        showCate:false,
        showFairs:false,
        showFairsAct:false,
        // 集群
        clusters:[],
        currentTown:$.extend({},currentTown),
        // 展贸活动
        fairActives:[],
        currFairActive:$.extend({},fairActive),
        currFAIndex:0,
        
        currentTownIdx:null,
        currentIndustrialId:null,
        // 专业镇分类
        industrialCates:[],
        currentIndustrial:$.extend({},cateIndustrial),
        currIndustrialIndex:0,
        page: {
          total: null,
          current: 1,
          perPage: 10,
          industryId:null,
          clusterType:null
        },
        fairPage:{
          total:null,
          current:1,
          perPage:5
        },
        clusterName:'',
        iwId:null
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
            self.getCluster();
          }
        });
      },
      //获取集群
      getCluster: function() {
        var self = this;
        $.ajax({
          url: domain +'/industrial',
          data: this.page,
          type: 'GET'
        })
        .done(function(res) {
          self.clusters = null;
          if ('1' == res.status) {
            self.page.total = res.count;
            self.clusters = res.data;
          }
        });
      },
      // 编辑专业镇分类
      editCate:function(){
        // 获取当前的分类目。
        this.currentIndustrial =$.extend(true,{},this.industrialCates[this.currIndustrialIndex]);
        this.showCate = true;
      },
      // 转换专业镇分类
      switchCate:function(idx,cateId){
        var self = this;
        if (idx>=0) {
          this.page.current = 1;
          this.page.industryId = cateId;
          this.currIndustrialIndex = idx;
          this.currentIndustrial = this.industrialCates[this.currIndustrialIndex];
          this.currentIndustrialId = this.industrialCates[this.currIndustrialIndex]._id;
        }else{
          self.currIndustrialIndex = -1;

          self.iwId = 0;
          self.fairPage.perPage = 999999;
          self.getFairactive();
        }
        
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
            self.clusters.$set(self.currentTownIdx,params);
            self.showTown = false;
          };
        })
      },
      // 跳转页面
      pagerCallback: function(page) {
        this.page.current = page;
        this.getCluster();
      },
      dialogPageCallback:function(page){
        this.fairPage.current = page;
        this.getFairactive();

      },
      syncFairActive:function(){
      	var self = this;
      	$.ajax({
      		url:domain + "/fairactive/savefairactive",
      		type:"post",
      		dataType:'json'
      	}).done(function(res){
      		if (res.status!=1) return alert("同步失败！");
          alert("共" + res.count + "个活动，" + "同步了" + res.newCount + "个活动，" + "更新了" + res.updateCount + "个活动。");
      	})
      },
      adminFairActive:function(a){
      	var self = this;
        self.iwId = a.iwId
      	self.clusterName = a.nameEn;

        self.fairPage.perPage = 5;

        self.fairActives = [];

        self.getFairactive();

      	self.showFairs = true;

      },
      getFairactive:function(){
        var self = this;

        var params = {page:self.fairPage.current,pageSize:self.fairPage.perPage,iwId:self.iwId};

        $.ajax({
          url:domain + "/fairactive/getfairactive",
          type:"get",
          dataType:"json",
          data:params
        }).done(function(res){
          if (res.status == 1) {
            self.fairActives = res.data;
            self.fairPage.current = res.page;
            self.fairPage.perPage = res.pageSize;
            self.fairPage.total = res.total;
          }
        })

      },
      townFAshow:function(a,index){
        var self = this;

        var dataBody = JSON.parse(JSON.stringify(a));

        (dataBody.FAshow==1)?dataBody.FAshow=0:dataBody.FAshow=1;

        $.ajax({
          url:domain + "/industrial/zyz/sync",
          dataType:"json",
          type:"post",
          data:dataBody
        }).done(function(res){

          if (res.status==1) self.clusters.$set(index,dataBody);
        })
      },
      editFair:function(a,index,flag){
      	var self = this;
        self.currFairActive = $.extend({},self.currFairActive,a);
        self.currFAIndex = index;

        if (!flag) {
          self.showFairsAct = true;

        }else if (flag==2) {

          (self.currFairActive.isTop==1)?self.currFairActive.isTop=0:self.currFairActive.isTop=1;

          self.saveFairActive();
        }

        
      },
      saveFairActive:function(){
        var self = this;

        var dataBody = JSON.parse(JSON.stringify(self.currFairActive));

        $.ajax({
          url:domain + "/fairactive/savefairactive",
          type:"post",
          dataType:"json",
          data:dataBody
        }).done(function(res){
          if (res.status == 1) {
            self.fairActives.$set(self.currFAIndex,dataBody);
            self.showFairsAct = false;
          }
        })
      }
    },
    watch:{
      'currentIndustrialId':function(val,old){
        this.getCluster();
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
  .dialog-list-width>div.modal-dialog{
  	width: 1000px !important;
  }
  .dialog-list-width .modal-body{
  	max-height: 500px;
  	overflow-y: auto;
  }
  .dialog-pages{
  	padding: 0px 20px;
  }
</style>




