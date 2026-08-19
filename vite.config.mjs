import { defineConfig, loadEnv, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

const serializeEnvValue = value =>
  value === undefined ? "undefined" : JSON.stringify(value);

const transformJsWithJsx = environmentDefines => ({
  name: "transform-js-with-jsx",
  enforce: "pre",
  async transform(code, id) {
    const sourcePath = id.split("?", 1)[0];
    if (!/\/src\/.*\.js$/.test(sourcePath)) {
      return null;
    }

    return transformWithOxc(code, sourcePath, {
      define: environmentDefines,
      lang: "jsx",
      jsx: {
        runtime: "classic"
      }
    });
  }
});

export default defineConfig(({ command, mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "");
  const publicUrl = process.env.PUBLIC_URL ?? loadedEnv.PUBLIC_URL ?? "";
  const reactAppTest =
    process.env.REACT_APP_TEST ?? loadedEnv.REACT_APP_TEST;
  const environmentDefines = {
    "process.env.NODE_ENV": JSON.stringify(
      command === "build" ? "production" : "development"
    ),
    "process.env.PUBLIC_URL": JSON.stringify(publicUrl),
    "process.env.REACT_APP_TEST": serializeEnvValue(reactAppTest)
  };

  return {
    base: publicUrl || "/",
    plugins: [
      transformJsWithJsx(environmentDefines),
      react({
        include: /\.[jt]sx?$/,
        jsxRuntime: "classic"
      })
    ],
    define: environmentDefines,
    optimizeDeps: {
      rolldownOptions: {
        moduleTypes: {
          ".js": "jsx"
        }
      }
    },
    build: {
      outDir: "build"
    },
    server: {
      port: 3006
    },
    preview: {
      port: 3006
    }
  };
});
