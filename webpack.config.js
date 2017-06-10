module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },
    devServer: {
		contentBase: __dirname + "/public/",
		//compress: true,
		filename: "bundle.js"
	},
    module: {
        loaders: [
            {
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets:['react', 'es2015', 'stage-2']
				}
			}
        ]
    }

}
