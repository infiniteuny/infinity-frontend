import {
  getGridBooleanOperators,
  getGridDateOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';

export const StringOperators = {
  contains: getGridStringOperators().find((operator) => operator.value === 'contains')!,
};

export const DateOperators = {
  is: getGridDateOperators().find((operator) => operator.value === 'is')!,
  not: getGridDateOperators().find((operator) => operator.value === 'not')!,
  after: getGridDateOperators().find((operator) => operator.value === 'after')!,
  onOrAfter: getGridDateOperators().find((operator) => operator.value === 'onOrAfter')!,
  before: getGridDateOperators().find((operator) => operator.value === 'before')!,
  onOrBefore: getGridDateOperators().find((operator) => operator.value === 'onOrBefore')!,
  isEmpty: getGridDateOperators().find((operator) => operator.value === 'isEmpty')!,
  isNotEmpty: getGridDateOperators().find((operator) => operator.value === 'isNotEmpty')!,
};

export const BooleanOperators = {
  is: getGridBooleanOperators().find((operator) => operator.value === 'is')!,
};
