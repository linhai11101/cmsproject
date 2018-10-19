<template>
	<side-menu></side-menu>
	<div class="content-wrapper">
		<div class="content-header">
			<!-- <h1 v-text="queryObj.name"></h1> -->
			<!-- <ol class="breadcrumb">
				<li><a href="/"><i class="fa fa-dashboard" target="_blank"></i> 首页</a></li>
				<li><a v-link="{ path: '/industrial' }" target="_blank">专业镇</a></li>
			</ol> -->
		</div>
		<div class="content">
			<div class="mb10">
				<a class="btn btn-danger" :href="'/cms/activity-forecast/' + parentId + '.html'" target="_blank">预览</a>
			</div>
			<div>
				<div class="nav-tabs-custom theme-panel mb10">
					<ul class="nav nav-tabs nav-justified">
						<li :class="{active: visibility == 'category'}" @click="cutNav('category')">
							<a href="javascript:;">
								类目
							</a>
						</li>
						<li :class="{active: visibility == 'forecast'}" @click="cutNav('forecast')">
							<a href="javascript:;">
								活动预告
							</a>
						</li>
					</ul>
				</div>
				<div class="panel panel-body panel-info ">
					<!-- 类目 -->
                	<div class="row col-sm-12" v-show="visibility == 'category'">
                	  <div class="panel-heading">
                	    <button type="button" class="btn btn-primary btn-sm" @click="addCate(null,null)">添加类目</button> 
                	  </div>
                	  <table class="table table-bordered table-hover">
                	    <thead>
                	      <tr>
                	        <th class="col-md-3 bt-center">类目名</th>
                	        <th class="col-md-3 bt-center">链接</th>
                	        <th class="col-md-3 bt-center">排序</th>
                	        <th class="col-md-3 bt-center">管理</th>
                	      </tr>
                	    </thead>
                	    <tbody>
                	      <tr v-for="item in cateList">
                	        <td class="bt-center" v-text="item.name"></td>
                	        <td class="bt-center" v-text="item.link"></td>
                	        <td class="bt-center" v-text="item.sortId"></td>
                	        <td class="bt-center">
                	          <button class="btn btn-primary btn-sm" @click="addCate(item,$index)">编辑</button>
                	          <button class="btn btn-default btn-sm" @click="delCate(item._id,$index)">删除</button>
                	        </td>
                	      </tr>
                	    </tbody>
                	  </table>
                	</div>
                	<!-- 活动预告 -->
              		<div class="col-sm-12" v-show="visibility == 'forecast'">
              		  <div class="panel-heading">
              		      <button type="button" class="btn btn-primary btn-sm" @click="addForecast(null,null)">添加预告</button>   
              		    </div>
              		    <table class="table table-bordered table-hover">
              		      <thead>
              		        <tr>
              		          <th class="col-md-2 bt-center">图片</th>
              		          <th class="col-md-1 bt-center">标题</th>
              		          <th class="col-md-1 bt-center">描述</th>
              		          <th class="col-md-1 bt-center">活动时间</th>
              		          <th class="col-md-2 bt-center">参与主体</th>
              		          <th class="col-md-2 bt-center">活动目的</th>
              		          <th class="col-md-2 bt-center">排序</th>
              		          <th class="col-md-2 bt-center">管理</th>
              		        </tr>
              		      </thead>
              		      <tbody>
              		        <tr v-for="item in forecastList">
              		          <td class="bt-center"><img :src="item.img | resize" width="100" height="100"></td>
              		          <td class="bt-center" v-text="item.title"></td>
              		          <td class="bt-center" v-text="item.describe"></td>
              		          <td class="bt-center" v-text="item.time"></td>
              		          <td class="bt-center" v-text="item.participant"></td>
              		          <td class="bt-center" v-text="item.sortId"></td>
              		          <td class="bt-center" v-text="item.target"></td>
              		          <td class="bt-center">
              		            <button type="button" class="btn btn-primary btn-sm" @click="addForecast(item,$index)">编辑</button>
              		            <button type="button" class="btn btn-default btn-sm" @click="delForecast(item._id,$index)">删除</button>
              		          </td>
              		        </tr>
              		      </tbody>
              		    </table>
              		</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 类目 -->
	<modal :show.sync="showCate" title="类目">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveCate">
        <div class="form-group">
          <label class="control-label col-sm-2" for="name">名称</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="name" id="name" v-model="currCate.name" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="link">链接</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="link" id="link" v-model="currCate.link" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="cateSortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="cateSortId" id="cateSortId" v-model="currCate.sortId">
          </div>
        </div>
        <div class="form-group">
          <label for="cateIsShow" class="col-sm-2 control-label">是否推荐</label>
          <div class="col-sm-10">
            <label class="radio-inline">
              <input type="radio" name="option" id="isCateShow" value="1" v-model="currCate.ishidden">推荐
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unCateShow" value="0" v-model="currCate.ishidden">不推荐
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
  <!-- 预告 -->
	<modal :show.sync="showForecast" title="活动预告">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveForecast">
        <div class="form-group">
          <label class="control-label col-sm-2" for="title">标题</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="title" id="title" v-model="currForecast.title" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="describe">描述</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="describe" id="describe" v-model="currForecast.describe" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="time">活动时间</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="time" id="time" v-model="currForecast.time" required>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="participant">参与主体</label>
          <div class=" col-sm-10">
            <!-- <input class="form-control" type="text" name="participant" id="participant" v-model="currForecast.participant" required> -->
            <textarea class="form-control" type="text" name="participant" id="participant" v-model="currForecast.participant" required></textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="target">活动目的</label>
          <div class=" col-sm-10">
            <!-- <input class="form-control" type="text" name="target" id="target" v-model="currForecast.participant" required> -->
            <textarea class="form-control" type="text" name="target" id="target" v-model="currForecast.target" required></textarea>
          </div>
        </div>
        <div class="form-group">
          <label for="cateImg" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="cateImg" text="上传图片" :img.sync="currForecast.img" required></upload>
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="currForecast.sortId">
          </div>
        </div>
        <div class="form-group">
          <label for="cateIsShow" class="col-sm-2 control-label">是否推荐</label>
          <div class="col-sm-10">
            <label class="radio-inline">
              <input type="radio" name="option" id="isFShow" value="1" v-model="currForecast.ishidden">推荐
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unFshow" value="0" v-model="currForecast.ishidden">不推荐
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
</template>
<script>
	var oCate = {name:null,link:null,sortId:null,ishidden:null},
		oForecast = {img:null,title:null,describe:null,time:null,participant:null,sortId:null,target:null,ishidden:null};

	module.exports = {
		data:function(){
			return{
				visibility:'category',
				currCate:$.extend({},oCate),
				currForecast:$.extend({},oForecast),
				cateList:[],
				forecastList:[],
				showCate:false,
				showForecast:false,
				currentIndex:0,
				parentId:this.$route.params.id
			}
		},
		route:{
			data:function(){
				this.getCate();
				this.getForecast();
			}
		},
		methods:{
			// 
      		cutNav:function(typeStr){
      		  var self = this;
      		  self.visibility = typeStr;
      		},
      		getCate:function(){
      			var self = this;
      			$.ajax({
      				url:domain + '/af/getforecastCate',
      				type:'get',
      				dataType:'json',
      				data:{parentId:self.parentId}
      			}).done(function(res){
      				if (res.status == 1) {
      					self.cateList = res.data;
      				};
      			})
      		},
      		addCate:function(a,index){
      			var self = this;
      			if (a) {
      				self.currCate = $.extend({},a);
      				self.currentIndex = index;
      			}else{
      				self.currCate = $.extend({},{parentId:self.parentId},oCate);
      			};
      			self.showCate = true;

      		},
			delCate:function(id,index){
				var self = this;
				$.ajax({
					url:domain + '/af/delforecastCate/' + id,
					type:'delete',
					dataType:'json'
				}).done(function(res){
					if (res.status == 1) {
						self.cateList.splice(index,1);
					};
				})
			},
			saveCate:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.currCate));
				$.ajax({
					url:domain + '/af/saveforecastCate',
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status == 1) {
						if (params._id) {
							self.cateList.$set(self.currentIndex,params);
						}else{
							params._id = res.data._id;
							self.cateList.unshift(params);
						};
						self.showCate = false;
					};
				})
			},
			// 
			getForecast:function(){
      			var self = this;
      			$.ajax({
      				url:domain + '/af/getforecast',
      				type:'get',
      				dataType:'json',
      				data:{parentId:self.parentId}
      			}).done(function(res){
      				if (res.status == 1) {
      					self.forecastList = res.data;
      				};
      			})
      		},
      		addForecast:function(a,index){
      			var self = this;
      			if (a) {
      				self.currForecast = $.extend({},a);
      				self.currentIndex = index;
      			}else{
      				self.currForecast = $.extend({},{parentId:self.parentId},oForecast);
      			};
      			self.showForecast = true;

      		},
			delForecast:function(id,index){
				var self = this;
				$.ajax({
					url:domain + '/af/delforecast/' + id,
					type:'delete',
					dataType:'json'
				}).done(function(res){
					if (res.status == 1) {
						self.forecastList.splice(index,1);
					};
				})
			},
			saveForecast:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.currForecast));
				$.ajax({
					url:domain + '/af/saveforecast',
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status == 1) {
						if (params._id) {
							self.forecastList.$set(self.currentIndex,params);
						}else{
							params._id = res.data._id;
							self.forecastList.unshift(params);
						};
						self.showForecast = false;
					};
				})
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

