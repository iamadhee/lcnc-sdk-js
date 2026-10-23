import { build } from 'vite'
import * as path from 'path';
import { rmSync } from 'fs';

const libraryModules = [
  {
    entry: path.resolve(__dirname, "src/index.ts"),
    name: "kf",
    fileName: (format) => `kfsdk.${format}.js`,
  },
  {
    entry: path.resolve(__dirname, "src/lowcode.ts"),
    name: "KFSDK",
    fileName: (format) => `kf.lowcodeworkersdk.${format}.js`,
    formats: ["es"],
  },
  {
    entry: path.resolve(__dirname, "src/nocode.ts"),
    name: "KFSDK",
    fileName: (format) => `kf.nocodeworkersdk.${format}.js`,
    formats: ["es"],
  },
];

// Empty dist/ once here; every build below must leave the others' output alone.
rmSync(path.resolve(__dirname, "dist"), { recursive: true, force: true });

(async () => {
  for (const libConfig of libraryModules) {
    await build({
      configFile: false,
      build: {
        lib: libConfig,
        emptyOutDir: false,
      }
    });
  }
})();

// `vite build` loads this file and then builds index.html with this config.
export default {
  build: {
    emptyOutDir: false,
  },
};
