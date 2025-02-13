import { astalify, Gtk, type ConstructProps } from "astal/gtk4";

type FrameProps = ConstructProps<Gtk.Frame, Gtk.Frame.ConstructorProps>;
export default astalify<Gtk.Frame, Gtk.Frame.ConstructorProps>(Gtk.Frame, {});
