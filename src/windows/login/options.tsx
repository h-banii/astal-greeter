import { execAsync, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

import Frame from "../../widgets/frame";

export default function Options() {
  return (
    <box
      cssName="Options"
      orientation={Gtk.Orientation.HORIZONTAL}
      valign={Gtk.Align.END}
      halign={Gtk.Align.CENTER}
    >
      <Frame>
        <button
          cssClasses={["sleep"]}
          onClicked={() => execAsync("systemctl suspend")}
        />
      </Frame>
      <Frame>
        <button
          cssClasses={["restart"]}
          onClicked={() => execAsync("systemctl reboot")}
        />
      </Frame>
      <Frame>
        <button
          cssClasses={["shutdown"]}
          onClicked={() => execAsync("systemctl poweroff")}
        />
      </Frame>
    </box>
  );
}
