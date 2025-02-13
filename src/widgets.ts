import { astalify, Gtk, type ConstructProps } from "astal/gtk4";

type FrameProps = ConstructProps<Gtk.Frame, Gtk.Frame.ConstructorProps>;
export const Frame = astalify<Gtk.Frame, Gtk.Frame.ConstructorProps>(Gtk.Frame);

type PictureProps = ConstructProps<Gtk.Picture, Gtk.Picture.ConstructorProps>;
export const Picture = astalify<Gtk.Picture, Gtk.Picture.ConstructorProps>(
  Gtk.Picture,
);

type ImageProps = ConstructProps<Gtk.Image, Gtk.Image.ConstructorProps>;
export const Image = astalify<Gtk.Image, Gtk.Image.ConstructorProps>(Gtk.Image);
