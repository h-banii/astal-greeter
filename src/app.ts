import { App, Gtk, Gdk } from "astal/gtk4";
import css from "./style/index.scss";
import Login from "./windows/login";
import Background from "./windows/background";
import { Variable } from "astal";

function main() {
  const windows = new Map<Gdk.Monitor, Gtk.Widget[]>();

  const add_windows = (gdkmonitor: Gdk.Monitor) => {
    const loginStep = Variable(false);
    const login = Login(gdkmonitor, loginStep);
    const background = Background(gdkmonitor, loginStep);
    windows.set(gdkmonitor, [login, background]);
  };

  App.get_monitors().map(add_windows);
}

App.start({
  css,
  main,
});
