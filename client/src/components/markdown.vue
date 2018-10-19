<template>
<div>
  <div class="md-tools">
    <upload :id="'pick-' + id" text="<span class='glyphicon glyphicon-paperclip'></span> 插入图片" :img.sync="img" showimg="false"></upload>
    <div class="tools-btn">
      <a href="javascript:;" class="btn-mk" @click.stop="toggleLink();">
        <span class="glyphicon glyphicon-link"></span> 插入链接
      </a>
      <div class="btn-mk-wrap btn-link-wrap" v-show="linkWrap">
        <form action="" class="form-inline" @submit.prevent="addLink">
          <div class="form-group">
            <input type="url" v-model="link" class="length-lg form-control" placeholder="请输入正确的链接" required>
          </div>
          <button type="submit" class="btn btn-default">添加</button>
        </form>
      </div>
    </div>
  </div>
  <div class="md-container clearfix">
    <div class="col-md-6 md-textarea" :style="{height:height}">
      <textarea class="textarea-mk" v-model="input" debounce="300"></textarea>
    </div>
    <div class="col-md-6 md-html" :style="{height:height}">
      <div v-html="input | marked"></div>
      <span class="glyphicon glyphicon-fullscreen" @click="full"> </span>
    </div>
  </div>
  <a href="http://www.jianshu.com/p/1e402922ee32" target="_blank">markdown写法介绍</a>
</div>
</template>
<script>
  var marked = require('marked');
  module.exports = {
    props: {
      input: {
        type: String,
        twoWay: true,
        default: '# 广贸网'
      },
      height: {
        type: String,
        default: '500px'
      },
      id: {
        type: String,
        default: 'markdown'
      }
    },
    ready: function() {
      var self = this;
      var el = this.$el.querySelector('.btn-link-wrap');
      this._closeEvent = window.addEventListener('click', function(e) {
        if (!el.contains(e.target)) {
          self.linkWrap = false;
        }
      })
    },
    data: function() {
      return {
        img: '',
        linkWrap: false,
        link: ''
      }
    },
    methods: {
      addLink: function() {
        var obj = this.$el.querySelector('.textarea-mk');
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            tmpStr = this.input;
        this.input = tmpStr.substring(0, startPos) + '[' + tmpStr.substring(startPos, endPos) + ']('+ this.link +')' + tmpStr.substring(endPos, tmpStr.length);

        obj.selectionStart = obj.selectionEnd = startPos;

        this.linkWrap = false;
      },
      insertText: function(obj, str) {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            tmpStr = obj.value;
        this.input = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        startPos += str.length;
        obj.selectionStart = obj.selectionEnd = startPos;
      },
      toggleLink: function(e) {
        this.linkWrap = !this.linkWrap;
        this.link = '';
      },
      full: function() {
        var oldClass = this.$el.querySelector('.md-html').className;
        var fullClass = 'md-html-full'
        if (/md-html-full/.test(oldClass)) {
          this.$el.querySelector('.md-html').className = oldClass.replace(/(\s)*md-html-full(\s)*/, '')
        } else {
          this.$el.querySelector('.md-html').className = oldClass + ' md-html-full';
        }
      }
    },
    watch: {
      img: function(val) {
        console.log(1, val)
        if (val) {
          var mdImg = '\n![]('+ imgHost + val +')\n'
          this.insertText(this.$el.querySelector('.textarea-mk'), mdImg);
          this.img = null;
        }
      }
    },
    filters: {
      marked: marked
    },
    beforeDestory: function() {
      if (this._closeEvent) this._closeEvent.remove()
    }
  }
</script>
<style>
.md-container > div {
  padding: 5px;
}
.md-container textarea{
  border: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  outline: 0;
  resize:none
}
.md-container{
  border: 1px solid #ddd;
}
.md-textarea{
  border-right: 1px solid #ddd;
}
.tools-btn{
  position: relative;
  display: inline-block;
}
.btn-mk{
    position: relative;
    padding: 4px 5px;
    background: #eee;
    border: 1px solid #ccc;
    color: #333;
    font-size: 12px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    border-radius: 3px;
    top:-9px;
}
.btn-mk-wrap{
  position: absolute;
  display: block;
  border:1px solid #eee;
  box-shadow: 0 5px 5px rgba(0,0,0,.2);
  background: #fff;
  padding:8px;
  top:30px;
  left: 0;
  z-index: 9;
  width: 330px;
}
.length-lg{
  width: 250px !important;
}
.md-html{
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  background: #fff;
}
.md-html .glyphicon{
  position: absolute;
  top:10px;
  right: 10px;
  display: none;
  cursor: pointer;
}
.md-html:hover .glyphicon{
  display: block;
}
.md-html-full{
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 100% !important;
  z-index: 9999;
}
.md-tools{}
.md-tools .webuploader-pick{
  padding: 4px 5px;
  background: #eee;
  border:1px solid #ccc;
  color:#333;
  font-size: 12px;
}
</style>
