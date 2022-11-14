const puppeteer = require("puppeteer");
const fs = require('fs/promises');
const fss =require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./temp",
});


const page = await browser.newPage();

await page.goto(
  "https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011&dc&qid=1668255068&ref=sr_ex_n_1&ds=v1%3APi0h3goidX8UviE4bxUp1kd2cUaXcXWmInyAL7um%2F5Y",
  { waitUntil: "load" }
);
    // await page.goto('https://www.amazon.com/s?i=specialty-aps&bbn=16225007011&rh=n%3A16225007011%2Cn%3A13896617011&ref=nav_em__nav_desktop_sa_intl_computers_tablets_0_2_6_4')

await page.click("div.a-cardui-body>a.a-link-normal");

// await page.waitForSelector("div.sg-col-inner", { visible: true });
// let paage = (await page.$("div.sg-col-inner")) != null;
// const pageEles = await page.$$("div.sg-col-inner");

// await page.waitForSelector(".a-link-normal", { visible: true });

// await page.click("div.a-cardui-body>a.a-link-normal");
console.log("1");
// console.log(pageEles.length);

//s-pagination-item s-pagination-next
//s-pagination-item s-pagination-next s-pagination-disabled

let crawl = true;

let count = 0



const items = [];

  // await page.waitForSelector("span.s-pagination-item.s-pagination-next.s-pagination-disabled", { visible: true });

  // let paage = await page.$("div.sg-col-inner") != null;

while(crawl){
  await page.waitForSelector("div.sg-col-inner", { visible: true });
  const pageEles = await page.$$("div.sg-col-inner");
  console.log({page: pageEles.length});
  let price = null;
  let title = "null";
  let img = null;
  count++

  for (const pageEle of pageEles) {
  
    try {
      title = await page.evaluate(
        (sin) => sin.querySelector("h2 > a > span").textContent,
        pageEle
      );
      // if(title !== null){
      //   await fs.appendFile('file.csv', `${title}\n`, (_err)=>{})
      // }
      // console.log({title: title});
    } catch (err) {}
  
    try {
      price = await page.evaluate(
        (sin) => sin.querySelector("span.a-price-whole").textContent,
        pageEle
      );
        // fs.appendFile('file.csv', `${price}\n`, function(err){})
    } catch (err) {}
  
    try {
      img = await page.evaluate(
        (sin) => sin.querySelector("img.s-image").getAttribute("src"),
        pageEle
      );
    } catch (err) {}

    items.push({title, price, img});
    const data = `\n${title}\t${price}\t${img}`
    // const data = `\n${title.replace(/,/g, '.')}\t${price}\t${img}`
    await fs.appendFile('file.csv',`${data}\n`,function(err){})
    // console.log(items);

}

    
//click next
await page.waitForSelector("a.s-pagination-item.s-pagination-next", { visible: true });
// await page.click("a.s-pagination-item.s-pagination-next")

let paage = (await page.$("span.s-pagination-item.s-pagination-next.s-pagination-disabled")) != null;

await Promise.all([
  page.click("a.s-pagination-item.s-pagination-next"),
  page.waitForNavigation({waitUntil: 'networkidle2'})
])
console.log('next')
// page.waitForNavigation()
if(paage === true){
  crawl = paage
}
console.log(crawl)


}



  // for (const pageEle of pageEles) {
  //   console.log(pageEle.length);
  //   let price = null;
  //   let title = "null";
  //   let img = null;
  //   let items = [];
  //   console.log(count++);
  //   try {
  //     title = await page.evaluate(
  //       (sin) => sin.querySelector("h2 > a > span").textContent,
  //       pageEle
  //     );
  //     items.push(title);
  //     console.log("2");
  //   } catch (err) {}

  //   try {
  //     price = await page.evaluate(
  //       (sin) => sin.querySelector("span.a-price-whole").textContent,
  //       pageEle
  //     );
  //     items.push( price);
  //   } catch (err) {}

  //   try {
  //     img = await page.evaluate(
  //       (sin) => sin.querySelector("img.s-image").getAttribute("src"),
  //       pageEle
  //     );
  //     items.push(img);
  //   } catch (err) {}

  //   console.log(items);
  // }

 
  //   for (const pageEle of pageEles) {
  //     // const sings = await page.evaluate(sin => sin.innerText, pageEle)

  //     try {
  //       title = await page.evaluate(
  //         (sin) => sin.querySelector("h2 > a > span").textContent,
  //         pageEle
  //       );
  //     } catch (err) {}

  //     try {
  //       price = await page.evaluate(
  //         (sin) => sin.querySelector("span > .a-price-whole").textContent,
  //         pageEle
  //       );
  //     } catch (err) {}

  //     try {
  //       img = await page.evaluate(
  //         (sin) => sin.querySelector(".s-image").getAttribute("src"),
  //         pageEle
  //       );
  //     } catch (err) {}
  //     // console.log(title)
  //     // console.log(img)
  //     // console.log(price)
  //     if (title !== "null") {
  //       items.push({ title, price, img });
  //     }
  //     console.table(items);
  //     console.log(items.length);
  //   }

  // await browser.close()
})();

//a-section a-text-center s-pagination-container
//s-pagination-strip
