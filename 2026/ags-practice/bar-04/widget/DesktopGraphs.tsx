import { Astal, Gtk, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";

import CPUGraph from "./graphs/CPUGraph";
import RAMGraph from "./graphs/RAMGraph";
import NetworkGraph from "./graphs/NetworkGraph";
import GPUGraph from "./graphs/GPUGraph";

export default function DesktopGraphs(monitor: Gdk.Monitor) {
    const monitorName = monitor ? monitor.get_description() || "primary" : "default";
    return (
        <window
            name={`desktop-graphs-${monitorName}`}
            gdkmonitor={monitor}
            layer={Astal.Layer.BACKGROUND}
            visible={true}
            application={app}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.NONE}
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
            class={"DesktopGraphs"}
        >
            <box class={"graph-container"} orientation={Gtk.Orientation.VERTICAL} spacing={12} hexpand vexpand halign={Gtk.Align.FILL} valign={Gtk.Align.FILL}>
                <CPUGraph/>
                <RAMGraph/>
                <NetworkGraph/>
                <GPUGraph/>
            </box>
        </window>
    )
}