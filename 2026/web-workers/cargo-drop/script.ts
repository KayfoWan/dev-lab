const $ = (id:string)=>document.getElementById(id);

class SpaceShip {
    x:number;
    y:number;
    color:string;
    length:number;
    width:number;
    angle:number = 0;
    constructor(x:number, y:number, color?:string) {
        this.x = x;
        this.y = y;
        this.color = color || "white";
        this.length = 35;
        this.width = 10;
    }

    cargo1:number = 0;
    cargo2:number = 0;

    draw(ctx:CanvasRenderingContext2D, x:number, y:number, angle:number) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(-this.length /2, -this.width /2, this.length, this.width);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}

class Planet {
    x:number;
    y:number;
    size:number;
    color:string;
    constructor(x:number, y:number, size:number, color:string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    resources:number = 0;

    draw(ctx:CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black"
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

window.addEventListener('load', ()=> {
    let gameState = {tick: 0, timestamp: "0000", planets: {}};

    const worker = new Worker(
        new URL('./workers/simulation.worker.js', import.meta.url),
        {type: 'module'}
    );

    worker.onmessage = (e) => {
        gameState = e.data;
    };

    const canvas = $("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 600;
    canvas.height = canvas.offsetHeight || 600;

    if(canvas && ctx) {
        const planet1 = new Planet(225, 125, 50, "yellow");
        const planet2 = new Planet(935, 420, 100, "orange");
        const homePlanet = new Planet(400, 500, 25, "lime");
        const ship = new SpaceShip(canvas.width / 2, canvas.height / 2);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            planet1.draw(ctx);
            planet2.draw(ctx);
            homePlanet.draw(ctx);

            if(gameState.ships && gameState.ships.length > 0) {
                const shipData = gameState.ships[0];
                ship.draw(ctx, shipData.x, shipData.y, shipData.angle);

                const shipData2 = gameState.ships[1];
                ship.draw(ctx, shipData2.x, shipData2.y, shipData2.angle);

                const shipData3 = gameState.ships[2];
                ship.draw(ctx, shipData3.x, shipData3.y, shipData3.angle);

                ctx.fillStyle = "black";
                ctx.fillText(`Ticks: ${gameState.tick} | Time: ${gameState.timestamp}`, 20, 20);
                ctx.fillText(`Ship: ${gameState.ships[0].id} | cargo1: ${gameState.ships[0].cargo1} | cargo2: ${gameState.ships[0].cargo2} | state: ${gameState.ships[0].state}`, 20, 40);
                ctx.fillText(`Ship: ${gameState.ships[1].id} | cargo1: ${gameState.ships[1].cargo1} | cargo2: ${gameState.ships[1].cargo2} | state: ${gameState.ships[1].state}`, 20, 60);
                ctx.fillText(`Ship: ${gameState.ships[2].id} | cargo1: ${gameState.ships[2].cargo1} | cargo2: ${gameState.ships[2].cargo2} | state: ${gameState.ships[2].state}`, 300, 40);
            }

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }
});