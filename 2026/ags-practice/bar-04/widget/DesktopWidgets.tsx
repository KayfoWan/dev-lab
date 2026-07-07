import { Astal, Gtk, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";

import UptimeMonitor from "./UptimeMonitor";
import GithubMonitor from "./GithubMonitor";

export default function DesktopWidgets(monitor: Gdk.Monitor) {
    const monitorName = monitor ? monitor.get_description() || "primary" : "default";
    return (
        <window
            name={`desktop-widgets-${monitorName}`}
            gdkmonitor={monitor}
            layer={Astal.Layer.BACKGROUND}
            visible={true}
            application={app}
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.NONE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            class={"DesktopWidgets"}
        >
            <box class={"widget-container"} orientation={Gtk.Orientation.VERTICAL} spacing={12} hexpand vexpand halign={Gtk.Align.FILL} valign={Gtk.Align.FILL}>
                <UptimeMonitor/>
                <GithubMonitor/>
            </box>
        </window>
    )
}