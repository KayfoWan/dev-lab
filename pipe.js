const http = require('http');
const fs = require('fs');

const server = http.createServer();
server.listen(8000, '127.0.0.1', ()=>{
    console.log('Server has started!');
});

server.on('request', (req, res)=>{
    // Imagine the file is actually larger than it is.
    /*
    fs.readFile('./files/largeFile.txt', (err, data)=>{
        if(err) {
            res.end('Something went wrong!');
            return;
        }
        res.end(data);
    })
    */

    /*
    server.on('request', (req, res)=>{
        let rs = fs.createReadStream('./files/largeFile.txt');
        rs.on('data', (chunk)=>{
            res.write(chunk);
        });

        rs.on('end', ()=>{
            res.end();
        });
        rs.on('error', (error)=>{
            res.end(error.message);
        });
    })
    */
    
    server.on('request', (req, res)=>{
        let rs = fs.createReadStream('./files/largeFile.txt');
        rs.pipe(res);
    });
})