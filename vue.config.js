const path = require('path')
const pxtovw = require('postcss-px-to-viewport')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/backpacker/',
  outputDir: 'docs',
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      postcss: {
        plugins: [
          new pxtovw({
            viewportWidth: 375,
            exclude: /\\src\\/,
          }),
          require('autoprefixer'),
        ],
      },
    },
  },
  chainWebpack: config => {
    // config.resolve.alias.set('@three', resolve('src/assets/threejs'))

    config.resolve.alias.set('@three', resolve('src/assets/three'))
    config.plugin('html').tap(args => {
      args[0].title = '大富翁自由行'
      return args
    })
  },
  // chainWebpack: (config) => {
  //   config.resolve.alias.set('@three', resolve('src/assets/threejs'))
  // },
}
