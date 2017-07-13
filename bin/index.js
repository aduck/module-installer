#!/usr/bin/env node
const program=require('commander')
const mod=require('../lib/mod')
const main=require('../lib/index')

program
  .version('0.0.1')
  .command('create <name>')
  .description('生成一个module')
  .action(name=>{
    mod.init(name)
  })

program
  .command('start')
  .description('开始编译所有模板')
  .action(()=>{
    main.start()
  })

program
  .command('test <name>')
  .description('测试单个模块')
  .option('-c,--config [config]')
  .action((name,options)=>{
    main.test(name,options.config)
  })

program.parse(process.argv)