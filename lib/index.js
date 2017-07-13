/*
* 目的：将page.tmpl编译成page.html
* 1. 读取tmpl文件获取需要加载的module
* 2. 根据config属性。编译module并加载
* 3. 将module的css/js文件同步添加到tmpl文件中
* 4. 生成html文件
*/
const cheerio=require('cheerio')
const path=require('path')
const fs=require('fs')
const util=require('./util')
const pug=require('./pug')
const sass=require('./sass')
const mod=require('./mod')
const config=require('../config')
const tmplPath=config.entry
const cssPath=path.resolve(config.output,'css')
const jsPath=path.resolve(config.output,'js')

// 读取所有模板文件并编译
async function start(){
  // 没有out目录就新建
  if(!fs.existsSync(config.output)){
    fs.mkdirSync(config.output)
  }
  // 没有css目录就新建
  if(!fs.existsSync(cssPath)){
    fs.mkdirSync(cssPath)
  }
  // 没有js目录就新建
  if(!fs.existsSync(jsPath)){
    fs.mkdirSync(jsPath)
  }
  let tmpls=await util.readdir(tmplPath)
  tmpls.forEach(tmpl=>{
    let name=path.basename(tmpl,'.tmpl')
    let ext=path.extname(tmpl)
    if(ext=='.tmpl'){
      compile(path.resolve(tmplPath,tmpl),name)
    }
  })
}

async function compile(tmpl,name){
  try{
    let modulePath=mod.path
    let tmplData=await util.readFile(tmpl)
    let $=cheerio.load(tmplData,{decodeEntities:false})
    let $mods=$('module')
    const loaded=[]
    for(let i=0,len=$mods.length;i<len;i++){
      let $mod=$($mods[i])
      let modName=$mod.attr('id')
      let modConfig=$mod.attr('config')
      // 编译pug并替换模板
      let html=await compilePug(modName,modConfig)
      $mod.replaceWith($(html))
      // 如果已经加载过一次就不会再添加css.js等文件
      if(loaded.indexOf(modName)==-1){
        loaded.push(modName)
        // 编译scss并添加css
        let css
        if(config.sass){
          css=await compileSass(path.resolve(modulePath,modName,(modName+'.scss')))
        }else{
          css=await util.readFile(path.resolve(modulePath,modName,(modName+'.css')))
        }
        await util.writeFile(path.resolve(cssPath,`${modName}.css`),css)
        $('head').append($(`<link rel="stylesheet" href="css/${modName}.css">`))
        // 添加js文件
        let js=await util.readFile(path.resolve(modulePath,modName,(modName+'.js')))
        await util.writeFile(path.resolve(jsPath,`${modName}.js`),js)
        $('body').append($(`<script src="js/${modName}.js"></script>`))
      }
      loaded.push(modName)
    }
    // 编译模板
    await util.writeFile(path.resolve(config.output,`${name}.html`),$.html())
    console.log(`模板文件${name}编译完成`)
  }catch(e){
    console.log(e)
  }
}

// 编译pug
async function compilePug(name,config){
  try{
    let html=await pug.compile(name,config)
    return html
  }catch(e){
    console.log(e)
  }
}

// 编译sass
async function compileSass(path){
  try{
    let result=await sass(path,config.sass)
    return result.css.toString()
  }catch(e){
    console.log(e)
  }
}

// 测试模块
async function test(modName,modConfig){
  try{
    let testOutput=config.testOutput.path || path.resolve(__dirname,'../test')
    let template=config.testOutput.template || ''
    let modulePath=mod.path
    // 创建test输出目录
    if(!fs.existsSync(testOutput)){
      fs.mkdirSync(testOutput)
    }
    // 如果文件夹存在文件需要清空
    await util.emptyDir(testOutput)
    // 生成css目录
    if(!fs.existsSync(testOutput+'/css')){
      fs.mkdirSync(testOutput+'/css')
    }
    // 生成js目录
    if(!fs.existsSync(testOutput+'/js')){
      fs.mkdirSync(testOutput+'/js')
    }
    if(!modConfig) modConfig=`${modName}.json`

    // 导入模板
    let tmpl
    if(template){
      tmpl=await util.readFile(template)
    }else{
      tmpl='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>test</title></head><body></body></html>'
    }

    let $=cheerio.load(tmpl,{decodeEntities:false})
    // 替换模板
    $("body").append($(await compilePug(modName,modConfig)))
    // 编译添加css
    let css
    if(config.sass){
      css=await compileSass(path.resolve(modulePath,modName,(modName+'.scss')))
    }else{
      css=await util.readFile(path.resolve(modulePath,modName,(modName+'.css')))
    }
    await util.writeFile(path.resolve(testOutput,`css/${modName}.css`),css)
    $('head').append($(`<link rel="stylesheet" href="css/${modName}.css">`))
    // 添加js
    let js=await util.readFile(path.resolve(modulePath,modName,(modName+'.js')))
    await util.writeFile(path.resolve(testOutput,`js/${modName}.js`),js)
    $('body').append($(`<script src="js/${modName}.js"></script>`))
    // 生成测试文件
    await util.writeFile(path.resolve(testOutput,'test.html'),$.html())
    console.log('测试文件已生成')
  }catch(e){
    console.log(e)
  }
}

module.exports={
  start,
  test
}