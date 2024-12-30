module.exports = function (eleventyConfig, pluginOptions) {
	console.log("Hello, this plugin is working");

    eleventyConfig.addShortcode("currentYear", () => {
        return "This is where the plugin would go";
    });
};