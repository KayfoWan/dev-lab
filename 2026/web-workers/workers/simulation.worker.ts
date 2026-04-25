
let tickCount = 0;
let isPaused = false;

setInterval(() => {
    if(isPaused) return;

    tickCount++;

    const payload = {
        tick: tickCount,
        timestamp: Date.now(),
        planets: {
            alpha: { resources: 100 + tickCount },
            beta: { resources: 50 + (tickCount * 0.5) }
        }
    };

    self.postMessage(payload);
}, 1000);

self.onmessage = (e: MessageEvent) => {
    if(e.data.command === "PAUSE") isPaused = true;
    if(e.data.command === "RESUME") isPaused = false;
};

export {};