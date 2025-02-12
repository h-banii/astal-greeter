import { execAsync, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

export default function Options() {
  return (
    <box
      cssName="Options"
      orientation={Gtk.Orientation.HORIZONTAL}
      valign={Gtk.Align.END}
      halign={Gtk.Align.CENTER}
      spacing={16}
    >
      <button
        cssClasses={["sleep"]}
        onClicked={() => execAsync("systemctl suspend")}
      />
      <button
        cssClasses={["restart"]}
        onClicked={() => execAsync("systemctl reboot")}
      />
      <button
        cssClasses={["shutdown"]}
        onClicked={() => execAsync("systemctl poweroff")}
      />
    </box>
  );
}
