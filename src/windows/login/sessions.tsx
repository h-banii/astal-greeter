import { Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

import State from "../../state";

export default function Options() {
  return (
    <menubutton
      hexpand={false}
      halign={Gtk.Align.CENTER}
      cssClasses={["session-button"]}
    >
      <label
        hexpand={false}
        label={State.selected_session(
          (session: number) => State.sessions[session].name,
        )}
      />
      <popover halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        <box orientation={Gtk.Orientation.VERTICAL}>
          {State.sessions.map((session: { name: string }) => (
            <button label={session.name} />
          ))}
        </box>
      </popover>
    </menubutton>
  );
}
