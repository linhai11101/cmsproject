module.exports = {
  bind: function() {
    var $form = this.el;
    $form.addEventListener('submit', function(){
      var $button = $form.querySelector('button[type="submit"]');
      if ($button) {
        $button.innerHTML = $button.innerHTML + '中...';
        $button.setAttribute('disabled', true);
      }
    })
  },
  unbind: function() {
    var $button = this.el.querySelector('button[type="submit"]');
    if ($button) {
      $button.innerHTML = $button.innerHTML.replace('中...', '');
      $button.removeAttribute('disabled');
    }
  }
}
