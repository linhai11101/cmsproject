# cmsproject

## cms内容管理项目
### 后台管理服务器
```
service ----- 后台管理服务器代码
  |
  | ------ bin -----项目启动
  | ------ controllers ---- 控制器
  | ------ data ----- 数据
  | ------ logs ----- 日志
  | ------ middlewares ----- 中间件
  | ------ models ----- 模式
  | ------ public ----- 公共文件
  | ------ routes ----- 路由
  | ------ util ----- 工具
  | ------ views ----- 视图模版
```
### 后台管理页面 
```
client ------ 后台管理页面代码
  |
  | ------ cms
  |         | ------ dist ----- 打包后的文件
  |         | ------ images ----- 图片存放
  |         | ------ lib ----- 引入的外来代码库
  |
  | ------ src ---- 开发的源代码
            | ------ components ----- 组件
            | ------ directive ----- 指令
            | ------ filters ----- 过滤器
            | ------ util ----- 工具
            | ------ views ----- 视图
```
PS: `client`和`service`是两个不同的项目。通过`niginx`代理。
