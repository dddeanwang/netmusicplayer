module.exports = {
    publicPath: './',
    configureWebpack: {
      resolve: {
        alias: { //配置别名,修改后需要重新编译才能生效
          'src/': '@/',
        }
      }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "~@/assets/variables.scss";
          @import "~@/assets/mixin.scss";
        `,
      },
    },
  },



  }



