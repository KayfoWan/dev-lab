import { Gtk } from "ags/gtk4";
import { createState } from "ags";
import GLib from "gi://GLib";

export default function Time() {
    const getCurrentTime = () => GLib.DateTime.new_now_local().format("%H:%M:%S") || "";
    const [time, setTime] = createState("");

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
        setTime(getCurrentTime());
        return true;
    });

    return(
        <box class={"time-module"} valign={Gtk.Align.CENTER}>
            <label
                class={"time-label"}
                label={time}
            />
        </box>
    )
}