<template>
  <side-menu></side-menu>
  <div class="content-wrapper">
      <div class="content-header">
        <h1 v-text="queryObj.name"></h1>
        <ol class="breadcrumb">
          <li><a href="/"><i class="fa fa-dashboard" target="_blank"></i> 首页</a></li>
          <li><a v-link="{ path: '/industrial' }" target="_blank">专业镇</a></li>
          <!-- <li class="active">{{ info.name }}</li> -->
        </ol>
      </div>
      <div class="content">
     
        <div class="mb10">
          <a class="btn btn-danger" href="/industrial/{{iwId}}.html" target="_blank" v-if="visibility!='industrialIdx'&&visibility!='activity'">预览</a>
          <a class="btn btn-danger" href="/industrial/{{iwId}}/activity.html" target="_blank" v-if="visibility == 'activity'">预览</a>
          <a class="btn btn-danger" href="/industrial.html" target="_blank" v-if="visibility == 'industrialIdx'">预览</a>
        </div>
        <div>
            <div class="nav-tabs-custom theme-panel mb10">
              <ul class="nav nav-tabs nav-justified">
                <li :class="{active: visibility == 'industrialIdx'}" @click="cutNav('industrialIdx')">
                  <a href="javascript:;">
                    大首页推荐
                  </a>
                </li>
                <li :class="{active: visibility == 'category'}" @click="cutNav('category')">
                  <a href="javascript:;">
                    类目
                  </a>
                </li>
                <li :class="{active: visibility == 'specificIdx'}" @click="cutNav('specificIdx')">
                  <a href="javascript:;">
                    产业集群首页
                  </a>
                </li>
                <li :class="{active: visibility == 'top100'}" @click="cutNav('top100')">
                  <a href="javascript:;">
                    品牌100强
                  </a>
                </li>
                <li :class="{active: visibility == 'activity'}" @click="cutNav('activity')">
                  <a href="javascript:;">
                    活动页面
                  </a>
                </li>
                <li :class="{active: visibility == 'allActivity'}" @click="cutNav('allActivity')">
                  <a href="javascript:;">
                    关联活动
                  </a>
                </li>
              </ul>
            </div>
            
            <div class="panel panel-body panel-info ">
              <!-- 大首页推荐 -->
                <div class="row col-sm-12" v-show="visibility == 'industrialIdx'">
                  <div class="col-sm-12">
                    <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addIndexAct(null,null)">添加活动</button> 
                      <!-- <span>备注：至少添加四个活动</span> -->
                    </div>
                    <table class="table panel-body table-hover">
                      <thead>
                        <tr class="">
                          <th class="col-md-4 bt-center">活动</th>
                          <th class="col-md-3 bt-center">活动名</th>
                          <th class="col-md-2 bt-center">优先级</th>
                          <th class="col-md-3 bt-center">管理</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in IndexActs">
                          <td class="bt-center"><img :src="item.img | resize" width="150" height="80"></td>
                          <td class="bt-center" v-text="item.name"></td>
                          <td class="bt-center" v-text="item.sortId"></td>
                          <td class="bt-center">
                            <button class="btn btn-primary btn-sm" @click="addIndexAct(item,$index)">编辑</button>
                            <button class="btn btn-default btn-sm" @click="deleteIndexAct(item._id)">删除</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!-- <div class="col-sm-4">
                    <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addIndexWholesale(null,null)">添加批发中心</button> 
                      <span>备注：至少添加三个批发中心</span>
                    </div>
                    
                    <table class="table panel-body table-hover">
                      <thead>
                        <tr>
                          <th class="col-md-4 bt-center">批发中心</th>
                          <th class="col-md-3 bt-center">名称</th>
                          <th class="col-md-2 bt-center">优先级</th>
                          <th class="col-md-3 bt-center">管理</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr  v-for="item in IndexWholesales">
                          <td class="bt-center"><img :src="item.img | resize" width="150" height="80"></td>
                          <td class="bt-center" v-text="item.nameEn"></td>
                          <td class="bt-center" v-text="item.sortId"></td>
                          <td class="bt-center">
                            <button class="btn btn-primary btn-sm" @click="addIndexWholesale(item,$index)">编辑</button>
                            <button class="btn btn-default btn-sm" @click="deleteIndexWholesale(item._id)">删除</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> -->
                  <!-- <div class="col-sm-4">
                    <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addIndexFB(null,null)">添加反馈</button>  
                    </div>
                    
                    <table class="table panel-body table-hover">
                      <thead>
                        <tr>
                          <th class="col-md-4 bt-center">反馈</th>
                          <th class="col-md-3 bt-center">反馈标题</th>
                          <th class="col-md-2 bt-center">优先级</th>
                          <th class="col-md-3 bt-center">管理</th>
                        </tr>
                      <tbody>
                        <tr v-for="item in IndexFBs">
                          <td class="bt-center"><img :src="item.img | resize" width="150" height="80"></td>
                          <td class="bt-center" v-text="item.title"></td>
                          <td class="bt-center" v-text="item.sortId"></td>
                          <td class="bt-center">
                            <button class="btn btn-primary btn-sm" @click="addIndexFB(item,$index)">编辑</button>
                            <button class="btn btn-default btn-sm" @click="deleteIndexFB(item._id)">删除</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> -->
                </div>
                <!-- 类目 -->
                <div class="row col-sm-12" v-show="visibility == 'category'">
                  <div class="panel-heading">
                    <button type="button" class="btn btn-primary btn-sm" @click="addTownCate(null,null)">添加类目</button> 
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
                      <tr v-for="item in townCates">
                        <td class="bt-center" v-text="item.name"></td>
                        <!-- <td>
                          <div class="list-group">
                            <a href="javascript:;" class="list-group-item" v-for="a in item.menuChilds">
                              <span class="col-sm-9" v-text="a.name"></span>
                              <button class="btn btn-primary btn-sm" @click="addTownChildCate(a,$index,item)">编辑</button>
                              <button class="btn btn-default btn-sm" @click="delTownChildCate(a,$index,item)">删除</button>
                            </a>
                          </div>
                        </td> -->
                        <td class="bt-center">
                          <!-- <button class="btn btn-primary btn-sm" @click="addTownChildCate(null,$index,item)">添加子类目</button> -->
                          <button class="btn btn-primary btn-sm" @click="addTownCate(item,$index)">编辑</button>
                          <button class="btn btn-default btn-sm" @click="delTownCate(item._id,$index)">删除</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              <!-- 具体首页 -->
              <div class="row"  v-show="visibility == 'specificIdx'">
                <ul class="nav nav-pills nav-justified col-sm-12" role="tablist">
                  <li role="presentation" :class="{active:vSpecificIdex == 'banner'}" @click="vSpecificIdex = 'banner'"><a href="javascript:;">banner</a></li>
                  <li role="presentation" :class="{active:vSpecificIdex == 'recommend'}" @click="vSpecificIdex = 'recommend'"><a href="javascript:;">推荐</a></li>
                </ul>
                <!-- banner -->
                <div class="col-sm-12" v-show="vSpecificIdex == 'banner'">
                  <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addTownBanner(null,null)">添加banner</button> 
                    </div>
                    <table class="table table-bordered table-hover panel-body">
                      <thead>
                        <tr>
                          <th class="col-md-1 bt-center">序号</th>
                          <th class="col-md-4 bt-center">图片</th>
                          <th class="col-md-3 bt-center">名称</th>
                          <th class="col-md-1 bt-center">优先级</th>
                          <th class="col-md-1 bt-center">显示位置</th>
                          <th class="col-md-2 bt-center">管理</th>
                        </tr>
                        <tbody>
                          <tr v-for="item in townActBNs">
                            <td class="bt-center" v-text="$index+1">1</td>
                            <td class="bt-center"><img :src="item.img | resize"></td>
                            <td class="bt-center" v-text="item.name"></td>
                            <td class="bt-center" v-text="item.sortId"></td>
                            <td class="bt-center" v-if="item.place==1" v-text="'banner图'"></td>
                            <td class="bt-center" v-if="item.place==2" v-text="'产业集群入驻宣传图'"></td>
                            <td class="bt-center">
                              <button class="btn btn-primary btn-sm" @click="addTownBanner(item,$index)">编辑</button>
                              <button class="btn btn-default btn-sm" @click="delTownBanner(item._id)">删除</button>
                            </td>
                          </tr>
                        </tbody>
                      </thead>
                    </table>
                </div>
                <!-- 推荐 -->
                <div class="col-sm-12" v-show="vSpecificIdex == 'recommend'">
                  <div class="col-sm-6">
                      <div class="panel-heading">
                        <button type="button" class="btn btn-primary btn-sm" @click="addTownAct(null,null)">添加活动</button>  
                      </div>
                      <table class="table panel-body table-hover">
                        <thead>
                          <tr class="">
                            <th class="col-md-4 bt-center">活动</th>
                            <th class="col-md-3 bt-center">活动名</th>
                            <th class="col-md-2 bt-center">优先级</th>
                            <th class="col-md-3 bt-center">管理</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in townActs">
                            <td class="bt-center"><img :src="item.img | resize"></td>
                            <td class="bt-center" v-text="item.name"></td>
                            <td class="bt-center" v-text="item.sortId"></td>
                            <td class="bt-center">
                              <button class="btn btn-primary btn-sm" @click="addTownAct(item,$index)">编辑</button>
                              <button class="btn btn-default btn-sm" @click="delTownAct(item._id)">删除</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="col-sm-6">
                      <div class="panel-heading">
                        <button type="button" class="btn btn-primary btn-sm" @click="addTownFB(null,null)">添加反馈</button> 
                      </div>
                      <table class="table panel-body table-hover">
                        <thead>
                          <tr class="">
                            <th class="col-md-4 bt-center">反馈</th>
                            <th class="col-md-3 bt-center">反馈标题</th>
                            <th class="col-md-2 bt-center">优先级</th>
                            <th class="col-md-3 bt-center">管理</th>
                          </tr>
                        <tbody>
                          <tr v-for="item in townFBs">
                            <td class="bt-center"><img :src="item.img | resize"></td>
                            <td class="bt-center" v-text="item.title"></td>
                            <td class="bt-center" v-text="item.sortId"></td>
                            <td class="bt-center">
                              <button class="btn btn-primary btn-sm" @click="addTownFB(item,$index)">编辑</button>
                              <button class="btn btn-default btn-sm" @click="delTownFB(item._id)">删除</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
              </div>
              <!-- 品牌100强 -->
              <div class="col-sm-12" v-show="visibility == 'top100'">
                <div class="panel-heading">
                    <button type="button" class="btn btn-primary btn-sm" @click="addTop100(null,null)">添加品牌</button>
                    <button type="button" class="btn btn-default btn-sm" @click="deleteObjMinOrderTops">批量删除</button>    
                  </div>
                  <table class="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th class="col-md-1 bt-center">
                          <span>序号</span>&nbsp;
                          <input type="checkbox" v-model="delAllTops" name="allchecked" id="allchecked">
                        </th>
                        <th class="col-md-4 bt-center">图片LOGO</th>
                        <th class="col-md-3 bt-center">店铺名称</th>
                        <th class="col-md-1 bt-center">优先级</th>
                        <th class="col-md-3 bt-center">管理</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in top100s">
                        <td class="bt-center">
                          <span v-text="$index+1"></span>&nbsp;
                          <input type="checkbox" name="singlechecked" id="singlechecked" v-model="item.checked">
                        </td>
                        <td class="bt-center"><img :src="item.logo | resize" width="150" height="100"></td>
                        <td class="bt-center" v-text="item.name"></td>
                        <td class="bt-center" v-text="item.sortId"></td>
                        <td class="bt-center">
                          <button type="button" class="btn btn-primary btn-sm" @click="addTop100(item,$index)">编辑</button>
                          <button type="button" class="btn btn-default btn-sm" @click="deleteTops(item._id,$index)">删除</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="col-md-12 text-right">
                      <pages :total.sync="topPage.total" :current="topPage.current" :per-page="topPage.perPage" :page-changed="topPageCallback"></pages>
                    </div>
              </div>

              <!-- 活动页面 -->
              <div class="row" v-show="visibility == 'activity'">
                <ul class="nav nav-pills nav-justified" role="tablist">
                  <li role="presentation" :class="{active:visibilityActivity == 'banner'}" @click="visibilityActivity = 'banner'"><a href="javascript:;">活动页面banner</a></li>
                  <li role="presentation" :class="{active:visibilityActivity == 'recommend'}" @click="visibilityActivity = 'recommend'"><a href="javascript:;">活动页面推荐</a></li>
                </ul>
                <!-- 活动页面的banner -->
                <div class="col-sm-12" v-show="visibilityActivity == 'banner'">
                  <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addActivityBanner(null,null)">添加banner</button> 
                    </div>
                    <table class="table table-bordered table-hover panel-body">
                      <thead>
                        <tr>
                          <th class="col-md-1 bt-center">序号</th>
                          <th class="col-md-4 bt-center">图片</th>
                          <th class="col-md-3 bt-center">名称</th>
                          <th class="col-md-1 bt-center">显示位置</th>
                          <th class="col-md-1 bt-center">优先级</th>
                          <th class="col-md-2 bt-center">管理</th>
                        </tr>
                        <tbody>
                          <tr v-for="item in activityBNs">
                            <td class="bt-center" v-text="$index+1"></td>
                            <td class="bt-center"><img :src="item.img | resize"></td>
                            <td class="bt-center" v-text="item.name"></td>
                            <td class="bt-center" v-if="item.place==1" v-text="'banner图'"></td>
                            <td class="bt-center" v-if="item.place==2" v-text="'右上广告图'"></td>
                            <td class="bt-center" v-if="item.place==3" v-text="'右下广告图'"></td>
                            <td class="bt-center" v-text="item.sortId"></td>
                            <td class="bt-center">
                              <button class="btn btn-primary btn-sm" @click="addActivityBanner(item, $index)">编辑</button>
                              <button class="btn btn-default btn-sm" @click="delActivityBanner(item._id)">删除</button>
                            </td>
                          </tr>
                        </tbody>
                      </thead>
                    </table>
                </div>
                <!-- 推荐的活动 -->
                <div class="col-sm-10" v-show="visibilityActivity == 'recommend'">
                    <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addActivityAct(null,null)">添加推荐活动</button>  
                    </div>
                    <table class="table table-bordered table-hover panel-body">
                      <thead>
                        <tr>
                          <th class="col-md-1 bt-center">序号</th>
                          <th class="col-md-4 bt-center">活动名</th>
                          <th class="col-md-2 bt-center">优先级</th>
                          <th class="col-md-3 bt-center">管理</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in activityActs">
                          <td class="bt-center" v-text="$index+1"></td>
                          <td class="bt-center" v-text="item.name"></td>
                          <td class="bt-center" v-text="item.sortId"></td>
                          <td class="bt-center">
                            <button class="btn btn-primary btn-sm" @click="addActivityAct(item,$index)">编辑</button>
                            <button class="btn btn-default btn-sm" @click="delActivityAct(item._id)">删除</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              </div>
              <!-- 所有活动 -->
              <div class="col-sm-12" v-show="visibility == 'allActivity'">
                <div class="panel-heading">
                  <button type="button" class="btn btn-primary btn-sm" @click="synAActList">同步关联活动</button> 
                </div>
                <table class="table table-bordered table-hover panel-body">
                  <thead>
                    <tr>
                      <th class="col-md-1 bt-center">序号</th>
                      <th class="col-md-2 bt-center">封面图片</th>
                      <!-- <th class="col-md-2 bt-center">图片</th> -->
                      <th class="col-md-2 bt-center">名称</th>
                      <th class="col-md-1 bt-center">优先级</th>
                      <th class="col-md-1 bt-center">是否推荐</th>
                      <th class="col-md-2 bt-center">管理</th>
                    </tr>
                    <tbody>
                      <tr v-for="item in remoteAActList">
                        <td class="bt-center" v-text="$index+1"></td>
                        <td class="bt-center"><img :src="item.image | resize"></td>
                        <!-- <td class="bt-center"><img :src="item.cmsImg | resize"></td> -->
                        <td class="bt-center" v-text="item.name"></td>
                        <td class="bt-center" v-text="item.sortId"></td>
                        <td class="bt-center" v-text="(item.isRecommend==1)?'显示':'不显示'"></td>
                        <td class="bt-center">
                          <button class="btn btn-primary btn-sm" @click="editAActs(item, $index)">编辑</button>
                          <!-- <button class="btn btn-default btn-sm" @click="delAActs(item._id)">删除</button> -->
                        </td>
                      </tr>
                    </tbody>
                  </thead>
                </table>
              </div>
              <!-- app -->
                <!-- <div class="col-sm-12" v-show="visibility == 'app'">
                  <div class="panel-heading">
                      <button type="button" class="btn btn-primary btn-sm" @click="addAppRecommon(null,null)">添加app推荐</button> 
                    </div>
                    <table class="table table-bordered table-hover panel-body">
                      <thead>
                        <tr>
                          <th class="col-md-1 bt-center">序号</th>
                          <th class="col-md-4 bt-center">图片</th>
                          <th class="col-md-3 bt-center">名称</th>
                          <th class="col-md-1 bt-center">优先级</th>
                          <th class="col-md-2 bt-center">管理</th>
                        </tr>
                        <tbody>
                          <tr v-for="item in appRecommons">
                            <td class="bt-center" v-text="$index+1"></td>
                            <td class="bt-center"><img :src="item.img | resize"></td>
                            <td class="bt-center" v-text="item.name"></td>
                            <td class="bt-center" v-text="item.sortId"></td>
                            <td class="bt-center">
                              <button class="btn btn-primary btn-sm" @click="addAppRecommon(item, $index)">编辑</button>
                              <button class="btn btn-default btn-sm" @click="delAppRecommon(item._id)">删除</button>
                            </td>
                          </tr>
                        </tbody>
                      </thead>
                    </table>
                </div> -->

            </div>
          </div>
      </div>
    </div>

    <!-- 弹框 -->
    <!-- 大首页活动推荐 -->
    <modal :show.sync="showIndexAct" title="大首页活动推荐">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndexAct">
          <div class="form-group pos-parent">
            <label for="indexActName" class="col-sm-3 control-label">对应的活动</label>
            <div class="col-sm-9 pos-parent" style="position:relative;">
              <input type="text" class="form-control" name="indexActName" id="indexActName" v-model="indexAct.name" autocomplete="off" @keyup="getRemoteIndexAct"/>
              <ul class="col-sm-9 pos-child" v-show="showIndexActList">
              <li class="form-control col-sm-9" v-for="item in remoteIndexActs" v-text="item.name" @click.prevent="chooseIndexAct(item,$index)"></li>
            </ul>
          </div>
          </div>
          <div class="form-group">
            <label for="indexActSortId" class="col-sm-3 control-label">优先级</label>
            <div class="col-sm-9">
              <input type="number" name="indexActSortId" id="indexActSortId" class="form-control" v-model="indexAct.sortId">
            </div>
          </div>
          <div class="form-group">
                <label for="indexActImg" class="col-sm-3 control-label">图片</label>
                <div class="col-sm-9">
                  <upload id="indexActImg" tips="推荐尺寸：266px*170px" text="上传图片" :img.sync="indexAct.img"></upload>
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
    <!-- 大首页批发中心 -->
    <modal :show.sync="showIndexWholesale" title="大首页批发中心">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndexWholesale">
          <div class="form-group pos-parent">
            <label for="indexWSName" class="col-sm-3 control-label">批发中心</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" name="indexWSName" id="indexWSName" v-model="indexWholesale.nameEn" autocomplete="off" @keyup="getRemoteIndexWholesale"/>
              <ul class="col-sm-9 pos-child" v-show="showIndexWSList">
              <li class="form-control col-sm-9" v-for="item in remoteIndexWholesales" v-text="item.nameEn" @click.prevent="chooseIndexWS(item,$index)"></li>
            </ul>
          </div>
          </div>
          <div class="form-group">
            <label for="indexWSSortId" class="col-sm-3 control-label">优先级</label>
            <div class="col-sm-9">
              <input type="number" name="indexWSSortId" id="indexWSSortId" class="form-control" v-model="indexWholesale.sortId">
            </div>
          </div>
          <div class="form-group">
                <label for="indexWSImg" class="col-sm-3 control-label">图片</label>
                <div class="col-sm-9">
                  <upload id="indexWSImg" tips="推荐尺寸：260px*160px" text="上传图片" :img.sync="indexWholesale.img"></upload>
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
    <!-- 大首页批发中心反馈 -->
    <modal :show.sync="showIndexFB" title="反馈">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveIndexFB">
          <div class="form-group pos-parent">
            <label for="indexFBName" class="col-sm-3 control-label">反馈标题</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" name="indexFBName" id="indexFBName" v-model="indexFB.title" autocomplete="off" @keyup="getRemoteIndexFB"/>
            <ul class="col-sm-9 pos-child" v-show="showIndexFBList">
              <li class="form-control col-sm-9" v-for="item in remoteIndexFBs" v-text="item.title" @click.prevent="chooseIndexFB(item,$index)"></li>
            </ul>
          </div>
          </div>
          <div class="form-group">
            <label for="indexFBSortId" class="col-sm-3 control-label">优先级</label>
            <div class="col-sm-9">
              <input type="number" name="indexFBSortId" id="indexFBSortId" class="form-control" v-model="indexFB.sortId">
            </div>
          </div>
          <div class="form-group">
                <label for="indexFBImg" class="col-sm-3 control-label">图片</label>
                <div class="col-sm-9">
                  <upload id="indexFBImg" tips="优先级为1时需上传图片尺寸为260px*160px" text="上传图片" :img.sync="indexFB.img"></upload>
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
    <!-- 类目添加 -->
    <modal :show.sync="showTownCate" title="添加专业镇类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTownCate">
          <div class="form-group">
            <label for="townCateName" class="col-sm-2 control-label">类目名称</label>
            <div class="col-sm-10">
              <input type="text" name="townCateName" id="townCateName" class="form-control" v-model="townCate.name" autocomplete="off" @keyup="getRemoteTownCate"/>
              <ul class="col-sm-9 pos-child" v-show="showtownCateList">
                <li class="form-control col-sm-9" v-for="item in remotetownCates" v-text="item.nameEn" @click.prevent="choosetownCate(item,$index)"></li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="townCateSortId" class="col-sm-2 control-label">优先级</label>
            <div class="col-sm-10">
              <input type="number" name="townCateSortId" id="townCateSortId" class="form-control" v-model="townCate.sortId">
            </div>
          </div>
          <div class="form-group">
                <label for="townLink" class="col-sm-2 control-label">跳转链接</label>
                <div class="col-sm-10">
                  <input type="text" name="townLink" id="townLink" class="form-control" v-model="townCate.link">
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
    <!-- 类目子添加 -->
    <modal :show.sync="showTownCateChild" title="添加专业镇子类目">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTownCateChild">
          <div class="form-group">
            <label for="townCateChildName" class="col-sm-2 control-label">类目名称</label>
            <div class="col-sm-10">
              <input type="text" name="townCateChildName" id="townCateChildName" class="form-control" v-model="townCateChild.name" autocomplete="off" @keyup="getRemoteTownChildCate"/>
              <ul class="col-sm-9 pos-child" v-show="showTownCateChildList">
                <li class="form-control col-sm-9" v-for="item in remoteTownCateChilds" v-text="item.nameEn" @click.prevent="chooseTownCateChild(item,$index)"></li>
              </ul>
            </div>
          </div>
          <div class="form-group">
                <label for="townLink" class="col-sm-2 control-label">跳转链接</label>
                <div class="col-sm-10">
                  <input type="text" name="townLink" id="townLink" class="form-control" v-model="townCateChild.link">
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
    <!-- 添加专业镇活动banner -->
    <modal :show.sync="showTownBanner" title="添加Banner">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTownBanner">
          <div class="form-group">
            <label for="townBNName" class="col-sm-2 control-label">名称</label>
            <div class="col-sm-10">
              <input type="text" name="townBNName" id="townBNName" class="form-control" v-model="townActBN.name" autocomplete="off"/>
            </div>
          </div>
          <!-- <div class="form-group">
            <label for="townBNDescribe" class="col-sm-2 control-label">描述</label>
            <div class="col-sm-10">
              <input type="text" name="townBNDescribe" id="townBNDescribe" class="form-control" v-model="townActBN.describe">
            </div>
          </div> -->
          <div class="form-group">
            <label for="townBNSortId" class="col-sm-2 control-label">优先级</label>
            <div class="col-sm-10">
              <input type="number" name="townBNSortId" id="townBNSortId" class="form-control" v-model="townActBN.sortId">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">显示位置</label>
            <div class="col-sm-10">
              <input type="radio" name="townBNPlace" id="townBanner" value="1" v-model="townActBN.place"/>&nbsp;
              <label for="townBanner">banner</label>&nbsp;&nbsp;
              <input type="radio" name="townBNPlace" id="adPic" value="2" v-model="townActBN.place"/>&nbsp;
              <label for="adPic">产业集群入驻宣传图</label>
            </div>
          </div>
          <div class="form-group">
            <label for="townBNLink" class="col-sm-2 control-label">跳转链接</label>
            <div class="col-sm-10">
              <input type="text" name="townBNLink" id="townBNLink" class="form-control" v-model="townActBN.link">
            </div>
          </div>
          <div class="form-group">
            <label for="townActBNImg" class="col-sm-2 control-label">图片</label>
            <div class="col-sm-10">
              <upload id="townActBNImg" tips="banner尺寸:920px*320px<br/>宣传图尺寸:260px*320px" text="上传图片" :img.sync="townActBN.img"></upload>
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
    <!-- 专业镇活动推荐 -->
    <modal :show.sync="showTownAct" title="活动">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTownAct">
          <div class="form-group">
            <label for="townActName" class="col-sm-3 control-label">对应的活动</label>
            <div class="col-sm-9 pos-parent">
              <input type="text" class="form-control" name="townActName" id="townActName" v-model="townAct.name" autocomplete="off" @keyup="getRemoteTownAct"/>
              <ul class="col-sm-9 pos-child" v-show="showTownActList">
                <li class="form-control col-sm-9" v-for="item in remoteTownActs" v-text="item.name" @click.prevent="chooseTownAct(item,$index)"></li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="townActSortId" class="col-sm-3 control-label">优先级</label>
            <div class="col-sm-9">
              <input type="number" name="townActSortId" id="townActSortId" class="form-control" v-model="townAct.sortId">
            </div>
          </div>
          <div class="form-group">
            <div class="col-lg-offset-3 col-sm-5">优先级为1时尺寸为500px*240px <br/> 其他为160px*100px</div>
          </div>
          <div class="form-group">
                <label for="townActImg" class="col-sm-3 control-label">图片</label>
                <div class="col-sm-9">
                  <upload id="townActImg" text="上传图片" :img.sync="townAct.img"></upload>
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
    <!-- 专业镇批发市场 -->
    <!-- 专业镇批发市场反馈 -->
    <modal :show.sync="showTownFB" title="添加反馈">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTownFB">
          <div class="form-group">
            <label for="townFBName" class="col-sm-3 control-label">反馈标题</label>
            <div class="col-sm-9 pos-parent">
              <input type="text" class="form-control" name="townFBName" id="townFBName" v-model="townFB.title" autocomplete="off" @keyup="getRemoteTownFB"/>
              <ul class="col-sm-9 pos-child" v-show="showTownFBList">
                <li class="form-control col-sm-9" v-for="item in remoteTownFBs" v-text="item.title" @click.prevent="chooseTownFB(item,$index)"></li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="townFBSortId" class="col-sm-3 control-label">优先级</label>
            <div class="col-sm-9">
              <input type="number" name="townFBSortId" id="townFBSortId" class="form-control" v-model="townFB.sortId">
            </div>
          </div>
          <div class="form-group">
                <label for="townFBImg" class="col-sm-3 control-label">图片</label>
                <div class="col-sm-9">
                  <upload id="townFBImg" text="上传图片" :img.sync="townFB.img"></upload>
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
    <!-- top 100 -->
    <modal :show.sync="showTop100" title="添加品牌">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveTop100">
          <div class="form-group">
            <label for="top100Name" class="col-sm-2 control-label">品牌名称</label>
            <div class="col-sm-10">
              <input type="text" name="top100Name" id="top100Name" class="form-control" v-model="top100.name" autocomplete="off" @keyup="getRemoteTop100"/>
              <ul class="col-sm-9 pos-child" v-show="showTop100List">
                <li class="form-control col-sm-9" v-for="item in remoteTop100s" v-text="item.nameEn" @click.prevent="chooseTop100(item,$index)"></li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="top100SortId" class="col-sm-2 control-label">优先级</label>
            <div class="col-sm-10">
              <input type="number" name="top100SortId" id="top100SortId" class="form-control" v-model="top100.sortId">
            </div>
          </div>
          <div class="form-group">
            <label for="top100Img" class="col-sm-2 control-label">图片</label>
            <div class="col-sm-10">
              <upload id="top100Img" tips="尺寸：130px*130px" text="上传图片" :img.sync="top100.logo"></upload>
            </div>
          </div>
          <div class="form-group">
            <label for="toplink" class="col-sm-2 control-label">跳转链接</label>
            <div class="col-sm-10">
              <input type="text" name="toplink" id="toplink" class="form-control" v-model="top100.link">
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
    <!-- 活动页面banner -->
    <modal :show.sync="showActivityBanner" title="添加banner">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveActivityBanner">
          <div class="form-group">
            <label for="activityBNName" class="col-sm-2 control-label">名称</label>
            <div class="col-sm-10">
              <input type="text" name="activityBNName" id="activityBNName" class="form-control" v-model="activityBN.name" autocomplete="off"/>
            </div>
          </div>
          <div class="form-group">
            <label for="activityBNSortid" class="col-sm-2 control-label">优先级</label>
            <div class="col-sm-10">
              <input type="number" name="activityBNSortid" id="activityBNSortid" class="form-control" v-model="activityBN.sortId">
            </div>
          </div>
           <div class="form-group">
            <label class="col-sm-2 control-label">显示位置</label>
            <div class="col-sm-10">
              <input type="radio" name="activityBNPlace" id="activitybanner" value="1" v-model="activityBN.place"/>&nbsp;
              <label for="activitybanner">banner</label>&nbsp;&nbsp;
              <input type="radio" name="activityBNPlace" id="adPic1" value="2" v-model="activityBN.place"/>&nbsp;
              <label for="adPic1">右上广告图</label>&nbsp;&nbsp;
              <input type="radio" name="activityBNPlace" id="adPic2" value="3" v-model="activityBN.place">&nbsp;
              <label for="adPic2">右下广告图</label>
            </div>
          </div>
          <div class="form-group">
                <label for="activityBNImg" class="col-sm-2 control-label">图片</label>
                <div class="col-sm-10">
                  <upload id="activityBNImg" text="上传图片" tips="banner尺寸:880px*320px<br/>右上广告图、右下广告图的尺寸:300px*150px" :img.sync="activityBN.img"></upload>
                </div>
              </div>
              <div class="form-group">
            <label for="activityBNLink" class="col-sm-2 control-label">跳转链接</label>
            <div class="col-sm-10">
              <input type="text" name="activityBNLink" id="activityBNLink" class="form-control" v-model="activityBN.link">
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
    <!-- 添加添加活动页面推荐活动 -->
    <modal :show.sync="showActivityAct" title="添加推荐活动">
      <div slot="modal-body" class="modal-body">
        <form class="form-horizontal" v-ajax-submit @submit.prevent="saveActivityAct">
          <div class="form-group pos-parent">
            <label for="activityActName" class="col-sm-3 control-label">对应的活动</label>
            <div class="col-sm-9 pos-parent" style="position:relative;">
              <input type="text" class="form-control" name="activityActName" id="activityActName" v-model="activityAct.name" autocomplete="off" @keyup="getRemoteActivityAct"/>
              <ul class="col-sm-9 pos-child" v-show="showActivityActList">
                <li class="form-control col-sm-9" v-for="item in remoteActivityActs" v-text="item.name" @click.prevent="chooseActivityAct(item,$index)"></li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="activityActSortId" class="col-sm-3 control-label">优先级</label>
            <div class="col-sm-9">
              <input type="number" name="activityActSortId" id="activityActSortId" class="form-control" v-model="activityAct.sortId">
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
     <!-- 专业镇所有活动 -->
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
  var indexAct = {name:null,sortId:null,img:null};
  var indexWholesale = {nameEn:null,sortId:null,img:null};
  var indexFB = {name:null,sortId:null,img:null,title:''};

  var townActBN={name:null,place:1,img:null,sortId:null,link:null};
  var townAct={name:null,sortId:null,img:null};
  var townFB = {name:null,sortId:null,img:null,title:''};

  var top100 = {sortId:null,name:null,logo:null,link:null};
  var townCate = {sortId:null,name:null,link:null,menuChilds:[]};
  var townCateChild = {name:null,link:null,parentId:null,};

  var activityBN = {name:null,place:1,img:null,sortId:null,link:null};
  var activityAct = {name:null,sortId:null};
  var remoteAAct = {cmsImg:null,name:null,isRecommend:1,sortId:null};

  // var appRecommon = {name:null,sortId:null,img:null};

  module.exports={
    data:function(){
      return{
        visibility:"industrialIdx",
        visibilityActivity:"banner",
        vSpecificIdex:"banner",
        // 专业镇id
        iwId:this.$route.params.id,
        // 弹窗
        // 大首页推荐
        showIndexAct:false,
        showIndexWholesale:false,
        showIndexFB:false,
        showIndexActList:false,
        showIndexWSList:false,
        showIndexFBList:false,
        // 远程请求数据接收数组
        remoteIndexActs:[],
        remoteIndexWholesales:[],
        remoteIndexFBs:[],
        remoteActivityActs:[],
        remoteTownActs:[],
        remoteTownFBs:[],
        remotetownCates:[],
        remoteTownCateChilds:[],
        remoteTop100s:[],
        // 专业镇分类
        showTownCate:false,
        showTownCateChild:false,
        showtownCateList:false,
        showTownCateChildList:false,
        // 专业镇首页推荐
        showTownBanner:false,
        showTownAct:false,
        showTownFB:false,
        showTownActList:false,
        showTownFBList:false,
        // 一百强
        showTop100:false,
        showTop100List:false,
        // 活动页面
        showActivityBanner:false,
        showActivityAct:false,
        showActivityActList:false,
        // app推荐
        // showAppRecommon:false,
        // 
        indexAct:$.extend({},indexAct),
        indexWholesale:$.extend({},indexWholesale),
        indexFB:$.extend({},indexFB),
        IndexActs:[],
        IndexWholesales:[],
        IndexFBs:[],


        // 类目
        townCates:[],
        townCate:$.extend({},townCate),
        townCateChild:$.extend({},townCateChild),
        isNew:false,

        //具体专业镇推荐
        townActBNs: [],
        townActs:[],
        townFBs:[],
        townActBN: $.extend({}, townActBN),
        townAct:$.extend({}, townAct),
        townFB:$.extend({}, townFB),
        // 100强
        top100s:[],
        top100: $.extend({iwId:this.$route.params.id},top100),
        // 活动页面
        activityBN:$.extend({},activityBN),
        activityAct:$.extend({},activityAct),
        activityBNs:[],
        activityActs:[],
        // 页面所有活动
        remoteAAct:$.extend({},remoteAAct),
        remoteAActList:[],
        showAAct:false,
        // app
        // appRecommon:$.extend({},appRecommon),
        // appRecommons:[],
        // showAppRecommonList:false,
        // remoteAppRecommons:[],
        // appType:null,
        // appInputName:null,
        // 当前索引
        currentidx:null,
        // 二级子类目索引
        childcurrentidx:null,
        // 页
        topPage:{
          total:null,
          current:1,
          perPage:5,
        },
        // 批量删除
        delAllTops:false,
        // 
        queryObj:{name:''}
      }
      
    },
    route:{
      data:function(){
        this.getTownName();
        this.getTop100();
        this.getTownMenu();
        this.getIndexAct();
        this.getIndexWS();
        this.getIndexFB();
        this.getActivtyBanner();
        this.getActivityAct();
        this.getTownActBN();
        this.getTownAct();
        this.getTownFB();
        // this.getAppRecommon();
        this.getAActList();
      }
    },
    methods:{
      // 
      cutNav:function(typeStr){
        var self = this;
        var href = window.location.href;
        var targetHref =href.slice(0,href.indexOf('?'));
        console.log(targetHref);
        window.location = targetHref + '?name=' + self.queryObj.name + '&type=' + typeStr;
      },
      // 
      getTownName:function(){
        var self = this;
        var targetObj = {};
        var href = window.location.href;
        var targetArr = href.split('?')[1].split('&');
        for(var i=0;i<targetArr.length;i++){
          targetObj[targetArr[i].split('=')[0]] = decodeURIComponent(targetArr[i].split('=')[1]);
        };
        self.queryObj = $.extend({},targetObj);
        if (!self.queryObj.type) {
          self.visibility = 'industrialIdx';
        }else{
          self.visibility = self.queryObj.type;
        };
      },
      // 远程获取大首页推荐
      getRemoteIndexAct:function(){
        var self = this;
        var params={
          iwId:self.iwId,
          activitiesName:self.indexAct.name
        };  
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/activity.cf',
          type:'get',
          data:params
        })
        .done(function(res){
          self.remoteIndexActs = res.data;
        })
      },
      getRemoteIndexWholesale:function(){
        var self = this;
        var params = {
          iwId:self.iwId,
          wcenterName:self.indexWholesale.nameEn,
        };
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/home/wcenterInfo.cf',
          type:'post',
          data:params
        })
        .done(function(res){
          self.remoteIndexWholesales = res.data;
        })
      },
      getRemoteIndexFB:function(){
        var self = this;
        var params = {
          iwId:self.iwId,
          feedbackName:self.indexFB.title
        };
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/home/feedbackInfo.cf',
          type:'post',
          data:params
        })
        .done(function(res){
          self.remoteIndexFBs = res.data;
        })
      },
      // 类目
      getRemoteTownCate:function(){
        var self = this;
        console.log(123);
        var params={
          categoryNameEn:self.townCate.name,
        };  
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/home/categoryList.cf',
          type:'post',
          data:params
        })
        .done(function(res){
          console.log(res);

          self.remotetownCates = res.data.splice(0,9);
        })
        .fail(function(res){
          console.log(res);
        })

      },
      getRemoteTownChildCate:function(){
        var self = this;
        var params={
          categoryNameEn:self.townCateChild.name,
        };  
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/home/categoryList.cf',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){

          self.remoteTownCateChilds = res.data;
        })
        .fail(function(res){
          console.log('fail');
        })

      },
      // top100
      getRemoteTop100:function(){
        var self = this;
        var params={
          iwId:self.iwId,
          companyName:self.top100.name,
        };  
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/relevanceCompany.cf',
          type:'post',
          data:params
        })
        .done(function(res){
          self.remoteTop100s = res.data.splice(0,9);
        })
      },
      // 活动页面
      getRemoteActivityAct:function(){
        var self = this;
        var params = {
          iwId:self.iwId,
          activityName:self.activityAct.name,
        };
        $.ajax({
          url: domainCrm + '/cms/iwIclusters/activity.cf',
          type:'get',
          data:params
        })
        .done(function(res){
          self.remoteActivityActs = res.data;
        })
      },
      // 某个专业镇推荐
      getRemoteTownAct:function(){
        var self = this;
        var params = {
          iwId:self.iwId,
          activityName:self.townAct.name,
        };
        $.ajax({
          url:domainCrm + '/cms/iwIclusters/activity.cf',
          type:'get',
          dataType:'json',
          data:params
        })
        .done(function(res){
          self.remoteTownActs = res.data;
        })
      },
      getRemoteTownFB:function(){
        var self = this;
        var params = {
          iwId:self.iwId,
          feedbackName:self.townFB.title,
        };
        $.ajax({
          url:domainCrm +'/cms/iwIclusters/home/feedbackInfo.cf',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          self.remoteTownFBs = res.data;
        })
      },
      // 获取大首页推荐
      getIndexAct:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/indexAct/' + self.iwId,
          type:'get',
          dataType:'json',
          data:null
        })
        .done(function(res){
          if (1 == res.status) {
            self.IndexActs = res.data;
          }
        })
      },
      getIndexWS:function(){
        var self = this;

        $.ajax({
          url:domain + '/industrial/indexWS/' + self.iwId,
          type:'get',
          dataType:'json',
          data:null
        })
        .done(function(res){
          console.log(res);
          if (1 == res.status) {
            self.IndexWholesales = res.data;
          }
        })
      },
      getIndexFB:function(){
        var self = this;

        $.ajax({
          url:domain + '/industrial/indexFB/' + self.iwId,
          type:'get',
          dataType:'json',
          data:null
        })
        .done(function(res){
          console.log(res);
          if (1 == res.status) {
            self.IndexFBs = res.data;
          }
        })
      },
      // 获取某个专业镇推荐
      getTownActBN:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/townbanner/' + self.iwId,
          type:'get',
          dataType:'json',
          data:null
        })
        .done(function(res){
          if (res.status == 1) {
            self.townActBNs = res.data;
          }
        })
      },
      getTownAct:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/townact/' + self.iwId,
          type:'get',
          dataType:'json',
          data:null
        })
        .done(function(res){
          if (res.status == 1) {
            self.townActs = res.data;
          }
        })
      },
      getTownFB:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/townfb/' + self.iwId,
          type:'get',
          dataType:'json',
          data:null
        })
        .done(function(res){
          if (res.status == 1) {
            self.townFBs = res.data;
          }
        })
      },

      // 获取品牌一百强
      getTop100:function(){
        var self = this;
        var params =  $.extend({}, self.topPage);

        $.ajax({
          url:domain + '/industrial/tophundred/'+self.iwId,
          type:'GET',
          dataType:'JSON',
          data:params
        })
        .done(function(res){
          if (res.status == "1") {
            res.data.forEach(function(item,i){
              item.checked = null;
            });
            self.topPage.total = res.count;
            self.topPage.perPage = res.perPage;
            self.top100s = res.data;
          }
        })
      },
      // 获取专业镇分类菜单
      getTownMenu:function(_one){
        var self = this;
        var params = {
          getOne:_one
        }
        $.ajax({
          url:domain+'/industrial/townmenu/'+self.iwId,
          type:'Get',
          dataType:'JSON',
          data:params
        })
        .done(function(res){
          console.log(res);
          if ("1" == res.status) {
            self.townCates = res.data;
          }
        })
      },
      // 获取某个专业镇活动推荐
      getActivityAct:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/activityact/' + self.iwId,
          type:'get',
          dataType:'json'
        })
        .done(function(res){
          if (1 == res.status) {
            self.activityActs = res.data;
          }
        })
      },
      getActivtyBanner:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/activitybanner/' + self.iwId,
          type:'get',
          dataType:'json'
        })
        .done(function(res){
          if (res.status == 1) {
            self.activityBNs = res.data;
          }
        })
      },

      // 添加/编辑
      addIndexAct:function(a,idx){
        var self = this;
        self.showIndexAct = true;
        if (a) {
          self.currentidx = idx;
          self.indexAct = $.extend({},a);
          self.showIndexActList = false;
          $('#indexActName').off('focusin');
        };
        if (!a) {
          self.indexAct = $.extend({},indexAct);
          $('#indexActName').on('focusin',function(event) {
            self.showIndexActList = true;
          });
          self.getRemoteIndexAct();
        }
      },
      addIndexWholesale:function(a,idx){
        var self = this;
        self.showIndexWholesale = true;
        if (a) {
          self.currentidx = idx;
          self.indexWholesale = $.extend({},a);
          self.showIndexWSList=false;
          $('#indexWSName').off('focusin');
        };
        if (!a) {
          self.indexWholesale = $.extend({},indexWholesale);
          $('#indexWSName').on('focusin',function(event) {
            self.showIndexWSList=true;
          });
          self.getRemoteIndexWholesale();
        }
        
      },
      addIndexFB:function(a,idx){
        var self = this;
        self.showIndexFB = true;
        if (a) {
          self.currentidx = idx;
          self.indexFB = $.extend({},a);
          self.showIndexFBList=false;
          $('#indexFBName').off('focusin');
        }
        if (!a) {
          self.indexFB = $.extend({},indexFB);
          $('#indexFBName').on('focusin',function(event) {
            self.showIndexFBList=true;
          });
          self.getRemoteIndexFB();
        }
      },
      addTownCate:function(a,idx){
        var self = this;
        self.showTownCate = true;
        if (a) {
          self.currentidx = idx;
          $.extend(self.townCate,a);
        };
        if (!a) {
          self.townCate = $.extend({iwId:self.iwId},townCate);
          $('#townCateName').on('focusin',function(event){
            self.showtownCateList = true;
            self.getRemoteTownCate();
          })
        }

      },

      addTownChildCate:function(a,idx,_parent){
        var self = this;
        self.showTownCateChild = true;
        self.townCate = $.extend({},_parent);
        console.log(self.townCate._id);
        if (a) {
          self.childcurrentidx = idx;
          $.extend(self.townCateChild,a);
        };
        if (!a) {
          self.isNew = true;
          townCateChild.parentId = self.townCate._id;
          self.townCateChild = $.extend({},townCateChild);
          console.log(townCateChild);
          $('#townCateChildName').on('focusin',function(event){
            self.showTownCateChildList = true;
            self.getRemoteTownChildCate();
          })
        }
      },

      addTownBanner:function(a,index){
        var self = this;
        self.showTownBanner = true;
        if (a) {
          self.currentidx = index;
          self.townActBN = $.extend({},a);
        };
        if (!a) {
          self.townActBN = $.extend({},{iwId:self.iwId},townActBN);
        }

      },
      addTownAct:function(a,index){
        var self = this;
        self.showTownAct = true;
        if (a) {
          self.currentidx = index;
          self.townAct = $.extend({},a);
        };
        if (!a) {
          self.townAct = $.extend({},{iwId:self.iwId},townAct);
          $('#townActName').on('focusin',function(event){
            self.showTownActList = true;
            self.getRemoteTownAct();
          })
        }

      },
      addTownFB:function(a,index){
        var self = this;
        self.showTownFB = true;
        if (a) {
          self.currentidx = index;
          self.townFB = $.extend({},a);
        };
        if (!a) {
          self.townFB = $.extend({},{iwId:self.iwId},townFB);
          $('#townFBName').on('focusin',function(event){
            self.showTownFBList = true;
            self.getRemoteTownFB();
          })
        }

      },
      addTop100:function(a,idx){
        var self = this;
        self.showTop100 = true;
        if (a) {
          self.currentidx = idx;
          $.extend(self.top100,a);
        };
        if(!a){
          self.top100=$.extend({iwId:self.$route.params.id},top100);
          $('#top100Name').on('focusin',function(event){
            self.showTop100List = true;
            self.getRemoteTop100();
          })
        }
      },
      addActivityBanner:function(a,index){
        var self = this;
        self.showActivityBanner = true;
        if (a) {
          self.currentidx = index;
          self.activityBN = $.extend({},a);
        };
        if (!a) {
          self.activityBN = $.extend({iwId:self.iwId},activityBN);
        }

      },
      addActivityAct:function(a,index){
        var self = this;
        self.showActivityAct = true;
        if (a) {
          self.currentidx = index;
          self.activityAct = $.extend({},a);
          self.showActivityActList = false;
          $('#activityActName').off('focusin');
        };
        if (!a) {
          self.activityAct = $.extend({},activityAct);
          $('#activityActName').on('focusin',function(){
            self.showActivityActList = true;
          });
          self.getRemoteActivityAct();
        }

      },
      // 删除
      deleteIndexAct:function(ids){
        var self = this;

        if (window.confirm('确定删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/indexAct/' +ids,
              type:'delete'
            })
            .done(function(res){
              if (res.status == 1) {
                self.getIndexAct();
              }
            })
          }
        }
      },
      deleteIndexWholesale:function(ids){
        var self = this;

        if (window.confirm('确定删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/indexWS/' +ids,
              type:'delete'
            })
            .done(function(res){
              if (res.status == 1) {
                self.getIndexWS();
              }
            })
          }
        }
      },
      deleteIndexFB:function(ids){
        var self = this;

        if (window.confirm('确定删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/indexFB/' +ids,
              type:'delete'
            })
            .done(function(res){
              if (res.status == 1) {
                self.getIndexFB();
              }
            })
          }
        }
      },
      delTownBanner:function(ids){
        var self = this;
        if (window.confirm('确定要删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/townbanner/' + ids,
              type:'delete',
              dataType:'json'
            })
            .done(function(res){
              if (res.status == 1) {
                self.getTownActBN();
              }
            })
          }
        }

      },
      delTownAct:function(ids){
        var self = this;
        if (window.confirm('确定要删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/townact/' + ids,
              type:'delete',
              dataType:'json'
            })
            .done(function(res){
              if (res.status == 1) {
               self.getTownAct();
              }
            })
          }
        }

      },
      delTownFB:function(ids){
        var self = this;
        if (window.confirm('确定要删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/townfb/' + ids,
              type:'delete',
              dataType:'json'
            })
            .done(function(res){
              if (res.status == 1) {
               self.getTownFB();
              }
            })
          }
        }

      },
      deleteTops:function(ids,index){
        var self = this;
        var idxArr = [];
        idxArr = index.toString().split(',');
        if (confirm('确定删除？')) {
          if (ids) {
            $.ajax({
              url: domain + '/industrial/tophundred/' + ids,
              type: 'delete',
            })
            .done(function(res) {
              if(1 == res.status) {
                self.getTop100();
              }
            })
          }
        }
      },
      deleteObjMinOrderTops:function(){
        var self = this;
        var idsArr = [];
        var idxArr = [];
        self.top100s.forEach(function(item,i){
          if (item.checked) {
            idsArr.push(item._id);
            idxArr.push(i);
          }
        });
        self.deleteTops(idsArr.join(','),idxArr.join(','));
      },
      delTownCate:function(ids,index){
        console.log(ids);
        var self = this;
        if (confirm('确定要删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/townmenu/' + ids,
              type:'DELETE',
            })
            .done(function(res){
              if (1 == res.status) {
                self.getTownMenu();
              }
            })
          }
        }
      },
      delTownChildCate:function(a,index,_parent){
        var self = this;
        if (confirm('确定要删除吗？')) {
          self.townCate = $.extend({},_parent);
          self.townCate.menuChilds.splice(index,1);
          var params = JSON.stringify(this.townCate);
          $.ajax({
            url:domain+'/industrial/townmenu',
            type:'POST',
            dataType:'json',
            data:{data:params}
          })
          .done(function(res){
            if (1 == res.status) {
              self.getTownMenu();
              self.showTownCateChild = false;
            }else{
              alert('系统出错，请刷新后重试！');
            }
          })
        }
      },
      delActivityAct:function(ids){
        var self = this;
        if (window.confirm('确定要删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/activityact/' + ids,
              type:'DELETE',
            })
            .done(function(res){
              if (1 == res.status) {
                self.getActivityAct();
              }
            })
          }
        }
      },
      delActivityBanner:function(ids){
        var self = this;
        if (window.confirm('确定要删除吗？')) {
          if (ids) {
            $.ajax({
              url:domain + '/industrial/activitybanner/' + ids,
              type:'DELETE',
            })
            .done(function(res){
              if (1 == res.status) {
                self.getActivtyBanner();
              }
            })
          }
        }
      },
      // 保存
      saveIndexAct:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(self.indexAct));
        console.log(params);
        $.ajax({
          url:domain + '/industrial/indexAct',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          if (1 == res.status) {
            if (params._id) {
              self.IndexActs.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.IndexActs.unshift(params);
            }
            self.showIndexAct = false;
          };
        })


      },
      saveIndexWholesale:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(self.indexWholesale));
        console.log(params);
        $.ajax({
          url:domain + '/industrial/indexWS',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          if (1 == res.status) {
            if (params._id) {
              self.IndexWholesales.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.IndexWholesales.unshift(params);
            }
            self.showIndexWholesale = false;
          };
        })

      },
      saveIndexFB:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(self.indexFB));
        console.log(params);
        $.ajax({
          url:domain + '/industrial/indexFB',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          if (1 == res.status) {
            if (params._id) {
              self.IndexFBs.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.IndexFBs.unshift(params);
            }
            self.showIndexFB = false;
          };
        })

      },
      saveTownCate:function(){
        var self = this;
        var params = JSON.stringify(this.townCate);
        $.ajax({
          url:domain+'/industrial/townmenu',
          type:'POST',
          dataType:'json',
          data:{data:params}
        })
        .done(function(res){
          if (1 == res.status) {
            if (JSON.parse(params)._id) {
              self.townCates.$set(self.currentidx,JSON.parse(params));
            }else{
              self.getTownMenu();
              // JSON.parse(params)._id = res.data._id;
              // self.townCates.unshift(JSON.parse(params));
            }
            // self.getTownMenu();
            self.showTownCate = false;
          }
        });
      },

      saveTownCateChild:function(){
        var self = this;
        var _setObj = JSON.parse(JSON.stringify(self.townCateChild));
        if (self.isNew) {
          self.townCate.menuChilds.push(_setObj);
          self.isNew = false;
        }else{
          self.townCate.menuChilds.splice(self.childcurrentidx,1,_setObj);
        };
        var params = JSON.stringify(this.townCate);
        $.ajax({
          url:domain+'/industrial/townmenu',
          type:'POST',
          dataType:'json',
          data:{data:params}
        })
        .done(function(res){
          if (1 == res.status) {
            self.showTownCateChild = false;
            self.getTownMenu();
          }else{
            alert('系统出错，请刷新后重试！');
          }
        })
      },

      saveTownBanner:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(this.townActBN));
        console.log(params);
        $.ajax({
          url: domain + '/industrial/townbanner',
          type: 'POST',
          dataType: 'json',
          data: params
        })
        .done(function(res) {
          if (1 == res.status) {
            if (params._id) {
              self.townActBNs.$set(self.currentidx, params);
            } else {
              params._id = res.data._id;
              self.townActBNs.unshift(params);
            }
            self.showTownBanner = false;
          }
        });
      },
      saveTownAct:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(self.townAct));
        console.log(params);
        $.ajax({
          url:domain + '/industrial/townact',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          if (res.status == 1) {
            if (params._id) {
              self.townActs.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.townActs.unshift(params);
            };
            self.showTownAct = false;
          }
        })

      },
      saveTownFB:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(self.townFB));
        console.log(params);
        $.ajax({
          url:domain + '/industrial/townfb',
          type:'post',
          dataType:'json',
          data:params
        })
        .done(function(res){
          if (res.status == 1) {
            if (params._id) {
              self.townFBs.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.townFBs.unshift(params);
            };
            self.showTownFB = false;
          }
        })

      },
      saveTop100:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(this.top100));
        $.ajax({
          url:domain + '/industrial/tophundred',
          type:'POST',
          dataType:'json',
          data:params
        })
        .done(function(res){
          console.log(res);
          if (res.status == '1') {
            if (params._id) {
              self.top100s.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.top100s.unshift(params);
            }
            self.showTop100 = false;
          }
        })

      },
      saveActivityBanner:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(this.activityBN));
        $.ajax({
          url: domain + '/industrial/activitybanner',
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(res) {
          console.log(res);
          if (res.status == 1) {
            if (params._id) {
              self.activityBNs.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.activityBNs.unshift(params);
            }
            self.showActivityBanner = false;
          }
        })
      },
      saveActivityAct:function(){
        var self = this;
        var params = JSON.parse(JSON.stringify(this.activityAct));
        $.ajax({
          url: domain + '/industrial/activityact',
          type: 'post',
          dataType: 'json',
          data: params,
        })
        .done(function(res) {
          console.log(res);
          if (res.status == '1') {
            if (params._id) {
              self.activityActs.$set(self.currentidx,params);
            }else{
              params._id = res.data._id;
              self.activityActs.unshift(params);
            }
            self.showActivityAct = false;
          }
        })
        
      },
      // 换页
      topPageCallback:function(page){
        this.topPage.current = page;
        this.getTop100();
      },
      // 点击事件
      chooseIndexAct:function(item,index){
         var self = this;
        self.indexAct.name = item.name;
        self.indexAct.activitiesNumber = item.activitiesNumber;
        self.indexAct.deadlineTime = item.deadlineTime;
        self.indexAct.details = item.details;
        self.indexAct.indexActId = item.id;
        self.indexAct.activitiesStatus = item.activitiesStatus;
        self.indexAct.canRegister = item.canRegister;
        self.indexAct.endTime = item.endTime;
        self.indexAct.image = item.image;
        self.indexAct.maxActivitiesNumber = item.maxActivitiesNumber;
        self.indexAct.minActivitiesNumber = item.minActivitiesNumber;
        self.indexAct.statrTime = item.statrTime;
        self.indexAct.totalVisitNumber = item.totalVisitNumber;
        self.indexAct.createdTime = item.createdTime;
        self.indexAct.pageViews = item.pageViews;
        self.indexAct.iwId = self.iwId;
        self.indexAct.id = item.id;
        self.showIndexActList = false;
        console.log(self.indexAct);
      },
      chooseIndexWS:function(item,index){
        var self = this;
        self.indexWholesale.nameEn = item.nameEn;
        self.indexWholesale.indexWSId = item.id;
        self.indexWholesale.iwId = self.iwId;
        self.indexWholesale.propagandaPicture = item.propagandaPicture;
        self.indexWholesale.searchImage = item.searchImage;
        self.indexWholesale.avatarImage = item.avatarImage;
        self.indexWholesale.detailsEn = item.detailsEn;
        self.indexWholesale.mainProduct = item.mainProduct;
        self.showIndexWSList = false;
        console.log(self.indexWholesale);

      },
      chooseIndexFB:function(item,index){
        var self = this;
        self.indexFB.content = item.content;
        self.indexFB.createdTime = item.createdTime;
        self.indexFB.indexFBId = item.id;
        self.indexFB.name = item.name;
        self.indexFB.title = item.title;
        self.indexFB.sumScore = item.sumScore+'';
        self.indexFB.feedbackNumber = item.feedbackNumber+'';
        self.indexFB.imgs = item.imgs;
        self.indexFB.photo = item.photo;
        self.indexFB.iwId = self.iwId;
        self.showIndexFBList = false;
        console.log(self.indexFB);
      },
      chooseActivityAct:function(item,index){
        var self = this;
        self.activityAct.name = item.name;
        self.activityAct.activitiesNumber = item.activitiesNumber;
        self.activityAct.deadlineTime = item.deadlineTime;
        self.activityAct.details = item.details;
        self.activityAct.activityActId = item.id;
        self.activityAct.image = item.image;
        self.activityAct.activitiesStatus = item.activitiesStatus;
        self.activityAct.canRegister = item.canRegister;
        self.activityAct.endTime = item.endTime;
        self.activityAct.maxActivitiesNumber = item.maxActivitiesNumber;
        self.activityAct.minActivitiesNumber = item.minActivitiesNumber;
        self.activityAct.statrTime = item.statrTime;
        self.activityAct.createdTime = item.createdTime;
        self.activityAct.pageViews = item.pageViews;
        self.activityAct.iwId = self.iwId;
        self.showActivityActList = false;
        console.log(self.activityAct);
      },
      chooseTownAct:function(item,index){
        var self = this;
        self.townAct.name = item.name;
        self.townAct.activitiesNumber = item.activitiesNumber;
        self.townAct.deadlineTime = item.deadlineTime;
        self.townAct.details = item.details;
        self.townAct.townActId = item.id;
        self.townAct.activitiesStatus = item.activitiesStatus;
        self.townAct.canRegister = item.canRegister;
        self.townAct.endTime = item.endTime;
        self.townAct.image = item.image;
        self.townAct.maxActivitiesNumber = item.maxActivitiesNumber;
        self.townAct.minActivitiesNumber = item.minActivitiesNumber;
        self.townAct.statrTime = item.statrTime;
        self.townAct.totalVisitNumber = item.totalVisitNumber;
        self.townAct.createdTime = item.createdTime;
        self.townAct.pageViews = item.pageViews;
        self.townAct.iwId = self.iwId;
        self.showTownActList = false;

      },
      chooseTownFB:function(item,index){
        var self = this;
        self.townFB.content = item.content;
        self.townFB.createdTime = item.createdTime;
        self.townFB.townFBId = item.id;
        self.townFB.name = item.name;
        self.townFB.title = item.title;
        self.townFB.sumScore = item.sumScore+'';
        self.townFB.feedbackNumber = item.feedbackNumber+'';
        self.townFB.imgs = item.imgs;
        self.townFB.photo = item.photo;
        self.townFB.iwId = self.iwId;
        self.showTownFBList = false;
      },
      choosetownCate:function(item,index){
        var self = this;
        self.townCate.cateId = item.id;
        self.townCate.name = item.nameEn;
        self.showtownCateList =false;
        console.log(self.townCate);
      },
      chooseTownCateChild:function(item,index){
        var self = this;
        self.townCateChild.cateId = item.id;
        self.townCateChild.name = item.nameEn;
        self.showTownCateChildList = false;
        console.log(self.townCateChild);
      },
      chooseTop100:function(item,index){
        var self = this;
        self.top100.companyId = item.id;
        self.top100.name = item.nameEn;
        self.showTop100List = false;
        console.log(self.top100);
      },
      // 所有页面活动
      synAActList:function(){
        var self = this;
        $.ajax({
          url:domain + '/industrial/synAllActivitys/' + self.iwId,
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
          url:domain + '/industrial/getAllActivitys/' + self.iwId,
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
          url:domain + '/industrial/saveAAct',
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
    },
    watch:{
      delAllTops:function(val,old){
        var self =this;
        if (val) {
          this.top100s.forEach(function(item,i){
            item.checked=true;

          })
        }else{
          this.top100s.forEach(function(item,i){
            item.checked=false;
          })
        }
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

