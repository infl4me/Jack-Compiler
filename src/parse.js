import {
  binaryOperators,
  keywordConstants,
  KEYWORDS,
  NODE_TYPES,
  returnTypes,
  SYMBOLS,
  TOKEN_TYPES,
  unaryOperators,
  varTypes,
} from './constants';

const throwSynxtarError = (message = '') => {
  if (message) {
    throw new Error(`Syntax error: ${message}`);
  }

  throw new Error(`Syntax error`);
};

const statementTerminator = SYMBOLS.SEMI;
const blockStatementOpen = SYMBOLS.CURLY_LEFT;
const blockStatementClose = SYMBOLS.CURLY_RIGHT;
const parametersOpen = SYMBOLS.ROUND_LEFT;
const parametersClose = SYMBOLS.ROUND_RIGHT;

const varTypeExpectedToken = {
  type: [TOKEN_TYPES.KEYWORD, TOKEN_TYPES.IDENTIFIER],
  value: (tokenType) => (tokenType.type === TOKEN_TYPES.KEYWORD ? varTypes : null),
};
const returnTypeExpectedToken = {
  type: [TOKEN_TYPES.KEYWORD, TOKEN_TYPES.IDENTIFIER],
  value: (tokenType) => (tokenType.type === TOKEN_TYPES.KEYWORD ? returnTypes : null),
};
const blockStatementOpenExpectedToken = { type: TOKEN_TYPES.SYMBOL, value: blockStatementOpen };
// const blockStatementCloseExpectedToken = { type: TOKEN_TYPES.SYMBOL, value: blockStatementClose };
const parametersOpenExpectedToken = { type: TOKEN_TYPES.SYMBOL, value: parametersOpen };
// const parametersCloseExpectedToken = { type: TOKEN_TYPES.SYMBOL, value: parametersClose };
const idinentifierExpectedToken = { type: TOKEN_TYPES.IDENTIFIER };
const statementTerminatorExpectedToken = { type: TOKEN_TYPES.SYMBOL, value: statementTerminator };

/**
 * Checks token for matching given expectedToken. If fails throws an error
 */
const testToken = (expectedToken, token) => {
  if (typeof expectedToken.type === 'string' && expectedToken.type !== token.type) {
    throw new Error(
      `Invalid token type. Expected: '${expectedToken.type}', Received: '${token.type}'. Value: '${token.value}'`,
    );
  }
  if (expectedToken.type instanceof Array && !expectedToken.type.includes(token.type)) {
    throw new Error(
      `Invalid token type. Expected: '${expectedToken.type}', Received: '${token.type}'. Value: '${token.value}'`,
    );
  }

  if (expectedToken.value) {
    const expectedTokenValue =
      typeof expectedToken.value === 'function'
        ? expectedToken.value(token.type)
        : expectedToken.value;

    if (expectedTokenValue) {
      if (typeof expectedToken.value === 'string' && expectedToken.value !== token.value) {
        throw new Error(
          `Invalid token value. Expected: '${expectedToken.value}', Received: '${token.value}'`,
        );
      } else if (
        expectedToken.value instanceof Array &&
        !expectedToken.value.includes(token.value)
      ) {
        throw new Error(
          `Invalid token value. Expected: '${expectedToken.value}', Received: '${token.value}'`,
        );
      }
    }
  }
};

const testTokens = (expectedTokens, tokens) => {
  expectedTokens.forEach((expectedToken, idx) => testToken(expectedToken, tokens[idx]));
};

let _tokens = [];
let _currenTokenIndex = 0;
/**
 * returns requested number of tokens and advances tokens list
 */
const getNextTokensAndAdvance = (tokensCount = 0) => {
  const nextTokens = _tokens.slice(_currenTokenIndex, _currenTokenIndex + tokensCount);

  _currenTokenIndex += tokensCount;

  return nextTokens;
};
const getNextTokenAndAdvance = () => {
  const nextToken = _tokens[_currenTokenIndex];

  _currenTokenIndex += 1;

  return nextToken;
};
const getNextToken = (count = 0) => {
  return _tokens[_currenTokenIndex + count];
};
const advanceTokens = (count = 1) => {
  _currenTokenIndex += count;
};

const EXPRESSION_TYPES = {
  SINGLE_TERM: 'SINGLE_TERM',
  IDENTIFIER: 'IDENTIFIER',
  UNARY_EXPERSSION: 'UNARY_EXPERSSION',
  BINARY_EXPERSSION: 'BINARY_EXPERSSION',
};

const parseTerm = () => {
  const termToken = getNextToken();

  const isConstant =
    [TOKEN_TYPES.INT_CONST, TOKEN_TYPES.STRING_CONST].includes(termToken.type) ||
    (termToken.type === TOKEN_TYPES.KEYWORD && keywordConstants.includes(termToken.value));
  if (isConstant) {
    advanceTokens();

    return {
      type: termToken.type,
      value: termToken.value,
    };
  }

  if (termToken.type === TOKEN_TYPES.IDENTIFIER) {
    const nextToken = getNextToken(1);
    const isSubroutineCall =
      nextToken.value === SYMBOLS.DOT || nextToken.value === SYMBOLS.ROUND_LEFT;

    if (isSubroutineCall) {
      return parseSubroutineCall();
    }

    const isArrayAccess = nextToken.value === SYMBOLS.SQUARE_LEFT;
    if (isArrayAccess) {
      advanceTokens(2);

      const expression = parseExpression();
      if (!expression) {
        throwSynxtarError('[ARRAY_ACCESS] Should contain index');
      }

      testToken(
        { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.SQUARE_RIGHT },
        getNextTokenAndAdvance(),
      );

      return {
        type: NODE_TYPES.ARRAY_ACCESS,
        id: termToken.value,
        index: expression,
      };
    }

    advanceTokens();
    return {
      type: termToken.type,
      id: termToken.value,
    };
  }

  throwSynxtarError(`Couldnt parse a term`);
};

const parseExpression = () => {
  const unaryOpToken = unaryOperators.includes(getNextToken().value)
    ? getNextTokenAndAdvance()
    : null;

  const term = parseTerm();

  const binaryOpToken = binaryOperators.includes(getNextToken().value)
    ? getNextTokenAndAdvance()
    : null;

  if (binaryOpToken) {
    return {
      type: EXPRESSION_TYPES.BINARY_EXPERSSION,
      left: unaryOpToken
        ? {
            type: EXPRESSION_TYPES.UNARY_EXPERSSION,
            term,
            op: unaryOpToken.value,
          }
        : {
            type: EXPRESSION_TYPES.SINGLE_TERM,
            term,
          },
      op: binaryOpToken.value,
      right: parseExpression(),
    };
  }

  if (unaryOpToken) {
    return {
      type: EXPRESSION_TYPES.UNARY_EXPERSSION,
      term,
      op: unaryOpToken.value,
    };
  }

  if (term) {
    return {
      type: EXPRESSION_TYPES.SINGLE_TERM,
      term,
    };
  }

  throwSynxtarError('[parseExpression] Couldnt parse an expression');
};

const parseParameterList = () => {
  testToken(parametersOpenExpectedToken, getNextTokenAndAdvance());

  const result = [];
  let currentToken = getNextToken();
  while (currentToken.value !== parametersClose) {
    const tokens = getNextTokensAndAdvance(2);
    testTokens([varTypeExpectedToken, idinentifierExpectedToken], tokens);

    result.push({
      varType: {
        value: tokens[0].value,
        type: tokens[0].type,
      },
      id: tokens[1].value,
    });

    if (getNextToken().value === SYMBOLS.COMMA) {
      advanceTokens();
    }

    currentToken = getNextToken();
  }

  // advance parameters terminator
  advanceTokens();

  return result;
};

const parseVar = () => {
  const tokens = getNextTokensAndAdvance(4);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.VAR },
      varTypeExpectedToken,
      idinentifierExpectedToken,
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.SEMI },
    ],
    tokens,
  );

  return {
    type: NODE_TYPES.VAR,
    varType: {
      value: tokens[1].value,
      type: tokens[1].type,
    },
    id: tokens[2],
  };
};
const parseLet = () => {
  const tokens = getNextTokensAndAdvance(5);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.LET },
      idinentifierExpectedToken,
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.EQUAL },
      idinentifierExpectedToken,
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.SEMI },
    ],
    tokens,
  );

  return {
    type: NODE_TYPES.LET,
    varId: tokens[1],
    expression: tokens[3],
  };
};
const parseIf = () => {
  const tokens = getNextTokensAndAdvance(2);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.IF },
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_LEFT },
    ],
    tokens,
  );

  if (getNextToken().value === SYMBOLS.ROUND_RIGHT) {
    throwSynxtarError(`[parseIf] Missed expression`);
  }

  const expression = parseExpression();

  testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_RIGHT }, getNextTokenAndAdvance());

  const body = parseBlockStatement();

  const withElse = getNextToken().value === KEYWORDS.ELSE;
  let elseBody = null;
  if (withElse) {
    testToken({ type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.ELSE }, getNextTokenAndAdvance());
    elseBody = parseBlockStatement();
  }

  return {
    type: NODE_TYPES.IF,
    test: expression,
    body,
    elseBody,
  };
};
const parseWhile = () => {};
const parseSubroutineCall = () => {
  const variableToken = getNextTokenAndAdvance();
  testToken(idinentifierExpectedToken, variableToken);

  const isCalledOnClass = getNextToken().value === SYMBOLS.DOT;
  if (isCalledOnClass) {
    const classRoutineTokens = getNextTokensAndAdvance(3);
    testTokens(
      [
        { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.DOT },
        idinentifierExpectedToken,
        { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_LEFT },
      ],
      classRoutineTokens,
    );

    const result = [];
    let currentToken = getNextToken();
    while (currentToken.value !== SYMBOLS.ROUND_RIGHT) {
      result.push(parseExpression);

      if (getNextToken().value === SYMBOLS.COMMA) {
        advanceTokens();
      }

      currentToken = getNextToken();
    }

    testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_RIGHT }, getNextTokenAndAdvance());

    return {
      type: NODE_TYPES.SUBROUTINE_CALL,
      classId: variableToken.value,
      subroutineId: classRoutineTokens[1].value,
      arguments: result,
    };
  }

  const expression = parseExpression();

  testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_RIGHT }, getNextTokenAndAdvance());

  return {
    type: NODE_TYPES.SUBROUTINE_CALL,
    subroutineId: variableToken.value,
    expression,
  };
};
const parseDo = () => {
  testToken({ type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.DO }, getNextTokenAndAdvance());

  const subroutineCall = parseSubroutineCall();

  testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.SEMI }, getNextTokenAndAdvance());

  return {
    type: NODE_TYPES.DO,
    subroutineCall,
  };
};
const parseReturn = () => {
  const tokens = getNextTokensAndAdvance(2);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.RETURN },
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.SEMI },
    ],
    tokens,
  );

  return {
    type: NODE_TYPES.RETURN,
    expression: null,
  };
};
const KEYWORD_TO_PARSE_MAP = {
  [KEYWORDS.VAR]: parseVar,
  [KEYWORDS.LET]: parseLet,
  [KEYWORDS.IF]: parseIf,
  [KEYWORDS.WHILE]: parseWhile,
  [KEYWORDS.DO]: parseDo,
  [KEYWORDS.RETURN]: parseReturn,
};
const parseBlockStatement = () => {
  testToken(blockStatementOpenExpectedToken, getNextTokenAndAdvance());

  const result = [];
  let currentToken = getNextToken();
  while (currentToken.value !== blockStatementClose) {
    testToken(
      {
        type: TOKEN_TYPES.KEYWORD,
        value: [
          KEYWORDS.VAR,
          KEYWORDS.LET,
          KEYWORDS.IF,
          KEYWORDS.WHILE,
          KEYWORDS.DO,
          KEYWORDS.RETURN,
        ],
      },
      currentToken,
    );

    result.push(KEYWORD_TO_PARSE_MAP[currentToken.value]());

    currentToken = getNextToken();
  }

  // advance block statement terminator
  advanceTokens();

  return result;
};

const parseSubroutine = () => {
  const tokens = getNextTokensAndAdvance(3);

  testTokens(
    [
      {
        type: TOKEN_TYPES.KEYWORD,
        value: [KEYWORDS.FUNCTION, KEYWORDS.METHOD, KEYWORDS.CONSTRUCTOR],
      },
      returnTypeExpectedToken,
      idinentifierExpectedToken,
    ],
    tokens,
  );

  return {
    type: NODE_TYPES.CLASS_SUBROUTINE,
    subroutineType: tokens[0].value,
    parameters: parseParameterList(),
    body: parseBlockStatement(),
  };
};

const parseClassVarDec = () => {
  const tokens = getNextTokensAndAdvance(4);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: [KEYWORDS.STATIC, KEYWORDS.FIELD] },
      varTypeExpectedToken,
      idinentifierExpectedToken,
      statementTerminatorExpectedToken,
    ],
    tokens,
  );

  return {
    type: NODE_TYPES.CLASS_VAR_DEC,
    classVarDecType: tokens[0].value,
    varType: {
      value: tokens[1].value,
      type: tokens[1].type,
    },
    id: tokens[2].value,
  };
};

const parseClassBlockStatement = () => {
  testToken(blockStatementOpenExpectedToken, getNextTokenAndAdvance());

  const result = [];
  let currentToken = getNextToken();
  while (currentToken.value !== blockStatementClose) {
    testToken(
      { type: TOKEN_TYPES.KEYWORD, value: [KEYWORDS.STATIC, KEYWORDS.FIELD, KEYWORDS.FUNCTION] },
      currentToken,
    );
    if (currentToken.value === KEYWORDS.STATIC || currentToken.value === KEYWORDS.FIELD) {
      result.push(parseClassVarDec());
    } else if (currentToken.value === KEYWORDS.FUNCTION) {
      result.push(parseSubroutine());
    } else {
      throwSynxtarError(
        `[parseClassBlockStatement] Unknown token value: ${currentToken.value}, type: '${currentToken.type}`,
      );
    }

    currentToken = getNextToken();
  }

  // advance block statement terminator
  advanceTokens();

  return result;
};

const parseClass = () => {
  const tokens = getNextTokensAndAdvance(2);
  testTokens(
    [{ type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.CLASS }, { type: TOKEN_TYPES.IDENTIFIER }],
    tokens,
  );

  return {
    type: NODE_TYPES.CLASS,
    id: tokens[1].value,
    body: parseClassBlockStatement(),
  };
};

export const parse = (tkns = []) => {
  _tokens = tkns;

  return parseClass();
};
