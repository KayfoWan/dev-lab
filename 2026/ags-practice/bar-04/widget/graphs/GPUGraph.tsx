import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default function GPUGraph() {
    const historyLimit = 30;
    const gpuHistory: number[] = Array(historyLimit).fill(0);
    const da = new Gtk.DrawingArea();

    da.set_content_width(300);
    da.set_content_height(120);
    da.width_request = 300;
    da.height_request = 120;

    const decoder = new TextDecoder();

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        try {
            const [success, content] = GLib.file_get_contents("/sys/class/drm/card1/device/gpu_busy_percent");
            if(success) {
                const text = decoder.decode(content).trim();
                const usagePercent = Number(text);

                const gpuUsage = !isNaN(usagePercent) ? usagePercent / 100 : 0;
                gpuHistory.push(gpuUsage);
            }
        } catch (error) {
            console.error("Failed to read GPU stats:", error);
            gpuHistory.push(0);
        }

        if(gpuHistory.length > historyLimit) {
            gpuHistory.shift();
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

        //Title
        cr.selectFontFace("ProggyClean Nerd Font Mono", 0, 1);
        cr.setFontSize(13);
        cr.setSourceRGBA(0,0,0,1);
        cr.moveTo(paddingLeft, 16);
        cr.showText("GPU UTILIZATION");

        //Axis Labels
        cr.selectFontFace("ProggyClean Nerd Font Mono", 0, 0);
        cr.setFontSize(13);
        cr.setSourceRGBA(0,0,0,1);
        

        //Top Label
        cr.moveTo(10, paddingTop + 8);
        cr.showText("100%");

        //Bottom Label
        cr.moveTo(20, paddingTop + graphHeight);
        cr.showText("0%");

        //Grid Lines
        cr.setLineWidth(1.0);
        cr.setSourceRGBA(0.31, 0.33, 0.45, 0.3);
        cr.moveTo(paddingLeft, paddingTop);
        cr.lineTo(paddingLeft + graphWidth, paddingTop);
        cr.moveTo(paddingLeft, paddingTop + graphHeight);
        cr.lineTo(paddingLeft + graphWidth, paddingTop + graphHeight);
        cr.stroke();

        //GPU Line
        if(gpuHistory.length < 2) return;

        cr.setLineWidth(2.0);
        cr.setSourceRGBA(0, 0, 0, 1);

        const stepX = graphWidth / (historyLimit - 1);
        const startX = paddingLeft;
        const startY = paddingTop + graphHeight - (gpuHistory[0] * graphHeight);
        cr.moveTo(startX, startY);

        for(let i = 1; i < gpuHistory.length; i++) {
            const x = paddingLeft + (i * stepX);
            const y = paddingTop + graphHeight - (gpuHistory[i] * graphHeight);
            cr.lineTo(x, y);
        }

        cr.stroke();
    });

    return da;
}