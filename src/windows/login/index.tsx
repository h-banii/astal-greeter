import {
  App,
  Astal,
  Gtk,
  Gdk,
  astalify,
  type ConstructProps,
} from "astal/gtk4";
import { bind, Variable } from "astal";
import AstalGreet from "gi://AstalGreet";

type PasswordEntryProps = ConstructProps<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>;
const PasswordEntry = astalify<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>(Gtk.PasswordEntry, {});

export default function Bar(
  gdkmonitor: Gdk.Monitor,
  loginStep: Variable<boolean>,
) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
  let username = "";
  let password = "";

  const login = () =>
    AstalGreet.login(username, password, "Hyprland", (_, res) => {
      try {
        AstalGreet.login_finish(res);
      } catch (err) {
        // TODO: Better error handling (if even possible...)
        const message = `${err}`;
        if (message.includes("socket not found")) {
          App.quit();
        } else {
          // TODO: Show error popup
          printerr(err);
        }
      }
    });

  return (
    <window
      visible={loginStep((t) => t)}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval, keycode, state) => {
        if (keyval == Gdk.KEY_Escape) loginStep.set(false);
      }}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      cssClasses={["Login"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
    >
      <box
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        spacing={6}
        orientation={Gtk.Orientation.VERTICAL}
        cssName="centerbox"
        cssClasses={loginStep((b) => (b ? ["dim"] : []))}
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
