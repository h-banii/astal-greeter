import { App, Gtk, Gdk } from "astal/gtk4";
import css from "./style.scss";
import Login from "./windows/login";

function main() {
  const windows = new Map<Gdk.Monitor, Gtk.Widget[]>();

  const add_windows = (gdkmonitor: Gdk.Monitor) =>
    windows.set(gdkmonitor, [Login(gdkmonitor)]);

  App.get_monitors().map(add_windows);
}

App.start({
  css,
  main,
});
