import { astalify, Gtk, type ConstructProps } from "astal/gtk4";

type PictureProps = ConstructProps<Gtk.Picture, Gtk.Picture.ConstructorProps>;
export default astalify<Gtk.Picture, Gtk.Picture.ConstructorProps>(Gtk.Picture);
