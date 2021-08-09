import { EXPRESSION_TYPES, KEYWORDS, NODE_TYPES, TOKEN_TYPES } from '../constants';
import {
  initVarTable,
  lookupVariable,
  resetVarTables,
  VAR_KINDS,
  VAR_TABLE_TYPES,
} from './varTable';
import * as vmWriter from './vmWriter';

const throwComingSoon = () => {
  throw new Error('???');
};

let _vmCode = [];
const insertVmInstruction = (instruction) => {
  _vmCode.push(instruction);
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
    case NODE_TYPES.IDENTIFIER:
      throwComingSoon();
      break;
    case NODE_TYPES.CONSTANT: {
      if (term.constantType === TOKEN_TYPES.INT_CONST) {
        insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, term.value));
      } else {
        throwComingSoon();
      }
      break;
    }
    case NODE_TYPES.SUBROUTINE_CALL:
      compileSubroutineCall(term);
      break;
    // case NODE_TYPES.ARRAY_ACCESS:
    //   return {
    //     name: 'term',
    //     children: [
    //       { name: 'identifier', value: term.id },
    //       { name: 'symbol', value: '[' },
    //       renderExpression(term.index),
    //       { name: 'symbol', value: ']' },
    //     ],
    //   };

    default:
      throw new Error(`Unknown term type: "${term.type}"`);
  }
};
const compileOperator = (op) => {
  const OP_TO_ARITHMETIC_COMMAND_MAP = {
    '+': vmWriter.ARITHMETIC_COMMANDS.add,
  };
  const simpleCommand = OP_TO_ARITHMETIC_COMMAND_MAP[op];
  if (simpleCommand) {
    insertVmInstruction(vmWriter.writeArithmetic(simpleCommand));
    return;
  }

  switch (op) {
    case '*':
      insertVmInstruction(vmWriter.writeCall('Math.Multiply', 2));
      break;

    default:
      throw new Error(`Unknown operator: "${op}"`);
  }
};
const compileExpression = (data) => {
  switch (data.expressionType) {
    case EXPRESSION_TYPES.BINARY_EXPERSSION:
      compileTerm(data.left.term);
      compileTerm(data.right.term);
      compileOperator(data.op);
      break;
    case EXPRESSION_TYPES.UNARY_EXPERSSION:
      compileTerm(data.term);
      compileOperator(data.op);
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

  const varScope = lookupVariable(data.varId);

  insertVmInstruction(vmWriter.writePop(varScope.kind, varScope.index));
};

const compileIf = () => {};
const compileWhile = () => {};

const compileDo = (data) => {
  compileSubroutineCall(data.subroutineCall);
};

const compileReturn = () => {};

const compileSubroutine = (data) => {
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

  insertVmInstruction(vmWriter.writeFunction(data.id, localVars.length));

  const map = {
    [NODE_TYPES.LET]: compileLet,
    [NODE_TYPES.IF]: compileIf,
    [NODE_TYPES.WHILE]: compileWhile,
    [NODE_TYPES.DO]: compileDo,
    [NODE_TYPES.RETURN]: compileReturn,
  };

  data.body
    .filter((item) => item.type !== NODE_TYPES.VAR)
    .forEach((node) => {
      if (!map[node.type]) {
        throw new Error(`Unknown type: ${node.type}`);
      }

      map[node.type](node);
    });
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
      compileSubroutine(subroutine);
    });
};

export const compile = (tree) => {
  resetVarTables();

  _vmCode = [];

  compileClass(tree);

  return _vmCode.join('\n');
};
