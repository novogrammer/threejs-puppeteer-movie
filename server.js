const express = require('express');

const puppeteer = require('puppeteer');



const app = express();

app.use(express.static("public"));

// app.get('/', function (req, res) {
//   res.send('Hello World');
// });


app.listen(3000);



async function main() {
  const url = "http://localhost:3000/";
  const API_CAPTURE_URL="/api/capture";
  const API_CAPTURE_ALL_URL="/api/capture_all";

  const args=[
    "--no-sandbox",
    "--use-gl=swiftshader",
    // "--use-gl=angle",
    "--enable-webgl",
  ];

  const browser = await puppeteer.launch({
    args,
    headless: true,
    dumpio: true,
    defaultViewport: { width: 400, height: 300 },
  });



  // process.kill(process.pid, "SIGINT");

  app.get(API_CAPTURE_URL,async (req,res)=>{
    const page = await browser.newPage();

    const text = req.query.text ?? "でふぉると";
    const time = Number(req.query.time ?? "0");
    await page.goto(`${url}?text=${encodeURIComponent(text)}`);
    // await page.waitForNetworkIdle();

    const result = await page.evaluate(async (time)=>{
      await window.app.setupPromise;
      window.app.update(time);
      return window.app.draw();
    },time);
    await page.close();

    // console.log("result :",result);

    res.json({result});

  });
  console.log(`begin ${API_CAPTURE_URL}`);

  app.get(API_CAPTURE_ALL_URL,async (req,res)=>{
    const page = await browser.newPage();

    const text = req.query.text ?? "でふぉると";
    const fps = Number(req.query.fps ?? "30");
    const duration = Number(req.query.duration ?? "1");
    await page.goto(`${url}?text=${encodeURIComponent(text)}`);
    // await page.waitForNetworkIdle();

    const resultList = await page.evaluate(async (fps,duration)=>{
      await window.app.setupPromise;
      const frames = fps * duration;
      const resultList=[];
      for(let i=0;i<frames;++i){
        const time=i/fps;
        window.app.update(time);
        resultList.push(window.app.draw());
      }
      return resultList;
    },fps,duration);
    await page.close();

    // console.log("result :",result);

    res.json({resultList});

  });
  console.log(`begin ${API_CAPTURE_ALL_URL}`);

}

main();

