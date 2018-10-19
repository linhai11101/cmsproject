<template>
	<side-menu></side-menu>
	  <div class="content-wrapper">
    <div class="content-header">
      <h1>appbanner</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a href="#">栏目管理</a></li>
        <li class="active">appbanner</li>
      </ol>
    </div>
    <div class="content">
      <div class="mb10">
        <!-- <button class="btn btn-primary" @click="syncZyz">同步专业镇</button>
        <button class="btn btn-primary" @click="syncCate">同步产业集群类目</button> -->
        <!-- <a class="btn btn-danger" href="/industrial" target="_blank">预览</a> -->
      </div>
      <div class="nav-tabs-custom theme-panel">
        <ul class="nav nav-tabs">
          <template v-for="item in industrialCates">
            <li @click="switchCate($index,item.id)"  :class="$index==currIndustrialCate?'active':''">
              <a href="javascript:;" v-text="item.nameEn">
              </a>
            </li>
          </template>
        </ul>
        <div class="tab-content">
          <div class="mb10">
            <div class="btn-group">
              <button type="button" class="btn btn-default" @click="addAppBanner(null,null)">添加appbanner</button>
            </div>
          </div>
          <div class="panel panel-body panel-info">
            <table class="table table-hover">
              <thead>
                <th class="col-md-2 text-center">序号</th>
                <th class="col-md-4 text-center">图片</th>
                <th class="col-md-2 text-center">排序</th>
                <th class="col-md-4 text-center">操作</th>
              </thead>
              <tbody>
              	<!-- <tr>
              	  <td class="text-center">1</td>
                  <td class="text-center"><img src="" width="200" height="200"></td>
                  <td class="text-center">1</td>
                  <td class="text-center">
                    <a class="btn btn-primary" @click="addAppBanner()">编辑</a>
                    <button class="btn btn-default" @click="delAppBanner()">删除</button>
                  </td>
              	</tr> -->
                <tr v-for="item in appbanners">
                  <td class="text-center" v-text="$index+1"></td>
                  <td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
                  <td class="text-center" v-text="item.sortId">1</td>
                  <td class="text-center">
                    <a class="btn btn-primary" @click="addAppBanner(item,$index)">编辑</a>
                    <button class="btn btn-default" @click="delAppBanner(item._id, $index)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 添加appbanner -->
  <modal :show.sync="showAppBanner" title="专业镇分类">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveAppBanner">
        <div class="form-group">
          <label for="cateId" class="control-label col-sm-2">分类ID</label>
          <div class=" col-sm-10">
            <input class="form-control" type="number" name="cateId" id="cateId" disabled v-model="currentAppBanner.industryId">
          </div>
        </div>
        <div class="form-group">
          <label for="cateImg" class="col-sm-2 control-label">AppBanner</label>
          <div class="col-sm-10">
            <upload id="cateImg" text="上传图片" :img.sync="currentAppBanner.img"></upload>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="currentAppBanner.sortId">
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="link">链接</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="text" name="link" id="link" v-model="currentAppBanner.link">
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
  	var currentAppBanner = {industryId:null,nameEn:null,sortId:null,img:null,link:null};

  	module.exports = {
  		data:function(){
  			return {
  				currentAppBanner:$.extend({},currentAppBanner),
  				showAppBanner:false,
  				industrialCates:null,
  				appbanners:null,
  				currIndustrialCate:0,
  				currentIdx:null,

  				industryId:10

  			}
  		},
  		route:{
  			data:function(transition){
  				this.getCate();
  			}
  		},
  		methods:{
  			 // 获取专业镇分类
      		getCate:function(){
      		  var self = this;
      		  $.ajax({
      		    url:domain + '/industrialIndexCate',
      		    dataType:'json',
      		    type: 'GET',
      		    data:null
      		  })
      		  .done(function(res) {
      		    if ('1' == res.status) {
      		      console.log(res);
      		      self.industrialCates = res.data;
      		      self.getAppBanner();
      		    }
      		  });
      		},
      		// 获取appbanner
      		getAppBanner:function(){
      			var self = this;
      			$.ajax({
      				url:domain + '/industrial/appbanner/' + self.industryId,
      				dataType:'json',
      				type:'GET',
      				data:null
      			})
      			.done(function(res){
      				console.log(res);
      				if (res.status == 1) {
      					self.appbanners = res.data;
      				}
      			})

      		},
  			addAppBanner:function(a,index){
  				var self = this;
				if (a) {
					self.currentIdx = index;
					self.currentAppBanner = $.extend({},a);
				};
				if (!a) {
					self.currentAppBanner = $.extend({},currentAppBanner);
          self.currentAppBanner.industryId = self.industryId;
				};
				self.showAppBanner = true;
		
      		},
      		saveAppBanner:function(){
      			var self = this;
      			var params = JSON.parse(JSON.stringify(self.currentAppBanner));
            console.log(params);
      			$.ajax({
        		  url:domain + '/industrial/appbanner',
        		  type:'post',
        		  dataType:'json',
        		  data:params
        		})
        		.done(function(res){
        		  if (res.status == 1) {
          			if (params._id) {
          			    self.appbanners.$set(self.currentIdx,params);
          			  }else{
          			    params._id = res.data._id;
          			    self.appbanners.unshift(params);
          			  };
          			  self.showAppBanner = false;
          			}
        		})
      		},
      		delAppBanner:function(ids,index){
      			var self = this;
        		if (window.confirm('确定要删除吗？')) {
        		  if (ids) {
        		    $.ajax({
        		      url:domain + '/industrial/appbanner/' + ids,
        		      type:'delete',
        		      dataType:'json'
        		    })
        		    .done(function(res){
        		      if (res.status == 1) {
        		        self.getAppBanner();
        		      }
        		    })
        		  }
        		}
      		},
      		switchCate:function(idx,cateId){
      		  this.industryId = cateId;
      		  this.currIndustrialCate = idx;
      		  this.getAppBanner();
      		},
  		},
  		watch:{
    	  // 'currentIndustrialId':function(val,old){
    	  //   this.getIndustrial();
    	  // }
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