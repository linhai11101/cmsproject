<template>
	<side-menu></side-menu>
	<div class="content-wrapper">
		<div class="content-header">
		<h1>活动预告</h1>
			<!-- <ol class="breadcrumb">
				<li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
				<li class="active">促销首页管理</li>
			</ol> -->
		</div>
		<div class="content">
			<div class="mb10">
				<button class="btn btn-primary" @click="addActF(null)">+添加活动预告</button>
			</div>
			<div class="nav-tabs-custom theme-panel">
				<div class="tab-content">
					<div class="panel panel-body panel-info">
						<table class="table table-hover">
							<thead>
								<th class="col-md-1 text-center">序号</th>
								<th class="col-md-1 text-center">预告名称</th>
								<th class="col-md-3 text-center">预告banner图</th>
								<th class="col-md-2 text-center">操作</th>
							</thead>
							<tbody>
								<tr v-for="item in actfList">
									<td class="text-center" v-text="$index"></td>
									<td class="text-center" v-text="item.name"></td>
									<td class="text-center"><img :src="item.img | resize" width="200" height="200"></td>
									<td class="text-center">
										<a class="btn btn-sm btn-primary" v-link="'/activity-forecast/' + item._id">管理</a>
										<button class="btn btn-sm btn-primary" @click="addActF(item,$index)">编辑</button>
										<button class="btn btn-default" @click="delActF(item._id,$index)">删除</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 弹窗 -->
	<modal :show.sync="showactf" title="活动预告">
    <div slot="modal-body" class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveactf">
        <div class="form-group">
          <label class="control-label col-sm-2" for="name">名称</label>
          <div class=" col-sm-10">
            <input class="form-control" type="text" name="name" id="name" v-model="currActF.name" required>
          </div>
        </div>
        <div class="form-group">
          <label for="cateImg" class="col-sm-2 control-label">图片</label>
          <div class="col-sm-10">
            <upload id="cateImg" text="上传图片" :img.sync="currActF.img" required></upload>
          </div>
        </div>
         <!-- <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">链接</label>
            <div class="col-sm-10">
              <input type="url" class="form-control" v-model="currActF.link">
            </div>
          </div> -->
        <div class="form-group">
          <label class="control-label col-sm-2" for="sortId">排序</label>
          <div class="col-sm-10 ">
            <input class="form-control" type="number" name="sortId" id="sortId" v-model="currActF.sortId">
          </div>
        </div>
        <div class="form-group">
          <label for="cateIsShow" class="col-sm-2 control-label">是否推荐</label>
          <div class="col-sm-10">
            <label class="radio-inline">
              <input type="radio" name="option" id="isShow" value="1" v-model="currActF.ishidden">推荐
            </label>
            <label class="radio-inline">
              <input type="radio" name="option" id="unshow" value="0" v-model="currActF.ishidden">不推荐
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
	var webupload = require('../util/webupload/webuploader.min');
	var actf = {name:null,img:null,sortId:null,ishidden:null};
	module.exports = {
		data:function(){
			return{
				showactf:false,
				currActF:$.extend({},actf),
				currIndex:0,
				actfList:[]
			}
		},
		route:{
			data:function(){
				this.getActF();
			}
		},
		methods:{
			getActF:function(){
				var self = this;
				$.ajax({
					url:domain + '/af/getforecastIndex',
					type:'get',
					dataType:'json'
				}).done(function(res){
					if (res.status == 1) {
						self.actfList = res.data;
					}
				})
			},
			addActF:function(a,index){
				var self = this;
				if (a) {
					self.currActF = $.extend({},a);
					self.currIndex = index;
				}else{
					self.currActF = $.extend({},actf);
				};
				self.showactf = true;
			},
			saveactf:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.currActF));
				$.ajax({
					url:domain + '/af/saveforecastIndex',
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status == 1) {
						if (params._id) {
							self.actfList.$set(self.currIndex,params);
						}else{
							params._id = res.data._id;
							self.actfList.unshift(params);
						};
						self.showactf = false;
					};
				})

			},
			delActF:function(id,index){
				var self = this;
				$.ajax({
					url:domain + '/af/delforecastIndex/' + id,
					type:'delete'
				}).done(function(res){
					if (res.status == 1) {
						self.actfList.splice(index,1);
					}
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


