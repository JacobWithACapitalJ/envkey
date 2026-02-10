import * as path from "path";
import * as webpack from "webpack";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import * as child_process from "child_process";

const env = process.env.NODE_ENV ?? "development";

console.log("electron webpack env:", env);

const externals: webpack.Configuration["externals"] = [
  /worker\.js/,
  "bufferutil",
  "utf-8-validate",
  /keytar/,
];

if (env !== "production") {
  // in prod, will be copied into the desktop bundle
  // Use local node_modules which pnpm symlinks to the actual location
  const devKeytar = path.resolve(
    __dirname,
    "node_modules/keytar/build/Release/keytar.node"
  );
  const distFolder = path.resolve(__dirname, "./dist/keytar.node");
  child_process.execSync(`mkdir -p ${path.resolve(__dirname, "dist")}`);
  // Only copy if the file exists (may not exist in all environments)
  try {
    child_process.execSync(`cp ${devKeytar} ${distFolder}`);
  } catch (e) {
    console.warn("Could not copy keytar.node - may need to rebuild native modules");
  }
}

const config: webpack.Configuration = {
  mode: "production",
  entry: { bundle: "./src/main.ts" },
  target: "electron-main",
  devtool: "hidden-source-map",
  optimization: {
    minimize: env == "production",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  externals,
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: env,
      ...(env == "production"
        ? {
            // in electron, things are relative to process.resourcesPath, which is only available at runtime
            // and we cannot reuse it the same as WORKER_PATH
            WORKER_PATH_FROM_ELECTRON_RESOURCES: "app/worker.js",
            BIN_PATH_FROM_ELECTRON_RESOURCES: "app/bin",
            ICON_DIR_FROM_ELECTRON_RESOURCES: "app/icon",
          }
        : {
            WORKER_PATH: "./worker.js",
            BIN_PATH: "./bin",
            ICON_DIR: "./icon",
          }),
    }),
  ],
  ignoreWarnings: [
    // Ignore warnings due to yarg's dynamic module loading
    { module: /node_modules\/yargs/ },
    // and express `Critical dependency: the request of a dependency is an expression` due to similar dynamic require
    { module: /node_modules\/express/ },
    // circular deps
    { module: /node_modules\/is-reachable/ },
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".node"],
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};

export default config;
