'use strict';
const fetch = require('node-fetch');
const exec = require('child_process').exec;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const killznyd = './yenten'
const killytnd = './bitzeny'
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

    }
  } catch (error) {
    console.log(error);
  }
})();
