import { Gtk } from "ags/gtk4";
import { createBinding } from "ags";
import AstalWp from "gi://AstalWp";

export default function Volume() {
    const wireplumber = AstalWp.get_default();
    const speaker = wireplumber?.audio.default_speaker;

    if(!speaker) {
        return <label label={"🫪 No Audio"}/>
    }

    const volumeBinding = createBinding(speaker, "volume");

    const scaleWidget = (
        <Gtk.Scale
            hexpand
            drawValue={false}
            onValueChanged={(self: Gtk.Scale) => speaker.set_volume(self.get_value())}
        />
    ) as any;

    scaleWidget.set_value(volumeBinding.get());

    scaleWidget.hook(speaker, "notify::volume", () => {
        scaleWidget.set_value(speaker.volume);
    });

    return (
        <box class={"volume-module"} spacing={8} valign={Gtk.Align.CENTER}>
            <button onClicked={()=>speaker.set_mute(!speaker.mute)} class={"volume-icon-btn"}>
                <label label={createBinding(speaker, "volume").as((vol:number)=>{
                    if(speaker.mute) return "mute";
                    if(vol === 0) return "mute";
                    if(vol < 0.5) return "mute";
                    return "mute";
                })}/>
            </button>

            {scaleWidget}
        </box>
    )
}