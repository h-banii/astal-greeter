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
import State from "../../state";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";

import { Frame } from "../../widgets";
import Options from "./options";
import Sessions from "./sessions";
import { NotificationAction, NotificationState } from "../notify";

type PasswordEntryProps = ConstructProps<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>;
const PasswordEntry = astalify<
  Gtk.PasswordEntry,
  Gtk.PasswordEntry.ConstructorProps
>(Gtk.PasswordEntry, {});

export default function Login(
  gdkmonitor: Gdk.Monitor,
  showLoginPopup: Variable<boolean>,
  notification: Variable<NotificationState>,
) {
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  let username = "";
  let password = "";

  const login = () =>
    AstalGreet.login(
      username,
      password,
      State.sessions.at(State.selected_session)?.cmd ?? ":",
      (_, res) => {
        if (State.debug) {
          notification.set(NotificationAction.Loading("Quitting..."));
          setTimeout(() => {
            App.quit();
          }, 3000);
          return;
        }
        try {
          AstalGreet.login_finish(res);
          notification.set(NotificationAction.Logging);
        } catch (err) {
          notification.set(NotificationAction.Error(`${err}`));
          printerr(err);
        }
      },
    );

  return (
    <window
      visible={showLoginPopup((t) => t)}
      layer={Astal.Layer.TOP}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval, keycode, state) => {
        if (keyval == Gdk.KEY_Escape) showLoginPopup.set(false);
      }}
      anchor={BOTTOM | TOP | LEFT | RIGHT}
      cssClasses={["Login"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
    >
      <centerbox orientation={Gtk.Orientation.VERTICAL}>
        <Sessions />
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
                  {(() => {
                    const usernameEntry = (
                      <entry
                        onDestroy={showLoginPopup.subscribe(() =>
                          usernameEntry.grab_focus(),
                        )}
                        placeholderText="username"
                        onChanged={(self) => (username = self.text)}
                      />
                    );
                    return usernameEntry;
                  })()}
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
        <Options />
      </centerbox>
    </window>
  );
}
