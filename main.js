const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request= require('request');
const cheerio=require('cheerio');
const fs= require('fs');
const path = require('path');
const AllMatchObj=require('./AllMatch');
const iplPath = path.join(__dirname,"ipl");
dirCreator(iplPath);
request(url,cb);
function cb(err,response,html)
{
    if(err)
    {
        console.log(err);
    }
    else{
       extractLink(html);
    }
}
function extractLink(html)
{
    let $=cheerio.load(html);
    let anchorElem=$('.ds-block.ds-text-center.ds-uppercase.ds-text-ui-typo-primary.ds-underline-offset-4.ds-block')
    let link=anchorElem.attr('href');
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com"+link;
    AllMatchObj.gAlmatches(fullLink);

}   
function dirCreator(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath);
    }
}
