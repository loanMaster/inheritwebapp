module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].userFrontTenant = process.env.USER_FRONT_TENANT;
      return args;
    });
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  productionSourceMap: false,
};
