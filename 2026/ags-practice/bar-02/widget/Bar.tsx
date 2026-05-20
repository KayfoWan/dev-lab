import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import Volume from "./Volume"
import Wifi from "./Wifi"
import Battery from "./Battery"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date")
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  //   {/* <button
  //   $type="start"
  //   onClicked={() => execAsync("echo hello").then(console.log)}
  //   hexpand
  //   halign={Gtk.Align.CENTER}
  // >
  //   <label label="Welcome to AGS!" />
  // </button>
  // <box $type="center" /> */}

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

        <box $type="start" halign={Gtk.Align.START}>
          <menubutton hexpand class={"clock-button"}>
            <label label={time}/>
            <popover>
              <Gtk.Calendar />
            </popover>
          </menubutton>
        </box>
        
        <box $type="center" halign={Gtk.Align.CENTER}></box>

        <box $type="end" halign={Gtk.Align.END}>
          <Volume/>
          <Battery/>
          <Wifi/>
        </box>
      </centerbox>

    </window>
  )
}
