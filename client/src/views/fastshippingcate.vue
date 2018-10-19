<template>
	<side-menu></side-menu>
	<div class="content-wrapper">
		<div class="content-header">
    	  <h1>Fast Shipping 类目</h1>
    	  <ol class="breadcrumb">
    	    <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
    	    <li><a href="#">栏目管理</a></li>
    	    <li class="active">Fast Shipping 类目</li>
    	  </ol>
    	</div>
    	<div class="panel-body">
    		<div class="mb10">
        	  <a class="btn btn-danger" href="fastshipindex.html" target="_blank">预览</a>
        	</div>
        </div>
    	<div class="panel panel-body panel-info ">
    		<div class="content">
        		<div class="mb10">
        		   <div class="nav-tabs-custom">
        		       <div class="mb10">
        		       	<span class="h4">Categories</span>
        		       	<span class="col-sm-offset-1">
        		       		<a class="btn btn-primary btn-sm" @click="addFirstStair(null,null)">添加行业类目</a>
        		       	</span>
        		       </div>
      			    <ul class="nav nav-tabs">
      			      <template v-for="item in industrialCates">
      			        <li @click="switchIndustrislCate(item,$index)"  :class="$index==currIndCateIdx?'active':''">
      			          <a href="javascript:;" v-text="item.name">
      			          </a>
      			        </li>
      			      </template>
      			    </ul>
      			   </div>
      			   <div class="mb10 theme-panel">
      			   	 <button type="button" class="btn btn-primary btn-sm" @click="addSecStair(null,null)">添加子类目</button>
      			     <button type="button" class="btn btn-primary btn-sm" @click="addFirstStair(currIndustrialCate,currIndCateIdx)">编辑当前行业类目</button>
      			     <button type="button" class="btn btn-sm" @click="delFirstStair(currIndustrialCate._id)">删除当前行业类目</button>
      			   </div>
      			  <div class="row col-sm-12 container ">
      			   <ul class="fl list-group  col-sm-12 clearfix">
      			   	<li class="col-sm-4 list-group-item" v-for="item in childCates">
      			   		<h4 class="panel-body">
      			   			<span class="col-md-6" v-text="item.name" style="word-wrap : break-word ;">LED subcategories</span>
      			   			<span class="col-md-2 text-center" v-text="item.sortId">1</span>
      			   			<span class="col-md-4 text-center">
      			   				<button type="button" class="btn btn-primary btn-sm" @click="addSecStair(item,$index)">编辑</button>
      			    			<button type="button" class="btn btn-sm" @click="delSecStair(item._id)">删除</button>
      			   			</span>
      			   		</h4>
      			   		<table class="table table-hover b-y-3">
      			        <tbody>
      			          <tr v-for="a in item.thrCates">
      			            <td class="text-center" v-text="a.name"></td>
      			            <td class="text-center" v-text="a.sortId">1</td>
      			            <td class="text-center">
      			            	<button class="btn btn-primary btn-sm" @click="addThrCate(a,$index,null)">编辑</button>
        	                   	<button class="btn btn-sm" @click="delThrCate(a._id)">删除</button>
      			            </td>
      			          </tr>
      			           <tr>
      			            <td class="text-center"></td>
      			            <td class="text-center"></td>
      			            <td class="text-center">
      			            	<button class="btn btn-primary btn-sm" @click="addThrCate(null,null,item._id,item)">添加子类目</button>
      			            </td>
      			          </tr>
      			        </tbody>
      			      </table>
      			   	</li>
      			   </ul>
      			  </div>
      			</div>
    		</div>
    	</div>
	</div>
	<!-- 弹窗 -->
	<!-- 添加行业类目 -->
	<modal :show.sync="showIndustrialCate" :title=dialogTitle+"行业类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndustrialCate">
          <div class="form-group pos-parent">
            <label for="industrialCateName" class="col-sm-3 control-label">行业类目名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="industrialCateName" id="industrialCateName" v-model="editIndustrialCate.name" autocomplete="off"/>
          </div>
          </div>
           <div class="form-group pos-parent">
            <label for="industrialCateName" class="col-sm-3 control-label">行业类目图片</label>
            <div class="col-sm-9">
             <upload id="cate-img" :img.sync="editIndustrialCate.img" required></upload>
          </div>
          </div>
          <div class="form-group">
            <label for="industrialCateSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="industrialCateSortId" id="industrialCateSortId" class="form-control" v-model="editIndustrialCate.sortId">
            </div>
          </div>
          <div class="form-group">
          	<label for="industrialCateLink" class="col-sm-3 control-label">链接</label>
          	<div class="col-sm-9">
          		<input type="text" name="industrialCateLink" id="industrialCateLink" class="form-control" v-model="editIndustrialCate.link">
          	</div>
          </div>
          <div class="form-group">
          <label for="industrialCateIsShow" class="col-sm-3 control-label">是否显示</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="editIndustrialCate.state">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="editIndustrialCate.state">不显示
            </label>
          </div>
        </div>
          <div class="form-group">
            <div class="col-sm-9 col-sm-offset-3">
              <button class="btn btn-primary" type="submit">保存</button>
            </div>
          </div>
        </form>
      </div>
      <div slot="modal-footer"></div>
    </modal>
	<!-- 添加子类目  -->
	<modal :show.sync="showChildCate" :title=dialogTitle+"行业子类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveChildCate">
          <div class="form-group pos-parent">
            <label for="childCateName" class="col-sm-3 control-label">子类目名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="childCateName" id="childCateName" v-model="currChildCate.name" autocomplete="off"/>
          </div>
          </div>
          <div class="form-group">
            <label for="childCateSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="childCateSortId" id="childCateSortId" class="form-control" v-model="currChildCate.sortId">
            </div>
          </div>
          <div class="form-group">
          	<label for="childCateLink" class="col-sm-3 control-label">链接</label>
          	<div class="col-sm-9">
          		<input type="text" name="childCateLink" id="childCateLink" class="form-control" v-model="currChildCate.link">
          	</div>
          </div>
          <div class="form-group">
          <label for="childCateIsShow" class="col-sm-3 control-label">是否显示</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="currChildCate.state">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="currChildCate.state">不显示
            </label>
          </div>
        </div>
          <div class="form-group">
            <div class="col-sm-9 col-sm-offset-3">
              <button class="btn btn-primary" type="submit">保存</button>
            </div>
          </div>
        </form>
      </div>
      <div slot="modal-footer"></div>
    </modal>
    <!-- 添加三级类目 -->
	<modal :show.sync="showThreeCate" :title=dialogTitle+"三级类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveThreeCate">
          <div class="form-group pos-parent">
            <label for="threeCateName" class="col-sm-3 control-label">三级类目名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="threeCateName" id="threeCateName" v-model="currThreeCate.name" autocomplete="off"/>
          </div>
          </div>
          <div class="form-group">
            <label for="threeCateSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="threeCateSortId" id="threeCateSortId" class="form-control" v-model="currThreeCate.sortId">
            </div>
          </div>
          <div class="form-group">
          	<label for="threeCateLink" class="col-sm-3 control-label">链接</label>
          	<div class="col-sm-9">
          		<input type="text" name="threeCateLink" id="threeCateLink" class="form-control" v-model="currThreeCate.link">
          	</div>
          </div>
          <div class="form-group">
          <label for="threeCateIsShow" class="col-sm-3 control-label">是否显示</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="currThreeCate.state">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="currThreeCate.state">不显示
            </label>
          </div>
        </div>
          <div class="form-group">
            <div class="col-sm-9 col-sm-offset-3">
              <button class="btn btn-primary" type="submit">保存</button>
            </div>
          </div>
        </form>
      </div>
      <div slot="modal-footer"></div>
    </modal>
</template>
<script>
	var webupload = require('../util/webupload/webuploader.min');
	var currIndustrialCate = {name:null,sortId:null,link:null,state:1,img:''};
	var currChildCate = {name:null,sortId:null,link:null,state:1};
	var currThreeCate = {name:null,sortId:null,link:null,state:1};

	module.exports = {

		data:function(){
			return {
				// 当前对象
				currIndustrialCate:$.extend({},currIndustrialCate),
				editIndustrialCate:$.extend({},currIndustrialCate),
				currChildCate:$.extend({},currChildCate),
				currThreeCate:$.extend({},currThreeCate),
				// 
				currIndCateIdx:0,
				currentIndex:null,
				//
				showIndustrialCate:false,
				showChildCate:false,
				showThreeCate:false,
				// 
				industrialCates:[],
				childCates:[],
				threeCates:[],
				// 编辑/添加
				dialogTitle:"添加"
				
			}
		},
		route:{
			data:function(){
				this.getIndustrialCates();
			}
		},
		methods:{
			// 
			switchIndustrislCate:function(a,index){
				var self = this;
				self.currIndCateIdx = index;
				self.currIndustrialCate = $.extend({},a);
				self.getChildCates();

			},
			// 获取
			getIndustrialCates:function(){
				var self = this;
				$.ajax({
					url:domain + '/fastship/getFirstStair',
					type:'get',
					dataType:'json',
					data:null
				})
				.done(function(res){
					if (res.status == 1) {
						console.log(res);
						self.industrialCates = res.data;
						self.currIndCateIdx = 0;
						if (self.industrialCates.length) {
							self.currIndustrialCate = self.industrialCates[self.currIndCateIdx];
						};
						self.getChildCates();
					}
				})

			},
			getChildCates:function(){
				var self = this;
				var params = {
					parentId:self.currIndustrialCate._id
				};
				$.ajax({
					url:domain + '/fastship/getSecStair',
					type:'get',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						console.log(res);
						self.childCates  = res.data;
					}
				})

			},

			// 编辑或添加类目
			addFirstStair:function(a,index){
				var self = this;
				self.showIndustrialCate = true;
				if (a) {
					self.dialogTitle = "编辑"
					self.editIndustrialCate = $.extend({},a);
					self.currIndCateIdx = index;
				};
				if (!a) {
					self.dialogTitle = "添加";
					self.editIndustrialCate = $.extend({},currIndustrialCate);
				};

			},
			addSecStair:function(a,index){
				var self = this;
				
				if (a) {
					self.dialogTitle = "编辑";
					self.showChildCate = true;
					self.currChildCate = $.extend({},a);
					self.currentIndex = index;
				};
				if (!a) {
					self.dialogTitle = "添加";
					if (self.childCates.length >= 4) {
						window.alert("最多只能添加4个二级子类目！");
						return;
					};
					self.showChildCate = true;
					self.currChildCate = $.extend({},currChildCate);
					self.currChildCate.parentId = self.currIndustrialCate._id;
				};

			},
			addThrCate:function(a,index,parentId,parent){
				var self = this;
				
				if (a) {
					self.dialogTitle = "编辑";
					self.showThreeCate = true;
					self.currThreeCate = $.extend({},a);
					self.currentIndex = index;
				};
				if (!a) {
					self.dialogTitle = "添加";
					if (parent.thrCates && parent.thrCates.length >= 6) {
						window.alert("最多只能填加6个三级类目");
						return;
					};
					self.showThreeCate = true;
					self.currThreeCate = $.extend({},currThreeCate);
					self.currThreeCate.parentId = parentId;
				};

			},

			// 保存类目信息
			saveIndustrialCate:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.editIndustrialCate));
				$.ajax({
					url:domain + '/fastship/saveFirstStair',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						if (params._id) {
							self.industrialCates.$set(self.currIndCateIdx,params);
							self.currIndustrialCate = $.extend({},params);
						}else{
							params._id = res.data._id;
							self.industrialCates.push(params);
						};
						self.showIndustrialCate = false;
					}
				})

			},
			saveChildCate:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.currChildCate));
				$.ajax({
					url:domain + '/fastship/saveSecStair',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						if (params._id) {
							self.childCates.$set(self.currentIndex,params);
						}else{
							params._id = res.data._id;
							self.childCates.unshift(params);
						};
						self.showChildCate = false;
					}
				})

			},
			saveThreeCate:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.currThreeCate));
				$.ajax({
					url:domain + '/fastship/saveThrStair',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						self.getChildCates();
						self.showThreeCate = false;
					}
				})

			},
			// 删除
			delFirstStair:function(ids){
				var self = this;

				if (window.confirm('确定要删除吗？')) {
					$.ajax({
						url:domain + '/fastship/delFirstStair/' + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							console.log(res);
							self.getIndustrialCates();
						};
					})
				};
			},
			delSecStair:function(ids){
				var self = this;

				if (window.confirm('确定要删除吗？')) {
					$.ajax({
						url:domain + '/fastship/delSecStair/' + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							console.log(res);
							self.getChildCates();
						}
					})
				};
			},
			delThrCate:function(ids){
				var self = this;
				if (window.confirm('确定要删除吗？')) {
					$.ajax({
						url:domain + '/fastship/delThrStair/' + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							console.log(res);
							self.getChildCates();
						}
					})
				}
			},

		},
		watch:{

		},
		components:{
			autoComplete:require('../components/autoComplete.vue')
		}

	};

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
  .fl{
  	float: left;
  }
  .clearfix:before{
  	content: '';
  	display: block;
  	width: 0px;height: 0px;
  	clear: both;
  }
  .clearfix:after{
  	content: '';
  	display: block;
  	width: 0px;height: 0px;
  	clear: both;
  }
  .list-group-item{
  	height: 500px;
  	border:none;
  }
  .b-y-3{
  	border-top: 2px solid #000;
  }
</style>