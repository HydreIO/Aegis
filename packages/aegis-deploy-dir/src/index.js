import { writeFile } from 'fs';
import { join, resolve, dirname } from 'path';
import { promisify } from 'util';

import mkdirp from 'mkdirp-promise';

const writeFileAysnc = promisify(writeFile);

export default async (aegis, { dir } = {}) => {
	const dirPath = resolve(dirname(aegis.importRoot), dir);
	await mkdirp(dirPath);

	return {
		add(path, content) {
			return writeFileAysnc(join(dirPath, path), content, 'utf-8');
		},
		end() {}
	};
};
