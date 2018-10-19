<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
      <h1>批发中心:{{marketName}}</h1>
      <!-- <ol class="breadcrumb">
        <li><a href="/"><i class="fa fa-dashboard"></i> 首页</a></li>
        <li><a v-link="{ path: '/industrial' }">专业镇</a></li>
        <li class="active"></li>
      </ol> -->
    </div>
    <div class="content">
      <div class="mb10" v-show="visibility =='category'">
        <a class="btn btn-primary" href="/market/{{iwId}}/index.html" target="_blank">预览</a>
      </div>
      <div class="mb10" v-show="visibility == 'marketIndex'">
      <a class="btn btn-primary" href="/market/{{iwId}}/index.html" target="_blank">预览</a>
      </div>
      <div class="mb10" v-show="visibility == 'activity'">
        <a class="btn btn-primary" href="/market/{{iwId}}/activity.html" target="_blank">预览</a>
      </div>
      <div>
        <div class="nav-tabs-custom theme-panel mb10">
          <ul class="nav nav-tabs nav-justified">
            <li :class="{active: visibility == 'category'}" @click="getCategory">
              <a href="javascript:;">类目</a>
            </li> 
            <li :class="{active: visibility == 'marketIndex'}" @click="getIndex">
              <a href="javascript:;">首页</a>
            </li>
            <li :class="{active: visibility == 'activity'}" @click="getActivePage">
              <a href="javascript:;">活动页面</a>
            </li>
            <li :class="{active: visibility == 'AAct'}" @click="getAAct">
              <a href="javascript:;">关联活动</a>
            </li>
          </ul>
        </div>

        <div class="panel panel-body panel-info ">
          <!-- 类目 -->
          <div class="row col-sm-12" v-show="visibility == 'category'">
            <div class="panel-heading">
              <button type="button" class="btn btn-info btn-sm" @click="addCate(null,null)">添加类目</button> 
            </div>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th class="col-md-9 bt-center">类目名</th>
                  <!-- <th class="col-md-6 bt-center">子类目</th> -->
                  <th class="col-md-3 bt-center">管理</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cates">
                  <td class="bt-center" v-text="item.name"></td>
                  <!-- <td>
                    <div class="list-group">
                      <a href="javascript:;" class="list-group-item" v-for="a in item.menuChilds">
                        <span class="col-sm-9" v-text="a.name"></span>
                        <button class="btn btn-info btn-sm" @click="addChildCate(a,$index,item)">编辑</button>
                        <button class="btn btn-info btn-sm" @click="delChildCate(a,$index,item)">删除</button>
                      </a>
                    </div>
                  </td> -->
                  <td class="bt-center">
                    <!-- <button class="btn btn-info btn-sm" @click="addChildCate(null,$index,item)">添加子类目</button> -->
                    <button class="btn btn-info btn-sm" @click="addCate(item,$index)">编辑</button>
                    <button class="btn btn-info btn-sm" @click="delCate(item._id,$index)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 首页 -->
          <div class="row"  v-show="visibility == 'marketIndex'">
            <ul class="nav nav-pills nav-justified col-sm-12" role="tablist">
              <li role="presentation"  :class="{active:vMarketIndex == 'banner'}" @click="getIndexBanner"><a href="javascript:;">首页Banner</a></li>
              <li role="presentation" :class="{active:vMarketIndex == 'recommendations'}" @click="getRecommend"><a href="javascript:;">推荐</a></li>
              <li role="presentation" :class="{active:vMarketIndex == 'hotProduct'}" @click="getHot"><a href="javascript:;">热销产品</a></li>
              <li role="presentation" :class="{active:vMarketIndex == 'bestSeller'}" @click="getSeller"><a href="javascript:;">优质卖家
              </a></li>
              <li role="presentation" :class="{active:vMarketIndex == 'indexActiveRecommend'}" @click="getIndexActive"><a href="javascript:;">活动推荐</a></li>
              <li role="presentation" :class="{active:vMarketIndex == 'comment'}" @click="getFeedback"><a href="javascript:;">评论反馈</a></li> 
            </ul>
            <!-- 首页banner -->
            <div class="col-sm-12" v-show="vMarketIndex == 'banner'">
              <div class="panel-heading">
                <button type="button" class="btn btn-info btn-sm" @click="addBanner">添加banner</button>  
              </div>
              <table class="table table-bordered table-hover panel-body">
                <thead>
                  <tr>
                    <th class="col-md-1 bt-center">序号</th>
                    <th class="col-md-2 bt-center">显示位置</th>
                    <th class="col-md-3 bt-center">名称</th>
                    <th class="col-md-2 bt-center">图片</th>
                    <th class="col-md-2 bt-center">链接地址</th>
                    <th class="col-md-2 bt-center">管理</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in indexBannerList">
                    <td class="bt-center" >{{$index+1}}</td>
                    <td class="bt-center" >
                      <span v-if="item.place == 0">banner</span>
                      <span v-if="item.place == 1">专业市场入驻宣传图</span>
                    </td>
                    <td class="bt-center" v-text="item.name"></td>
                    <td class="bt-center"><img :src="item.img | resize"></td>
                    <td class="bt-center" v-text="item.link"></td>
                    <td class="bt-center">
                      <button class="btn btn-info btn-sm" @click="editIndexBanner(item._id)">编辑</button>
                      <button class="btn btn-info btn-sm" @click="delIndexBanner(item._id)">删除</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="col-md-12">
                <div class="text-right">
                  <pages :total.sync="bannerPage.total" :current="bannerPage.current" :per-page="bannerPage.perPage" :page-changed="bannerPagerCallback"></pages>
                </div>
              </div>
            </div>
            <!-- recommendations -->
            <div class="col-sm-12" v-show="vMarketIndex == 'recommendations'">
             <div class="panel-heading">
              <button type="button" class="btn btn-info btn-sm"  @click="addRecommend">添加推荐</button> 
            </div>
            <table class="table panel-body table-hover">
              <thead>
                <tr class="">
                  <th class="col-md-4 bt-center">店铺图片</th>
                  <th class="col-md-3 bt-center">店铺名称</th>
                  <th class="col-md-2 bt-center">优先级</th>
                  <th class="col-md-3 bt-center">管理</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recommendationsList">
                  <td class="bt-center"><img :src="item.img | resize"></td>
                  <td class="bt-center" v-text="item.shop"></td>
                  <td class="bt-center" v-text="item.sortId">1</td>
                  <td class="bt-center">
                    <button class="btn btn-info btn-sm" @click="editRecommend(item._id)">编辑</button>
                    <button class="btn btn-info btn-sm" @click="recommendCommodity(item.shopId,item._id)" >产品管理</button>
                    <button class="btn btn-info btn-sm" @click="delRecommend(item._id)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="col-md-12">
              <div class="text-right">
                <pages :total.sync="recommendPage.total" :current="recommendPage.current" :per-page="recommendPage.perPage" :page-changed="recommendPagerCallback"></pages>
              </div>
            </div> 
          </div>
          <!-- Hot Products -->
          <div class="col-sm-12" v-show="vMarketIndex == 'hotProduct'">
           <div class="panel-heading">
            <button type="button" class="btn btn-info btn-sm" @click="addHot">添加产品</button> 
          </div>
          <table class="table panel-body table-hover">
            <thead>
              <tr class="">
                <th class="col-md-3 bt-center">店铺名称</th>
                <th class="col-md-2 bt-center">优先级</th>
                <th class="col-md-3 bt-center">管理</th>
              </tr>
            </thead>
            <tbody>
             <tr v-for="item in hotList">
              <td class="bt-center" v-text="item.shop"></td>
              <td class="bt-center" v-text="item.sortId"></td>
              <td class="bt-center">
                <button class="btn btn-info btn-sm" @click="editHot(item._id)">编辑</button>
                <button class="btn btn-info btn-sm" @click="hotCommodity(item.shopId,item._id)" >管理产品</button>
                <button class="btn btn-info btn-sm" @click="delHot(item._id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="col-md-12">
          <div class="text-right">
            <pages :total.sync="hotPage.total" :current="hotPage.current" :per-page="hotPage.perPage" :page-changed="hotPagerCallback"></pages>
          </div>
        </div> 
      </div> 

      <!--Best Sellers -->
      <div class="col-sm-12" v-show="vMarketIndex == 'bestSeller'">
       <div class="panel-heading">
        <button type="button" class="btn btn-info btn-sm" @click="addSeller">添加卖家</button> 
      </div>
      <table class="table panel-body table-hover">
        <thead>
          <tr class="">
            <th class="col-md-3 bt-center">店铺名称</th>
            <th class="col-md-2 bt-center">优先级</th>
            <th class="col-md-3 bt-center">管理</th>
          </tr>
        </thead>
        <tbody>
         <tr v-for="item in bestList">
          <td class="bt-center" v-text="item.shop"></td>
          <td class="bt-center" v-text="item.sortId"></td>
          <td class="bt-center">
            <button class="btn btn-info btn-sm" @click="editSeller(item._id)">编辑</button>
            <button class="btn btn-info btn-sm" @click="bestManage(item.shopId,item._id)" >管理产品</button>
            <button class="btn btn-info btn-sm" @click="delSeller(item._id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="col-md-12">
      <div class="text-right">
        <pages :total.sync="bestPage.total" :current="bestPage.current" :per-page="bestPage.perPage" :page-changed="bestPagerCallback"></pages>
      </div>
    </div> 
  </div>

  <!--活动推荐 -->
  <div class="col-sm-12" v-show="vMarketIndex == 'indexActiveRecommend'">
   <div class="panel-heading">
    <button type="button" class="btn btn-info btn-sm" @click="addIndexActive">添加活动</button> 
  </div>
  <table class="table panel-body table-hover">
    <thead>
      <tr class="">
        <th class="col-md-4 bt-center">活动图片</th>
        <th class="col-md-3 bt-center">活动名称</th>
        <th class="col-md-2 bt-center">优先级</th>
        <th class="col-md-3 bt-center">管理</th>
      </tr>
    </thead>
    <tbody>
     <tr v-for="item in indexActiveList">
       <td class="bt-center"><img :src="item.img | resize"></td>
       <td class="bt-center" v-text="item.name"></td>
       <td class="bt-center" v-text="item.sortId"></td>
       <td class="bt-center">
        <button class="btn btn-info btn-sm" @click="editIndexActive(item._id)">编辑</button>
        <button class="btn btn-info btn-sm" @click="delIndexActive(item._id)">删除</button>
      </td>
    </tr>
  </tbody>
</table>
<div class="col-md-12">
  <div class="text-right">
    <pages :total.sync="indexActivePage.total" :current="indexActivePage.current" :per-page="indexActivePage.perPage" :page-changed="indexActivePager"></pages>
  </div>
</div> 
</div> 

<!--评论反馈 -->
<div class="col-sm-12" v-show="vMarketIndex == 'comment'">
 <div class="panel-heading">
  <button type="button" class="btn btn-info btn-sm" @click="addFeedback">添加反馈</button> 
</div>
<table class="table panel-body table-hover">
  <thead>
    <tr class="">
      <th class="col-md-3 bt-center">反馈图片</th>
      <th class="col-md-3 bt-center">反馈标题</th>
      <th class="col-md-3 bt-center">优先级</th>
      <th class="col-md-3 bt-center">管理</th>
    </tr>
  </thead>
  <tbody>
   <tr v-for="item in feedbackList">
     <td class="bt-center"><img :src="item.img | resize"></td>
     <td class="bt-center" v-text="item.title"></td>
     <td class="bt-center" v-text="item.sortId"></td>
     <td class="bt-center">
      <button class="btn btn-info btn-sm" @click="editFeedback(item._id)">编辑</button>
      <button class="btn btn-info btn-sm" @click="delFeedback(item._id)">删除</button>
    </td>
  </tr>
</tbody>
</table>
<div class="col-md-12">
  <div class="text-right">
    <pages :total.sync="feedBackPage.total" :current="feedBackPage.current" :per-page="feedBackPage.perPage" :page-changed="feedBackPager"></pages>
  </div>
</div>
</div>
</div>

<!-- 活动页面 -->
<div class="row"  v-show="visibility == 'activity'">
  <ul class="nav nav-pills nav-justified col-sm-12" role="tablist">
    <li role="presentation"  :class="{active:vActive == 'banner'}" @click="getActiveBanner"><a href="javascript:;">活动页Banner</a></li>
    <li role="presentation" :class="{active:vActive == 'active'}" @click="getActive"><a href="javascript:;">推荐的活动</a></li>
  </ul>
  <div class="col-sm-12" v-show="vActive== 'banner'">
    <div class="panel-heading">
      <button type="button" class="btn btn-info btn-sm" @click="addActiveBanner">添加banner</button>  
    </div>
    <table class="table table-bordered table-hover panel-body">
      <thead>
        <tr>
          <th class="col-md-1 bt-center">序号</th>
          <th class="col-md-2 bt-center">显示位置</th>
          <th class="col-md-3 bt-center">名称</th>
          <th class="col-md-2 bt-center">图片</th>
          <th class="col-md-2 bt-center">链接地址</th>
          <th class="col-md-2 bt-center">管理</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in activeBannerList">
          <td class="bt-center" >{{$index+1}}</td>
          <td class="bt-center" >
            <span v-if="item.place == 0">banner</span>
            <span v-if="item.place == 1">右上banner</span>
            <span v-if="item.place == 2">右下banner</span>
          </td>
          <td class="bt-center" v-text="item.name"></td>
          <td class="bt-center"><img :src="item.img | resize"></td>
          <td class="bt-center" v-text="item.link"></td>
          <td class="bt-center">
            <button class="btn btn-info btn-sm" @click="editActiveBanner(item._id)">编辑</button>
            <button class="btn btn-info btn-sm" @click="delActiveBanner(item._id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="col-md-12">
      <div class="text-right">
        <pages :total.sync="activeBannerPage.total" :current="activeBannerPage.current" :per-page="activeBannerPage.perPage" :page-changed="activeBannerPager"></pages>
      </div>
    </div>
  </div>

  <div class="col-sm-12" v-show="vActive == 'active'">
    <div class="panel-heading">
      <button type="button" class="btn btn-info btn-sm" @click="addActive">添加推荐活动</button>  
    </div>
    <table class="table table-bordered table-hover panel-body">
      <thead>
        <tr>
          <th class="col-md-1 bt-center">活动名称</th>
          <th class="col-md-2 bt-center">优先级</th>
          <th class="col-md-3 bt-center">管理</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in activeList">
          <td class="bt-center" v-text="item.name"></td>
          <td class="bt-center" v-text="item.sortId"></td>
          <td class="bt-center">
            <button class="btn btn-info btn-sm" @click="editActive(item._id)">编辑</button>
            <button class="btn btn-info btn-sm" @click="delActive(item._id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="col-md-12">
      <div class="text-right">
        <pages :total.sync="activePage.total" :current="activePage.current" :per-page="activePage.perPage" :page-changed="activePager"></pages>
      </div>
    </div>
  </div>
</div>
<!-- 所有活动 -->
<div class="col-sm-12" v-show="visibility == 'AAct'">
  <div class="panel-heading">
    <button type="button" class="btn btn-primary btn-sm" @click="synAActList">同步关联活动</button> 
  </div>
  <table class="table table-bordered table-hover panel-body">
    <thead>
      <tr>
        <th class="col-md-1 bt-center">序号</th>
        <th class="col-md-3 bt-center">封面图片</th>
        <!-- <th class="col-md-2 bt-center">CMS图片</th> -->
        <th class="col-md-3 bt-center">名称</th>
        <th class="col-md-1 bt-center">优先级</th>
        <th class="col-md-1 bt-center">是否推荐</th>
        <th class="col-md-2 bt-center">管理</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in remoteAActList">
        <td class="bt-center" v-text="$index+1"></td>
        <td class="bt-center"><img :src="item.image | resize"></td>
        <!-- <td class="bt-center"><img :src="item.cmsImg | resize"></td> -->
        <td class="bt-center" v-text="item.name"></td>
        <td class="bt-center" v-text="item.sortId==1?'显示':'不显示'"></td>
        <td class="bt-center" v-text="item.isRecommend"></td>
        <td class="bt-center">
          <button class="btn btn-primary btn-sm" @click="editAActs(item, $index)">编辑</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<!-- 弹框 -->
<!-- 首页banner -->
<modal :show.sync="indexBanner"  title="banner">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal"  @submit.prevent="saveIndexBanner">
      <div class="form-group">
        <label for="bannerActive" class="col-sm-2 control-label">名称</label>
        <div class="col-sm-10">
          <input type="text" name="bannerActive" id="banner-active" class="form-control"v-model="indexBannerMsg.name" >
        </div>
      </div>
      <div class="form-group" >
        <label for="bannerPlace" class="col-sm-2 control-label">显示位置</label>
        <div class="col-sm-10">
          <input type="radio" name="indexBannerPlace" value="0" v-model="indexBannerMsg.place">banner
          <input type="radio" name="indexBannerPlace" value="1" v-model="indexBannerMsg.place">批发中心入驻宣传图
        </div>
      </div>
      <div class="form-group" style="position:relative">
        <label for="bannerImg" class="col-sm-2 control-label">图片</label>
        <div class="col-sm-10">
          <upload id="banner-img" text="上传图片" :img.sync="indexBannerMsg.img"></upload>
        </div>
        <span style="position:absolute;left:225px;top:5px;">banner尺寸：920px*320px；宣传图尺寸：260px*320px</span>
      </div>
      <div class="form-group">
        <label for="bannerLink" class="col-sm-2 control-label">跳转链接</label>
        <div class="col-sm-10">
          <input type="text" name="bannerLink" id="banner-link" class="form-control" v-model="indexBannerMsg.link">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <button class="btn btn-primary" type="submit">保存</button>
        </div>
      </div>
    </form>
  </div>
  <div slot="modal-footer"></div>
</modal>

<!-- 专业市场推荐 -->
<modal :show.sync="indexRecommend"  title="推荐店铺">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal" >
      <div class="form-group">
        <label class="col-sm-2 control-label">搜索店铺</label>
        <div class="col-sm-10">
          <input type="text" id="recommendations" name="recommendShop"  class="form-control"   @keyup="getShop" v-model="recommendationMsg.shop"  autocomplete="off">
          <ul class="dropdown-menu shop-list" v-if="shopList.length>0">
            <li v-for="item in shopList" >
              <a href="javascript:;"  @click="recommendSopCheck(item.nameEn,item.id)">{{item.nameEn}}</a>
            </li>
          </ul>
          <div v-show="shopList.length == 0">店铺不存在</div>
        </div>
      </div>
      <div class="form-group">
        <label for="recommendSort" class="col-sm-2 control-label">优先级</label>
        <div class="col-sm-10">
          <input type="number" name="recommendSort" id="recommend-sort" class="form-control" v-model="recommendationMsg.sortId">
        </div>
      </div>
      <div class="form-group">
        <label for="recommendImg" class="col-sm-2 control-label">图片</label>
        <span class="img-msg">推荐尺寸：260px*420px</span>
        <div class="col-sm-10">
          <upload id="recommend-img" text="上传图片" :img.sync="recommendationMsg.img"></upload>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <input class="btn btn-primary save-btn" type="button"  @click="saveRecommendation"  value="保存">
        </div>
      </div>
    </form>
  </div>
  <div slot="modal-footer"></div>
</modal>

<modal :show.sync="recommendFlag"  title="店铺推荐产品">
  <div slot="modal-body" class="modal-body">
   <div class="panel-heading">
    <button type="button" class="btn btn-info btn-sm"  @click="addNewCommodity">添加产品</button> 
  </div>
  <table class="table panel-body table-hover">
    <thead>
      <tr class="">
        <th class="bt-center">序号</th>
        <th class=" bt-center">产品图片</th>
        <th class=" bt-center">店铺名称</th>
        <th class=" bt-center">优先级</th>
        <th class=" bt-center">管理</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in recommendProductList">
        <td class="bt-center" v-text="$index+1"></td>
        <td class="bt-center "><img class="model-img" :src="item.img | resize"></td>
        <td class="bt-center" v-text="item.name"></td>
        <td class="bt-center" v-text="item.sortId"></td>
        <td class="bt-center">
          <button class="btn btn-info btn-sm" @click="editCommodity(item._id)">编辑</button>
          <button class="btn btn-info btn-sm" @click="delCommodity(item._id)">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div slot="modal-footer"></div>
</modal>

<!-- 添加Hot Products -->

<modal :show.sync="indexHot"  title="热销产品">
  <div slot="modal-body" class="modal-body">
   <form class="form-horizontal" >
    <div class="form-group">
      <label for="recommendShop" class="col-sm-2 control-label">搜索店铺</label>
      <div class="col-sm-10">
        <input type="text" id="hot-shop"   class="form-control"   @keyup="getShop" v-model="hotMsg.shop" autocomplete="off">
        <ul class="dropdown-menu shop-list" v-show="shopList.length>0">
          <li v-for="item in shopList" >
            <a href="javascript:;"  @click="hotShopCheck(item)">{{item.nameEn}}</a>
          </li>
        </ul>
        <div v-show="shopList.length == 0">店铺不存在</div>
      </div>
    </div>
    <div class="form-group">
      <label for="recommendSort" class="col-sm-2 control-label">优先级</label>
      <div class="col-sm-10">
        <input type="number" name="recommendSort" id="recommend-sort" class="form-control" v-model="hotMsg.sortId">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-10 col-sm-offset-2">
        <input class="btn btn-primary save-btn" type="button"  @click="saveHot"  value="保存">
      </div>
    </div>
  </form>
</div>
<div slot="modal-footer"></div>
</modal>


<modal :show.sync="hotFlag"  title="推荐热销产品">
  <div slot="modal-body" class="modal-body">
   <div class="panel-heading">
    <button type="button" class="btn btn-info btn-sm" id="add-new-hot"  @click="addHotProduct">添加产品</button> 
  </div>

  <table class="table panel-body table-hover">
    <thead>
      <tr class="">
        <th class="bt-center">序号</th>
        <th class=" bt-center">产品图片</th>
        <th class=" bt-center">店铺名称</th>
        <th class=" bt-center">优先级</th>
        <th class=" bt-center">管理</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in hotProductList">
        <td class="bt-center" v-text="$index+1"></td>
        <td class="bt-center"><img class="model-img" :src="item.img | resize"></td>
        <td class="bt-center" v-text="item.name"></td>
        <td class="bt-center" v-text="item.sortId"></td>
        <td class="bt-center">
          <button class="btn btn-info btn-sm" @click="editHotProduct(item._id)">编辑</button>
          <button class="btn btn-info btn-sm" @click="delHotProduct(item._id)">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div slot="modal-footer"></div>
</modal>

<!-- 添加best seller -->
<modal :show.sync="indexSeller"  title="优质买家">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal" >
      <div class="form-group">
        <label for="recommendShop" class="col-sm-2 control-label">搜索店铺</label>
        <div class="col-sm-10">
          <input type="text" id="best-seller-shop" name="recommendShop"  class="form-control"   @keyup="getShop" v-model="bestMsg.shop" autocomplete="off">
          <ul class="dropdown-menu shop-list" v-show="shopList.length>0">
            <li v-for="item in shopList" >
              <a href="javascript:;"  @click="bestShopCheck(item)">{{item.nameEn}}</a>
            </li>
          </ul>
          <div v-show="shopList.length == 0">店铺不存在</div>
        </div>
      </div>
      <div class="form-group">
        <label for="recommendSort" class="col-sm-2 control-label">优先级</label>
        <div class="col-sm-10">
          <input type="number" name="recommendSort" id="recommend-sort" class="form-control" v-model="bestMsg.sortId">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <input class="btn btn-primary save-btn" type="button"  @click="saveSeller"  value="保存">
        </div>
      </div>
    </form>
  </div>
  <div slot="modal-footer"></div>
</modal>

<modal :show.sync="sellerFlag"  title="推荐产品">
  <div slot="modal-body" class="modal-body">
   <div class="panel-heading">
    <button type="button" class="btn btn-info btn-sm"  @click="addSellProduct">添加产品</button> 
  </div>
  <table class="table panel-body table-hover">
    <thead>
      <tr class="">
        <th class="bt-center">序号</th>
        <th class=" bt-center">产品图片</th>
        <th class=" bt-center">店铺名称</th>
        <th class=" bt-center">优先级</th>
        <th class=" bt-center">管理</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in bestProductList">
        <td class="bt-center" v-text="$index+1"></td>
        <td class="bt-center"><img class="model-img" :src="item.img | resize"></td>
        <td class="bt-center" v-text="item.name"></td>
        <td class="bt-center" v-text="item.sortId"></td>
        <td class="bt-center">
          <button class="btn btn-info btn-sm" @click="editBestProduct(item._id)">编辑</button>
          <button class="btn btn-info btn-sm" @click="delBestProduct(item._id)">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div slot="modal-footer"></div>
</modal>

<modal :show.sync="recommendProductFlag"  title="产品">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal"  >
      <div class="form-group">
        <label class="col-sm-2 control-label">搜索产品</label>
        <div class="col-sm-10">
          <input type="text" id="product-name"   class="form-control"   @keyup="getProduct" v-model="product.name" autocomplete="off">
          <ul class="dropdown-menu product-list" v-show="productList.length>0">
            <li v-for="item in productList" >
              <a href="javascript:;"  @click="productCheck(item)">{{item.name}}</a>
            </li>
          </ul>
          <div v-show="productList.length == 0">该产品查找不到,请从新输入</div>
        </div>
      </div>
      <div class="form-group">
        <label for="recommendProductSort" class="col-sm-2 control-label">优先级</label>
        <div class="col-sm-10">
          <input type="number" name="recommendProductSort" id="recommend-product-sort" v-model="product.sortId" class="form-control" >
        </div>
      </div>
      <div class="form-group">
        <label for="productImg" class="col-sm-2 control-label">图片</label>
        <div class="col-sm-10">
          <upload id="product-img" text="上传图片" :img.sync="product.img"></upload>
        </div>
      </div>
      <div class="form-group">
       <div class="col-sm-10 col-sm-offset-2">
        <input class="btn btn-primary save-product-btn" type="button"  @click="saveProduct"  value="保存">
      </div>
    </div>
  </form>
</div>
<div slot="modal-footer"></div>
</modal>

<!-- 首页活动 -->
<modal :show.sync="indexActiveFlag"  title="首页活动">
 <div slot="modal-body" class="modal-body">
  <form class="form-horizontal"  >
    <div class="form-group">
      <label class="col-sm-2 control-label">活动名称</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="index-active-name"  @keyup="getActiveName" v-model="indexActive.name" autocomplete="off">
        <ul class="dropdown-menu active-list" v-show="getActiveList.length>0">
          <li v-for="item in getActiveList" >
            <a href="javascript:;"  @click="indexActiveCheck(item)">{{item.name}}</a>
          </li>
        </ul>
        <div v-show="getActiveList.length == 0">该活动查找不到,请从新输入</div>
      </div>
    </div>
    <div class="form-group">
      <label for="recommendProductSort" class="col-sm-2 control-label">优先级</label>
      <div class="col-sm-10">
        <input type="number" name="recommendProductSort"  v-model="indexActive.sortId" class="form-control" >
      </div>
    </div>
    <div class="form-group">
      <label for="indexActiveImg" class="col-sm-2 control-label">图片</label>
      <span class="img-msg">优先级为1时尺寸为500px*240px<br/>其他为160px*100px</span>
      <div class="col-sm-10">
        <upload id="active-img" text="上传图片" :img.sync="indexActive.img"></upload>
      </div>
    </div>
    <div class="form-group">
     <div class="col-sm-10 col-sm-offset-2">
      <input class="btn btn-primary save-product-btn" type="button"  @click="saveIndexActive"  value="保存">
    </div>
  </div>
</form>
</div>
<div slot="modal-footer"></div>
</modal>
<!-- 首页反馈 -->
<modal :show.sync="feedback"  title="首页反馈">
 <div slot="modal-body" class="modal-body">
  <form class="form-horizontal"  >
    <div class="form-group">
      <label class="col-sm-2 control-label">反馈标题</label>
      <div class="col-sm-10">
        <input type="text" id="feedback-name"   class="form-control"   @keyup="getFeedbackName" v-model="feedbackMsg.title" autocomplete="off">
        <ul class="dropdown-menu feedback-list" v-show="getFeedbackList.length>0">
          <li v-for="item in getFeedbackList" >
            <a href="javascript:;"  @click="feedbackCheck(item)" v-text="item.title"></a>
          </li>
        </ul>
        <div v-show="getFeedbackList.length == 0">没有评论反馈</div>
      </div>
    </div>
    <div class="form-group">
      <label for="recommendProductSort" class="col-sm-2 control-label">优先级</label>
      <div class="col-sm-10">
        <input type="number" name="recommendProductSort"  v-model="feedbackMsg.sortId" class="form-control" >
      </div>
    </div>
    <div class="form-group">
      <label for="indexActiveImg" class="col-sm-2 control-label">图片</label>
      <div class="col-sm-10">
        <upload id="feedback-img" text="上传图片" :img.sync="feedbackMsg.img"></upload>
      </div>
    </div>
    <div class="form-group">
     <div class="col-sm-10 col-sm-offset-2">
      <input class="btn btn-primary save-product-btn" type="button"  @click="saveFeedback"  value="保存">
    </div>
  </div>
</form>
</div>
<div slot="modal-footer"></div>
</modal>

<!-- 活动页banner -->
<modal :show.sync="activeBanner"  title="banner">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal"  @submit.prevent="saveActiveBanner">
      <div class="form-group">
        <label for="bannerActive" class="col-sm-2 control-label">名称</label>
        <div class="col-sm-10">
          <input type="text" name="bannerActive" id="banner-active" class="form-control"v-model="activeBannerMsg.name" >
        </div>
      </div>        
      <div class="form-group">
        <label for="bannerPlace" class="col-sm-2 control-label">显示位置</label>
        <div class="col-sm-10">
          <input type="radio" name="activeBannerPlace" value="0" v-model="activeBannerMsg.place">banner
          <input type="radio" name="activeBannerPlace" value="1" v-model="activeBannerMsg.place">右上banner
          <input type="radio" name="activeBannerPlace" value="2" v-model="activeBannerMsg.place">右下banner
        </div>
      </div>
      <div class="form-group">
        <label for="bannerImg" class="col-sm-2 control-label">图片</label>
        <span class="img-msg"> banner尺寸:880px*320px<br/>右上广告图右下广告图的尺寸:300px*150px</span>
        <div class="col-sm-10">
          <upload id="active-banner-img" text="上传图片" :img.sync="activeBannerMsg.img"></upload>

        </div>
      </div>
      <div class="form-group">
        <label for="bannerLink" class="col-sm-2 control-label">跳转链接</label>
        <div class="col-sm-10">
          <input type="text" name="bannerLink" id="banner-link" class="form-control" v-model="activeBannerMsg.link">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-10 col-sm-offset-2">
          <button class="btn btn-primary" type="submit">保存</button>
        </div>
      </div>
    </form>
  </div>
  <div slot="modal-footer"></div>
</modal>

<modal :show.sync="activeFlag"  title="活动">
 <div slot="modal-body" class="modal-body">
  <form class="form-horizontal"  >
    <div class="form-group">
      <label class="col-sm-2 control-label">活动名称</label>
      <div class="col-sm-10">
        <input type="text"  class="form-control " id="active-name"  @focus="getActiveName" @keyup="getActiveName" v-model="activeMsg.name" autocomplete="off">
        <ul class="dropdown-menu active-list" v-show="getActiveList.length>0">
          <li v-for="item in getActiveList" >
            <a href="javascript:;"  @click="activeCheck(item)">{{item.name}}</a>
          </li>
        </ul>
        <div v-show="getActiveList.length == 0">活动查找不到</div>
      </div>
    </div>
    <div class="form-group">
      <label for="recommendProductSort" class="col-sm-2 control-label">优先级</label>
      <div class="col-sm-10">
        <input type="number" name="recommendProductSort"  v-model="activeMsg.sortId" class="form-control" >
      </div>
    </div>
    <div class="form-group">
     <div class="col-sm-10 col-sm-offset-2">
      <input class="btn btn-primary save-product-btn" type="button"  @click="saveActive"  value="保存">
    </div>
  </div>
</form>
</div>
<div slot="modal-footer"></div>
</modal>
<!-- 类目添加 -->
<modal :show.sync="showCate" title="添加类目">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal" >
     <div class="form-group">
      <label class="col-sm-2 control-label">搜索类目</label>
      <div class="col-sm-10">
        <input type="text" id="cate"   class="form-control"   @keyup="getCateName" v-model="cate.name"  autocomplete="off">
        <ul class="dropdown-menu cate-list" v-show="cateList.length>0">
          <li v-for="item in cateList" >
            <a href="javascript:;"  @click="cateCheck(item.nameEn,item.id)">{{item.nameEn}}</a>
          </li>
        </ul>
        <div v-show="cateList.length == 0">该类目查找不到，请从新输入</div>
      </div>
    </div>
    <div class="form-group">
      <label for="cateSortId" class="col-sm-2 control-label">优先级</label>
      <div class="col-sm-10">
        <input type="number"  id="cateSortId" class="form-control" v-model="cate.sortId">
      </div>
    </div>
    <div class="form-group">
     <div class="col-sm-10 col-sm-offset-2">
      <input class="btn btn-primary save-product-btn" type="button"  @click="saveCate"  value="保存">
    </div>
  </div>
</form>
</div>
<div slot="modal-footer"></div>
</modal>
<!-- 类目子添加 -->
<modal :show.sync="showCateChild" title="添加子类目">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal" >
      <div class="form-group">
        <label class="col-sm-2 control-label">搜索类目</label>
        <div class="col-sm-10">
          <input type="text" id="cate-child"   class="form-control"   @keyup="getCateName" v-model="cateChild.name"  autocomplete="off">
          <ul class="dropdown-menu cate-list" v-show="cateList.length>0">
            <li v-for="item in cateList" >
              <a href="javascript:;"  @click="cateChildCheck(item.nameEn)">{{item.nameEn}}</a>
            </li>
          </ul>
          <div v-show="cateList.length == 0">该类目查找不到，请从新输入</div>
        </div>
      </div>
      <div class="form-group">
       <div class="col-sm-10 col-sm-offset-2">
        <input class="btn btn-primary save-product-btn" type="button"  @click="saveCateChild"  value="保存">
      </div>
    </div>
  </form>
</div>
<div slot="modal-footer"></div>
</modal>
<!-- 批发市场所有活动 -->
<modal :show.sync="showAAct" title="编辑活动">
  <div slot="modal-body" class="modal-body">
    <form class="form-horizontal" v-ajax-submit @submit.prevent="saveAAct">
      <div class="form-group pos-parent">
        <label for="activityActName" class="col-sm-3 control-label">对应的活动</label>
        <div class="col-sm-9 pos-parent" style="position:relative;">
          <input type="text" class="form-control" name="AActName" id="AActName" v-model="remoteAAct.name" autocomplete="off" disabled />
        </div>
      </div>
      <div class="form-group">
        <label for="AActSortId" class="col-sm-3 control-label">优先级</label>
        <div class="col-sm-9">
          <input type="number" name="AActSortId" id="AActSortId" class="form-control" v-model="remoteAAct.sortId">
        </div>
      </div>
      <!-- <div class="form-group">
        <label for="AActcmsImg" class="col-sm-3 control-label">图片</label>
        <div class="col-sm-9">
          <upload id="AActcmsImg" text="上传图片" :img.sync="remoteAAct.cmsImg"></upload>
        </div>
      </div> -->
      <div class="form-group">
        <label for="AActLink" class="col-sm-3 control-label">链接</label>
        <div class="col-sm-9">
          <input type="text" name="AActLink" id="AActLink" class="form-control" v-model="remoteAAct.link">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">是否推荐</label>
        <div class="col-sm-9">
          是<input type="radio" name="AActrecommend" value="1" v-model="remoteAAct.isRecommend"/>&nbsp;
          否<input type="radio" name="AActrecommend" value="0" v-model="remoteAAct.isRecommend"/>
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
  var remoteAAct = {cmsImg:null,name:null,isRecommend:1,sortId:null};
  module.exports={
    data:function(){
      return{
        visibility:"category",
        vMarketIndex:"",
        vActive:"",
        marketName:'',
        indexBannerList:[],
        activeBannerList:[],
        recommendationsList:[],
        bestList:[],
        bestProductList:[],
        hotList:[],
        hotProductList:[],
        shopList:["11"],
        productList:['11'],
        cates:[],
        recommendProductList:[],
        activeList:[],
        getActiveList:["1"],
        indexActiveList:[],
        feedbackList:[],
        getFeedbackList:["1"],
        cateList:["1"],
        indexRecommend:false,
        recommendFlag:false,
        recommendProductFlag:false,
        indexBanner:false,
        indexHot:false,
        hotFlag:false,
        indexSeller:false,
        sellerFlag:false,
        indexActiveFlag:false,
        feedback:false,
        activeBanner:false,
        activeFlag:false,
        showCate:false,
        showCateChild:false,
        getShopFlag:'',
        getProductFlag:'',
        editProductUrl:'',
        delProductUrl:'',
        shopId:'',
        cateFlag:'',
        activeName:'',
        iwId:this.$route.params.id,
          // 当前索引
          currentidx:null,
        // 二级子类目索引
        childcurrentidx:null,
        product:{
          name:'',
          sortId:'',
          img:'',
          productId:''
        },
        indexBannerMsg:{
          name:'',
          place:'',
          img:'',
          link:''
        },
        recommendationMsg:{
          shop:'',
          sortId:'',
          img:'',
          id:''
        },
        bestMsg:{
          shop:'',
          sortId:'',
          id:'',
          companyLogo:''
        },
        hotMsg:{
          shop:'',
          sortId:'',
          id:''
        },
        bannerPage: {
          total: null,
          current: 1,
          perPage:10
        },
        recommendPage: {
          total: null,
          current: 1,
          perPage:10
        },
        hotPage: {
          total: null,
          current: 1,
          perPage:10
        },
        bestPage: {
          total: null,
          current: 1,
          perPage:10
        },
        activeBannerPage: {
          total: null,
          current: 1,
          perPage:10
        },
        activeBannerMsg:{
          name:'',
          place:'',
          img:'',
          link:''
        },
        indexActivePage: {
          total: null,
          current: 1,
          perPage:10
        },
        feedBackPage: {
          total: null,
          current: 1,
          perPage:10
        },
        activePage: {
          total: null,
          current: 1,
          perPage:10
        },
        indexActive:{
          name:'',
          img:"",
          sortId:""
        },
        feedbackMsg:{
          name:'',
          img:"",
          sortId:"",
          title:''
        },
        activeMsg:{
          name:'',
          sortId:""
        },
        cate:{
          name:null,
          sortId:null,
          menuChilds:[]
        },
        cateChild:{
          name:null,
          parentId:null
        },
      // 页面所有活动
      remoteAAct:$.extend({},remoteAAct),
      remoteAActList:[],
      showAAct:false
    }
  },
  route:{
    data:function(){
      this.getCategory();
      this.getMarketName();
    }
  },
  methods:{
    getMarketName:function(){
      var self = this ;
      var params = {
        iwId:self.iwId
      }
      $.ajax({
        url: domain + '/marketOne',
        data:params,
        type: 'GET'
      })
      .done(function(res) {
        if (res.status==1 && res.data.length!=0) {
          self.marketName = res.data[0].nameEn;
        };
      });

    },
    getShop:function(){
      var self= this ;
      var iwId = self.iwId;
      $(".save-btn").prop("disabled",true);
      var value ='';
      if(this.getShopFlag==1){
        value = $("#recommendations").val();
      }else if(this.getShopFlag == 2){
        value= $("#hot-shop").val();
      }else if(this.getShopFlag==3){
        value = $("#best-seller-shop").val();    
      }
      $.ajax({
        url:domainCrm+"/cms/iwIclusters/relevanceCompany.cf",
        type:"POST",
        data:{companyName:value,iwId:iwId}
      }).done(function(res){
       if(res.code == 0&&res.data.length>0){
        $(".shop-list").css("display","block");
        self.shopList = res.data.splice(0,9); 
      }else{
        self.shopList = [];
        $(".save-btn").prop("disabled",true);   
      }   

    })       
    },
    getProduct:function(){
     $(".save-product-btn").prop("disabled",true);
     var self= this ;
     var value = $("#product-name").val();
     var id = this.shopId;
     var iwId = self.iwId;
     $.ajax({
      url:domainCrm+"/cms/wcenter/home/product.cf",
      type:"POST",
      data:{companyId:id,productName:value,iwId:iwId}
    }).done(function(res){
      if(res.data&&res.data.length>0){
        self.productList = res.data.splice(0,9); 
        $(".product-list").css("display","block");
        console.log(self.productList);
        return;
      }else{
        self.productList = [];
        $(".save-btn").prop("disabled",true);   
      }   
    })       
  },
  getCateName:function(){
    $(".save-product-btn").prop("disabled",true);
    var self= this ;
    var value = '';
    if(this.cateFlag == "cate"){
      value = $("#cate").val();
    }
    if(this.cateFlag == "cateChild"){
      value = $("#cate-child").val();
    }
    $.ajax({
      url:domainCrm+"/cms/iwIclusters/home/categoryList.cf",
      type:"POST",
      data:{categoryName:value}
    }).done(function(res){
      if(res.data&&res.data.length>0){
       $(".cate-list").css("display","block")
       self.cateList = res.data.splice(0,9); 
     }else{
      self.cateList = []; 
    }   
  })       
  },
  getActiveName:function(){
   $(".save-product-btn").prop("disabled",true);
   var self= this ;
   var value = '';
   var iwId = self.iwId;
   if(this.activeName == "active"){
    value = $("#active-name").val();
  }
  if(this.activeName == "indexActive"){
    value = $("#index-active-name").val();
  }
  $.ajax({
    url:domainCrm + "/cms/iwIclusters/activity.cf",
    type:"get",
    data:{iwId:iwId,activityName:value}
  }).done(function(res){
    if(res.data&&res.data.length>0){
     $(".active-list").css("display","block")
     self.getActiveList = res.data.splice(0,9); 
   }else{
    self.getActiveList = []; 
  }   
})       
},
getFeedbackName:function(){
 $(".save-product-btn").prop("disabled",true);
 var self= this ;
 var value = $("#feedback-name").val();
 var iwId =  self.iwId;       
 $.ajax({
  url:domainCrm+"/cms/iwIclusters/home/feedbackInfo.cf",
  type:"POST",
  data:{iwId:iwId,feedbackName:value}
})
 .done(function(res){

  if(res.data&&res.data.length>0){
    $(".feedback-list").css("display","block");
    self.getFeedbackList = res.data.splice(0,9); 
  }else{
    self.getFeedbackList = []; 
  }   
})      
},
getCategory:function(){
  this.visibility  = 'category';
  this.getCate();
},
getCate:function(){
  var self = this;
  var params = {iwId:self.iwId};
  $.ajax({
    url:domain+'/market/getCate',
    type:'Get',
    dataType:'JSON',
    data:params
  })
  .done(function(res){
    if (res.status == "1" ) {
      self.cates = res.data;
    }
  })
},
addCate:function(a,idx){
  var self = this;
  this.showCate = true;
  this.cateFlag = "cate";
  if (a) {
    this.currentidx = idx;
    $.extend(this.cate,a);
  };
  if (!a) {
   this.cate.name = null;
   this.cate.sortId = null;
   this.cate.iwId = self.iwId;
 }
 this.getCateName();
},
cateCheck:function(name,id){
 $(".save-product-btn").prop("disabled",false);
 $(".dropdown-menu").css("display","none");
 this.cate.name = name;
 this.cate.id = id;
},
cateChildCheck:function(name){
 $(".save-product-btn").prop("disabled",false);
 $(".dropdown-menu").css("display","none");
 this.cateChild.name = name;
},
addChildCate:function(a,idx,_parent){
  var self = this;
  self.showCateChild = true;
  self.cateFlag = "cateChild";
  self.cate = $.extend({},_parent);
  if (a) {
    self.childcurrentidx = idx;
    $.extend(self.cateChild,a);
  };
  if (!a) {
    self.isNew = true;
    cateChild.parentId = self.cate._id;
    self.cateChild = $.extend({},cateChild);
  }
},
delChildCate:function(a,index,_parent){
  var self = this;
  if (confirm('确定要删除吗？')) {
    self.cate = $.extend({},_parent);
    self.cate.menuChilds.splice(index,1);
    var params = JSON.stringify(this.cate);
    $.ajax({
      url:domain+'/market/saveCate',
      type:'POST',
      dataType:'json',
      data:{data:params}
    })
    .done(function(res){
      if (1 == res.status) {
        self.getCate();
        self.showCateChild = false;
      }else{
        alert('系统出错，请刷新后重试！');
      }
    })
  }
},
delCate:function(ids,index){
  var self = this;
  if (confirm('确定要删除吗？')) {
    if (ids) {
      $.ajax({
        url:domain + '/market/delCate/' + ids,
        type:'DELETE',
      })
      .done(function(res){
        if (1 == res.status) {
          self.getCate();
        }
      })
    }
  }
},
saveCate:function(){
  var self = this;
  this.cate.iwId = self.iwId;
  var params = JSON.stringify(this.cate);
  $.ajax({
    url:domain+'/market/saveCate',
    type:'POST',
    dataType:'json',
    data:{data:params}
  })
  .done(function(res){
    if (1 == res.status) {
      if (JSON.parse(params)._id) {
        self.cates.$set(self.currentidx,JSON.parse(params));
      }else{
        self.getCate();
      }
      self.showCate = false;
    }
  });
},
saveCateChild:function(){
  var self = this;
  var _setObj = JSON.parse(JSON.stringify(self.cateChild));
  if (self.isNew) {
    self.cate.menuChilds.push(_setObj);
    self.isNew = false;
  }else{
    self.cate.menuChilds.splice(self.childcurrentidx,1,_setObj);
  };
  var params = JSON.stringify(this.cate);
  $.ajax({
    url:domain+'/market/saveCate',
    type:'POST',
    dataType:'json',
    data:{data:params}
  })
  .done(function(res){
    if (1 == res.status) {
      self.showCateChild = false;
      self.getCate();
    }else{
      alert('系统出错，请刷新后重试！');
    }
  })
},
productCheck:function(item){
  $(".save-product-btn").prop("disabled",false);
  this.product.name = item.name;
  this.product.marketPrice = item.marketPrice;
  this.product.productId = item.id;
  this.product.type = item.type;
  $(".product-list").css("display","none")
},
saveProduct:function(){
  var self = this
  var iwId = self.iwId;
  var shopId = this.shopId;
  this.product.iwId = iwId;
  this.product.shopId = shopId;
  if (!this.product.sortId || this.product.sortId <1) {
    this.product.sortId = 1;
  }
  var params =JSON.parse(JSON.stringify(this.product))
  var url = '';
  if(self.getProductFlag == "recommendCommodity"){
    url = "/market/saveRecommendProduct"   
  }else if(self.getProductFlag=="bestProduct"){
   url = "/market/saveBestProduct"
 }else if(self.getProductFlag=="hotProduct"){
  url = "/market/saveHotProduct"
}
$.ajax({
  url:domain + url,
  type:'post',
  data:params
})
.done(function(res){
  if(res.status == 1){
    self.recommendProductFlag =false;
    self.product.name = '';
    self.product.img = '';
    self.product.sortId = '';
    if(self.getProductFlag == "recommendCommodity"){
      $.ajax({
        url: domain+"/market/getRecommendProduct",
        type:"GET",
        data:{iwId:iwId,shopId:shopId}
      })
      .done(function(res){
        self.recommendProductList = res.data;
      })
    }else if(self.getProductFlag=="bestProduct"){
      $.ajax({
       url: domain+"/market/getBestProduct",
       type:"GET",
       data:{iwId:iwId,shopId:shopId}
     })
      .done(function(res){
        self.bestProductList = res.data;
      })
    }else if(self.getProductFlag=="hotProduct"){
      $.ajax({
       url: domain+"/market/getHotProduct",
       type:"GET",
       data:{iwId:iwId,shopId:shopId}
     })
      .done(function(res){
        self.hotProductList = res.data;
      })
    }
  }
})
},
getIndex:function(){
  this.visibility='marketIndex';
  this.getIndexBanner();
},
getIndexBanner:function(){
  var self = this;
  this.bannerPage.iwId = self.iwId;
  this.vMarketIndex = 'banner';
  var params = JSON.parse(JSON.stringify(this.bannerPage));
  $.ajax({
    url:domain + '/market/bannerList',
    type:'get',
    data:this.bannerPage
  })
  .done(function(res){
    self.bannerPage.total = res.count;
    self.indexBannerList = res.data
  })
},
addBanner:function(){
 this.indexBanner =true;
 this.indexBannerMsg.name = '';
 this.indexBannerMsg.place = '';
 this.indexBannerMsg.img = '';
 this.indexBannerMsg.link = '';
},
saveIndexBanner:function(id){
  var self = this ;
  this.indexBanner =false;
  this.indexBannerMsg.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.indexBannerMsg))
  $.ajax({
    url:domain + '/market/banner',
    type:'POST',
    dataType:'JSON',
    data:params
  })
  .done(function(res){
    self.getIndexBanner();
  })
},
editIndexBanner:function(id){
  var self = this ;
  $.ajax({
    url:domain + '/market/getOneBanner',
    type:'GET',
    dataType:'JSON',
    data:{_id:id}
  })
  .done(function(res){
    self.indexBanner =true;
    self.indexBannerMsg = res.data;
  })
},
delIndexBanner:function(id){
  var self = this;
  if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delOneBanner',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    if(res.status == 1){
      self.getIndexBanner();
    }
  })
 }
},
bannerPagerCallback:function(page){
  this.bannerPage.current = page;
  this.getIndexBanner();
},
getRecommend:function(){
  var self = this;
  this.vMarketIndex = 'recommendations';
  this.recommendPage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.recommendPage))
  $.ajax({
    url:domain + "/market/getRecommendation",
    type:"GET",
    data:params
  })
  .done(function(res){
    self.recommendPage.total = res.count;
    self.recommendationsList = res.data;
  })
},
recommendPagerCallback:function(page){
  this.recommendPage.current = page;
  this.getRecommend();
},
addRecommend:function(){
  this.indexRecommend = true;
  this.getShopFlag = 1
  $(".save-btn").prop("disabled",true);
  this.getShop();
},
recommendSopCheck:function(name,id){
 $(".save-btn").prop("disabled",false);
 this.recommendationMsg.shop = name;
 this.recommendationMsg.shopId = id
 $(".dropdown-menu").css("display","none")
},
saveRecommendation:function(){
  var self = this;
  if (!this.recommendationMsg.sortId || this.recommendationMsg.sortId <1) {
    this.recommendationMsg.sortId = 1;
  };
  this.recommendationMsg.iwId = this.iwId;
  var params = JSON.parse(JSON.stringify(this.recommendationMsg))
  var self =this   
  $.ajax({
    url:domain + '/market/saveRecommendation',
    type:'post',
    data:params
  }).done(function(res){
    if(res.status == 1){
     self.indexRecommend =false;
     self.recommendationMsg.shop = '';
     self.recommendationMsg.img = '';
     self.recommendationMsg.sortId = '';
     self.getRecommend();
   }
 })
},
editRecommend:function(id){
  var self = this ;
  this.getShopFlag = 1;
  self.indexRecommend = true;
  $.ajax({
    url:domain + '/market/getOneRecommendation',
    type:'GET',
    data:{_id:id}
  })
  .done(function(res){  
    self.indexRecommend = true;
    self.recommendationMsg = res.data;
  })
},
delRecommend:function(id){
  var self = this;
  if (confirm('确定该产品删除？')) {
   $.ajax({
    url:domain + '/market/delOneRecommendation',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    if(res.status == 1){
     self.getRecommend();
   }
 })
 }
},
recommendCommodity:function(id){
  this.getProductFlag = "recommendCommodity";
  var self = this
  this.recommendFlag =true;
  this.shopId = id;
  var iwId = self.iwId;
  var shopId = id;
  $.ajax({
    url: domain+"/market/getRecommendProduct",
    type:"GET",
    data:{iwId:iwId,shopId:shopId}
  })
  .done(function(res){
    self.recommendProductList = res.data;
  })
},
editCommodity:function(id){
  var self =this ;
  this.recommendProductFlag =true ;
  $.ajax({
    url:domain + '/market/getOneRecommendProduct',
    type:'GET',
    data:{_id:id}
  })
  .done(function(res){
    self.product = res.data;
  })
},
delCommodity:function(id){
  var self = this;
  var iwId = self.iwId;
  var shopId = this.shopId;
  if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delRecommendProduct',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    if(res.status == 1){
      $.ajax({
        url: domain+"/market/getRecommendProduct",
        type:"GET",
        data:{iwId:iwId,shopId:shopId}
      })
      .done(function(res){
        self.recommendProductList = res.data;
      })
    }
  })
 }
},
addNewCommodity:function(){
 $(".dropdown-menu").css("display","block");
 this.recommendProductFlag =true ;
 this.getProduct();
},
getHot:function(){
  var self = this;
  this.vMarketIndex = 'hotProduct';
  this.hotPage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.hotPage))
  $.ajax({
    url:domain + "/market/getHot",
    type:"GET",
    data:params
  })
  .done(function(res){
    self.hotPage.total = res.count;
    self.hotList = res.data;
  })
},  
hotPagerCallback:function(page){
  this.hotPag.current = page;
  this.getHot();
},
addHot:function(){
 this.indexHot = true;
 this.getShopFlag = 2
 $(".save-btn").prop("disabled",true);
 this.getShop();
},
hotShopCheck:function(item){
  console.log(item)
  $(".save-btn").prop("disabled",false);
  this.hotMsg.shop = item.nameEn;
  this.hotMsg.shopId = item.id;
  this.hotMsg.logo = item.companyLogo;
  $(".dropdown-menu").css("display","none");
},
saveHot:function(){
  if (!this.hotMsg.sortId || this.hotMsg.sortId <1) {
    this.hotMsg.sortId = 1;
  };
  this.hotMsg.iwId = this.iwId;
  var params = JSON.parse(JSON.stringify(this.hotMsg))
  var self =this   
  $.ajax({
    url:domain + '/market/saveHot',
    type:'post',
    data:params
  })
  .done(function(res){
    if(res.status == 1){
      self.indexHot = false;
      self.hotMsg.shop = '';
      self.hotMsg.sortId = '';
      self.getHot();
    }
  })
},
editHot:function(id){
 var self = this ;
 this.getShopFlag = 1;
 $.ajax({
  url:domain + '/market/editHot',
  type:'GET',
  data:{_id:id}
})
 .done(function(res){
  self.indexHot = true;
  self.hotMsg = res.data;
})
},
delHot:function(id){
  var self = this;
  if (confirm('确定删除该产品？')) {
   $.ajax({
    url:domain + '/market/delHot',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
     self.getHot();
   })
 }
},  
hotCommodity:function(id){
  var self = this;
  this.hotFlag =true;
  this.getProductFlag = "hotProduct";
  this.shopId = id;
  var iwId = self.iwId;
  var shopId = id;
  $.ajax({
    url: domain+"/market/getHotProduct",
    type:"GET",
    data:{iwId:iwId,shopId:shopId}
  })
  .done(function(res){
    self.hotProductList = res.data;
  })
},
editHotProduct:function(id){
  var self =this ;
  this.recommendProductFlag =true ;
  $.ajax({
    url:domain + '/market/editHotProduct',
    type:'GET',
    data:{_id:id}
  })
  .done(function(res){
    self.product = res.data;
  })
},
delHotProduct:function(id){
 var self = this;
 var iwId = self.iwId;
 var shopId = this.shopId;
 if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delHotProduct',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    $.ajax({
      url: domain+"/market/getHotProduct",
      type:"GET",
      data:{iwId:iwId,shopId:shopId}
    })
    .done(function(res){
      self.hotProductList = res.data;
    })
  })
 }
},
addHotProduct:function(){

 this.recommendProductFlag =true ;
 this.getProduct();
},
addSeller:function(){
 this.indexSeller = true;
 this.getShopFlag = 3
 this.getShop();
},
getSeller:function(){
  var self = this;
  this.vMarketIndex = 'bestSeller';
  this.bestPage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.bestPage))
  $.ajax({
    url:domain + "/market/getBestSeller",
    type:"GET",
    data:params
  })
  .done(function(res){
   self.bestPage.total = res.count;
   self.bestList = res.data;
 })
},
bestPagerCallback:function(page){
  this.bestPage.current = page;
  this.getSeller();
},
saveSeller:function(){
  var self =this;
  if(!this.bestMsg.sortId || this.bestMsg.sortId <1){
    this.bestMsg.sortId = 1;
  };
  this.bestMsg.iwId = this.iwId;
  var params = JSON.parse(JSON.stringify(this.bestMsg));
  $.ajax({
    url:domain + '/market/saveBestSeller',
    type:'post',
    data:params
  })
  .done(function(res){
    if(res.status == 1){
     self.indexSeller =false;
     self.bestMsg.shop = '';
     self.bestMsg.sortId = '';
     self.getSeller();
   }
 })
},
bestShopCheck:function(item){
  $(".save-btn").prop("disabled",false);
  this.bestMsg.shop = item.nameEn;
  this.bestMsg.shopId = item.id;
  this.bestMsg.companyLogo = item.companyLogo;
  $(".dropdown-menu").css("display","none");
},
editSeller:function(id){
  var self = this ;
  this.indexSeller = true;
  this.getShopFlag = 3;
  $.ajax({
    url:domain + '/market/getOneBestSeller',
    type:'GET',
    data:{_id:id}
  })
  .done(function(res){
    self.indexSeller =true;
    self.bestMsg = res.data;
  })
},
delSeller:function(id){
  var self = this;
  if (confirm('确定该产品删除？')) {
   $.ajax({
    url:domain + '/market/delBestSeller',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    if(res.status == 1){
      self.getSeller();
    }
  })
 }
},
bestManage:function(id,_id){
  var self = this;
  this.getProductFlag = "bestProduct";
  this.shopId = id
  this.sellerFlag =true;
  var iwId = self.iwId;
  var shopId = id;
  $.ajax({
    url: domain+"/market/getBestProduct",
    type:"GET",
    data:{iwId:iwId,shopId:shopId}
  })
  .done(function(res){
    self.bestProductList = res.data;
  })
},
editBestProduct:function(id){
 var self =this ;
 this.recommendProductFlag =true ;
 $.ajax({
  url:domain + '/market/getOneBestProduct',
  type:'GET',
  data:{_id:id}
})
 .done(function(res){
  self.product = res.data;
})
},
delBestProduct:function(id){
 var self = this;
 var iwId = self.iwId;
 var shopId = this.shopId;
 if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delBestProduct',
    type:'POST',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    $.ajax({
     url: domain+"/market/getBestProduct",
     type:"GET",
     data:{iwId:iwId,shopId:shopId}
   })
    .done(function(res){
      console.log(res.data);
      self.bestProductList = res.data;
    })
  })
 }
},
addSellProduct:function(){
 $(".dropdown-menu").css("display","block")
 this.recommendProductFlag =true ;
 this.getProduct();
},
getIndexActive:function(){
  var self = this;
  this.vMarketIndex = 'indexActiveRecommend';
  this.indexActivePage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.indexActivePage))
  $.ajax({
    url:domain + '/market/getIndexActive',
    type:'get',
    data:this.indexActivePage
  })
  .done(function(res){
    self.indexActivePage.total = res.count;
    self.indexActiveList = res.data;
  })
},

addIndexActive:function(){
  this.indexActiveFlag = true;
  this.activeName ="indexActive";
  this.indexActive.name = '';
  this.indexActive.sortId = '';
  this.indexActive.img = '';
  this.getActiveName();
},
editIndexActive:function(id){
  var self =this ;
  this.indexActiveFlag = true;
  this.activeName ="indexActive";
  $.ajax({
    url:domain + '/market/editIndexActive',
    type:'GET',
    dataType:'JSON',
    data:{_id:id}
  })
  .done(function(res){
    self.indexActive = res.data;
  })
},
saveIndexActive:function(id){
 if(!this.indexActive.sortId || this.indexActive.sortId <1){
  this.indexActive.sortId = 1;
}
var self = this ;
this.indexActiveFlag = false;
this.indexActive.iwId = self.iwId;
var params = JSON.parse(JSON.stringify(this.indexActive))
$.ajax({
  url:domain + '/market/addIndexActive',
  type:'POST',
  dataType:'JSON',
  data:params
})
.done(function(res){
  self.getIndexActive();
})
},
delIndexActive:function(id){
  var self = this;
  if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delIndexActive',
    type:'post',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    self.getIndexActive();
  })
 }
},
indexActiveCheck:function(item){
  $(".save-product-btn").prop("disabled",false);
  this.indexActive.name = item.name;
  this.indexActive.status = item.activitiesStatus;
  this.indexActive.pageViews = item.pageViews;
  this.indexActive.activitiesNumber = item.activitiesNumber;
  this.indexActive.minActivitiesNumber = item.minActivitiesNumber;
  this.indexActive.maxActivitiesNumber = item.maxActivitiesNumber;
  this.indexActive.totalVisitNumber = item.totalVisitNumber;
  this.indexActive.title = item.name;
  this.indexActive.deadlineTime = item.deadlineTime;
  this.indexActive.createdTime = item.createdTime;
  this.indexActive.pageViews = item.pageViews;
  this.indexActive.statrTime = item.statrTime;
  this.indexActive.endTime = item.endTime;
  this.indexActive.details = item.details;
  this.indexActive.id = item.id;
  this.indexActive.iwId = item.iwId;
  $(".dropdown-menu").css("display","none")
},
indexActivePager:function(page){
  this.indexActivePage.current = page;
  this.getIndexActive();
},
getFeedback:function(){
  this.vMarketIndex = 'comment';
  var self = this;
  this.feedBackPage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.feedBackPage))
  $.ajax({
    url:domain + '/market/getFeedback',
    type:'get',
    data:this.feedBackPage
  })
  .done(function(res){
    self.feedBackPage.total = res.count;
    self.feedbackList = res.data
  })
},
addFeedback:function(){
  this.feedback =true;
  this.feedbackMsg.name = '';
  this.feedbackMsg.sortId = '';
  this.feedbackMsg.img = '';
  this.getFeedbackName();
},
editFeedback:function(id){
  this.feedback =true;
  var self =this ;
  $.ajax({
    url:domain + '/market/editFeedback',
    type:'GET',
    dataType:'JSON',
    data:{_id:id}
  })
  .done(function(res){
    self.feedbackMsg = res.data;
  })
},
feedbackCheck:function(item){
  $(".save-product-btn").prop("disabled",false);
  this.feedbackMsg.content = item.content;
  this.feedbackMsg.createdTime = item.createdTime;
  this.feedbackMsg.feedbackNumber = item.feedbackNumber;
  this.feedbackMsg.iwId = item.iwId;
  this.feedbackMsg.id = item.id;
  this.feedbackMsg.name = item.name;
  this.feedbackMsg.sumScore = item.sumScore;
  this.feedbackMsg.title = item.title;
  this.feedbackMsg.imgs = item.imgs;
  this.feedbackMsg.photo = item.photo;
  console.log(this.feedbackMsg.title);
  $(".dropdown-menu").css("display","none");
},
saveFeedback:function(id){
  if(!this.feedbackMsg.sortId || this.feedbackMsg.sortId <1){
    this.feedbackMsg.sortId = 1;
  }
  var self = this ;
  this.feedback = false;
  this.feedbackMsg.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.feedbackMsg))
  $.ajax({
    url:domain + '/market/addFeedback',
    type:'POST',
    dataType:'JSON',
    data:params
  })
  .done(function(res){
    self.getFeedback();
  })
},
delFeedback:function(id){
  var self = this;
  if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delFeedback',
    type:'post',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
     self.getFeedback();
   })
 }
},
feedBackPager:function(page){
 this.feedBackPage.current = page;
 this.getFeedback();
},
getActivePage:function(){
  this.visibility='activity';
  this.getActiveBanner();
},
getActiveBanner:function(){
  var self = this;
  this.activeBannerPage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.activeBannerPage))
  this.vActive = 'banner';
  $.ajax({
    url:domain + '/market/getActiveBanner',
    type:'get',
    data:this.activeBannerPage
  })
  .done(function(res){
    self.activeBannerPage.total = res.count;
    self.activeBannerList = res.data
  })
},
activeBannerPager:function(page){
  this.activeBannerPage.current = page;
  this.getActiveBanner();
},
addActiveBanner:function(){
  this.activeBanner =true;
  this.activeBannerMsg.name = '';
  this.activeBannerMsg.place = '';
  this.activeBannerMsg.img = '';
  this.activeBannerMsg.link = '';

},
saveActiveBanner:function(id){
  var self = this ;
  this.activeBanner =false;
  this.activeBannerMsg.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.activeBannerMsg))
  $.ajax({
    url:domain + '/market/addActiveBanner',
    type:'POST',
    dataType:'JSON',
    data:params
  })
  .done(function(res){
    self.getActiveBanner();
  })
},
editActiveBanner:function(id){
  var self = this ;
  $.ajax({
    url:domain + '/market/editActiveBanner',
    type:'GET',
    dataType:'JSON',
    data:{_id:id}
  })
  .done(function(res){
    self.activeBanner = true;
    self.activeBannerMsg = res.data;
  })
},
delActiveBanner:function(id){
  var self = this;
  if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delActiveBanner',
    type:'post',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    self.getActiveBanner();
  })
 }
},
getActive:function(){
  this.vActive='active';
  var self = this;;
  this.activePage.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.activePage))
  $.ajax({
    url:domain + '/market/getActive',
    type:'get',
    data:this.activePage
  })
  .done(function(res){
    self.activePage.total = res.count;
    self.activeList = res.data
  })
},
delActive:function(id){
 var self = this;
 if (confirm('确定删除？')) {
   $.ajax({
    url:domain + '/market/delActive',
    type:'post',
    dataType:'JSON',
    data:{_id:id}
  })
   .done(function(res){
    self.getActive();
  })
 }
},
addActive:function(){
  this.activeFlag = true;
  this.activeName ="active",
  this.activeMsg.name = '';
  this.activeMsg.sortId = '';
  this.getActiveName();
},
activeCheck:function(item){
 $(".save-product-btn").prop("disabled",false);
 this.activeMsg.name = item.name;
 this.activeMsg.status = item.activitiesStatus;
 this.activeMsg.pageViews = item.pageViews;
 this.activeMsg.canRegister = item.canRegister;
 this.activeMsg.totalVisitNumber = item.totalVisitNumber;
 this.activeMsg.activitiesNumber = item.activitiesNumber;
 this.activeMsg.maxActivitiesNumber = item.maxActivitiesNumber;
 this.activeMsg.minActivitiesNumber = item.minActivitiesNumber;
 this.activeMsg.pageViews = item.pageViews;
 this.activeMsg.minActivitiesNumber = item.minActivitiesNumber;
 this.activeMsg.deadlineTime = item.deadlineTime;
 this.activeMsg.createdTime = item.createdTime;
 this.activeMsg.statrTime = item.statrTime;
 this.activeMsg.endTime = item.endTime;
 this.activeMsg.details = item.details;
 this.activeMsg.id = item.id;
 this.activeMsg.img = item.image;
 this.activeMsg.iwId = item.iwId;
 $(".dropdown-menu").css("display","none");
},
activePager:function(page){
  this.activePage.current = page;
  this.getActive();
},
editActive:function(id){
 var self = this ;
 this.activeName ="active"
 $.ajax({
  url:domain + '/market/editActive',
  type:'GET',
  dataType:'JSON',
  data:{_id:id}
})
 .done(function(res){
  self.activeFlag = true;
  self.activeMsg = res.data;
})
},
saveActive:function(id){
  if(!this.activeMsg.sortId || this.activeMsg.sortId <1){
    this.activeMsg.sortId = 1;
  }
  var self = this ;
  this.activeFlag = false;
  this.activeMsg.iwId = self.iwId;
  var params = JSON.parse(JSON.stringify(this.activeMsg))
  $.ajax({
    url:domain + '/market/addActive',
    type:'POST',
    dataType:'JSON',
    data:params
  })
  .done(function(res){
    self.getActive();
  })
},
  // 所有活动
  getAAct:function(){
    var self = this,
    iwId = self.iwId;
    self.visibility='AAct';
    self.getAActList();
  },
  synAActList:function(){
    var self = this;
    $.ajax({
      url:domain + '/market/synAllActivitys/' + self.iwId,
      type:'post',
      dataType:'json',
      data:null
    })
    .done(function(res){
      if (res.code == 0) {
        alert('共'+ res.data.count + '个活动，' + '同步了' + res.data.updateCount + '个活动，' + '新添加' + res.data.addCount +'个活动。');
        self.getAActList();
      };
    })
  },
  getAActList:function(){
    var self = this;
    $.ajax({
      url:domain + '/market/getAllActivitys/' + self.iwId,
      type:'get',
      dataType:'json',
      data:null
    })
    .done(function(res){
      if (res.code == 0) {
        self.remoteAActList = res.data;
      };
    })
  },
  editAActs:function(a,index){
    var self = this;
    self.showAAct = true;
    self.remoteAAct = $.extend({},self.remoteAAct,a);
  },
  saveAAct:function(){
    var self = this,
    params = JSON.parse(JSON.stringify(self.remoteAAct));
    $.ajax({
      url:domain + '/market/saveAAct',
      type:'post',
      dataType:'json',
      data:params
    })
    .done(function(res){
      if (res.code == 0) {
        self.showAAct = false;
        self.remoteAAct = $.extend(true,{},remoteAAct);
        self.getAActList();
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
  [v-cloak] {
    display: none;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .model-img{width: 50px !important;height: 50px !important}
  .img-msg{position: absolute;left: 35%}
  .dropdown-menu{display: block;left:auto;}
</style>