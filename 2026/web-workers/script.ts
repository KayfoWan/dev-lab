const $ = (id:string)=>document.getElementById(id);
const canvas = $("canvas") as HTMLCanvasElement;
if(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    if(ctx) {
        ctx.beginPath();
        ctx.arc(200, 200, 100, 0, 2*Math.PI, false);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(400, 400, 150, 0, 2*Math.PI, false);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
    }
}