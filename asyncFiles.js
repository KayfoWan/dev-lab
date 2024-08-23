const readline = require('readline');
const fs = require('fs');

fs.readFile('./files/start.txt', 'utf-8', (err, data)=>{
    console.log(data);
    fs.readFile(`./files/${data}.txt`, 'utf-8', (err, data2)=>{
        console.log(data2)
        if(err) console.log(err);
        fs.readFile(`./files/append.txt`, 'utf-8', (err, data3)=>{
            console.log(data3);
            fs.writeFile(`./files/output.txt`, `${data2}\n\n${data3}\n\nDate created ${new Date()}`, ()=>{
                console.log('File written successfully');
            });
        })
    });
}); 
console.log("Reading file...");