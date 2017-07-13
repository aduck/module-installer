const sass=require('node-sass')

module.exports=function(path,opts){
  var opts=opts || {}
  return new Promise((resolve,reject)=>{
    sass.render(Object.assign({
      file:path,
      outputStyle:'compressed'
    },opts),(e,result)=>{
      if(e){
        reject(e)
        return
      }
      resolve(result)
    })
  })
}