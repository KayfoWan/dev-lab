import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default function USAFlag() {
    const configDir = GLib.get_user_config_dir();
    const flagPath = `${configDir}/ags/assets/usa-flag.svg`;

    return(
        <box class={"flag-container"} valign={Gtk.Align.CENTER}>
            <image
                class={"flag-icon"}
                file={flagPath}
                pixelSize={24}
            />
        </box>
    )
}