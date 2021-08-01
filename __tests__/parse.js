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
          "id": "test",
          "type": "CLASS_VAR_DEC",
          "varType": Object {
            "type": "KEYWORD",
            "value": "boolean",
          },
        },
        Object {
          "body": Array [
            Object {
              "id": Object {
                "type": "IDENTIFIER",
                "value": "game",
              },
              "type": "VAR",
              "varType": Object {
                "type": "IDENTIFIER",
                "value": "SquareGame",
              },
            },
            Object {
              "expression": Object {
                "type": "IDENTIFIER",
                "value": "game",
              },
              "type": "LET",
              "varId": Object {
                "type": "IDENTIFIER",
                "value": "game",
              },
            },
            Object {
              "classId": "game",
              "expression": null,
              "routineId": "run",
              "type": "DO",
            },
            Object {
              "classId": "game",
              "expression": null,
              "routineId": "dispose",
              "type": "DO",
            },
            Object {
              "expression": null,
              "type": "RETURN",
            },
          ],
          "parameters": Array [],
          "subroutineType": "function",
          "type": "CLASS_SUBROUTINE",
        },
        Object {
          "body": Array [
            Object {
              "id": Object {
                "type": "IDENTIFIER",
                "value": "b",
              },
              "type": "VAR",
              "varType": Object {
                "type": "KEYWORD",
                "value": "boolean",
              },
            },
            Object {
              "body": Array [],
              "elseBody": Array [],
              "testExpression": null,
              "type": "if",
            },
            Object {
              "expression": null,
              "type": "RETURN",
            },
          ],
          "parameters": Array [
            Object {
              "id": "a",
              "varType": Object {
                "type": "KEYWORD",
                "value": "int",
              },
            },
            Object {
              "id": "f",
              "varType": Object {
                "type": "KEYWORD",
                "value": "char",
              },
            },
          ],
          "subroutineType": "function",
          "type": "CLASS_SUBROUTINE",
        },
      ],
      "id": "Main",
      "type": "CLASS",
    }
  `);
});
