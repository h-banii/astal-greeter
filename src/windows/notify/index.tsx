import Gio from "gi://Gio";
import { App, Astal, Gtk, Gdk, astalify, ConstructProps } from "astal/gtk4";
import { bind, Variable } from "astal";
import State from "../../state";
import Picture from "../../widgets/picture";
import Frame from "../../widgets/frame";

type ImageProps = ConstructProps<Gtk.Image, Gtk.Image.ConstructorProps>;
const Image = astalify<Gtk.Image, Gtk.Image.ConstructorProps>(Gtk.Image, {});

type NotificationLoadingState = {
  state: "loading";
  message: string;
  icon: string | undefined;
};

type NotificationErrorState = {
  state: "error";
  message: string;
  icon: string | undefined;
};

type NotificationLoggingState = {
  state: "logging";
  icon: string | undefined;
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
      <Frame>
        <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
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
            vexpand
            hexpand
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
        </box>
      </Frame>
    </window>
  );
}
