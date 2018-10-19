<template>
	<side-menu></side-menu>
	<div class="content-wrapper">
		<div class="content-header">
    	  <h1>Fast Shipping 首页</h1>
    	  <ol class="breadcrumb">
    	    <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
    	    <li><a href="#">栏目管理</a></li>
    	    <li class="active">Fast Shipping 首页</li>
    	  </ol>
    	</div>
		<div class="content">
			<div class="mb10">
        	  <a class="btn btn-danger" href="fastshipindex.html" target="_blank">预览</a>
        	</div>
        	<div>
        		<div class="nav-tabs-custom theme-panel mb10">
        	      <ul class="nav nav-tabs nav-justified">
        	        <li :class="{active: visibility == 'admoduls'}" @click="visibility='admoduls'">
        	          <a href="javascript:;">
        	            推荐模块
        	          </a>
        	        </li>
        	        <li :class="{active: visibility == 'floors'}" @click="visibility='floors'">
        	          <a href="javascript:;">
        	            楼层设置
        	          </a>
        	        </li>
        	      </ul>
        	    </div>
        	    <div class="panel panel-body panel-info ">
        	    	<!-- 推荐模块 -->
        	    	<div class="row col-sm-12" v-show="visibility == 'admoduls'">
        	    		<div class="panel-heading">
        	    		  <span class="col-sm-2">
        	              	<a class="btn btn-primary btn-sm" @click="addAdModuls(null,null)">添加推荐模块</a> 
        	              </span>
        	              <span class="col-sm-2">
        	              	<input type="checkbox" name="isHiddenModuls" id="isHiddenModuls" v-model="isHiddenModuls">
        	              	<label for="isHiddenModuls" >隐藏推荐模块</label>
        	              </span>
        	            </div>
        	             <table class="table panel-body table-hover">
        	              <thead>
        	                <tr class="">
        	                  <th class="col-md-1 bt-center">推荐模块名称</th>
        	                  <th class="col-md-5 bt-center">图片</th>
        	                  <th class="col-md-2 bt-center">排序</th>
        	                  <th class="col-md-4 bt-center">管理</th>
        	                </tr>
        	              </thead>
        	              <tbody>
        	                <tr v-for="item in adModuls">
        	                  <td class="bt-center" v-text="item.name"></td>
        	                  <td class="bt-center"><img :src="item.img | resize" width="150" height="80"></td>
        	                  <td class="bt-center" v-text="item.sortId"></td>
        	                  <td class="bt-center">
        	                    <button class="btn btn-primary btn-sm" @click="addAdModuls(item,$index)">编辑</button>
        	                    <button class="btn btn-sm" @click="delAdModuls(item._id)">删除</button>
        	                  </td>
        	                </tr>
        	              </tbody>
        	            </table>
        	    	</div>
        	    	<!-- 楼层设置 -->
        	    	<div v-show="visibility == 'floors'">
        	    	<div class="mb10">
        	    	  <div class="nav-tabs-custom">
        	    	    <h4>楼层</h4>
      				    <ul class="nav nav-tabs">
      				      <template v-for="item in floors">
      				        <li @click="switchFloor(item,$index)"  :class="$index==currFloorIndex?'active':''">
      				          <a href="javascript:;" v-text="item.name">
      				          </a>
      				        </li>
      				      </template>
      				    </ul>
      				   </div>
      				   <div class="mb10 theme-panel">
                 <button type="button" class="btn btn-primary btn-sm" @click="addFloor(null,null)">添加楼层</button>
      				     <button type="button" class="btn btn-primary btn-sm" @click="addFloor(currFloor,currFloorIndex)">编辑当前楼层</button>
      				     <button type="button" class="btn btn-sm" @click="delFloor(currFloor._id)">删除当前楼层</button>
      				   </div>
      				  <div class="tab-content row col-sm-12">
      				    
      				    <div class="col-sm-8">
      				      <div>
      				      		<h4 class="float-left">推荐产品</h4><a class="btn btn-primary btn-sm float-right" v-show='floors' @click="addAdPro(null,null)">添加推荐产品</a>
      				      	</div>
      				      <table class="table table-hover">
      				      	
      				        <thead>
      				          <th class="col-md-4 text-center">图片</th>
      				          <th class="col-md-3 text-center">名称</th>
      				          <th class="col-md-2 text-center">排序</th>
      				          <th class="col-md-3 text-center">操作</th>
      				        </thead>
      				        <tbody>
      				          <tr v-for="item in adProducts">
      				            <td class="text-center"><img :src="item.img | resize"></td>
      				            <td class="text-center" v-text="item.name"></td>
      				            <td class="text-center" v-text="item.sortId">1</td>
      				            <td class="text-center">
      				            	<button class="btn btn-primary btn-sm" @click="addAdPro(item,$index)">编辑</button>
        	                  <button class="btn btn-sm" @click="delAdPro(item._id)">删除</button>
      				            </td>
      				          </tr>
      				        </tbody>
      				      </table>
      				    </div>
      				    <div class="col-sm-4">
      				      <div>
      				      		<h4 class="float-left">推荐类目</h4><a class="btn btn-primary btn-sm float-right" v-show='floors' @click="addAdCate(null,null)">添加推荐类目</a>
      				      	</div>
      				      <table class="table table-hover">
      				      	
      				        <thead>
      				          <th class="col-md-6 text-center">名称</th>
      				          <th class="col-md-3 text-center">排序</th>
      				          <th class="col-md-3 text-center">操作</th>
      				        </thead>
      				        <tbody>
      				          <tr v-for="item in adCates">
      				            <td class="text-center" v-text="item.name"></td>
      				            <td class="text-center" v-text="item.sortId">1</td>
      				            <td class="text-center">
      				            	<button class="btn btn-primary btn-sm" @click="addAdCate(item,$index)">编辑</button>
        	                  <button class="btn btn-sm" @click="delAdCate(item._id)">删除</button>
      				            </td>
      				          </tr>
      				        </tbody>
      				      </table>
      				    </div>
      				  </div>
      				</div>
      			  </div>
        	    </div>
        	</div>
		</div>
	</div>
	<!-- 弹窗 -->
	<!-- 添加/编辑推荐模块 -->
 	<modal :show.sync="showAdModuls" :title=dialogTitle+"推荐模块">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveAdModuls">
          <div class="form-group pos-parent">
            <label for="AdModulsName" class="col-sm-3 control-label">名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="AdModulsName" id="AdModulsName" v-model="currAdModuls.name" autocomplete="off"/>
          </div>
          </div>
          <div class="form-group">
            <label for="AdModulsSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="AdModulsSortId" id="AdModulsSortId" class="form-control" v-model="currAdModuls.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="AdModulsImg" class="col-sm-3 control-label">图片</label>
            <div class="col-sm-9">
              <upload id="AdModulsImg" text="上传图片" :img.sync="currAdModuls.img" width="150" height="150"></upload>
            </div>
          </div>
          <div class="form-group">
          	<label for="AdModulsLink" class="col-sm-3 control-label">链接</label>
          	<div class="col-sm-9">
          		<input type="text" name="AdModulsLink" id="AdModulsLink" class="form-control" v-model="currAdModuls.link">
          	</div>
          </div>
          <div class="form-group">
          <label for="AdModulsIsShow" class="col-sm-3 control-label">是否显示</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="currAdModuls.state">显示
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="currAdModuls.state">不显示
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
    <!-- 添加/编辑楼层 -->
    <modal :show.sync="showFloors" :title=dialogTitle+"楼层">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveFloors">
          <div class="form-group pos-parent">
            <label for="floorName" class="col-sm-3 control-label">名称</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="floorName" id="floorName" v-model="editFloor.name" autocomplete="off"/>
          </div>
          </div>
          <div class="form-group">
            <label for="floorSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="floorSortId" id="floorSortId" class="form-control" v-model="editFloor.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="floorImg" class="col-sm-3 control-label">链接</label>
            <div class="col-sm-9">
              <input type="text" name="floorLink" id="floorLink" class="form-control" v-model="editFloor.link">
            </div>
          </div>
          <div class="form-group">
            <label for="editFloorImg" class="col-sm-3 control-label">图片</label>
            <div class="col-sm-9">
              <upload id="editFloorImg" text="上传图片" :img.sync="editFloor.floorImg" width="150" height="150"></upload>
            </div>
          </div>
          <div class="form-group">
          	<label for="floorState" class="col-sm-3 control-label">是否显示</label>
          	<div class="col-sm-9">
          		<label class="radio-inline">
          			<input type="radio" name="floorStatus" value="1" v-model="editFloor.state">
          		</label>
          		<label class="radio-inline">
          			<input type="radio" name="floorStatus" value="0" v-model="editFloor.state">
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
    <!-- 添加或编辑推荐产品 -->
    <modal :show.sync="showAdPro" :title=dialogTitle+"推荐产品">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveAdPro">
          <div class="form-group pos-parent">
            <label for="adProName" class="col-sm-3 control-label">产品名称</label>
            <div class="col-sm-9 pos-parent" style="position:relative;">
              <input type="text" class="form-control" name="adProName" id="adProName" v-model="currAdPro.name" required/>
          </div>
          </div>
          <div class="form-group">
            <label for="adProSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="adProSortId" id="adProSortId" class="form-control" v-model="currAdPro.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="adProImg" class="col-sm-3 control-label">图片</label>
            <div class="col-sm-9">
              <upload id="adProImg" text="上传图片" :img.sync="currAdPro.img" width="150" height="150"></upload>
            </div>
          </div>
          <div class="form-group">
          	<label for="adProLink" class="col-sm-3 control-label">链接</label>
          	<div class="col-sm-9">
          		<input type="text" name="adProLink" id="adProLink" class="form-control" v-model="currAdPro.link"  required/>
          	</div>
          </div>
          <div class="form-group">
          	<label for="adProLink" class="col-sm-3 control-label">单价</label>
          	<div class="col-sm-9">
          		<input type="text" name="adProLink" id="adProLink" class="form-control" v-model="currAdPro.price" required>
          	</div>
          </div>
          <div class="form-group">
          	<label for="adProLink" class="col-sm-3 control-label">市场价</label>
          	<div class="col-sm-9">
          		<input type="text" name="adProLink" id="adProLink" class="form-control" v-model="currAdPro.marketPrice" required>
          	</div>
          </div>
          <div class="form-group">
          	<label for="adProState" class="col-sm-3 control-label">是否显示</label>
          	<div class="col-sm-9">
          		<label class="radio-inline">
          			<input type="radio" name="adProOpt" value="1" v-model="currAdPro.state">
          		</label>
          		<label class="radio-inline">
          			<input type="radio" name="adProOpt" value="0" v-model="currAdPro.state">
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
    <!-- 添加或编辑推荐类目 -->
    <modal :show.sync="showAdCate" :title=dialogTitle+"推荐类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveAdCate">
          <div class="form-group pos-parent">
            <label for="adProCateName" class="col-sm-3 control-label">类目名称</label>
            <div class="col-sm-9 pos-parent" style="position:relative;">
              <input type="text" class="form-control" name="adProCateName" id="adProCateName" v-model="currAdProCate.name" autocomplete="off"/>
          </div>
          </div>
          <div class="form-group">
            <label for="adProCateSortId" class="col-sm-3 control-label">排序</label>
            <div class="col-sm-9">
              <input type="number" name="adProCateSortId" id="adProCateSortId" class="form-control" v-model="currAdProCate.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="adProCateLink" class="col-sm-3 control-label">链接</label>
            <div class="col-sm-9">
              <input type="text" name="adProCateLink" id="adProCateLink" class="form-control" v-model="currAdProCate.link"  required/>
            </div>
          </div>
          <div class="form-group">
          	<label for="adProCateState" class="col-sm-3 control-label">是否显示</label>
          	<div class="col-sm-9">
          		<label class="radio-inline">
          			<input type="radio" name="adProCateOpt" value="1" v-model="currAdProCate.state">
          		</label>
          		<label class="radio-inline">
          			<input type="radio" name="adProCateOpt" value="0" v-model="currAdProCate.state">
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
	var currAdModuls = {name:null, sortId:null, img:null, link:null, state:1};
	var currFloor = {name:null,sortId:null,link:null,state:1,floorImg:null};
	var currAdPro = {name:null,sortId:null,img:null,link:null,price:null,marketPrice:null,state:1};
	var currAdProCate = {name:null,sortId:null,state:1,link:null};

	module.exports = {
		data:function(){
			return {
				// 
				visibility:'admoduls',
				// 
				currAdModuls:$.extend({},currAdModuls),
				currFloor:$.extend({},currFloor),
				editFloor:$.extend({},currFloor),
				currAdPro:$.extend({},currAdPro),
				currAdProCate:$.extend({},currAdProCate),
				// 
				showAdModuls:false,
				showFloors:false,
				showAdPro:false,
				showAdCate:false,
				isHiddenModuls:false,
				// 
				adModuls:[],
				floors:[],
				adProducts:[],
				adCates:[],
				// 
				currentIndex:0,
				currFloorIndex:0,
        // 编辑/添加
        dialogTitle:"添加"

			}
		},
		route:{
			data:function(){
				this.getModuls();
        this.getFloors();
			}
		},
		methods:{
			// 转换楼层
			switchFloor:function(item,idx){
				var self = this;
				self.currFloor = $.extend({},item);
				self.currFloorIndex = idx;
				self.getAdProducts();
				self.getAdCates();
			},
			// 获取
			getModuls:function(){
				var self = this;

				$.ajax({
					url:domain + '/fastship/getIndexModuls',
					type:'get',
					dataType:'json',
					data:null
				})
				.done(function(res){
					if (res.status == 1) {
						self.adModuls = res.data;
              var count = 0;
              var antiCount = 0;
					   self.adModuls.forEach(function(item,i){
                if (item.state == 1) {
                  count++;
                }else if (item.state == 0) {
                  antiCount++;
                };
             });
             if (count == self.adModuls.length) {
              console.log(123);
              self.isHiddenModuls = false;
             };
             if (antiCount == self.adModuls.length) {
               console.log(456);
              self.isHiddenModuls = true;
             };
					};
				})

			},
			getFloors:function(){
				var self = this;

				$.ajax({
					url:domain + '/fastship/getIndexFloor',
					type:'get',
					dataType:'json',
					data:null
				})
				.done(function(res){
					if (res.status == 1) {
						self.currFloorIndex = 0;
						self.floors = res.data;
						if (self.floors.length) {
							self.currFloor = self.floors[self.currFloorIndex];
							self.getAdProducts();
							self.getAdCates();
						};
						console.log(res);
					};
				});

			},
			getAdProducts:function(){
				var self = this;
				var params = {
					floorId:self.currFloor._id,
				};

				$.ajax({
					url:domain + '/fastship/getIndexFloorPro',
					type:'get',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						self.adProducts = res.data;
						console.log(res);
					}
				})

			},
			getAdCates:function(){
				var self = this;
				var params = {
					floorId:self.currFloor._id,
				};

				$.ajax({
					url:domain + '/fastship/getIndexFloorCate',
					type:'get',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						self.adCates = res.data;
						console.log(res);
					}
				})

			},
			// 添加或编辑
			addAdModuls:function(a,index){
				var self = this;
				self.showAdModuls = true;
				if (a) {
          self.dialogTitle = "编辑";
					self.currentIndex = index;
					self.currAdModuls = $.extend({},a);
				};
				if (!a) {
          self.dialogTitle = "添加";
					self.currAdModuls = $.extend({},currAdModuls);
				}

			},
			addFloor:function(a,index){
				var self = this;
				self.showFloors = true;
				if (a) {
          self.dialogTitle = "编辑";
					self.currentIndex = index;
					self.editFloor = $.extend({},a);
				};
				if (!a) {
          self.dialogTitle = "添加";
					self.editFloor = $.extend({},currFloor);
				};

			},
			addAdPro:function(a,index){
				var self = this;
				
				if (a) {
          self.dialogTitle = "编辑";
          self.showAdPro = true;
					self.currentIndex = index;
					self.currAdPro = $.extend({},a);
				};
				if (!a) {
          self.dialogTitle = "添加";
          if (self.adProducts.length >= 4) {
            window.alert("最多只能添加4个推荐产品！！");
            return;
          };
          self.showAdPro = true;
					self.currAdPro = $.extend({},currAdPro);
          self.currAdPro.floorId = self.currFloor._id;
				};

			},
			addAdCate:function(a,index){
				var self = this;
				
				if (a) {
          self.dialogTitle = "编辑";
          self.showAdCate = true;
					self.currentIndex = index;
					self.currAdProCate = $.extend({},a);
				};
				if (!a) {
          self.dialogTitle = "添加";
          if (self.adCates.length >= 7) {
            window.alert("最多只能添加7个推荐类目！！");
            return;
          };
          self.showAdCate = true;
					self.currAdProCate = $.extend({},currAdProCate);
          self.currAdProCate.floorId = self.currFloor._id;
				};

			},
			// 保存
			saveAdModuls:function(){
				var self = this;

				var params = JSON.parse(JSON.stringify(self.currAdModuls));
				$.ajax({
					url:domain + '/fastship/saveIndexModuls',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						if (params._id) {
							self.adModuls.$set(self.currentIndex,params);
						}else{
							params._id = res.data._id;
							self.adModuls.unshift(params);
						};
						self.showAdModuls = false;
					};
				})
			},
			saveFloors:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.editFloor));
        console.log(params);
				$.ajax({
					url:domain + '/fastship/saveIndexFloor',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						if (params._id) {
              self.currFloor = $.extend({},params);
							self.floors.$set(self.currFloorIndex,params);
						}else{
              params._id = res.data._id;
							self.floors.push(params);
						};
						self.showFloors = false;
					};
				})
			},
			saveAdPro:function(){
				var self = this;
        var params = JSON.parse(JSON.stringify(self.currAdPro));
				$.ajax({
					url:domain + '/fastship/saveIndexFloorPro',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						if (params._id) {
              self.adProducts.$set(self.currentIndex,params);
						}else{
              params._id = res.data._id;
              self.adProducts.unshift(params);
						};
					};
          self.showAdPro = false;
				})
			},
			saveAdCate:function(){
				var self = this;
        var params = JSON.parse(JSON.stringify(self.currAdProCate));
				$.ajax({
					url:domain + '/fastship/saveIndexFloorCate',
					type:'post',
					dataType:'json',
					data:params
				})
				.done(function(res){
					if (res.status == 1) {
						if (params._id) {
              self.adCates.$set(self.currentIndex,params);
						}else{
              params._id = res.data._id;
              self.adCates.unshift(params);
						};
            self.showAdCate = false;
					};
				})
			},
			// 删除
			delAdModuls:function(ids){
				var self = this;
				if (window.confirm('确定要删除吗？')) {
					$.ajax({
						url:domain + '/fastship/delIndexModuls/' + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							self.getModuls();
						};
					});
				};
			},
			delFloor:function(ids){
				var self = this;
				if (window.confirm('确定要删除楼层吗？')) {
					$.ajax({
						url:domain + '/fastship/delIndexFloor/' + ids,
						type:'delete',
						dataType:'json',
						data:null
					})
					.done(function(res){
						if (res.status == 1) {
							
							self.getFloors();
						};
					})
				};
			},
			delAdPro:function(ids){
				var self = this;
        if (window.confirm('确定要删除吗？')) {
          $.ajax({
            url:domain + '/fastship/delIndexFloorPro/' + ids,
            type:'delete',
            dataType:'json',
            data:null
          })
          .done(function(res){
            if (res.status == 1) {
              self.getAdProducts();
            }
          })
        }
			},
			delAdCate:function(ids){
				var self = this;
        if (window.confirm('确定要删除吗？')) {
          $.ajax({
            url:domain + '/fastship/delIndexFloorCate/' + ids,
            type:'delete',
            dataType:'json',
            data:null
          })
          .done(function(res){
            if (res.status == 1) {
              self.getAdCates();
            }
          })
        }
			},
		},
		watch:{
      isHiddenModuls:function(val,old){
        var self = this;
        if (val) {
          self.adModuls.forEach(function(item,index){
            item.state = 0;
          })
        }else{
          self.adModuls.forEach(function(item,index){
            item.state = 1;
          })
        };
        var count = 0;
        function save(arr){
          $.ajax({
            url:domain + '/fastship/saveIndexModuls',
            type:'post',
            dataType:'json',
            data:arr[count]
          })
          .done(function(res){
            if (res.status == 1) {
              if (count < arr.length) {
                save(arr);
              };
            };
          });
          count++;
        };
        save(self.adModuls);
      }

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
  .float-right{
    float: right;
  }
  .float-left{
    float: left;
  }
</style>