var Vue = require('vue');
var VueRouter = require('vue-router');

var routerMap = require('./routers');

Vue.use(VueRouter);

var router = new VueRouter({
  hashbang: true
})

$.ajaxSetup({
  cache: false,
  error : function(jqXHR, textStatus, errorThrown){
    //请求失败处理
    if(jqXHR.status === 401) {
      location.hash = '#!/login'
    }
  },
  complete: function(xhr, status) {
    var $button = document.querySelector('button[type="submit"][disabled]');
    if ($button) {
      $button.removeAttribute('disabled');
      $button.innerHTML = $button.innerHTML.replace('中...', '');
    }
  }
});


router.beforeEach(function(transition){
  //登陆中间件
  if (transition.to.path !== '/login') {
    if (localStorage.name) {
        transition.next();
    } else {
        var redirect = encodeURIComponent(transition.to.path);
        transition.redirect('/login');
        //transition.next();
    }
  } else {
    transition.next();
  }
})


//过滤器
Vue.filter('resize', require('./filters/imgResize'))
Vue.filter('ishidden', require('./filters/ishidden'))
Vue.filter('substr', require('./filters/subString'))

//指令
Vue.directive('ajaxSubmit', require('./directive/ajaxSubmit'))
Vue.directive('tip', require('./directive/tips'))

//组件
Vue.component('upload', require('./components/upload.vue'))
Vue.component('pages', require('./components/pages.vue'))
Vue.component('sideMenu', require('./components/menu.vue'))
Vue.component('selectdistrict', require('./components/selectdistrict.vue'))
Vue.component('modal', require('vue-strap').modal)



var App = Vue.extend({});

routerMap(router);

router.start(App, '#app');