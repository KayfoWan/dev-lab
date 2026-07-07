import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalHyprland from "gi://AstalHyprland";

export default function ActiveWindow() {
    const hyprland = AstalHyprland.get_default();

    if(!hyprland) {
        return <label label={"Hyprland not running"}/>
    }

    const focusedClientBinding = createBinding(hyprland, "focused_client");

    const windowTitleBinding = focusedClientBinding.as((client) => {
        if(!client) return "K4199 @KayfoWan";

        return client.title || "Unknown App";
    });

    return(
        <box class={"active-window-module"} valign={Gtk.Align.CENTER}>
            <label
                class={"active-window-label"}
                label={windowTitleBinding}
                maxWidthChars={25}
                ellipsize={1}
            />
        </box>
    )
}