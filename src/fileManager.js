import { promises as fs } from 'fs';
import path from 'path';
import { compile } from './compile';
import { parse } from './parse';
import { tokenize } from './tokenize';

const compileSingleFile = async (srcpath) => {
  const program = await fs.readFile(srcpath, { encoding: 'utf8' });
  const vm = compile(parse(tokenize(program)));
  const filename = path.basename(srcpath, '.jack');
  const destpath = path.join(path.dirname(srcpath), `${filename}.vm`);
  await fs.writeFile(destpath, vm);
};

const main = async () => {
  const pathArgv = process.argv.find((item) => item.split('=')[0] === 'PATH');
  if (!pathArgv) {
    throw new Error(`No path provided`);
  }
  const src = path.join(pathArgv.split('=')[1]);

  const srcStats = await fs.lstat(src);

  if (srcStats.isFile()) {
    if (path.extname(src) !== '.jack') {
      throw new Error(`Invalid ext provided: "${path.extname(src)}"`);
    }

    await compileSingleFile(src);

    return;
  }

  const filepaths = (await fs.readdir(src))
    .filter((filename) => path.extname(filename) === '.jack')
    .map((filename) => path.join(src, filename));
  if (filepaths.length === 0) {
    throw new Error('No .jack files found');
  }

  await Promise.all(filepaths.map(compileSingleFile));
};

main();
