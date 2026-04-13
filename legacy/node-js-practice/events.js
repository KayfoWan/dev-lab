const readline = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url');
const event = require('events');

const user = require('./modules/user.js');
let myEmitter = new user();

myEmitter.on('userCreated', (id, name)=>{
    console.log(`New user ${name} with ID ${id} is created!`);
});

myEmitter.on('userCreated', (id, name) => {
    console.log(`New user ${name} with ID ${id} is added to the database!`)
})

myEmitter.emit('userCreated', 101, 'joe');