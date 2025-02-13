import Gio from "gi://Gio";
import { App, Astal, Gtk, Gdk, astalify } from "astal/gtk4";
import { bind, Variable } from "astal";
import State from "../../state";

// export interface Notification {
//   show: boolean,
//   message: string,
// }
type NotificationLoadingState = {
  state: "loading";
  message: string;
};

type NotificationErrorState = {
  state: "error";
  message: string;
};

type NotificationLoggingState = {
  state: "logging";
  icon: string;
};

type NotificationHiddenState = {
  state: "hidden";
};

export type NotificationState =
  | NotificationLoggingState
  | NotificationLoadingState
  | NotificationErrorState
  | NotificationHiddenState;

export const NotificationAction = {
  Dismiss: { state: "hidden" } as const satisfies NotificationState,
  Logging: {
    state: "logging",
    icon: "TODO",
  } as const satisfies NotificationState,
  Loading: (message: string) =>
    ({ state: "loading", message }) as NotificationState,
  Error: (message: string) =>
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
      <label
        vexpand
        hexpand
        halign={Gtk.Align.CENTER}
        label={notification((s) => {
          switch (s.state) {
            case "error":
            case "loading":
              return s.message;
            case "logging":
              // TODO: Display custom message and/or icon
              return "";
          }
          return "";
        })}
      />
    </window>
  );
}
