import { EXPRESSION_TYPES, KEYWORDS, NODE_TYPES, SYMBOLS, TOKEN_TYPES } from '../constants';
import {
  getFieldKindVariables,
  initVarTable,
  lookupVariable,
  resetVarTables,
  VAR_KINDS,
  VAR_TABLE_TYPES,
} from './varTable';
import * as vmWriter from './vmWriter';

// eslint-disable-next-line no-console
const logError = (...args) => console.error(...args);

const VAR_KIND_TO_SEGMENT_MAP = {
  [VAR_KINDS.LOCAL]: vmWriter.SEGMENTS.LOCAL,
  [VAR_KINDS.ARGUMENT]: vmWriter.SEGMENTS.ARGUMENT,
  [VAR_KINDS.FIELD]: vmWriter.SEGMENTS.THIS,
  [VAR_KINDS.STATIC]: vmWriter.SEGMENTS.STATIC,
};
const mapVarKindToSegment = (varKind) => {
  const segment = VAR_KIND_TO_SEGMENT_MAP[varKind];
  if (!segment) {
    logError(`[mapVarKindToSegment] Unknown var kind: "${varKind}"`);
  }

  return segment;
};

let labelCounter = 0;
const generateUniqLabel = (name) => {
  labelCounter += 1;

  return `${name}_${labelCounter}`;
};

let _className;
let _vmCode = [];
const insertVmInstruction = (instruction) => {
  _vmCode.push(instruction);
};

const compilePushVariable = (id) => {
  const variable = lookupVariable(id);
  if (!variable) {
    throw new Error(`Undefined variable: "${id}"`);
  }

  insertVmInstruction(vmWriter.writePush(mapVarKindToSegment(variable.kind), variable.index));
};

const compileSubroutineCall = (data) => {
  const objectVariable = lookupVariable(data.classId);
  // if variable is found then it's an object
  // and we need to pass it as first argument
  if (objectVariable) {
    insertVmInstruction(
      vmWriter.writePush(mapVarKindToSegment(objectVariable.kind), objectVariable.index),
    );
  }

  const isMethodCall = !data.subroutineId;
  // pass this as an argument
  if (isMethodCall) {
    insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.POINTER, 0));
  }

  data.arguments.forEach(compileExpression);

  const name = isMethodCall
    ? `${_className}.${data.classId}`
    : `${objectVariable ? objectVariable.type : data.classId}.${data.subroutineId}`;
  insertVmInstruction(
    vmWriter.writeCall(
      name,
      objectVariable || isMethodCall ? data.arguments.length + 1 : data.arguments.length,
    ),
  );
};
const compileStringConst = (string) => {
  insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, string.length));
  insertVmInstruction(vmWriter.writeCall('String.new', 1));

  for (let i = 0; i < string.length; i += 1) {
    const currentSymbol = string[i];

    insertVmInstruction(
      vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, currentSymbol.charCodeAt(0)),
    );
    insertVmInstruction(vmWriter.writeCall('String.appendChar', 2));
  }
};
const compileTerm = (term) => {
  if (term.type === NODE_TYPES.EXPRESSION) {
    compileExpression(term);
    return;
  }

  switch (term.type) {
    case NODE_TYPES.IDENTIFIER: {
      compilePushVariable(term.id);
      break;
    }
    case NODE_TYPES.CONSTANT: {
      switch (term.constantType) {
        case TOKEN_TYPES.INT_CONST:
          insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, term.value));
          break;
        case TOKEN_TYPES.STRING_CONST:
          compileStringConst(term.value);
          break;
        case TOKEN_TYPES.KEYWORD:
          switch (term.value) {
            case KEYWORDS.TRUE:
              insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, 0));
              insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.not));
              break;
            case KEYWORDS.FALSE:
            case KEYWORDS.NULL:
              insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, 0));
              break;
            case KEYWORDS.THIS:
              insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.POINTER, 0));
              break;

            default:
              throw new Error(`Unexpected keyword: ${term.value}`);
          }
          break;

        default:
          throw new Error(`Unknown constantType: "${term.constantType}"`);
      }
      break;
    }
    case NODE_TYPES.SUBROUTINE_CALL:
      compileSubroutineCall(term);
      break;
    case NODE_TYPES.ARRAY_ACCESS: {
      const variable = lookupVariable(term.id);
      insertVmInstruction(vmWriter.writePush(mapVarKindToSegment(variable.kind), variable.index));
      compileExpression(term.index);
      insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.add));
      insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.POINTER, 1));
      insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.THAT, 0));
      break;
    }

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
    case '/':
      insertVmInstruction(vmWriter.writeCall('Math.divide', 2));
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
  if (data.arrayIndex) {
    const variable = lookupVariable(data.varId);
    insertVmInstruction(vmWriter.writePush(mapVarKindToSegment(variable.kind), variable.index));
    compileExpression(data.arrayIndex);
    insertVmInstruction(vmWriter.writeArithmetic(vmWriter.ARITHMETIC_COMMANDS.add));
    compileExpression(data.initValue);
    insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.TEMP, 0));
    insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.POINTER, 1));
    insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.TEMP, 0));
    insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.THAT, 0));
    return;
  }

  compileExpression(data.initValue);

  const variable = lookupVariable(data.varId);
  if (!variable) {
    throw new Error(`Undefined variable: "${data.varId}"`);
  }

  insertVmInstruction(vmWriter.writePop(mapVarKindToSegment(variable.kind), variable.index));
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

const compileSubroutine = (data) => {
  const localVars = data.body.filter((item) => item.type === NODE_TYPES.VAR);

  const argumentVars =
    data.subroutineType === KEYWORDS.METHOD
      ? [
          {
            varType: {
              value: _className,
              type: TOKEN_TYPES.KEYWORD,
            },
            id: KEYWORDS.THIS,
          },
          ...data.parameters,
        ]
      : data.parameters;

  initVarTable(VAR_TABLE_TYPES.SUBROUTINE, [
    {
      kind: VAR_KINDS.ARGUMENT,
      vars: argumentVars,
    },
    {
      kind: VAR_KINDS.LOCAL,
      vars: localVars,
    },
  ]);

  const localVarCount = localVars.reduce((acc, localVar) => {
    return acc + localVar.ids.length;
  }, 0);
  insertVmInstruction(vmWriter.writeFunction(`${_className}.${data.id}`, localVarCount));

  if (data.subroutineType === KEYWORDS.CONSTRUCTOR) {
    const fieldVars = getFieldKindVariables();
    insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.CONSTANT, fieldVars.length));
    insertVmInstruction(vmWriter.writeCall('Memory.alloc', 1));
    insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.POINTER, 0));
  }

  if (data.subroutineType === KEYWORDS.METHOD) {
    insertVmInstruction(vmWriter.writePush(vmWriter.SEGMENTS.ARGUMENT, 0));
    insertVmInstruction(vmWriter.writePop(vmWriter.SEGMENTS.POINTER, 0));
  }

  compileBlockStatement(data.body.filter((item) => item.type !== NODE_TYPES.VAR));
};

const compileClass = (data) => {
  _className = data.id;

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
