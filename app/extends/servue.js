var Servue = require('servue')

module.exports = function(app){
    var servue = new Servue()
    servue.resources = app.get('path:resources')
    servue.mode = app.get('env:env') ? app.get('env:env') : 'production'
    servue.precompile('vue/pages')
    servue.webpackCommon.module.rules.push({
        test: /\.styl(us)?$/,
        use: [
            'vue-style-loader',
            'css-loader',
            'stylus-loader'
        ]
    })

    app.use(async (ctx, next) => {
        /**
         * render returns promise to the string which contians the rendered .vue file
         * @param {string} vueFile - path to vue single-file-component
         * @param {Object=} [data={}] - data to be inserted into .vue file when generating renderer
         * @returns {Promise<string>}
         */
        ctx.render = async(vueFile, data) => {
            //data ? data = {...data, ctx} : data = { ctx }

            ctx.body = await servue.render(vueFile, data)
        }
    
        await next()
    })

    app.servue = servue
}