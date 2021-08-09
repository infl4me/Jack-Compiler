export const VAR_KINDS = {
  ARGUMENT: 'argument',
  LOCAL: 'local',
  FIELD: 'field',
  STATIC: 'static',
};

export const VAR_TABLE_TYPES = {
  CLASS: 'class',
  SUBROUTINE: 'subroutine',
};
let _classVarTable = {};
let _subroutineVarTable = {};

export const resetVarTables = () => {
  _classVarTable = {};
  _subroutineVarTable = {};
};

export const initVarTable = (tableType, data) => {
  const newTable = data.reduce((acc, item) => {
    let index = 0;

    item.vars.forEach((varData) => {
      varData.ids.forEach((id) => {
        if (acc[id]) {
          throw new Error(`Variable already declared: ${id}`);
        }

        acc[id] = {
          name: id,
          type: varData.varType.value,
          kind: item.kind,
          index,
        };
      });

      index += 1;
    });

    return acc;
  }, {});

  if (tableType === VAR_TABLE_TYPES.CLASS) {
    _classVarTable = newTable;
  } else if (tableType === VAR_TABLE_TYPES.SUBROUTINE) {
    _subroutineVarTable = newTable;
  } else {
    throw new Error(`Unknown tableType: ${tableType}`);
  }
};

export const lookupVariable = (name) => {
  if (_subroutineVarTable[name]) {
    return _subroutineVarTable[name];
  }
  if (_classVarTable[name]) {
    return _classVarTable[name];
  }

  throw new Error(`Undefined variable: ${name}`);
};