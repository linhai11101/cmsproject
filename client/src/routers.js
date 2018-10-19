module.exports = function(router) {
  router.map({
    '/': {
      component: function(resolve) {
        require(['./views/home.vue'], resolve);
      }
    },
    //404
    '*': {
      component: function(resolve) {
        console.log(resolve + 'config');
        require(['./views/home.vue'], resolve)
      }
    },
    'login': {
      component: function(resolve) {
        require(['./views/login.vue'], resolve)
      }
    },
    //类目管理
    'sort': {
      component: function(resolve) {
        require(['./views/sort.vue'], resolve)
      }
    },
    //广告管理
    'ad': {
      component: function(resolve) {
        require(['./views/ad.vue'], resolve)
      }
    },
     //广告管理
    'homeAct': {
      component: function(resolve) {
        require(['./views/homeAct.vue'], resolve)
      }
    },

     //快速航运
    'homeFastShip': {
      component: function(resolve) {
        require(['./views/homeFastShip.vue'], resolve)
      }
    },

    'shops': {
      component: function(resolve) {
        require(['./views/shops.vue'], resolve)
      }
    },
    //产品
    'product': {
      component: function(resolve) {
        require(['./views/product.vue'], resolve)
      }
    },
    //导航
    'nav': {
      component: function(resolve) {
        require(['./views/nav.vue'], resolve)
      }
    },
    //首页
    'home': {
      component: function(resolve) {
        require(['./views/home.vue'], resolve)
      }
    },
    //广货基地
    'industrial': {
      component: function(resolve) {
        require(['./views/industrial.vue'], resolve)
      }
    },
    'industrial/:id': {
      component: function(resolve) {
        require(['./views/industrialContent.vue'], resolve)
      }
    },
    'fairactive': {
      component: function(resolve) {
        require(['./views/fair-active.vue'], resolve)
      }
    },

    'indAddarticle/:id': {
      component: function(resolve) {
        require(['./views/indAddarticle.vue'], resolve)
      }
    },

    'indAddarticle/:id/:newsId': {
      component: function(resolve) {
        require(['./views/indAddarticle.vue'], resolve)
      }
    },
    // 专业市场
    'market':{
      component:function(resolve){
        require(['./views/market.vue'],resolve)
      }
    },
    'market/:id': {
      component: function(resolve) {
        require(['./views/marketContent.vue'], resolve)
      }
    },
    //样品中心
    'sample': {
      component: function(resolve) {
        require(['./views/sample.vue'], resolve)
      }
    },
    //招商加盟
    'join': {
      component: function(resolve) {
        require(['./views/nav.vue'], resolve)
      }
    },
    //招商加盟
    'user': {
      component: function(resolve) {
        require(['./views/user.vue'], resolve)
      }
    },
    'views': {
      component: function(resolve) {
        require(['./views/views.vue'], resolve)
      }
    },
    'specialIndex': {
      component: function(resolve) {
        require(['./views/specialIndex.vue'], resolve)
      }
    },
    'special': {
      component: function(resolve) {
        require(['./views/special.vue'], resolve)
      }
    },
     'innovativeBanner': {
      component: function(resolve) {
        require(['./views/innovativeBanner.vue'], resolve)
      }
    },
    'innovativeIndex': {
      component: function(resolve) {
        require(['./views/innovativeIndex.vue'], resolve)
      }
    },
     'innovativeProduct/:name': {
      component: function(resolve) {
        require(['./views/innovativeProduct.vue'], resolve)
      }
    },
    // fastshipping
    'fastshippingindex':{
      component:function(resolve){
        require(['./views/fastshippingindex.vue'],resolve)
      }
    },
    'fastshippingcate':{
      component:function(resolve){
        require(['./views/fastshippingcate.vue'],resolve)
      }
    },
    'fastshippingchannel':{
      component:function(resolve){
        require(['./views/fastshippingchannel.vue'],resolve)
      }
    },
    'ezine/:type':{
      component:function(resolve){
        require(['./views/e-zine.vue'],resolve)
      }
    },
    'activity-forecast':{
      component:function(resolve){
        require(['./views/activity-forecast.vue'],resolve)
      }
    },
    'activity-forecast/:id':{
      component:function(resolve){
        require(['./views/activity-forecast-content.vue'],resolve)
      }
    }
    // ,
    // 'config': {
    //   component: function(resolve) {
    //     console.log(resolve + 'config');
    //     require(['./views/config.vue'], resolve)
    //   }
    // }
  })
}
