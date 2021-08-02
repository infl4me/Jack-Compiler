import { promises as fs } from 'fs';
import path from 'path';
import { tokenize, parse } from '../src';

test('tokenize expressionless', async () => {
  const input = await fs.readFile(
    path.join(__dirname, '__fixtures__', 'input', 'Main.jack'),
    'utf-8',
  );

  expect(parse(tokenize(input))).toMatchInlineSnapshot(`
    Object {
      "body": Array [
        Object {
          "classVarDecType": "static",
          "ids": Array [
            "test",
          ],
          "type": "CLASS_VAR_DEC",
          "varType": Object {
            "type": "KEYWORD",
            "value": "boolean",
          },
        },
        Object {
          "body": Array [
            Object {
              "ids": Array [
                "game",
              ],
              "type": "VAR",
              "varType": Object {
                "type": "IDENTIFIER",
                "value": "SquareGame",
              },
            },
            Object {
              "initValue": Object {
                "term": Object {
                  "id": "game",
                  "type": "IDENTIFIER",
                },
                "type": "SINGLE_TERM",
              },
              "type": "LET",
              "varId": "game",
            },
            Object {
              "subroutineCall": Object {
                "arguments": Array [],
                "classId": "game",
                "subroutineId": "run",
                "type": "SUBROUTINE_CALL",
              },
              "type": "DO",
            },
            Object {
              "subroutineCall": Object {
                "arguments": Array [],
                "classId": "game",
                "subroutineId": "dispose",
                "type": "SUBROUTINE_CALL",
              },
              "type": "DO",
            },
            Object {
              "type": "RETURN",
              "value": null,
            },
          ],
          "id": "main",
          "parameters": Array [],
          "returnType": Object {
            "type": "KEYWORD",
            "value": "void",
          },
          "subroutineType": "function",
          "type": "CLASS_SUBROUTINE",
        },
        Object {
          "body": Array [
            Object {
              "ids": Array [
                "b",
              ],
              "type": "VAR",
              "varType": Object {
                "type": "KEYWORD",
                "value": "boolean",
              },
            },
            Object {
              "body": Array [],
              "elseBody": Array [],
              "test": Object {
                "term": Object {
                  "id": "b",
                  "type": "IDENTIFIER",
                },
                "type": "SINGLE_TERM",
              },
              "type": "if",
            },
            Object {
              "type": "RETURN",
              "value": null,
            },
          ],
          "id": "more",
          "parameters": Array [],
          "returnType": Object {
            "type": "KEYWORD",
            "value": "void",
          },
          "subroutineType": "function",
          "type": "CLASS_SUBROUTINE",
        },
      ],
      "id": "Main",
      "type": "CLASS",
    }
  `);
});
