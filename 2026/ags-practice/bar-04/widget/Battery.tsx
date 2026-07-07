import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalBattery from "gi://AstalBattery";

export default function Battery() {
    const battery = AstalBattery.get_default();

    if(!battery || !battery.isPresent) {
        return <label label={"AC"} class={"battery-module"}/>
    }

    const percentBinding = createBinding(battery, "percentage");

    const battery0 = '';
    const battery1 = '';
    const battery2 = '';
    const battery3 = '';
    const battery4 = '';

    return(
        <box class={"battery-module"} spacing={6} valign={Gtk.Align.CENTER}>
            <label label={percentBinding.as((pct: number) => {
                const level = Math.floor(pct * 100);

                if(battery.charging) {
                    return `⚡ ${level}`;
                }

                let icon = battery4;
                if(level < 6) icon = battery0;
                if(level < 26) icon = battery1;
                if(level < 51) icon = battery2;
                if(level < 76) icon = battery3;


                return `${icon} ${level}%`;
            })}/>
        </box>
    )
}