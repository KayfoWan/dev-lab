const readline = require('readline');
const fs = require('fs');

fs.readFile('./files/input.txt', 'utf-8', (err, data)=>{
    console.log(data);
}); 
console.log("Reading file...");