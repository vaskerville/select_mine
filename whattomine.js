'use strict';
const fetch = require('node-fetch');
const cheerio = require('cheerio-httpcli');
const exec = require('child_process').exec;
const fs = require('fs');
require('date-utils');
const appendfile = '../htdocs/whattomine.txt';
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const crypto = [];

(async() => {
  try {
    while (true) {
      // 0:date
      let date = new Date();
      let formattedDate = date.toFormat("YYYY/MM/DD HH24:MI:SS")
      crypto.push(formattedDate);

      let url = 'https://whattomine.com/coins?utf8=%E2%9C%93&adapt_q_280x=0&adapt_q_380=0&adapt_q_fury=0&adapt_q_470=0&adapt_q_480=1&adapt_480=true&adapt_q_570=1&adapt_570=true&adapt_q_580=1&adapt_580=true&adapt_q_vega56=1&adapt_vega56=true&adapt_q_vega64=1&adapt_vega64=true&adapt_q_750Ti=0&adapt_q_1050Ti=0&adapt_q_10606=0&adapt_q_1070=0&adapt_q_1070Ti=1&adapt_1070Ti=true&adapt_q_1080=1&adapt_1080=true&adapt_q_1080Ti=1&adapt_1080Ti=true&eth=true&factor%5Beth_hr%5D=252.9&factor%5Beth_p%5D=1245.0&grof=true&factor%5Bgro_hr%5D=273.0&factor%5Bgro_p%5D=1225.0&x11gf=true&factor%5Bx11g_hr%5D=87.9&factor%5Bx11g_p%5D=1275.0&cn=true&factor%5Bcn_hr%5D=7860.0&factor%5Bcn_p%5D=1055.0&eq=true&factor%5Beq_hr%5D=3435.0&factor%5Beq_p%5D=1180.0&lre=true&factor%5Blrev2_hr%5D=193600.0&factor%5Blrev2_p%5D=1210.0&ns=true&factor%5Bns_hr%5D=6020.0&factor%5Bns_p%5D=1230.0&lbry=true&factor%5Blbry_hr%5D=2015.0&factor%5Blbry_p%5D=1300.0&bk2bf=true&factor%5Bbk2b_hr%5D=13670.0&factor%5Bbk2b_p%5D=1355.0&bk14=true&factor%5Bbk14_hr%5D=19790.0&factor%5Bbk14_p%5D=1315.0&pas=true&factor%5Bpas_hr%5D=8910.0&factor%5Bpas_p%5D=1375.0&skh=true&factor%5Bskh_hr%5D=244.3&factor%5Bskh_p%5D=1240.0&factor%5Bl2z_hr%5D=420.0&factor%5Bl2z_p%5D=300.0&factor%5Bcost%5D=1.2&sort=Profit&volume=0&revenue=current&factor%5Bexchanges%5D%5B%5D=&factor%5Bexchanges%5D%5B%5D=abucoins&factor%5Bexchanges%5D%5B%5D=bitfinex&factor%5Bexchanges%5D%5B%5D=bittrex&factor%5Bexchanges%5D%5B%5D=bleutrade&factor%5Bexchanges%5D%5B%5D=cryptopia&factor%5Bexchanges%5D%5B%5D=hitbtc&factor%5Bexchanges%5D%5B%5D=poloniex&factor%5Bexchanges%5D%5B%5D=yobit&dataset=monero&commit=Calculate';
      let response = cheerio.fetch(url);
      let json = await response.then(function (result) {
      let a=result.$('table td strong').text().split('\n');
      let b=result.$('table td a').text().split('(');
      crypto.push(b[0]);
      crypto.push(a[11].replace(/ /g, "").replace(/\$/g, ""));
      });

      appendFile(appendfile, crypto + '\n');
      console.log(crypto);

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
