const fs=require('fs')
const path=require('path')
const util=require('./util')
const config=require('../config')
const sass=typeof config.sass!='undefined' ? config.sass : false

module.exports={
  path:config.modulePath || path.resolve(__dirname,'../modules'),
  // 创建组件
  init(name){
    let self=this
    let dir=path.resolve(self.path,name)
    fs.mkdir(dir,e=>{
      if(e){
        throw e
        return
      }
      fs.openSync(path.resolve(dir,(name+'.pug')),'w')
      fs.openSync(path.resolve(dir,(name+'.json')),'w')
      fs.openSync(path.resolve(dir,(name+'.js')),'w')
      sass ? fs.openSync(path.resolve(dir,(name+'.scss')),'w') : fs.openSync(path.resolve(dir,(name+'.css')),'w')
      console.log(`组件${name}创建成功`)
    })
  }
}