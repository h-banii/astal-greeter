import Gio from "gi://Gio";
import { App, Astal, Gtk, Gdk, astalify } from "astal/gtk4";
import { bind, Variable } from "astal";
import State from "../../state";
import Clock from "./clock";
import Picture from "../../widgets/picture";

export default function Background(
  gdkmonitor: Gdk.Monitor,
  showLoginPopup: Variable<boolean>,
) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;

  return (
    <window
      visible
      layer={Astal.Layer.BACKGROUND}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      cssClasses={showLoginPopup((b) =>
        ["Background"].concat(b ? ["blur"] : []),
      )}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval, keycode, state) => {
        switch (keyval) {
          case Gdk.KEY_Return:
          case Gdk.KEY_space:
            showLoginPopup.set(true);
            break;
          case Gdk.KEY_Escape:
            showLoginPopup.set(false);
        }
      }}
    >
      <overlay>
        <Picture
          contentFit={Gtk.ContentFit.COVER}
          file={Gio.file_new_for_path(State.wallpaper)}
        />
        <box type="overlay" hexpand vexpand cssClasses={["gradient"]}></box>
        <box type="overlay">{Clock(gdkmonitor, showLoginPopup)}</box>
      </overlay>
    </window>
  );
}
