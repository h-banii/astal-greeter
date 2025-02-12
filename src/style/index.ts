import { execAsync, GLib } from "astal";
import State from "../state";
import colors_fallback from "./colors.json";

const static_path = `${SRC}/src/style`;
const dynamic_path = State.tmp;

const colors = await execAsync(
  `matugen image '${State.wallpaper}' --json hex --type scheme-fidelity`,
)
  .then(JSON.parse)
  .catch((e) => {
    printerr("Matugen failed:", e);
    return colors_fallback;
  })
  .then((v) => v.colors.light);

const colors_scss = Object.entries(colors).reduce(
  (acc, [key, value]) => `$${key}: ${value}; ${acc}`,
  `$font_family: "${State.font_family}"; ` +
    `$wallpaper: "file://${State.wallpaper}"; ` +
    `$icon: "file://${State.icon}"; ` +
    `$shutdown_icon: "file://${State.shutdown_icon}"; ` +
    `$sleep_icon: "file://${State.sleep_icon}"; ` +
    `$restart_icon: "file://${State.restart_icon}"`,
);

export default await execAsync([
  "bash",
  "-c",
  `mkdir -p ${dynamic_path}; printf '${colors_scss}' >${dynamic_path}/dynamic.scss ` +
    `&& sass ${static_path}/index.scss --no-source-map --load-path=${static_path} --load-path=${dynamic_path} ` +
    `&& rm ${dynamic_path}/dynamic.scss`,
]).catch((e) => {
  printerr("Sass failed:", e);
  return "";
});
