import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalNetwork from "gi://AstalNetwork";

export default function Wifi() {
    const network = AstalNetwork.get_default();
    const wifi = network?.wifi;

    if(!wifi) {
        return <label label={"🫪 No Network"}/>
    }

    const ssidBinding = createBinding(wifi, "ssid");

    const labelText = ssidBinding((name: string) => {
        if(!wifi.enabled) return "OFF";
        if(!name) return "Disconnected";
        const signal = wifi.strength ? Math.floor(wifi.strength) : 0;
        return `${name}: ${signal}%`;
    });

    return(
        <box class={"wifi-module"} spacing={8} valign={Gtk.Align.CENTER}>
            <button onClicked={() => {}} class={"wifi-button"}>
                <label label={labelText}/>
            </button>
        </box>
    )
}