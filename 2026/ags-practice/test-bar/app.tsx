import app from "ags/gtk4/app";
import { Astal } from "ags/gtk4";
import { createPoll } from "ags/time";
import style from "./style.scss";

app.start({
  css: style,
  main() {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
    const clock = createPoll("", 1000, "date");

    return (
      <window layer={Astal.Layer.TOP} exclusivity={Astal.Exclusivity.EXCLUSIVE} visible anchor={TOP | LEFT | RIGHT}>
        <label label={clock}/>
      </window>
    )
  }
})