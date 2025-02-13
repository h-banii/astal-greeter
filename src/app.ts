import { App, Gtk, Gdk } from "astal/gtk4";
import Style from "./style";
import Login from "./windows/login";
import Background from "./windows/background";
import Notify, {
  NotificationAction,
  NotificationState,
} from "./windows/notify";
import { execAsync, GLib, Variable } from "astal";
import State from "./state";
import Fetch from "./fetch";

async function main() {
  const windows = new Map<Gdk.Monitor, Gtk.Widget[]>();

  const notification: Variable<NotificationState> = Variable(
    NotificationAction.Dismiss,
  );
  const notify = Notify(notification);

  const add_windows = (gdkmonitor: Gdk.Monitor) => {
    const showLoginPopup = Variable(false);
    const login = Login(gdkmonitor, showLoginPopup, notification);
    const background = Background(gdkmonitor, showLoginPopup, notification);
    windows.set(gdkmonitor, [login, background]);
  };

  if (!GLib.file_test(State.wallpaper, GLib.FileTest.EXISTS)) {
    notification.set(NotificationAction.Loading("Fetching wallpaper..."));
    await execAsync([
      "bash",
      "-c",
      `curl -L '${Fetch.NekosAPI(["safe", "suggestive"])}' > ${State.wallpaper}`,
    ])
      .then(() => notification.set(NotificationAction.Dismiss))
      .catch((e) => notification.set(NotificationAction.Error(e)));
  }

  await Style.matugen()
    .catch((e) => {
      printerr("Sass failed:", e);
      return "";
    })
    .then((css) => App.apply_css(css));

  App.get_monitors().reverse().map(add_windows);
}

App.start({
  css: Style.css,
  main,
});
