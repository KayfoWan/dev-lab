const readline = require('readline');
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res)=>{
    res.end("Hello from the server!")
    console.log("A new request recieved");
});

const PORT = 8000;
const localHostIP = '127.0.0.1';

server.listen(PORT, localHostIP, ()=>{
    console.log('Server has started!');
});