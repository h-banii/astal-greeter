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

import Options from "./options";

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
  showLoginPopup: Variable<boolean>,
) {
  let username = "";
  let password = "";

  const login = () =>
    AstalGreet.login(
      username,
      password,
      State.sessions.at(State.selected_session)?.cmd ?? ":",
      (_, res) => {
        if (State.debug) {
          App.quit();
          return;
        }
        try {
          AstalGreet.login_finish(res);
          // TODO: Show loading widget ?
        } catch (err) {
          // TODO: Show error popup
          printerr(err);
        }
      },
    );

  return (
    <window
      visible={showLoginPopup((t) => t)}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval, keycode, state) => {
        if (keyval == Gdk.KEY_Escape) showLoginPopup.set(false);
      }}
      cssClasses={["Login"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
    >
      <centerbox
        vexpand
        halign={Gtk.Align.CENTER}
        orientation={Gtk.Orientation.VERTICAL}
      >
        <menubutton cssClasses={["session-button"]}>
          <label
            hexpand={false}
            label={State.selected_session(
              (session: number) => State.sessions[session].name,
            )}
          />
          <popover halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
            <box orientation={Gtk.Orientation.VERTICAL}>
              {State.sessions.map((session: { name: string }) => (
                <button label={session.name} />
              ))}
            </box>
          </popover>
        </menubutton>
        <Frame
          cssClasses={["radial-gradient"]}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        >
          <Frame cssClasses={["gradient"]}>
            <box>
              <Frame
                halign={Gtk.Align.START}
                vexpand
                cssClasses={["login-container"]}
              >
                <box
                  spacing={7}
                  orientation={Gtk.Orientation.VERTICAL}
                  halign={Gtk.Align.START}
                  valign={Gtk.Align.CENTER}
                  vexpand
                >
                  <label cssClasses={["vendor-name"]} halign={Gtk.Align.CENTER}>
                    {State.vendor_name}
                  </label>
                  <entry
                    placeholderText="username"
                    onChanged={(self) => (username = self.text)}
                  />
                  <PasswordEntry
                    placeholderText="password"
                    onChanged={(self) => {
                      password = self.text;
                    }}
                    onActivate={login}
                  />
                  <button cssClasses={["login-button"]} onClicked={login}>
                    login
                  </button>
                </box>
              </Frame>
              <Frame hexpand vexpand cssClasses={["icon"]}></Frame>
            </box>
          </Frame>
        </Frame>
        {Options(gdkmonitor, showLoginPopup)}
      </centerbox>
    </window>
  );
}
