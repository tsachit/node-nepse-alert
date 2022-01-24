const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const NotificationCenter = require('node-notifier').NotificationCenter;

const app = express();

const notificationCenterNotifier = new NotificationCenter({
  withFallback: true
});

const conditions = JSON.parse(fs.readFileSync('conditions.json'));
console.log('Checking for Conditions...\n', conditions, '\n');

console.log('Live Data\n');

const interval = 60; // in seconds
const match = {};
const checkNEPSE = async () => {
  // console.log('Fetching data...\n')
  // Make GET Request on every x seconds
  const response = await axios.get('https://merolagani.com/handlers/webrequesthandler.ashx?type=market_summary');
  // Print data
  const { date, detail } = response?.data?.turnover;
  // if(date) console.log('Data received. Last updated:', date);

  let matchFound = 0;
  if(detail && detail.length) {
    detail.forEach(p => {
      conditions.forEach(({symbol, operator, amount}) => {
        if(p.s === symbol && !(symbol in match)) {
          match[symbol] = parseFloat(p.lp);
        }

        const conditionMet = eval(parseFloat(p.lp) + operator + parseFloat(amount));
        if(p.s === symbol && conditionMet) {
          matchFound++;
          notificationCenterNotifier.notify(
            {
              title: `${symbol} Alert`,
              subtitle: `${symbol} value is ${p.lp} now`,
              message: `LTP: ${p.lp} is ${operator} ${amount}`,
              sound: 'Glass',
              open: undefined,
              wait: false,
            },
            function (error, response, metadata) {
              // console.log(response, metadata);
            }
          );
        }
      });
    });
  }
  console.log(new Date(), match, '\n');
  // console.log(`${(!matchFound) ? 'Nothing matched. ': ''}Checking again in ${interval} seconds...\n`);
};

checkNEPSE();
setInterval(() => {
  checkNEPSE();
}, interval * 1000);
