import { App, Gtk, Gdk } from "astal/gtk4";
import css from "./style";
import Login from "./windows/login";
import Background from "./windows/background";
import { Variable } from "astal";

function main() {
  const windows = new Map<Gdk.Monitor, Gtk.Widget[]>();

  const add_windows = (gdkmonitor: Gdk.Monitor) => {
    const showLoginPopup = Variable(false);
    const login = Login(gdkmonitor, showLoginPopup);
    const background = Background(gdkmonitor, showLoginPopup);
    windows.set(gdkmonitor, [login, background]);
  };

  App.get_monitors().reverse().map(add_windows);
}

App.start({
  css,
  main,
});
