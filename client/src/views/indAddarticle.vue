<!-- <script type="text/javascript" src="../util/ueditor/ueditor.config.js"/>

<script type="text/javascript" src="../util/ueditor/ueditor.all.js" /> -->
<template>
<side-menu></side-menu>
  <div class="content-wrapper">
    <div class="content-header">
    <h1>文章管理   <a  v-link="{path:'/industrial/'+id}">返回文章列表</a></h1>
    </div>
    <div class="content">
<div class="row" >
    <div class="col-xs-12">
        <div class="box box-default">
            <div class="box-header">
                <div class="alert alert-success alert-dismissable fade in hide" role="alert" id="addSuccess">
                    <button class="close" type="button">×</button>
                    <p><i class="icon fa fa-check"></i> <strong>恭喜！</strong>内容添加成功</p>
                </div>
                <p class="myInfoBox bg-warning text-warning"><i class="icon fa fa-warning"></i> 信息填写完整无误才可提交</p>
            </div>
            <div class="box-body">


    <div  class="modal-body">
      <form class="form-horizontal" v-ajax-submit @submit.prevent="saveNews">
        <div class="form-horizontal">
          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">文章标题</label>
            <div class="col-sm-5">
              <input type="text" class="form-control" v-model="article.name" required>
            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">类型</label>
            <div class="col-sm-5">
              <select class="form-control" v-model="article.newsType" required>
                <option value="1">文章</option>
                <option value="2">视频</option>
              </select>
            </div>
          </div>

          
          <div class="form-group"  style="display:none;">
            <label for="inputEmail3" class="col-sm-2 control-label">简短标题</label>
            <div class="col-sm-5">
              <input type="text" class="form-control" v-model="article.shortTitle">
            </div>
          </div>

           <div class="form-group"  v-show="article.newsType==2">
            <label for="inputEmail3" class="col-sm-2 control-label">视频链接</label>
            <div class="col-sm-5">
              <input type="text" class="form-control" v-model="article.videoUrl">
            </div>
          </div>

           <div class="form-group"  v-show="article.newsType==1">
            <label for="inputEmail3" class="col-sm-2 control-label">文章链接</label>
            <div class="col-sm-5">
              <input type="text" class="form-control" v-model="article.newsUrl">
            </div>
          </div>

           <div class="form-group">
            <label  class="col-sm-2 control-label">来源</label>
            <div class="col-sm-10">
              <label>
                  <input type="radio" checked class="mini" value="1" v-model="article.sources"  name="from"/> 原创&nbsp;
              </label>
              <label>
                  <input type="radio" class="mini" name="from" value="2" v-model="article.sources"  /> 转载
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">缩略图</label>
            <div class="col-sm-5">
              <upload id="pick-newsImg" :img.sync="article.img"></upload>
            </div>
          </div>

          <div class="form-group" v-show="article.newsType==1">
            <label for="inputEmail3" class="col-sm-2 control-label">关键字</label>
            <div class="col-sm-5">
              <input type="text" class="form-control" v-model="article.keywords">
            </div>
          </div>
          <div class="form-group" v-show="article.newsType==1">
            <label for="inputEmail3" class="col-sm-2 control-label">内容摘要</label>
            <div class="col-sm-5">
            <textarea rows="6" cols="30"  name="discription" class="form-control input-sm" v-model="article.summary"></textarea>

            </div>
          </div>
          <div class="form-group" style="display:none;">
            <label for="inputEmail3" class="col-sm-2 control-label">文章详情</label>
            <div class="col-sm-10">

             
                <div class="mb10">
                  <markdown :input.sync="article.content"></markdown>
                </div>
               
             

           <!--  <textarea class="" name="comments"  id="container"  placeholder="请输入文章详情" ueditor>{{article.content}}</textarea> -->

            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">排序</label>
            <div class="col-sm-3">
              <input type="number" class="form-control" v-model="article.sortId">
            </div>
          </div>

          <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">是否显示</label>
            <div class="col-sm-10">
              <label class="radio-inline">
                <input type="radio" name="ishidden" value="1" v-model="article.ishidden"> 显示
              </label>
              <label class="radio-inline">
                <input type="radio" name="ishidden" value="0" v-model="article.ishidden"> 不显示
              </label>
            </div>
          </div>

           <div class="form-group">
                        <label class="control-label col-sm-2">推荐</label>
                        <div class="col-sm-10">
                            <label class="radio-inline">
                              <input type="radio" value="1" v-model="article.recommend" name="option"> 推荐
                            </label>
                            <label class="radio-inline">
                              <input type="radio" value="0" v-model="article.recommend" name="option"> 不推荐
                            </label>
                          </div>
                    </div>
       
        <div class="form-group">
                        <label class="control-label col-sm-2">作者</label>
                        <div class="col-sm-3">
                            <input type="text" class="form-control" disabled="true"  v-model="article.author">
                          </div>
                    </div>



          <div class="form-group">
            <div class="col-sm-10 col-sm-offset-2">
              <button class="btn btn-primary" type="submit">提交</button>
            </div>
          </div>
        </div>
      </form>
    </div>






            </div>
        </div>
    </div>

    <!--添加用户组模态窗口-->

</div>


  </div>
</template>

<script type="text/javascript">


window.UEDITOR_HOME_URL = "http://cms.mrworld.com/cms/lib/ueditor/";//编辑器项目路径


// require('../util/ueditor/ueditor.config.js');
// require('../util/ueditor/ueditor.all.js');
// require('../util/ueditor/zh-cn.js');


// var ue = UE.getEditor('container', {
//       initialFrameWidth: '100%',
//       initialFrameHeight: 400
// });

  //产品默认配置
  var articleOpt = {
    img:'/cms/images/default.png',
    ishidden: 1,
    recommend:1,
    sortId: 10,
    author:"admin"

  }




  module.exports = {
    data: function() {
      return {

        //文章
        id: this.$route.params.id,
        newsId:  this.$route.params.newsId,
        article: $.extend({}, articleOpt), //当前产品
        



      }
    },
    route: {
      data: function(transition) {
        var self = this;
       // var newsId = this.getUrlParam('newsId');
        var params = {'newsId':self.newsId,'id':self.id};
        console.log(self.newsId);
          if(self.newsId){
        
        $.ajax({
          url: domain + '/industrial/news/'+self.id+'/'+self.newsId,
          type: 'GET',
          dataType: 'json',
          //data: params
        })
        .done(function(res) {
          if (1 == res.status) {
            
            self.article=res.data;
          }else{

              alert(res.msg)

          }
        });

          }

       
      }
    },
    methods: {


      //保存产品
      saveNews: function () {
        var self = this;
        var param = JSON.parse(JSON.stringify(this.article));
        param.industrialId = this.id;
        param.author = $("#adminUserName").text();
        //楼层id
        $.ajax({
          url: domain + '/industrial/news',
          type: 'POST',
          dataType: 'json',
          data: param
        })
        .done(function(res) {
          if (1 == res.status) {
            if (param._id) {
              //self.$dispatch('newsList', self.param);
              alert("保存成功");
             
              window.location.href="/cptbtptp#!/industrial/"+self.id;
              
            } else {
              
              param._id = res.data._id;
             // self.$dispatch('newsList', self.param);
              alert("保存成功");
             
              window.location.href="/cptbtptp#!/industrial/"+self.id;
              
             
              
            }
           
          }
        });
      },


    },



    components: {
       markdown: require('../components/markdown.vue')
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
  .view-content{
    width: 100%;
    height: 500px
  }
  .theme-panel{
    position: relative;
  }
  .edit-container{
    position: absolute;
    width: 100%;
    min-height: 600px;
    height: 100%;
    top:0;
    left: 0;
    background: #fff;
  }
</style>
