//const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request= require('request');
const cheerio=require('cheerio');
const path=require('path');
const fs = require('fs');
const xlsx = require('xlsx');
function processScoreCard(url)
{
    request(url,cb);
}

function cb(err,response,html)
{
    if(err)
    {
        console.log(err);
    }
    else{
       extractMatchDetail(html);
    }
}
function extractMatchDetail(html)
{
    let $=cheerio.load(html);
    let description = $('.ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid');
    let result = $('.ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title>span');
    let stringArr=description.text().split(',');
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result= result.text();
    let innings = $('.ds-bg-fill-content-prime.ds-rounded-lg');
   
    for(let i=0;i<innings.length;i++)
    {
      let teamName = $(innings[i]).find('.ds-text-tight-s.ds-font-bold.ds-uppercase').text();
      teamName = teamName.split("INNINGS")[0].trim();
      let opponentIndex = i==0?1:0;
      let opponentName = $(innings[opponentIndex]).find('.ds-text-tight-s.ds-font-bold.ds-uppercase').text();
      opponentName=opponentName.split("INNINGS")[0].trim();
       console.log(`${venue} ${date} ${teamName} ${opponentName} ${result}`)
      let cInning=$(innings[i]);
      let allRows=cInning.find('.ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table tbody tr.ds-border-b.ds-border-line.ds-text-tight-s ');
      for(let j=0;j<allRows.length;j++)
      {

        let allCols = $(allRows[j]).find('td');
        if($(allCols[0]).text()!='Extras')
        {
            let playerName = $(allCols[0]).text().trim();
            let runs = $(allCols[2]).text().trim();
            let balls = $(allCols[3]).text().trim();
            let fours = $(allCols[5]).text().trim();
            let sixes = $(allCols[6]).text().trim();
            let sr = $(allCols[7]).text().trim();
            console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
            processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,result);
        }
        

       
    
    }
    }
    
}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,result)
{
     let teamPath = path.join(__dirname,"ipl",teamName);
     dirCreator(teamPath);
     let filePath =  path.join(teamPath,playerName+".xlsx");
     let content = excelReader(filePath,playerName);
    let playerObj = {
        teamName,
        playerName,
        runs, 
        balls ,
        fours ,
        sixes,
        sr,
        opponentName ,
        venue ,
        date , 
        result
    }
    content.push(playerObj);
    excelWriter(filePath,content,playerName);
    }    
function dirCreator(filePath)
{
    if(fs.existsSync(filePath)==false)
    {
        fs.mkdirSync(filePath);
    }
}
function excelWriter(filePath,json,sheetName)
{
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);

}
function excelReader(filePath,sheetName)
{
    if(fs.existsSync(filePath)==false)
    {
        return [];
    }
    let wb = xlsx.readFile(filePath)
    let excelData=wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans ;

}
module.exports = {
    ps : processScoreCard
}