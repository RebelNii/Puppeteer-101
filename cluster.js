const { tr } = require("date-fns/locale");
const { Cluster } = require("puppeteer-cluster");
const fs = require('fs').promises;

const urls = [
    "https://www.amazon.com/s?k=xbox+series+x&crid=6AJFJ85PEBDD&sprefix=exbox%2Caps%2C426&ref=nb_sb_ss_sc_1_4",
    "https://www.amazon.com/s?k=ps5&crid=1GB90O58QQ6X&sprefix=ps%2Caps%2C1000&ref=nb_sb_noss_2",
  ];

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 100,
    monitor: true,
    puppeteerOptions: {
      headless: false,
      defaultViewport: false,
      userDataDir: "./temp",
    }
  });

   // Event handler to be called in case of problems
   cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  

  await cluster.task(async ({ page, data: url }) => {
    // await page.goto(url);
    // const screen = await page.screenshot();
    // Store screenshot, do something else

    await page.goto(url, {waitUntil: 'domcontentloaded'});
    console.log("1");
    
    let crawl = true;
    
    const items = [];
      
    while(crawl){
    await page.waitForSelector("div.sg-col-inner", { visible: true });
    const pageEles = await page.$$("div.sg-col-inner");
    console.log({page: pageEles.length});
    let price = null;
    let title = "null";
    let img = null;
    
    for (const pageEle of pageEles) {
    
        try {
        title = await page.evaluate(
            (sin) => sin.querySelector("h2 > a > span").textContent,
            pageEle
        );
        } catch (err) {}
    
        try {
        price = await page.evaluate(
            (sin) => sin.querySelector("span.a-price-whole").textContent,
            pageEle
        );
        } catch (err) {}
    
        try {
        img = await page.evaluate(
            (sin) => sin.querySelector("img.s-image").getAttribute("src"),
            pageEle
        );
        } catch (err) {}
        
        if(title !== null){
            items.push({title, price, img});
        }
        const data = `\n${title}\t${price}\t${img}`;
        await fs.appendFile('file.csv',`${data}\n`,function(err){})
        console.log(items);
        console.log('done')
    
    }
    //click next
    await page.waitForSelector("a.s-pagination-item.s-pagination-next", { visible: true });
    
    // let paage = (await page.$("span.s-pagination-item.s-pagination-next.s-pagination-disabled")) != null;
    
    await Promise.all([
    page.click("a.s-pagination-item.s-pagination-next"),
    page.waitForNavigation({waitUntil: 'networkidle2'})
    ])
    console.log('next')
    alert('here')
    // page.waitForNavigation()
    // if(paage === true){
    // crawl = paage
    // }
    // console.log(crawl)

    };

});

for (const url of urls) {
    await cluster.queue(url);
  }

  //   await cluster.idle();
  //   await cluster.close();
})();

// div.a-section.a-spacing-none.puis-padding-right-small.s-title-instructions-style > h2
// a-price-whole
// sg-col-inner
// s-image
