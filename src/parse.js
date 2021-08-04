import {
  binaryOperators,
  EXPRESSION_TYPES,
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
  const throwError = (message = '') => {
    throw new Error(
      `${message ? `${message} ` : ''}
      Expected: ${JSON.stringify(expectedToken, null, 2)}
      Received: ${JSON.stringify(token, null, 2)}
      
      _currenTokenIndex: ${_currenTokenIndex}
      _token: ${JSON.stringify(_tokens[_currenTokenIndex], null, 2)}`,
    );
  };

  if (typeof expectedToken.type === 'string' && expectedToken.type !== token.type) {
    throwError('Invalid token type.');
  }
  if (expectedToken.type instanceof Array && !expectedToken.type.includes(token.type)) {
    throwError('Invalid token type.');
  }

  if (expectedToken.value) {
    const expectedTokenValue =
      typeof expectedToken.value === 'function'
        ? expectedToken.value(token.type)
        : expectedToken.value;

    if (expectedTokenValue) {
      if (typeof expectedToken.value === 'string' && expectedToken.value !== token.value) {
        throwError('Invalid token value.');
      } else if (
        expectedToken.value instanceof Array &&
        !expectedToken.value.includes(token.value)
      ) {
        throwError('Invalid token value.');
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

const parseTerm = () => {
  const hasPriorityExpression = getNextToken().value === SYMBOLS.ROUND_LEFT;
  if (hasPriorityExpression) {
    advanceTokens();
    const expression = parseExpression();
    testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_RIGHT }, getNextTokenAndAdvance());
    return expression;
  }

  const termToken = getNextToken();

  const isConstant =
    [TOKEN_TYPES.INT_CONST, TOKEN_TYPES.STRING_CONST].includes(termToken.type) ||
    (termToken.type === TOKEN_TYPES.KEYWORD && keywordConstants.includes(termToken.value));
  if (isConstant) {
    advanceTokens();

    return {
      type: NODE_TYPES.CONSTANT,
      constantType: termToken.type,
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
      type: NODE_TYPES.IDENTIFIER,
      id: termToken.value,
    };
  }

  throwSynxtarError(`Couldnt parse a term: ${JSON.stringify(termToken, null, 2)}`);
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
      type: NODE_TYPES.EXPRESSION,
      expressionType: EXPRESSION_TYPES.BINARY_EXPERSSION,
      left: unaryOpToken
        ? {
            type: NODE_TYPES.EXPRESSION,
            expressionType: EXPRESSION_TYPES.UNARY_EXPERSSION,
            term,
            op: unaryOpToken.value,
          }
        : {
            type: NODE_TYPES.EXPRESSION,
            expressionType: EXPRESSION_TYPES.SINGLE_TERM,
            term,
          },
      op: binaryOpToken.value,
      right: parseExpression(),
    };
  }

  if (unaryOpToken) {
    return {
      type: NODE_TYPES.EXPRESSION,
      expressionType: EXPRESSION_TYPES.UNARY_EXPERSSION,
      term,
      op: unaryOpToken.value,
    };
  }

  if (term) {
    return {
      type: NODE_TYPES.EXPRESSION,
      expressionType: EXPRESSION_TYPES.SINGLE_TERM,
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
  const tokens = getNextTokensAndAdvance(2);
  testTokens([{ type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.VAR }, varTypeExpectedToken], tokens);

  const ids = [];
  let currentToken = getNextToken();
  while (currentToken.value !== statementTerminator) {
    testToken(idinentifierExpectedToken, currentToken);
    advanceTokens();
    ids.push(currentToken.value);

    if (getNextToken().value === SYMBOLS.COMMA) {
      advanceTokens();
    }

    currentToken = getNextToken();
  }

  advanceTokens();

  return {
    type: NODE_TYPES.VAR,
    varType: {
      value: tokens[1].value,
      type: tokens[1].type,
    },
    ids,
  };
};
const parseLet = () => {
  const tokens = getNextTokensAndAdvance(3);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.LET },
      idinentifierExpectedToken,
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.EQUAL },
    ],
    tokens,
  );

  const initValue = parseExpression();

  testToken(statementTerminatorExpectedToken, getNextTokenAndAdvance());

  return {
    type: NODE_TYPES.LET,
    varId: tokens[1].value,
    initValue,
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
const parseWhile = () => {
  const tokens = getNextTokensAndAdvance(2);
  testTokens(
    [
      { type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.WHILE },
      { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_LEFT },
    ],
    tokens,
  );

  if (getNextToken().value === SYMBOLS.ROUND_RIGHT) {
    throwSynxtarError(`[parseWhile] Missed expression`);
  }

  const expression = parseExpression();

  testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_RIGHT }, getNextTokenAndAdvance());

  const body = parseBlockStatement();

  return {
    type: NODE_TYPES.WHILE,
    test: expression,
    body,
  };
};
const parseSubroutineCall = () => {
  const variableToken = getNextTokenAndAdvance();
  testToken(idinentifierExpectedToken, variableToken);

  const isCalledOnClass = getNextToken().value === SYMBOLS.DOT;

  let tokens;
  if (isCalledOnClass) {
    tokens = getNextTokensAndAdvance(3);
    testTokens(
      [
        { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.DOT },
        idinentifierExpectedToken,
        { type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_LEFT },
      ],
      tokens,
    );
  } else {
    tokens = getNextTokensAndAdvance(1);
    testTokens([{ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_LEFT }], tokens);
  }

  const result = [];
  let currentToken = getNextToken();
  while (currentToken.value !== SYMBOLS.ROUND_RIGHT) {
    result.push(parseExpression());

    if (getNextToken().value === SYMBOLS.COMMA) {
      advanceTokens();
    }

    currentToken = getNextToken();
  }

  testToken({ type: TOKEN_TYPES.SYMBOL, value: SYMBOLS.ROUND_RIGHT }, getNextTokenAndAdvance());

  return {
    type: NODE_TYPES.SUBROUTINE_CALL,
    classId: variableToken.value,
    subroutineId: isCalledOnClass ? tokens[1].value : undefined,
    arguments: result,
  };
};
const parseDo = () => {
  testToken({ type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.DO }, getNextTokenAndAdvance());

  const subroutineCall = parseSubroutineCall();

  testToken(statementTerminatorExpectedToken, getNextTokenAndAdvance());

  return {
    type: NODE_TYPES.DO,
    subroutineCall,
  };
};
const parseReturn = () => {
  const tokens = getNextTokensAndAdvance(1);
  testTokens([{ type: TOKEN_TYPES.KEYWORD, value: KEYWORDS.RETURN }], tokens);

  const hasReturnValue = getNextToken().value !== statementTerminator;
  const returnValue = hasReturnValue ? parseExpression() : null;

  testToken(statementTerminatorExpectedToken, getNextTokenAndAdvance());

  return {
    type: NODE_TYPES.RETURN,
    value: returnValue,
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
    returnType: {
      type: tokens[1].type,
      value: tokens[1].value,
    },
    id: tokens[2].value,
    subroutineType: tokens[0].value,
    parameters: parseParameterList(),
    body: parseBlockStatement(),
  };
};

const parseClassVarDec = () => {
  const tokens = getNextTokensAndAdvance(2);
  testTokens(
    [{ type: TOKEN_TYPES.KEYWORD, value: [KEYWORDS.STATIC, KEYWORDS.FIELD] }, varTypeExpectedToken],
    tokens,
  );

  const ids = [];
  let currentToken = getNextToken();
  while (currentToken.value !== statementTerminator) {
    testToken(idinentifierExpectedToken, currentToken);
    advanceTokens();
    ids.push(currentToken.value);

    if (getNextToken().value === SYMBOLS.COMMA) {
      advanceTokens();
    }

    currentToken = getNextToken();
  }

  advanceTokens();

  return {
    type: NODE_TYPES.CLASS_VAR_DEC,
    classVarDecType: tokens[0].value,
    varType: {
      value: tokens[1].value,
      type: tokens[1].type,
    },
    ids,
  };
};

const parseClassBlockStatement = () => {
  testToken(blockStatementOpenExpectedToken, getNextTokenAndAdvance());

  const result = [];
  let currentToken = getNextToken();
  while (currentToken.value !== blockStatementClose) {
    testToken(
      {
        type: TOKEN_TYPES.KEYWORD,
        value: [
          KEYWORDS.STATIC,
          KEYWORDS.FIELD,
          KEYWORDS.FUNCTION,
          KEYWORDS.CONSTRUCTOR,
          KEYWORDS.METHOD,
        ],
      },
      currentToken,
    );

    if (currentToken.value === KEYWORDS.STATIC || currentToken.value === KEYWORDS.FIELD) {
      result.push(parseClassVarDec());
    } else if (
      [KEYWORDS.FUNCTION, KEYWORDS.METHOD, KEYWORDS.CONSTRUCTOR].includes(currentToken.value)
    ) {
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
  _currenTokenIndex = 0;
  _tokens = tkns;

  return parseClass();
};
