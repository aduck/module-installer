const path=require('path')

module.exports={
  entry:path.resolve(__dirname,'pages'),
  output:path.resolve(__dirname,'dest'),
  modulePath:path.resolve(__dirname,'modules'),
  sass:{
    outputStyle:'expanded'
  },
  pug:{
    pretty:true
  },
  testOutput:{
    path:path.resolve(__dirname,'test'),
    template:path.resolve(__dirname,'index.html')
  }
}