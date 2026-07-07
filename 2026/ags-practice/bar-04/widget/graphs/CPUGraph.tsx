import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default function CPUGraph() {
    const historyLimit = 30;
    const cpuHistory: number[] = Array(historyLimit).fill(0);
    const da = new Gtk.DrawingArea();
    da.set_content_width(300);
    da.set_content_height(120);

    da.width_request = 300;
    da.height_request = 120;

    let prevIdle = 0;
    let prevTotal = 0;

    const decoder = new TextDecoder();

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        try {
            const [success, content] = GLib.file_get_contents("/proc/stat");
            if(success) {
                const text = decoder.decode(content);
                // const firstLine = Object.values(content).map(c => String.fromCharCode(c)).join("").split("\n")[0];
                const firstLine = text.split("\n")[0];
                const parts = firstLine.split(/\s+/).slice(1).map(Number);

                const idle = parts[3] + parts[4];
                const total = parts.reduce((a, b) => a + b, 0);

                const diffIdle = idle - prevIdle;
                const diffTotal = total - prevTotal;

                const cpuUsage = diffTotal > 0 ? (diffTotal - diffIdle) / diffTotal : 0;

                prevIdle = idle;
                prevTotal = total;

                cpuHistory.push(cpuUsage);
            } 
        } catch (error) {
            console.error("Failed to read CPU stats:", error);
            cpuHistory.push(0);
        }

        if(cpuHistory.length > historyLimit) {
            cpuHistory.shift();
        }

        da.queue_draw();
        return true;
    });

    da.set_draw_func((_, cr, width, height) => {

        const paddingLeft = 45;
        const paddingRight = 10;
        const paddingTop = 25;
        const paddingBottom = 15;

        const graphWidth = width - paddingLeft - paddingRight;
        const graphHeight = height - paddingTop - paddingBottom;

        //Background
        cr.setSourceRGBA(255, 255, 255, 0);
        cr.paint();

        //Title
        cr.selectFontFace("ProggyClean Nerd Font Mono", 0, 1);
        cr.setFontSize(13);
        cr.setSourceRGBA(0,0,0,1);
        cr.moveTo(paddingLeft, 16);
        cr.showText("CPU UTILIZATION");

        //Axis Labels
        cr.selectFontFace("ProggyClean Nerd Font Mono", 0, 0);
        cr.setFontSize(10);
        cr.setSourceRGBA(0,0,0,1);

        //Top Label
        cr.moveTo(10, paddingTop + 8);
        cr.showText("100%");

        //Bottom Label
        cr.moveTo(20, paddingTop + graphHeight);
        cr.showText("0%");

        //Grid Lines
        cr.setLineWidth(1);
        cr.setSourceRGBA(0.31, 0.33, 0.45, 0.3);
        cr.moveTo(paddingLeft, paddingTop);
        cr.lineTo(paddingLeft + graphWidth, paddingTop);
        cr.moveTo(paddingLeft, paddingTop + graphHeight);
        cr.lineTo(paddingLeft + graphWidth, paddingTop + graphHeight);
        cr.stroke();

        if(cpuHistory.length < 2) return;

        cr.setLineWidth(2.0);
        cr.setSourceRGBA(0, 0, 0, 1);

        const stepX = graphWidth / (historyLimit - 1);

        const startX = paddingLeft;
        const startY = paddingTop + graphHeight - (cpuHistory[0] * graphHeight);
        cr.moveTo(startX, startY);

        for(let i = 1; i < cpuHistory.length; i++) {
            const x = paddingLeft + (i * stepX);
            const y = paddingTop + graphHeight - (cpuHistory[i] * graphHeight);
            cr.lineTo(x,y);
        }

        cr.stroke();
    });

    return da;
}