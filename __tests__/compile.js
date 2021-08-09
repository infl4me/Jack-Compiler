import path from 'path';
import { promises as fs } from 'fs';
import { parse, tokenize } from '../src';
import { compile } from '../src/compile';

test('compile Seven', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'RealPrograms', 'Seven', 'Main.jack'),
    'utf-8',
  );

  expect(compile(parse(tokenize(input)))).toMatchInlineSnapshot(`
    "function main 0
    push constant 1
    push constant 2
    push constant 3
    call Math.Multiply 2
    add
    call Output.printInt 1"
  `);
});
