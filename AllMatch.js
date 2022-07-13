const request = require("request");
const cheerio = require("cheerio");
const scorecardObj=require('./scorecard')
function getAllMatchesLink(url)
{
    request(url,function(err,response, html){
        if(err)
        {
            console.log(err);
        }
        else{
            extractAllLink(html);
        }

    })
}
function extractAllLink(html)
{
    let $=cheerio.load(html);
    let scorecardElem=$('.ds-px-4.ds-py-3>a');
    console.log(scorecardElem.length);
    
    for(let i=0;i<scorecardElem.length;i++)
    {
       let link = $(scorecardElem[i]).attr('href') ;
       
       let fullLink2="https://www.espncricinfo.com"+link; 
       scorecardObj.ps(fullLink2);
    }

}
module.exports = {
    gAlmatches:getAllMatchesLink
}