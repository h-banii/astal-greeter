import Gio from "gi://Gio";
import { App, Astal, Gtk, Gdk, astalify, ConstructProps } from "astal/gtk4";
import { bind, Variable } from "astal";
import State from "../../state";
import { Frame, Image } from "../../widgets";
import NotificationState from "./types";
export { default as NotificationState } from "./types";

export const NotificationAction = {
  Dismiss: { state: "hidden" } as const satisfies NotificationState,
  Logging: {
    state: "logging",
    icon: "TODO",
  } as const satisfies NotificationState,
  Loading: (message: string | undefined = undefined) =>
    ({ state: "loading", message }) as NotificationState,
  Error: (message: string | undefined = undefined) =>
    ({ state: "error", message }) as NotificationState,
};

export default function Notify(notification: Variable<NotificationState>) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;

  return (
    <window
      visible={notification((ns) => ns.state != "hidden")}
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      cssName="Notify"
      application={App}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval, keycode, state) => {
        if (notification.get().state == "logging") return;
        notification.set(NotificationAction.Dismiss);
      }}
    >
      <overlay>
        <box cssName="background" cssClasses={notification((n) => [n.state])} />
        <Frame
          type="overlay"
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
        >
          <box>
            <Image
              widthRequest={200}
              heightRequest={200}
              setup={(self) => {
                const paintable = Gtk.MediaFile.new_for_filename(
                  State.loading_icon,
                );
                paintable.set_loop(true);
                paintable.play();
                self.paintable = paintable;
              }}
            />
            <label
              visible={notification(
                (n) =>
                  "message" in n &&
                  typeof n.message != "undefined" &&
                  n.message.length > 0,
              )}
              label={notification((s) => {
                switch (s.state) {
                  case "error":
                  case "loading":
                    return `${s.message}`;
                  case "logging":
                    // TODO: Display custom message and/or icon
                    return "";
                }
                return "";
              })}
            />
          </box>
        </Frame>
      </overlay>
    </window>
  );
}
