'use strict';
const fetch = require('node-fetch');
const exec = require('child_process').exec;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const fs = require('fs');
const psList = require('ps-list');
require('date-utils');
const errorfile = './error.log';

const startytn = './yenten';
const startzny = './bitzeny';
const startkoto = './koto';
const startzoin = './zoin';
const seconds = 60;

let now = 0;
let stop = 0;

(async() => {
    try {
      while (true) {
        // 文字列取得
        let url = 'http://www3.eltrans.jp/select_this';
        let response = await fetch(url);
        let json = await response.text();
        console.log("json:" + json);
        console.log("now:" + now);
        console.log("stop:" + stop);

          psList().then(data => {
            let newLine = data.filter(function (item, index) {
              if (item.name == 'cpuminer' || item.name == 'minerd' || item.name == 'koto-mnrd' || item.name == 'zoin-mnrd') return true;
            });
            console.log(newLine);
            if (Object.keys(newLine).length === 0) {
              stop = 1;
              let date = new Date();
              let formattedDate = date.toFormat("YYYY/MM/DD HH24:MI:SS");
              let err = formattedDate + "vanished\n";
              appendFile(errorfile, err);
            }
          });


        if (json == 1 && (now != 1 || stop == 1)) { // go znyかつ、今は2もしくはstopフラグあり
            //znyに切り替えろ
            exec(startzny, (err, stdout, stderr) => {
              if (err) {
                console.log(err);
              }
              console.log(stdout);
            });
            now = 1;
            stop = 0;
          } 
            if (json == 2 && (now != 2 || stop == 1)) { //　
              //ytnに切り替えろ
              exec(startytn, (err, stdout, stderr) => {
                if (err) {
                  console.log(err);
                }
                console.log(stdout);
              });
              now = 2;
              stop = 0;
            }

            if (json == 0 && (now != 0 || stop == 1)) { //　
              //kotoに切り替えろ
              exec(startzoin, (err, stdout, stderr) => {
                if (err) {
                  console.log(err);
                }
                console.log(stdout);
              });
              now = 0;
              stop = 0;
            }

          await sleep(100 * seconds);

        }
      } catch (error) {
        let date = new Date();
        let formattedDate = date.toFormat("YYYY/MM/DD HH24:MI:SS")
        let err = formattedDate + error;
        appendFile(errorfile, err);
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
