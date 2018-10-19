<template>
  <header class="main-header">
    <a href="/" class="logo">广贸cms</a>
    <nav class="navbar navbar-static-top">
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li class="dropdown notifications-menu">
            <a href="/" class="dropdown-toggle" target="_blank"> <span class="hidden-xs">预览英文首页</span></a>
          </li>          
          <li class="dropdown notifications-menu">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <span class="hidden-xs" id="adminUserName">{{name}}</span>
            </a>
          </li>
          <li class="dropdown user user-menu">
            <a href="javascript:;" class="dropdown-toggle" @click="logout">
              <span class="hidden-xs" id="adminUserName">退出</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <div class="main-sidebar">
    <div class="sidebar">
      <ul class="sidebar-menu">
        <li class="header">菜单</li>
        <li class="treeview">
          <a>内容管理</a>
          <ul class="treeview-menu" style="display:block;">
            <li v-link="{ path: '/sort', activeClass: 'active'}"><a v-link="{ path: '/sort', activeClass: 'active'}">类目管理</a></li>
            <li v-link="{ path: '/product', activeClass: 'active' }"><a v-link="{ path: '/product', activeClass: 'active' }">首页产品管理</a></li>
            <li v-link="{ path: '/ad', activeClass: 'active' }"><a v-link="{ path: '/ad', activeClass: 'active' }">广告管理</a></li>
            <li v-link="{ path: '/homeAct', activeClass: 'active' }"><a v-link="{ path: '/homeAct', activeClass: 'active' }">首页活动</a></li>
            <li v-link="{ path: '/homeFastShip', activeClass: 'active' }"><a v-link="{ path: '/homeFastShip', activeClass: 'active' }">首页快运</a></li>
            <li v-link="{ path: '/ezine/recommend', activeClass: 'active' }"><a v-link="{ path: '/ezine/recommend', activeClass: 'active' }">电子杂志</a></li>
            <li v-link="{ path: '/activity-forecast', activeClass: 'active' }"><a v-link="{ path: '/activity-forecast', activeClass: 'active' }">活动预告</a></li>
          </ul>
        </li>
        <li class="treeview">
          <a>产业集群</a>
          <ul class="treeview-menu" style="display:block;">
           <li v-link="{ path: '/industrial', activeClass: 'active' }"><a v-link="{ path: '/industrial', activeClass: 'active' }">产业集群管理</a></li>
           <li v-link="{ path: '/market', activeClass: 'active' }"><a v-link="{ path: '/market', activeClass: 'active' }">批发中心管理</a></li>
           <li v-link="{ path: '/fairactive', activeClass: 'active' }"><a v-link="{ path: '/fairactive', activeClass: 'active' }">展贸活动管理</a></li>
         </ul>
       </li>
       <li class="treeview">
        <a>促销管理</a>
        <ul class="treeview-menu" style="display:block;">
          <li v-link="{ path: '/specialIndex', activeClass: 'active'}"><a v-link="{ path: '/specialIndex'}">促销首页</a></li>
          <li v-link="{ path: '/special', activeClass: 'active'}"><a v-link="{ path: '/special'}">促销管理</a></li>
        </ul>
      </li>
      <li class="treeview">
        <a>创新设计产品管理</a>
        <ul class="treeview-menu" style="display:block;">
          <li v-link="{ path: '/innovativeBanner', activeClass: 'active'}"><a v-link="{ path: '/innovativeBanner'}">banner</a></li>
          <li v-link="{ path: '/innovativeIndex', activeClass: 'active'}"><a v-link="{ path: '/innovativeIndex'}">频道页</a></li>
        </ul>
      </li>
      <li class="treeview">
        <a>快速航运管理</a>
        <ul class="treeview-menu" style="display:block;">
          <li v-link="{ path: '/fastshippingindex', activeClass: 'active'}"><a v-link="{ path: '/fastshippingindex'}">FAST SHIPPING 首页</a></li>
          <li v-link="{ path: '/fastshippingcate', activeClass: 'active'}"><a v-link="{ path: '/fastshippingcate'}">FAST SHIPPING 类目</a></li>
          <li v-link="{ path: '/fastshippingchannel', activeClass: 'active'}"><a v-link="{ path: '/fastshippingchannel'}">FAST SHIPPING 子频道</a></li>
        </ul>
      </li>
      <li class="treeview">
        <a>系统管理</a>
        <ul class="treeview-menu" style="display:block;">
          <li v-link="{ path: '/user', activeClass: 'active'}"><a v-link="{ path: '/user'}">用户管理</a></li>
          <li v-link="{ path: '/views', activeClass: 'active'}"><a v-link="{ path: '/views'}">视图管理</a></li>
        </ul>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        name: localStorage.name
      }
    },
    methods: {
      logout: function() {

        localStorage.removeItem('name');
        $.ajax({
          url: domain + '/logout',
          type: 'POST',
          data: {name: localStorage.name},
        });

        this.$route.router.go('/login');
      }
    }
  }

</script>
