const chalk = require('chalk');
const { transformFile } = require("@babel/core");
const { promisify } = require("util");
const globby = require('globby');
const { join, dirname, sep } = require('path');
const { writeFile, ensureDir } = require('fs-extra');
const transformFileAsync = promisify(transformFile);

 	
function swapSrcWithLib(srcPath) {
	const parts = srcPath.split(sep);
	parts[1] = "lib";
	return parts.join(sep);
}

const cwd = join(__dirname, "..", "packages")

globby("*/src/**/*.js", {
	cwd
}).then(files => Promise.all(
	files.map(async f => {
		console.log(chalk`{cyan ${f}} {magenta →} {green ${swapSrcWithLib(f)}}`)
		const { code } = await transformFileAsync(join(cwd, f), {
			configFile: join(__dirname, "..", ".babelrc")
		})
		const path = join(cwd, swapSrcWithLib(f))
		await ensureDir(dirname(path))
		await writeFile(path, code, "utf-8")
	})
))


