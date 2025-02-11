import Gio from "gi://Gio";
import {
  App,
  Astal,
  Gtk,
  Gdk,
  astalify,
  type ConstructProps,
} from "astal/gtk4";
import { bind, Variable } from "astal";

type PictureProps = ConstructProps<Gtk.Picture, Gtk.Picture.ConstructorProps>;
const Picture = astalify<Gtk.Picture, Gtk.Picture.ConstructorProps>(
  Gtk.Picture,
);

export default function Background(
  gdkmonitor: Gdk.Monitor,
  loginStep: Variable<boolean>,
) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;

  return (
    <window
      visible
      layer={Astal.Layer.BACKGROUND}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      cssClasses={["Background"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.IGNORE}
      application={App}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressed={(self, keyval, keycode, state) => {
        switch (keyval) {
          case Gdk.KEY_Return:
          case Gdk.KEY_space:
            loginStep.set(true);
        }
      }}
    >
      <Picture
        cssClasses={loginStep((b) => (b ? ["blur"] : []))}
        contentFit={Gtk.ContentFit.COVER}
        file={Gio.file_new_for_path(
          "/home/hbanii/wallpapers/Houshou Marine/darjeeling.png",
        )}
      />
    </window>
  );
}
