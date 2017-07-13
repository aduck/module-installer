const fs=require('fs')
const path=require('path')

module.exports={
  // 获取指定目录所有文件
  readdir(dir){
    return new Promise((resolve,reject)=>{
      fs.readdir(dir,(err,files)=>{
        if(err){
          reject(err)
          return
        }else{
          resolve(files)
        }
      })
    })
  },
  // 读取文件内容
  readFile(file){
    return new Promise((resolve,reject)=>{
      fs.readFile(file,'utf8',(err,data)=>{
        if(err){
          reject(err)
          return
        }
        resolve(data)
      })
    })
  },
  // 写文件
  writeFile(file,data){
    return new Promise((resolve,reject)=>{
      fs.writeFile(file,data,err=>{
        if(err){
          reject(err)
          return
        }
        resolve()
      })
    })
  },
  // 新建文件夹
  mkdir(dir){
    return new Promise((resolve,reject)=>{
      fs.mkdir(dir,err=>{
        if(err){
          reject(err)
          return
        }
        resolve()
      })
    })
  },
  // 清空文件夹
  emptyDir(dir){
    return new Promise((resolve,reject)=>{
      fs.readdir(dir,(err,files)=>{
        if(err){
          reject(err)
          return
        }
        resolve()
        files.forEach(file=>{
          let filePath=path.resolve(dir,file)
          unlink(filePath)
        })
      })
    })
    function unlink(file){
      let stats=fs.lstatSync(file)
      if(stats.isDirectory()){
        // 删除内部文件并删除文件夹
        let items=fs.readdirSync(file)
        if(items.length<1){
          fs.rmdirSync(file)
        }else{
          items.forEach(item=>{
            let itemPath=path.resolve(file,item)
            unlink(itemPath)
          })
          fs.rmdirSync(file)
        }
      }else{
        fs.unlinkSync(file)
      }
    }
  }
}