import { App, Gtk, Gdk } from "astal/gtk4";
import css from "./style";
import Login from "./windows/login";
import Background from "./windows/background";
import { execAsync, GLib, Variable } from "astal";
import State from "./state";
import Fetch from "./fetch";

function main() {
  const windows = new Map<Gdk.Monitor, Gtk.Widget[]>();

  const add_windows = (gdkmonitor: Gdk.Monitor) => {
    const showLoginPopup = Variable(false);
    const login = Login(gdkmonitor, showLoginPopup);
    const background = Background(gdkmonitor, showLoginPopup);
    windows.set(gdkmonitor, [login, background]);
  };

  if (!GLib.file_test(State.wallpaper, GLib.FileTest.EXISTS)) {
    notification.set(NotificationAction.Loading("Fetching wallpaper..."));
    execAsync([
      "bash",
      "-c",
      `curl -L '${Fetch.NekosAPI(["safe", "suggestive"])}' > ${State.wallpaper}`,
    ]).catch(printerr);
  }

  App.get_monitors().reverse().map(add_windows);
}

App.start({
  css,
  main,
});
