import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default function NetworkGraph() {
    const historyLimit = 30;

    const downHistory: number[] = Array(historyLimit).fill(0);
    const upHistory: number[] = Array(historyLimit).fill(0);

    const da = new Gtk.DrawingArea();
    da.set_content_width(300);
    da.set_content_height(120);
    da.width_request = 300;
    da.height_request = 120;

    let prevDownBytes = 0;
    let prevUpBytes = 0;

    const MAX_SPEED_BYTES = 10 * 1024 * 1024;

    const decoder = new TextDecoder();

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        try {
            const [success, content] = GLib.file_get_contents("/proc/net/dev");
            if(success) {
                const text = decoder.decode(content);
                const lines = text.split("\n");

                let totalDown = 0;
                let totalUp = 0;

                for(const line of lines) {
                    if(line.includes(":") && !line.includes("lo:")) {
                        const parts = line.trim().split(/\s+/);
                        totalDown += Number(parts[1]) || 0;
                        totalUp += Number(parts[9]) || 0;
                    }
                }

                const diffDown = totalDown - prevDownBytes;
                const diffUp = totalUp - prevUpBytes;

                if(prevDownBytes > 0 && prevUpBytes > 0) {
                    downHistory.push(Math.min(diffDown / MAX_SPEED_BYTES, 1.0));
                    upHistory.push(Math.min(diffUp / MAX_SPEED_BYTES, 1.0));
                } else {
                    downHistory.push(0);
                    upHistory.push(0);
                }

                prevDownBytes = totalDown;
                prevUpBytes = totalUp;
            }
        } catch (error) {
            console.error("Failed to read Network stats:", error);
            downHistory.push(0);
            upHistory.push(0);
        }

        if(downHistory.length > historyLimit) downHistory.shift();
        if(upHistory.length > historyLimit) upHistory.shift();

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
        cr.showText("NETWORK SPEED");

        //Axis Labels
        cr.selectFontFace("ProggyClean Nerd Font Mono", 0, 0);
        cr.setFontSize(13);
        cr.setSourceRGBA(0,0,0,1);

        //Top Label
        cr.moveTo(10, paddingTop + 8);
        cr.showText("10M");
        
        //Bottom Label
        cr.moveTo(20, paddingTop + graphHeight);
        cr.showText("0M");

        //Grid Lines
        cr.setLineWidth(1.0);
        cr.setSourceRGBA(0.31, 0.33, 0.45, 0.3);
        cr.moveTo(paddingLeft, paddingTop);
        cr.lineTo(paddingLeft + graphWidth, paddingTop);
        cr.moveTo(paddingLeft, paddingTop + graphHeight);
        cr.lineTo(paddingLeft + graphWidth, paddingTop + graphHeight);
        cr.stroke();

        if(downHistory.length < 2) return;
        const stepX = graphWidth / (historyLimit - 1);

        //Download Line
        cr.setLineWidth(2.0);
        cr.setSourceRGBA(0, 0, 0, 1);
        cr.moveTo(paddingLeft, paddingTop + graphHeight - (downHistory[0] * graphHeight));
        for(let i = 1; i < downHistory.length; i++) {
            cr.lineTo(paddingLeft + (i * stepX), paddingTop + graphHeight - (downHistory[i] * graphHeight));
        }
        cr.stroke();

        cr.setLineWidth(1.5);
        cr.setSourceRGBA(0.96, 0.61, 0.66, 1.0);
        cr.moveTo(paddingLeft, paddingTop + graphHeight - (upHistory[0] * graphHeight));
        for(let i = 1; i < upHistory.length; i++) {
            cr.lineTo(paddingLeft + (i * stepX), paddingTop + graphHeight - (upHistory[i] * graphHeight));
        }
        cr.stroke();
    });

    return da;
}