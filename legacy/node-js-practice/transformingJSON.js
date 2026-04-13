const readline = require('readline');
const fs = require('fs');
const http = require('http');

const html = fs.readFileSync('./Template/index.html', 'utf-8');
let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
let productListHTML = fs.readFileSync('./template/product-list.html', 'utf-8');

const server = http.createServer((req, res)=>{
    let path = req.url;
    if (path === '/' || path.toLocaleLowerCase() === '/home') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello World',
        });
        res.end(html.replace('{{%CONTENT%}}', productListHTML));
    } else if (path.toLocaleLowerCase() === '/about') {
        res.writeHead(200);
        res.end(html.replace('{{%CONTENT%}}', "You are in About page"));
    } else if (path.toLocaleLowerCase() === '/contact') {
        res.writeHead(200);
        res.end(html.replace('{{%CONTENT%}}', "You are in Contact page"));
    } else if (path.toLocaleLowerCase() === '/products') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'my-header': 'my json data',
        });
       res.end('You are in Products page');
       console.log(products);
    } else {
        res.writeHead(404);
        res.end(html.replace('{{%CONTENT%}}', "You are lost. error 404."));
    }
});

const PORT = 8000;
const localHostIP = '127.0.0.1';

server.listen(PORT, localHostIP, ()=>{
    console.log('Server has started!');
});