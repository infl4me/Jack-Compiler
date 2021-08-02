import { promises as fs } from 'fs';
import path from 'path';
import { tokenize, parse, renderXml } from '../src';

test('tokenize expressionless', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'input', 'Main.jack'),
    'utf-8',
  );

  expect(renderXml(parse(tokenize(input)))).toMatchInlineSnapshot(
    `"<class><keyword> class </keyword><identifier> Main </identifier><symbol> { </symbol><classVarDec><keyword> static </keyword><keyword> boolean </keyword><identifier> test </identifier><symbol> ; </symbol></classVarDec><subroutineDec><keyword> function </keyword><keyword> void </keyword><identifier> main </identifier><symbol> ( </symbol><parameterList></parameterList><symbol> ) </symbol><subroutineBody><symbol> { </symbol><varDec><keyword> var </keyword><identifier> SquareGame </identifier><identifier> game </identifier><symbol> ; </symbol></varDec><statements><letStatement><keyword> let </keyword><identifier> game </identifier><symbol> = </symbol><expression><term><identifier> game </identifier></term></expression><symbol> ; </symbol></letStatement><doStatement><keyword> do </keyword><identifier> game </identifier><symbol> . </symbol><identifier> run </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement><doStatement><keyword> do </keyword><identifier> game </identifier><symbol> . </symbol><identifier> dispose </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement><returnStatement><keyword> return </keyword><symbol> ; </symbol></returnStatement></statements><symbol> } </symbol></subroutineBody></subroutineDec><subroutineDec><keyword> function </keyword><keyword> void </keyword><identifier> more </identifier><symbol> ( </symbol><parameterList></parameterList><symbol> ) </symbol><subroutineBody><symbol> { </symbol><varDec><keyword> var </keyword><keyword> boolean </keyword><identifier> b </identifier><symbol> ; </symbol></varDec><statements><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> b </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><statements></statements><symbol> } </symbol></ifStatement><returnStatement><keyword> return </keyword><symbol> ; </symbol></returnStatement></statements><symbol> } </symbol></subroutineBody></subroutineDec><symbol> } </symbol></class>"`,
  );
});
