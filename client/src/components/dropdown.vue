<template>
  <div class="btn-group">
    <slot></slot>
    <slot name="dropdown-menu"></slot>
  </div>
</template>
<script>
  module.exports = {
    methods: {
      toggleDropdown: function(e) {
        e.preventDefault();
        this.$el.classList.toggle('open')
      }
    },
    ready: function() {
      var el = this.$el;
      el.addEventListener('click', this.toggleDropdown)
      this._closeEvent = window.addEventListener('click', function(e) {
        if (!el.contains(e.target)) el.classList.remove('open')
      })
    },
    beforeDestroy: function() {
      if (this._closeEvent) this._closeEvent.remove()
    }
  }
</script>
