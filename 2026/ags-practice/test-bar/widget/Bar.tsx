import { Astal, Gdk } from "ags/gtk4";
export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
    return(
        <window exclusivity={Astal.Exclusivity.EXCLUSIVE} anchor={TOP | LEFT | RIGHT}>
            <label label={"YES"}/>
        </window>
    )
}