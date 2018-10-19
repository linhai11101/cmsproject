<template>
  <div class="uploadBox" :id="id"> {{{ text }}} </div>
  <p class="tips" v-html="tips"></p>
  <input type="text" class="form-control" v-model="img" placeholder="本地开发，放图片地址的。" readonly="isreadonly">
  <div class="row" v-if="showimg != 'false'">
    <div v-if="imgs && imgs.length" class="col-xs-4 col-md-3" v-for="item in imgs">
      <div class="thumbnail">
        <a :href="item | resize 'origin'" target="_blank">
          <img :src="item | resize ">
        </a>
        <span class="glyphicon glyphicon-remove" @click="remove($index)"></span>
      </div>
    </div>
    <div class="col-xs-4 col-md-3" v-if="progress > 0">
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%'}">
          {{progress}}%
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  var webupload = require('../util/webupload/webuploader');
  module.exports = {
    props: {
      id: {
        required: true
      },
      text: {
        type: String,
        default: '上传'
      },
      img: {
        type: String,
        twoWay: true
      },
      accept: {
        type: String,
        default: ''
      },
      sizeLimit: {
        type: String,
        default: 5
      },
      limit: {
        type: Number,
        default: 1,
        coerce: function(val) {
          return ~~val;
        }
      },
      showimg: {
        type: String,
        default: 'true'
      },
      // 2017-04-06
      tips:{
        type:String,
        default:''
      }
    },
    data: function() {
      return {
        uploader: null,
        imgs: [],
        files: [],
        progress: 0
      }
    },
    watch: {
      'imgs.length': function(a, b) {
        this.img = this.imgs.join(',');
      },
      img: function(a, b) {
        if (a) {
          this.imgs = a.split(',');
        } else {
          this.imgs = [];
        }
      }
    },
    methods: {
      remove: function(index) {
        this.imgs.splice(index, 1);
      }
    },
    ready: function() {
      var self = this;
      this.uploader = webupload.create({
        auto: true,
        server: domain_path + '/file/uploadSingleFile.do?fieldName=file', 
        pick: '#'+ this.id,
        sizeLimit: this.sizeLimit * 1024,
         // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,png,jpeg',
            mimeTypes: 'image/gif,image/jpeg,image/jpg,image/png'

          },

        // accept: {
        //   extensions: this.accept
        // },
        //去重
        duplicate: true
      });
      this.uploader.on('uploadSuccess', function(file, res) {
        if ( 0 == res.code) {
          self.imgs.push(res.data.url);
        }
        self.progress = 0;
      })
      .on('uploadProgress', function(file, prog) {
        console.log('progress:', prog)
        self.progress = Math.floor(prog * 100);
      })
      .on('uploadError', function(file, reason) {
        alert('上传失败，请重试');
        self.progress = 0;
      })
      .on('beforeFileQueued', function(file) {
        if (self.imgs.length >= self.limit) {
          alert('最多只能上传' + self.limit + '个');
          return false;
        }
        //files.push(file);
      })
      .on('error', function(handler) {
        if (handler == "F_EXCEED_SIZE") {
          alert("上传文件过大,请上传3M以下的图片");
        }
        if (handler == "Q_TYPE_DENIED") {
          alert("请重新选择图片,上传图片要求格式：Jpg,Gif,or Png");
        }
      })

    },
    beforeDestroy: function() {
      //console.log('会不会触发呢？');
      this.uploader.destroy()
    }
  }
</script>
<style>
/*.progress{
  margin-bottom: 0;
  position: absolute;
  width: 100%;
  left: 0px;
  bottom: 0;
  opacity: 0.5;
}*/
.thumbnail{
  position: relative;
}
.thumbnail .glyphicon{
  display: none;
  position: absolute;
  right: -5px;
  top:-5px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #aaa;
  color:#fff;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}
.thumbnail:hover .glyphicon{
  display: block
}

.webuploader-container {
  position: relative;
  display: inline-block;
}
.webuploader-element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px,1px,1px,1px);
}
.webuploader-pick {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: #00b7ee;
  padding: 10px 15px;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
}
.webuploader-pick + div{
  width: 100% !important;
  height: 100% !important;
}
.webuploader-pick-hover {
  background: #00a2d4;
}

.webuploader-pick-disable {
  opacity: 0.6;
  pointer-events:none;
}
/*2017-04-06*/
.tips{
  position: absolute;
  top: 0px;
  left: 30%;
  margin: 0px;
}
.uploadBox{
  position: relative;
}
</style>
 