# middlewares
常用的中间件


##dev
开发时常用的中间件
* api.js，基于bee的自动转发请求到后端api并返回结果（类似代理）
* autoTpl.js 自动将某目录（通常为views）中的模板映射会url路径并按照模板 express中定义的模板引擎进行渲染（无数据，方便开发静态网页）
* liveless.js 自动根据url路径编译less文件，或者与css同名的less文件并输出内容。
* static.js 提供静态资源访问
* webpack.js 就是 webpack-dev-middleware 的使用