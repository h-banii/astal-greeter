import { exec, GLib } from "astal";

// State values are defined from CLI or from envvar
// ags run -d WALLPAPER="'/path/to/file'"
// WALLPAPER=/path/to/file ags run

const wallpaper_path = "/tmp/greeter/wallpaper";

const State = {
  wallpaper:
    typeof WALLPAPER != "undefined"
      ? WALLPAPER
      : (GLib.getenv("H_BANII_GREET_WALLPAPER") ?? wallpaper_path),
  font_family: GLib.getenv("H_BANII_GREET_FONT_FAMILY") ?? "Maple Mono NF",
};

if (
  State.wallpaper == wallpaper_path &&
  !GLib.file_test(wallpaper_path, GLib.FileTest.EXISTS)
) {
  exec([
    "bash",
    "-c",
    `curl "$(curl 'https://api.nekosapi.com/v4/images/random?limit=1' | jq -r '.[].url')" > ${wallpaper_path}`,
  ]);
}

export default State;
