'use strict';
const fetch = require('node-fetch');
const fs = require('fs');
const exec = require('child_process').exec;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const znyd = './minerd -t 14 -a yescrypt -o stratum+tcp://stratum.misosi.ru:16001 -u akihabaraweeybleuser.gcp32-11 -p x'
const ytnd = './cpuminer -t 14 -a yescryptr16 -o stratum+tcp://stratum.misosi.ru:16011 -u AkihabaraWeeybleUser.gcp32-11 -p x'
const killznyd = './yenten'
const killytnd = './bitzeny'
const crypto = [];
let now = 0;

(async() => {
  try {
    while (true) {
      // 文字列取得
      let url = 'http://www3.eltrans.jp/select_this';
      let response = await fetch(url);
      let json = await response.text();
      console.log(json);

      if (json == 1 && now != 1) {
        //znyに切り替えろ
        exec(killytnd, (err, stdout, stderr) => {
          if (err) { console.log(err); }
          console.log(stdout);
        });
        now = 1;
      } else {
        if (json == 2 && now != 2) {
          //ytnに切り替えろ
          exec(killznyd, (err, stdout, stderr) => {
            if (err) { console.log(err); }
            console.log(stdout);
          });
            now = 2;
        }
      }

      console.log(now)
      await sleep(1000 * 600);

      // 初期化して繰り返し


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
