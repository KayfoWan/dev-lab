import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";

import Wifi from "./Wifi";

export default function Bar(gdkMonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT} = Astal.WindowAnchor;
  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkMonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <box halign={Gtk.Align.START}>
          <label label={"NO"} />
        </box>
        <box halign={Gtk.Align.CENTER}>
          <label label={"yes"} />
        </box>
        <box halign={Gtk.Align.END}>
          <label label={"maybe"} />
        </box>
      </centerbox>
    </window>
  )
}