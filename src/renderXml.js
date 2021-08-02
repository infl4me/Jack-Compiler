import { NODE_TYPES } from './constants';

const renderXmlTree = (tree) => {
  if (tree.children) {
    return `<${tree.name}>${tree.children.map((child) => renderXmlTree(child)).join('')}</${
      tree.name
    }>`;
  }

  return `<${tree.name}> ${tree.value} </${tree.name}>`;
};

const renderClassVarDec = (data) => {
  return {
    name: 'classVarDec',
    children: [
      { name: 'keyword', value: 'static' },
      { name: 'keyword', value: data.varType.value },
      ...data.ids.map((id) => ({ name: 'identifier', value: id.value })),
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
      { name: 'symbol', value: ')' },
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
      ...data.body.map((node) => {
        return map[node.type](node);
      }),
    ],
  });
};

export const renderXml = (tree) => {
  return renderClass(tree);
};
