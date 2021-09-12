/* eslint-disable no-undef */
module.exports = {
  packagerConfig: {
    productName: "RPC Pc Status",
    appId: "rpc-pc-status",
    asar: true,
    icon: __dirname + "/build/icon.icns",
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
        iconUrl: __dirname + "/build/icon.ico",
        setupIcon: __dirname + "/build/icon.ico",
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
