import Greet from "gi://AstalGreet";
import {
  App,
  Astal,
  Gtk,
  Gdk,
  astalify,
  type ConstructProps,
} from "astal/gtk4";
import { Variable } from "astal";

type PasswordEntryProps = ConstructProps<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>;
const PasswordEntry = astalify<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>(Gtk.PasswordEntry, {});

export default function Bar(gdkmonitor: Gdk.Monitor) {
  let username = "";
  let password = "";

  const login = () =>
    Greet.login(username, password, "Hyprland", (_, res) => {
      try {
        Greet.login_finish(res);
      } catch (err) {
        // TODO: Show error popup
        printerr(err);
      }
    });

  return (
    <window
      visible
      keymode={Astal.Keymode.ON_DEMAND}
      cssClasses={["Login"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
    >
      <box
        spacing={6}
        orientation={Gtk.Orientation.VERTICAL}
        cssName="centerbox"
      >
        <entry
          hexpand
          placeholderText="username"
          onActivate={(self) => (username = self.text)}
          halign={Gtk.Align.CENTER}
        />
        <PasswordEntry
          hexpand
          placeholderText="password"
          onActivate={(self) => {
            password = self.text;
            login();
          }}
          halign={Gtk.Align.CENTER}
        />
        <button hexpand onClicked={login}>
          login
        </button>
      </box>
    </window>
  );
}
