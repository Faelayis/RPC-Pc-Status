/* eslint-disable no-undef */
const path = require("path");

module.exports = {
  packagerConfig: {
    productName: "RPC Pc Status",
    appId: "rpc-pc-status",
    asar: true,
    icon: path.join(__dirname, "/build/icon.ico"),
    ignore: [
      ".eslintrc",
      ".gitattributes",
      ".gitignore",
      ".prettierignore",
      ".assets",
      "docs",
      "node_modules/prettier",
      "node_modules/eslint",
      "node_modules/eslint-scope",
      "node_modules/eslint-utils",
      "node_modules/eslint-visitor-keys",
      "node_modules/electromon",
      "electron-builder.yml",
      "dev-app-update.yml",
      "README.md",
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        title: "RPC Pc Status",
        iconUrl:
          "https://raw.githubusercontent.com/Faelayis/RPC-Pc-Status/master/build/icon.ico",
        setupIcon: path.join(__dirname, "/build/icon.ico"),
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux", "win32"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Faelayis",
          name: "RPC-Pc-Status",
        },
        draft: false,
      },
    },
  ],
};
