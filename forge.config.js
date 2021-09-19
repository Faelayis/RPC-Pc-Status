const path = require("path");
const package = require("./package.json");
const app = {
  productName: "RPC Pc Status",
};

module.exports = {
  packagerConfig: {
    name: `${package.name}`,
    appId: `${package.name}`,
    productName: `${app.productName}`,
    CompanyName: `${package.author.name}`,
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
      "electron-builder.yml",
      "dev-app-update.yml",
      "README.md",
    ],
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      platforms: ["win32"],
      config: {
        iconUrl:
          "https://raw.githubusercontent.com/Faelayis/RPC-Pc-Status/master/build/icon.ico",
        setupIcon: path.join(__dirname, "/build/icon.ico"),
        setupExe: `${package.name}-${package.version}.Setup.exe`,
        title: `${app.productName}`,
        ProductName: `${app.productName}`,
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux", "win32"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        homepage: `${package.repository.url}`,
        icon: path.join(__dirname, "/build/icon.png"),
        name: `${package.name}`,
        productName: `${app.productName}`,
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        homepage: `${package.repository.url}`,
        icon: path.join(__dirname, "/build/icon.png"),
        name: `${package.name}`,
        productName: `${app.productName}`,
      },
    },
    {
      name: "electron-forge-maker-appimage",
      platforms: ["linux"],
      config: {
        name: `${package.name}`,
        productName: `${app.productName}`,
      },
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        name: `${package.name}-${package.version}`,
        format: "ULFO",
      },
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