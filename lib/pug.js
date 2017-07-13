const fs=require('fs')
const path=require('path')
const util=require('./util')
const config=require('../config')
const pugConfig=config.pug || {}
const pug=require('pug')

const modulePath=config.modulePath || path.resolve(__dirname,"../modules") // 模块目录

module.exports={
  // 编译组件
  async compile(name,conf){
    try{
      let confPath=path.resolve(modulePath,name,conf)
      let pugPath=path.resolve(modulePath,name,(name+'.pug'))
      let confData=await util.readFile(confPath) || '{}'
      let html=pug.compileFile(pugPath)(Object.assign({"data":JSON.parse(confData)},pugConfig))
      return html
    }catch(e){
      console.log(e)
    }
  }
}
