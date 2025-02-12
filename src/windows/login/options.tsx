import { exec, execAsync, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

export default function Options(
  gdkmonitor: Gdk.Monitor,
  showLoginPopup: Variable<boolean>,
) {
  const time = Variable("").poll(1000, "date '+%H:%M'");

  return (
    <box
      type="overlay"
      cssName="Options"
      orientation={Gtk.Orientation.HORIZONTAL}
      valign={Gtk.Align.END}
      halign={Gtk.Align.CENTER}
      spacing={16}
      cssClasses={showLoginPopup((b) => (b ? ["vanish"] : []))}
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
