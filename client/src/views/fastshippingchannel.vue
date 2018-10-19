<template>
	<side-menu></side-menu>
	<div class="content-wrapper">
		<div class="content-header">
    	  <h1>Fast Shipping 子频道</h1>
    	  <ol class="breadcrumb">
    	    <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
    	    <li><a href="#">栏目管理</a></li>
    	    <li class="active">Fast Shipping 频道</li>
    	  </ol>
    	</div>
    	<div class="content">
    		<div class="mb10">
      		  <a class="btn btn-danger" :href="'fastshipchennal/' + currChennal.type + '.html'" target="_blank">预览</a>
      		</div>
            <div class="nav-tabs-custom theme-panel mb10">
              <ul class="nav nav-tabs nav-justified">
                <li v-for="item in chennals" :class="{active: currentType == item.type}" @click="switchChennal(item,$index)">
                  <a href="javascript:;">
                    {{item.name}}频道
                  </a>
                </li>
              </ul>
            </div>
            <!-- 频道 -->
      		<div class="nav-tabs-custom theme-panel">
      		  <ul class="nav nav-tabs">
      		    <template v-for="item in chennalCates">
      		      <li @click="switchCate(item,$index)"  :class="$index==currChennalCateIdx?'active':''">
      		        <a href="javascript:;" v-text="item.name">
      		        </a>
      		      </li>
      		    </template>
      		  </ul>
      		  <div class="tab-content">
      		    <div class="mb20">
      		      <div>
      		      	<a class="btn btn-primary" @click="addChennalCate(null,null)">添加类目</a>
      		        <a class="btn btn-primary" v-if="chennalCates.length != 0" @click="addChennalCate(currChennalCate,currChennalCateIdx)">编辑当前类目</a>
      		        <a class="btn btn-default" v-if="chennalCates.length != 0" @click="delChennalCate(currChennalCate._id)">删除当前类目</a>
      		      </div>
      		    </div>
      		    <div class="panel panel-body panel-info" v-show="chennalCates.length != 0">
      		      <a class="btn btn-primary" @click="addProduct(null,null)">添加产品</a>
      		      <table class="table table-hover">
      		        <thead>
      		          <th class="col-md-1 text-center">排序</th>
      		          <th class="col-md-3 text-center">图片</th>
      		          <th class="col-md-1 text-center">ID编号</th>
      		          <th class="col-md-3 text-center">产品名称</th>
      		          <th class="col-md-1 text-center">单价</th>
      		          <th class="col-md-1 text-center">零售价/市场价</th>
      		          <th class="col-md-3 text-center">操作</th>
      		        </thead>
      		        <tbody>
      		          <tr v-for="item in products">
      		            <td class="text-center" v-text="item.sortId"></td>
      		            
      		            <td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
      		            <td class="text-center" v-text="item.id"></td>
      		            <td class="text-center" v-text="item.name"></td>
      		            <td class="text-center" v-text="item.price"></td>
      		            <td class="text-center" v-text="item.marketPrice"></td>
      		            <td class="text-center">
      		              <a class="btn btn-primary" @click="addProduct(item,$index)">编辑</a>
      		              <a class="btn btn-default" @click="delProduct(item._id)">删除</a>
      		            </td>
      		          </tr>
      		        </tbody>
      		      </table>
      		    </div>
      		  </div>
      		</div>
      	</div>
    </div>
	<!-- 弹框 -->
	<!-- 添加或编辑频道类目 -->
	<modal :show.sync="showChennalCate" :title=dialogTitle+"类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveChennalCate">
          <div class="form-group pos-parent">
            <label for="chennalCateName" class="col-sm-3 control-label">类目名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="chennalCateName" id="chennalCateName" required v-model="editChennalCate.name" autocomplete="off"/>
          </div>
          </div>
          <div class="form-group">
            <label for="chennalCateSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="chennalCateSortId" id="chennalCateSortId" class="form-control" v-model="editChennalCate.sortId">
            </div>
          </div>
          <div class="form-group">
          <label for="chennalCateIsShow" class="col-sm-3 control-label">是否显示</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="editChennalCate.state">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="editChennalCate.state">不显示
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
	<!-- 添加或编辑产品 -->
	<modal :show.sync="showProducts" :title=dialogTitle+"产品">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveProducts">
          <div class="form-group">
            <label for="productsId" class="col-sm-3 control-label">产品ID</label>
            <div class="col-sm-9">
              <input type="number" name="productsId" id="productsId" class="form-control" required v-model="currProducts.id" style="width:70%;" />
              <a class="btn btn-primary" style="width:20%;" @click="getRemontPro"><span class="glyphicon glyphicon-plus"></span>添加</a>
            </div>
          </div>
          <div class="form-group">
            <label for="productsImg" class="col-sm-3 control-label">图片</label>
            <div class="col-sm-9">
              <img id="productsImg" :src="currProducts.img | resize" width="150" height="150" />
            </div>
          </div>
          <div class="form-group pos-parent">
            <label for="productsName" class="col-sm-3 control-label">产品名称</label>
            <div class="col-sm-9 pos-parent" style="position:relative;">
              <input type="text" class="form-control" name="productsName" id="productsName" v-model="currProducts.name"  disabled="disabled"/>
          </div>
          </div>
          <div class="form-group">
          	<label for="productsLink" class="col-sm-3 control-label">单价</label>
          	<div class="col-sm-9">
          		<input type="text" name="productsLink" id="productsLink" class="form-control" v-model="currProducts.price" disabled="disabled"/>
          	</div>
          </div>
          <div class="form-group">
          	<label for="productsLink" class="col-sm-3 control-label">市场价</label>
          	<div class="col-sm-9">
          		<input type="text" name="productsLink" id="productsLink" class="form-control" v-model="currProducts.marketPrice" disabled="disabled"/>
          	</div>
          </div>
          <div class="form-group">
            <label for="productsSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="productsSortId" id="productsSortId" class="form-control" v-model="currProducts.sortId">
            </div>
          </div>
          <div class="form-group">
          	<label for="productsState" class="col-sm-3 control-label">是否显示</label>
          	<div class="col-sm-9">
          		<label class="radio-inline">
          			<input type="radio" name="productsOpt" id="isShow" value="1" v-model="currProducts.state">
          		</label>
          		<label class="radio-inline">
          			<input type="radio" name="productsOpt" id="unshow"  value="0" v-model="currProducts.state">
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
	var currProducts = {name:null,sortId:null,img:null,price:null,marketPrice:null,state:1,id:null};
	var currChennalCate = {name:null,sortId:null,state:1,type:1};
	module.exports = {
		data:function(){
			return{
				// 
				currentType:1,
				chennals:[
				 {name:'热卖',type:1,url:'javascript:;'},
				 {name:'最低价',type:2,url:'javascript:;'},
				 {name:'样品',type:3,url:'javascript:;'}
				],
				// 
				currChennal:{name:'热卖',type:1,api:null,url:'javascript:;'},
				currProducts:$.extend({},currProducts),
				currChennalCate:$.extend({},currChennalCate),
				editChennalCate:$.extend({},currChennalCate),
				// 
				showChennalCate:false,
				showProducts:false,
				// 
				chennalCates:[],
				products:[],
				isDelChennalCate:false,
				hasProduct:false,
				//
				getProApi:'/fastship/getProduct',
				postProApi:'/fastship/saveProduct',
				delProApi:'/fastship/deleteProduct/',
				getCheApi:'/fastship/getChennalCate',
				postCheApi:'/fastship/saveChennalCate',
				delCheApi:'/fastship/delChennalCate/',
				// 
				currChennalCateIdx:0,
				currentIndex:null,
				// 
				page: {
        		  total: null,
        		  current: 1,
        		  perPage: 5,
        		  chennalCateId:null
        		},
        		// 编辑/添加
				dialogTitle:"添加"
			}
		},
		route:{
			data:function(){
				this.getChennalCate();
			}
		},
		methods:{
			// 
			switchChennal:function(a,index){
				var self = this;
				self.currentType = a.type;
				self.currChennal = $.extend({},a);
				self.getChennalCate();

			},
			switchCate:function(item,idx){
				var self = this;
				self.page.chennalCateId = item._id;
				self.currChennalCateIdx = idx;
				self.currChennalCate = $.extend({},item);
				self.getProducts()

			},
			// 从CRM获取产品
			getRemontPro:function(){
				var self = this;
				var params = {
					id:self.currProducts.id
				};
				$.ajax({
					url:domainCrm + '/cms/fastShipping/product.cf',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.code == 0) {
						console.log(res);
						self.currProducts = $.extend(self.currProducts,res.data);
						self.hasProduct = true;
					}else if (res.code == 600101) {
						window.alert('商品不存在');
					};
				})
			},
			// 获取
			getChennalCate:function(){
				var self = this;
				var params = {
					type:self.currentType,
				};
				$.ajax({
					url:domain + self.getCheApi,
					type:'get',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						console.log(res);
						self.chennalCates = res.data;
						self.currChennalCateIdx = 0;
						self.currChennalCate = self.chennalCates[self.currChennalCateIdx];
						if (self.chennalCates.length) {
							self.page.chennalCateId = self.currChennalCate._id;
							self.getProducts();
							console.log(self.page);
						};
					};
				})

			},
			getProducts:function(){
				var self = this;
				var params = {
					parentId:self.page.chennalCateId,
				};
				$.ajax({
					url:domain + self.getProApi,
					type:'get',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						console.log(res);
						self.products = res.data;
					}
				})
			},
			// 添加或编辑
			addChennalCate:function(a,index){
				var self = this;
				self.showChennalCate = true;
				if (a) {
					self.dialogTitle = "编辑";
					self.editChennalCate = $.extend({},a);
					self.currChennalCateIdx = index;
				};
				if (!a) {
					self.dialogTitle = "添加";
					self.editChennalCate = $.extend({},currChennalCate);
					self.editChennalCate.type = self.currentType;
				};
			},
			addProduct:function(a,index){
				var self = this;
				self.showProducts = true;
				if (a) {
					self.hasProduct = true;
					self.dialogTitle = "编辑";
					self.currProducts = $.extend({},a);
					self.currentIndex = index;
				};
				if (!a) {
					self.dialogTitle = "添加";
					self.currProducts = $.extend({},currProducts);
					self.currProducts.parentId = self.page.chennalCateId;
				};
			},
			// 保存
			saveChennalCate:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.editChennalCate));
				console.log(params);
				$.ajax({
					url:domain + self.postCheApi,
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						console.log(res);
						if (params._id) {
							self.chennalCates.$set(self.currChennalCateIdx,params);
							self.currChennalCate = $.extend({},params);
						}else{
							params._id = res.data._id;
							self.chennalCates.push(params);
						};
						self.showChennalCate = false;
					}
				})
			},
			saveProducts:function(){
				var self = this;
				if (self.hasProduct) {
					var params = JSON.parse(JSON.stringify(self.currProducts));
					$.ajax({
						url:domain + self.postProApi,
						type:'post',
						dataType:'json',
						data:params
					})
					.done(function(res){
						if (res.status == 1) {
							console.log(res);
							if (params._id) {
								self.products.$set(self.currentIndex,params);
							}else{
								params._id = res.data._id;
								self.products.unshift(params);
							};
							self.hasProduct = false;
							self.showProducts = false;
						};
					})
				}else{
					window.alert('请输入正确的ID。');
					self.showProducts = false;
				};
			},
			// 删除
			delChennalCate:function(ids){
				var self = this;
				if (window.confirm('删除此分类同时也会删除分类下的产品！')) {
					$.ajax({
						url:domain + self.delCheApi + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							self.isDelChennalCate = true;
							console.log(res);
							var proArr = [];
							if (self.products.length) {
								self.products.forEach(function(item,i){
									proArr.push(item._id);
								});
								self.delProduct(proArr.join(','));
								return;
							};
							self.getChennalCate();
						};
					})
				};
			},
			delProduct:function(ids){
				var self = this;
				if (window.confirm('确定要产品删除吗？')) {
					$.ajax({
						url:domain + self.delProApi + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							console.log(res);
							self.getProducts();
							if (self.isDelChennalCate) {
								self.getChennalCate();
								self.isDelChennalCate = false;
							};
						};
					})
				};
			},
		},
		watch:{

		},
		components:{
			autoComplete:require('../components/autoComplete.vue')
		},
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
  .mb20{
  	margin-bottom:20px; 
  }
  .fl{
  	float: left;
  }
</style>