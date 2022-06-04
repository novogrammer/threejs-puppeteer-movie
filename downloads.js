


const DURATION = 15;
const FPS = 30;
const FRAMES = DURATION * FPS;
const TEXT ="さしすせそ";

const request = require('request');
const fs = require('node:fs/promises');


async function downloadAsync(text,time){
  const URL = "http://localhost:3000/api/capture";
  return await new Promise((resolve,reject)=>{
    request.get
    request.get({
      uri: URL,
      headers: {'Content-type': 'application/json'},
      qs: {
        text,
        time,
      },
      json: true
    }, function(err, req, data){
      if(err){
        reject(err);
      }
      resolve(data);
    });
  
  });

}

async function downloadAllAsync(text,fps,duration){
  const URL = "http://localhost:3000/api/capture_all";
  return await new Promise((resolve,reject)=>{
    request.get
    request.get({
      uri: URL,
      headers: {'Content-type': 'application/json'},
      qs: {
        text,
        fps,
        duration,
      },
      json: true
    }, function(err, req, data){
      if(err){
        reject(err);
      }
      resolve(data);
    });
  
  });

}


function toFilenameNumber(number,qty){
  const q = Math.log10(qty)+1;
  return `${number}`.padStart(q,"0");
}

async function oldMain(){
  for(let i=0;i<FRAMES;++i){
    console.log(`${i}/${FRAMES}`)
    const {result} = await downloadAsync(TEXT,i/FPS);
    const encodedFile=result.replace(/^data:\w+\/\w+;base64,/, '');
    const decodedFile = Buffer.from(encodedFile, 'base64');
    await fs.writeFile(`./output/capture${toFilenameNumber(i,FRAMES)}.png`,decodedFile);
  }
}
async function main(){
  const {resultList} = await downloadAllAsync(TEXT,FPS,DURATION);
  for(let i=0;i<resultList.length;++i){
    console.log(`${i}/${resultList.length}`);
    const result=resultList[i];
    const encodedFile=result.replace(/^data:\w+\/\w+;base64,/, '');
    const decodedFile = Buffer.from(encodedFile, 'base64');
    await fs.writeFile(`./output/capture${toFilenameNumber(i,resultList.length)}.png`,decodedFile);
  }
}

main();
