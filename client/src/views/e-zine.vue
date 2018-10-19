<template>
	<side-menu></side-menu>
	<div class="content-wrapper">
		<div class="content-header">
    	  <h1>电子杂志</h1>
    	  <ol class="breadcrumb">
    	    <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
    	    <li><a href="#">内容管理</a></li>
    	    <li class="active">电子杂志</li>
    	  </ol>
    	</div>
    	<div class="content">
    		<div class="mb10">
    			<a class="btn btn-danger" :href="'cms/e-zine.html'" target="_blank">浏览</a>
    		</div>
    		<div class="nav-tabs-custom theme-panel mb10">
              <ul class="nav nav-tabs nav-justified">
                <li v-for="item in chennals" :class="{active: currentType == item.type}" @click="switchChennal(item,$index)">
                	<a :href="'/cptbtptp#!/ezine/' + item.type" v-text="item.name"></a>
                </li>
              </ul>
            </div>
            <!-- 推荐 -->
    		<div class="panel panel-body panel-info" v-if="currentType=='recommend'">
    			<div class="mb20">
    				<button class="btn btn-primary" @click="addRecommend(null,null)">添加推荐</button>
    			</div>
    			<table class="table table-hover">
    				<thead>
      		    <th class="col-md-2 text-center">图片</th>
      		    <th class="col-md-1 text-center">名称</th>
      		    <th class="col-md-2 text-center">链接</th>
              <th class="col-md-2 text-center">APP链接</th>
              <th class="col-md-1 text-center">
                <dropdown>
                  <a href="javascript:;" data-toggle="dropdown">
                    显示位置
                    <span class="caret"></span>
                  </a>
                  <ul slot="dropdown-menu" class="dropdown-menu dropdown-area">
                    <li @click="filters(null)"><a href="javascript:;">全部</a></li>
                    <template v-for="area in areasRecommend">
                      <li @click="filters(area.id)"><a href="javascript:;">{{area.name}}</a></li>
                      <li v-if="area.children && area.children.length" v-for="item in area.children" @click="filters(item.id)"><a href="javascript:;">&nbsp; |- {{ item.name }}</a></li>
                    </template>
                  </ul>
                </dropdown>
              </th>
              <th class="col-md-1 text-center">排序</th>
      		    <th class="col-md-1 text-center">是否显示</th>
      		    <th class="col-md-2 text-center">操作</th>
      		  </thead>
      		  <tbody>
      		  	<tr v-for="item in recommendList">
      		  		<td class="col-md-2 text-center"><img :src="item.img | resize"></td>
      		    		<td class="col-md-1 text-center" v-text="item.name"></td>
      		    		<td class="col-md-2 text-center" v-text="item.link"></td>
                  <td class="col-md-2 text-center" v-text="item.appLink"></td>
                  <td class="col-md-2 text-center">{{item.area | areaText areasRecommend}}</td>
                  <td class="col-md-1 text-center" v-text="item.sortId"></td>
      		    		<td class="col-md-1 text-center" v-text="(item.isHidden==1)?'显示':'不显示'"></td>
      		    		<td class="col-md-2 text-center">
      		    			<a href="javascript:;" class="btn btn-primary" @click="addRecommend(item,$index)">编辑</a>
      		    			<a href="javascript:;" class="btn btn-default" @click="delRecommend(item._id,$index)">删除</a>
      		    		</td>
      		  	</tr>
      		  </tbody>
    			</table>
    		</div>
    		<!-- 类目电子杂志 -->
    		<div class="panel panel-body panel-info"  v-if="currentType=='category'">
    			<div class="nav-tabs-custom">
    				<div class="mb10">
    					<span class="h4">Categories</span>
    					<span class="col-sm-offset-1">
    						<a class="btn btn-primary btn-sm" @click="addCategory(1)">添加行业类目</a>
    					</span>
    					<!-- <span class="col-sm-offset-1">
    						<a class="btn btn-primary btn-sm" @click="updateCache">更新缓存</a>
    					</span> -->
    				</div>
    				<ul class="nav nav-tabs">
    					<li v-for="item in categoryList" @click="switchCateCategory(item,$index)" 
    					:class="($index==currentFloorIndex)?'active':''">
    						<a href="javascript:;" v-text="item.name"></a>
    					</li>
    				</ul>
    			</div>
    			<div class="mb10 theme-panel">
    				<button type="button" class="btn btn-primary btn-sm" @click="addCategory(2,currCategory._id)">添加类目杂志</button>
    				<button type="button" class="btn btn-primary btn-sm" @click="editCategory(1,currentFloorIndex)">编辑当前行业类目</button>
    				<button type="button" class="btn btn-sm" @click="delCategory(1,currentFloorIndex,currCategory._id)">删除当前行业类目</button>
            <table class="table table-hover" v-if="currCategory.children&&currCategory.children.length!=0">
              <thead>
                <th class="col-md-2 text-center">图片</th>
                <th class="col-md-2 text-center">名称</th>
                <th class="col-md-3 text-center">链接</th>
                <th class="col-md-2 text-center">是否显示</th>
                <th class="col-md-1 text-center">排序</th>
                <th class="col-md-2 text-center">操作</th>
              </thead>
              <tbody>
                <tr v-for="(idx,item) in currCategory.children">
                  <td class="col-md-2 text-center"><img :src="item.img | resize"></td>
                    <td class="col-md-2 text-center" v-text="item.name"></td>
                    <td class="col-md-3 text-center" v-text="item.link"></td>
                    <td class="col-md-2 text-center" v-text="(item.isHidden==1)?'显示':'不显示'"></td>
                    <td class="col-md-1 text-center" v-text="item.sortId"></td>
                    <td class="col-md-2 text-center">
                      <a href="javascript:;" class="btn btn-primary" @click="editCategory(2,[idx],item)">编辑</a>
                      <a href="javascript:;" class="btn btn-default" @click="delCategory(2,[idx],item._id)">删除</a>
                    </td>
                </tr>
              </tbody>
            </table>
    			</div>
    		</div>
    		<!-- 产业集群电子杂志 -->
    		<div class="panel panel-body panel-info"  v-if="currentType=='industrial'">
    			<div class="nav-tabs-custom">
    				<div class="mb10">
    					<span class="h4">产业集群类目</span>
    					<!-- <span class="col-sm-offset-1">
    						<a class="btn btn-primary btn-sm" @click="addIndustrial(1)">添加行业类目</a>
    					</span> -->
    				</div>
    				<ul class="nav nav-tabs">
    					<li class="width-1-2 lh-text-center" v-for="item in industrialNavList" :class="($index==currentIDTIndex)?'active':''" @click="switchCateIndustrial(item,$index)">
    						<a href="javascript:;" v-text="item.name"></a>
    					</li>
    				</ul>
    			</div>
    			<div class="mb10 theme-panel">
    				<button type="button" class="btn btn-primary btn-sm" @click="addIndustrial(2,industrialClusterType,currentIDTIndex)">添加集群杂志</button>
    				<!-- <button type="button" class="btn btn-primary btn-sm" @click="editIndustrial(1,currentIDTIndex)">编辑当前行业类目</button>
    				<button type="button" class="btn btn-sm" @click="delIndustrial(1,currentIDTIndex,currIndustrial._id)">删除当前行业类目</button> -->
    			</div>
    			<table class="table table-hover" v-if="industrialList&&industrialList.length!=0">
    				<thead>
      		    <th class="col-md-2 text-center">图片</th>
      		    <th class="col-md-2 text-center">名称</th>
      		    <th class="col-md-3 text-center">链接</th>
      		    <th class="col-md-2 text-center">是否显示</th>
      		    <th class="col-md-1 text-center">排序</th>
      		    <th class="col-md-2 text-center">操作</th>
      		  </thead>
      		  <tbody>
      		  	<tr v-for="(idx,item) in industrialList">
      		  		<td class="col-md-2 text-center"><img :src="item.img | resize"></td>
      		    		<td class="col-md-2 text-center" v-text="item.name"></td>
      		    		<td class="col-md-3 text-center" v-text="item.link"></td>
      		    		<td class="col-md-2 text-center" v-text="(item.isHidden==1)?'显示':'不显示'"></td>
      		    		<td class="col-md-1 text-center" v-text="item.sortId"></td>
      		    		<td class="col-md-2 text-center">
      		    			<a href="javascript:;" class="btn btn-primary" @click="editIndustrial(2,$index,item)">编辑</a>
      		    			<a href="javascript:;" class="btn btn-default" @click="delIndustrial(2,idx,item._id)">删除</a>
      		    		</td>
      		  	</tr>
      		  </tbody>
    			</table>
    		</div>
    		<!-- 企业类目电子杂志 -->
    		<div class="panel panel-body panel-info"  v-if="currentType=='compony'">
    			<div class="nav-tabs-custom">
    				<div class="mb10">
    					<span class="h4">企业类目</span>
    					<span class="col-sm-offset-1">
    						<a class="btn btn-primary btn-sm" @click="addCompony(1)">添加行业类目</a>
    					</span>
    				</div>
    				<ul class="nav nav-tabs">
    					<li v-for="item in componyList" :class="(currentCOIndex==$index)?'active':''" @click="switchCateCompony(item,$index)">
    						<a href="javascript:;" v-text="item.name"></a>
    					</li>
    				</ul>
    			</div>
    			<div class="mb10 theme-panel">
    				<button type="button" class="btn btn-primary btn-sm" @click="addCompony(2,currCompony._id,currentCOIndex)">添加企业杂志</button>
    				<button type="button" class="btn btn-primary btn-sm" @click="editCompony(1,currentCOIndex)">编辑当前行业类目</button>
    				<button type="button" class="btn btn-sm" @click="delCompony(1,currentCOIndex,currCompony._id)">删除当前行业类目</button>
    			</div>
    			<table class="table table-hover">
    				<thead>
      		    <th class="col-md-2 text-center">图片</th>
      		    <th class="col-md-2 text-center">名称</th>
      		    <th class="col-md-3 text-center">链接</th>
      		    <th class="col-md-2 text-center">是否显示</th>
      		    <th class="col-md-1 text-center">排序</th>
      		    <th class="col-md-2 text-center">操作</th>
      		  </thead>
      		  <tbody>
      		  	<tr v-for="(idx,item) in currCompony.children">
      		  		<td class="col-md-2 text-center"><img :src="item.img | resize"></td>
      		    		<td class="col-md-2 text-center" v-text="item.name"></td>
      		    		<td class="col-md-3 text-center" v-text="item.link"></td>
      		    		<td class="col-md-2 text-center" v-text="(item.isHidden==1)?'显示':'不显示'"></td>
      		    		<td class="col-md-1 text-center" v-text="item.sortId"></td>
      		    		<td class="col-md-2 text-center">
      		    			<a href="javascript:;" class="btn btn-primary" @click="editCompony(2,idx,item)">编辑</a>
      		    			<a href="javascript:;" class="btn btn-default" @click="delCompony(2,idx,item._id)">删除</a>
      		    		</td>
      		  	</tr>
      		  </tbody>
    			</table>
    		</div>
    	</div>
	</div>
	<!-- 弹窗 -->
	<modal :show.sync="showRecommend" :title=editType+"推荐">
		<div slot="modal-body" class="modal-body">
			<form class="form-horizontal" v-ajax-submit @submit.prevent="saveRecommend">
				<div class="form-group">
					<label for="recommendName" class="col-sm-3 control-label">名称</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="recommendName" id="recommendName" v-model="currRecommend.name">
					</div>
				</div>
				<div class="form-group">
					<label for="recommendLink" class="col-sm-3 control-label">链接</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="recommendLink" id="recommendLink" v-model="currRecommend.link">
					</div>
				</div>
        <div class="form-group">
          <label for="recommendappLink" class="col-sm-3 control-label">APP链接</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="recommendappLink" id="recommendappLink" v-model="currRecommend.appLink">
          </div>
        </div>
				<div class="form-group">
					<label class="col-sm-3 control-label" for="recommendSort">排序</label>
					<div class="col-sm-9">
						<input type="number" class="form-control" name="recommendSort" id="recommendSort" v-model="currRecommend.sortId">
					</div>
				</div>
        <div class="form-group">
          <label class="col-sm-3 control-label" for="recommenderea">显示位置</label>
          <div class="col-sm-9">
            <select class="form-control" v-model="currRecommend.area" required>
              <template v-for="area in areasRecommend">
                <option :value="area.id">{{area.name}}</option>
                <option v-if="area.children && area.children.length" v-for="item in area.children" :value="item.id">&nbsp; |- {{ item.name }}</option>
              </template>
            </select>
          </div>
        </div>
				<div class="form-group">
					<label for="reIsHidden" class="col-sm-3 control-label">是否显示</label>
					<div class="col-sm-9">
						<label class="radio-inline">
							<input type="radio" name="option" value="1" v-model="currRecommend.isHidden"> 显示
						</label>
						<label class="radio-inline">
							<input type="radio" name="option" value="0" v-model="currRecommend.isHidden"> 不显示
						</label>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-3 control-label"  for="recommendImg">图片</label>
					<div class="col-sm-9">
						<upload id="recommendImg" text="上传图片" tips="推荐尺寸：480px*255px<br/>APP端杂志推荐尺寸：448px*636px" :img.sync="currRecommend.img"></upload>
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
	<!-- 类目 -->
	<modal :show.sync="showCategory" :title=editType + "类目">
		<div slot="modal-body" class="modal-body">
			<form class="form-horizontal" v-ajax-submit @submit.prevent="saveCategory">
				<div class="form-group">
					<label for="categoryName" class="col-sm-3 control-label">类目名称</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="categoryName" id="categoryName" v-model="newCategory.name">
					</div>
				</div>
				<div class="form-group">
					<label for="categoryLink" class="col-sm-3 control-label">链接</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="categoryLink" id="categoryLink" v-model="newCategory.link">
					</div>
				</div>
        <div class="form-group">
          <label for="categoryappLink" class="col-sm-3 control-label">APP链接</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="categoryappLink" id="categoryappLink" v-model="newCategory.appLink">
          </div>
        </div>
				<div class="form-group">
					<label class="col-sm-3 control-label" for="categorySort">排序</label>
					<div class="col-sm-9">
						<input type="number" class="form-control" name="categorySort" id="categorySort" v-model="newCategory.sortId">
					</div>
				</div>
				<div class="form-group" v-show="newCategory.parentid=='0'">
					<label class="col-sm-3 control-label"  for="categoryIconimg">图标</label>
					<div class="col-sm-9">
						<upload id="categoryIconimg" text="上传图标" :img.sync="newCategory.iconImg"></upload>
					</div>
				</div>
        <div class="form-group" v-show="newCategory.parentid=='0'">
          <label class="col-sm-3 control-label"  for="categorybgimg">APP背景图片</label>
          <div class="col-sm-9">
            <upload id="categorybgimg" text="上传背景图" tips="推荐尺寸：706px*293px" :img.sync="newCategory.bgImg"></upload>
          </div>
        </div>
        <div class="form-group" v-show="newCategory.parentid!='0'">
          <label class="col-sm-3 control-label"  for="categoryIconimg">图片</label>
          <div class="col-sm-9">
            <upload id="categoryImg" text="上传图片" tips="推荐尺寸：448px*636px" :img.sync="newCategory.img"></upload>
          </div>
        </div>
				<div class="form-group">
					<label for="reIsHidden" class="col-sm-3 control-label">是否显示</label>
					<div class="col-sm-9">
						<label class="radio-inline">
							<input type="radio" name="option" value="1" v-model="newCategory.isHidden"> 显示
						</label>
						<label class="radio-inline">
							<input type="radio" name="option" value="0" v-model="newCategory.isHidden"> 不显示
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
	<!-- 产业集群类目 -->
	<modal :show.sync="showIndustrial" :title=editType+"推荐">
		<div slot="modal-body" class="modal-body">
			<form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndustrial">
				<div class="form-group">
					<label for="industrialCateName" class="col-sm-3 control-label">名称</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="industrialCateName" id="industrialCateName" v-model="newIndustrial.name">
					</div>
				</div>
				<div class="form-group">
					<label for="industrialCateLink" class="col-sm-3 control-label">链接</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="industrialCateLink" id="industrialCateLink" v-model="newIndustrial.link">
					</div>
				</div>
        <div class="form-group">
          <label for="industrialCateappLink" class="col-sm-3 control-label">APP链接</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="industrialCateappLink" id="industrialCateappLink" v-model="newIndustrial.appLink">
          </div>
        </div>
				<div class="form-group">
					<label class="col-sm-3 control-label" for="industrialCateSort">排序</label>
					<div class="col-sm-9">
						<input type="number" class="form-control" name="industrialCateSort" id="industrialCateSort" v-model="newIndustrial.sortId">
					</div>
				</div>
        <div class="form-group">
          <label class="col-sm-3 control-label" for="industrialDistrict">地址</label>
          <div class="col-sm-9">
            <selectdistrict :province.sync="newIndustrial.province" :district.sync="newIndustrial.district" :provinceid.sync="newIndustrial.provinceId" :districtid.sync="newIndustrial.districtId"></selectdistrict>
          </div>
        </div>
				<!-- <div class="form-group" v-if="newIndustrial.parentid=='0'">
					<label class="col-sm-3 control-label"  for="industrialImg">图标</label>
					<div class="col-sm-9">
						<upload id="industrialImg" text="上传图标" :img.sync="newIndustrial.iconImg"></upload>
					</div>
				</div> -->
				<div class="form-group">
					<label for="reIsHidden" class="col-sm-3 control-label">是否显示</label>
					<div class="col-sm-9">
						<label class="radio-inline">
							<input type="radio" name="option" value="1" v-model="newIndustrial.isHidden"> 显示
						</label>
						<label class="radio-inline">
							<input type="radio" name="option" value="0" v-model="newIndustrial.isHidden"> 不显示
						</label>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-3 control-label"  for="industrialCateImg">图片</label>
					<div class="col-sm-9">
						<upload id="industrialCateImg" text="上传图片" tips="推荐尺寸：420px*268px" :img.sync="newIndustrial.img"></upload>
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
	<!-- 企业 -->
	<modal :show.sync="showCompony" :title=editType+"推荐">
		<div slot="modal-body" class="modal-body">
			<form class="form-horizontal" v-ajax-submit @submit.prevent="saveCompony">
				<div class="form-group">
					<label for="componyName" class="col-sm-3 control-label">名称</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="componyName" id="componyName" v-model="newCompony.name">
					</div>
				</div>
				<div class="form-group">
					<label for="componyLink" class="col-sm-3 control-label">链接</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" name="componyLink" id="componyLink" v-model="newCompony.link">
					</div>
				</div>
        <div class="form-group">
          <label for="componyappLink" class="col-sm-3 control-label">APP链接</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="componyappLink" id="componyappLink" v-model="newCompony.appLink">
          </div>
        </div>
				<div class="form-group">
					<label class="col-sm-3 control-label" for="componySort">排序</label>
					<div class="col-sm-9">
						<input type="number" class="form-control" name="componySort" id="componySort" v-model="newCompony.sortId">
					</div>
				</div>
        <div class="form-group" v-if="newCompony.parentid!='0'">
          <label class="col-sm-3 control-label" for="companyDistrict">地址</label>
          <div class="col-sm-9">
            <selectdistrict :province.sync="newCompony.province" :district.sync="newCompony.district" :provinceid.sync="newCompony.provinceId" :districtid.sync="newCompony.districtId"></selectdistrict>
          </div>
        </div>
				<div class="form-group" v-if="newCompony.parentid=='0'">
					<label class="col-sm-3 control-label"  for="coImg">图标</label>
					<div class="col-sm-9">
						<upload id="coImg" text="上传图标" :img.sync="newCompony.iconImg"></upload>
					</div>
				</div>
        <div class="form-group" v-if="newCompony.parentid!='0'">
          <label for="reIsHidden" class="col-sm-3 control-label">所在集群</label>
          <div class="col-sm-9">
            <label class="radio-inline">
              <input type="radio" name="cluster" value="1" v-model="newCompony.clusterType"> 专业镇
            </label>
            <label class="radio-inline">
              <input type="radio" name="cluster" value="2" v-model="newCompony.clusterType"> 专业市场
            </label>
          </div>
        </div>
				<div class="form-group">
					<label for="reIsHidden" class="col-sm-3 control-label">是否显示</label>
					<div class="col-sm-9">
						<label class="radio-inline">
							<input type="radio" name="option" value="1" v-model="newCompony.isHidden"> 显示
						</label>
						<label class="radio-inline">
							<input type="radio" name="option" value="0" v-model="newCompony.isHidden"> 不显示
						</label>
					</div>
				</div>
				<div class="form-group" v-if="newCompony.parentid!='0'">
					<label class="col-sm-3 control-label"  for="componyImg">图片</label>
					<div class="col-sm-9">
						<upload id="componyImg" text="上传图片" tips="推荐尺寸：448px*636px" :img.sync="newCompony.img"></upload>
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
	var recommend = {name:null,link:null,sortId:null,img:null,isHidden:1,appLink:null,area:0},
		category = {name:null,link:'',sortId:null,img:null,isHidden:1,parentid:"0",iconImg:null,children:[],img:null,appLink:null,bgImg:null},
		industrialCate = {name:null,link:null,sortId:null,img:null,isHidden:1,parentid:"0",iconImg:null,children: [],appLink:null,province:"",district:"",provinceId:0,districtId:0,clusterType:1},
		compony = {name:null,link:null,sortId:null,img:null,isHidden:1,parentid:"0",iconImg:null,children:[],appLink:null,province:"",district:"",provinceId:0,districtId:0,clusterType:null};
	var toTreeData = require('../util/tree');

	
	module.exports = {
		data:function(){
			return{
				// 
				showRecommend:false,
				showCategory:false,
				showIndustrial:false,
				showCompony:false,
				// 
				currRecommend:$.extend({},recommend),
				currCategory:$.extend({},category),
				newCategory:$.extend({},category),
				currIndustrial:$.extend({},industrialCate),
				newIndustrial:$.extend({},industrialCate),
				currCompony:$.extend({},compony),
				newCompony:$.extend({},compony),
				// 当前编辑对象所在的索引
				currentIndex:0,
				// 当前楼层所在的索引
				currentFloorIndex:0,
				currentIDTIndex:0,
				currentCOIndex:0,
				//dataList
				recommendList:[],
				categoryList:[],
				industrialList:[], 
        industrialNavList:[{
          name:"专业镇",
          clusterType:1
        },{
          name:"专业市场",
          clusterType:2
        }],
        industrialClusterType:1,
				componyList:[],
				// 
				chennals:[
				 {name:'推荐',type:'recommend'},
				 {name:'类目电子杂志',type:'category'},
				 {name:'产业集群电子杂志',type:'industrial'},
				 {name:'企业电子杂志',type:'compony'}
				],
				currentType:this.$route.params.type || 'recommend',
				editType:'添加',
				// 
				tempChild:[],
        areasRecommend: [
          {id: 11, name: '类别杂志', children: []},
          {id: 12, name: '专业镇杂志', children: []},
          {id: 13, name: '企业杂志', children: []},
          {id: 14, name: 'appVIP杂志', children: []},
          {id: 15, name: 'app推荐杂志', children: []},
          {id: 10, name: '其他'},
        ]
			}
		},
		route:{
			data:function(){
				var self = this;
				switch (self.currentType) {
					case 'recommend':
						self.getRecommend();
						break;
					case 'category':
						this.getCategory();
						break;
					case 'industrial':
						this.getIndustrial();
						break;
					case 'compony':
						this.getCompony();
						break;
				}
			}
		},
		methods:{
			switchChennal:function(a,index){
				var self = this;
				self.currentType = a.type;
			},
			switchCateCategory:function(a,index){
				var self = this;
				self.currCategory = self.categoryList[index];
				self.currentFloorIndex = index;
			},
			switchCateIndustrial:function(a,index){
				var self = this;
        self.industrialClusterType = a.clusterType;
				self.currIndustrial = self.industrialNavList[index];
				self.currentIDTIndex = index;
        self.getIndustrial();
			},
			switchCateCompony:function(a,index){
				var self = this;
				self.currCompony = self.componyList[index];
				self.currentCOIndex = index;
			},
			// 获取数据
			getRecommend:function(){
				var self = this;
				$.ajax({
					url:domain + '/ez/getrecommend',
					type:'get',
					dataType:'json',
				}).done(function(res){
					if (res.status==1) {
						self.recommendList = res.data;
					}
				})
			},
			getCategory:function(){
				var self = this;
				$.ajax({
					url:domain + "/ez/getcategory",
					type:'get',
					dataType:'json'
				}).done(function(res){
					if (res.status == 1) {
						var a = toTreeData(res.data,0);
						self.categoryList = a;
						self.currCategory = $.extend({},a[self.currentFloorIndex]);
					}
				}).fail(function(res){
					console.log(res);
				})
			},
			updateCache:function(){
				var self = this;
				$.ajax({
					url:domain + '/ez/setCateCache',
					tyep:'post'
				}).done(function(res){
					console.log(res);
					if (res.status == 1) {
						alert('更新成功')
					}
				})
			},
			getCompony:function(){
				var self = this;
				$.ajax({
					url:domain + '/ez/getcompony',
					type:'get',
					dataType:'json'
				}).done(function(res){
					if (res.status == 1) {
						var a = toTreeData(res.data,0);
						self.componyList = a;
						self.currCompony = $.extend({},a[self.currentCOIndex]);
					}
				})
			},
			getIndustrial:function(){
				var self = this;
        var params = {clusterType:self.currIndustrial.clusterType};
        console.log(params);
				$.ajax({
					url:domain + '/ez/getindustrial',
					type:'get',
					dataType:'json',
          data:params
				}).done(function(res){
					if (res.status == 1) {
						var a = toTreeData(res.data,0);
						self.industrialList = a;
						self.currIndustrial = $.extend({},a[self.currentIDTIndex]);
					}
				})
			},
			// 编辑/添加
			addRecommend:function(a,index){
				var self = this;
				self.showRecommend = true;
				if (a) {
					self.currRecommend = $.extend({},a);
					self.currentIndex = index;
				}else{
					self.currRecommend = $.extend({},recommend);
				}
			},
			addCategory:function(Zindex,parentId,index){
				var self = this;
				category.parentid = parentId?parentId:'0';
        category.isCate = parentId?false:true;
				self.newCategory = $.extend({},category,{Zindex:Zindex,index:index});
				self.showCategory = true;
			},
			addIndustrial:function(Zindex,clusterType,index){
				var self = this;
        console.log(clusterType)
				industrialCate.clusterType = clusterType?clusterType:1;
				self.newIndustrial = $.extend({},industrialCate,{Zindex:Zindex,index:index});
				console.log(self.newIndustrial);
				self.showIndustrial = true;
			},
			addCompony:function(Zindex,parentid,index){
				var self = this;
				compony.parentid = parentid?parentid:'0';
        compony.isCate = parentid?false:true;
				self.newCompony = $.extend({},compony,{Zindex:Zindex,index:index});
				self.showCompony = true;
			},
			editCategory:function(Zindex,indexs,item){
				var self = this;
				// 顶级不传item
				item = item || self.categoryList[indexs];
        item.isCate = item.parentid==0?true:false;
				indexs = indexs || [];
				self.tempChild = item.children;
				delete item.children;
				self.newCategory = $.extend({},item,{Zindex:Zindex,index: indexs});
				self.showCategory = true;
			},
			editIndustrial:function(Zindex,indexs,item){
				var self = this;
				item = item || self.industrialList[indexs];
				self.tempChild = item.children;
				delete item.children;
				self.newIndustrial = $.extend({},item,{Zindex:Zindex,index: indexs});
				self.showIndustrial = true;
			},
			editCompony:function(Zindex,indexs,item){
				var self = this;
				item = item || self.componyList[indexs];
        item.isCate = item.parentid==0?true:false;
				self.tempChild = item.children;
				delete item.children;
				self.newCompony = $.extend({},item,{Zindex:Zindex,index: indexs});
				self.showCompony = true;
			},
			// 保存
			saveRecommend:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.currRecommend));
				$.ajax({
					url:domain + "/ez/saverecommend",
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status==1) {
						if (params._id) {
							self.recommendList.$set(self.currentIndex,params);
						}else{
							params._id = res.data._id;
							self.recommendList.push(params);
						}
						self.showRecommend = false;
					}
				}).fail(function(res){
					console.log(res);
				})
			},
			saveCategory:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.newCategory));
				$.ajax({
					url:domain + '/ez/savecategory',
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status == 1) {
						if (!params._id) {
							params._id = res.data._id;
							switch(params.Zindex){
								case 1:
									self.categoryList.push(params);
								  break;
								case 2: 
									self.currCategory.children.push(params);
								  break;
								case 3:
								  	self.currCategory.children[self.newCategory.index].children.push(params);
								  break;
							};
						}else{
							switch(params.Zindex){
								case 1:
								  params.children = self.tempChild;
								  self.categoryList.$set(self.currentFloorIndex,params);
								  self.tempChild = [];
								  break;
								case 2:
								  params.children = self.tempChild;
								  self.currCategory.children.$set(self.newCategory.index[0]*1,params);
								  self.tempChild = [];
								  break;
								case 3:
								  self.currCategory.children[self.newCategory.index[0]*1].children.$set(self.newCategory.index[1]*1,params);
								  break;
							};
						};
						self.showCategory = false;
					}
				})
			},
			saveIndustrial:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.newIndustrial));
				$.ajax({
					url:domain + '/ez/saveindustrial',
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status == 1) {
						if (params._id) {
							switch (params.Zindex) {
								case 1:
								  params.children = self.tempChild;
								  self.industrialList.$set(self.currentIDTIndex,params);
								  self.tempChild = [];
								  break;
								case 2:
								  self.industrialList.$set(self.newIndustrial.index,params);
								  break;
							}
						}else{
							params._id = res.data._id;
							switch (params.Zindex) {
								case 1:
								  self.industrialList.push(params);
								  console.log(self.industrialList);
								  break;
								case 2:
								  self.industrialList.unshift(params);
								  break;
							}
						}
						self.showIndustrial = false;
					}
				})
			},
			saveCompony:function(){
				var self = this;
				var params = JSON.parse(JSON.stringify(self.newCompony));
				$.ajax({
					url:domain + '/ez/savecompony',
					type:'post',
					dataType:'json',
					data:params
				}).done(function(res){
					if (res.status == 1) {
						if (params._id) {
							switch (params.Zindex) {
								case 1:
								  params.children = self.tempChild;
								  self.componyList.$set(self.currentCOIndex,params);
								  self.tempChild = [];
								  break;
								case 2:
								  self.currCompony.children.$set(self.newCompony.index,params);
								  break;
							}
						}else{
							params._id = res.data._id;
							switch (params.Zindex) {
								case 1:
								  self.componyList.push(params);
								  break;
								case 2:
								  self.currCompony.children.unshift(params);
								  break;
							}
						}
						self.showCompony = false;
					}
				})
			},
			// 删除
			delRecommend:function(ids,index){
				var self = this;
				if (confirm('确定删除？')) {
					$.ajax({
						url:domain + "/ez/delrecommend/" + ids,
						type:'delete',
						dataType:'json'
					}).done(function(res){
						if (res.status == 1) {
							self.getRecommend();
						}
					})
				};
			},
			delCategory:function(Zindex,index,ids){
				var self = this;
				console.log(Zindex);
				if (confirm('确定删除？')) {
					$.ajax({
						url:domain + '/ez/delcategory/' + ids,
						type:'delete'
					}).done(function(res){
						console.log(res);
						if (res.status == 1) {
							console.log(Zindex)
							switch (Zindex) {
								case 1:
								  self.categoryList.splice(index,1);
								  var len = self.categoryList.length-1;
								  var a = (self.currentFloorIndex >= len)?len:self.currentFloorIndex;
								  self.currentFloorIndex = a;
								  self.currCategory = self.categoryList[a];
								  break;
								case 2:
								  self.currCategory.children.splice(index[0],1);
								  break;
								case 3:
								  self.currCategory.children[index[0]].children.splice(index[1],1);
								  break;
							}
						}
					})
				}
			},
			delIndustrial:function(Zindex,index,ids){
				var self = this;
				if (confirm('确定删除？')) {
					$.ajax({
						url:domain + "/ez/delindustrial/" + ids,
						type:'delete'
					}).done(function(res){
						if (res.status == 1) {
							switch (Zindex) {
								case 1:
								  self.industrialList.splice(index,1);
								  var len = self.industrialList.length;
								 self.currentIDTIndex = (self.currentIDTIndex>=len)?(len-1):self.currentIDTIndex;
								 self.currIndustrial = self.industrialList[self.currentCOIndex];
								  break;
								case 2:
								  self.industrialList.splice(index,1);
								  break;
							}
						}
					})
				}
			},
			delCompony:function(Zindex,index,ids){
				var self = this;
				if (confirm('确定删除？')) {
					$.ajax({
						url:domain + "/ez/delcompony/" + ids,
						type:'delete'
					}).done(function(res){
						if (res.status == 1) {
							switch (Zindex) {
								case 1:
								  self.componyList.splice(index,1);
								  var len = self.componyList.length;
								 self.currentCOIndex = (self.currentCOIndex>=len)?(len-1):self.currentCOIndex;
								 self.currCompony = self.componyList[self.currentCOIndex];
								  break;
								case 2:
								  self.currCompony.children.splice(index,1);
								  break;
							}
						}
					})
				}
			},
      filters:function(){

      }
		},
    filters:{
      areaText:function(val,arr){
        var _res = "其他";
        var _arr = arr || [];
        var _len = _arr.length;
        console.log(val);
        if(val && _len>=0){
          console.log(123);
          for(var i=0;i<_len;i++){
            if (_arr[i].id == val) {
              _res = _arr[i].name;
              break;
            }
            var _children = _arr[i].children;
            if (_children && _children.length) {
              var _childrenLen = _children.length;
              for (var c = 0; c > _childrenLen; c++) {
                if (_children[c].id == val) {
                  _res = _arr[i].name + "-" + _children[c].name;
                }
              }
            }
          }
        }
        return _res;
      }
    },
    components: {
      dropdown: require('../components/dropdown.vue')
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
  .mb20{
  	margin-bottom:20px; 
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
  	height: 520px;
  	border:none;
  }
  .b-y-3{
  	border-top: 2px solid #000;
  }
  .pl10{
  	padding-left: 10px;
  }
  .pr10{
  	padding-right: 10px;
  }
  .hlh30{
  	height: 30px;
  	line-height: 30px;
  }
  .width-1-2{width: 50% !important;margin: 0px !important;}
  .lh-text-center{text-align: center;}
</style>






