var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var del = require("del");
var manifest = require("gulp-manifest");

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Production build
gulp.task("build", ["webpack:build", "manifest"]);

// Development build
gulp.task("build-dev", ["webpack:build-dev"]);

gulp.task("clean", function() {
	return del(["build"]);
});

gulp.task("manifest", ["clean", "webpack:build"], function(callback) {
	gulp.src([
		"build/*",
	])
	.pipe(manifest({
		cache: [
			"../index.html",
			"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
			"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.woff?v=4.5.0"
		],
		hash: true,
		preferOnline: true,
		network: ["*"],
		filename: "app.appcache",
		exclude: "app.appcache"
	}))
	.pipe(gulp.dest("build"));
});
 
 gulp.task("webpack:build", ["clean"], function(callback) {
	// modify some webpack config options
	var config = Object.create(webpackConfig);
	config.plugins = config.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(config, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

var webpackDevConfig = Object.create(webpackConfig);
webpackDevConfig.devtool = "sourcemap";
webpackDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(webpackDevConfig);

gulp.task("webpack:build-dev", ['clean'], function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// Start a webpack-dev-server
	new WebpackDevServer(devCompiler, {
		publicPath: "/" + webpackDevConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});