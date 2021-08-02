import { promises as fs } from 'fs';
import path from 'path';
import { tokenize, parse, renderXml } from '../src';

test('tokenize expressionless', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'input', 'Main.jack'),
    'utf-8',
  );

  expect(renderXml(parse(tokenize(input)))).toMatchInlineSnapshot(
    `"<class><keyword> class </keyword><identifier> Main </identifier><symbol> { </symbol><classVarDec><keyword> static </keyword><keyword> boolean </keyword><identifier> test </identifier><symbol> ; </symbol></classVarDec><subroutineDec><keyword> function </keyword><keyword> void </keyword><identifier> main </identifier><symbol> ( </symbol><symbol> ) </symbol></subroutineDec><subroutineDec><keyword> function </keyword><keyword> void </keyword><identifier> more </identifier><symbol> ( </symbol><symbol> ) </symbol></subroutineDec></class>"`,
  );
});
