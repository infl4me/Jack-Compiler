export const ARITHMETIC_COMMANDS = {
  add: 'add',
  sub: 'sub',
  or: 'or',
  and: 'and',
  eq: 'eq',
  lt: 'lt',
  gt: 'gt',
  neg: 'neg',
  not: 'not',
};

export const SEGMENTS = {
  LOCAL: 'local',
  ARGUMENT: 'argument',
  CONSTANT: 'constant',
  TEMP: 'temp',
};

export const writeFunction = (name, localVarCount) => {
  return `function ${name} ${localVarCount}`;
};

export const writeCall = (name, argsCount) => {
  return `call ${name} ${argsCount}`;
};

export const writePush = (segment, index) => {
  return `push ${segment} ${index}`;
};

export const writePop = (segment, index) => {
  return `pop ${segment} ${index}`;
};

export const writeArithmetic = (command) => {
  return command;
};

export const writeReturn = () => {
  return 'return';
};

export const writeIf = (label) => {
  return `if-goto ${label}`;
};

export const writeLabel = (label) => {
  return `label ${label}`;
};

export const writeGoto = (label) => {
  return `goto ${label}`;
};
