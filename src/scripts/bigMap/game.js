import {Map} from './map.js';
import { Camera } from './camera.js';

const $ = elem=>document.getElementById(elem);
const GAME_WIDTH = 512; // max 768 x 768
const GAME_HEIGHT = 512;

class Game {
    constructor() {
        this.map = new Map();
        this.camera = new Camera(this.map, GAME_WIDTH, GAME_HEIGHT);
        this.keys = [];

        window.addEventListener('keydown', e=> {
            if(this.keys.indexOf(e.key) === -1) {
                this.keys.unshift(e.key);
            }
            //console.log(this.keys);
        });
        window.addEventListener('keyup', e=> {
            const index = this.keys.indexOf(e.key);
            if(index > -1) {
                this.keys.splice(index, 1);
            }
            //console.log(this.keys);
        });
    }
    update(deltaTime) {
        let speedX = 0;
        let speedY = 0;
        if(this.keys[0] === 'a') speedX = -1;
        else if (this.keys[0] === 'd') speedX = 1;
        else if (this.keys[0] === 'w') speedY = -1;
        else if (this.keys[0] === 's') speedY = 1;
        this.camera.move(deltaTime, speedX, speedY);
    }
    render(ctx) {
        ctx.drawImage(
            this.map.image,
            this.camera.x,
            this.camera.y,
            GAME_WIDTH,
            GAME_HEIGHT,
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );
    }
}

window.addEventListener('load', function() {
    const canvas = $('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    //ctx.fillStyle = "white";
    //ctx.fillRect(10,10,150,20);
    
    const game = new Game();

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = (timeStamp - lastTime) / 1000;
        lastTime = timeStamp;
        //console.log(deltaTime);
        //console.log(timeStamp);
        game.update(deltaTime);
        game.render(ctx);
        requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate);
});