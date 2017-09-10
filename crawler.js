var http = require("https");

var Promise = require("bluebird");

var cheerio  = require("cheerio");

var querystring = require("querystring");

var fs = require('fs');


// 声明 爬取的关键字 ， 暂不支持数组。
var keyWord = "小程序"

// 声明 爬取的页数
var page = 2;

// 声明搜索url
var baseUrl = "https://segmentfault.com/search?q="+querystring.escape(keyWord)+"&type=article&page=";

// 声明 文章详细内容baseurl
var articleBaseUrl= "https://segmentfault.com/a/"

// 声明 页面promise对象存储数组
var contentArray = [];

// 声明 文章id存储数组
var articleIds=[];

var Data = [];

// 统计文件数量
var n = 0; 

//声明 存储文件路径
var filePath="./"+keyWord+"/";

// 判断文件夹是否存在，不存在则创建
fs.exists(filePath, (exists) => {
    if(!exists){
        fs.mkdir(filePath);
    }
  });

// 爬取内容页面
function getHtml(url){
    return new Promise(function(resolve,reject){
        http.get(url,function(res){
            console.log("正在爬取:"+url);
            var html = '';
            res.on("data",function(data){
                html+=data;
            });
            res.on("end",function(){
                Data.push(html)
                resolve(html);
            });
        }).on("error",function(e){
            reject(e);
            console.log("爬取出错");
        });
    });
}
//爬取文章内容页面
function getArticleHtml(url){
    return new Promise(function(resolve,reject){
        http.get(url,function(res){
            console.log("正在爬取:"+url);
            var html = '';
            res.on("data",function(data){
                html+=data;
            });
            res.on("end",function(){
                resolve(html);
            });
        }).on("error",function(e){
            reject(e);
            console.log("爬取出错");
        });
    });
}

// 获取文章IDS
function getArticleId(html){
    var ids=[];
    var $ = cheerio.load(html)
    var data = []
    $(".widget-blog").find("a").each(function(index,ele){
        data.push(ele.attribs.href.split("/a/")[1])
    })
    return data
}

// 获取文章内容，并保存
function getArticle(html){
    var ids=[];
    var $ = cheerio.load(html,{decodeEntities: false})
    var fileTitle = $("#articleTitle a").text();
    var content = $(".article__content").html();
    fs.writeFile(filePath+fileTitle+".md",content,function(){
       console.log(fileTitle+"文件创建成功")
    })
}
for(var i = 1 ; i<page+1;i++){
    getHtml(baseUrl+i).then(function(pages){
        articleIds=getArticleId(pages)
        articleIds.map(function(item,index){
            n++;
            console.log("第"+n+"个文件正在创建")
            getArticleHtml(articleBaseUrl+item).then(function(data){
                getArticle(data)
            }).catch(function(e){
                console.log(e)
            })
        })
    }).catch(function(e){
        console.log(e)
    })
}




