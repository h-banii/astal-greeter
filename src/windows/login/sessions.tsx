import { Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

import State from "../../state";

export default function Sessions() {
  const visibleChildName = Variable("display");

  return (
    <stack
      cssName="Sessions"
      halign={Gtk.Align.CENTER}
      visibleChildName={visibleChildName()}
    >
      <button
        cssClasses={["display"]}
        name="display"
        label={State.selected_session(
          (session: number) => State.sessions[session].name,
        )}
        onClicked={() => visibleChildName.set("select")}
      />
      <box spacing={20} cssClasses={["select"]} name="select">
        {State.sessions.map((session: { name: string }, index: number) => (
          <button
            label={session.name}
            onClicked={() => {
              State.selected_session.set(index);
              visibleChildName.set("display");
            }}
          />
        ))}
      </box>
    </stack>
  );
}
