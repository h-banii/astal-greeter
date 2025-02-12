import { Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk4";

import State from "../../state";

export default function Sessions() {
  const showSelector = Variable(false);

  return (
    <box
      cssName="Sessions"
      halign={Gtk.Align.START}
      valign={Gtk.Align.START}
      spacing={12}
    >
      <button
        cssClasses={["display"]}
        name="display"
        label={State.selected_session(
          (session: number) => State.sessions[session].name,
        )}
        onClicked={() => {
          if (State.sessions.length > 1) showSelector.set(!showSelector.get());
        }}
      />
      <revealer
        revealChild={showSelector()}
        transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
      >
        <box spacing={6} cssClasses={["select"]} name="select">
          <label label="▸" />
          {State.sessions.map((session: { name: string }, index: number) => (
            <button
              label={session.name}
              onClicked={() => {
                State.selected_session.set(index);
                showSelector.set(false);
              }}
            />
          ))}
        </box>
      </revealer>
    </box>
  );
}
