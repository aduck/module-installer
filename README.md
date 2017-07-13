# module-installer

### git clone
  ```bash
  $ git clone https://github.com/aduck/module-installer
  $ cd module-installer
  ```

### npm link
  ```bash
  $ npm install
  $ npm link
  ```

### mi
  ```
  $ mi --help
    Usage: index [options] [command]


    Options:

      -V, --version  output the version number
      -h, --help     output usage information


    Commands:

      create <name>          生成一个module
      start                  开始编译所有模板
      test [options] <name>  测试单个模块

  ```

### config
  ```js
  const path=require('path')
  module.exports={
    // tmpl模板目录
    entry:path.resolve(__dirname,'pages'), 
    // 编译完成的html/css/js输出目录
    output:path.resolve(__dirname,'dest'),
    // 模块存放的目录
    modulePath:path.resolve(__dirname,'modules'),
    // sass配置
    sass:{
      outputStyle:'expanded'
    },
    // pug传值
    pug:{
      pretty:true
    },
    // 测试输出目录及模板文件
    testOutput:{
      path:path.resolve(__dirname,'test'),
      template:path.resolve(__dirname,'index.html')
    }
  };
  ```

