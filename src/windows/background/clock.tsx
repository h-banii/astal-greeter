import { exec, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

export default function Clock(
  gdkmonitor: Gdk.Monitor,
  showLoginPopup: Variable<boolean>,
) {
  const time = Variable("").poll(1000, "date '+%H:%M'");

  return (
    <box
      cssName="Clock"
      orientation={Gtk.Orientation.HORIZONTAL}
      valign={Gtk.Align.END}
      spacing={16}
      cssClasses={showLoginPopup((b) => (b ? ["vanish"] : []))}
    >
      <label cssClasses={["time"]} valign={Gtk.Align.END} label={time()} />
      <label cssClasses={["date"]} valign={Gtk.Align.END}>
        {exec("date '+%A, %B %d'")}
      </label>
    </box>
  );
}
