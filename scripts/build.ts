import { chmod, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const outdir = join(root, "dist");
const result = await Bun.build({
  entrypoints: [join(root, "src/index.ts")],
  outdir,
  target: "bun",
  external: ["protobufjs"],
  naming: "sim.js",
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

const launcher = join(outdir, "sim");
await writeFile(launcher, "#!/usr/bin/env bun\nimport \"./sim.js\";\n");
await chmod(launcher, 0o755);
console.log(`Built ${launcher}`);
