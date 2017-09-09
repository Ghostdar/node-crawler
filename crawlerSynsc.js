var http = require("https");

var cheerio  = require("cheerio");

var fs = require("fs");

var querystring = require("querystring");

// 声明爬取页数
var page = 2 ;

var keyWord = "小程序"

// 声明搜索url
var baseUrl = "https://segmentfault.com/search?q="+querystring.escape(keyWord)+"&type=article&page=";

// 声明文章内容url
var articleBaseUrl= "https://segmentfault.com/a/"

// 声明 存储文章ID数组
var articleIds=[];

//声明 存储搜索内容数组
var Data = [];

//声明 存储文件路径
var filePath="./"+keyWord+"/";

// 判断文件夹是否存在，不存在则创建
fs.exists(filePath, (exists) => {
    if(!exists){
        fs.mkdir(filePath);
    }
  });

// 获取搜索内容html
function getSearch(url,i){
        http.get(url+i,function(res){
            console.log("正在爬取:"+url+i);
            var html = '';
            res.on("data",function(data){
                html+=data;
            });
            res.on("end",function(){
                Data=Data.concat(getArticleId(html))
                if(i<page){
                    getSearch(url,++i)
                }else{
                    getArticles(Data,1)
                    //console.log(Data.length)
                }
            });
        }).on("error",function(e){
            console.log(e)
        });
}

// 获取文章Id
function getArticleId(html){
    var ids=[];
    var $ = cheerio.load(html)
    var data = []
    $(".widget-blog").find("a").each(function(index,ele){
        data.push(ele.attribs.href.split("/a/")[1])
    })
    return data
}

// 获取文章html
function getArticles(urls,n){
    http.get(articleBaseUrl+urls[n-1],function(res){
        console.log("正在爬取:"+articleBaseUrl+urls[n-1]);
        var html = '';
        res.on("data",function(data){
            html+=data;
        });
        res.on("end",function(){
            getArticle(html)
            if(n<urls.length){
                getArticles(urls,++n)
            }else{
                console.log("获取:"+n+"篇文章")
            }
        });
    }).on("error",function(e){
        console.log(e)
    });
}

// 获取文章内容
function getArticle(html){
    var ids=[];
    var $ = cheerio.load(html,{decodeEntities: false})
    var fileTitle = $("#articleTitle a ").text();
    var content = $(".article__content").html();
    fs.writeFile(filePath+fileTitle+".md",content,function(){
       console.log(fileTitle+"文件创建成功")
    })
}

//主函数
function main(){
    getSearch(baseUrl,1);
    //getArticle(urls ,1);
}

main();