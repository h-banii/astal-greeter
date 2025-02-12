import { execAsync, GLib, readFileAsync } from "astal";

// State values are defined from CLI or from envvar
// ags run -d WALLPAPER="'/path/to/file'"
// WALLPAPER=/path/to/file ags run

const config_path = GLib.getenv("H_BANII_GREET_CONFIG");
const config =
  config_path != null
    ? await readFileAsync(config_path)
        .then(JSON.parse)
        .then((obj) =>
          Object.fromEntries(Object.entries(obj).filter(([a, v]) => v != null)),
        )
        .catch((e) => {
          printerr(e);
          return {};
        })
    : {};

const wallpaper_path = "/tmp/greeter/wallpaper";

const State = Object.assign(
  {
    wallpaper: wallpaper_path,
    font_family: "",
    icon: "",
    shutdown_icon: `${SRC}/icons/shutdown.svg`,
    restart_icon: `${SRC}/icons/restart.svg`,
    sleep_icon: `${SRC}/icons/sleep.svg`,
    vendor_name: GLib.get_os_info("VENDOR_NAME"),
    sessions: [
      { name: "Hyprland", cmd: "uwsm start -- hyprland.desktop" },
      { name: "Do nothing", cmd: ":" },
    ],
    selected_session: 0,
    debug: false,
    tmp: "/tmp/greeter",
  },
  config,
);

if (State.debug) State.tmp = "/tmp/greeter-debug";

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
