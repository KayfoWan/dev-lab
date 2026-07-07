import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"

import Volume from "./Volume"
import Battery from "./Battery"
import Wifi from "./Wifi"
import Workspaces from "./Workspaces"
import Time from "./Time"
import Date from "./Date"
import ActiveWindow from "./ActiveWindow"
import USAFlag from "./USAFlag"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date")
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox">
        {/* <button
          $type="start"
          onClicked={() => execAsync("echo hello").then(console.log)}
          hexpand
          halign={Gtk.Align.CENTER}
        >
          <label label="Welcome to AGS!" />
        </button> */}
        <box class={"leftBox"} hexpand valign={Gtk.Align.CENTER} halign={Gtk.Align.START} $type="start">
          <USAFlag/>
          <Volume/>
          <Date/>
          <ActiveWindow/>
        </box>
        <box class={"midBox"} hexpand valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} $type="center"></box>
        {/* <menubutton $type="end" hexpand halign={Gtk.Align.CENTER}>
          <label label={time} />
          <popover>
            <Gtk.Calendar />
          </popover>
        </menubutton> */}
        <box class={"rightBox"} hexpand valign={Gtk.Align.CENTER} halign={Gtk.Align.END} $type="end">
          <Workspaces/>
          <Battery/>
          <Wifi/>
          <Time/>
        </box>
      </centerbox>
    </window>
  )
}
