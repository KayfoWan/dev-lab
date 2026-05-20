import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalWp from "gi://AstalWp";

export default function Volume() {
    const wireplumber = AstalWp.get_default();
    const speaker = wireplumber?.audio.default_speaker;

    if(!speaker) {
        return <label label={"🫪 No Audio"}/>
    }

    return (
        <box class={"volume-module"} spacing={8} valign={Gtk.Align.CENTER}>
            <button onClicked={()=>speaker.set_mute(!speaker.mute)} class={"volume-icon-btn"}>
                <label label={createBinding(speaker, "volume").as((vol:number)=>{
                    if(speaker.mute) return "muted";
                    if(vol === 0) return "muted";
                    if(vol < 0.05) return "muted";

                    const volume = Math.floor(vol * 100);
                    return volume.toString();
                })}/>
            </button>
        </box>
    )
}