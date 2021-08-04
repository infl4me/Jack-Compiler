import { EXPRESSION_TYPES, NODE_TYPES, TOKEN_TYPES } from './constants';

// renders non-fomatted (uglified) xml
// if you want to format it just use 3rd party services
const renderXmlTree = (tree) => {
  if (tree.children) {
    return `<${tree.name}>${tree.children.map((child) => renderXmlTree(child)).join('')}</${
      tree.name
    }>`;
  }

  return `<${tree.name}> ${tree.value} </${tree.name}>`;
};

const renderSeparatedList = (data) => {
  return data.reduce(
    (acc, item, idx, arr) =>
      arr.length - 1 === idx ? [...acc, item] : [...acc, item, { name: 'symbol', value: ',' }],
    [],
  );
};

const renderSubroutineCall = (term) => {
  return {
    name: 'term',
    children: [
      { name: 'identifier', value: term.classId },
      term.subroutineId && { name: 'symbol', value: '.' },
      term.subroutineId && { name: 'identifier', value: term.subroutineId },
      { name: 'symbol', value: '(' },
      {
        name: 'expressionList',
        children: renderSeparatedList(term.arguments.map(renderExpression)),
      },
      { name: 'symbol', value: ')' },
    ].filter(Boolean),
  };
};

const renderTerm = (term) => {
  if (term.type === NODE_TYPES.EXPRESSION) {
    return { name: 'term', children: [renderExpression(term)] };
  }

  switch (term.type) {
    case NODE_TYPES.IDENTIFIER:
      return { name: 'term', children: [{ name: 'identifier', value: term.id }] };
    case NODE_TYPES.CONSTANT: {
      const map = {
        [TOKEN_TYPES.STRING_CONST]: 'stringConstant',
        [TOKEN_TYPES.INT_CONST]: 'integerConstant',
        [TOKEN_TYPES.KEYWORD]: 'keyword',
      };
      const name = map[term.constantType];
      if (!name) {
        throw new Error(`Unknown constant type: ${term.constantType}`);
      }

      return { name: 'term', children: [{ name, value: term.value }] };
    }
    case NODE_TYPES.SUBROUTINE_CALL:
      return renderSubroutineCall(term);
    case NODE_TYPES.ARRAY_ACCESS:
      return {
        name: 'term',
        children: [
          { name: 'identifier', value: term.id },
          { name: 'symbol', value: '[' },
          renderExpression(term.index),
          { name: 'symbol', value: ']' },
        ],
      };

    default:
      throw new Error(`Unknown term type: "${term.type}"`);
  }
};
const renderExpression = (data) => {
  switch (data.expressionType) {
    case EXPRESSION_TYPES.BINARY_EXPERSSION:
      return {
        name: 'expression',
        children: [
          renderTerm(data.left.term),
          { name: 'symbol', value: data.op },
          renderTerm(data.right.term),
        ],
      };
    case EXPRESSION_TYPES.UNARY_EXPERSSION:
      return {
        name: 'expression',
        children: [
          {
            name: 'term',
            children: [{ name: 'symbol', value: data.op }, renderTerm(data.term)],
          },
        ],
      };
    case EXPRESSION_TYPES.SINGLE_TERM:
      return {
        name: 'expression',
        children: [renderTerm(data.term)],
      };

    default:
      throw new Error(`Unknown expression type: "${data.type}"`);
  }
};

const renderVarType = (varType) => {
  return {
    name: TOKEN_TYPES.KEYWORD === varType.type ? 'keyword' : 'identifier',
    value: varType.value,
  };
};

const renderVar = (data) => {
  return {
    name: 'varDec',
    children: [
      { name: 'keyword', value: 'var' },
      renderVarType(data.varType),
      ...renderSeparatedList(data.ids.map((id) => ({ name: 'identifier', value: id }))),
      { name: 'symbol', value: ';' },
    ],
  };
};
const renderLet = (data) => {
  return {
    name: 'letStatement',
    children: [
      { name: 'keyword', value: 'let' },
      { name: 'identifier', value: data.varId },

      data.arrayIndex && { name: 'symbol', value: '[' },
      data.arrayIndex && renderExpression(data.arrayIndex),
      data.arrayIndex && { name: 'symbol', value: ']' },

      { name: 'symbol', value: '=' },
      renderExpression(data.initValue),
      { name: 'symbol', value: ';' },
    ].filter(Boolean),
  };
};
const renderDo = (data) => {
  return {
    name: 'doStatement',
    children: [
      { name: 'keyword', value: 'do' },
      ...renderSubroutineCall(data.subroutineCall).children,
      { name: 'symbol', value: ';' },
    ],
  };
};
const renderReturn = (data) => {
  return {
    name: 'returnStatement',
    children: [
      { name: 'keyword', value: 'return' },
      data.value && renderExpression(data.value),
      { name: 'symbol', value: ';' },
    ].filter(Boolean),
  };
};
const renderIf = (data) => {
  return {
    name: 'ifStatement',
    children: [
      { name: 'keyword', value: 'if' },
      { name: 'symbol', value: '(' },
      renderExpression(data.test),
      { name: 'symbol', value: ')' },
      { name: 'symbol', value: '{' },
      renderBlockStatement(data.body),
      { name: 'symbol', value: '}' },
      data.elseBody && { name: 'keyword', value: 'else' },
      data.elseBody && { name: 'symbol', value: '{' },
      data.elseBody && renderBlockStatement(data.elseBody),
      data.elseBody && { name: 'symbol', value: '}' },
    ].filter(Boolean),
  };
};
const renderWhile = (data) => {
  return {
    name: 'whileStatement',
    children: [
      { name: 'keyword', value: 'while' },
      { name: 'symbol', value: '(' },
      renderExpression(data.test),
      { name: 'symbol', value: ')' },
      { name: 'symbol', value: '{' },
      renderBlockStatement(data.body),
      { name: 'symbol', value: '}' },
    ],
  };
};
const renderBlockStatement = (data) => {
  const map = {
    [NODE_TYPES.LET]: renderLet,
    [NODE_TYPES.IF]: renderIf,
    [NODE_TYPES.WHILE]: renderWhile,
    [NODE_TYPES.DO]: renderDo,
    [NODE_TYPES.RETURN]: renderReturn,
  };

  return {
    name: 'statements',
    children: data.map((node) => {
      const render = map[node.type];
      if (!render) {
        throw new Error(`[renderBlockStatement] No render for: ${node.type}`);
      }

      return render(node);
    }),
  };
};

const renderSubroutineBlockStatement = (data) => {
  return {
    name: 'subroutineBody',
    children: [
      { name: 'symbol', value: '{' },
      ...data.filter((item) => item.type === NODE_TYPES.VAR).map((item) => renderVar(item)),
      renderBlockStatement(data.filter((item) => item.type !== NODE_TYPES.VAR)),
      { name: 'symbol', value: '}' },
    ].filter(Boolean),
  };
};

const renderClassVarDec = (data) => {
  return {
    name: 'classVarDec',
    children: [
      { name: 'keyword', value: data.classVarDecType },
      renderVarType(data.varType),
      ...data.ids.map((id) => ({ name: 'identifier', value: id })),
      { name: 'symbol', value: ';' },
    ],
  };
};
const renderClassSubroutine = (data) => {
  return {
    name: 'subroutineDec',
    children: [
      { name: 'keyword', value: data.subroutineType },
      {
        name: TOKEN_TYPES.KEYWORD === data.returnType.type ? 'keyword' : 'identifier',
        value: data.returnType.value,
      },
      { name: 'identifier', value: data.id },
      { name: 'symbol', value: '(' },
      { name: 'parameterList', children: data.parameters.map((param) => param) },
      { name: 'symbol', value: ')' },
      renderSubroutineBlockStatement(data.body),
    ],
  };
};
const renderClass = (data) => {
  const map = {
    [NODE_TYPES.CLASS_VAR_DEC]: renderClassVarDec,
    [NODE_TYPES.CLASS_SUBROUTINE]: renderClassSubroutine,
  };

  return renderXmlTree({
    name: 'class',
    children: [
      { name: 'keyword', value: 'class' },
      { name: 'identifier', value: data.id },
      { name: 'symbol', value: '{' },
      ...data.body.map((node) => map[node.type](node)),
      { name: 'symbol', value: '}' },
    ],
  });
};

export const renderXml = (tree) => {
  return renderClass(tree);
};
