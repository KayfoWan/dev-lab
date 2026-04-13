const http = require('http');
const fs = require('fs');

const server = http.createServer();
server.listen(8000, '127.0.0.1', ()=>{
    console.log('Server has started!');
});

server.on('request', (req, res)=>{
    server.on('request', (req, res)=>{
        let rs = fs.createReadStream('./files/largeFile.txt');
        rs.pipe(res);
    });
})

console.log('pragram has started');
console.log('Program has completed');