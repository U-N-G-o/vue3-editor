module.exports = {
  // devServer: {
  //   overlay: {
  //     warnings: false, //不显示警告
  //     errors: false	//不显示错误
  //   }
  // },
  // lintOnSave: false, //关闭eslint检查
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue3-editor/'
    : '/'
}