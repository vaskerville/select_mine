'use strict';
const fetch = require('node-fetch');
const cheerio = require('cheerio-httpcli');
const exec = require('child_process').exec;
const fs = require('fs');
require('date-utils');
const appendfile = './Bitzeny_vs_Yenten.csv';
const publicfile = '../htdocs/select_this';
const profit = '../htdocs/profit';
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const crypto = [];

const delgroup = './delgroup';
const creategroup = './creategroup';

// 謎のパラメーター群
const zeny_gets = 62.5;
const yenten_gets = 50;
const dollar = 110;
const zeny_hash = 12;
const yenten_hash = 2.8;
const zeny_hashcost = 56.5;
const yenten_hashcost = 242.143;

const zeny_ave = [];
const yenten_ave = [];


(async() => {
  try {
    while (true) {
      // 0:date
      let date = new Date();
      let formattedDate = date.toFormat("YYYY/MM/DD HH24:MI:SS")
      crypto.push(formattedDate);

      // 1:zeny難易度
      let url = 'https://lapool.me/bitzeny/index.php?page=statistics&action=pool';
      let response = cheerio.fetch(url);
      let json = await response.then(function (result) {
      crypto.push(result.$('td a span').text());
      });

      // 2:yenten難易度
      url = 'http://yenten-blockexplorer.chocottokozukai.click/ext/summary';
      response = await fetch(url);
      json = await response.json();
      crypto.push(json.data[0].difficulty);

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
      url = 'https://coinmarketcap.com/currencies/yenten/#charts';                     
      response = cheerio.fetch(url);                                                   
      json = await response.then(function (result) {                                   
      crypto.push(result.$('.details-text-medium').eq(1).text().replace(/ BTC/g, ""));   
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

      // 12:13 移動平均
      zeny_ave.push(crypto[10]);
      if (zeny_ave.length > 10) {zeny_ave.shift();}
      crypto.push(average(zeny_ave));
      yenten_ave.push(crypto[11]);
      if (yenten_ave.length > 10) {yenten_ave.shift();}
      crypto.push(average(yenten_ave));


      appendFile(appendfile, crypto + '\n');
      console.log(crypto);

      let select = 0;
      // どちらもマイナスなら止めろ
      if (crypto[10] < 0 && crypto[11] < 0) {
        select = 0;
      } else {
        // znyを選べ
        if (crypto[11] - crypto[10] < 0) {
          select = 1;
        } else {
        // ytnを選べ
          select = 2;
        }
      }

      //about instance
      if (crypto[12] < 1000 && crypto[13] < 1000) {
        exec(delgroup, (err, stdout, stderr) => {
           if (err) {
                console.log(err);
	              }
                 console.log(stdout);
        });
      }

      if (crypto[12] > 5000 || crypto[13] > 5000) {
        exec(creategroup, (err, stdout, stderr) => {
           if (err) {
                console.log(err);
	              }
                 console.log(stdout);
        });
      }

      writeFile(publicfile, select);
      writeFile(profit, crypto);

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

function writeFile(path, data) {
  fs.writeFile(path, data, function (err) {
    if (err) {
        throw err;
    }
  });
}

const average = function(arr, fn) {
    return sum(arr, fn)/arr.length;
};

const sum = function(arr, fn) {
	    if (fn) {
		            return sum(arr.map(fn));
		        }
	    else {
		            return arr.reduce(function(prev, current, i, arr) {
				                    return prev+current;
				            });
		        }
};
