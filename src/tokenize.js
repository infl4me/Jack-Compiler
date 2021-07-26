const SPACE_SYMBOL = ' ';
const LINE_END_SYMBOL = '\n';
const STRING_CONSTANT_TRIGGER = '"';
const COMMENT_TRIGGER = '//';
const MULTI_COMMENT_OPEN_TRIGGER = '/**';
const MULTI_COMMENT_CLOSE_TRIGGER = '*/';

const STATES = {
  OUTSIDE: 'OUTSIDE',
  INSIDE_STRING_CONSTANT: 'INSIDE_STRING_CONSTANT',
  INSIDE_INTEGER_CONSTANT: 'INSIDE_INTEGER_CONSTANT',
  INSIDE_IDENTIFIER: 'INSIDE_IDENTIFIER',
  INSIDE_COMMENT: 'INSIDE_COMMENT',
  INSIDE_MULTI_COMMENT: 'INSIDE_MULTI_COMMENT',
};

const SYMBOLS = {
  CURLY_LEFT: '{',
  CURLY_RIGHT: '}',

  ROUND_LEFT: '(',
  ROUND_RIGHT: ')',

  SQUARE_LEFT: '[',
  SQUARE_RIGHT: ']',

  DOT: '.',
  COMMA: ',',
  SEMI: ';',

  PLUS: '+',
  MINUS: '-',
  ASTERISK: '*',
  SLASH: '/',

  AMPERSAND: '&',
  VBAR: '|',
  LESS_THAN: '<',
  MORE_THAN: '>',
  EQUAL: '=',
};
const symbols = Object.values(SYMBOLS);
const isSymbolToken = (v) => symbols.includes(v);

const isValidIdentifierCharacter = (v) => /\w/i.test(v);

const TOKEN_TYPES = {
  KEYWORD: 'KEYWORD',
  SYMBOL: 'SYMBOL',
  INT_CONST: 'INT_CONST',
  STRING_CONST: 'STRING_CONST',
  IDENTIFIER: 'IDENTIFIER',
};

const KEYWORDS = {
  CLASS: 'class',
  METHOD: 'method',
  FUNCTION: 'function',
  CONSTRUCTOR: 'constructor',
  INT: 'int',
  BOOLEAN: 'boolean',
  CHAR: 'char',
  VOID: 'void',
  VAR: 'var',
  STATIC: 'static',
  FIELD: 'field',
  LET: 'let',
  DO: 'do',
  IF: 'if',
  ELSE: 'else',
  WHILE: 'while',
  RETURN: 'return',
  TRUE: 'true',
  FALSE: 'false',
  NULL: 'null',
  THIS: 'this',
};
const keywords = Object.values(KEYWORDS);
const isKeyword = (v) => keywords.includes(v);

function isNumeric(str) {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !Number.isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !Number.isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

/**
 * parses program to tokens
 *
 * @param {string} input
 */
export const tokenize = (input) => {
  let state = STATES.OUTSIDE;
  let buffer = '';
  const tokens = [];

  const reset = () => {
    buffer = '';
    state = STATES.OUTSIDE;
  };

  for (let i = 0; i < input.length; i += 1) {
    const currentSymbol = input[i];

    switch (state) {
      case STATES.OUTSIDE: {
        if (currentSymbol === SPACE_SYMBOL || currentSymbol === LINE_END_SYMBOL) {
          buffer = '';
        } else if (input.slice(i, i + 2) === COMMENT_TRIGGER) {
          state = STATES.INSIDE_COMMENT;
          i += 1;
        } else if (input.slice(i, i + 3) === MULTI_COMMENT_OPEN_TRIGGER) {
          state = STATES.INSIDE_MULTI_COMMENT;
          i += 2;
        } else if (currentSymbol === STRING_CONSTANT_TRIGGER) {
          state = STATES.INSIDE_STRING_CONSTANT;
        } else if (isNumeric(currentSymbol)) {
          buffer = currentSymbol;
          state = STATES.INSIDE_INTEGER_CONSTANT;
        } else if (isSymbolToken(currentSymbol)) {
          tokens.push({
            type: TOKEN_TYPES.SYMBOL,
            value: currentSymbol,
          });
        } else if (isValidIdentifierCharacter(currentSymbol)) {
          buffer = currentSymbol;
          state = STATES.INSIDE_IDENTIFIER;
        } else {
          throw new Error(`[parse][case: STATES.OUTSIDE] couldn't handle: '${currentSymbol}'`);
        }
        break;
      }
      case STATES.INSIDE_COMMENT: {
        if (currentSymbol === LINE_END_SYMBOL) {
          state = STATES.OUTSIDE;
        }
        break;
      }
      case STATES.INSIDE_MULTI_COMMENT: {
        if (input.slice(i, i + 2) === MULTI_COMMENT_CLOSE_TRIGGER) {
          state = STATES.OUTSIDE;
          i += 1;
        }
        break;
      }
      case STATES.INSIDE_STRING_CONSTANT: {
        if (currentSymbol === STRING_CONSTANT_TRIGGER) {
          tokens.push({
            type: TOKEN_TYPES.STRING_CONST,
            value: buffer,
          });

          reset();
        } else if (currentSymbol === LINE_END_SYMBOL) {
          throw new Error(`[parse][case: STATES.INSIDE_STRING_CONSTANT] new line symbol is not allowed`);
        } else {
          buffer += currentSymbol;
        }
        break;
      }
      case STATES.INSIDE_INTEGER_CONSTANT: {
        if (!isNumeric(currentSymbol)) {
          tokens.push({
            type: TOKEN_TYPES.INT_CONST,
            value: buffer,
          });

          i -= 1;
          reset();
        } else {
          buffer += currentSymbol;
        }
        break;
      }

      case STATES.INSIDE_IDENTIFIER: {
        if (!isValidIdentifierCharacter(currentSymbol)) {
          tokens.push({
            type: isKeyword(buffer) ? TOKEN_TYPES.KEYWORD : TOKEN_TYPES.IDENTIFIER,
            value: buffer,
          });

          i -= 1;
          reset();
        } else {
          buffer += currentSymbol;
        }
        break;
      }

      default:
        throw new Error(`Unknown state: "${state}"`);
    }
  }

  return tokens;
};
