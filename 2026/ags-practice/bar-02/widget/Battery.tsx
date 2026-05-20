import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalBattery from "gi://AstalBattery";

export default function Battery() {
    const battery = AstalBattery.get_default();

    if(!battery || !battery.isPresent) {
        return <label label={"AC"} class={"battery-module desktop"}/>
    }

    const percentBinding = createBinding(battery, "percentage");

    return (
        <box class={"battery-module"} spacing={6} valign={Gtk.Align.CENTER}>
            <label label={percentBinding.as((pct: number)=>{
                const level = Math.floor(pct * 100);

                if(battery.charging) {
                    return `⚡︎⚡︎${level}`;
                }

                let icon = "🔋";

                if(level < 20) icon = "🪫";

                return `${icon} ${level}%`;
            })}/>
        </box>
    )
}