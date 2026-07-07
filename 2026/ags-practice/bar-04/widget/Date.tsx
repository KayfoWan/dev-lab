import { Gtk } from "ags/gtk4";
import { createState } from "ags";
import GLib from "gi://GLib";
import CalendarWindow from "./CalendarWindow";

export default function Date() {
    const getCurrentDate = () => GLib.DateTime.new_now_local().format("%b %d, %Y") || "";
    const [date] = createState(getCurrentDate());
    const [isOpen, setIsOpen] = createState(false);

    const popup = <CalendarWindow visibleBinding={isOpen}/>

    return(
        <box class={"date-container"} valign={Gtk.Align.CENTER}>
            <button
                class={"date-bar-button"}
                onClicked={() => setIsOpen(!isOpen())}
            >
                <label label={date}/>
            </button>
        </box>
    )
}