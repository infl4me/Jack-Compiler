import { promises as fs } from 'fs';
import path from 'path';
import { tokenize } from '../src';

test('tokenize expressionless', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'input', 'Main.jack'),
    'utf-8',
  );

  expect(tokenize(input)).toMatchInlineSnapshot(`
    Array [
      Object {
        "type": "KEYWORD",
        "value": "class",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "Main",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "KEYWORD",
        "value": "static",
      },
      Object {
        "type": "KEYWORD",
        "value": "boolean",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "test",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "function",
      },
      Object {
        "type": "KEYWORD",
        "value": "void",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "main",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "KEYWORD",
        "value": "var",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "SquareGame",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "game",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "let",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "game",
      },
      Object {
        "type": "SYMBOL",
        "value": "=",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "game",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "do",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "game",
      },
      Object {
        "type": "SYMBOL",
        "value": ".",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "run",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "do",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "game",
      },
      Object {
        "type": "SYMBOL",
        "value": ".",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "dispose",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "return",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "KEYWORD",
        "value": "function",
      },
      Object {
        "type": "KEYWORD",
        "value": "void",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "more",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "KEYWORD",
        "value": "int",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "a",
      },
      Object {
        "type": "SYMBOL",
        "value": ",",
      },
      Object {
        "type": "KEYWORD",
        "value": "char",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "f",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "KEYWORD",
        "value": "var",
      },
      Object {
        "type": "KEYWORD",
        "value": "boolean",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "b",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "if",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "b",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "KEYWORD",
        "value": "let",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "b",
      },
      Object {
        "type": "SYMBOL",
        "value": "=",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "a",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "if",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "b",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "KEYWORD",
        "value": "let",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "b",
      },
      Object {
        "type": "SYMBOL",
        "value": "=",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "f",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "do",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "game",
      },
      Object {
        "type": "SYMBOL",
        "value": ".",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "run",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "KEYWORD",
        "value": "if",
      },
      Object {
        "type": "SYMBOL",
        "value": "(",
      },
      Object {
        "type": "IDENTIFIER",
        "value": "b",
      },
      Object {
        "type": "SYMBOL",
        "value": ")",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "KEYWORD",
        "value": "else",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "KEYWORD",
        "value": "else",
      },
      Object {
        "type": "SYMBOL",
        "value": "{",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "KEYWORD",
        "value": "return",
      },
      Object {
        "type": "SYMBOL",
        "value": ";",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
      Object {
        "type": "SYMBOL",
        "value": "}",
      },
    ]
  `);
});
