module.exports = {
	devServer: {
		proxy: "https://obs-timer-api.herokuapp.com/",
	},
	pluginOptions: {
		electronBuilder: {
			outputDir: "build",
			
		},
	},
};
