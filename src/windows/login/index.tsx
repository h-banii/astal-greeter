import {
  App,
  Astal,
  Gtk,
  Gdk,
  astalify,
  type ConstructProps,
} from "astal/gtk4";
import { bind, Gio, Variable } from "astal";
import AstalGreet from "gi://AstalGreet";
import Picture from "../../widgets/picture";
import State from "../../state";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";

type PasswordEntryProps = ConstructProps<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>;
const PasswordEntry = astalify<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>(Gtk.PasswordEntry, {});

type FrameProps = ConstructProps<Gtk.Frame, Gtk.Frame.ConstructorProps>;
const Frame = astalify<Gtk.Frame, Gtk.Frame.ConstructorProps>(Gtk.Frame, {});

export default function Login(
  gdkmonitor: Gdk.Monitor,
  loginStep: Variable<boolean>,
) {
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
      cssClasses={["Login"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
    >
      <overlay halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        <box cssClasses={["gradient"]}>
          <label
            cssClasses={["logo"]}
            halign={Gtk.Align.START}
            valign={Gtk.Align.END}
          >
            NixOS
          </label>
        </box>
        <Frame
          type="overlay"
          halign={Gtk.Align.END}
          valign={Gtk.Align.END}
          cssClasses={["entries-container"]}
        >
          <box
            spacing={6}
            orientation={Gtk.Orientation.VERTICAL}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
            vexpand
          >
            <entry
              placeholderText="username"
              onActivate={(self) => (username = self.text)}
            />
            <PasswordEntry
              placeholderText="password"
              onActivate={(self) => {
                password = self.text;
                login();
              }}
            />
            <button onClicked={login}>login</button>
          </box>
        </Frame>
      </overlay>
    </window>
  );
}
