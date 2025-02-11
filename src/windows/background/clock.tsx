import { exec, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

export default function Clock(gdkmonitor: Gdk.Monitor) {
  const time = Variable("").poll(1000, "date '+%H:%m'");

  return (
    <box
      cssName="Clock"
      orientation={Gtk.Orientation.VERTICAL}
      halign={Gtk.Align.START}
      valign={Gtk.Align.END}
      spacing={0}
    >
      <label cssClasses={["time"]} halign={Gtk.Align.START} label={time()} />
      <label cssClasses={["date"]}>{exec("date '+%A, %B %d'")}</label>
    </box>
  );
}
