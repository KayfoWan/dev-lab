const readline = require('readline');
const fs = require('fs');
const http = require('http');

const html = fs.readFileSync('./Template/index.html', 'utf-8');

const server = http.createServer((req, res)=>{
    let path = req.url;
    //res.end(path);

    if (path === '/' || path.toLocaleLowerCase() === '/home') {
        //res.end('You are in home page');
        //res.end(html);
        res.end(html.replace('{{%CONTENT%}}', "You are in Home page"));
    } else if (path.toLocaleLowerCase() === '/about') {
        //res.end('You are in about page');
        res.end(html.replace('{{%CONTENT%}}', "You are in About page"));
    } else if (path.toLocaleLowerCase() === '/contact') {
        //res.end('You are in contact page');
        res.end(html.replace('{{%CONTENT%}}', "You are in Contact page"));
    } else {
        //res.end('Page not found: 404');
        res.end(html.replace('{{%CONTENT%}}', "You are lost. error 404."));
    }
});

const PORT = 8000;
const localHostIP = '127.0.0.1';

server.listen(PORT, localHostIP, ()=>{
    console.log('Server has started!');
});