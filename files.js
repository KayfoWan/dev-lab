const readline = require('readline');
const fs = require('fs');

let textIn = fs.readFileSync('./files/input.txt', 'utf-8'); //10 min possibly (not async)
console.log(textIn);

let content = `Data read from input.txt: ${textIn} \nDate created: ${new Date()}`;
fs.writeFileSync('./Files/output.txt', content);