import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default function RAMGraph() {
    const historyLimit = 30;
    const ramHistory: number[] = Array(historyLimit).fill(0);
    const da = new Gtk.DrawingArea();

    da.set_content_width(300);
    da.set_content_height(120);
    da.width_request = 300;
    da.height_request = 120;

    const decoder = new TextDecoder();

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        try {
            const [success, content] = GLib.file_get_contents("/proc/meminfo");
            if(success) {
                const text = decoder.decode(content);
                const totalMatch = text.match(/MemTotal:\s+(\d+)/);
                const availMatch = text.match(/MemAvailable:\s+(\d+)/);

                if(totalMatch && availMatch) {
                    const totalMem = Number(totalMatch[1]);
                    const availMem = Number(availMatch[1]);
                    const usedMem = totalMem - availMem;

                    const ramUsage = usedMem / totalMem;
                    ramHistory.push(ramUsage);
                }
            }
        } catch (error) {
            console.error("Failed to read RAM stats:", error);
            ramHistory.push(0);
        }

        if(ramHistory.length > historyLimit) {
            ramHistory.shift();
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
        cr.showText("RAM UTILIZATION");

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
        cr.setLineWidth(1);
        cr.setSourceRGBA(0.31, 0.33, 0.45, 0.3);
        cr.moveTo(paddingLeft, paddingTop);
        cr.lineTo(paddingLeft + graphWidth, paddingTop);
        cr.moveTo(paddingLeft, paddingTop + graphHeight);
        cr.lineTo(paddingLeft + graphWidth, paddingTop + graphHeight);
        cr.stroke();

        if(ramHistory.length < 2) return;

        cr.setLineWidth(2.0);
        cr.setSourceRGBA(0,0,0,1);

        const stepX = graphWidth / (historyLimit - 1);
        const startX = paddingLeft;
        const startY = paddingTop + graphHeight - (ramHistory[0] * graphHeight);
        cr.moveTo(startX, startY);

        for(let i = 1; i < ramHistory.length; i++) {
            const x = paddingLeft + (i * startX);
            const y = paddingTop + graphHeight - (ramHistory[i] * graphHeight);
            cr.lineTo(x, y);
        }

        cr.stroke();
    });

    return da;
}