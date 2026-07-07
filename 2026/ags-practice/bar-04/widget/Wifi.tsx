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
    const strengthBinding = createBinding(wifi, "strength");
    const iconBinding = createBinding(wifi, "icon_name")

    return(
        <box class={"wifi-module"} spacing={8} valign={Gtk.Align.CENTER}>
            <box spacing={6} valign={Gtk.Align.CENTER}>
                <image iconName={iconBinding}/>
                <label label={ssidBinding.as((name: string) => {
                    if(!wifi.enabled) return "OFF";
                    if(!name) return "Disconnected";
                    const signal = Math.floor(strengthBinding.get());
                    return `${signal}%`;
                })}/>
            </box>
        </box>
    )
}