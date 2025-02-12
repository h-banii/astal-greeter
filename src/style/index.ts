import { execAsync, GLib } from "astal";
import State from "../state";
import colors_fallback from "./colors.json";

const static_path = `${SRC}/src/style`;
const dynamic_path = `/tmp/greeter`;

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
  `$font_family: "${State.font_family}"; $wallpaper: "file://${State.wallpaper}"`,
);

await execAsync([
  "bash",
  "-c",
  `mkdir -p /tmp/greeter; printf '${colors_scss}' >${dynamic_path}/dynamic.scss`,
]);

export default await execAsync(
  `sass ${static_path}/index.scss --no-source-map --load-path=${static_path} --load-path=${dynamic_path}`,
).catch((e) => {
  printerr("Sass failed:", e);
  return "";
});
