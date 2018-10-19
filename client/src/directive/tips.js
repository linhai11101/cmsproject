module.exports = {
  bind: function () {
    var text = this.expression;
    var $el = this.el;
    var placement = this.arg || 'bottom';
    var id = $el.getAttribute('id') ? 'tips-' + $el.getAttribute('id')
              : 'tips-' + Math.floor(Math.random() * 1000000);
    //var $elTips =
    //if (document.getElementById(id))
    var $tips = document.createElement('div');
    $tips.id = id;
    $tips.className = 'tooltip ' + placement;
    //$tips.style.display = 'none';
    $tips.innerHTML ='<div class="tooltip-arrow"></div><div class="tooltip-inner">' + text + '</div>';

    $el.addEventListener('mouseover', function(){
      if (document.getElementById(id)) {
        document.getElementById(id).style.display = 'block';
      } else {
        document.querySelector('body').appendChild($tips);
        document.getElementById(id).style.top = $el.offsetHeight +  $el.getBoundingClientRect().top + 'px';
        document.getElementById(id).style.left = $el.getBoundingClientRect().left + 'px';
      }

    });
    $el.addEventListener('mouseout', function(){
      document.getElementById(id).style.display = 'none';
    })
  },
  //这个有问题
  // unbind: function () {
  //   this.el.removeEventListener('mouseover');
  //   this.el.removeEventListener('mouseout');
  // }
}
