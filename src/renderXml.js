import { NODE_TYPES, TOKEN_TYPES } from './constants';

const renderXmlTree = (tree) => {
  if (tree.children) {
    return `<${tree.name}>${tree.children.map((child) => renderXmlTree(child)).join('')}</${
      tree.name
    }>`;
  }

  return `<${tree.name}> ${tree.value} </${tree.name}>`;
};

const renderExpression = (data) => {
  return {
    name: 'expression',
    children: [{ name: 'term', children: [{ name: 'identifier', value: data.term.id }] }],
  };
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
      ...data.ids.map((id) => ({ name: 'identifier', value: id })),
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
      { name: 'symbol', value: '=' },
      renderExpression(data.initValue),
      { name: 'symbol', value: ';' },
    ],
  };
};
const renderDo = (data) => {
  return {
    name: 'doStatement',
    children: [
      { name: 'keyword', value: 'do' },
      { name: 'identifier', value: data.subroutineCall.classId },
      { name: 'symbol', value: '.' },
      { name: 'identifier', value: data.subroutineCall.subroutineId },
      { name: 'symbol', value: '(' },
      {
        name: 'expressionList',
        children: data.subroutineCall.arguments.map((arg) => renderExpression(arg)),
      },
      { name: 'symbol', value: ')' },
      { name: 'symbol', value: ';' },
    ],
  };
};
const renderReturn = (data) => {
  return {
    name: 'returnStatement',
    children: [
      { name: 'keyword', value: 'return' },
      data.value ? renderExpression(data.value) : null,
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
      { name: 'keyword', value: 'else' },
      { name: 'symbol', value: '{' },
      renderBlockStatement(data.elseBody),
      { name: 'symbol', value: '}' },
    ],
  };
};
const renderBlockStatement = (data) => {
  const map = {
    [NODE_TYPES.LET]: renderLet,
    [NODE_TYPES.IF]: renderIf,
    // [NODE_TYPES.WHILE]: parseWhile,
    [NODE_TYPES.DO]: renderDo,
    [NODE_TYPES.RETURN]: renderReturn,
  };

  return {
    name: 'statements',
    children: data.map((node) => map[node.type](node)),
  };
};

const renderSubroutineBlockStatement = (data) => {
  const hasVarDec = data[0]?.type === NODE_TYPES.VAR;
  const statements = hasVarDec ? data.slice(1) : data;
  const varDecRendered = hasVarDec ? renderVar(data[0]) : null;

  return {
    name: 'subroutineBody',
    children: [
      { name: 'symbol', value: '{' },
      varDecRendered,
      renderBlockStatement(statements),
      { name: 'symbol', value: '}' },
    ].filter(Boolean),
  };
};

const renderClassVarDec = (data) => {
  return {
    name: 'classVarDec',
    children: [
      { name: 'keyword', value: 'static' },
      { name: 'keyword', value: data.varType.value },
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
      { name: 'keyword', value: data.returnType.value },
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
