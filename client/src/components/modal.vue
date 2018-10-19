<!-- 弹窗 -->
<template>
  <div class="modal" v-show="show" transition="modal">
    <div class="modal-dialog" :class="{'modal-lg':large,'modal-sm':small}">
      <div class="modal-content">
        <slot name="header">
          <div class="modal-header">
            <button type="button" class="close" @click="show=false"><span>&times;</span></button>
            <h4 class="modal-title" >
              <slot name="title">
                {{title}}
              </slot>
            </h4>
          </div>
        </slot>
        <slot class="body">
          <div class="modal-body"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  props: {
    title: {
      type: String,
      default: '信息'
    },
    show: {
      type: Boolean,
      required:true,
      twoWay: true
    },
    width: {
      default: null
    },
    large: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  }
}

</script>

<style>
<style>
.modal {
  transition: all 0.3s ease;
}
.modal.in {
  background-color: rgba(0,0,0,0.5);
}
.modal.zoom .modal-dialog {
    -webkit-transform: scale(0.1);
    -moz-transform: scale(0.1);
    -ms-transform: scale(0.1);
    transform: scale(0.1);
    top: 300px;
    opacity: 0;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
}
.modal.zoom.in .modal-dialog {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
    -webkit-transform: translate3d(0, -300px, 0);
    transform: translate3d(0, -300px, 0);
    opacity: 1;
}
</style>
</style>
