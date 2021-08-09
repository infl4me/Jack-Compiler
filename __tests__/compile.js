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
    "function Main.main 0
    push constant 1
    push constant 2
    push constant 3
    call Math.multiply 2
    add
    call Output.printInt 1
    pop temp 0
    push constant 0
    return"
  `);
});
