import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalWp from "gi://AstalWp";

export default function Volume() {
    const wireplumber = AstalWp.get_default();
    const speaker = wireplumber?.audio.defaultSpeaker;

    if(!speaker) {
        return <label label={"🫪 No Audio"}/>
    }

    return(
        <box class={"volume-module"} spacing={8} valign={Gtk.Align.CENTER}>
            <button onClicked={() => speaker.set_mute(!speaker.mute)} class={"volume-icon-btn"}>
                <label label={createBinding(speaker, "volume").as((vol: number) => {
                    const volume = Math.floor(vol * 100);

                    if(speaker.mute) return "XXX";
                    if(vol === 0) return "---";
                    if(vol < 45) return `${volume.toString()}`

                    return `${volume.toString()}`;
                })}/>
            </button>
        </box>
    )
}