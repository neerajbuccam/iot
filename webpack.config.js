//var webpack = require('webpack');
//var CompressionPlugin = require('compression-webpack-plugin');

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
	/*plugins: [
		new webpack.DefinePlugin({ 
		  'process.env': {
			'NODE_ENV': JSON.stringify('production')
		  }
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.9
		})
	],*/
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
