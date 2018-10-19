/**
 * 配置
 */

module.exports = {
  title: 'mr-world.com',
  description: 'China Manufacturers, China Suppliers, China Exporters; Combining with the professional town and professional market on Mr-World.com',
  keywords: 'China Manufacturers, China Suppliers, China Exporters; Combining with the professional town and professional market on Mr-World.com',

  //
  site_headers: [
    '<meta name="auto" content="crab1127@gmail.com"/>'
  ],
  site_logo: '/static/index/images/logo.png',
  site_logo_icon: '/static/IndustrialCluster/images/industrial_cluster_logo1.png',
  site_icon: '',
  site_navs: [
    //格式 [path title [target]]
    ['/', '首页'],
    ['/industrial', '专业镇'],
    ['/market', '专业市场'],
    ['/sample', '样品中心'],
    ['http://club.mr-world.com', '招商加盟']
  ],

  host: '',
  //网站静态资源路径
  // assets_path: 'http://static.sit-world.com',
  assets_path:'http://www.cmsstatic-world.com',
  //网站根路径
  domain_path: 'http://www.sit-world.com',
  img_host: 'http://img.mrworld.com',
  loginDomain:"http://login.sit-world.com",
  domain_cms: 'http://zh.sit-world.com:81',
  //后端api接口
  java_api_host: 'http://crm.sit-world.com',
  // java_api_host: 'http://192.168.1.14:21200',
  
  //mongodb数据库配置
  URL: 'mongodb://mongo.mrworld.com/cms-world2',
  DB: 'cms-world2',

  //redis
  redis_host: 'redis.mrworld.com',
  redis_port: 6379,
  redis_db: 1,

  //程序运行端口
  port: 3001,

  //文件上传配置
  upload: {
    path: '',
    url: ''
  }
};
