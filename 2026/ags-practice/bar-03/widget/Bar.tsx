import app from "ags/gtk4/app";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import { execAsync } from "ags/process";
import { createPoll } from "ags/time";

export default function Bar(gdkMonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date");
  const { TOP, LEFT, RIGHT} = Astal.WindowAnchor;
  return (
    <window
      visible
      name="bar"
      class="bar"
      gdkmonitor={gdkMonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}    
    >
      <centerbox
      >
        <box></box>
        <box></box>
        <box></box>
      </centerbox>
    </window>
  )
}