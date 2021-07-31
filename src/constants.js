export const SYMBOLS = {
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

export const TOKEN_TYPES = {
  KEYWORD: 'KEYWORD',
  SYMBOL: 'SYMBOL',
  INT_CONST: 'INT_CONST',
  STRING_CONST: 'STRING_CONST',
  IDENTIFIER: 'IDENTIFIER',
};

export const KEYWORDS = {
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

export const NODE_TYPES = {
  CLASS: 'CLASS',
  CLASS_VAR_DEC: 'CLASS_VAR_DEC',
  CLASS_SUBROUTINE: 'CLASS_SUBROUTINE',
  LET: 'LET',
  VAR: 'VAR',
  DO: 'DO',
  RETURN: 'RETURN',
  IF: 'if',
  WHILE: 'WHILE',
};

export const VAR_TYPES = {
  BOOLEAN: KEYWORDS.BOOLEAN,
  CHAR: KEYWORDS.CHAR,
  INT: KEYWORDS.INT,
};
export const varTypes = Object.values(VAR_TYPES);

export const RETURN_TYPES = {
  BOOLEAN: KEYWORDS.BOOLEAN,
  CHAR: KEYWORDS.CHAR,
  INT: KEYWORDS.INT,
  VOID: KEYWORDS.VOID,
};
export const returnTypes = Object.values(RETURN_TYPES);
