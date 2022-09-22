import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const license = require("rollup-plugin-license");
const globby = require("globby");
const fs  = require("fs-extra");

export default class Bundler{

	constructor(version, env){
		this.bundles = [];

		this.env = env;
		this.version = "/* Custom Tabulator v" + version + " Updated by UmaLPZ */";
	}

	bundle(){
		if(this.env){
			this.watch(this.env);
		}else{
			this.build();
		}

		return this.bundles;
	}

	watch(env){
		console.log("Building Dev Package Bundles: ", env);
		switch(env){
			case "esm":
				this.bundleESM(false);
				break;

			case "umd":
				this.bundleUMD(false);
				break;

			default:
				this.bundleESM(false);
				break;
		}
	}

	build(){
		console.log("Clearing Dist Files");

		this.clearDist();

		console.log("Copying Standalong Builds");

		this.copyStandaloneBuilds();

		console.log("Building Production Package Bundles");


		this.bundleESM(false);
		this.bundleESM(true);

		this.bundleUMD(false);
		this.bundleUMD(true);
	}

	clearDist(){
		fs.emptyDirSync("./dist");
	}

	copyStandaloneBuilds(){
		var builds = ["jquery_wrapper.js"];

		builds.forEach((build) => {
			fs.copySync("./src/js/builds/" + build, "./dist/js/" + build);
		});
	}

	bundleESM(minify){
		this.bundles.push({
			input:"src/js/builds/esm.js",
			plugins: [
				nodeResolve(),
				minify ? terser() : null,
				license({
					banner: {
						commentStyle:"none",
						content:this.version,
					},
				}),
			],
			output: [
				{
					file: "dist/js/tabulator_esm" + (minify ? ".min" : "") + ".js",
					format: "esm",
					exports: "named",
					sourcemap: true,
				},
			],
		});
	}

	bundleUMD(minify){
		this.bundles.push({
			input:"src/js/builds/usd.js",
			plugins: [
				nodeResolve(),
				babel({
					babelHelpers: "bundled",
				}),
				minify ? terser() : null,
				license({
					banner: {
						commentStyle:"none",
						content:this.version,
					},
				}),
			],
			output: {
				file: "dist/js/tabulator" + (minify ? ".min" : "") + ".js",
				format: "umd",
				name: "Tabulator",
				esModule: false,
				exports: "default",
				sourcemap: true,
			},
		});
	}
}