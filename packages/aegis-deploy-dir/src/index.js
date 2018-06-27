import { writeFile } from 'fs';
import { join, resolve } from 'path';
import { promisify } from 'util';

import mkdirp from 'mkdirp-promise';

const writeFileAysnc = promisify(writeFile);

export default aegis => {};

export async function deploy({ dir } = {}, root) {
	const dirPath = resolve(root, dir);
	await mkdirp(dirPath);

	return {
		add(path, content) {
			return writeFileAysnc(join(dirPath, path), content, 'utf-8');
		}
	};
}
