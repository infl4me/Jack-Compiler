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

test('tokenize Square->SquareGame.jack', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'input', 'Square', 'SquareGame.jack'),
    'utf-8',
  );

  expect(renderXml(parse(tokenize(input)))).toMatchInlineSnapshot(
    `"<class><keyword> class </keyword><identifier> SquareGame </identifier><symbol> { </symbol><classVarDec><keyword> static </keyword><keyword> Square </keyword><identifier> square </identifier><symbol> ; </symbol></classVarDec><classVarDec><keyword> static </keyword><keyword> int </keyword><identifier> direction </identifier><symbol> ; </symbol></classVarDec><subroutineDec><keyword> constructor </keyword><keyword> SquareGame </keyword><identifier> new </identifier><symbol> ( </symbol><parameterList></parameterList><symbol> ) </symbol><subroutineBody><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> square </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement><letStatement><keyword> let </keyword><identifier> direction </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement><returnStatement><keyword> return </keyword><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></returnStatement></statements><symbol> } </symbol></subroutineBody></subroutineDec><subroutineDec><keyword> method </keyword><keyword> void </keyword><identifier> dispose </identifier><symbol> ( </symbol><parameterList></parameterList><symbol> ) </symbol><subroutineBody><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> dispose </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement><doStatement><keyword> do </keyword><identifier> Memory </identifier><symbol> . </symbol><identifier> deAlloc </identifier><symbol> ( </symbol><expressionList><expression><term><identifier> undefined </identifier></term></expression></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement><returnStatement><keyword> return </keyword><symbol> ; </symbol></returnStatement></statements><symbol> } </symbol></subroutineBody></subroutineDec><subroutineDec><keyword> method </keyword><keyword> void </keyword><identifier> moveSquare </identifier><symbol> ( </symbol><parameterList></parameterList><symbol> ) </symbol><subroutineBody><symbol> { </symbol><statements><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> direction </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> moveUp </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> direction </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> moveDown </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> direction </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> moveLeft </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> direction </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> moveRight </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><doStatement><keyword> do </keyword><identifier> Sys </identifier><symbol> . </symbol><identifier> wait </identifier><symbol> ( </symbol><expressionList><expression><term><identifier> undefined </identifier></term></expression></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement><returnStatement><keyword> return </keyword><symbol> ; </symbol></returnStatement></statements><symbol> } </symbol></subroutineBody></subroutineDec><subroutineDec><keyword> method </keyword><keyword> void </keyword><identifier> run </identifier><symbol> ( </symbol><parameterList></parameterList><symbol> ) </symbol><subroutineBody><symbol> { </symbol><varDec><keyword> var </keyword><keyword> char </keyword><identifier> key </identifier><symbol> ; </symbol></varDec><statements><letStatement><keyword> let </keyword><identifier> exit </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement><whileStatement><keyword> while </keyword><symbol> ( </symbol><expression><symbol> ~ </symbol><term><identifier> exit </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><whileStatement><keyword> while </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> key </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement><doStatement><keyword> do </keyword><identifier> moveSquare </identifier><symbol> . </symbol><identifier> undefined </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol></whileStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> exit </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> decSize </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><doStatement><keyword> do </keyword><identifier> square </identifier><symbol> . </symbol><identifier> incSize </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> direction </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> direction </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> direction </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><ifStatement><keyword> if </keyword><symbol> ( </symbol><expression><term><identifier> key </identifier></term><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> direction </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement></statements><symbol> } </symbol><keyword> else </keyword><symbol> { </symbol><symbol> } </symbol></ifStatement><whileStatement><keyword> while </keyword><symbol> ( </symbol><expression><symbol> ~ </symbol><term><identifier> undefined </identifier></term></expression><symbol> ) </symbol><symbol> { </symbol><statements><letStatement><keyword> let </keyword><identifier> key </identifier><symbol> = </symbol><expression><term><identifier> undefined </identifier></term></expression><symbol> ; </symbol></letStatement><doStatement><keyword> do </keyword><identifier> moveSquare </identifier><symbol> . </symbol><identifier> undefined </identifier><symbol> ( </symbol><expressionList></expressionList><symbol> ) </symbol><symbol> ; </symbol></doStatement></statements><symbol> } </symbol></whileStatement></statements><symbol> } </symbol></whileStatement><returnStatement><keyword> return </keyword><symbol> ; </symbol></returnStatement></statements><symbol> } </symbol></subroutineBody></subroutineDec><symbol> } </symbol></class>"`,
  );
});
