import { exec, GLib } from "astal";
import State from "../state";

const static_path = `${SRC}/src/style`;
const dynamic_path = `/tmp/greeter`;

const colors = JSON.parse(exec(`matugen image '${State.wallpaper}' --json hex`))
  .colors.light;

const colors_scss = Object.entries(colors).reduce(
  (acc, [key, value]) => `$${key}: ${value}; ${acc}`,
  `$font_family: "${State.font_family}"; $wallpaper: "file://${State.wallpaper}"`,
);

exec([
  "bash",
  "-c",
  `mkdir -p /tmp/greeter; printf '${colors_scss}' >${dynamic_path}/dynamic.scss`,
]);

export default exec(
  `sass ${static_path}/index.scss --no-source-map --load-path=${static_path} --load-path=${dynamic_path}`,
);
