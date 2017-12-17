'use strict';
const fetch = require('node-fetch');
const cheerio = require('cheerio-httpcli');
const fs = require('fs');
require('date-utils');
const appendfile = './Bitzeny_vs_Yenten.csv';
const publicfile = '../htdocs/select_this';
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// crypto = 0:znydiff,1:ytndiff,2:bitcoin価格.3:zny価格,4:ytn価格,5:znykhday,6:ytnkhday,]
const crypto = [];


// 謎のパラメーター群
const zeny_gets = 62.5;
const yenten_gets = 50;
const dollar = 113;
const zeny_hash = 12;
const yenten_hash = 2.8;
const zeny_hashcost = 56.5;
const yenten_hashcost = 242.143;

(async() => {
  try {
    while (true) {
      // 0:date
      let date = new Date();
      let formattedDate = date.toFormat("YYYY/MM/DD HH24:MI:SS")
      crypto.push(formattedDate);

      // 1:zeny難易度
      let url = 'https://soup.misosi.ru/index.php?page=api&action=getpoolstatus&api_key=a8c9c9405ad7ecbef3d976f63c218815d036b5e450db9c65f3d6732f7532b72a';
      let response = await fetch(url);
      let json = await response.json();
      crypto.push(json.getpoolstatus.data.networkdiff);

      // 2:yenten難易度
      url = 'https://ytn.misosi.ru/index.php?page=api&action=getpoolstatus&api_key=08df0632ccd6c4fdb2829f22eb2f6d004e25ed185abb1d30636aa1c83434d252';
      response = await fetch(url);
      json = await response.json();
      crypto.push(json.getpoolstatus.data.networkdiff);

      // 3:bitcoin価格
      url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
      response = await fetch(url);
      json = await response.json();
      crypto.push(json.bpi.USD.rate.toString().replace(/,/g, ""));

      // 4:bitzeny価格
      url = 'https://zeny.ck9.jp/';
      response = cheerio.fetch(url);
      json = await response.then(function (result) {
        crypto.push(result.$('.uk-overflow-auto tr td').eq(2).text());
      });

      // 5:yenten価格
      url = 'https://coinsmarkets.com/trade-BTC-YTN.htm';
      response = cheerio.fetch(url);
      json = await response.then(function (result) {
        crypto.push(result.$('.block td strong').eq(0).text());
      });

      // 6:7:cryptocurrency price / kh /day
      crypto.push(zeny_gets / ((crypto[1] * 4294967296) / 1000 / 3600 / 24));
      crypto.push(yenten_gets / ((crypto[2] * 4294967296) / 1000 / 3600 / 24));

      // 8:9:jpy / kh /day
      crypto.push(crypto[4] * crypto[6] * crypto[3] * dollar);
      crypto.push(crypto[5] * crypto[7] * crypto[3] * dollar);

      // 10:11 報酬 / kh /day
      crypto.push((crypto[8] - zeny_hashcost) * zeny_hash * 10);
      crypto.push((crypto[9] - yenten_hashcost) * yenten_hash * 10);

      appendFile(appendfile, crypto + '\n');
      console.log(crypto);

      let select = 0;
      // どちらもマイナスなら止めろ
      if (crypto[10] < 0 && crypto[11] < 0) {
        select = 0;
      } else {
        // znyを選べ
        if (crypto[11] - crypt[10] < 0) {
          select = 1;
        } else {
        // ytnを選べ
          select = 2;
        }
      }

      appendFile(publicfile, select);

      await sleep(1000 * 120);

      // 初期化して繰り返し
      crypto.length = 0;
    }
  } catch (error) {
    console.log(error);
  }
})();

function appendFile(path, data) {
  fs.appendFile(path, data, function (err) {
    if (err) {
      throw err;
    }
  });
}
