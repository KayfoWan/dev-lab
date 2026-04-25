import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Corners from "./widget/Corners"

app.start({
  css: style,
  main() {
    app.get_monitors().map(Bar)
    app.get_monitors().map(Corners)
  },
})
