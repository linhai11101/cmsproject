<template>
  <div class="autoComplete">
    <input type="text" class="form-control"
      v-model="keyword"
      @keyup="keyup($event)"
      @focus="getRemoteData()"
      autoComplete="false">
    <ul class="dropdown-menu" v-show="toggles">
      <li
        v-for="item in items"
        @click="click($index)"
        :class="{active: currentCandidate == $index}">
        <a href="javascript:;">{{ item.nameCn }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
module.exports = {
  props: {
    url: {
      type: String,
      default: '/specialTown/searchTown.cf'
    },
    items: {
      type: Array
    }
  },
  data: function() {
    return {
      keyword: '',
      currentCandidate: 0,
      toggles: false
    }
  },
  ready: function() {
    var self = this;
    var el = this.$el;
    this._closeEvent = window.addEventListener('click', function(e) {
      if (!el.contains(e.target)) {
        self.toggles = false;
      }
    })
  },
  methods: {
    keyup: function(e) {
      //if(this.keyword.length < 1) return;

      //var keyword = encodeURIComponent(this.keyword).replace(/\%/g, '%25')
       //               .replace(/\-/g, '%2D').replace(/\//g, '%2F')
      switch (e.keyCode) {
        //up 上
        case 38:
          return this.moveCandidate(1)
          break;
        //down 下
        case 40:
          return this.moveCandidate(-1)
          break;
        //enter
        case 13:
          return this.ok()
          break;
      }

      this.getRemoteData();
    },
    click: function(index) {
      this.currentCandidate = index;
      this.ok()
    },
    getRemoteData: function() {
      var self = this;
      $.ajax({

        url: domainCrm + this.url,
        data: {keyword: this.keyword}
      })
      .done(function(res) {
        if (res.code == 0 && res.data) {
          self.items = res.data
          self.currentCandidate = 0;
          self.toggles = true
        }
      });
    },

    moveCandidate: function(sign, target) {
      if (!this.items.length) return;

      if (sign == 1) {
        this.currentCandidate = (this.currentCandidate == 0) ?
                                this.items.length - 1: this.currentCandidate - 1;
      } else {
        this.currentCandidate = (this.currentCandidate == this.items.length-1) ?
                                0 : this.currentCandidate + 1;
      }
      this.keyword = this.items[this.currentCandidate].nameCn;
    },
    ok: function() {
      this.toggles = false;
      this.$dispatch('auto-complete', JSON.parse(JSON.stringify(this.items[this.currentCandidate])))
    }
  },
  beforeDestory: function() {
    if(this._closeEvent) this._closeEvent.remove()
  }

}
</script>
<style>
  .autoComplete{
    position: relative;
  }
  .autoComplete .dropdown-menu{
    display: block;
    width: 100%;
  }
</style>
