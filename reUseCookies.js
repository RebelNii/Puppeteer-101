const puppeteer = require("puppeteer");


(async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
      userDataDir: "./temp",
  });
  
  const page = await browser.newPage();
  
  await page.goto(
    "https://accounts.google.com/v3/signin/identifier?dsh=S1426508601%3A1668425083061543&continue=https%3A%2F%2Faccounts.google.com%2F&followup=https%3A%2F%2Faccounts.google.com%2F&passive=1209600&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=ARgdvAtAhCPuhnegO4yfoUewrwtlpicVGMYMAD0zSWwlPBGhvbPGDrsw1sFNzSvzOhlTy8SrzLEj",
    { waitUntil: "load" }
  );

  await page.type('#identifierId', 'kwadejeffrey@gmail.com')
  await page.click("#identifierNext")

  page.waitForNavigation({waitUntil: 'load'})
  page.waitForSelector("#password",{visible: true , hidden: false})

//   await page.type('div.Xb9hP > input', 'pass120')
//   await page.click("#passwordNext > div > button");

  page.waitForNavigation({waitUntil: 'load'})

  const cookies = await page.cookies()
  console.log(cookies)

  })();