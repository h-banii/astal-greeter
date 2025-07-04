import { execAsync, GLib, readFileAsync, Variable } from "astal";

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

const DEBUG = !GLib.getenv("GREETD_SOCK");
const TMP = DEBUG ? "/tmp/greeter-debug" : "/tmp/greeter";
const wallpaper_path = `${TMP}/wallpaper`;

const State = Object.assign(
  {
    wallpaper: wallpaper_path,
    font_family: "",
    icon: "",
    shutdown_icon: `${SRC}/icons/shutdown.svg`,
    restart_icon: `${SRC}/icons/restart.svg`,
    sleep_icon: `${SRC}/icons/sleep.svg`,
    loading_icon: `${SRC}/gura.webm`,
    logging_icon: `${SRC}/gura.webm`,
    vendor_name: GLib.get_os_info("VENDOR_NAME"),
    sessions: [
      { name: "Hyprland", cmd: "uwsm start -- hyprland.desktop" },
      { name: "Do nothing", cmd: ":" },
    ],
    selected_session: Variable(0),
    debug: DEBUG,
    darkMode: false,
    tmp: TMP,
  },
  config,
);

export default State;
