
let tickCount = 0;
let isPaused = false;

let ships = [
    {id: 1, x: 100, y: 100, state: 'GOTO_P1', cargo1: 0, cargo2: 0, angle: 0},
    {id: 2, x: 50, y: 50, state: 'GOTO_P1', cargo1: 0, cargo2: 0, angle: 0},
    {id: 3, x: 10, y: 10, state: 'GOTO_P1', cargo1: 0, cargo2: 0, angle: 0}
]

let locations = {
    planet1: {x: 225, y: 125},
    planet2: {x: 935, y: 420},
    home: {x: 400, y: 500}
};

const cargoCapacity = 50;

function getTargetCoords(state: string) {
    switch(state) {
        case 'GOTO_P1':
            return locations.planet1;
        case 'GOTO_P2':
            return locations.planet2;
        case 'GOTO_HOME':
            return locations.home;
        default:
            return locations.home;
    }
}

function updateShipState(ship: any) {
    const target = getTargetCoords(ship.state);
    const dist = Math.hypot(target.x - ship.x, target.y - ship.y);

    if(dist < 5) {
        if(ship.state === 'GOTO_P1') {
            ship.cargo1 += 1;
            if(ship.cargo1 >= cargoCapacity) {
                ship.state = 'GOTO_P2';
            }
        } else if(ship.state === "GOTO_P2") {
            ship.cargo2 += 1;
            if(ship.cargo2 >= cargoCapacity) {
                ship.state = 'GOTO_HOME';
            }
        } else if(ship.state === 'GOTO_HOME') {
            ship.cargo1 = 0;
            ship.cargo2 = 0;
            ship.state = 'GOTO_P1';
        }
    }
}

setInterval(() => {
    if(isPaused) return;

    tickCount++;

    ships.forEach(ship => {
        const target = getTargetCoords(ship.state);
        ship.angle = Math.atan2(target.y - ship.y, target.x - ship.x);
        const dist = Math.hypot(target.x - ship.x, target.y - ship.y);
        if(dist > 5) {
            ship.x += Math.cos(ship.angle) * 3;
            ship.y += Math.sin(ship.angle) * 3;
        }
        updateShipState(ship);
    });

    const payload = {
        tick: tickCount,
        timestamp: Date.now(),
        planets: {
            planet1: { resources: 100 + tickCount },
            planet2: { resources: 50 + (tickCount * 0.5) }
        },
        ships: ships
    };

    self.postMessage(payload);
}, 16);

self.onmessage = (e: MessageEvent) => {
    if(e.data.command === "PAUSE") isPaused = true;
    if(e.data.command === "RESUME") isPaused = false;
};

export {};