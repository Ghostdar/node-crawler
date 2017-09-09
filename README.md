# Node.js 小爬虫
近日学习node.js ， 写了个简单node的爬虫，爬取segmentFault的文章内容，使用了递归和promise这两种实现方式。由于爬的次数太多，被segmentFault加入了黑名单..尴尬！！！

## 目录结构

|--node_modules<------------->依赖
|--crawler.js<--------------->异步爬虫
|--crawlerSync.js<----------->同步爬虫
|--package.json<------------->项目配置


## 主要功能

按照==页数==和==关键词==爬取 segmentFault 的文章

## 使用方法

1. 安装依赖
```
npm install
```
2. 修改参数

```
pages  //设置爬取的页数

keyword //设置爬取的关键词

```


3. 运行

```
// promise 异步
node crawler.js

// 递归 同步
node crawlerSync.js

```

## 依赖

- cherrio //页面解析
- bluebird  // promise封装库

## 运行环境

```
 node V6.10.3
```