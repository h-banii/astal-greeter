import { execAsync, GLib } from "astal";

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
  vendor_name: GLib.get_os_info("VENDOR_NAME"),
};

if (
  State.wallpaper == wallpaper_path &&
  !GLib.file_test(wallpaper_path, GLib.FileTest.EXISTS)
) {
  const nekosapi_get_random_image_file = (rating: string[] = []) =>
    rating.length > 0
      ? `https://api.nekosapi.com/v4/images/random/file?rating=${rating.join(",")}`
      : `https://api.nekosapi.com/v4/images/random/file`;
  await execAsync([
    "bash",
    "-c",
    `curl -L '${nekosapi_get_random_image_file(["safe", "suggestive"])}' > ${wallpaper_path}`,
  ]).catch(printerr);
}

export default State;
