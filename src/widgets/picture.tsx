import { astalify, Gtk, type ConstructProps } from "astal/gtk4";

type PictureProps = ConstructProps<Gtk.Picture, Gtk.Picture.ConstructorProps>;
const Picture = astalify<Gtk.Picture, Gtk.Picture.ConstructorProps>(
  Gtk.Picture,
);

export default Picture;
