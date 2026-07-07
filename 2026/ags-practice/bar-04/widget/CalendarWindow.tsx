import { Astal, Gtk } from "ags/gtk4";

interface CalendarProps {
    visibleBinding: any; 
}

export default function CalendarWindow({ visibleBinding }: CalendarProps) {
    return (
        <window
            name="calendar-window"
            class="calendar-popup-window"
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            marginRight={12}
            marginTop={48}
            visible={visibleBinding}
            keymode={Astal.Keymode.ON_DEMAND}
        >
            <box class="calendar-window-box">
                <Gtk.Calendar 
                    class="custom-calendar"
                    showDayNames={true}
                    showHeading={true}
                />
            </box>
        </window>
    );
}