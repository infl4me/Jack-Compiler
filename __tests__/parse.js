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
            Object {
              "type": "IDENTIFIER",
              "value": "test",
            },
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
                Object {
                  "type": "IDENTIFIER",
                  "value": "game",
                },
              ],
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
          "parameters": Array [],
          "subroutineType": "function",
          "type": "CLASS_SUBROUTINE",
        },
        Object {
          "body": Array [
            Object {
              "ids": Array [
                Object {
                  "type": "IDENTIFIER",
                  "value": "b",
                },
                Object {
                  "type": "IDENTIFIER",
                  "value": "f",
                },
              ],
              "type": "VAR",
              "varType": Object {
                "type": "KEYWORD",
                "value": "boolean",
              },
            },
            Object {
              "body": Array [
                Object {
                  "expression": Object {
                    "type": "IDENTIFIER",
                    "value": "a",
                  },
                  "type": "LET",
                  "varId": Object {
                    "type": "IDENTIFIER",
                    "value": "b",
                  },
                },
                Object {
                  "body": Array [
                    Object {
                      "expression": Object {
                        "type": "IDENTIFIER",
                        "value": "f",
                      },
                      "type": "LET",
                      "varId": Object {
                        "type": "IDENTIFIER",
                        "value": "b",
                      },
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
                  ],
                  "elseBody": null,
                  "test": Object {
                    "term": Object {
                      "id": "b",
                      "type": "IDENTIFIER",
                    },
                    "type": "SINGLE_TERM",
                  },
                  "type": "if",
                },
              ],
              "elseBody": Array [],
              "test": Object {
                "left": Object {
                  "term": Object {
                    "left": Object {
                      "term": Object {
                        "type": "INT_CONST",
                        "value": "2",
                      },
                      "type": "SINGLE_TERM",
                    },
                    "op": "*",
                    "right": Object {
                      "term": Object {
                        "type": "INT_CONST",
                        "value": "4",
                      },
                      "type": "SINGLE_TERM",
                    },
                    "type": "BINARY_EXPERSSION",
                  },
                  "type": "SINGLE_TERM",
                },
                "op": "-",
                "right": Object {
                  "term": Object {
                    "type": "INT_CONST",
                    "value": "7",
                  },
                  "type": "SINGLE_TERM",
                },
                "type": "BINARY_EXPERSSION",
              },
              "type": "if",
            },
            Object {
              "type": "RETURN",
              "value": Object {
                "left": Object {
                  "term": Object {
                    "id": "f",
                    "type": "IDENTIFIER",
                  },
                  "type": "SINGLE_TERM",
                },
                "op": "+",
                "right": Object {
                  "left": Object {
                    "term": Object {
                      "id": "a",
                      "type": "IDENTIFIER",
                    },
                    "type": "SINGLE_TERM",
                  },
                  "op": "*",
                  "right": Object {
                    "op": "-",
                    "term": Object {
                      "type": "INT_CONST",
                      "value": "9",
                    },
                    "type": "UNARY_EXPERSSION",
                  },
                  "type": "BINARY_EXPERSSION",
                },
                "type": "BINARY_EXPERSSION",
              },
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
