import { EXPRESSION_TYPES, KEYWORDS, NODE_TYPES, SYMBOLS, TOKEN_TYPES } from '../constants';
import {
  initVarTable,
  lookupVariable,
  resetVarTables,
  VAR_KINDS,
  VAR_TABLE_TYPES,
} from './varTable';
import * as vmWriter from './vmWriter';

let labelCounter = 0;
const generateUniqLabel = (name) => {
  labelCounter += 1;

  return `${name}_${labelCounter}`;
};

const throwComingSoon = () => {
  throw new Error('???');
};

let _vmCode = [];
const insertVmInstruction = (instruction) => {
  _vmCode.push(instruction);
};

const compileWriteVariable = (id) => {
  const { kind, index } = lookupVariable(id);
  insertVmInstruction(vmWriter.writePop(kind, index));
};
const compileReadVariable = (id) => {
  const { kind, index } = lookupVariable(id);
  insertVmInstruction(vmWriter.writePush(kind, index));
};

const compileSubroutineCall = (data) => {
  data.arguments.forEach(compileExpression);

  if (!data.classId) {
    throwComingSoon();
  }

  const name = `${data.classId}.${data.subroutineId}`;
  insertVmInstruction(vmWriter.writeCall(name, data.arguments.length));
};
const compileTerm = (term) => {
  if (term.type === NODE_TYPES.EXPRESSION) {
    compileExpression(term);
    return;
  }

  switch (term.type) {
    case NODE_TYPES.IDENTIFIER: {
      compileReadVariable(term.id);
      break;
    }
    case NODE_TYPES.CONSTANT: {
      if (term.constantType === TOKEN_TYPES.INT_CONST) {
        insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, term.value));
      } else if (term.constantType === TOKEN_TYPES.KEYWORD) {
        switch (term.value) {
          case KEYWORDS.TRUE:
            insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, 0));
            insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.not));
            break;
          case KEYWORDS.FALSE || KEYWORDS.NULL:
            insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, 0));
            break;

          default:
            throw new Error(`Don't know how to handle: ${term.value}`);
        }
      } else {
        throwComingSoon();
      }
      break;
    }
    case NODE_TYPES.SUBROUTINE_CALL:
      compileSubroutineCall(term);
      break;
    case NODE_TYPES.ARRAY_ACCESS:
      throwComingSoon();
      break;

    default:
      throw new Error(`Unknown term type: "${term.type}"`);
  }
};
const compileOperator = (op, expressionType) => {
  const OP_TO_ARITHMETIC_COMMAND_MAP = {
    [SYMBOLS.PLUS]: vmWriter.ARITHMETIC_COMMANDS.add,
    [SYMBOLS.MORE_THAN]: vmWriter.ARITHMETIC_COMMANDS.gt,
    [SYMBOLS.LESS_THAN]: vmWriter.ARITHMETIC_COMMANDS.lt,
    [SYMBOLS.EQUAL]: vmWriter.ARITHMETIC_COMMANDS.eq,
    [SYMBOLS.VBAR]: vmWriter.ARITHMETIC_COMMANDS.or,
    [SYMBOLS.AMPERSAND]: vmWriter.ARITHMETIC_COMMANDS.and,
    [SYMBOLS.NOT]: vmWriter.ARITHMETIC_COMMANDS.not,
  };
  const simpleCommand = OP_TO_ARITHMETIC_COMMAND_MAP[op];
  if (simpleCommand) {
    insertVmInstruction(vmWriter.writeArithmetic(simpleCommand));
    return;
  }

  switch (op) {
    case '*':
      insertVmInstruction(vmWriter.writeCall('Math.multiply', 2));
      break;
    case '-': {
      if (expressionType === EXPRESSION_TYPES.UNARY_EXPERSSION) {
        insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.not));
      } else if (expressionType === EXPRESSION_TYPES.BINARY_EXPERSSION) {
        insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.sub));
      } else {
        throw new Error(`Invalid expression`);
      }
      break;
    }

    default:
      throw new Error(`Unknown operator: "${op}"`);
  }
};
const compileExpression = (data) => {
  switch (data.expressionType) {
    case EXPRESSION_TYPES.BINARY_EXPERSSION:
      compileTerm(data.left.term);
      compileTerm(data.right.term);
      compileOperator(data.op, EXPRESSION_TYPES.BINARY_EXPERSSION);
      break;
    case EXPRESSION_TYPES.UNARY_EXPERSSION:
      compileTerm(data.term);
      compileOperator(data.op, EXPRESSION_TYPES.UNARY_EXPERSSION);
      break;
    case EXPRESSION_TYPES.SINGLE_TERM:
      compileTerm(data.term);
      break;

    default:
      throw new Error(`Unknown expression type: "${data.type}"`);
  }
};

const compileLet = (data) => {
  compileExpression(data.initValue);

  compileWriteVariable(data.varId);
};

const compileIf = (data) => {
  compileExpression(data.test);
  insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.not));

  const l1 = generateUniqLabel('ELSE');
  const l2 = generateUniqLabel('EXIT_IF');

  insertVmInstruction(vmWriter.writeIf(l1));
  compileBlockStatement(data.body);
  insertVmInstruction(vmWriter.writeGoto(l2));
  insertVmInstruction(vmWriter.writeLabel(l1));
  if (data.elseBody) compileBlockStatement(data.elseBody);
  insertVmInstruction(vmWriter.writeLabel(l2));
};
const compileWhile = (data) => {
  const l1 = generateUniqLabel('WHILE');
  const l2 = generateUniqLabel('EXIT_WHILE');

  insertVmInstruction(vmWriter.writeLabel(l1));

  compileExpression(data.test);
  insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.not));

  insertVmInstruction(vmWriter.writeIf(l2));
  compileBlockStatement(data.body);
  insertVmInstruction(vmWriter.writeGoto(l1));
  insertVmInstruction(vmWriter.writeLabel(l2));
};

const compileDo = (data) => {
  compileSubroutineCall(data.subroutineCall);
  insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.TEMP, 0));
};

const compileReturn = (data) => {
  if (data.value) compileExpression(data.value);
  else insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, 0));

  insertVmInstruction(vmWriter.writeReturn());
};

const compileBlockStatement = (data) => {
  const map = {
    [NODE_TYPES.LET]: compileLet,
    [NODE_TYPES.IF]: compileIf,
    [NODE_TYPES.WHILE]: compileWhile,
    [NODE_TYPES.DO]: compileDo,
    [NODE_TYPES.RETURN]: compileReturn,
  };

  data.forEach((node) => {
    if (!map[node.type]) {
      throw new Error(`Unknown type: ${node.type}`);
    }

    map[node.type](node);
  });
};

const compileSubroutine = (classId, data) => {
  const localVars = data.body.filter((item) => item.type === NODE_TYPES.VAR);

  initVarTable(VAR_TABLE_TYPES.SUBROUTINE, [
    {
      kind: VAR_KINDS.ARGUMENT,
      vars: data.parameters,
    },
    {
      kind: VAR_KINDS.LOCAL,
      vars: localVars,
    },
  ]);

  const localVarCount = localVars.reduce((acc, localVar) => {
    return acc + localVar.ids.length;
  }, 0);
  insertVmInstruction(vmWriter.writeFunction(`${classId}.${data.id}`, localVarCount));

  compileBlockStatement(data.body.filter((item) => item.type !== NODE_TYPES.VAR));
};

const compileClass = (data) => {
  initVarTable(VAR_TABLE_TYPES.CLASS, [
    {
      kind: VAR_KINDS.STATIC,
      vars: data.body.filter(
        (node) =>
          node.type === NODE_TYPES.CLASS_VAR_DEC && node.classVarDecType === KEYWORDS.STATIC,
      ),
    },
    {
      kind: VAR_KINDS.FIELD,
      vars: data.body.filter(
        (node) => node.type === NODE_TYPES.CLASS_VAR_DEC && node.classVarDecType === KEYWORDS.FIELD,
      ),
    },
  ]);

  data.body
    .filter((node) => node.type === NODE_TYPES.CLASS_SUBROUTINE)
    .forEach((subroutine) => {
      compileSubroutine(data.id, subroutine);
    });
};

export const compile = (tree) => {
  resetVarTables();

  _vmCode = [];

  compileClass(tree);

  return _vmCode.join('\n');
};
