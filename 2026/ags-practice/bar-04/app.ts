import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import DesktopGraphs from "./widget/DesktopGraphs"
import DesktopWidgets from "./widget/DesktopWidgets"

app.start({
  css: style,
  main() {
    app.get_monitors().map((monitor) => Bar(monitor))
    app.get_monitors().map((monitor) => DesktopGraphs(monitor))
    app.get_monitors().map((monitor) => DesktopWidgets(monitor))
  },
})
