


const TIME = 15;
const FPS = 30;
const FRAMES = TIME * FPS;
const TEXT ="さしすせそ";

const request = require('request');
const fs = require('node:fs/promises');


async function downloadAsync(time,text){
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

function toFilenameNumber(number,qty){
  const q = Math.log10(qty)+1;
  return `${number}`.padStart(q,"0");
}

async function main(){
  for(let i=0;i<FRAMES;++i){
    console.log(`${i}/${FRAMES}`)
    const {result} = await downloadAsync(i/FPS,TEXT);
    const encodedFile=result.replace(/^data:\w+\/\w+;base64,/, '');
    const decodedFile = Buffer.from(encodedFile, 'base64');
    await fs.writeFile(`./output/capture${toFilenameNumber(i,FRAMES)}.png`,decodedFile);
  }
}

main();
