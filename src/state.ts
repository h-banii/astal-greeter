import { GLib } from "astal";

// State values are defined from CLI or from envvar
// ags run -d WALLPAPER="'/path/to/file'"
// WALLPAPER=/path/to/file ags run

export default {
  wallpaper:
    typeof WALLPAPER != "undefined"
      ? WALLPAPER
      : (GLib.getenv("H_BANII_GREET_WALLPAPER") ??
        "/home/hbanii/wallpapers/Houshou Marine/darjeeling.png"),
};
