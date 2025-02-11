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

export default function Bar(
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

  const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
    State.wallpaper,
    -1,
    300,
    true,
  );
  const picture = Gtk.Picture.new_for_pixbuf(pixbuf);

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
        <Frame>{picture}</Frame>
        <box
          type="overlay"
          spacing={6}
          hexpand
          orientation={Gtk.Orientation.VERTICAL}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          cssClasses={loginStep((b) => (b ? ["dim"] : []))}
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
          <button hexpand onClicked={login}>
            login
          </button>
        </box>
      </overlay>
    </window>
  );
}
